import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Trash2, ArrowRight, Store, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export const CartConflictModal: React.FC = () => {
  const {
    cartConflictInfo,
    confirmSwitchVendorAndAddToCart,
    dismissCartConflict
  } = useApp();

  if (!cartConflictInfo) return null;

  const { existingVendorName, newProduct } = cartConflictInfo;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right"
      >
        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              قاعدة السلة: أسرة منتجة واحدة فقط
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              لتسهيل الشحن والدفع للأسرة المنتجة
            </p>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-2">
          <p className="font-bold">
            سلتك الحالية تحتوي على منتجات من:
          </p>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl font-extrabold text-slate-900 dark:text-white border border-amber-200/60 dark:border-amber-800/60">
            <Store className="w-4 h-4 text-amber-500" />
            <span>{existingVendorName}</span>
          </div>
          <p>
            أنظمة المنصة تقتضي الدفع لكل أسرة بشكل منفصل. لإضافة منتج من الأسرة الجديدة (<span className="font-bold text-emerald-600 dark:text-emerald-400">{newProduct.vendorName}</span>)، يلزمك إما الدفع للأسرة الأولى أولاً أو إفراغ السلة الحالية.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={confirmSwitchVendorAndAddToCart}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-98"
          >
            <Trash2 className="w-4 h-4" />
            <span>إفراغ السلة الحالية وبدء الطلب من الأسرة الجديدة</span>
          </button>

          <button
            onClick={dismissCartConflict}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الإبقاء على السلة الحالية وإكمال طلبها</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
