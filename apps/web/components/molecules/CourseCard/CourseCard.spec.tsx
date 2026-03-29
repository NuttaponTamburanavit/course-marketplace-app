import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CourseCard } from './CourseCard';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('CourseCard', () => {
  const defaultProps = {
    title: 'React & Next.js 14',
    description: 'Learn React from scratch',
    href: '/courses/react-1',
  };

  it('when all props are provided, expect title, description, tags, and rating to be rendered', () => {
    // Arrange & Act
    render(
      <CourseCard
        {...defaultProps}
        tags={['NEW', 'MASTERCLASS']}
        rating={4.9}
        level="Advanced"
        duration="18h 45m"
      />,
    );

    // Assert
    expect(screen.getByText('React & Next.js 14')).toBeDefined();
    expect(screen.getByText('Learn React from scratch')).toBeDefined();
    expect(screen.getByText('NEW')).toBeDefined();
    expect(screen.getByText('MASTERCLASS')).toBeDefined();
    expect(screen.getByText('4.9')).toBeDefined();
  });

  it('when optional props are omitted, expect no crash and title to be rendered', () => {
    // Arrange & Act
    render(<CourseCard {...defaultProps} />);

    // Assert
    expect(screen.getByText('React & Next.js 14')).toBeDefined();
  });

  it('when href is set, expect the link to point to the correct URL', () => {
    // Arrange & Act
    render(<CourseCard {...defaultProps} />);

    // Assert
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/courses/react-1');
  });
});
