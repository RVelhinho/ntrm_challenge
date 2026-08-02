import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { GetApiV1NutritionistsNutritionistIdAppointmentRequests200ItemsItem } from '../../../api/generated/models';
import { AppointmentCard } from './AppointmentCard';

const request = {
  id: 1,
  nutritionist_id: 2,
  guest: { id: 3, name: 'Guest', email: 'guest@example.com' },
  service: { id: 4, name: 'Follow-up' },
  starts_at: '2026-08-03T10:00:00Z',
  ends_at: '2026-08-03T10:30:00Z',
  status: 'pending',
  answered_at: null,
} satisfies GetApiV1NutritionistsNutritionistIdAppointmentRequests200ItemsItem;

describe('AppointmentCard', () => {
  it('displays guest information and exposes decision actions in a dialog', async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    render(
      <AppointmentCard
        request={request}
        accepting={false}
        rejecting={false}
        onAccept={onAccept}
        onReject={onReject}
      />,
    );

    expect(screen.getByText('Follow-up')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Answer request' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Accept request' }));
    await userEvent.click(screen.getByRole('button', { name: 'Answer request' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reject request' }));
    expect(onAccept).toHaveBeenCalledOnce();
    expect(onReject).toHaveBeenCalledOnce();
  });
});
