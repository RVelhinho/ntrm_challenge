import { describe, expect, it } from 'vitest';
import { en } from './en';
import { pt } from './pt';

function paths(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    paths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('translation resources', () => {
  it('contain the same keys for every supported language', () => {
    expect(paths(pt).sort()).toEqual(paths(en).sort());
  });
});
