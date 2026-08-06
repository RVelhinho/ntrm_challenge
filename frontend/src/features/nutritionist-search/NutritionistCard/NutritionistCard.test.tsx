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
    });
  });

  it.each([
    ['female', 'female_nutr_real.png'],
    ['male', 'nutr_male_real.png'],
    [undefined, 'portrait.svg'],
  ] as const)('uses the %s nutritionist portrait', (gender, portrait) => {
    const { container } = render(
      <NutritionistCard
        nutritionist={{
          id: 1,
          name: 'Dr. Ana',
          gender,
          services: [],
        }}
        onSchedule={vi.fn()}
      />,
    );

    const image = container.querySelector('img');
    if (gender) {
      expect(image).toHaveAttribute('src', expect.stringContaining(portrait));
    } else {
      expect(image?.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    }
  });
});
