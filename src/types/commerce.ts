export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    slug: string;
    price: number;
    stockQuantity: number;
    imageUrl: string | null;
  };
};

export type WishlistItem = {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product?: {
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
  };
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export type Order = {
  id: number;
  orderNumber: string;
  userId: number | null;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  shippingAddressId: number | null;
  billingAddressId: number | null;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
  currency: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  productSku: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type CreateOrderInput = {
  shippingAddressId?: number | null;
  billingAddressId?: number | null;
  notes?: string | null;
  couponCode?: string | null;
  items: { productId: number; quantity: number }[];
};

export type CouponDiscountType = "percentage" | "fixed_amount";

export type Coupon = {
  id: number;
  code: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CouponInput = {
  code: string;
  description?: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  isActive?: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
};

export type PaymentProvider = "stripe" | "manual" | "cod";
export type PaymentStatus = "pending" | "authorized" | "succeeded" | "failed" | "refunded" | "partially_refunded";

export type Payment = {
  id: number;
  orderId: number;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  providerCustomerId: string | null;
  status: PaymentStatus;
  amount: number;
  currency: string;
  method: string | null;
  failureReason: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};
