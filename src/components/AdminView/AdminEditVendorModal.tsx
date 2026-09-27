import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vendor, VendorStatus } from '../../types';
import {
  Store,
  X,
  Save,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Percent,
  CreditCard,
  User,
  Phone,
  FileText,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { LocationMap } from '../Common/LocationMap';

interface AdminEditVendorModalProps {
  vendor: Vendor;
  onClose: () => void;
}

export const AdminEditVendorModal: React.FC<AdminEditVendorModalProps> = ({ vendor, onClose }) => {
  const { updateVendorByAdmin, toggleVendorVisibility, toggleVendorContactVisibility, suspendVendor, reactivateVendor, categories } = useApp();

  const [name, setName] = useState(vendor.name);
  const [ownerName, setOwnerName] = useState(vendor.ownerName);
  const [phone, setPhone] = useState(vendor.phone);
  const [nationalIdOrCR, setNationalIdOrCR] = useState(vendor.nationalIdOrCR);
  const [city, setCity] = useState(vendor.city);
  const [address, setAddress] = useState(vendor.address || '');
  const [lat, setLat] = useState<number>(vendor.lat || 24.7950);
  const [lng, setLng] = useState<number>(vendor.lng || 46.6250);
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  const [description, setDescription] = useState(vendor.description || '');
  const [logo, setLogo] = useState(vendor.logo || '');
  const [banner, setBanner] = useState(vendor.banner || '');
  const [commissionRate, setCommissionRate] = useState<number>(vendor.commissionRate || 10);
  const [status, setStatus] = useState<VendorStatus>(vendor.status);
  const [suspensionReason, setSuspensionReason] = useState(vendor.suspensionReason || '');
  const [isHidden, setIsHidden] = useState<boolean>(vendor.isHidden || false);
  const [hideContactDetails, setHideContactDetails] = useState<boolean>(vendor.hideContactDetails || false);

  // Bank Account
  const [bankName, setBankName] = useState(vendor.bankAccount?.bankName || '');
  const [iban, setIban] = useState(vendor.bankAccount?.iban || '');
  const [accountHolder, setAccountHolder] = useState(vendor.bankAccount?.accountHolder || '');

  const handleLocationSelect = (newLat: number, newLng: number, placeName?: string) => {
    setLat(newLat);
    setLng(newLng);
    if (placeName) {
      setAddress(placeName);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorByAdmin(vendor.id, {
      name: name.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      nationalIdOrCR: nationalIdOrCR.trim(),
      city: city.trim(),
      address: address.trim(),
      lat,
      lng,
      description: description.trim(),
      logo: logo.trim(),
      banner: banner.trim(),
      commissionRate: Number(commissionRate),
      status,
      suspensionReason: status === 'SUSPENDED' ? suspensionReason.trim() : undefined,
      isHidden,
      hideContactDetails,
      bankAccount: {
        bankName: bankName.trim(),
        iban: iban.trim(),
        accountHolder: accountHolder.trim() || ownerName.trim()
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-right p-5 space-y-4 text-white text-xs"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="w-12 h-12 rounded-2xl object-cover border border-amber-500/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>تعديل بيانات وإعدادات المورد: {vendor.name}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                التحكم الكامل ببيانات المورد، الإظهار/الإخفاء، ونسبة العمولة وحالة النشاط
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Governance Controls (Visibility & Suspension Switches) */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>خيارات الحوكمة والرؤية السريعة (مدير النظام)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Toggle Store Visibility */}
            <button
              type="button"
              onClick={() => setIsHidden(!isHidden)}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                isHidden
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {isHidden ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                <div className="text-right">
                  <div className="font-bold">{isHidden ? 'المتجر مخفي 👁️‍🗨️' : 'المتجر ظاهر 👁️'}</div>
                  <div className="text-[9px] opacity-80">
                    {isHidden ? 'محجوب عن العملاء' : 'معروض في البحث'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold underline">تغيير</span>
            </button>

            {/* Toggle Contact Details Visibility */}
            <button
              type="button"
              onClick={() => setHideContactDetails(!hideContactDetails)}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                hideContactDetails
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {hideContactDetails ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                <div className="text-right">
                  <div className="font-bold">{hideContactDetails ? 'التواصل محجوب 🔒' : 'التواصل ظاهر 🔓'}</div>
                  <div className="text-[9px] opacity-80">
                    {hideContactDetails ? 'إخفاء رقم الجوال والسجل' : 'معلومات التواصل عامة'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold underline">تغيير</span>
            </button>

            {/* Toggle Status / Suspension */}
            <button
              type="button"
              onClick={() => {
                if (status === 'SUSPENDED') {
                  setStatus('APPROVED');
                } else {
                  setStatus('SUSPENDED');
                }
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                status === 'SUSPENDED'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Ban className={`w-4 h-4 ${status === 'SUSPENDED' ? 'text-rose-400' : 'text-slate-400'}`} />
                <div className="text-right">
                  <div className="font-bold">{status === 'SUSPENDED' ? 'موقوف عن العمل 🛑' : 'نشط ومعتمد ✅'}</div>
                  <div className="text-[9px] opacity-80">
                    {status === 'SUSPENDED' ? 'تجميد الاستلام' : 'يعمل كالمعتاد'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold underline">تبديل</span>
            </button>
          </div>

          {status === 'SUSPENDED' && (
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-rose-400 font-bold mb-1">سبب إيقاف التعامل مع المورد:</label>
              <input
                type="text"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="أدخل سبب إيقاف التعامل لتوضيحه في اللوحة..."
                className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-rose-200 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">اسم نشاط / متجر المورد:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">اسم مالك/مالكة النشاط:</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">رقم الجوال:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">رقم الوثيقة / السجل:</label>
              <input
                type="text"
                required
                value={nationalIdOrCR}
                onChange={(e) => setNationalIdOrCR(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">المدينة / المنطقة:</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Address & Location Map */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-bold">العنوان التفصيلي وموقع المتجر:</label>
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="text-amber-400 text-[11px] font-bold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{showMapPicker ? 'إخفاء الخريطة' : 'تحديد على الخريطة'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="اسم الشارع، الحي، رقم المبنى..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white mb-2"
            />

            {showMapPicker && (
              <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800">
                <LocationMap
                  mode="PICKER"
                  lat={lat}
                  lng={lng}
                  address={address}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            )}
          </div>

          {/* Description & Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">وصف النشاط والمنتجات:</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">نسبة عمولة المنصة (%):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                />
                <span className="text-amber-400 font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>بيانات الحساب البنكي للمورد (لتحويل المستحقات):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">اسم البنك:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">رقم IBAN:</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white dir-ltr"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">صاحب الحساب:</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>حفظ جميع التغييرات</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
