import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  X,
  Store,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCheckout
}) => {
  const {
    cartItems,
    cartVendorName,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = useApp();

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const grandTotal = totalAmount + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-start">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between shadow-2xl text-right"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                سلة التسوق
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {cartItems.length} منتج في السلة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Vendor Banner */}
        {cartVendorName && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 p-3 px-4 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold">
              <Store className="w-4 h-4 text-amber-500" />
              <span>الطلب مخصص لـ: <span className="underline">{cartVendorName}</span></span>
            </div>
            <button
              onClick={clearCart}
              className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>إفراغ</span>
            </button>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                سلتك فارغة حالياً
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                تصفح قائمة الأسر المنتجة المعتمة وأضف ألذ الأطباق الشعبية والحلويات والمطرزات.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl flex items-center gap-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold mt-0.5">
                    {item.product.price} ر.س / {item.product.unit}
                  </p>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-lg font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-lg font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      = {item.product.price * item.quantity} ر.س
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Order Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>مجموع المنتجات:</span>
                <span>{totalAmount} ر.س</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>أجرة توصيل الأسرة:</span>
                <span>{deliveryFee} ر.س</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
                <span>الإجمالي الكلي:</span>
                <span className="text-amber-500">{grandTotal} ر.س</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>متابعة الشراء والدفع للأسرة ({grandTotal} ر.س)</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
