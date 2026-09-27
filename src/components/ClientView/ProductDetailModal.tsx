import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Star,
  Clock,
  Store,
  CheckCircle2,
  X,
  ShoppingBag,
  MessageSquare,
  Send,
  Sparkles,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose
}) => {
  const { vendors, reviews, addReview, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [clientName, setClientName] = useState('عميل المنصة');

  const vendor = vendors.find((v) => v.id === product.vendorId);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(product.id, rating, comment.trim(), clientName.trim() || 'عميل المنصة');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-right"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full z-10 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Hero Image */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between text-white">
            <div>
              <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow mb-1">
                {product.unit}
              </span>
              <h2 className="text-lg font-black leading-tight drop-shadow">{product.name}</h2>
            </div>
            <div className="text-left bg-slate-950/80 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-2xl">
              <span className="text-xs text-amber-300 font-bold">السعر</span>
              <p className="text-lg font-extrabold text-amber-400">{product.price} ر.س</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Vendor Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={vendor?.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80'}
                alt={vendor?.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {product.vendorName}
                  </h4>
                  {vendor?.status === 'APPROVED' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" title="مورد معتمد رسمياً" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {vendor?.city} • {vendor?.ownerName}
                </p>
              </div>
            </div>

            <div className="text-left text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              مورد معتمد ✅
            </div>
          </div>

          {/* Product Specs */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-extrabold">{product.rating}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                ({product.reviewCount} تقييم)
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1 text-sky-500 mb-0.5">
                <Clock className="w-4 h-4" />
                <span className="font-extrabold">{product.prepTimeMinutes} د</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">زمن التحضير</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1 text-emerald-500 mb-0.5">
                <Package className="w-4 h-4" />
                <span className="font-extrabold">{product.stock}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">متوفر بالحافظة</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-xs text-slate-400 mb-1">وصف المنتج ومكوناته:</h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              {product.description}
            </p>
          </div>

          {/* Quantity Controls & Add To Cart Button */}
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 font-extrabold flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 font-extrabold flex items-center justify-center"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                onClose();
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>إضافة للسلة ({product.price * quantity} ر.س)</span>
            </button>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>تقييمات العملاء ({productReviews.length})</span>
            </h3>

            {/* Existing Reviews List */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">لا توجد تقييمات سابقة لهذا المنتج حتى الآن.</p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rev.clientName}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">أضف تقييمك للمنتج:</h4>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="اسمك"
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب انطباعك عن الجودة والطعم والنظافة..."
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
