import { apiClient } from './apiClient';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStatusResponse,
  PayCardRequest,
  PayCardResponse,
  PayPromptPayResponse,
} from './types';

export const orderApi = {
  createOrder: (data: CreateOrderRequest) =>
    apiClient.post<CreateOrderResponse>('/api/orders', data),

  getOrderStatus: (orderId: string) =>
    apiClient.get<OrderStatusResponse>(`/api/orders/${orderId}/status`),

  payPromptPay: (orderId: string) =>
    apiClient.post<PayPromptPayResponse>(`/api/orders/${orderId}/pay/promptpay`, {}),

  payCard: (orderId: string, data: PayCardRequest) =>
    apiClient.post<PayCardResponse>(`/api/orders/${orderId}/pay/card`, data),

  resendAccessLink: (email: string, orderId: string) =>
    apiClient.post<void>('/api/access/resend', { email, orderId }),
};
