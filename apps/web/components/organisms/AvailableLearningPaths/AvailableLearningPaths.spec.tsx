import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AvailableLearningPaths } from './AvailableLearningPaths';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockCourses = [
  {
    title: 'React Fundamentals',
    description: 'Learn React basics',
    href: '/courses/1',
    tags: ['FRONTEND'],
  },
  {
    title: 'NestJS Backend',
    description: 'Build APIs with NestJS',
    href: '/courses/2',
    tags: ['BACKEND'],
  },
  {
    title: 'TypeScript Patterns',
    description: 'Advanced TypeScript techniques',
    href: '/courses/3',
  },
];

describe('AvailableLearningPaths', () => {
  it('when courses prop is provided, expect all cards to be rendered', () => {
    // Arrange & Act
    render(<AvailableLearningPaths courses={mockCourses} />);

    // Assert
    expect(screen.getByText('React Fundamentals')).toBeDefined();
    expect(screen.getByText('NestJS Backend')).toBeDefined();
    expect(screen.getByText('TypeScript Patterns')).toBeDefined();
  });

  it('when search query matches a title, expect only matching cards to be shown', () => {
    // Arrange
    render(<AvailableLearningPaths courses={mockCourses} />);

    // Act
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'react' } });

    // Assert
    expect(screen.getByText('React Fundamentals')).toBeDefined();
    expect(screen.queryByText('NestJS Backend')).toBeNull();
    expect(screen.queryByText('TypeScript Patterns')).toBeNull();
  });

  it('when search query matches nothing, expect empty state message to be shown', () => {
    // Arrange
    render(<AvailableLearningPaths courses={mockCourses} />);

    // Act
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'python' } });

    // Assert
    expect(screen.getByText(/no courses match/i)).toBeDefined();
  });
});
