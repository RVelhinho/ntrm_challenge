import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../../app/providers';
import type { GetApiV1Nutritionists200ItemsItemServicesItem } from '../../../api/generated/models';
import { HttpResponse, http } from 'msw';
import { server } from '../../../test/server';
import { AppointmentRequestModal } from './AppointmentRequestModal';
import { parseLocalDateTime } from './appointment-date-time';

const service = {
  id: 2,
  name: 'Initial consultation',
  price_cents: 5500,
  duration_minutes: 60,
  location: 'Braga',
} satisfies GetApiV1Nutritionists200ItemsItemServicesItem;

function renderModal() {
  return render(
    <AppProviders>
      <AppointmentRequestModal
        nutritionistName="Dr. Ana"
        service={service}
        onClose={() => undefined}
        onSuccess={() => undefined}
      />
    </AppProviders>,
  );
}

describe('AppointmentRequestModal', () => {
  afterEach(() => cleanup());

  it('shows schema messages while typing instead of object values', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderModal();

    const submit = screen.getByRole('button', { name: 'Request appointment' });
    expect(submit).toBeEnabled();

    await user.type(screen.getByLabelText('Your name'), 'A');

    expect(screen.getByText('Enter your name.')).toBeInTheDocument();
    expect(screen.queryByText('Enter a valid email address.')).not.toBeInTheDocument();
    expect(screen.queryByText('[object Object]')).not.toBeInTheDocument();
  });

  it('enables submission only after every schema field is valid', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderModal();

    await user.type(screen.getByLabelText('Your name'), 'Guest User');
    await user.type(screen.getByLabelText('Email address'), 'guest@example.com');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().slice(0, 10);
    const dateInput = screen.getByLabelText('Date');
    const timeInput = screen.getByLabelText('Time');
    fireEvent.change(dateInput, { target: { value: date } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request appointment' })).toBeEnabled();
    });
  });

  it('rejects impossible local calendar values instead of rolling them over', () => {
    expect(parseLocalDateTime('2030-02-30', '10:00')).toBeUndefined();
    expect(parseLocalDateTime('2030-02-28', '10:00')).toBeInstanceOf(Date);
  });

  it('rejects a nonexistent local time during the DST transition', () => {
    expect(parseLocalDateTime('2030-03-31', '01:30')).toBeUndefined();
  });

  it('uses the local current date as the date minimum', () => {
    renderModal();
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    expect(screen.getByLabelText('Date')).toHaveAttribute('min', expected);
  });

  it('localizes API errors by stable code instead of displaying the server message', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    server.use(
      http.post('*/api/v1/appointment_requests', () =>
        HttpResponse.json(
          {
            error: {
              code: 'appointment_unavailable',
              message: 'Raw backend wording that must not be shown',
            },
          },
          { status: 409 },
        ),
      ),
    );
    renderModal();
    await user.type(screen.getByLabelText('Your name'), 'Guest User');
    await user.type(screen.getByLabelText('Email address'), 'guest@example.com');
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2030-04-01' } });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '10:00' } });
    await user.click(screen.getByRole('button', { name: 'Request appointment' }));

    expect(
      await screen.findByText('That time is no longer available. Choose another time.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Raw backend wording that must not be shown'),
    ).not.toBeInTheDocument();
  });
});
