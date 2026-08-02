import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NutritionistCard } from './NutritionistCard';

describe('NutritionistCard', () => {
  it('shows service details and schedules the selected service', async () => {
    const onSchedule = vi.fn();
    render(
      <NutritionistCard
        nutritionist={{
          id: 1,
          name: 'Dr. Ana',
          biography: 'Practical nutrition',
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
        }}
        onSchedule={onSchedule}
      />,
    );

    expect(screen.getByText('€55.00', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Braga.*60 min/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Schedule appointment' }));
    expect(onSchedule).toHaveBeenCalledWith({
      id: 2,
      name: 'Initial consultation',
      price_cents: 5500,
      duration_minutes: 60,
      location: 'Braga',
      latitude: 41.5,
      longitude: -8.4,
    });
  });
});
