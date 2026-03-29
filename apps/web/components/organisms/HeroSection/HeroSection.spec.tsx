import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('when counts are provided, expect stat values to be rendered', () => {
    // Arrange & Act
    render(<HeroSection activeCourseCount={42} engineerCount={12} />);

    // Assert
    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('12k')).toBeDefined();
  });

  it('when engineerCount is 0, expect "0" to be rendered for engineers', () => {
    // Arrange & Act
    render(<HeroSection activeCourseCount={5} engineerCount={0} />);

    // Assert
    expect(screen.getByText('0')).toBeDefined();
  });

  it('when rendered, expect the page heading to be present', () => {
    // Arrange & Act
    render(<HeroSection activeCourseCount={0} engineerCount={0} />);

    // Assert
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });
});
