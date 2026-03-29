import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Countdown } from './Countdown';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('when seconds=0, expect onExpire called immediately', () => {
    // Arrange
    const onExpire = vi.fn();

    // Act
    render(<Countdown seconds={0} onExpire={onExpire} />);

    // Assert
    expect(onExpire).toHaveBeenCalledOnce();
  });

  it('when seconds=5, expect countdown renders minutes and seconds', () => {
    // Arrange
    const onExpire = vi.fn();

    // Act
    render(<Countdown seconds={5} onExpire={onExpire} />);

    // Assert
    expect(screen.getByText('00:05')).toBeDefined();
  });

  it('when time passes, expect countdown decrements', () => {
    // Arrange
    const onExpire = vi.fn();
    render(<Countdown seconds={10} onExpire={onExpire} />);

    // Act
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Assert
    expect(screen.getByText('00:07')).toBeDefined();
  });
});
