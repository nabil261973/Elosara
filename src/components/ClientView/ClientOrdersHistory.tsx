import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Store,
  ChevronLeft,
  AlertCircle,
  MapPin,
  Navigation,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationMap } from '../Common/LocationMap';

export const ClientOrdersHistory: React.FC = () => {
  const { getClientOrders } = useApp();
  const orders = getClientOrders();
  const [expandedMapOrderId, setExpandedMapOrderId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>بانتظار موافقة الأسرة</span>
          </span>
        );
      case 'PREPARING':
        return (
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>جاري التحضير بالمطبخ</span>
          </span>
        );
      case 'DELIVERING':
        return (
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Truck className="w-3 h-3 animate-bounce" />
            <span>مع مندوب التوصيل في الطريق</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>تم التسليم بنجاح</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-400 border border-slate-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            ملغي
          </span>
        );
    }
  };

  return (
    <div className="p-4 space-y-4 text-right max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>قائمة طلباتي وخريطة تتبع الشحن</span>
          </h2>
          <p className="text-xs text-slate-400">
            تتبع زمن الوصول والمسافة وموقع المندوب المباشر على الخريطة
          </p>
        </div>
        <span className="bg-amber-500/20 text-amber-400 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-500/30">
          {orders.length} طلب
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm text-slate-300">
            لا توجد طلبات سابقة
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            قم بإضافة منتجات من الأسر المنتجة المعتمة والدفع لإصدار أول طلب لك.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isMapExpanded = expandedMapOrderId === order.id;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-white">
                      طلب #{order.id}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Vendor Info & Distance Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-slate-200">
                      الأسرة المنتجة: {order.vendorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                      📏 المسافة: <strong className="text-amber-400">{order.distanceKm || 4.2} كم</strong>
                    </span>
                    <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/30">
                      ⏱️ زمن الوصول: <strong className="font-bold">{order.estimatedDeliveryMinutes || 25} دقيقة</strong>
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-slate-300"
                    >
                      <span>
                        • {item.productName} ({item.quantity} {item.unit})
                      </span>
                      <span className="font-bold font-mono">{item.price * item.quantity} ر.س</span>
                    </div>
                  ))}

                  {/* Financial Breakdown (VAT & Delivery) */}
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي للمنتجات:</span>
                      <span className="font-mono">{order.subtotalAmount || order.grandTotal - (order.deliveryFee || 15)} ر.س</span>
                    </div>
                    {order.taxAmount ? (
                      <div className="flex justify-between text-amber-400/90">
                        <span>ضريبة القيمة المضافة ({order.taxRate || 15}%):</span>
                        <span className="font-mono">{order.taxAmount} ر.س</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between">
                      <span>رسوم التوصيل:</span>
                      <span className="font-mono">{order.deliveryFee} ر.س</span>
                    </div>
                  </div>
                </div>

                {/* Map Toggle Button & Interactive Delivery Tracking Map */}
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedMapOrderId(isMapExpanded ? null : order.id)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{isMapExpanded ? 'إغلاق خريطة التتبع' : '🗺️ فتح خريطة تتبع الشحن وزمن الوصول المباشر'}</span>
                  </button>

                  <AnimatePresence>
                    {isMapExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 overflow-hidden"
                      >
                        <LocationMap
                          mode="TRACKING"
                          vendorName={order.vendorName}
                          vendorLat={order.vendorLat || 24.7950}
                          vendorLng={order.vendorLng || 46.6250}
                          vendorAddress={order.vendorAddress || 'الرياض - حي الملقا'}
                          clientName={order.clientName}
                          clientLat={order.clientLat || 24.8100}
                          clientLng={order.clientLng || 46.6500}
                          clientAddress={order.deliveryAddress}
                          orderStatus={order.status}
                          prepTimeMinutes={15}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status Timeline Bar */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <div className={`flex items-center gap-1 ${order.status !== 'CANCELLED' ? 'text-amber-400' : ''}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span>تم الاستلام</span>
                  </div>
                  <div className={`flex items-center gap-1 ${['PREPARING', 'DELIVERING', 'COMPLETED'].includes(order.status) ? 'text-sky-400' : ''}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span>التحضير</span>
                  </div>
                  <div className={`flex items-center gap-1 ${['DELIVERING', 'COMPLETED'].includes(order.status) ? 'text-indigo-400' : ''}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span>التوصيل</span>
                  </div>
                  <div className={`flex items-center gap-1 ${order.status === 'COMPLETED' ? 'text-emerald-400' : ''}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span>المستلم</span>
                  </div>
                </div>

                {/* Total & Delivery Address */}
                <div className="bg-slate-950 p-2.5 rounded-xl flex flex-wrap items-center justify-between text-xs font-bold gap-2 text-slate-200 border border-slate-800">
                  <span className="text-slate-400 text-[11px] font-normal truncate max-w-[220px]">
                    📍 {order.deliveryAddress}
                  </span>
                  <span className="text-amber-400 text-sm font-black">
                    المبلغ الكلي: {order.grandTotal} ر.س
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

