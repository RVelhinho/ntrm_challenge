import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('renders non-interactive label content', () => {
    render(<Label>Follow-up</Label>);

    expect(screen.getByText('Follow-up')).toHaveClass('rounded-full', 'bg-primary-soft');
    expect(screen.getByText('Follow-up').tagName).toBe('SPAN');
  });
});
