import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

// Mock the store so courseId is set
vi.mock('@/store/checkoutStore', () => {
  const store: Record<string, unknown> = {
    courseId: 'course-1',
    currentStep: 1,
    customerInfo: null,
    invoiceInfo: null,
    coupon: null,
    pricing: null,
    paymentMethod: null,
    qrUri: null,
    orderId: null,
    setStep: vi.fn(),
    setOrderId: vi.fn(),
    setPricing: vi.fn(),
    setCourseId: vi.fn(),
    reset: vi.fn(),
  };
  return {
    useCheckoutStore: (selector: (s: typeof store) => unknown) => selector(store),
  };
});

vi.mock('@/api/orderApi', () => ({ orderApi: { createOrder: vi.fn() } }));

import CheckoutPage from './page';

describe('CheckoutPage', () => {
  it('when rendered with courseId, expect stepper and step 1 visible', () => {
    // Arrange & Act
    render(<CheckoutPage />);

    // Assert
    expect(screen.getByRole('navigation', { name: /ขั้นตอน/i })).toBeDefined();
    expect(screen.getAllByText('ข้อมูลลูกค้า').length).toBeGreaterThan(0);
  });
});
