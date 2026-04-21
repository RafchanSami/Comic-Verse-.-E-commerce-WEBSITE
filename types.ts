
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text
  isBlocked?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

// New Interface for RPG Stats
export interface HeroStats {
  speed: number;
  durability: number;
  stealth: number;
  comfort: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  sizes: string[];
  featured?: boolean;
  heroStats?: HeroStats; // Optional stats
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  COD = 'COD',
  BKASH = 'BKASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  promoCode?: string;
  shippingCost: number; // New field
  status: OrderStatus;
  shippingAddress: string;
  contactNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string; // For bKash
  date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// New Types
export interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  isActive: boolean;
}

export interface Notice {
  id: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'URGENT';
  isActive: boolean;
}

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}