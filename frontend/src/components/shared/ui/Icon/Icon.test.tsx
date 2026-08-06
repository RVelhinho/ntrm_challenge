import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="calendar" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
