import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { AuthScreen } from './components/AuthScreen';
import { RoleHeader } from './components/RoleHeader';
import { MobileContainer } from './components/MobileContainer';
import { ProductCatalog } from './components/ClientView/ProductCatalog';
import { ClientOrdersHistory } from './components/ClientView/ClientOrdersHistory';
import { CartDrawer } from './components/ClientView/CartDrawer';
import { CartConflictModal } from './components/ClientView/CartConflictModal';
import { CheckoutModal } from './components/ClientView/CheckoutModal';
import { VendorDashboard } from './components/VendorView/VendorDashboard';
import { VendorRegisterModal } from './components/VendorView/VendorRegisterModal';
import { AdminDashboard } from './components/AdminView/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentUser, currentRole } = useApp();

  // Tab states per role
  const [clientTab, setClientTab] = useState<string>('home');
  const [vendorTab, setVendorTab] = useState<string>('products');
  const [adminTab, setAdminTab] = useState<string>('requests');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isVendorRegisterOpen, setIsVendorRegisterOpen] = useState<boolean>(false);

  // If user is not authenticated, present the authentication screen
  if (!currentUser) {
    return (
      <>
        <ToastContainer />
        <AuthScreen />
      </>
    );
  }

  // Active tab derived by current active role
  const activeTab =
    currentRole === 'CLIENT'
      ? clientTab
      : currentRole === 'VENDOR'
      ? vendorTab
      : adminTab;

  const setActiveTab = (tab: string) => {
    if (currentRole === 'CLIENT') setClientTab(tab);
    else if (currentRole === 'VENDOR') setVendorTab(tab);
    else setAdminTab(tab);
  };

  const renderRoleScreen = () => {
    if (currentRole === 'CLIENT') {
      if (clientTab === 'orders') {
        return <ClientOrdersHistory />;
      }
      return <ProductCatalog />;
    }

    if (currentRole === 'VENDOR') {
      return <VendorDashboard activeTab={vendorTab} />;
    }

    if (currentRole === 'ADMIN') {
      return <AdminDashboard activeTab={adminTab} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 dir-rtl">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Bar with Role Switcher */}
      <RoleHeader
        onOpenCart={() => setIsCartOpen(true)}
        onOpenVendorRegister={() => setIsVendorRegisterOpen(true)}
      />

      {/* Mobile Frame Simulator or Fullscreen Container */}
      <MobileContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
      >
        {renderRoleScreen()}
      </MobileContainer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Cart Single Vendor Conflict Modal (Triggered by Context) */}
      <CartConflictModal />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(orderId) => {
          setClientTab('orders');
        }}
      />

      {/* Vendor Registration / Resubmit Modal */}
      {isVendorRegisterOpen && (
        <VendorRegisterModal
          onClose={() => setIsVendorRegisterOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
