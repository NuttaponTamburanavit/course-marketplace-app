import { apiClient } from './apiClient';
import type { ValidateCouponRequest, ValidateCouponResponse } from './types';

export const couponApi = {
  validateCoupon: (data: ValidateCouponRequest) =>
    apiClient.post<ValidateCouponResponse>('/api/coupons/validate', data),
};
