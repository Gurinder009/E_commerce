export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentMethod = 'COD' | 'ONLINE';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[] | Record<string, string>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  seller?: ISeller | null;
}

export interface ISeller {
  _id: string;
  user: string | IUser;
  storeName: string;
  storeDescription?: string;
  storeEmail: string;
  storePhone: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  gstin?: string;
  panNumber?: string;
  verificationStatus: SellerStatus;
  rejectionReason?: string;
  rating: number;
  numReviews: number;
  createdAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | ICategory;
  isActive: boolean;
  productCount?: number;
  displayOrder?: number;
}

export interface IProductVariant {
  sku: string;
  size?: string;
  color?: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  seller: ISeller | string;
  category: ICategory | string;
  brand: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  variants?: IProductVariant[];
  specifications?: Record<string, string>;
  isApproved: boolean;
  isActive: boolean;
  isFeatured?: boolean;
  rating: number;
  numReviews: number;
  salesCount: number;
  tags?: string[];
  createdAt: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  variantSku?: string;
  selectedColor?: string;
  selectedSize?: string;
  price: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  subtotal: number;
  discountTotal: number;
  couponCode?: string;
  couponDiscount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
}

export interface IAddress {
  _id?: string;
  user?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  type?: 'HOME' | 'WORK' | 'OTHER';
}

export interface IOrderItem {
  product: IProduct | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  seller: ISeller | string;
  variantSku?: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  returnRequestedAt?: string;
  returnReason?: string;
  returnApproved?: boolean;
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  user: IUser;
  product: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  sellerResponse?: {
    comment: string;
    respondedAt: string;
  };
  createdAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  seller?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface INotification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'ORDER' | 'SYSTEM' | 'PROMOTION' | 'SELLER' | 'REVIEW';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
