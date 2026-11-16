'use client';

import React, { useState, useRef } from 'react';
import { UserSession } from '../auth/AuthModal';

interface CaptainPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
}

export const CaptainPortalModal: React.FC<CaptainPortalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Info & Rules, Step 2: KYC & Live Camera

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('تويوتا هايس 2022');
  const [plateNumber, setPlateNumber] = useState<string>('');
  const [seatsCount, setSeatsCount] = useState<string>('14');
  const [operatingArea, setOperatingArea] = useState<string>('');
  const [loginPhone, setLoginPhone] = useState<string>('');

  // KYC Uploads State
  const [licenseUploaded, setLicenseUploaded] = useState<boolean>(false);
  const [vehicleRegUploaded, setVehicleRegUploaded] = useState<boolean>(false);
  const [nationalIdUploaded, setNationalIdUploaded] = useState<boolean>(false);

  // Live Camera Selfie State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mandatory Terms Agreement Checkbox
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Camera Handlers
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setCameraError('الكاميرا غير مدعومة في هذا المتصفح، يمكنك رفع صورة شخصية حديثة.');
      }
    } catch {
      setCameraError('تعذر فتح الكاميرا، يرجى منح الإذن بالوصول إلى الكاميرا.');
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedSelfie(dataUrl);
      }
      // Stop video stream tracks
      const stream = video.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedSelfie(null);
    handleStartCamera();
  };

  const handleFallbackFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (tab === 'login') {
      if (!loginPhone.trim()) {
        setFormError('الرجاء إدخال رقم هاتف الكابتن المسجل.');
        return;
      }
      onSuccess({
        name: 'الكابتن أبو حيدر الساعدي',
        phone: loginPhone,
        role: 'driver',
        schoolOrUniversity: 'خط ثانوية المتميزات الأولى',
      });
      return;
    }

    // Register flow
    if (!fullName.trim() || !phone.trim() || !plateNumber.trim()) {
      setFormError('الرجاء إكمال كافة بيانات الكابتن والمركبة.');
      return;
    }

    if (!agreedToTerms) {
      setFormError('يجب قراءة شروط وضوابط العمل والموافقة عليها للمتابعة.');
      return;
    }

    if (!capturedSelfie) {
      setFormError('التقاط لقطة الوجه الحية بالكاميرا إلزامي للتحقق من هوية السائق.');
      return;
    }

    onSuccess({
      name: fullName,
      phone: phone,
      role: 'driver',
      schoolOrUniversity: `${vehicleModel} • ${operatingArea || 'بغداد'}`,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="captain-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-lg p-5 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-bus text-slate-900 flex items-center justify-center text-2xl font-bold shadow-ambient-sm">
              🚐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="captain-modal-title" className="text-lg sm:text-xl font-bold text-ink-primary dark:text-ink-inverse">
                  بوابة كباتن خطي • منصة العمل والتوثيق
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                  للسائقين فقط
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-0.5">
                مكان عمل منظم، خطوط طلابية مضمونة الدخل، وتوثيق رسمي فوري
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-full bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted hover:text-ink-primary dark:hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex p-1 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark">
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setFormError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'register'
                ? 'bg-bus text-slate-900 shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            تسجيل كابتن جديد (الانضمام للأسطول)
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('login');
              setFormError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'login'
                ? 'bg-surface-light dark:bg-surface-dark text-ink-primary shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            تسجيل دخول (كابتن مسجل سابقاً)
          </button>
        </div>

        {/* Error notification */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-alert-crimsonSubtle border border-alert-crimson/30 text-alert-crimson text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* TAB 1: Existing Captain Login */}
        {tab === 'login' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-xs text-ink-secondary dark:text-ink-inverseMuted leading-relaxed">
              👋 أهلاً بك يا كابتن. أدخل رقم هاتفك المسجل للانتقال المباشر إلى كابينة القيادة، واستعراض بوليصة ركاب اليوم وبث موقع الحافلة الحي.
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                رقم هاتف الكابتن المسجل
              </label>
              <input
                type="tel"
                dir="ltr"
                required
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="0770 192 4819"
                className="w-full px-4 py-3 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-ink-primary dark:text-ink-inverse text-sm focus:outline-none focus:ring-2 focus:ring-bus font-mono text-right"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-bus hover:bg-bus-hover text-slate-900 font-bold text-sm shadow-ambient-sm transition-all flex items-center justify-center gap-2"
            >
              <span>🚐</span>
              <span>الدخول إلى كابينة القيادة والبث المباشر</span>
            </button>
          </form>
        ) : (
          /* TAB 2: New Captain Onboarding & KYC Flow */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step navigation indicator */}
            <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-surface-borderLight dark:border-surface-borderDark">
              <span className={step === 1 ? 'text-bus-dark dark:text-bus' : 'text-safety'}>
                1. بيانات الكابتن والمركبة والقوانين
              </span>
              <span>←</span>
              <span className={step === 2 ? 'text-bus-dark dark:text-bus' : 'text-ink-muted'}>
                2. الوثائق ولقطة الوجه الحية والموافقة
              </span>
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                {/* Rules & Working Ethics Box */}
                <div className="p-4 rounded-2xl bg-bus-subtle/50 dark:bg-bus-subtleDark/30 border border-bus/30 space-y-2.5">
                  <h4 className="font-bold text-xs sm:text-sm text-bus-dark dark:text-bus flex items-center gap-2">
                    <span>📜</span>
                    <span>ضوابط وقوانين العمل الإلزامية في خطي</span>
                  </h4>
                  <ul className="text-xs text-ink-secondary dark:text-ink-inverseMuted space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>الالتزام الدقيق بمواعيد الصباح والمساء لضمان عدم تأخر الطلبة.</li>
                    <li>الحظر الصارم للتدخين داخل المركبة في كافة الأوقات.</li>
                    <li>منع تشغيل الأغاني الصاخبة وتوفير بيئة هادئة ومريحة للطلبة.</li>
                    <li>الالتزام بالمسار الجغرافي المحدد والسياج الآمن (500م).</li>
                    <li>الالتزام بميثاق المطابقة العمياء: حظر طلب أرقام الهواتف أو التواصل الشخصي خارج التطبيق.</li>
                  </ul>
                </div>

                {/* Captain & Vehicle Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                      الاسم الثلاثي للكابتن (كما في الهوية)
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: حيدر كريم الساعدي"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-sm focus:ring-2 focus:ring-bus"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                      رقم الهاتف الشخصي (واتساب والاتصال)
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0770 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-sm font-mono text-right focus:ring-2 focus:ring-bus"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                      نوع وموديل المركبة
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="مثال: تويوتا هايس 2022 / كيا موهافي"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-sm focus:ring-2 focus:ring-bus"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                      رقم اللوحة والمحافظة
                    </label>
                    <input
                      type="text"
                      required
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="مثال: بغداد 48192 خصوصي"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-sm focus:ring-2 focus:ring-bus"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                      سعة الركاب (المقاعد المتوفرة)
                    </label>
                    <select
                      value={seatsCount}
                      onChange={(e) => setSeatsCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-sm focus:ring-2 focus:ring-bus"
                    >
                      <option value="4">صالون (4 ركاب)</option>
                      <option value="7">عائلية / كيا (7 ركاب)</option>
                      <option value="11">باص صغير / H1 (11 راكب)</option>
                      <option value="14">هايس سياحي (14 راكب)</option>
                      <option value="21">كوستر / باص متوسط (21 راكب)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                      مناطق السير المقترحة / المدارس
                    </label>
                    <input
                      type="text"
                      value={operatingArea}
                      onChange={(e) => setOperatingArea(e.target.value)}
                      placeholder="مثال: المنصور واليرموك ⟵ المتميزات"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-sm focus:ring-2 focus:ring-bus"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!fullName.trim() || !phone.trim() || !plateNumber.trim()) {
                      setFormError('الرجاء إكمال الاسم ورقم الهاتف ورقم اللوحة للمتابعة.');
                      return;
                    }
                    setFormError(null);
                    setStep(2);
                  }}
                  className="w-full py-3 rounded-2xl bg-bus hover:bg-bus-hover text-slate-900 font-bold text-sm shadow-ambient-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>التالي: رفع المستمسكات ولقطة الوجه الحية</span>
                  <span>←</span>
                </button>
              </div>
            ) : (
              /* Step 2: Document Uploads, Live Selfie Camera, and Checkpoint Agreement */
              <div className="space-y-5">
                {/* Documents Grid */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs sm:text-sm text-ink-primary dark:text-ink-inverse flex items-center gap-2">
                    <span>🗂️</span>
                    <span>رفع المستمسكات والوثائق الرسمية (KYC)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* License */}
                    <div className="p-3.5 rounded-2xl border border-surface-borderLight dark:border-surface-borderDark bg-canvas-subtle dark:bg-canvas-subtleDark text-center space-y-2">
                      <div className="text-xl">📄</div>
                      <p className="text-xs font-bold text-ink-primary dark:text-ink-inverse">إجازة السوق</p>
                      <label className="cursor-pointer inline-block px-3 py-1.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-brand hover:bg-brand-subtle">
                        {licenseUploaded ? '✓ تم الرفع' : 'رفع إجازة السوق'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={() => setLicenseUploaded(true)}
                        />
                      </label>
                    </div>

                    {/* Sanawiya */}
                    <div className="p-3.5 rounded-2xl border border-surface-borderLight dark:border-surface-borderDark bg-canvas-subtle dark:bg-canvas-subtleDark text-center space-y-2">
                      <div className="text-xl">🚙</div>
                      <p className="text-xs font-bold text-ink-primary dark:text-ink-inverse">سنوية السيارة</p>
                      <label className="cursor-pointer inline-block px-3 py-1.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-brand hover:bg-brand-subtle">
                        {vehicleRegUploaded ? '✓ تم الرفع' : 'رفع السنوية'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={() => setVehicleRegUploaded(true)}
                        />
                      </label>
                    </div>

                    {/* National ID */}
                    <div className="p-3.5 rounded-2xl border border-surface-borderLight dark:border-surface-borderDark bg-canvas-subtle dark:bg-canvas-subtleDark text-center space-y-2">
                      <div className="text-xl">🪪</div>
                      <p className="text-xs font-bold text-ink-primary dark:text-ink-inverse">البطاقة الوطنية</p>
                      <label className="cursor-pointer inline-block px-3 py-1.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-brand hover:bg-brand-subtle">
                        {nationalIdUploaded ? '✓ تم الرفع' : 'رفع البطاقة'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={() => setNationalIdUploaded(true)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Live Facial Camera Liveness Check */}
                <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border-2 border-bus/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-ink-primary dark:text-ink-inverse flex items-center gap-2">
                      <span>📸</span>
                      <span>لقطة الوجه بالكاميرا بشكل حي (التحقق الأمني المباشر)</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bus-subtle text-bus-dark">
                      إلزامي لمنع انتحال الهوية
                    </span>
                  </div>

                  {cameraError && (
                    <p className="text-xs text-alert-crimson font-medium">{cameraError}</p>
                  )}

                  {/* Camera / Captured view container */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark min-h-[180px]">
                    {capturedSelfie ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={capturedSelfie}
                          alt="صورة الوجه الحية"
                          className="w-36 h-36 rounded-full object-cover border-4 border-safety shadow-ambient-sm"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-safety flex items-center gap-1">
                            <span>✓</span> تم التقاط لقطة الوجه بنجاح
                          </span>
                          <button
                            type="button"
                            onClick={handleRetakePhoto}
                            className="text-xs text-bus-dark dark:text-bus font-bold underline"
                          >
                            إعادة الالتقاط
                          </button>
                        </div>
                      </div>
                    ) : isCameraActive ? (
                      <div className="flex flex-col items-center gap-3">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-56 h-44 rounded-2xl object-cover border-2 border-bus shadow-inner"
                        ></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        <button
                          type="button"
                          onClick={handleCapturePhoto}
                          className="px-6 py-2.5 rounded-xl bg-safety hover:bg-safety-hover text-white text-xs font-bold shadow-ambient-safety flex items-center gap-2"
                        >
                          <span>📸</span>
                          <span>التقاط الصورة الآن</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-bus-subtle text-bus-dark flex items-center justify-center text-2xl mx-auto">
                          📷
                        </div>
                        <p className="text-xs text-ink-muted dark:text-ink-inverseMuted max-w-sm">
                          التقط صورة واضحة ومباشرة لوجهك من كاميرا الهاتف للتحقق ومطابقتها مع صورة البطاقة الوطنية وإجازة السوق.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={handleStartCamera}
                            className="px-4 py-2 rounded-xl bg-bus hover:bg-bus-hover text-slate-900 text-xs font-bold shadow-ambient-sm transition-all"
                          >
                            فتح كاميرا الهاتف الحية
                          </button>
                          <label className="cursor-pointer px-4 py-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight text-xs font-bold text-ink-secondary hover:bg-canvas-subtle">
                            أو التقاط بكاميرا الهاتف المباشرة
                            <input
                              type="file"
                              accept="image/*"
                              capture="user"
                              className="hidden"
                              onChange={handleFallbackFileCapture}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mandatory Checkpoint: Agreement */}
                <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-bus focus:ring-bus"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-ink-primary dark:text-ink-inverse leading-relaxed">
                      أقر بأنني قرأت وفهمت كافة ضوابط وقوانين منظومة خطي أعلاه، وأتعهد بالالتزام بأخلاقيات المهنة وسلامة الطلبة، وأوافق على تدقيق مستمسكاتي الرسمية والفحص الجنائي الأمني.
                    </span>
                  </label>
                </div>

                {/* Final Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted text-xs font-bold hover:text-ink-primary"
                  >
                    السابق
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-bus hover:bg-bus-hover text-slate-900 font-bold text-sm shadow-ambient-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>🚀</span>
                    <span>إرسال الطلب والانتقال إلى كابينة القيادة</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
