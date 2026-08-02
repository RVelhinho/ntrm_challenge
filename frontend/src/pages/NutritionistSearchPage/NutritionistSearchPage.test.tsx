import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../app/providers';
import { server } from '../../test/server';
import { NutritionistSearchPage } from './NutritionistSearchPage';

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: { success: toastSuccess },
}));

describe('NutritionistSearchPage', () => {
  beforeEach(() => toastSuccess.mockReset());

  it('renders search fields as two layout items', async () => {
    server.use(
      http.get('*/api/v1/nutritionists', () =>
        HttpResponse.json({
          items: [],
          meta: {
            page: 1,
            per_page: 6,
            total_count: 0,
            total_pages: 0,
            location: null,
            location_mode: 'all',
          },
        }),
      ),
    );

    render(
      <AppProviders>
        <NutritionistSearchPage />
      </AppProviders>,
    );

    expect(await screen.findByRole('combobox', { name: 'Name or service' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Location' })).toBeInTheDocument();
  });

  it('searches when Enter is pressed in the first field', async () => {
    const user = userEvent.setup();
    let submittedQuery = '';
    server.use(
      http.get('*/api/v1/nutritionists', ({ request }) => {
        submittedQuery = new URL(request.url).searchParams.get('q') ?? submittedQuery;
        return HttpResponse.json({
          items: [],
          meta: {
            page: 1,
            per_page: 2,
            total_count: 0,
            total_pages: 0,
            location: null,
            location_mode: 'all',
          },
        });
      }),
    );

    render(
      <AppProviders>
        <NutritionistSearchPage />
      </AppProviders>,
    );

    const input = await screen.findByLabelText('Name or service');
    await user.click(input);
    await user.type(input, 'Alice');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(submittedQuery).toBe('Alice'));
  });

  it('shows a success toast after submitting an appointment request', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    server.use(
      http.get('*/api/v1/nutritionists', () =>
        HttpResponse.json({
          items: [
            {
              id: 1,
              name: 'Dr. Ana',
              biography: null,
              distance_km: null,
              services: [
                {
                  id: 2,
                  name: 'Initial consultation',
                  price_cents: 5500,
                  duration_minutes: 60,
                  location: 'Braga',
                  latitude: 41.5,
                  longitude: -8.4,
                },
              ],
            },
          ],
          meta: {
            page: 1,
            per_page: 2,
            total_count: 1,
            total_pages: 1,
            location: 'Braga',
            location_mode: 'all',
          },
        }),
      ),
      http.post('*/api/v1/appointment_requests', () => HttpResponse.json({}, { status: 201 })),
    );

    render(
      <AppProviders>
        <NutritionistSearchPage />
      </AppProviders>,
    );

    const scheduleButtons = await screen.findAllByRole('button', { name: 'Schedule appointment' });
    await user.click(scheduleButtons[0]);
    await user.type(screen.getByLabelText('Your name'), 'Guest User');
    await user.type(screen.getByLabelText('Email address'), 'guest@example.com');
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: tomorrow.toISOString().slice(0, 10) },
    });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '10:00' } });
    await user.click(screen.getByRole('button', { name: 'Request appointment' }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Your appointment request is pending.');
    });
    expect(screen.queryByText('Your appointment request is pending.')).not.toBeInTheDocument();
  });
});
