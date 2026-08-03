import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  it('renders the provided source and image attributes', () => {
    render(<Image src="/logo.png" alt="Nutrium" className="h-8" />);

    expect(screen.getByRole('img', { name: 'Nutrium' })).toHaveAttribute('src', '/logo.png');
    expect(screen.getByRole('img', { name: 'Nutrium' })).toHaveClass('h-8');
  });
});
