import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '@tanstack/react-router';
import { AppProviders } from '../../app/providers';
import { router } from '../../app/router';

describe('NotFoundPage', () => {
  it('provides a translated route back to the home page', async () => {
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    void router.navigate({ to: '/missing-page' as never });

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });
});
