import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DateInput } from './DateInput';
import { TimeInput } from './TimeInput';

describe('DateInput and TimeInput', () => {
  it('provide consistently styled native date and time controls', () => {
    render(
      <>
        <label>
          Date
          <DateInput aria-label="Date" />
        </label>
        <label>
          Time
          <TimeInput aria-label="Time" />
        </label>
      </>,
    );

    expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Time')).toHaveAttribute('type', 'time');
  });
});
