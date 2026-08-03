import { useForm } from '@tanstack/react-form';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ApiError } from '../../../api/client';
import { usePostApiV1AppointmentRequests } from '../../../api/generated/appointment-requests/appointment-requests';
import type {
  GetApiV1Nutritionists200ItemsItemServicesItem,
  PostApiV1AppointmentRequestsBody,
} from '../../../api/generated/models';
import { Button } from '../../../shared/ui/Button/Button';
import { DateInput } from '../../../shared/ui/DateTimeInput/DateInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui/Dialog/Dialog';
import { Input } from '../../../shared/ui/Input/Input';
import { Text } from '../../../shared/ui/Text/Text';
import { TimeInput } from '../../../shared/ui/DateTimeInput/TimeInput';

function createAppointmentSchema(t: (key: string) => string) {
  return z
    .object({
      guest_name: z.string().trim().min(2, t('appointment.nameError')),
      guest_email: z.string().trim().email(t('appointment.emailError')),
      date: z.string().min(1, t('appointment.dateError')),
      time: z.string().min(1, t('appointment.timeError')),
    })
    .superRefine(({ date, time }, context) => {
      const startsAt = new Date(`${date}T${time}`);
      if (date && time && Number.isNaN(startsAt.getTime())) {
        context.addIssue({
          code: 'custom',
          path: ['time'],
          message: t('appointment.timeError'),
        });
      } else if (date && time && startsAt <= new Date()) {
        context.addIssue({
          code: 'custom',
          path: ['time'],
          message: t('appointment.futureError'),
        });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof createAppointmentSchema>>;

export function AppointmentRequestModal({
  nutritionistName,
  service,
  onClose,
  onSuccess,
}: {
  nutritionistName: string;
  service: GetApiV1Nutritionists200ItemsItemServicesItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const mutation = usePostApiV1AppointmentRequests<ApiError>();
  const schema = createAppointmentSchema(t);
  const defaultValues: FormValues = {
    guest_name: '',
    guest_email: '',
    date: '',
    time: '',
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync({
          data: {
            guest_name: value.guest_name,
            guest_email: value.guest_email.toLowerCase(),
            service_id: service.id,
            starts_at: new Date(`${value.date}T${value.time}`).toISOString(),
          } satisfies PostApiV1AppointmentRequestsBody,
        });
        onSuccess();
        onClose();
      } catch {
        // The mutation state renders the translated/server error message.
      }
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div>
            <DialogTitle asChild>
              <Text as="h2" size="lg" weight="medium" className="text-text-strong">
                {t('appointment.title')}
              </Text>
            </DialogTitle>
            <DialogDescription asChild>
              <Text
                tone="muted"
                size="base"
                className="mt-2 rounded-card bg-primary-soft px-3 py-2"
              >
                {nutritionistName} · {service.name}
              </Text>
            </DialogDescription>
          </div>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="guest_name"
            validators={{
              onChange: z.string().trim().min(2, t('appointment.nameError')),
            }}
          >
            {(field) => (
              <Field
                id="appointment-guest-name"
                label={t('appointment.yourName')}
                error={fieldError(field.state.meta.errors)}
              >
                <Input
                  id="appointment-guest-name"
                  autoComplete="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  invalid={field.state.meta.errors.length > 0}
                  aria-describedby={
                    field.state.meta.errors.length ? 'appointment-guest-name-error' : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
          <form.Field
            name="guest_email"
            validators={{
              onChange: z.string().trim().email(t('appointment.emailError')),
            }}
          >
            {(field) => (
              <Field
                id="appointment-guest-email"
                label={t('appointment.email')}
                error={fieldError(field.state.meta.errors)}
              >
                <Input
                  id="appointment-guest-email"
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  invalid={field.state.meta.errors.length > 0}
                  aria-describedby={
                    field.state.meta.errors.length ? 'appointment-guest-email-error' : undefined
                  }
                />
              </Field>
            )}
          </form.Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="date"
              validators={{
                onChange: z.string().min(1, t('appointment.dateError')),
              }}
            >
              {(field) => (
                <Field
                  id="appointment-date"
                  label={t('appointment.date')}
                  error={fieldError(field.state.meta.errors)}
                >
                  <DateInput
                    id="appointment-date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    invalid={field.state.meta.errors.length > 0}
                    aria-describedby={
                      field.state.meta.errors.length ? 'appointment-date-error' : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
            <form.Field
              name="time"
              validators={{
                onChange: z.string().min(1, t('appointment.timeError')),
              }}
            >
              {(field) => (
                <Field
                  id="appointment-time"
                  label={t('appointment.time')}
                  error={fieldError(field.state.meta.errors)}
                >
                  <TimeInput
                    id="appointment-time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    invalid={field.state.meta.errors.length > 0}
                    aria-describedby={
                      field.state.meta.errors.length ? 'appointment-time-error' : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
          {mutation.isError && (
            <Text tone="danger" size="sm" role="alert">
              {mutation.error?.body?.error?.message ?? t('appointment.error')}
            </Text>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <form.Subscribe selector={(state) => ({ values: state.values })}>
              {({ values }) => (
                <Button
                  type="submit"
                  loading={mutation.isPending}
                  disabled={!schema.safeParse(values).success || mutation.isPending}
                >
                  {t('appointment.submit')}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function fieldError(errors: unknown[]): string | undefined {
  const error = errors[0];
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-text-strong" htmlFor={id}>
        <Text as="span" size="sm" weight="medium">
          {label}
        </Text>
      </label>
      {children}
      {error && (
        <Text id={`${id}-error`} tone="danger" size="sm" role="alert">
          {error}
        </Text>
      )}
    </div>
  );
}
