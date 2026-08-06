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
  data: [
    {
      id: 1,
      guest: { id: 1, name: 'Guest User', email: 'guest@example.com' },
      nutritionist: { id: 10, name: 'Dr. Ana' },
      service: { id: 2, name: 'Initial consultation' },
      starts_at: '2030-01-01T10:00:00.000Z',
      ends_at: '2030-01-01T11:00:00.000Z',
      status: 'pending',
      answered_at: null,
    },
    {
      id: 2,
      guest: { id: 2, name: 'Another Guest', email: 'another@example.com' },
      nutritionist: { id: 11, name: 'Dr. Maria' },
      service: { id: 2, name: 'Initial consultation' },
      starts_at: '2030-01-02T10:00:00.000Z',
      ends_at: '2030-01-02T11:00:00.000Z',
      status: 'pending',
      answered_at: null,
    },
  ],
  page_info: {
    page_size: 20,
    has_next_page: false,
    has_previous_page: false,
    next_cursor: null,
  },
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
      http.get('*/api/v1/appointment_requests', () => HttpResponse.json(response)),
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
      expect(toastSuccess).toHaveBeenCalledWith('Appointment accepted.');
    });

    await user.click(screen.getAllByRole('button', { name: 'Answer request' })[1]);
    await user.click(screen.getByRole('button', { name: 'Reject request' }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Appointment rejected.');
    });
  });

  it('searches all nutritionists on the server and displays the nutritionist name', async () => {
    const user = userEvent.setup();
    let query = '';
    server.use(
      http.get('*/api/v1/appointment_requests', ({ request }) => {
        const url = new URL(request.url);
        query = url.searchParams.get('q') ?? '';
        expect(url.searchParams.get('status')).toBe('pending');
        return HttpResponse.json({
          ...response,
          data: query ? [response.data[1]] : response.data,
        });
      }),
    );
    render(
      <AppProviders>
        <AppointmentsPage />
      </AppProviders>,
    );

    await screen.findByText('Guest User');
    expect(screen.getByText('Dr. Ana')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search pending requests' }), 'another');

    await waitFor(() => expect(query).toBe('another'));
    await waitFor(() => {
      expect(screen.queryByText('Guest User')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Another Guest' })).toBeInTheDocument();
    });
  });

  it('navigates with cursors and resets them for a new search', async () => {
    const user = userEvent.setup();
    const cursors: Array<string | null> = [];
    server.use(
      http.get('*/api/v1/appointment_requests', ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');
        cursors.push(cursor);
        return HttpResponse.json({
          ...response,
          data: [response.data[cursor ? 1 : 0]],
          page_info: {
            ...response.page_info,
            has_next_page: !cursor,
            has_previous_page: Boolean(cursor),
            next_cursor: cursor ? null : 'cursor-for-page-2',
          },
        });
      }),
    );
    render(
      <AppProviders>
        <AppointmentsPage />
      </AppProviders>,
    );

    await screen.findByText('Guest User');
    expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Another Guest');
    expect(screen.queryByText('Guest User')).not.toBeInTheDocument();
    expect(cursors).toContain('cursor-for-page-2');

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await screen.findByText('Guest User');
    expect(cursors.at(-1)).toBeNull();

    await user.type(screen.getByRole('textbox', { name: 'Search pending requests' }), 'guest');
    await waitFor(() => expect(cursors.at(-1)).toBeNull());
  });
});
