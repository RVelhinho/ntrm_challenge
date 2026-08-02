import { describe, expect, it } from 'vitest';
import { createSearchIndex, fuzzyOptions } from './search-index';

describe('nutritionist search index', () => {
  it('fuzzy matches service names and removes duplicate options', () => {
    const index = createSearchIndex([
      'Nutrition consultation',
      'Nutrition consultation',
      'Sports nutrition',
    ]);

    expect(fuzzyOptions(index, 'nutriton')[0].value).toBe('Nutrition consultation');
    expect(fuzzyOptions(index, '').map((option) => option.value)).toEqual([
      'Nutrition consultation',
      'Sports nutrition',
    ]);
  });
});
