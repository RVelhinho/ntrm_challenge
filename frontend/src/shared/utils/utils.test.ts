import { describe, expect, it } from 'vitest';
import { formatDateTime, formatTime } from './utils';

describe('date formatting utilities', () => {
  it('formats localized date and time values consistently', () => {
    const value = '2030-01-01T10:00:00.000Z';

    expect(formatDateTime(value, 'en-US')).toBe(
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value)),
    );
    expect(formatTime(value, 'en-US')).toBe(
      new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(value)),
    );
  });
});
