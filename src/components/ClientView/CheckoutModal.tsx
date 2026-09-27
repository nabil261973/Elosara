import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  CheckCircle2,
  X,
  Store,
  Sparkles,
  ShoppingBag,
  Receipt,
  Navigation
} from 'lucide-react';
import { motion } from 'motion/react';
import { LocationMap, calculateDistanceKm } from '../Common/LocationMap';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { cartItems, cartVendorName, cartVendorId, vendors, platformSettings, checkoutCart } = useApp();

  const [clientName, setClientName] = useState('عبدالله السليمان');
  const [clientPhone, setClientPhone] = useState('0501234567');
  const [address, setAddress] = useState('الرياض - حي الياسمين - شارع انس بن مالك - منزل 22');
  const [clientLat, setClientLat] = useState<number>(24.8100);
  const [clientLng, setClientLng] = useState<number>(46.6500);
  const [showMapPicker, setShowMapPicker] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'MADA' | 'APPLE_PAY' | 'CASH'>('APPLE_PAY');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Selected vendor details
  const vendor = vendors.find((v) => v.id === cartVendorId);
  const vendorLat = vendor?.lat || 24.7950;
  const vendorLng = vendor?.lng || 46.6250;

  // Calculation Breakdown
  const subtotalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // VAT Tax calculation
  const taxRate = platformSettings.taxPercentage;
  const taxAmount = Math.round(((subtotalAmount * taxRate) / 100) * 100) / 100;

  // Dynamic Delivery Fee calculation based on distance between vendor and client
  const distanceKm = calculateDistanceKm(vendorLat, vendorLng, clientLat, clientLng);
  const extraKm = Math.max(0, distanceKm - 3);
  const deliveryFee = Math.round(
    platformSettings.defaultDeliveryFee + extraKm * platformSettings.baseDeliveryFeeKm
  );

  const grandTotal = Math.round((subtotalAmount + taxAmount + deliveryFee) * 100) / 100;

  const handleLocationSelect = (newLat: number, newLng: number, pName?: string) => {
    setClientLat(newLat);
    setClientLng(newLng);
    if (pName) {
      setAddress(pName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !clientPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const order = checkoutCart(
        address.trim(),
        paymentMethod,
        notes.trim() || undefined,
        clientName.trim() || 'عميل المنصة',
        clientPhone.trim(),
        clientLat,
        clientLng
      );
      setIsSubmitting(false);
      if (order) {
        onSuccess(order.id);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-right p-5 space-y-4 text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                إتمام الطلب والدفع
              </h3>
              <p className="text-xs text-slate-400">
                طلب مباشر من: <span className="font-bold text-amber-400">{cartVendorName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Customer Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <span>بيانات المستلم والتوصيل:</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">رقم الجوال:</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">العنوان التفصيلي:</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                placeholder="المدينة، الحي، الشارع، رقم المنزل..."
              />
            </div>

            {/* Interactive Location Map Picker */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>تحديد موقع التوصيل على الخريطة:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                  className="text-amber-400 text-[11px] hover:underline font-bold"
                >
                  {showMapPicker ? 'إخفاء الخريطة' : 'عرض الخريطة لتحديد الموقع'}
                </button>
              </div>

              {showMapPicker && (
                <LocationMap
                  mode="PICKER"
                  lat={clientLat}
                  lng={clientLng}
                  address={address}
                  onLocationSelect={handleLocationSelect}
                />
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200">طريقة الدفع:</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('APPLE_PAY')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                  paymentMethod === 'APPLE_PAY'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-sm"> Pay</span>
                <span className="text-[10px]">دفع سريع</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MADA')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                  paymentMethod === 'MADA'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs">مدى mada</span>
                <span className="text-[10px]">بطاقة بنكية</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs">الدفع عند الاستلام</span>
                <span className="text-[10px]">نقداً للمندوب</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">ملاحظات للأسرة المنتجة (اختياري):</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: زيادة درجة الحرارة، التغليف الرمضاني، بدون مكسرات..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Detailed Order Financial Summary Box */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>مجموع المنتجات ({cartItems.length}):</span>
              <span className="font-mono">{subtotalAmount} ر.س</span>
            </div>
            
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>ضريبة القيمة المضافة ({taxRate}%):</span>
              </span>
              <span className="font-mono text-amber-400">{taxAmount} ر.س</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>رسوم التوصيل ({distanceKm} كم):</span>
              </span>
              <span className="font-mono">{deliveryFee} ر.س</span>
            </div>

            <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-slate-800">
              <span>المبلغ الإجمالي النهائي:</span>
              <span className="text-amber-400 text-base">{grandTotal} ر.س</span>
            </div>
          </div>

          {/* Submit Order */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>جاري إرسال الطلب للأسرة...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>تأكيد الطلب والدفع ({grandTotal} ر.س)</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

