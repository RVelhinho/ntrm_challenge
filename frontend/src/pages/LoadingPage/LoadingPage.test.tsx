import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingPage } from './LoadingPage';

describe('LoadingPage', () => {
  it('announces loading state', () => {
    render(<LoadingPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });
});
