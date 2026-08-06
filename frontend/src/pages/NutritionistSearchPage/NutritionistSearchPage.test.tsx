import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../app/providers';
import { server } from '../../test/server';
import { NutritionistSearchPage } from './NutritionistSearchPage';

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));

const pageInfo = {
  current_page: 1,
  page_size: 6,
  total_count: 0,
  total_pages: 0,
  has_next_page: false,
  has_previous_page: false,
};

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: { success: toastSuccess },
}));

describe('NutritionistSearchPage', () => {
  afterEach(cleanup);
  beforeEach(() => toastSuccess.mockReset());

  it('renders search fields as two layout items', async () => {
    const user = userEvent.setup();
    server.use(
      http.get('*/api/v1/nutritionists', () =>
        HttpResponse.json({
          items: [],
          page_info: pageInfo,
          location: 'Braga',
          locations: ['Braga', 'Porto'],
        }),
      ),
    );

    render(
      <AppProviders>
        <NutritionistSearchPage />
      </AppProviders>,
    );

    expect(await screen.findByRole('textbox', { name: 'Name or service' })).toBeInTheDocument();
    const location = await screen.findByRole('combobox', { name: 'Location' });
    await waitFor(() => expect(location).toHaveValue('Braga'));
    await user.clear(location);
    await user.click(location);
    await user.click(await screen.findByRole('option', { name: 'Porto' }));
    expect(location).toHaveValue('Porto');
  });

  it('searches when Enter is pressed in the first field', async () => {
    const user = userEvent.setup();
    let submittedQuery = '';
    server.use(
      http.get('*/api/v1/nutritionists', ({ request }) => {
        submittedQuery = new URL(request.url).searchParams.get('q') ?? submittedQuery;
        return HttpResponse.json({
          items: [],
          page_info: pageInfo,
          location: 'Braga',
          locations: ['Braga', 'Porto'],
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

  it('allows arbitrary location text and reflects the server fallback', async () => {
    const user = userEvent.setup();
    let submittedLocation = '';
    server.use(
      http.get('*/api/v1/nutritionists', ({ request }) => {
        const url = new URL(request.url);
        submittedLocation = url.searchParams.get('location') ?? '';
        expect(Array.from(url.searchParams.keys()).sort()).toEqual(['limit', 'location', 'page']);
        return HttpResponse.json({
          items: [],
          page_info: pageInfo,
          location: submittedLocation === 'Atlantis' ? 'Braga' : submittedLocation,
          locations: ['Braga', 'Porto'],
        });
      }),
    );
    render(
      <AppProviders>
        <NutritionistSearchPage />
      </AppProviders>,
    );

    const location = await screen.findByRole('combobox', { name: 'Location' });
    await user.clear(location);
    await user.type(location, 'Atlantis{Enter}');
    await waitFor(() => expect(submittedLocation).toBe('Atlantis'));
    await waitFor(() => expect(location).toHaveValue('Braga'));
  });

  it('shows all offset pages on the first response and navigates directly', async () => {
    const user = userEvent.setup();
    const pages: number[] = [];
    server.use(
      http.get('*/api/v1/nutritionists', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page') ?? 1);
        pages.push(page);
        return HttpResponse.json({
          items: [],
          page_info: {
            ...pageInfo,
            current_page: page,
            total_count: 20,
            total_pages: 4,
            has_next_page: page < 4,
            has_previous_page: page > 1,
          },
          location: 'Braga',
          locations: ['Braga', 'Porto'],
        });
      }),
    );
    render(
      <AppProviders>
        <NutritionistSearchPage />
      </AppProviders>,
    );

    await screen.findByText('No nutritionists match this search.');
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '4' }));
    await waitFor(() => expect(pages.at(-1)).toBe(4));

    await user.type(screen.getByRole('textbox', { name: 'Name or service' }), 'sports');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(pages.at(-1)).toBe(1));
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
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
              gender: null,
              services: [
                {
                  id: 2,
                  name: 'Initial consultation',
                  price_cents: 5500,
                  duration_minutes: 60,
                  location: 'Braga',
                },
              ],
            },
          ],
          page_info: { ...pageInfo, total_count: 1, total_pages: 1 },
          location: 'Braga',
          locations: ['Braga'],
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
      target: {
        value: `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`,
      },
    });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '10:00' } });
    await user.click(screen.getByRole('button', { name: 'Request appointment' }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Your appointment request is pending.');
    });
    expect(screen.queryByText('Your appointment request is pending.')).not.toBeInTheDocument();
  });
});
