import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover, PopoverAnchor, PopoverContent, PopoverEmpty } from './Popover';

describe('Popover', () => {
  it('renders anchored empty feedback in a portal', () => {
    render(
      <Popover open>
        <PopoverAnchor>
          <input aria-label="Search" />
        </PopoverAnchor>
        <PopoverContent>
          <PopoverEmpty>No suggestions</PopoverEmpty>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByText('No suggestions')).toBeInTheDocument();
  });
});
