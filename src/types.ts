export type UserRole = 'CLIENT' | 'VENDOR' | 'ADMIN';

export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type ProductStatus = 'ACTIVE' | 'PAUSED';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  vendorId?: string; // Link to vendor store if role === 'VENDOR'
  phone?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string; // e.g. "أسرة أم خالد - حلويات ومخبوزات"
  ownerName: string; // e.g. "نورة العتيبي"
  phone: string;
  nationalIdOrCR: string; // رقم الهوية أو السجل التجاري/وثيقة العمل الحر
  city: string;
  address?: string; // العنوان التفصيلي للمتجر/الأسرة
  lat?: number; // خط العرض للمتجر
  lng?: number; // خط الطول للمتجر
  categoryIds: string[];
  description: string;
  logo: string;
  banner: string;
  status: VendorStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  isHidden?: boolean; // إخفاء المورد من واجهات العرض للعملاء
  hideContactDetails?: boolean; // إخفاء بيانات التواصل والوثائق للعامة
  submittedAt: string;
  approvedAt?: string;
  bankAccount: {
    bankName: string;
    iban: string;
    accountHolder: string;
  };
  commissionRate?: number; // نسبة عمولة المنصة المتفق عليها (مثلاً 10%)
  rating: number;
  totalSalesCount: number;
}

export interface Category {
  id: string;
  name: string; // e.g. "أكلات شعبية"
  icon: string; // Lucide icon name or emoji
  description: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  status: ProductStatus;
  stock: number;
  unit: string; // e.g. "طبق", "كيلو", "علبة", "قطعة"
  prepTimeMinutes: number; // زمن التحضير المتوقع بالدقائق
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  vendorId: string;
  vendorName: string;
  vendorAddress?: string;
  vendorLat?: number;
  vendorLng?: number;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  subtotalAmount?: number; // مجموع سعر المنتجات قبل الضريبة
  taxRate?: number; // نسبة الضريبة (مثلاً 15%)
  taxAmount?: number; // مبلغ ضريبة القيمة المضافة
  deliveryFee: number; // رسوم التوصيل المحسوبة
  commissionRate?: number; // نسبة عمولة المنصة
  commissionAmount?: number; // مبلغ عمولة المنصة من المورد
  grandTotal: number; // المبلغ الإجمالي النهائي (منتجات + ضريبة + توصيل)
  deliveryAddress: string;
  clientLat?: number; // إحداثيات موقع العميل
  clientLng?: number;
  distanceKm?: number; // المسافة المحسوبة بين المورد والعميل بالكيلومتر
  estimatedDeliveryMinutes?: number; // الوقت التقديري الإجمالي للتوصيل (تحضير + طريق)
  driverLat?: number; // الموقع المباشر المحدث للمندوب أثناء التوصيل
  driverLng?: number;
  paymentMethod: 'MADA' | 'APPLE_PAY' | 'CASH';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface PlatformSettings {
  taxPercentage: number; // قيمة الضريبة المضافة (Default 15%)
  defaultDeliveryFee: number; // قيمة التوصيل الافتراضية (Default 15 SAR)
  defaultCommissionRate: number; // نسبة عمولة المنصة الافتراضية للموردين (Default 10%)
  baseDeliveryFeeKm: number; // السعر الأساسي للتوصيل لكل كم بعد المسافة الأولى
}

export interface Review {
  id: string;
  productId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartConflictInfo {
  existingVendorId: string;
  existingVendorName: string;
  newProduct: Product;
  newQuantity: number;
}

