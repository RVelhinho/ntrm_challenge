import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

describe('Select', () => {
  it('opens and selects an option with the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select defaultValue="one" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Service">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">First</SelectItem>
          <SelectItem value="two">Second</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Service' });
    trigger.focus();
    await user.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('two');
  });
});
