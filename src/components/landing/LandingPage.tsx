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
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-inverse transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-surface-glassLight dark:bg-surface-glassDark border-b border-surface-borderLight dark:border-surface-borderDark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-bus to-bus-dark text-slate-900 flex items-center justify-center font-bold text-xl shadow-ambient-sm">
              خـ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-ink-primary dark:text-ink-inverse">
                  مـنـظـومـة خَـطّـي
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bus-subtle dark:bg-bus-subtleDark text-bus-dark border border-bus/30">
                  العراق 🇮🇶
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
                النقل المدرسي والجامعي الذكي
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark hover:bg-canvas-subtle text-ink-primary dark:text-ink-inverse font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-sm shadow-ambient-brand transition-all flex items-center gap-2"
            >
              <span>فتح حساب جديد</span>
              <span>←</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-bus/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-xs font-semibold text-ink-muted dark:text-ink-inverseMuted shadow-sm">
            <span className="w-2 h-2 rounded-full bg-safety animate-pulse"></span>
            <span>أول منصة نقل طلابي ذكية تعتمد المطابقة العمياء في العراق</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-primary dark:text-ink-inverse tracking-tight max-w-4xl mx-auto leading-tight">
            اطمئن على وصول أولادك.. <br />
            <span className="bg-gradient-to-l from-brand via-sky-600 to-bus-dark bg-clip-text text-transparent">
              خطوط مدرسية وجامعية آمنة بتتبع لحظي
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-ink-secondary dark:text-ink-inverseMuted max-w-2xl mx-auto leading-relaxed">
            منظومة هندسية متكاملة تربط أولياء الأمور والطلبة بأفضل كباتن الخطوط الموثوقين، مع تتبع حي للسيارة، إشعار اقتراب 500 متر، وحماية كاملة لخصوصية العائلات.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-base shadow-ambient-brand transition-all flex items-center justify-center gap-2.5"
            >
              <span>🚀</span>
              <span>سجّل خط ابنك الآن (حساب جديد)</span>
            </button>

            <button
              type="button"
              onClick={onOpenCaptainPortal}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-bus to-bus-hover text-slate-900 font-bold text-base shadow-ambient-sm hover:shadow-ambient-md transition-all flex items-center justify-center gap-2.5 border border-bus-dark/20"
            >
              <span className="text-xl">🚐</span>
              <span>أنا كابتن</span>
            </button>

            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark border-2 border-bus hover:bg-bus/10 text-ink-primary dark:text-ink-inverse font-bold text-base shadow-ambient-sm transition-all flex items-center justify-center gap-2.5"
            >
              <span>🧭</span>
              <span>تجربة لوحة التحكم ورادار التتبع الحي</span>
            </button>
          </div>

          {/* Trust Metrics Ribbon */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
              <div className="text-2xl sm:text-3xl font-black text-ink-primary dark:text-ink-inverse">
                +4,850
              </div>
              <div className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-1">
                رحلة مدرسية آمنة
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
              <div className="text-2xl sm:text-3xl font-black text-safety-darkText dark:text-safety">
                100%
              </div>
              <div className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-1">
                سائقون مفحوصون جنائياً (KYC)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
              <div className="text-2xl sm:text-3xl font-black text-bus-dark dark:text-bus">
                500 م
              </div>
              <div className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-1">
                تنبيه سياج الوصول الصباحي
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
              <div className="text-2xl sm:text-3xl font-black text-brand">
                صفر تسريب
              </div>
              <div className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-1">
                حماية مطلقة لأرقام العائلات
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-canvas-subtle/60 dark:bg-canvas-subtleDark/40 border-y border-surface-borderLight dark:border-surface-borderDark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              لماذا يختار العراقيون «خطي»؟
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-ink-primary dark:text-ink-inverse">
              مميزات تفوق النقل التقليدي بمراحل
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-inverseMuted">
              حلول عملية مدروسة خصيصاً لواقع الطرق والمدارس والجامعات في العراق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-safety-subtle text-safety flex items-center justify-center text-2xl shadow-inner">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-ink-primary dark:text-ink-inverse">
                المطابقة العمياء (Blind Matching)
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-inverseMuted leading-relaxed">
                خصوصية بناتنا وأبنائنا خط أحمر. لا يُكشف رقم هاتف ولي الأمر أو عنوان البيت الدقيق للسائق إلا بعد التأكيد الرسمي وتثبيت المقعد.
              </p>
              <button
                type="button"
                onClick={onOpenPrivacyNotice}
                className="text-xs text-safety-darkText dark:text-safety font-bold hover:underline"
              >
                قراءة ميثاق الخصوصية ←
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-bus-subtle text-bus-dark flex items-center justify-center text-2xl shadow-inner">
                📡
              </div>
              <h3 className="text-lg font-bold text-ink-primary dark:text-ink-inverse">
                سياج 500 متر وتتبع لحظي
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-inverseMuted leading-relaxed">
                لا انتظار في برد الشتاء ولا حر الصيف. ينبهك التطبيق صوتياً عند اقتراب الحافلة بـ 500 متر من المنزل مع عد تنازلي لدقائق الوصول.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-subtle text-brand flex items-center justify-center text-2xl shadow-inner">
                🚫
              </div>
              <h3 className="text-lg font-bold text-ink-primary dark:text-ink-inverse">
                زر «ابني غائب اليوم» بنقرة واحدة
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-inverseMuted leading-relaxed">
                ابنك مريض أو مجاز؟ بضغطة زر واحدة يتحدث مسار السائق ويتجاوز المحطة تلقائياً، دون الحاجة للاتصال به فجراً أو إحراجه بالاعتذار.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-bus-dark">
              بساطة الاستخدام
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-ink-primary dark:text-ink-inverse">
              كيف تبدأ في خطي خلال دقائق؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-bus text-slate-900 font-bold text-xl flex items-center justify-center mx-auto shadow-ambient-sm">
                1
              </div>
              <h3 className="font-bold text-base text-ink-primary dark:text-ink-inverse">
                سجّل بياناتك ومدرستك
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted max-w-xs mx-auto">
                اختر صفتك (ولي أمر أو طالب إعدادي/جامعي) وحدد منطقة سكنك وموقع الدوام.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-brand text-white font-bold text-xl flex items-center justify-center mx-auto shadow-ambient-brand">
                2
              </div>
              <h3 className="font-bold text-base text-ink-primary dark:text-ink-inverse">
                الفرز المكاني الذكي
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted max-w-xs mx-auto">
                خوارزمية PostGIS تطابقك مع أفضل خط قريب في نفس الحي والمدرسة وتثبت مقعدك.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-safety text-white font-bold text-xl flex items-center justify-center mx-auto shadow-ambient-safety">
                3
              </div>
              <h3 className="font-bold text-base text-ink-primary dark:text-ink-inverse">
                تتبع آمن وراحة بال
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted max-w-xs mx-auto">
                شاهد حركة الحافلة يومياً بمراحلها الخمس حتى وصول ابنك بسلام إلى مقعد الدراسة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold">
            جاهز لتأمين خط دراسي منظم ومريح لأبنائك؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            انضم الآن إلى مئات العائلات والمدارس العراقية التي اختارت راحة البال والأمان التام مع منظومة خطي.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-3.5 rounded-2xl bg-bus hover:bg-bus-hover text-slate-900 font-bold text-sm shadow-ambient-sm transition-all"
            >
              فتح حساب جديد فوراً
            </button>
            <button
              type="button"
              onClick={onExploreDemo}
              className="px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-sm transition-all"
            >
              معاينة لوحة التحكم
            </button>
          </div>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="py-8 border-t border-surface-borderLight dark:border-surface-borderDark text-center text-xs text-ink-muted dark:text-ink-inverseMuted space-y-2">
        <p>
          منظومة خَـطّـي للنقل الدراسي والجامعي الذكي في العراق © 2026 • حوكمة معمارية حتمية وفق إطار عمل B.R.I.C.K
        </p>
        <p className="text-[11px] text-slate-400">
          تتبع حي Traccar + PostGIS Spatial Engine • حماية الخصوصية العمياء (Blind Matching RLS)
        </p>
      </footer>
    </div>
  );
};
