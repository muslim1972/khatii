'use client';

import React from 'react';

interface BlindMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlindMatchingModal: React.FC<BlindMatchingModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blind-matching-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-lg p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-safety-subtle dark:bg-safety-subtleDark text-safety flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <h3 id="blind-matching-title" className="text-lg font-bold text-ink-primary dark:text-ink-inverse">
                ميثاق المطابقة العمياء (Blind Matching)
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
                حماية خصوصية العائلات والطلبة وفق أعلى المعايير
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink-primary dark:text-ink-inverseMuted dark:hover:text-white bg-canvas-subtle dark:bg-canvas-subtleDark transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-4 text-xs sm:text-sm text-ink-secondary dark:text-ink-inverseMuted leading-relaxed">
          <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark space-y-2">
            <h4 className="font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>🔒</span> حجب أرقام الهواتف والأسماء
            </h4>
            <p>
              لا يمكن لأي سائق في منظومة خطي الاطلاع على رقم هاتف ولي الأمر أو الاسم الكامل للطالب/الطالبة أو العنوان الدقيق للمنزل قبل الموافقة الصريحة المتبادلة وتثبيت المقعد رسمياً.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark space-y-2">
            <h4 className="font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>📍</span> الفرز المكاني المشفر (PostGIS Spatio-Temporal)
            </h4>
            <p>
              يتم الربط بين الطلبة وسائقي الخطوط عبر خوارزمية فرز جغرافي تقيس المسافة دون تخزين نقاط التتبع الشخصية بشكل مكشوف، مما يضمن أمان المسار وموثوقية التجمع السكني.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark space-y-2">
            <h4 className="font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>📜</span> فحص المستمسكات والتحقق الجنائي (KYC)
            </h4>
            <p>
              جميع السائقين يخضعون لفحص أمني وجنائي صارم يشمل السنوية، إجازة السوق، وعدم المحكومية قبل تفعيل الخط على المنظومة.
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm shadow-ambient-brand transition-all"
        >
          فهمت ذلك وأوافق على الميثاق
        </button>
      </div>
    </div>
  );
};
