import { useState } from 'react';
import type { GetApiV1AppointmentRequests200DataItem } from '../../../api/generated/models';
import { Button } from '../../../components/shared/ui/Button/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/shared/ui/Dialog/Dialog';
import { Icon, type IconName } from '../../../components/shared/ui/Icon/Icon';
import { Image } from '../../../components/shared/ui/Image/Image';
import { Text } from '../../../components/shared/ui/Text/Text';
import { formatDateTime, formatTime } from '../appointment-date-formatters';
import { useTranslation } from 'react-i18next';
import appointmentHeader from '../../../shared/assets/appointment_header.png';

export function AppointmentCard({
  request,
  accepting,
  rejecting,
  onAccept,
  onReject,
}: {
  request: GetApiV1AppointmentRequests200DataItem;
  accepting: boolean;
  rejecting: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const start = formatDateTime(request.starts_at, i18n.language);
  const end = formatTime(request.ends_at, i18n.language);
  const isPending = request.status === 'pending';
  const date = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(
    new Date(request.starts_at),
  );
  const time = `${new Intl.DateTimeFormat(i18n.language, { timeStyle: 'short' }).format(new Date(request.starts_at))} ${t('requests.to')} ${end}`;

  return (
    <article className="flex min-h-[148px] flex-col rounded-card border border-border bg-surface shadow-card">
      <div className="grid flex-1 grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 px-4 py-4.5">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary-text">
          <Image src={appointmentHeader} alt="" className="w-full object-cover" />
        </div>
        <div className="min-w-0">
          <Text as="h2" size="base" weight="medium" className="truncate leading-5 text-text-strong">
            {request.guest.name}
          </Text>
          <Text size="xs" className="mt-0.5 truncate leading-4">
            {request.service.name}
          </Text>
          <Text size="xs" tone="muted" className="mt-0.5 truncate leading-4">
            {request.nutritionist.name}
          </Text>
          <Text as="span" tone="muted" size="xs" className="mt-2 flex items-center gap-2 leading-4">
            <span className="grid size-6 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-text">
              <Icon name="calendar" width={14} height={14} strokeWidth={1.8} />
            </span>
            <span>{date}</span>
          </Text>
          <Text
            as="span"
            tone="success"
            size="xs"
            weight="medium"
            className="mt-1 flex items-center gap-2 leading-4"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-text">
              <Icon name="clock" width={14} height={14} strokeWidth={1.8} />
            </span>
            <span>{time}</span>
          </Text>
          <span className="sr-only">{start}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        {isPending ? (
          <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
            <div className="flex w-full justify-center">
              <DialogTrigger asChild>
                <Button
                  aria-label={t('requests.answerRequest')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full justify-center px-0 shadow-none"
                  disabled={accepting || rejecting}
                >
                  {t('requests.answerRequest')}
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <div>
                  <DialogTitle className="text-lg text-text-strong">
                    {t('requests.answerRequest')}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm leading-5">
                    {t('requests.answerRequestDescription', { name: request.guest.name })}
                  </DialogDescription>
                </div>
              </DialogHeader>
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="secondary" size="md">
                    {t('common.cancel')}
                  </Button>
                </DialogClose>
                <Button
                  variant="danger"
                  size="md"
                  loading={rejecting}
                  disabled={accepting}
                  onClick={() => {
                    onReject();
                    setAnswerDialogOpen(false);
                  }}
                >
                  {t('requests.rejectRequest')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  loading={accepting}
                  disabled={rejecting}
                  onClick={() => {
                    onAccept();
                    setAnswerDialogOpen(false);
                  }}
                >
                  {t('requests.acceptRequest')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          (() => {
            const status = statusPresentation(request.status, t);
            return (
              <div className="inline-flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-control bg-primary-soft text-primary-text">
                  <Icon name={status.icon} width={14} height={14} strokeWidth={1.8} />
                </span>
                <Text as="span" size="xs" weight="medium" tone={status.tone}>
                  {status.label}
                </Text>
              </div>
            );
          })()
        )}
      </div>
    </article>
  );
}

function statusPresentation(
  status: GetApiV1AppointmentRequests200DataItem['status'],
  t: (key: string) => string,
): { icon: IconName; tone: 'success' | 'danger' | 'muted'; label: string } {
  switch (status) {
    case 'accepted':
      return { icon: 'circle-check', tone: 'success', label: t('requests.acceptedStatus') };
    case 'rejected':
      return { icon: 'circle-x', tone: 'danger', label: t('requests.rejectedStatus') };
    case 'superseded':
      return { icon: 'circle-x', tone: 'muted', label: t('requests.supersededStatus') };
    case 'pending':
      return { icon: 'clock', tone: 'muted', label: t('requests.pending') };
  }
}
