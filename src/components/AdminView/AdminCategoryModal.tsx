import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Tag, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminCategoryModalProps {
  categoryToEdit?: Category | null;
  onClose: () => void;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  categoryToEdit,
  onClose
}) => {
  const { addCategory, updateCategory } = useApp();

  const [name, setName] = useState(categoryToEdit?.name || '');
  const [description, setDescription] = useState(categoryToEdit?.description || '');
  const [icon, setIcon] = useState(categoryToEdit?.icon || 'UtensilsCrossed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        icon
      });
    } else {
      addCategory({
        name: name.trim(),
        description: description.trim(),
        icon
      });
    }

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
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {categoryToEdit ? 'تعديل قسم بالمنصة' : 'إضافة قسم جديد للسوق'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إعادة تنظيم تصنيفات الأسر المنتجة
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
          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1 font-bold">اسم القسم:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عطور وبخور منزلية..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1 font-bold">وصف القسم:</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر لنوعية منتجات هذا القسم..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-all active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{categoryToEdit ? 'حفظ التعديلات' : 'إضافة القسم رسمياً'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
