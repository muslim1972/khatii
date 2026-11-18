'use client';

import React from 'react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreDemo: () => void;
  onOpenPrivacyNotice: () => void;
  onOpenCaptainPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreDemo,
  onOpenPrivacyNotice,
  onOpenCaptainPortal,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Top Navbar: Ultra-compact, elegant and non-intrusive */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
              خـ
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                خَـطّـي
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                العراق 🇮🇶
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCaptainPortal()}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex items-center gap-1"
            >
              <span>🚐</span>
              <span>بوابة الكابتن</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              فتح حساب جديد
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section: Compact, high density, balanced Arabic typography */}
      <section className="relative overflow-hidden py-8 sm:py-14">
        {/* Subtle, soft ambient glows */}
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-16 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          {/* Subtle Trust Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>أول منصة نقل طلابي ذكية تعتمد المطابقة العمياء في العراق</span>
          </div>

          {/* Headline: Restrained, authoritative and elegant */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto leading-snug">
            اطمئن على وصول أولادك.. <br />
            <span className="text-blue-600 dark:text-blue-400">
              خطوط مدرسية وجامعية آمنة بتتبع لحظي
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            منظومة متكاملة تربط أولياء الأمور والطلبة بأفضل كباتن الخطوط الموثوقين مع فحص أمني جنائي كامل، وتنبيه 500 متر قبل الوصول، وحماية تامة لخصوصية العائلات.
          </p>

          {/* Compact Dual-Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>🚀</span>
              <span>سجّل خط ابنك (حساب جديد)</span>
            </button>

            <button
              type="button"
              onClick={onOpenCaptainPortal}
              className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>🚐</span>
              <span>أنا كابتن خط</span>
            </button>

            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto h-10 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>🧭</span>
              <span>معاينة لوحة التحكم الحية</span>
            </button>
          </div>

          {/* Trust Metrics Ribbon: Slim 4-column strip without visual noise */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                +4,850
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                رحلة مدرسية آمنة
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                فحص جنائي (KYC)
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                500 م
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                تنبيه سياج الوصول
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                صفر تسريب
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                حماية أرقام العائلات
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features: Compact High-Density Grid */}
      <section className="py-10 sm:py-14 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              لماذا يختار العراقيون «خطي»؟
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
              مميزات تفوق النقل التقليدي بمراحل
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              حلول عملية مدروسة خصيصاً لواقع الطرق والمدارس والجامعات في العراق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
                🛡️
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                المطابقة العمياء (Blind Matching)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                خصوصية بناتنا وأبنائنا خط أحمر. لا يُكشف رقم هاتف ولي الأمر أو عنوان البيت الدقيق للسائق إلا بعد التأكيد الرسمي وتثبيت المقعد.
              </p>
              <button
                type="button"
                onClick={onOpenPrivacyNotice}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-block pt-1"
              >
                قراءة ميثاق الخصوصية ←
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
                📡
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                سياج 500 متر وتتبع لحظي
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                لا انتظار في برد الشتاء ولا حر الصيف. ينبهك التطبيق فور اقتراب الحافلة بـ 500 متر من المنزل مع عد تنازلي لدقائق الوصول.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
                🚫
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                زر «ابني غائب اليوم» بنقرة واحدة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ابنك مريض أو مجاز؟ بضغطة زر واحدة يتحدث مسار السائق ويتجاوز المحطة تلقائياً، دون الحاجة للاتصال به فجراً أو إحراجه بالاعتذار.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              بساطة الاستخدام
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
              كيف تبدأ في خطي خلال دقائق؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mx-auto shadow-2xs">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                سجّل بياناتك ومدرستك
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                اختر صفتك (ولي أمر أو طالب إعدادي/جامعي) وحدد منطقة سكنك وموقع الدوام.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center mx-auto shadow-2xs">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                الفرز المكاني الذكي
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                خوارزمية PostGIS تطابقك مع أفضل خط قريب في نفس الحي والمدرسة وتثبت مقعدك.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto shadow-2xs">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                تتبع آمن وراحة بال
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                شاهد حركة الحافلة يومياً بمراحلها الخمس حتى وصول ابنك بسلام إلى مقعد الدراسة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold">
            جاهز لتأمين خط دراسي منظم ومريح لأبنائك؟
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            انضم الآن إلى مئات العائلات والمدارس العراقية التي اختارت راحة البال والأمان التام مع منظومة خطي.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
            >
              فتح حساب جديد فوراً
            </button>
            <button
              type="button"
              onClick={onExploreDemo}
              className="h-10 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition-all"
            >
              معاينة لوحة التحكم
            </button>
          </div>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <p>
          منظومة خَـطّـي للنقل الدراسي والجامعي الذكي في العراق © 2026 • حوكمة معمارية حتمية وفق إطار عمل B.R.I.C.K
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          تتبع حي Traccar + PostGIS Spatial Engine • حماية الخصوصية العمياء (Blind Matching RLS)
        </p>
      </footer>
    </div>
  );
};
