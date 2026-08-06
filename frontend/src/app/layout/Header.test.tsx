import { render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../providers';
import { router } from '../router';

describe('Header', () => {
  it('links professionals to pending appointment requests', async () => {
    await router.navigate({ to: '/' });
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    expect(await screen.findByText('Are you a nutrition professional?')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Are you a nutrition professional? Get to know our software',
      }),
    ).toHaveAttribute('href', '/appointments');
    expect(screen.getByRole('button', { name: 'Language' })).toBeInTheDocument();
  });
});
