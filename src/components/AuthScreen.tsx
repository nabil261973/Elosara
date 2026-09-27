import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  User,
  Store,
  ShieldCheck,
  Lock,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  Phone,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';

export const AuthScreen: React.FC = () => {
  const { login, registerUser, addToast } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [registerRole, setRegisterRole] = useState<UserRole>('CLIENT');
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('الرياض');
  const [regAddress, setRegAddress] = useState('');

  // Additional fields for Vendor Registration
  const [vendorStoreName, setVendorStoreName] = useState('');
  const [vendorCr, setVendorCr] = useState('');
  const [vendorIban, setVendorIban] = useState('');
  const [vendorDesc, setVendorDesc] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      addToast('error', 'بيانات غير مكتملة', 'يرجى كتابة اسم المستخدم وكلمة المرور');
      return;
    }

    const res = login(loginUsername.trim(), loginPassword.trim());
    if (!res.success) {
      addToast('error', 'فشل تسجيل الدخول', res.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regPassword.trim() || !regName.trim()) {
      addToast('error', 'حقول مطلوبة', 'يرجى إكمال الحقول الأساسية لإنشاء الحساب');
      return;
    }

    if (registerRole === 'VENDOR' && (!vendorStoreName.trim() || !vendorCr.trim())) {
      addToast('error', 'بيانات المتجر مطلوبة', 'يرجى كتابة اسم المتجر ورقم وثيقة العمل الحر/السجل');
      return;
    }

    const res = registerUser({
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword.trim(),
      role: registerRole,
      phone: regPhone.trim() || '0500000000',
      city: regCity,
      address: regAddress.trim() || `${regCity} - العنوان الرئيسي`,
      vendorData: registerRole === 'VENDOR' ? {
        storeName: vendorStoreName.trim(),
        ownerName: regName.trim(),
        nationalIdOrCR: vendorCr.trim(),
        bankIban: vendorIban.trim() || 'SA0000000000000000000000',
        description: vendorDesc.trim() || 'متجر جديد للأسر المنتجة'
      } : undefined
    });

    if (res.success) {
      addToast('success', 'تم إنشاء الحساب بنجاح 🎉', 'أهلاً بك في سوق الأسر المنتجة');
    } else {
      addToast('error', 'خطأ في التسجيل', res.message || 'تعذر إنشاء الحساب');
    }
  };

  const fillQuickCredentials = (u: string, p: string) => {
    setLoginUsername(u);
    setLoginPassword(p);
    login(u, p);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-right selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-6">
        
        {/* Left Side: Brand & Hero Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-6 sm:p-8 text-slate-950 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="w-14 h-14 bg-slate-950 text-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8" />
            </div>

            <div>
              <span className="bg-slate-950/20 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                منصة متعددة التراخيص
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">
                سوق الأسر المنتجة والمأكولات المنزلية
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed mt-2">
                بيئة عمل متكاملة تدعم التوثيق، الحوكمة الرسمية، وعزل صلاحيات العميل، المورد، والإدارة المركزية.
              </p>
            </div>
          </div>

          {/* Preset Accounts Bar for Instant Demo Testing */}
          <div className="mt-8 space-y-3 relative z-10 bg-slate-950/25 p-4 rounded-2xl border border-amber-400/30 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>دخول سريع بنقرة واحدة للتجربة:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillQuickCredentials('admin', '123')}
                className="bg-slate-950/90 hover:bg-slate-950 text-sky-300 font-bold p-2 rounded-xl flex items-center gap-1.5 border border-sky-500/30 text-right transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">المدير العام (admin)</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('um_khaled', '123')}
                className="bg-slate-950/90 hover:bg-slate-950 text-emerald-300 font-bold p-2 rounded-xl flex items-center gap-1.5 border border-emerald-500/30 text-right transition-all"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">أم خالد (مورد معتمد)</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('um_sara', '123')}
                className="bg-slate-950/90 hover:bg-slate-950 text-amber-300 font-bold p-2 rounded-xl flex items-center gap-1.5 border border-amber-500/30 text-right transition-all"
              >
                <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">أم سارة (مورد معلق)</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('ahmed', '123')}
                className="bg-slate-950/90 hover:bg-slate-950 text-amber-200 font-bold p-2 rounded-xl flex items-center gap-1.5 border border-amber-500/30 text-right transition-all"
              >
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">عبدالله (عميل)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-center">
          
          {/* Header Switcher: LOGIN vs REGISTER */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className={`font-black text-sm sm:text-base pb-1 transition-all ${
                  mode === 'LOGIN'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تسجيل الدخول
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className={`font-black text-sm sm:text-base pb-1 transition-all ${
                  mode === 'REGISTER'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                إنشاء حساب جديد
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              كلمة المرور الافتراضية للتجربة: <code className="text-amber-400 font-bold font-mono">123</code>
            </span>
          </div>

          {/* LOGIN FORM */}
          {mode === 'LOGIN' ? (
            <motion.form
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  اسم المستخدم (Username):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="مثال: ahmed أو um_khaled أو admin"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  كلمة المرور (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور (مثال: 123)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-10 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-1 text-[11px] text-slate-300">
                <p className="font-bold text-amber-300">💡 توجيه الضوابط والخصوصية:</p>
                <p>• تسجيل الدخول كـ <span className="font-bold text-emerald-400">مورد</span> يفتح لوحة التحكم الخاصة بمتجره فقط ولا يمكنه الاطلاع على متاجر المنافسين.</p>
                <p>• تسجيل الدخول كـ <span className="font-bold text-amber-400">عميل</span> يفتح خيار الطلب ومتابعة طلباته الشخصية فقط.</p>
                <p>• تسجيل الدخول كـ <span className="font-bold text-sky-400">مدير</span> يتيح الرقابة الشاملة على كافة الطلبات والموردين والتصنيفات.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول النظام</span>
              </button>
            </motion.form>
          ) : (
            /* REGISTER FORM */
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1"
            >
              {/* Role Selection Tabs in Register */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 text-[11px]">
                  نوع الحساب المراد إنشاؤه:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('CLIENT')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      registerRole === 'CLIENT'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>حساب عميل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('VENDOR')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      registerRole === 'VENDOR'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>حساب أسرة منتجة (مورد)</span>
                  </button>
                </div>
              </div>

              {/* Basic User Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الاسم الكامل:
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: محمد الغامدي"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    اسم المستخدم (Login Username):
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="مثال: mohammed99"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="كلمة مرور من اختياراتك"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    رقم الجوال:
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Vendor Specific Extra Fields */}
              {registerRole === 'VENDOR' && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs">
                    <Store className="w-4 h-4" />
                    <span>بيانات النشاط التجاري لـ (الأسرة المنتجة):</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      اسم المتجر / النشاط التجاري:
                    </label>
                    <input
                      type="text"
                      required
                      value={vendorStoreName}
                      onChange={(e) => setVendorStoreName(e.target.value)}
                      placeholder="مثال: أسرة أم فهد - المعجنات والمخبوزات"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        وثيقة العمل الحر / الهوية:
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorCr}
                        onChange={(e) => setVendorCr(e.target.value)}
                        placeholder="FL-XXXXXXX"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        الحساب البنكي (IBAN):
                      </label>
                      <input
                        type="text"
                        value={vendorIban}
                        onChange={(e) => setVendorIban(e.target.value)}
                        placeholder="SA..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      وصف مختصر للنشاط والمنتجات:
                    </label>
                    <textarea
                      rows={2}
                      value={vendorDesc}
                      onChange={(e) => setVendorDesc(e.target.value)}
                      placeholder="نبذة عن المأكولات والمصنوعات التي تقدمها الأسرة..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-98 cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>تسجيل الحساب والدخول</span>
              </button>
            </motion.form>
          )}
        </div>

      </div>
    </div>
  );
};
