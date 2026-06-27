export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WAITING_FOR_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_VERIFIED"
  | "PREPARING"
  | "READY"
  | "COLLECTED"
  | "REJECTED";

export type PaymentStatus = "UNPAID" | "SUBMITTED" | "VERIFIED" | "FAILED";

export type NotificationType =
  | "ORDER_ACCEPTED"
  | "PAYMENT_VERIFIED"
  | "PREPARING"
  | "ORDER_READY"
  | "ORDER_REJECTED";

export interface Hotel {
  id: string;
  name: string;
  ownerName: string;
  mobile: string;
  address: string;
  mapLocation?: string;
  category: string;
  openTime: string;
  closeTime: string;
  logoUrl?: string;
  coverUrl?: string;
  upiId?: string;
  upiQrUrl?: string;
  isActive: boolean;
  rating: number;
  totalRatings: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  hotelId: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isVeg: boolean;
  categoryId: string;
  hotelId: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  pushToken?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderPatch {
  status?: OrderStatus;
  rejectReason?: string | null;
  paymentRejectReason?: string | null;
}

export interface Order {
  id: string;
  orderNumber?: number;
  customerId: string;
  customerName: string;
  customerMobile: string;
  hotelId: string;
  hotelName: string;
  status: OrderStatus;
  pickupTime: string;
  notes?: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  rejectReason?: string;
  paymentRejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Notification {
  id: string;
  orderId: string;
  type: NotificationType;
  title: string;
  body: string;
  sentAt: string;
  isRead: boolean;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  WAITING_FOR_PAYMENT: "Awaiting Payment",
  PAYMENT_SUBMITTED: "Payment Submitted",
  PAYMENT_VERIFIED: "Payment Verified",
  PREPARING: "Preparing",
  READY: "Ready for Pickup",
  COLLECTED: "Collected",
  REJECTED: "Rejected",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  WAITING_FOR_PAYMENT: "bg-orange-100 text-orange-800",
  PAYMENT_SUBMITTED: "bg-purple-100 text-purple-800",
  PAYMENT_VERIFIED: "bg-indigo-100 text-indigo-800",
  PREPARING: "bg-cyan-100 text-cyan-800",
  READY: "bg-green-100 text-green-800",
  COLLECTED: "bg-gray-100 text-gray-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const HOTEL_CATEGORIES = [
  "Restaurant",
  "Biryani House",
  "Bakery",
  "Tea Shop",
  "Fast Food",
  "Juice Center",
  "Hotel & Dining",
  "Sweets & Snacks",
];
