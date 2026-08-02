import { render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { router } from '../../app/router';
import { AppProviders } from '../../app/providers';

describe('LandingPage', () => {
  it('renders links to both appointment workflows', async () => {
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    expect(await screen.findByRole('link', { name: 'Find a nutritionist' })).toHaveAttribute(
      'href',
      '/nutritionists',
    );
    expect(await screen.findByRole('link', { name: 'View pending requests' })).toHaveAttribute(
      'href',
      '/appointments',
    );
  });
});
