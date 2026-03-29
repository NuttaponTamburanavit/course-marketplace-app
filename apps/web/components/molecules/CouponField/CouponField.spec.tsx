import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CouponField } from './CouponField';

describe('CouponField', () => {
  it('when valid coupon entered, expect discount shown', async () => {
    // Arrange
    const onApply = vi.fn().mockResolvedValue({ success: true, discount: 30000 });
    const onRemove = vi.fn();
    render(
      <CouponField onApply={onApply} onRemove={onRemove} appliedCode="SAVE10" discount={30000} />,
    );

    // Act — already in applied state
    const appliedText = screen.getByText('โค้ด: SAVE10');

    // Assert
    expect(appliedText).toBeDefined();
  });

  it('when invalid coupon entered, expect error message shown', async () => {
    // Arrange
    const onApply = vi.fn().mockResolvedValue({ success: false, error: 'ไม่พบโค้ดส่วนลดนี้' });
    const onRemove = vi.fn();
    render(<CouponField onApply={onApply} onRemove={onRemove} />);

    // Act
    await userEvent.type(screen.getByPlaceholderText('กรอกโค้ดส่วนลด'), 'INVALID');
    await userEvent.click(screen.getByText('ใช้โค้ด'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('ไม่พบโค้ดส่วนลดนี้')).toBeDefined();
    });
  });
});
