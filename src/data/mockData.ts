import { Vendor, Category, Product, Order, Review, UserAccount, PlatformSettings } from '../types';

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  taxPercentage: 15, // 15% VAT
  defaultDeliveryFee: 15, // 15 SAR base delivery
  defaultCommissionRate: 10, // 10% platform commission on vendors
  baseDeliveryFeeKm: 1.5 // 1.5 SAR per additional Km
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: '123',
    name: 'مدير المنصة العام',
    role: 'ADMIN',
    phone: '0500000000',
    city: 'الرياض',
    createdAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'user-vendor-1',
    username: 'um_khaled',
    password: '123',
    name: 'نورة العتيبي (أم خالد)',
    role: 'VENDOR',
    vendorId: 'vendor-1',
    phone: '0501234567',
    city: 'الرياض',
    address: 'الرياض - حي الملقا - شارع حائل - مطبخ أم خالد',
    lat: 24.7950,
    lng: 46.6250,
    createdAt: '2026-07-15T10:00:00Z'
  },
  {
    id: 'user-vendor-2',
    username: 'sara_sweets',
    password: '123',
    name: 'منى الشهري (أم أحمد)',
    role: 'VENDOR',
    vendorId: 'vendor-2',
    phone: '0559876543',
    city: 'جدة',
    address: 'جدة - حي الشاطئ - طريق الكورنيش - متجر أم أحمد',
    lat: 21.5900,
    lng: 39.1200,
    createdAt: '2026-07-18T11:20:00Z'
  },
  {
    id: 'user-vendor-3',
    username: 'um_sara',
    password: '123',
    name: 'حصة الدوسري (أم سارة)',
    role: 'VENDOR',
    vendorId: 'vendor-3',
    phone: '0543210987',
    city: 'الدمام',
    address: 'الدمام - حي الشاطئ الشرقي - شارع 18',
    lat: 26.4400,
    lng: 50.1200,
    createdAt: '2026-07-30T16:45:00Z'
  },
  {
    id: 'user-vendor-4',
    username: 'um_abdulaziz',
    password: '123',
    name: 'فاطمة المطيري (أم عبد العزيز)',
    role: 'VENDOR',
    vendorId: 'vendor-4',
    phone: '0567788990',
    city: 'القصيم',
    address: 'بريدة - حي الأفق - طريق الملك فهد',
    lat: 26.3400,
    lng: 43.9800,
    createdAt: '2026-07-25T08:10:00Z'
  },
  {
    id: 'client-1',
    username: 'ahmed',
    password: '123',
    name: 'عبدالله السليمان',
    role: 'CLIENT',
    phone: '0501112233',
    city: 'الرياض',
    address: 'الرياض - حي الياسمين - شارع الملك عبدالعزيز - منزل 14',
    lat: 24.8100,
    lng: 46.6500,
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'client-2',
    username: 'sara',
    password: '123',
    name: 'مريم العلي',
    role: 'CLIENT',
    phone: '0554445566',
    city: 'جدة',
    address: 'جدة - حي الشاطئ - أبراج الكورنيش',
    lat: 21.5700,
    lng: 39.1300,
    createdAt: '2026-07-22T14:00:00Z'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'أكلات شعبية وتراثية',
    icon: 'UtensilsCrossed',
    description: 'جريش، قرصان، كبسة نجدية، حنيني ومأكولات منزلية طازجة'
  },
  {
    id: 'cat-2',
    name: 'حلويات ومخبوزات',
    icon: 'Cake',
    description: 'معمول العيد، كيكات خاصة، كليجة نجدية، وحلويات القهوة'
  },
  {
    id: 'cat-3',
    name: 'مشغولات يدوية وتطريز',
    icon: 'Scissors',
    description: 'خياطة وتطريز، ثياب تراثية، طقوم ضيافة، وسلال خوص'
  },
  {
    id: 'cat-4',
    name: 'بهارات وخلطات خاصة',
    icon: 'Sparkles',
    description: 'بهارات مشكلة، خلطات قهوة عربية، دقة، ودبس التمر الصافي'
  },
  {
    id: 'cat-5',
    name: 'هدايا وتوزيعات مناسبات',
    icon: 'Gift',
    description: 'توزيعات المواليد، زواجات، وباقات هدايا مصممة يدوياً'
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'أسرة أم خالد - المطابخ الشعبية',
    ownerName: 'نورة العتيبي',
    phone: '0501234567',
    nationalIdOrCR: 'FL-10928374',
    city: 'الرياض',
    address: 'الرياض - حي الملقا - شارع حائل - مطبخ أم خالد',
    lat: 24.7950,
    lng: 46.6250,
    commissionRate: 10,
    categoryIds: ['cat-1', 'cat-4'],
    description: 'نعدّ لكم ألذ المأكولات الشعبية والنجدية الأصلية بأيدي سعودية وبأعلى معايير الجودة والنظافة.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    status: 'APPROVED',
    submittedAt: '2026-07-15T10:00:00Z',
    approvedAt: '2026-07-16T14:30:00Z',
    bankAccount: {
      bankName: 'مصرف الراجحي',
      iban: 'SA4480000001234567890123',
      accountHolder: 'نورة محمد العتيبي'
    },
    rating: 4.9,
    totalSalesCount: 142
  },
  {
    id: 'vendor-2',
    name: 'أسرة أم أحمد - معمول وحلويات القهوة',
    ownerName: 'منى الشهري',
    phone: '0559876543',
    nationalIdOrCR: 'FL-99887766',
    city: 'جدة',
    address: 'جدة - حي الشاطئ - طريق الكورنيش - متجر أم أحمد',
    lat: 21.5900,
    lng: 39.1200,
    commissionRate: 12,
    categoryIds: ['cat-2'],
    description: 'متخصصون في صنع المعمول الفاخر بتمر المدينة والزبادي النقي، وحلويات الضيافة المتميزة.',
    logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
    status: 'APPROVED',
    submittedAt: '2026-07-18T11:20:00Z',
    approvedAt: '2026-07-19T09:15:00Z',
    bankAccount: {
      bankName: 'البنك الأهلي السعودي',
      iban: 'SA1210000009876543210987',
      accountHolder: 'منى أحمد الشهري'
    },
    rating: 4.8,
    totalSalesCount: 89
  },
  {
    id: 'vendor-3',
    name: 'أسرة أم سارة - خياطة ومطرزات تراثية',
    ownerName: 'حصة الدوسري',
    phone: '0543210987',
    nationalIdOrCR: 'FL-55443322',
    city: 'الدمام',
    address: 'الدمام - حي الشاطئ الشرقي - شارع 18',
    lat: 26.4400,
    lng: 50.1200,
    commissionRate: 10,
    categoryIds: ['cat-3', 'cat-5'],
    description: 'تطريز يدوي على المفارش، وطقوم الضيافة الرمضانية والتراثية بلمسات فنية راقية.',
    logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    status: 'PENDING',
    submittedAt: '2026-07-30T16:45:00Z',
    bankAccount: {
      bankName: 'بنك الرياض',
      iban: 'SA2020000005544332211000',
      accountHolder: 'حصة سعد الدوسري'
    },
    rating: 0,
    totalSalesCount: 0
  },
  {
    id: 'vendor-4',
    name: 'أسرة أم عبد العزيز - بهارات وقهوة نجدية',
    ownerName: 'فاطمة المطيري',
    phone: '0567788990',
    nationalIdOrCR: 'FL-33221144',
    city: 'القصيم',
    address: 'بريدة - حي الأفق - طريق الملك فهد',
    lat: 26.3400,
    lng: 43.9800,
    commissionRate: 10,
    categoryIds: ['cat-4'],
    description: 'خلطات بهارات نجدية مجهزة طازجة يومياً، وقهوة عربية بالهيل والزعفران الأصلي.',
    logo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
    status: 'REJECTED',
    rejectionReason: 'السجل التجاري أو وثيقة العمل الحر غير واضحة، يرجى إعادة إرفاق صورة واضحة للوثيقة الرسمية وحساب IBAN مطابق لاسم المالك.',
    submittedAt: '2026-07-25T08:10:00Z',
    bankAccount: {
      bankName: 'مصرف الراجحي',
      iban: 'SA8880000003322114455667',
      accountHolder: 'فاطمة المطيري'
    },
    rating: 0,
    totalSalesCount: 0
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    vendorId: 'vendor-1',
    vendorName: 'أسرة أم خالد - المطابخ الشعبية',
    name: 'جريش نجدي باللبن والمسمنة',
    description: 'جريش نجدي فاخر محضر على نار هادئة مع اللبن الطازج وكشنة المسمنة العبقة.',
    price: 45,
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE',
    stock: 20,
    unit: 'حافظة وسط',
    prepTimeMinutes: 45,
    rating: 4.9,
    reviewCount: 28,
    createdAt: '2026-07-17T12:00:00Z'
  },
  {
    id: 'prod-102',
    vendorId: 'vendor-1',
    vendorName: 'أسرة أم خالد - المطابخ الشعبية',
    name: 'قرصان بالخضار واللحم البلدي',
    description: 'أقراص القرصان الرقيقة المغطاة بإدام الخضار المشكلة ولحم الغنم البلدي.',
    price: 60,
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE',
    stock: 15,
    unit: 'طبق كبير',
    prepTimeMinutes: 60,
    rating: 5.0,
    reviewCount: 19,
    createdAt: '2026-07-17T12:30:00Z'
  },
  {
    id: 'prod-103',
    vendorId: 'vendor-1',
    vendorName: 'أسرة أم خالد - المطابخ الشعبية',
    name: 'حنيني بالتمر الخلاص والسمن',
    description: 'حنيني دافئ محضر من قرصان البر وتمر الخلاص مع السمن البلدي المعطر.',
    price: 35,
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE',
    stock: 25,
    unit: 'علبة 1 كجم',
    prepTimeMinutes: 30,
    rating: 4.8,
    reviewCount: 15,
    createdAt: '2026-07-18T09:00:00Z'
  },
  {
    id: 'prod-104',
    vendorId: 'vendor-1',
    vendorName: 'أسرة أم خالد - المطابخ الشعبية',
    name: 'مرقوق بالخضار العضوية (موقوف مؤقتاً)',
    description: 'مرقوق نجدي أصيل بالحمل والقرع والباذنجان (موقوف لحين توفر الخضار الطازجة).',
    price: 55,
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    status: 'PAUSED', // ⚠️ Test case for product status logic!
    stock: 0,
    unit: 'طبق',
    prepTimeMinutes: 50,
    rating: 4.7,
    reviewCount: 12,
    createdAt: '2026-07-20T10:00:00Z'
  },

  // Vendor 2 products
  {
    id: 'prod-201',
    vendorId: 'vendor-2',
    vendorName: 'أسرة أم أحمد - معمول وحلويات القهوة',
    name: 'معمول فاخر بتمر المدينة (علبة كيلو)',
    description: 'معمول هشش يذوب في الفم، محشو بتمر معجون بالهيل والسمسم والزبادي.',
    price: 50,
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE',
    stock: 40,
    unit: 'علبة (كيلو)',
    prepTimeMinutes: 20,
    rating: 4.9,
    reviewCount: 34,
    createdAt: '2026-07-19T14:00:00Z'
  },
  {
    id: 'prod-202',
    vendorId: 'vendor-2',
    vendorName: 'أسرة أم أحمد - معمول وحلويات القهوة',
    name: 'كليجة القصيم الملكية بدبس التمر',
    description: 'أقراص الكليجة المقرمشة والمحشوة بالهيل والقرفة ودبس التمر الفاخر.',
    price: 40,
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE',
    stock: 30,
    unit: 'علبة (24 قطعة)',
    prepTimeMinutes: 15,
    rating: 4.7,
    reviewCount: 22,
    createdAt: '2026-07-20T11:00:00Z'
  },
  {
    id: 'prod-203',
    vendorId: 'vendor-2',
    vendorName: 'أسرة أم أحمد - معمول وحلويات القهوة',
    name: 'صينية حلى القهوة المشكل (30 قطعة)',
    description: 'مجموعة مختارة من حلى التشيز كيك المصغر، كرات اللوتس، وتارت الفستق.',
    price: 85,
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE',
    stock: 10,
    unit: 'صينية ضيافة',
    prepTimeMinutes: 40,
    rating: 4.8,
    reviewCount: 17,
    createdAt: '2026-07-21T15:00:00Z'
  },

  // Vendor 3 products (Vendor status is PENDING - Products MUST NOT show to Client!)
  {
    id: 'prod-301',
    vendorId: 'vendor-3',
    vendorName: 'أسرة أم سارة - خياطة ومطرزات تراثية',
    name: 'طقم مفارش طاولة طعام مطرز يدوياً',
    description: 'طقم سفرة مكون من 8 مفارش مع مفرش رئيسي بتطريز تراثي أنيق.',
    price: 220,
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIVE', // Active product, BUT vendor is pending approval!
    stock: 5,
    unit: 'طقم كامل',
    prepTimeMinutes: 180,
    rating: 0,
    reviewCount: 0,
    createdAt: '2026-07-30T17:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9081',
    clientId: 'client-1',
    clientName: 'عبدالله السليمان',
    clientPhone: '0501112233',
    vendorId: 'vendor-1',
    vendorName: 'أسرة أم خالد - المطابخ الشعبية',
    items: [
      {
        productId: 'prod-101',
        productName: 'جريش نجدي باللبن والمسمنة',
        price: 45,
        quantity: 2,
        unit: 'حافظة وسط'
      },
      {
        productId: 'prod-103',
        productName: 'حنيني بالتمر الخلاص والسمن',
        price: 35,
        quantity: 1,
        unit: 'علبة 1 كجم'
      }
    ],
    subtotalAmount: 125,
    deliveryFee: 15,
    grandTotal: 140,
    deliveryAddress: 'الرياض - حي الياسمين - شارع الملك عبدالعزيز - منزل 14',
    paymentMethod: 'APPLE_PAY',
    status: 'PREPARING',
    notes: 'الرجاء الإكثار من المسمنة على الجريش وشكراً.',
    createdAt: '2026-08-01T04:15:00Z'
  },
  {
    id: 'ORD-9075',
    clientId: 'client-2',
    clientName: 'مريم العلي',
    clientPhone: '0554445566',
    vendorId: 'vendor-2',
    vendorName: 'أسرة أم أحمد - معمول وحلويات القهوة',
    items: [
      {
        productId: 'prod-201',
        productName: 'معمول فاخر بتمر المدينة (علبة كيلو)',
        price: 50,
        quantity: 2,
        unit: 'علبة (كيلو)'
      }
    ],
    subtotalAmount: 100,
    deliveryFee: 15,
    grandTotal: 115,
    deliveryAddress: 'جدة - حي الشاطئ - أبراج الكورنيش',
    paymentMethod: 'MADA',
    status: 'COMPLETED',
    notes: 'تغليف هدايا إذا أمكن.',
    createdAt: '2026-07-31T18:20:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-101',
    clientName: 'سعد العتيبي',
    rating: 5,
    comment: 'ما شاء الله تبارك الله، الجريش لذيذ ودافئ ووصل في الوقت المناسب بالضبط! طعم شغل البيت الأصلي.',
    createdAt: '2026-07-28T19:10:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-101',
    clientName: 'هند الدوسري',
    rating: 5,
    comment: 'أفضل جريش ذقته بالرياض، المسمنة موزونة واللبن طازج.',
    createdAt: '2026-07-29T13:40:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-201',
    clientName: 'أريج الغامدي',
    rating: 5,
    comment: 'المعمول هشششش ويذوب بالفم وطعم الهيل واضح وممتاز. بإذن الله راح أطلب دايم.',
    createdAt: '2026-07-30T16:00:00Z'
  }
];
