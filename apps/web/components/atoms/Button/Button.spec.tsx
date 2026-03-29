import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('when loading prop, expect button to be disabled', () => {
    // Arrange
    render(<Button loading>Submit</Button>);

    // Act
    const button = screen.getByRole('button');

    // Assert
    expect(button).toBeDisabled();
  });

  it('when onClick provided and button clicked, expect handler called', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    // Act
    await userEvent.click(screen.getByRole('button'));

    // Assert
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('when disabled, expect onClick not called', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    );

    // Act
    await userEvent.click(screen.getByRole('button'));

    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });
});
