import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';
import { Store, X, ShieldCheck, FileText, Building2, Phone, User, CheckCircle2, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { LocationMap } from '../Common/LocationMap';

interface VendorRegisterModalProps {
  vendorToResubmit?: Vendor | null;
  onClose: () => void;
}

export const VendorRegisterModal: React.FC<VendorRegisterModalProps> = ({
  vendorToResubmit,
  onClose
}) => {
  const { categories, registerVendor, resubmitVendorApplication } = useApp();

  const [name, setName] = useState(vendorToResubmit?.name || '');
  const [ownerName, setOwnerName] = useState(vendorToResubmit?.ownerName || '');
  const [phone, setPhone] = useState(vendorToResubmit?.phone || '0501122334');
  const [nationalIdOrCR, setNationalIdOrCR] = useState(vendorToResubmit?.nationalIdOrCR || 'FL-88776655');
  const [city, setCity] = useState(vendorToResubmit?.city || 'الرياض');
  const [address, setAddress] = useState(vendorToResubmit?.address || 'الرياض - حي الملقا - شارع حائل');
  const [lat, setLat] = useState<number>(vendorToResubmit?.lat || 24.7950);
  const [lng, setLng] = useState<number>(vendorToResubmit?.lng || 46.6250);
  const [showMap, setShowMap] = useState<boolean>(true);
  const [description, setDescription] = useState(vendorToResubmit?.description || '');
  const [bankName, setBankName] = useState(vendorToResubmit?.bankAccount?.bankName || 'مصرف الراجحي');
  const [iban, setIban] = useState(vendorToResubmit?.bankAccount?.iban || 'SA0080000001234567890123');
  const [accountHolder, setAccountHolder] = useState(vendorToResubmit?.bankAccount?.accountHolder || '');

  const handleLocationSelect = (newLat: number, newLng: number, placeName?: string) => {
    setLat(newLat);
    setLng(newLng);
    if (placeName) {
      setAddress(placeName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim()) return;

    if (vendorToResubmit) {
      resubmitVendorApplication(vendorToResubmit.id, {
        name: name.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        nationalIdOrCR: nationalIdOrCR.trim(),
        city: city.trim(),
        address: address.trim(),
        lat,
        lng,
        description: description.trim(),
        bankAccount: {
          bankName: bankName.trim(),
          iban: iban.trim(),
          accountHolder: accountHolder.trim() || ownerName.trim()
        }
      });
    } else {
      registerVendor({
        name: name.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        nationalIdOrCR: nationalIdOrCR.trim(),
        city: city.trim(),
        address: address.trim(),
        lat,
        lng,
        categoryIds: [categories[0]?.id || 'cat-1'],
        description: description.trim(),
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        bankAccount: {
          bankName: bankName.trim(),
          iban: iban.trim(),
          accountHolder: accountHolder.trim() || ownerName.trim()
        }
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
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-right p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {vendorToResubmit ? 'تعديل بيانات طلب الانضمام' : 'تسجيل أسرة منتجة جديدة'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                سيتم إرسال الطلب بحالة (قيد المراجعة ⏳) لإدارة المنصة
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
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">اسم متجر / نشاط الأسرة المنتجة:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أسرة أم عبدالعزيز - المأكولات التراثية..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">اسم مالكة/مالك النشاط:</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="الاسم الثلاثي..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">رقم الجوال للتواصل:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">رقم وثيقة العمل الحر / السجل:</label>
              <input
                type="text"
                required
                value={nationalIdOrCR}
                onChange={(e) => setNationalIdOrCR(e.target.value)}
                placeholder="FL-XXXXXXX"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold">المدينة / المنطقة:</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">العنوان التفصيلي للمقر / المطبخ:</label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المدينة، الحي، اسم الشارع، رقم المنزل أو المعلم..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          {/* Location Map Picker */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>تحديد موقع المتجر على الخريطة (لحساب مسافة التوصيل):</span>
              </span>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-amber-500 text-[10px] hover:underline font-bold"
              >
                {showMap ? 'إخفاء الخريطة' : 'تحديد على الخريطة'}
              </button>
            </div>

            {showMap && (
              <LocationMap
                mode="PICKER"
                lat={lat}
                lng={lng}
                address={address}
                onLocationSelect={handleLocationSelect}
              />
            )}
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">نبذة عن النشاط التجاري والمنتجات:</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح مختصر للخدمات والوجبات أو المصنوعات المقدمة..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          {/* Bank Account Info */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">بيانات الحساب البنكي لتحويل المبيعات:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">اسم البنك:</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">رقم الآيبان (IBAN):</label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="SA..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white dir-ltr"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>إرسال طلب الاعتماد للمدير</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
