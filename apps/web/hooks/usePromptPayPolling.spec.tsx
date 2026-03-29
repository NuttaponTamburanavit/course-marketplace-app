import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePromptPayPolling } from './usePromptPayPolling';
import * as orderApiModule from '@/api/orderApi';

vi.mock('@/api/orderApi', () => ({
  orderApi: {
    getOrderStatus: vi.fn(),
  },
}));

describe('usePromptPayPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('when status=successful returned, expect polling stops and onSuccess called', async () => {
    // Arrange
    const onSuccess = vi.fn();
    vi.mocked(orderApiModule.orderApi.getOrderStatus).mockResolvedValue({
      orderId: 'order-1',
      status: 'paid',
    });

    // Act
    const { result } = renderHook(() => usePromptPayPolling({ orderId: 'order-1', onSuccess }));
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    await act(async () => {
      await Promise.resolve();
    });

    // Assert
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(result.current.isPolling).toBe(false);
  });

  it('when max attempts reached, expect polling stops', async () => {
    // Arrange
    const onSuccess = vi.fn();
    vi.mocked(orderApiModule.orderApi.getOrderStatus).mockResolvedValue({
      orderId: 'order-1',
      status: 'pending_payment',
    });

    // Act
    const { result } = renderHook(() => usePromptPayPolling({ orderId: 'order-1', onSuccess }));
    await act(async () => {
      vi.advanceTimersByTime(3000 * 201);
    });
    await act(async () => {
      await Promise.resolve();
    });

    // Assert
    expect(result.current.isPolling).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
