import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('supports semantic elements and tones', () => {
    render(
      <Text as="h2" tone="danger">
        Problem
      </Text>,
    );
    expect(screen.getByRole('heading', { name: 'Problem' })).toHaveClass('text-danger-text');
  });
});
