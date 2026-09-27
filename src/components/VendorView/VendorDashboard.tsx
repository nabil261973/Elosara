import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { VendorProductModal } from './VendorProductModal';
import { VendorRegisterModal } from './VendorRegisterModal';
import {
  Store,
  Clock,
  AlertTriangle,
  Package,
  Plus,
  Edit2,
  Trash2,
  ListOrdered,
  Search,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface VendorDashboardProps {
  activeTab: string;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ activeTab }) => {
  const {
    activeVendor,
    products,
    orders,
    toggleProductStatus,
    deleteProduct,
    updateOrderStatusByVendor
  } = useApp();

  const [showProductModal, setShowProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const myProducts = products.filter((p) => p.vendorId === activeVendor?.id);
  const myFilteredProducts = myProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter orders belonging to active vendor
  const myOrders = orders.filter((o) => o.vendorId === activeVendor?.id);

  if (!activeVendor) {
    return (
      <div className="p-8 text-center space-y-3">
        <Store className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="font-bold text-base">لم يتم اختيار مورد</h3>
      </div>
    );
  }

  const activeProductsCount = myProducts.filter((p) => p.status === 'ACTIVE').length;
  const totalRevenue = myOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.subtotalAmount ?? o.grandTotal), 0);

  const isApproved = activeVendor.status === 'APPROVED';
  const isPending = activeVendor.status === 'PENDING';
  const isRejected = activeVendor.status === 'REJECTED';

  return (
    <div className="p-3 sm:p-5 space-y-4 text-right max-w-6xl mx-auto">
      
      {/* Vendor Status Header Banner */}
      <div className="space-y-3">
        {isPending && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 p-4 sm:p-5 rounded-3xl text-amber-900 dark:text-amber-200 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-500 shrink-0 animate-pulse" />
                <h3 className="font-black text-base sm:text-lg">
                  حسابك قيد المراجعة والاعتماد لدى المدير ⏳
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all"
              >
                تعديل الطلب
              </button>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              تم استلام بيانات النشاط التجاري لـ <span className="font-bold underline">{activeVendor.name}</span>. لا يمكنك نشر أي منتجات للعملاء في السوق إلا بعد مراجعة الاعتماد وتوثيق وثيقة العمل الحر بواسطة المدير لضمان موثوقية المنصة.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="bg-rose-500/10 border-2 border-rose-500/40 p-4 sm:p-5 rounded-3xl text-rose-950 dark:text-rose-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                <h3 className="font-black text-base sm:text-lg">
                  تم رفض طلب الانضمام للأسرة ❌
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تحديث البيانات وإعادة التقديم</span>
              </button>
            </div>

            {/* Rejection Reason Box */}
            <div className="bg-white/80 dark:bg-slate-900/90 border border-rose-300 dark:border-rose-800 p-3 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-rose-500 block">سبب الرفض المسجل من المدير:</span>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                "{activeVendor.rejectionReason || 'الوثائق غير كاملة، يرجى إعادة التأكد من رقم الآيبان ووثيقة السجل.'}"
              </p>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 sm:p-5 rounded-3xl text-emerald-950 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={activeVendor.logo}
                alt={activeVendor.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    {activeVendor.name}
                  </h3>
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    معتمد ✅
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeVendor.city} • {activeVendor.ownerName} ({activeVendor.phone})
                </p>
              </div>
            </div>

            {/* Quick Performance Stats */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">المنتجات النشطة</span>
                <span className="text-emerald-500 font-extrabold text-sm">{activeProductsCount}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">إجمالي الطلبات</span>
                <span className="text-sky-500 font-extrabold text-sm">{myOrders.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">المبيعات</span>
                <span className="text-amber-500 font-extrabold text-sm">{totalRevenue.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area Based on Active Tab */}
      {activeTab === 'products' || activeTab === 'overview' ? (
        <div className="space-y-4">
          
          {/* Header Controls for Product Management */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في قائمة منتجات متجرك..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => {
                if (!isApproved) return;
                setProductToEdit(null);
                setShowProductModal(true);
              }}
              disabled={!isApproved}
              className={`font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all ${
                isApproved
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
              }`}
              title={!isApproved ? 'يلزم اعتماد الحساب أولاً من المدير لإضافة منتجات' : 'إضافة منتج جديد'}
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
              {!isApproved && <span className="text-[10px] opacity-80">(يتطلب الاعتماد)</span>}
            </button>
          </div>

          {/* Products Table / Cards */}
          {myFilteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                لا توجد منتجات مسجلة بمتجرك
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {isApproved
                  ? 'انقر على "إضافة منتج جديد" لنشر أطباقك ومصنوعاتك في السوق.'
                  : 'بانتظار الاعتماد الرسمي من مدير المنصة لفتح إمكانية إضافة المنتجات.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {myFilteredProducts.map((p) => {
                const isActive = p.status === 'ACTIVE';

                return (
                  <div
                    key={p.id}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all ${
                      isActive
                        ? 'border-slate-200 dark:border-slate-800'
                        : 'border-amber-300/60 dark:border-amber-800/60 opacity-80 bg-amber-50/20'
                    }`}
                  >
                    <div>
                      <div className="relative h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                              isActive
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-amber-500 text-slate-950 border-amber-400'
                            }`}
                          >
                            {isActive ? 'نشط ويظهر للعملاء ✅' : 'موقوف مؤقتاً ⏸️'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {p.description}
                        </p>
                        <div className="flex items-center justify-between text-xs pt-1 font-bold">
                          <span className="text-amber-600 dark:text-amber-400">{p.price} ر.س / {p.unit}</span>
                          <span className="text-slate-400 font-normal">المخزون: {p.stock}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Controls */}
                    <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleProductStatus(p.id)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors ${
                          isActive
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}
                        title={isActive ? 'إيقاف المنتج مؤقتاً' : 'تنشيط ظهور المنتج للعملاء'}
                      >
                        {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isActive ? 'إيقاف مؤقت' : 'تنشيط الظهور'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setProductToEdit(p);
                          setShowProductModal(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                        title="تعديل المنتج"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Vendor Incoming Orders Tab */}
      {activeTab === 'vendor-orders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              الطلبات الواردة لـ {activeVendor.name}
            </h3>
            <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {myOrders.length} طلب
            </span>
          </div>

          {myOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-2">
              <ListOrdered className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">لا توجد طلبات جديدة موجهة لمتجرك حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      طلب #{o.id} • {o.clientName} ({o.clientPhone})
                    </span>
                    <span className="text-amber-500 font-black">{o.subtotalAmount ?? o.grandTotal} ر.س</span>
                  </div>

                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {i.productName} ({i.quantity} {i.unit})</span>
                        <span className="font-bold">{i.price * i.quantity} ر.س</span>
                      </div>
                    ))}
                  </div>

                  {o.notes && (
                    <p className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                      ملاحظة العميل: "{o.notes}"
                    </p>
                  )}

                  {/* Status Action Buttons for Vendor */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-bold ml-2">تحديث الحالة:</span>
                    
                    <button
                      onClick={() => updateOrderStatusByVendor(o.id, 'PREPARING')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                        o.status === 'PREPARING'
                          ? 'bg-sky-500 text-slate-950 border-sky-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      جاري التحضير 🍳
                    </button>

                    <button
                      onClick={() => updateOrderStatusByVendor(o.id, 'DELIVERING')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                        o.status === 'DELIVERING'
                          ? 'bg-indigo-500 text-white border-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      تم التسليم للمندوب 🛵
                    </button>

                    <button
                      onClick={() => updateOrderStatusByVendor(o.id, 'COMPLETED')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                        o.status === 'COMPLETED'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      تم التسليم للمستلم ✅
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showProductModal && (
        <VendorProductModal
          productToEdit={productToEdit}
          onClose={() => {
            setShowProductModal(false);
            setProductToEdit(null);
          }}
        />
      )}

      {showRegisterModal && (
        <VendorRegisterModal
          vendorToResubmit={activeVendor}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};
