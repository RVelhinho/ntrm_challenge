import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../../app/providers';
import type { GetApiV1Nutritionists200ItemsItemServicesItem } from '../../../api/generated/models';
import { AppointmentRequestModal } from './AppointmentRequestModal';

const service = {
  id: 2,
  name: 'Initial consultation',
  price_cents: 5500,
  duration_minutes: 60,
  location: 'Braga',
  latitude: 41.5,
  longitude: -8.4,
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
    expect(submit).toBeDisabled();

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
});
