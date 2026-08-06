import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from './Dropdown';

describe('Dropdown', () => {
  it('opens a menu and selects an item', async () => {
    const onSelect = vi.fn();
    render(
      <DropdownRoot>
        <DropdownTrigger>
          <button type="button">Language</button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={onSelect}>English</DropdownItem>
        </DropdownContent>
      </DropdownRoot>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Language' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'English' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
