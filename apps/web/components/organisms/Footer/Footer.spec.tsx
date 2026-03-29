import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Footer', () => {
  it('when rendered, expect all column link labels to be present', () => {
    // Arrange & Act
    render(<Footer />);

    // Assert — Tracks
    expect(screen.getByText('Front-end')).toBeDefined();
    expect(screen.getByText('Distributed Systems')).toBeDefined();
    expect(screen.getByText('AI & ML')).toBeDefined();

    // Assert — Academy
    expect(screen.getByText('Pricing')).toBeDefined();
    expect(screen.getByText('Enterprise')).toBeDefined();
    expect(screen.getByText('Hall of Fame')).toBeDefined();

    // Assert — Social
    expect(screen.getByText('X (Twitter)')).toBeDefined();
    expect(screen.getByText('GitHub')).toBeDefined();
    expect(screen.getByText('YouTube')).toBeDefined();
  });

  it('when rendered, expect copyright text to be present', () => {
    // Arrange & Act
    render(<Footer />);

    // Assert
    expect(screen.getByText(/© 2026 course marketplace/i)).toBeDefined();
  });
});
