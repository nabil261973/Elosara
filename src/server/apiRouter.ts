import express from 'express';
import { getDb } from '../db/index';
import {
  users as usersTable,
  vendors as vendorsTable,
  categories as categoriesTable,
  products as productsTable,
  orders as ordersTable,
  reviews as reviewsTable,
  platformSettingsTable,
} from '../db/schema';
import {
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_PLATFORM_SETTINGS,
} from '../data/mockData';
import {
  UserAccount,
  Vendor,
  Category,
  Product,
  Order,
  Review,
  PlatformSettings,
} from '../types';

export const apiRouter = express.Router();

const mapRowToUser = (r: typeof usersTable.$inferSelect): UserAccount => ({
  id: r.id,
  username: r.username,
  password: r.password,
  name: r.name,
  role: r.role as UserAccount['role'],
  vendorId: r.vendorId ?? undefined,
  phone: r.phone ?? undefined,
  city: r.city ?? undefined,
  address: r.address ?? undefined,
  lat: r.lat ?? undefined,
  lng: r.lng ?? undefined,
  createdAt: r.createdAt,
});

const mapRowToVendor = (r: typeof vendorsTable.$inferSelect): Vendor => ({
  id: r.id,
  name: r.name,
  ownerName: r.ownerName,
  phone: r.phone,
  nationalIdOrCR: r.nationalIdOrCR,
  city: r.city,
  address: r.address ?? undefined,
  lat: r.lat ?? undefined,
  lng: r.lng ?? undefined,
  categoryIds: r.categoryIds || [],
  description: r.description,
  logo: r.logo,
  banner: r.banner,
  status: r.status as Vendor['status'],
  rejectionReason: r.rejectionReason ?? undefined,
  suspensionReason: r.suspensionReason ?? undefined,
  isHidden: r.isHidden ?? undefined,
  hideContactDetails: r.hideContactDetails ?? undefined,
  submittedAt: r.submittedAt,
  approvedAt: r.approvedAt ?? undefined,
  bankAccount: r.bankAccount || { bankName: '', iban: '', accountHolder: '' },
  commissionRate: r.commissionRate ?? undefined,
  rating: r.rating,
  totalSalesCount: r.totalSalesCount,
});

const mapRowToCategory = (r: typeof categoriesTable.$inferSelect): Category => ({
  id: r.id,
  name: r.name,
  icon: r.icon,
  description: r.description,
});

const mapRowToProduct = (r: typeof productsTable.$inferSelect): Product => ({
  id: r.id,
  vendorId: r.vendorId,
  vendorName: r.vendorName,
  name: r.name,
  description: r.description,
  price: r.price,
  categoryId: r.categoryId,
  image: r.image,
  status: r.status as Product['status'],
  stock: r.stock,
  unit: r.unit,
  prepTimeMinutes: r.prepTimeMinutes,
  rating: r.rating,
  reviewCount: r.reviewCount,
  createdAt: r.createdAt,
});

const mapRowToOrder = (r: typeof ordersTable.$inferSelect): Order => ({
  id: r.id,
  clientId: r.clientId,
  clientName: r.clientName,
  clientPhone: r.clientPhone,
  vendorId: r.vendorId,
  vendorName: r.vendorName,
  vendorAddress: r.vendorAddress ?? undefined,
  vendorLat: r.vendorLat ?? undefined,
  vendorLng: r.vendorLng ?? undefined,
  items: r.items || [],
  subtotalAmount: r.subtotalAmount ?? undefined,
  taxRate: r.taxRate ?? undefined,
  taxAmount: r.taxAmount ?? undefined,
  deliveryFee: r.deliveryFee,
  commissionRate: r.commissionRate ?? undefined,
  commissionAmount: r.commissionAmount ?? undefined,
  grandTotal: r.grandTotal,
  deliveryAddress: r.deliveryAddress,
  clientLat: r.clientLat ?? undefined,
  clientLng: r.clientLng ?? undefined,
  distanceKm: r.distanceKm ?? undefined,
  estimatedDeliveryMinutes: r.estimatedDeliveryMinutes ?? undefined,
  driverLat: r.driverLat ?? undefined,
  driverLng: r.driverLng ?? undefined,
  paymentMethod: (r.paymentMethod as Order['paymentMethod']) || 'MADA',
  status: r.status as Order['status'],
  notes: r.notes ?? undefined,
  createdAt: r.createdAt,
});

const mapRowToReview = (r: typeof reviewsTable.$inferSelect): Review => ({
  id: r.id,
  productId: r.productId,
  clientName: r.clientName,
  rating: r.rating,
  comment: r.comment,
  createdAt: r.createdAt,
});

let isSeeded = false;

async function ensureSeeded() {
  if (isSeeded) return;
  const db = await getDb();
  const existingUsers = await db.select().from(usersTable).limit(1);
  if (existingUsers.length === 0) {
    if (INITIAL_USERS.length > 0) {
      await db.insert(usersTable).values(INITIAL_USERS).onConflictDoNothing();
    }
    if (INITIAL_VENDORS.length > 0) {
      await db.insert(vendorsTable).values(INITIAL_VENDORS).onConflictDoNothing();
    }
    if (INITIAL_CATEGORIES.length > 0) {
      await db.insert(categoriesTable).values(INITIAL_CATEGORIES).onConflictDoNothing();
    }
    if (INITIAL_PRODUCTS.length > 0) {
      await db.insert(productsTable).values(INITIAL_PRODUCTS).onConflictDoNothing();
    }
    if (INITIAL_ORDERS.length > 0) {
      await db.insert(ordersTable).values(INITIAL_ORDERS).onConflictDoNothing();
    }
    if (INITIAL_REVIEWS.length > 0) {
      await db.insert(reviewsTable).values(INITIAL_REVIEWS).onConflictDoNothing();
    }
    await db
      .insert(platformSettingsTable)
      .values({ id: 'default', ...INITIAL_PLATFORM_SETTINGS })
      .onConflictDoNothing();
  }
  isSeeded = true;
}

apiRouter.get('/health', async (_req, res) => {
  try {
    await ensureSeeded();
    const isNeon = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    res.json({
      ok: true,
      database: isNeon ? 'Neon PostgreSQL' : 'Google Cloud SQL PostgreSQL (europe-west3)',
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'Database error' });
  }
});

apiRouter.get('/state', async (_req, res) => {
  try {
    await ensureSeeded();
    const db = await getDb();

    const [
      userRows,
      vendorRows,
      categoryRows,
      productRows,
      orderRows,
      reviewRows,
      settingsRows,
    ] = await Promise.all([
      db.select().from(usersTable),
      db.select().from(vendorsTable),
      db.select().from(categoriesTable),
      db.select().from(productsTable),
      db.select().from(ordersTable),
      db.select().from(reviewsTable),
      db.select().from(platformSettingsTable),
    ]);

    const settingsRow = settingsRows[0];
    const platformSettings: PlatformSettings = settingsRow
      ? {
          taxPercentage: settingsRow.taxPercentage,
          defaultDeliveryFee: settingsRow.defaultDeliveryFee,
          defaultCommissionRate: settingsRow.defaultCommissionRate,
          baseDeliveryFeeKm: settingsRow.baseDeliveryFeeKm,
        }
      : INITIAL_PLATFORM_SETTINGS;

    res.json({
      users: userRows.map(mapRowToUser),
      vendors: vendorRows.map(mapRowToVendor),
      categories: categoryRows.map(mapRowToCategory),
      products: productRows.map(mapRowToProduct),
      orders: orderRows.map(mapRowToOrder),
      reviews: reviewRows.map(mapRowToReview),
      platformSettings,
    });
  } catch (err: any) {
    console.error('Error fetching state from PostgreSQL:', err);
    res.status(500).json({ error: err?.message || 'Failed to load state' });
  }
});

apiRouter.post('/sync', async (req, res) => {
  try {
    await ensureSeeded();
    const db = await getDb();
    const {
      users,
      vendors,
      categories,
      products,
      orders,
      reviews,
      platformSettings,
    } = req.body as {
      users?: UserAccount[];
      vendors?: Vendor[];
      categories?: Category[];
      products?: Product[];
      orders?: Order[];
      reviews?: Review[];
      platformSettings?: PlatformSettings;
    };

    if (Array.isArray(users)) {
      await db.delete(usersTable);
      if (users.length > 0) await db.insert(usersTable).values(users);
    }
    if (Array.isArray(vendors)) {
      await db.delete(vendorsTable);
      if (vendors.length > 0) await db.insert(vendorsTable).values(vendors);
    }
    if (Array.isArray(categories)) {
      await db.delete(categoriesTable);
      if (categories.length > 0) await db.insert(categoriesTable).values(categories);
    }
    if (Array.isArray(products)) {
      await db.delete(productsTable);
      if (products.length > 0) await db.insert(productsTable).values(products);
    }
    if (Array.isArray(orders)) {
      await db.delete(ordersTable);
      if (orders.length > 0) await db.insert(ordersTable).values(orders);
    }
    if (Array.isArray(reviews)) {
      await db.delete(reviewsTable);
      if (reviews.length > 0) await db.insert(reviewsTable).values(reviews);
    }
    if (platformSettings) {
      await db.delete(platformSettingsTable);
      await db
        .insert(platformSettingsTable)
        .values({ id: 'default', ...platformSettings });
    }

    res.json({ ok: true });
  } catch (err: any) {
    console.error('Error syncing state to PostgreSQL:', err);
    res.status(500).json({ error: err?.message || 'Failed to sync state' });
  }
});
