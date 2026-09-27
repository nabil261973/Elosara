import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Search,
  Star,
  Clock,
  CheckCircle2,
  Plus,
  Store,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

// Helper to normalize Arabic text for more accurate searching alongside standard case-insensitive matching
const normalizeSearchText = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
};

export const ProductCatalog: React.FC = () => {
  const {
    categories,
    vendors,
    getVisibleProductsForClient,
    addToCart
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Get strictly eligible client products (Active products from Approved Vendors only!)
  const eligibleProducts = getVisibleProductsForClient();

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const normalizedQuery = normalizeSearchText(searchQuery);

  // Filter by product name or vendor name, plus category and vendor selector
  const filteredProducts = eligibleProducts.filter((product) => {
    const matchesSearch =
      !trimmedQuery ||
      product.name.toLowerCase().includes(trimmedQuery) ||
      product.vendorName.toLowerCase().includes(trimmedQuery) ||
      normalizeSearchText(product.name).includes(normalizedQuery) ||
      normalizeSearchText(product.vendorName).includes(normalizedQuery);

    const matchesCategory =
      selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;

    const matchesVendor =
      selectedVendorId === 'all' || product.vendorId === selectedVendorId;

    return matchesSearch && matchesCategory && matchesVendor;
  });

  const approvedVendors = vendors.filter((v) => v.status === 'APPROVED');

  return (
    <div className="p-3 sm:p-5 space-y-4 text-right max-w-6xl mx-auto">
      {/* Banner / Value Proposition */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-4 sm:p-6 text-slate-950 overflow-hidden shadow-xl">
        <div className="absolute -left-8 -bottom-8 opacity-15 pointer-events-none">
          <Store className="w-48 h-48 text-slate-950" />
        </div>
        <div className="relative z-10 max-w-xl space-y-1.5">
          <span className="inline-flex items-center gap-1 bg-slate-950/10 text-slate-950 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-slate-950/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>منتجات يدوية بأيدي أسر سعودية معتمدة</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            أصالة المأكولات الشعبية والمشغولات المنزلية
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-900/90 leading-relaxed">
            جميع الأسر المشاركة خاضعة للرقابة والاعتماد الرسمي من إدارة المنصة لتضمن لك أعلى درجات النظافة والجودة.
          </p>
        </div>
      </div>

      {/* Search & Categories Horizontal Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن جريش، معمول، بهارات، أو اسم الأسرة..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
            />
          </div>

          <select
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
          >
            <option value="all">كافة الأسر المعتمدة ({approvedVendors.length})</option>
            {approvedVendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            الكل ({eligibleProducts.length})
          </button>

          {categories.map((cat) => {
            const catProdCount = eligibleProducts.filter(
              (p) => p.categoryId === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-semibold bg-slate-200/40 dark:bg-slate-800/60 px-1.5 py-0.2 rounded-full">
                  {catProdCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
            لا توجد منتجات متطابقة مع البحث
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            جرّب البحث باسم آخر أو إزالة تصفية التصنيف. تذكّر: تظهر المنتجات النشطة فقط المنسوبة لأسر معتمدة رسمياً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredProducts.map((product) => {
            const vendor = vendors.find((v) => v.id === product.vendorId);

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                      {product.unit}
                    </span>
                  </div>

                  {/* Prep Time Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{product.prepTimeMinutes} دقيقة</span>
                  </div>

                  {/* Vendor Tag at bottom of image */}
                  <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-800 max-w-[80%] truncate">
                      <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate font-bold text-[11px]">
                        {product.vendorName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="مورد معتمد" />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-xl text-amber-400 font-extrabold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer space-y-1"
                  >
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                      {product.description}
                    </p>
                  </div>

                  {/* Card Footer: Price & Add to Cart */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">السعر</span>
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
                        {product.price} ر.س
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة للسلة</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
