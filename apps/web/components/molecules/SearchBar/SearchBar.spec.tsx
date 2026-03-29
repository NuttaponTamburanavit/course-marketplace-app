import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('when user types, expect onChange to be called with the typed value', () => {
    // Arrange
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    // Act
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'react' } });

    // Assert
    expect(onChange).toHaveBeenCalledWith('react');
  });

  it('when filter button is clicked, expect onFilter to be called', () => {
    // Arrange
    const onFilter = vi.fn();
    render(<SearchBar value="" onChange={vi.fn()} onFilter={onFilter} />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));

    // Assert
    expect(onFilter).toHaveBeenCalledTimes(1);
  });
});
