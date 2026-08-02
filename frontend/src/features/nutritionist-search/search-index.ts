import Fuse from 'fuse.js';

export type SearchOption = { value: string };
export type SearchIndex = { fuse: Fuse<SearchOption>; options: SearchOption[] };

export function createSearchIndex(options: string[]): SearchIndex {
  const records = [...new Set(options)].map((value) => ({ value }));
  return {
    options: records,
    fuse: new Fuse<SearchOption>(records, {
      keys: ['value'],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 1,
    }),
  };
}

export function fuzzyOptions(index: SearchIndex, query: string): SearchOption[] {
  if (!query.trim()) return index.options;
  return index.fuse.search(query).map((result) => result.item);
}
