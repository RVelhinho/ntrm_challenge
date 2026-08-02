import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../app/providers';
import { queryClient } from '../../app/query-client';
import { server } from '../../test/server';
import { AppointmentsPage } from './AppointmentsPage';

const { toastError, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: { error: toastError, success: toastSuccess },
}));

const response = {
  items: [
    {
      id: 1,
      guest: { id: 1, name: 'Guest User', email: 'guest@example.com' },
      nutritionist_id: 1,
      service: { id: 2, name: 'Initial consultation' },
      starts_at: '2030-01-01T10:00:00.000Z',
      ends_at: '2030-01-01T11:00:00.000Z',
      status: 'pending',
      answered_at: null,
    },
    {
      id: 2,
      guest: { id: 2, name: 'Another Guest', email: 'another@example.com' },
      nutritionist_id: 1,
      service: { id: 2, name: 'Initial consultation' },
      starts_at: '2030-01-02T10:00:00.000Z',
      ends_at: '2030-01-02T11:00:00.000Z',
      status: 'pending',
      answered_at: null,
    },
  ],
  meta: { page: 1, per_page: 50, total_count: 2, total_pages: 1 },
};

describe('AppointmentsPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    queryClient.clear();
    toastError.mockReset();
    toastSuccess.mockReset();
    server.use(
      http.get('*/api/v1/nutritionists/1/appointment_requests', () => HttpResponse.json(response)),
      http.patch('*/api/v1/appointment_requests/:id/accept', () =>
        HttpResponse.json({}, { status: 200 }),
      ),
      http.patch('*/api/v1/appointment_requests/:id/reject', () =>
        HttpResponse.json({}, { status: 200 }),
      ),
    );
  });

  it('shows success toasts after accepting and rejecting requests', async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <AppointmentsPage />
      </AppProviders>,
    );

    const answerButtons = await screen.findAllByRole('button', { name: 'Answer request' });
    await user.click(answerButtons[0]);
    await user.click(screen.getByRole('button', { name: 'Accept request' }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        'Appointment accepted. The guest has been notified.',
      );
    });

    await user.click(screen.getAllByRole('button', { name: 'Answer request' })[1]);
    await user.click(screen.getByRole('button', { name: 'Reject request' }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        'Appointment rejected. The guest has been notified.',
      );
    });
  });

  it('filters requests by guest or service', async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <AppointmentsPage />
      </AppProviders>,
    );

    await screen.findByText('Guest User');
    await user.type(screen.getByRole('combobox'), 'another');

    expect(screen.queryByText('Guest User')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Another Guest' })).toBeInTheDocument();
  });
});
