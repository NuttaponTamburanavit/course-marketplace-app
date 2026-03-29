import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Header', () => {
  it('when rendered, expect all nav link labels to be present', () => {
    // Arrange & Act
    render(<Header />);

    // Assert
    expect(screen.getByRole('link', { name: 'Explore' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'My Learning' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Mentors' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Resources' })).toBeDefined();
  });

  it('when rendered, expect logo text to be visible', () => {
    // Arrange & Act
    render(<Header />);

    // Assert
    expect(screen.getByText(/course marketplace/i)).toBeDefined();
  });
});
