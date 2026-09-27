import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Store,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Monitor,
  Info,
  PlusCircle,
  Sparkles,
  ChevronDown,
  X,
  LogOut,
  KeyRound
} from 'lucide-react';

interface RoleHeaderProps {
  onOpenCart: () => void;
  onOpenVendorRegister: () => void;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  onOpenCart,
  onOpenVendorRegister
}) => {
  const {
    currentUser,
    logout,
    currentRole,
    setCurrentRole,
    vendors,
    activeVendorId,
    setActiveVendorId,
    activeVendor,
    isMobileSimulator,
    setIsMobileSimulator,
    cartItems,
    cartVendorName,
    getVisibleProductsForClient
  } = useApp();

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const visibleProductsCount = getVisibleProductsForClient().length;
  const pendingVendorsCount = vendors.filter((v) => v.status === 'PENDING').length;

  return (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight">سوق الأسر المنتجة</h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  متعدد الموردين
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                منصة تجارة إلكترونية متكاملة مع تسجيل دخول وعزل بيانات الأدوار
              </p>
            </div>
          </div>

          {/* User Account Info Pill & Role Info */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-2xl border border-slate-700">
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs text-amber-300 truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.2 rounded-full font-black ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : currentUser.role === 'VENDOR'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {currentUser.role === 'ADMIN'
                      ? 'مدير المنصة'
                      : currentUser.role === 'VENDOR'
                      ? 'مورد'
                      : 'عميل'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">@{currentUser.username}</span>
              </div>

              {/* Admin can switch role view simulation if needed */}
              {currentUser.role === 'ADMIN' && (
                <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/60 mr-1">
                  <button
                    onClick={() => setCurrentRole('CLIENT')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      currentRole === 'CLIENT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                    title="معاينة كعميل"
                  >
                    عميل
                  </button>
                  <button
                    onClick={() => setCurrentRole('VENDOR')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      currentRole === 'VENDOR' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                    title="معاينة كمورد"
                  >
                    مورد
                  </button>
                  <button
                    onClick={() => setCurrentRole('ADMIN')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      currentRole === 'ADMIN' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                    }`}
                    title="لوحة الإدارة"
                  >
                    مدير
                  </button>
                </div>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-xl transition-all mr-1"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right Actions: Active Vendor Selector (when Vendor Role) OR Cart (when Client Role) */}
          <div className="flex items-center gap-2">
            
            {/* Vendor Switcher Dropdown (visible in VENDOR role if admin or active) */}
            {currentRole === 'VENDOR' && (
              <div className="relative">
                <button
                  onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium px-2.5 py-1.5 rounded-xl transition-all"
                >
                  <span className="max-w-[120px] truncate">
                    {activeVendor?.name || 'اختر متجر'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showVendorDropdown && (
                  <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl py-2 z-50 text-right">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-700">
                      قائمة متجرك / الأسر المنتجة:
                    </div>
                    {vendors.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setActiveVendorId(v.id);
                          setShowVendorDropdown(false);
                        }}
                        className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                          v.id === activeVendorId ? 'bg-slate-700/90 font-bold text-amber-400' : 'text-slate-200'
                        }`}
                      >
                        <span className="truncate max-w-[140px]">{v.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            v.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : v.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {v.status === 'APPROVED'
                            ? 'معتمد'
                            : v.status === 'PENDING'
                            ? 'قيد المراجعة'
                            : 'مرفوض'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Client Cart Button */}
            {currentRole === 'CLIENT' && (
              <button
                onClick={onOpenCart}
                className="relative bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline">السلة</span>
                {cartCount > 0 && (
                  <span className="bg-slate-950 text-amber-400 font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
                {cartVendorName && (
                  <span className="text-[10px] bg-slate-950/20 font-medium px-1.5 py-0.5 rounded max-w-[90px] truncate hidden md:inline">
                    {cartVendorName}
                  </span>
                )}
              </button>
            )}

            {/* Rules Info Modal Trigger */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-all"
              title="عرض قواعد وبنية المنصة"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Mobile Simulator vs Desktop Toggle */}
            <button
              onClick={() => setIsMobileSimulator(!isMobileSimulator)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all hidden sm:flex items-center gap-1 text-xs"
              title={isMobileSimulator ? 'تحويل للعرض الكامل' : 'محاكي تطبيق الجوال'}
            >
              {isMobileSimulator ? (
                <>
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px]">شاشة كاملة</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px]">إطار الجوال</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Rules & Governance System Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-right">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-lg text-white">قواعد العمل والتحكم في الوصول حسب الدور</h3>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  1. دور العميل (الواجهة الاستهلاكية)
                </h4>
                <p className="text-slate-300">
                  • تصفح الأقسام والبحث والتقييم.
                  <br />
                  • **شروط ظهور المنتج**: يظهر فقط للمنتج النشط (<code className="text-emerald-400">ACTIVE</code>) المنسوب لمورد معتمد (<code className="text-emerald-400">APPROVED</code>).
                  <br />
                  • **عزل الطلبات**: يشاهد العميل في قائمة "طلباتي" فقط الطلبات الصادرة من حسابه الشخصي.
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  2. دور المورد (الأسر المنتجة)
                </h4>
                <p className="text-slate-300">
                  • تسجيل بيانات المتجر وتلقي حالة الطلب (قيد المراجعة ⏳، معتمد ✅، مرفوض ❌).
                  <br />
                  • **عزل البيانات**: المورد يتصفح فقط متجره، منتجاته الخاصة، والطلبات المقدمة لمتجره فقط ولا يمكنه الاطلاع على متاجر المنافسين.
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  3. دور المدير (الإدارة المركزية والحوكمة)
                </h4>
                <p className="text-slate-300">
                  • مراجعة طلبات الانضمام المعلقة واعتمادها أو رفضها مع سبب الرفض المكتوب.
                  <br />
                  • الاطلاع الشامل على كافة الطلبات والموردين والتصنيفات في المنصة.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowRulesModal(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                فهمت القواعد، البدء بالتجربة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
