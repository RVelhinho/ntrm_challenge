import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../../../app/providers';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  afterEach(cleanup);

  it('supports direct navigation when page numbers are provided', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AppProviders>
        <Pagination
          label="Results"
          currentPage={1}
          pages={[1, 2, 3]}
          hasPreviousPage={false}
          hasNextPage
          onPageChange={onPageChange}
        />
      </AppProviders>,
    );

    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders arrow-only navigation when pages are omitted', () => {
    render(
      <AppProviders>
        <Pagination
          label="Results"
          currentPage={1}
          hasPreviousPage={false}
          hasNextPage={false}
          onPageChange={() => undefined}
        />
      </AppProviders>,
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });
});
