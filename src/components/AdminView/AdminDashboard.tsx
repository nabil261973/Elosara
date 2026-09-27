import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vendor, Category } from '../../types';
import { AdminRejectModal } from './AdminRejectModal';
import { AdminCategoryModal } from './AdminCategoryModal';
import { AdminEditVendorModal } from './AdminEditVendorModal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Tag,
  BarChart3,
  Layers,
  Phone,
  FileText,
  Building2,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  Search,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Ban,
  RotateCcw,
  Sparkles,
  DollarSign,
  Package,
  Receipt,
  Truck,
  Percent,
  Save,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const {
    vendors,
    categories,
    products,
    orders,
    approveVendor,
    deleteCategory,
    getVisibleProductsForClient,
    platformSettings,
    updatePlatformSettings,
    updateVendorCommission,
    toggleVendorVisibility,
    toggleVendorContactVisibility,
    suspendVendor,
    reactivateVendor
  } = useApp();

  const [vendorToReject, setVendorToReject] = useState<Vendor | null>(null);
  const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [vendorSearch, setVendorSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'SUSPENDED'>('ALL');

  // Local Form state for Platform Settings
  const [taxPercentage, setTaxPercentage] = useState<number>(platformSettings.taxPercentage);
  const [defaultCommissionRate, setDefaultCommissionRate] = useState<number>(platformSettings.defaultCommissionRate);
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState<number>(platformSettings.defaultDeliveryFee);
  const [baseDeliveryFeeKm, setBaseDeliveryFeeKm] = useState<number>(platformSettings.baseDeliveryFeeKm);

  // Individual vendor commission editing state
  const [editingCommissionVendorId, setEditingCommissionVendorId] = useState<string | null>(null);
  const [tempCommissionValue, setTempCommissionValue] = useState<number>(10);

  const pendingVendors = vendors.filter((v) => v.status === 'PENDING');
  const approvedVendors = vendors.filter((v) => v.status === 'APPROVED');
  const rejectedVendors = vendors.filter((v) => v.status === 'REJECTED');
  const suspendedVendors = vendors.filter((v) => v.status === 'SUSPENDED');

  const clientVisibleProducts = getVisibleProductsForClient();
  const totalPlatformRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  const filteredAllVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.nationalIdOrCR.toLowerCase().includes(vendorSearch.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSavePlatformSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      taxPercentage: Number(taxPercentage),
      defaultCommissionRate: Number(defaultCommissionRate),
      defaultDeliveryFee: Number(defaultDeliveryFee),
      baseDeliveryFeeKm: Number(baseDeliveryFeeKm)
    });
  };

  return (
    <div className="p-3 sm:p-5 space-y-4 text-right max-w-6xl mx-auto">
      
      {/* Top Admin Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl text-white flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg">
                مركز التحكم والرقابة التشغيلية للمدير
              </h2>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                الإدارة المركزية
              </span>
            </div>
            <p className="text-xs text-slate-400">
              مراجعة وتراخيص الأسر المنتجة • إدارة شجرة الأقسام • ضبط جودة وحوكمة السوق
            </p>
          </div>
        </div>

        {/* Quick Pending Counter Pill */}
        {pendingVendors.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>يوجد {pendingVendors.length} طلب أسرة قيد المراجعة</span>
          </div>
        )}
      </div>

      {/* TAB 1: PENDING VENDOR REQUESTS */}
      {(activeTab === 'requests' || activeTab === 'overview') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>طلبات انضمام الموردين المعلقة ({pendingVendors.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مراجعة السجلات وتراخيص العمل الحر قبل تفعيل الظهور للعملاء
              </p>
            </div>
          </div>

          {pendingVendors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                لا توجد طلبات معلقة حالياً
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                جميع طلبات الأسر المنتجة تم التدقيق فيها وتحديد حالتها (معتمد أو مرفوض مع تدوين السبب).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingVendors.map((vendor) => (
                <motion.div
                  key={vendor.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-3xl p-4 shadow-md space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    
                    {/* Card Top Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-300 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                            {vendor.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            المالك: {vendor.ownerName} • {vendor.city}
                          </p>
                        </div>
                      </div>

                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-xl text-[10px] font-black shrink-0">
                        قيد المراجعة ⏳
                      </span>
                    </div>

                    {/* Official Business Credentials */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="font-bold flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-sky-500" />
                          <span>رقم الترخيص / العمل الحر:</span>
                        </span>
                        <code className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded text-amber-500 font-mono font-bold">
                          {vendor.nationalIdOrCR}
                        </code>
                      </div>

                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="font-bold flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          <span>رقم الجوال:</span>
                        </span>
                        <span className="font-mono">{vendor.phone}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="font-bold flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>الحساب البنكي (IBAN):</span>
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{vendor.bankAccount.iban}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      "{vendor.description}"
                    </p>
                  </div>

                  {/* Decision Actions: Approve vs Reject */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => approveVendor(vendor.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>اعتماد المورد رسمياً</span>
                    </button>

                    <button
                      onClick={() => setVendorToReject(vendor)}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض مع تدوين السبب</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                إدارة أصل وتصنيفات أقسام السوق
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إضافة أقسام الأكل الشعبي، الحلويات، والمشغولات وتسهيل تصفح العملاء
              </p>
            </div>

            <button
              onClick={() => {
                setCategoryToEdit(null);
                setShowCategoryModal(true);
              }}
              className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const categoryProductsCount = products.filter(
                (p) => p.categoryId === cat.id
              ).length;

              return (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-sky-500" />
                        <span>{cat.name}</span>
                      </h4>
                      <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                        {categoryProductsCount} منتج
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => {
                        setCategoryToEdit(cat);
                        setShowCategoryModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ALL VENDORS MANAGEMENT */}
      {activeTab === 'all-vendors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                <span>شجرة الموردين والتحكم ببيانات الأسر (مدير النظام)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إدارة كاملة لتعديل البيانات، إظهار/إخفاء المورد، وحجب معلومات التواصل وإيقاف التعامل
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">كافة الحالات ({vendors.length})</option>
                <option value="APPROVED">معتمد فقط ({approvedVendors.length})</option>
                <option value="PENDING">قيد المراجعة ({pendingVendors.length})</option>
                <option value="SUSPENDED">موقوف التعامل ({suspendedVendors.length})</option>
                <option value="REJECTED">مرفوض ({rejectedVendors.length})</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAllVendors.map((v) => (
              <div
                key={v.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm space-y-3 text-xs ${
                  v.status === 'SUSPENDED'
                    ? 'border-rose-500/50 bg-rose-500/5'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={v.logo}
                      alt={v.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        المالك: {v.ownerName} • {v.city}
                      </span>
                      {v.address && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{v.address}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        v.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : v.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : v.status === 'SUSPENDED'
                          ? 'bg-rose-600/20 text-rose-400 border-rose-500/40'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                      }`}
                    >
                      {v.status === 'APPROVED'
                        ? 'معتمد ✅'
                        : v.status === 'PENDING'
                        ? 'قيد المراجعة ⏳'
                        : v.status === 'SUSPENDED'
                        ? 'موقوف التعامل 🛑'
                        : 'مرفوض ❌'}
                    </span>

                    {/* Visibility flags badges */}
                    <div className="flex items-center gap-1 text-[9px]">
                      {v.isHidden && (
                        <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/30">
                          مخفي 👁️‍🗨️
                        </span>
                      )}
                      {v.hideContactDetails && (
                        <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                          التواصل محجوب 🔒
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {v.status === 'REJECTED' && v.rejectionReason && (
                  <p className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 p-2 rounded-xl text-[11px] text-rose-900 dark:text-rose-200 font-medium">
                    سبب الرفض المسجل: "{v.rejectionReason}"
                  </p>
                )}

                {v.status === 'SUSPENDED' && (
                  <p className="bg-rose-600/10 border border-rose-500/30 p-2 rounded-xl text-[11px] text-rose-300 font-bold flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-rose-400" />
                    <span>سبب الإيقاف: {v.suspensionReason || 'موقوف تحفظياً بقرار الإدارة'}</span>
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-xl">
                  <span>الترخيص: <code className="text-amber-500 font-bold">{v.nationalIdOrCR}</code></span>
                  <span>الجوال: <span className="font-mono">{v.phone}</span></span>
                  <span>العمولة: <span className="font-bold text-amber-400">{v.commissionRate || 10}%</span></span>
                </div>

                {/* Admin Control Bar for each Vendor */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setVendorToEdit(v)}
                    className="bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-500/30 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 text-[10px]"
                    title="تعديل كافة بيانات المورد"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>تعديل البيانات</span>
                  </button>

                  <button
                    onClick={() => toggleVendorVisibility(v.id)}
                    className={`border py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 text-[10px] ${
                      v.isHidden
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                    title="إظهار أو إخفاء المورد في منصة العملاء"
                  >
                    {v.isHidden ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3 text-emerald-400" />}
                    <span>{v.isHidden ? 'إظهار المتجر' : 'إخفاء المتجر'}</span>
                  </button>

                  <button
                    onClick={() => toggleVendorContactVisibility(v.id)}
                    className={`border py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 text-[10px] ${
                      v.hideContactDetails
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                    title="حجب أو إظهار بيانات التواصل والوثائق"
                  >
                    {v.hideContactDetails ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-slate-400" />}
                    <span>{v.hideContactDetails ? 'إظهار الجوال' : 'حجب الجوال'}</span>
                  </button>

                  {v.status === 'SUSPENDED' ? (
                    <button
                      onClick={() => reactivateVendor(v.id)}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 text-[10px]"
                      title="إعادة تفعيل المورد"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة تفعيل</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => suspendVendor(v.id)}
                      className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 text-[10px]"
                      title="إيقاف التعامل مع المورد"
                    >
                      <Ban className="w-3 h-3" />
                      <span>إيقاف التعامل</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM FINANCIAL SETTINGS & COMMISSION CONTROL */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <span>تحديد وإدارة رسوم المنصة، الضرائب، والعمولات</span>
            </h3>
            <p className="text-xs text-slate-400">
              تحديد قيمة ضريبة القيمة المضافة، رسوم التوصيل، ونسبة عمولة المنصة المتفق عليها مع الموردين
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Global Financial Settings Form */}
            <form onSubmit={handleSavePlatformSettings} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4 text-xs lg:col-span-1">
              <h4 className="font-extrabold text-sm text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <Percent className="w-4 h-4" />
                <span>الإعدادات المطبقة افتراضياً</span>
              </h4>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  نسبة ضريبة القيمة المضافة (VAT %):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-amber-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  تضاف تلقائياً في فاتورة العميل عند إتمام الطلب والدفع.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  عمولة المنصة الافتراضية للموردين (%):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={defaultCommissionRate}
                    onChange={(e) => setDefaultCommissionRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-amber-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  يتم اقتطاعها كإيراد للمنصة من إجمالي مبيعات المورد.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  رسوم التوصيل الأساسية (لأول 3 كم):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={defaultDeliveryFee}
                    onChange={(e) => setDefaultDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-slate-400 text-[11px]">ر.س</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  تكلفة الكيلومتر الإضافي:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={baseDeliveryFeeKm}
                    onChange={(e) => setBaseDeliveryFeeKm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-slate-400 text-[11px]">ر.س/كم</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات المركزية</span>
              </button>
            </form>

            {/* Individual Vendor Commission Management Panel */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3 lg:col-span-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-sky-400" />
                    <span>عمولات الموردين المعتمدين والموقع الجغرافي</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    تحديد نسبة العمولة الخاصة بكل مورد حسب الاتفاق عند التسجيل
                  </p>
                </div>
                <span className="bg-sky-500/20 text-sky-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  {approvedVendors.length} مورد معتمد
                </span>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {approvedVendors.map((v) => {
                  const currentCommission = v.commissionRate ?? platformSettings.defaultCommissionRate;
                  const isEditingThis = editingCommissionVendorId === v.id;

                  return (
                    <div
                      key={v.id}
                      className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={v.logo}
                          alt={v.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="font-bold text-white text-xs">{v.name}</h5>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>{v.address || v.city}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={tempCommissionValue}
                              onChange={(e) => setTempCommissionValue(parseFloat(e.target.value) || 0)}
                              className="w-16 bg-slate-900 border border-amber-500 rounded-lg px-2 py-1 text-center font-mono font-bold text-amber-400 text-xs"
                            />
                            <span className="text-amber-400 font-bold">%</span>
                            <button
                              onClick={() => {
                                updateVendorCommission(v.id, tempCommissionValue);
                                setEditingCommissionVendorId(null);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg text-[10px] font-bold"
                              title="حفظ"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingCommissionVendorId(null)}
                              className="bg-slate-800 text-slate-400 p-1.5 rounded-lg text-[10px]"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-xl text-xs font-bold">
                              العمولة: <span className="font-mono text-sm">{currentCommission}%</span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingCommissionVendorId(v.id);
                                setTempCommissionValue(currentCommission);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-xl border border-slate-700 text-[11px] flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>تعديل</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNANCE & ANALYTICS AUDIT */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] text-slate-400 block font-bold">إجمالي الموردين</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {vendors.length}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] text-slate-400 block font-bold">المعتمدون حالياً</span>
              <span className="text-2xl font-black text-emerald-500 mt-1 block">
                {approvedVendors.length}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] text-slate-400 block font-bold">المنتجات المؤهلة للعميل</span>
              <span className="text-2xl font-black text-amber-500 mt-1 block">
                {clientVisibleProducts.length}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] text-slate-400 block font-bold">إجمالي إيرادات المنصة</span>
              <span className="text-2xl font-black text-sky-500 mt-1 block">
                {totalPlatformRevenue} ر.س
              </span>
            </div>
          </div>

          {/* Governance Verification Audit Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white space-y-3">
            <h4 className="font-extrabold text-sm text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>فحص الضوابط وقواعد بيئة العمل بالأداء الذاتي</span>
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">شرط حظر المورد غير المعتمد:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    مفعل بصرامة. الأسر المنتجة بحالة <code className="text-amber-300">PENDING</code> أو <code className="text-rose-300">REJECTED</code> محظورة من إضافة أي منتج.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">شرط الظهور للعملاء:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    المنتج يظهر للعميل فقط عندما يحقق <code className="text-emerald-300">vendor.status === 'APPROVED' && product.status === 'ACTIVE'</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">شرط حظر السلة المتعددة:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    السلة محصورة بأسرة واحدة. محاولة إضافة منتج من أسرة أخرى تطلق حوار إفراغ السلة أو إكمال الطلب الحالي.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {vendorToEdit && (
        <AdminEditVendorModal
          vendor={vendorToEdit}
          onClose={() => setVendorToEdit(null)}
        />
      )}

      {vendorToReject && (
        <AdminRejectModal
          vendor={vendorToReject}
          onClose={() => setVendorToReject(null)}
        />
      )}

      {showCategoryModal && (
        <AdminCategoryModal
          categoryToEdit={categoryToEdit}
          onClose={() => {
            setShowCategoryModal(false);
            setCategoryToEdit(null);
          }}
        />
      )}
    </div>
  );
};
