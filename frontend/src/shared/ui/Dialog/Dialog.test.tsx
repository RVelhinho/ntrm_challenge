import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './Dialog';

describe('Dialog', () => {
  it('opens and closes with Radix keyboard behavior', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Appointment</DialogTitle>
          <Button>Continue</Button>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
