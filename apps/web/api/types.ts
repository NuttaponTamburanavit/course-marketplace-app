export type OrderStatus =
  | 'created'
  | 'pending_payment'
  | 'processing_3ds'
  | 'paid'
  | 'access_granted'
  | 'cancelled'
  | 'failed';

export interface PricingBreakdown {
  listPrice: number;
  couponDiscount: number;
  paidAmount: number;
  amountExclVat: number;
  vatAmount: number;
}

export interface InvoiceInfoIndividual {
  type: 'individual';
  fullName: string;
  nationalId: string;
  address: string;
  invoiceEmail: string;
}

export interface InvoiceInfoCompany {
  type: 'company';
  companyName: string;
  taxId: string;
  companyAddress: string;
  contactName: string;
  contactEmail: string;
}

export type InvoiceInfo = InvoiceInfoIndividual | InvoiceInfoCompany;

export interface CreateOrderRequest {
  courseId: string;
  customerName: string;
  customerEmail: string;
  invoiceInfo: InvoiceInfo;
  couponCode?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  pricing: PricingBreakdown;
  status: OrderStatus;
}

export interface OrderStatusResponse {
  orderId: string;
  status: OrderStatus;
  qrUri?: string;
  authorizeUri?: string;
}

export interface ValidateCouponRequest {
  code: string;
  courseId: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  code: string;
  discount: number;
  error?: string;
}

export interface PayPromptPayResponse {
  qrUri: string;
  chargeId: string;
}

export interface PayCardRequest {
  omiseToken: string;
}

export interface PayCardResponse {
  authorizeUri?: string;
  status: 'successful' | 'pending' | 'failed';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  listPrice: number;
  thumbnailUrl?: string;
  instructorName?: string;
}
