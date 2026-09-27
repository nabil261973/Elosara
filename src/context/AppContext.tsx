import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserRole,
  UserAccount,
  Vendor,
  Category,
  Product,
  CartItem,
  Order,
  Review,
  CartConflictInfo,
  OrderStatus,
  ProductStatus,
  PlatformSettings
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_PLATFORM_SETTINGS
} from '../data/mockData';
import { calculateDistanceKm } from '../components/Common/LocationMap';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface RegisterUserParams {
  name: string;
  username: string;
  password: string;
  role: UserRole;
  phone?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  vendorData?: {
    storeName: string;
    ownerName: string;
    nationalIdOrCR: string;
    bankIban: string;
    description: string;
    address?: string;
    lat?: number;
    lng?: number;
    commissionRate?: number;
  };
}

interface AppContextType {
  // Authentication & Current User State
  currentUser: UserAccount | null;
  users: UserAccount[];
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  registerUser: (data: RegisterUserParams) => { success: boolean; message?: string; user?: UserAccount };

  // Current Role & User Simulation
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeVendorId: string;
  setActiveVendorId: (id: string) => void;
  activeVendor: Vendor | undefined;
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;

  // Platform Settings & Financial Configurations
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  updateVendorCommission: (vendorId: string, commissionRate: number) => void;

  // Data Scope & Isolation Getters
  getClientOrders: () => Order[];
  getVendorOrders: () => Order[];
  getVendorProducts: () => Product[];

  // Global Data
  vendors: Vendor[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  reviews: Review[];

  // Cart State & Single Vendor Enforcement
  cartItems: CartItem[];
  cartVendorId: string | null;
  cartVendorName: string | null;
  cartConflictInfo: CartConflictInfo | null;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  confirmSwitchVendorAndAddToCart: () => void;
  dismissCartConflict: () => void;

  // Client Operations
  getVisibleProductsForClient: () => Product[];
  checkoutCart: (
    deliveryAddress: string,
    paymentMethod: 'MADA' | 'APPLE_PAY' | 'CASH',
    notes?: string,
    clientName?: string,
    clientPhone?: string,
    clientLat?: number,
    clientLng?: number
  ) => Order | null;
  addReview: (productId: string, rating: number, comment: string, clientName: string) => void;

  // Vendor Operations
  registerVendor: (data: Omit<Vendor, 'id' | 'status' | 'submittedAt' | 'rating' | 'totalSalesCount'>) => Vendor;
  resubmitVendorApplication: (vendorId: string, updatedData: Partial<Vendor>) => void;
  updateVendorLocation: (vendorId: string, address: string, lat: number, lng: number) => void;
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => boolean;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  toggleProductStatus: (productId: string) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatusByVendor: (orderId: string, newStatus: OrderStatus) => void;

  // Admin Operations
  approveVendor: (vendorId: string) => void;
  rejectVendor: (vendorId: string, rejectionReason: string) => void;
  updateVendorByAdmin: (vendorId: string, updatedData: Partial<Vendor>) => void;
  toggleVendorVisibility: (vendorId: string) => void;
  toggleVendorContactVisibility: (vendorId: string) => void;
  suspendVendor: (vendorId: string, reason?: string) => void;
  reactivateVendor: (vendorId: string) => void;
  addCategory: (data: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('app_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Role & active vendor state synced with currentUser
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (currentUser) return currentUser.role;
    return 'CLIENT';
  });

  const [activeVendorId, setActiveVendorId] = useState<string>(() => {
    if (currentUser?.vendorId) return currentUser.vendorId;
    return 'vendor-1';
  });

  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(true);

  // Platform settings state (Taxes, Default Delivery Fee, Commission)
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('app_platform_settings');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('app_platform_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('app_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('app_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('app_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('app_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('app_cart_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartVendorId, setCartVendorId] = useState<string | null>(() => {
    const saved = localStorage.getItem('app_cart_vendor_id');
    return saved ? JSON.parse(saved) : null;
  });
  const [cartVendorName, setCartVendorName] = useState<string | null>(() => {
    const saved = localStorage.getItem('app_cart_vendor_name');
    return saved ? JSON.parse(saved) : null;
  });

  const [cartConflictInfo, setCartConflictInfo] = useState<CartConflictInfo | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const isHydratedFromDb = useRef<boolean>(false);

  // Hydrate initial state from PostgreSQL API (Cloud SQL / Neon)
  useEffect(() => {
    let cancelled = false;
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (Array.isArray(data.users) && data.users.length > 0) setUsers(data.users);
        if (Array.isArray(data.vendors) && data.vendors.length > 0) setVendors(data.vendors);
        if (Array.isArray(data.categories) && data.categories.length > 0) setCategories(data.categories);
        if (Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
        if (Array.isArray(data.orders)) setOrders(data.orders);
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
        if (data.platformSettings) setPlatformSettings(data.platformSettings);
        setTimeout(() => {
          isHydratedFromDb.current = true;
        }, 100);
      })
      .catch(() => {
        isHydratedFromDb.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const syncToPostgres = (payload: Record<string, unknown>) => {
    if (!isHydratedFromDb.current) return;
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  // Sync state to LocalStorage & PostgreSQL
  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
    syncToPostgres({ users });
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_vendors', JSON.stringify(vendors));
    syncToPostgres({ vendors });
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('app_categories', JSON.stringify(categories));
    syncToPostgres({ categories });
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('app_products', JSON.stringify(products));
    syncToPostgres({ products });
  }, [products]);

  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
    syncToPostgres({ orders });
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('app_reviews', JSON.stringify(reviews));
    syncToPostgres({ reviews });
  }, [reviews]);

  useEffect(() => {
    syncToPostgres({ platformSettings });
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem('app_cart_items', JSON.stringify(cartItems));
    localStorage.setItem('app_cart_vendor_id', JSON.stringify(cartVendorId));
    localStorage.setItem('app_cart_vendor_name', JSON.stringify(cartVendorName));
  }, [cartItems, cartVendorId, cartVendorName]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const login = (username: string, password: string) => {
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (!user) {
      return { success: false, message: 'اسم المستخدم غير موجود بالنظام' };
    }

    if (user.password !== password) {
      return { success: false, message: 'كلمة المرور غير صحيحة' };
    }

    setCurrentUser(user);
    setCurrentRole(user.role);

    if (user.role === 'VENDOR' && user.vendorId) {
      setActiveVendorId(user.vendorId);
    }

    addToast(
      'success',
      `أهلاً بك، ${user.name} 👋`,
      `تم تسجيل الدخول بنجاح بصلاحيات: ${
        user.role === 'ADMIN' ? 'المدير العام' : user.role === 'VENDOR' ? 'مورد (أسرة منتجة)' : 'عميل'
      }`
    );

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_current_user');
    addToast('info', 'تم تسجيل الخروج', 'نتطلع لرؤيتك قريباً');
  };

  const registerUser = (data: RegisterUserParams) => {
    const existing = users.find(
      (u) => u.username.toLowerCase() === data.username.toLowerCase().trim()
    );

    if (existing) {
      return { success: false, message: 'اسم المستخدم محجوز مسبقاً، يرجى اختيار اسم آخر' };
    }

    let createdVendorId: string | undefined = undefined;

    // If registering as a Vendor, create Vendor store application
    if (data.role === 'VENDOR' && data.vendorData) {
      createdVendorId = `vendor-${Date.now()}`;
      const newVendor: Vendor = {
        id: createdVendorId,
        name: data.vendorData.storeName,
        ownerName: data.vendorData.ownerName,
        phone: data.phone || '0500000000',
        nationalIdOrCR: data.vendorData.nationalIdOrCR,
        city: data.city || 'الرياض',
        categoryIds: ['cat-1'],
        description: data.vendorData.description,
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        bankAccount: {
          bankName: 'مصرف الراجحي',
          iban: data.vendorData.bankIban || 'SA0000000000000000000000',
          accountHolder: data.vendorData.ownerName
        },
        rating: 0,
        totalSalesCount: 0
      };

      setVendors((prev) => [...prev, newVendor]);
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: data.username.trim(),
      password: data.password.trim(),
      name: data.name.trim(),
      role: data.role,
      vendorId: createdVendorId,
      phone: data.phone,
      city: data.city,
      address: data.address,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);

    if (createdVendorId) {
      setActiveVendorId(createdVendorId);
    }

    return { success: true, user: newUser };
  };

  // DATA ISOLATION GETTERS
  const activeVendor = vendors.find((v) => v.id === activeVendorId);

  // Client Orders: If client logged in, only return their orders
  const getClientOrders = (): Order[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return orders;
    return orders.filter((o) => o.clientId === currentUser.id || o.clientName === currentUser.name);
  };

  // Vendor Orders: If vendor logged in, only return orders placed to their store
  const getVendorOrders = (): Order[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return orders;
    const vId = currentUser.vendorId || activeVendorId;
    return orders.filter((o) => o.vendorId === vId);
  };

  // Vendor Products: Only products belonging to active vendor
  const getVendorProducts = (): Product[] => {
    const vId = currentUser?.vendorId || activeVendorId;
    return products.filter((p) => p.vendorId === vId);
  };

  // Filter products visible to Clients: Must be ACTIVE product AND Vendor must be APPROVED and NOT hidden or suspended!
  const getVisibleProductsForClient = (): Product[] => {
    return products.filter((p) => {
      if (p.status !== 'ACTIVE') return false;
      const vendor = vendors.find((v) => v.id === p.vendorId);
      return vendor && vendor.status === 'APPROVED' && !vendor.isHidden;
    });
  };

  // CART LOGIC - Single Vendor Restriction
  const addToCart = (product: Product, quantity = 1) => {
    if (!cartVendorId || cartItems.length === 0 || cartVendorId === product.vendorId) {
      setCartVendorId(product.vendorId);
      setCartVendorName(product.vendorName);

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [...prev, { product, quantity }];
        }
      });

      addToast(
        'success',
        'تمت الإضافة للسلة',
        `تمت إضافة "${product.name}" من ${product.vendorName}`
      );
    } else {
      setCartConflictInfo({
        existingVendorId: cartVendorId,
        existingVendorName: cartVendorName || 'أسرة أخرى',
        newProduct: product,
        newQuantity: quantity
      });
    }
  };

  const confirmSwitchVendorAndAddToCart = () => {
    if (!cartConflictInfo) return;
    const { newProduct, newQuantity } = cartConflictInfo;

    setCartItems([{ product: newProduct, quantity: newQuantity }]);
    setCartVendorId(newProduct.vendorId);
    setCartVendorName(newProduct.vendorName);
    setCartConflictInfo(null);

    addToast(
      'info',
      'تم تغيير الأسرة المنتجة',
      `تم إفراغ السلة السابقة وبدء سلة جديدة لـ "${newProduct.vendorName}"`
    );
  };

  const dismissCartConflict = () => {
    setCartConflictInfo(null);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      if (updated.length === 0) {
        setCartVendorId(null);
        setCartVendorName(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartVendorId(null);
    setCartVendorName(null);
  };

  // Checkout Flow
  const checkoutCart = (
    deliveryAddress: string,
    paymentMethod: 'MADA' | 'APPLE_PAY' | 'CASH',
    notes?: string,
    clientName = currentUser?.name || 'عميل المنصة',
    clientPhone = currentUser?.phone || '0500000000',
    clientLat = 24.8100,
    clientLng = 46.6500
  ): Order | null => {
    if (cartItems.length === 0 || !cartVendorId) {
      addToast('error', 'السلة فارغة', 'يرجى إضافة منتجات للسلة أولاً');
      return null;
    }

    const vendor = vendors.find((v) => v.id === cartVendorId);
    const vendorLat = vendor?.lat || 24.7950;
    const vendorLng = vendor?.lng || 46.6250;
    const vendorAddress = vendor?.address || `${vendor?.city || 'الرياض'} - المقر الرئيسي للأسرة`;
    const commissionRate = vendor?.commissionRate ?? platformSettings.defaultCommissionRate;

    // Subtotal product prices
    const subtotalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate Tax Amount (VAT 15%)
    const taxRate = platformSettings.taxPercentage;
    const taxAmount = Math.round(((subtotalAmount * taxRate) / 100) * 100) / 100;

    // Calculate distance & dynamic delivery fee
    const distanceKm = calculateDistanceKm(vendorLat, vendorLng, clientLat, clientLng);
    const extraKm = Math.max(0, distanceKm - 3);
    const dynamicDeliveryFee = Math.round(
      platformSettings.defaultDeliveryFee + extraKm * platformSettings.baseDeliveryFeeKm
    );

    // Platform Commission
    const commissionAmount = Math.round(((subtotalAmount * commissionRate) / 100) * 100) / 100;

    // Grand Total (Products + Tax + Delivery)
    const grandTotal = Math.round((subtotalAmount + taxAmount + dynamicDeliveryFee) * 100) / 100;

    // Estimated preparation & delivery time
    const maxPrepTime = Math.max(...cartItems.map((ci) => ci.product.prepTimeMinutes || 15));
    const travelTime = Math.max(8, Math.round(distanceKm * 2.5));
    const estimatedDeliveryMinutes = maxPrepTime + travelTime;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentUser?.id || 'client-user',
      clientName,
      clientPhone,
      vendorId: cartVendorId,
      vendorName: cartVendorName || 'الأسرة المنتجة',
      vendorAddress,
      vendorLat,
      vendorLng,
      items: cartItems.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        unit: ci.product.unit
      })),
      subtotalAmount,
      taxRate,
      taxAmount,
      deliveryFee: dynamicDeliveryFee,
      commissionRate,
      commissionAmount,
      grandTotal,
      deliveryAddress,
      clientLat,
      clientLng,
      distanceKm,
      estimatedDeliveryMinutes,
      driverLat: vendorLat,
      driverLng: vendorLng,
      paymentMethod,
      status: 'PENDING',
      notes,
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    setVendors((prev) =>
      prev.map((v) =>
        v.id === cartVendorId
          ? { ...v, totalSalesCount: v.totalSalesCount + cartItems.length }
          : v
      )
    );

    clearCart();
    addToast('success', 'تم إرسال الطلب بنجاح! 🎉', `رقم الطلب: ${newOrder.id} للأسرة: ${newOrder.vendorName}`);
    return newOrder;
  };

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('success', 'تم حفظ إعدادات المنصة', 'تم تحديث قيمة الضريبة ورسوم التوصيل والعمولة بنجاح.');
  };

  const updateVendorCommission = (vendorId: string, commissionRate: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, commissionRate } : v))
    );
    addToast('success', 'تحديث نسبة العمولة', `تم تحديد نسبة عمولة المنصة للمورد بـ ${commissionRate}%`);
  };

  const updateVendorLocation = (vendorId: string, address: string, lat: number, lng: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, address, lat, lng } : v))
    );
    addToast('success', 'تحديث عنوان المتجر', 'تم حفظ الموقع الجغرافي والعنوان بنجاح');
  };

  const addReview = (
    productId: string,
    rating: number,
    comment: string,
    clientName: string
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      clientName: currentUser?.name || clientName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setReviews((prev) => [newRev, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === productId), newRev];
          const avg =
            prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: prodReviews.length
          };
        }
        return p;
      })
    );

    addToast('success', 'شكراً لتقييمك', 'تم نشر تقييمك للمنتج بنجاح');
  };

  // VENDOR OPERATIONS
  const registerVendor = (
    data: Omit<Vendor, 'id' | 'status' | 'submittedAt' | 'rating' | 'totalSalesCount'>
  ): Vendor => {
    const newVendor: Vendor = {
      ...data,
      id: `vendor-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      rating: 0,
      totalSalesCount: 0
    };

    setVendors((prev) => [...prev, newVendor]);
    setActiveVendorId(newVendor.id);
    addToast(
      'info',
      'تم إرسال طلب الانضمام',
      'طلبك الآن قيد المراجعة لدى إدارة المنصة. سيتم إشعارك فور الاعتماد.'
    );
    return newVendor;
  };

  const resubmitVendorApplication = (vendorId: string, updatedData: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            ...updatedData,
            status: 'PENDING',
            rejectionReason: undefined,
            submittedAt: new Date().toISOString()
          };
        }
        return v;
      })
    );
    addToast('info', 'تمت إعادة تقديم الطلب', 'تم تحديث البيانات وإعادة إرسال الطلب للمراجعة.');
  };

  const addProduct = (
    data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>
  ): boolean => {
    const vendor = vendors.find((v) => v.id === data.vendorId);
    if (!vendor || vendor.status !== 'APPROVED') {
      addToast(
        'error',
        'غير مصرح بتقديم المنتجات',
        'لا يمكنك إضافة منتجات إلا بعد اعتماد حسابك التجاري ورخصتك الرسمية من المدير.'
      );
      return false;
    }

    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    setProducts((prev) => [newProd, ...prev]);
    addToast('success', 'تم إضافة المنتج', `تم إضافة "${newProd.name}" إلى متجرك بنجاح`);
    return true;
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...data } : p))
    );
    addToast('success', 'تم التحديث', 'تم حفظ تعديلات المنتج بنجاح');
  };

  const toggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus: ProductStatus = p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          addToast(
            'info',
            nextStatus === 'ACTIVE' ? 'تم تنشيط المنتج' : 'تم إيقاف المنتج مؤقتاً',
            `حالة المنتج الآن: ${nextStatus === 'ACTIVE' ? 'نشط ويظهر للعملاء' : 'موقوف ولا يظهر في السوق'}`
          );
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('warning', 'تم حذف المنتج', 'تم إزالة المنتج من قائمة منتجاتك');
  };

  const updateOrderStatusByVendor = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    const statusLabels: Record<OrderStatus, string> = {
      PENDING: 'جديد قيد الانتظار',
      PREPARING: 'جاري التحضير',
      DELIVERING: 'جاري التوصيل',
      COMPLETED: 'تم التسليم بنجاح',
      CANCELLED: 'ملغي'
    };
    addToast('info', 'تحديث حالة الطلب', `تم تغيير حالة الطلب ${orderId} إلى: ${statusLabels[newStatus]}`);
  };

  // ADMIN OPERATIONS
  const approveVendor = (vendorId: string) => {
    const now = new Date().toISOString();
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, status: 'APPROVED', approvedAt: now, rejectionReason: undefined }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    addToast(
      'success',
      'تم اعتماد المورد رسمياً! ✅',
      `تم اعتماد "${vendor?.name || 'الأسرة'}" وأصبحت منتجاتها النشطة تظهر فوراً للعملاء.`
    );
  };

  const rejectVendor = (vendorId: string, rejectionReason: string) => {
    if (!rejectionReason.trim()) {
      addToast('error', 'سبب الرفض مطلوب', 'يرجى تدوين سبب الرفض لتوضيحه للمورد وزيادة الشفافية.');
      return;
    }

    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, status: 'REJECTED', rejectionReason: rejectionReason.trim() }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    addToast(
      'warning',
      'تم رفض طلب المورد ❌',
      `تم تسجيل سبب الرفض وتنبيه "${vendor?.name || 'الأسرة'}" لتعديل بياناتها.`
    );
  };

  const updateVendorByAdmin = (vendorId: string, updatedData: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, ...updatedData } : v))
    );
    addToast('success', 'تم تعديل بيانات المورد ✏️', 'تم حفظ التعديلات الشاملة للمورد بواسطة الإدارة بنجاح.');
  };

  const toggleVendorVisibility = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const isHidden = !v.isHidden;
          addToast(
            'info',
            isHidden ? 'تم إخفاء المورد 👁️‍🗨️' : 'تم إظهار المورد 👁️',
            isHidden
              ? 'تم حجب المورد ومنتجاته عن سوق العملاء'
              : 'أصبح المورد ومنتجاته ظاهرين للعملاء في نتائج البحث'
          );
          return { ...v, isHidden };
        }
        return v;
      })
    );
  };

  const toggleVendorContactVisibility = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const hideContactDetails = !v.hideContactDetails;
          addToast(
            'info',
            hideContactDetails ? 'تم حجب البيانات 🔒' : 'تم إظهار البيانات 🔓',
            hideContactDetails
              ? 'تم إخفاء رقم التواصل والوثائق الرسمية للمورد عن العرض العام'
              : 'تمت إتاحة عرض بيانات التواصل والوثائق للعامة'
          );
          return { ...v, hideContactDetails };
        }
        return v;
      })
    );
  };

  const suspendVendor = (vendorId: string, reason?: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'SUSPENDED',
              suspensionReason: reason || 'تم إيقاف التعامل بقرار إداري تحفظي'
            }
          : v
      )
    );
    addToast('error', 'تم إيقاف التعامل مع المورد 🛑', 'تم تجميد حساب المورد وتعليق استلام الطلبات حتى إشعار آخر.');
  };

  const reactivateVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'APPROVED',
              suspensionReason: undefined
            }
          : v
      )
    );
    addToast('success', 'تمت إعادة تفعيل التعامل ✅', 'تم رفع تجميد المورد وعودته للعمل بصفة منتظمة.');
  };

  const addCategory = (data: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'قسم جديد', `تم إنشاء قسم "${newCat.name}" بنجاح`);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    addToast('success', 'تم حفظ القسم', 'تم تحديث بيانات القسم بنجاح');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('warning', 'تم حذف القسم', 'تم إزالة القسم من شجرة أقسام السوق');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        registerUser,
        currentRole,
        setCurrentRole,
        activeVendorId,
        setActiveVendorId,
        activeVendor,
        isMobileSimulator,
        setIsMobileSimulator,
        platformSettings,
        updatePlatformSettings,
        updateVendorCommission,
        getClientOrders,
        getVendorOrders,
        getVendorProducts,
        vendors,
        categories,
        products,
        orders,
        reviews,
        cartItems,
        cartVendorId,
        cartVendorName,
        cartConflictInfo,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        confirmSwitchVendorAndAddToCart,
        dismissCartConflict,
        getVisibleProductsForClient,
        checkoutCart,
        addReview,
        registerVendor,
        resubmitVendorApplication,
        updateVendorLocation,
        addProduct,
        updateProduct,
        toggleProductStatus,
        deleteProduct,
        updateOrderStatusByVendor,
        approveVendor,
        rejectVendor,
        updateVendorByAdmin,
        toggleVendorVisibility,
        toggleVendorContactVisibility,
        suspendVendor,
        reactivateVendor,
        addCategory,
        updateCategory,
        deleteCategory,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
