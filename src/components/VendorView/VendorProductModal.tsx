import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Package, X, Plus, CheckCircle2, Image, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface VendorProductModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

export const VendorProductModal: React.FC<VendorProductModalProps> = ({
  productToEdit,
  onClose
}) => {
  const { categories, activeVendor, activeVendorId, addProduct, updateProduct } = useApp();

  const [name, setName] = useState(productToEdit?.name || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState(productToEdit?.price || 35);
  const [categoryId, setCategoryId] = useState(productToEdit?.categoryId || categories[0]?.id || 'cat-1');
  const [image, setImage] = useState(
    productToEdit?.image ||
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80'
  );
  const [unit, setUnit] = useState(productToEdit?.unit || 'طبق');
  const [stock, setStock] = useState(productToEdit?.stock || 15);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(productToEdit?.prepTimeMinutes || 30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeVendor) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId,
        image: image.trim(),
        unit: unit.trim(),
        stock: Number(stock),
        prepTimeMinutes: Number(prepTimeMinutes)
      });
    } else {
      addProduct({
        vendorId: activeVendorId,
        vendorName: activeVendor.name,
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId,
        image: image.trim(),
        status: 'ACTIVE',
        stock: Number(stock),
        unit: unit.trim(),
        prepTimeMinutes: Number(prepTimeMinutes)
      });
    }

    onClose();
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-right p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد لمتجرك'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الأسرة المنتجة: <span className="font-bold text-emerald-500">{activeVendor?.name}</span>
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
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">اسم المنتج الأصلي:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: جريش نجدي باللبن المسمنة..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">التصنيف الرئيسي:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">وصف المنتج ومكوناته:</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب مكونات وطريقة حفظ وكيفية التقديم للمستلم..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">السعر (ر.س):</label>
              <input
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-extrabold text-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">الوحدة:</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="طبق / كيلو / قطعة"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">المخزون اليومي:</label>
              <input
                type="number"
                min={0}
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">زمن التحضير المتوقع (بالدقائق):</label>
            <input
              type="number"
              min={5}
              required
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          {/* Image Selection */}
          <div className="space-y-1">
            <label className="block text-[11px] text-slate-500 font-bold">رابط صورة المنتج:</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white dir-ltr text-xs"
            />
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
              <span className="text-[10px] text-slate-400 shrink-0">نماذج صور:</span>
              {sampleImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImage(imgUrl)}
                  className="w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 hover:ring-2 hover:ring-emerald-500"
                >
                  <img src={imgUrl} alt="sample" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{productToEdit ? 'حفظ التعديلات' : 'نشر المنتج في المتجر'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
