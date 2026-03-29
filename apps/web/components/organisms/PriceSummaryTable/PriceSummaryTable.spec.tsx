import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceSummaryTable } from './PriceSummaryTable';

const basePricing = {
  listPrice: 300000,
  couponDiscount: 30000,
  paidAmount: 270000,
  amountExclVat: 252336,
  vatAmount: 17664,
};

describe('PriceSummaryTable', () => {
  it('when pricing prop supplied, expect all rows rendered with correct labels', () => {
    // Arrange & Act
    render(<PriceSummaryTable pricing={basePricing} />);

    // Assert
    expect(screen.getByText('ราคาคอร์ส')).toBeDefined();
    expect(screen.getByText('ส่วนลดคูปอง')).toBeDefined();
    expect(screen.getByText('ราคาจ่ายจริง')).toBeDefined();
    expect(screen.getByText('ราคาก่อน VAT')).toBeDefined();
    expect(screen.getByText('VAT 7%')).toBeDefined();
  });

  it('when couponDiscount is 0, expect discount row not rendered', () => {
    // Arrange
    const pricing = { ...basePricing, couponDiscount: 0 };

    // Act
    render(<PriceSummaryTable pricing={pricing} />);

    // Assert
    expect(screen.queryByText('ส่วนลดคูปอง')).toBeNull();
  });
});
