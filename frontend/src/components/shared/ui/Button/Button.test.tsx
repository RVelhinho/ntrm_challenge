import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  afterEach(cleanup);

  it('exposes disabled and loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toHaveTextContent('Loading...');
  });

  it('passes button presentation to a child without nesting interactive elements', () => {
    render(
      <Button asChild>
        <a href="/appointments">Appointments</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'Appointments' })).toHaveClass('bg-primary');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('prevents activation when an asChild link is disabled', async () => {
    const user = userEvent.setup();
    let activated = false;
    render(
      <Button asChild disabled>
        <a href="/appointments" onClick={() => (activated = true)}>
          Appointments
        </a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Appointments' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.click(link);
    expect(activated).toBe(false);
  });
});
