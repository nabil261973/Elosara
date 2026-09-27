import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  Battery,
  Signal,
  Home,
  ShoppingBag,
  Clock,
  User,
  Package,
  ListOrdered,
  Store,
  ShieldCheck,
  Tag,
  BarChart3,
  Layers
} from 'lucide-react';

interface MobileContainerProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  activeTab,
  setActiveTab,
  onOpenCart
}) => {
  const { isMobileSimulator, currentRole, cartItems } = useApp();
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const currentTime = new Date().toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const renderBottomNav = () => {
    if (currentRole === 'CLIENT') {
      return (
        <nav className="bg-slate-900 border-t border-slate-800 text-slate-400 py-2 px-3 flex items-center justify-around shrink-0 text-[11px]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'home' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>الرئيسية</span>
          </button>

          <button
            onClick={onOpenCart}
            className="flex flex-col items-center gap-1 relative hover:text-slate-200 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>السلة</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'orders' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>طلباتي</span>
          </button>
        </nav>
      );
    }

    if (currentRole === 'VENDOR') {
      return (
        <nav className="bg-slate-900 border-t border-slate-800 text-slate-400 py-2 px-3 flex items-center justify-around shrink-0 text-[11px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'overview' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>الحالة والبيانات</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'products' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>منتجاتي</span>
          </button>

          <button
            onClick={() => setActiveTab('vendor-orders')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'vendor-orders' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-5 h-5" />
            <span>الطلبات الواردة</span>
          </button>
        </nav>
      );
    }

    if (currentRole === 'ADMIN') {
      return (
        <nav className="bg-slate-900 border-t border-slate-800 text-slate-400 py-2 px-3 flex items-center justify-around shrink-0 text-[11px]">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'requests' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>طلبات الموردين</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'categories' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span>الأقسام</span>
          </button>

          <button
            onClick={() => setActiveTab('all-vendors')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'all-vendors' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span>كافة الموردين</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'settings' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>إعدادات الرسوم</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'analytics' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>الحوكمة</span>
          </button>
        </nav>
      );
    }

    return null;
  };

  if (!isMobileSimulator) {
    // Fullscreen View
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between">
        <main className="flex-1 pb-16">{children}</main>
        <div className="sticky bottom-0 z-30 shadow-lg">{renderBottomNav()}</div>
      </div>
    );
  }

  // Mobile Frame Simulation View
  return (
    <div className="py-6 px-2 flex items-center justify-center min-h-[calc(100vh-60px)] bg-slate-950/90 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="relative w-full max-w-[420px] h-[830px] bg-slate-900 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-2.5 pb-2 px-6 flex items-center justify-between text-slate-300 text-[11px] font-semibold tracking-tight z-40 shrink-0">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-slate-200" />
          </div>
        </div>

        {/* App Main Scrollable Screen */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 rounded-[28px] relative text-slate-900 dark:text-slate-100 scrollbar-thin scrollbar-thumb-slate-300">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="mt-1 rounded-b-[28px] overflow-hidden">
          {renderBottomNav()}
          
          {/* iOS Home Indicator Bar */}
          <div className="bg-slate-900 py-1 flex justify-center">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
