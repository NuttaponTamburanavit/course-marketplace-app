import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatBadge } from './StatBadge';

describe('StatBadge', () => {
  it('when value and label are provided, expect both to be rendered', () => {
    // Arrange & Act
    render(<StatBadge value={42} label="Active Courses" />);

    // Assert
    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('Active Courses')).toBeDefined();
  });

  it('when value is 0, expect "0" to be rendered', () => {
    // Arrange & Act
    render(<StatBadge value={0} label="Engineers" />);

    // Assert
    expect(screen.getByText('0')).toBeDefined();
  });

  it('when value is a string, expect the string to be rendered', () => {
    // Arrange & Act
    render(<StatBadge value="12k" label="Engineers" />);

    // Assert
    expect(screen.getByText('12k')).toBeDefined();
  });
});
