import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';
import { AlertTriangle, X, Send, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminRejectModalProps {
  vendor: Vendor;
  onClose: () => void;
}

export const AdminRejectModal: React.FC<AdminRejectModalProps> = ({
  vendor,
  onClose
}) => {
  const { rejectVendor } = useApp();
  const [reason, setReason] = useState(
    'وثيقة العمل الحر أو السجل التجاري المرفق غير واضحة، يرجى إعادة رفع صورة رسمية واضحة ومطابقة لاسم صاحب الحساب والآيبان البنكي.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    rejectVendor(vendor.id, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl relative text-right space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                تسجيل سبب رفض طلب المورد
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الأسرة المنتجة: <span className="font-bold text-rose-500">{vendor.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3 rounded-2xl text-rose-900 dark:text-rose-200 leading-relaxed">
            <p className="font-bold">قاعدة الشفافية والحوكمة:</p>
            <p className="text-[11px] mt-0.5">
              يتوجب على مدير المنصة تسجيل سبب الرفض الدقيق والمفصل ليتمكن المورد من الاطلاع عليه وتعديل بياناته وإعادة تقديم الطلب.
            </p>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1 font-bold">
              سبب الرفض الموجه للمورد (مطلوب):
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب التوجيهات والملاحظات المطلوب تعديلها من قبل الأسرة..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>حفظ سبب الرفض وإشعار المورد</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
