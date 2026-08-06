import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GlobalErrorPage } from './GlobalErrorPage';

describe('GlobalErrorPage', () => {
  it('offers a retry action', async () => {
    const reset = vi.fn();
    render(<GlobalErrorPage error={new Error('Test error')} reset={reset} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
