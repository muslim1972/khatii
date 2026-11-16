'use client';

import React from 'react';
import { UserRole } from '../common/Header';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateHome: () => void;
  onOpenPrivacyNotice: () => void;
  userName?: string;
  userPhone?: string;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  onNavigateHome,
  onOpenPrivacyNotice,
  userName = 'أحمد الكرخي',
  userPhone = '0770••••120',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="القائمة الجانبية للمنظومة"
      className="fixed inset-0 z-50 flex animate-fade-in"
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-80 sm:w-96 max-w-full bg-surface-light dark:bg-surface-dark border-l border-surface-borderLight dark:border-surface-borderDark shadow-ambient-lg h-full flex flex-col justify-between p-6 z-10 transition-transform duration-300">
        <div className="space-y-6">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-bus text-slate-900 flex items-center justify-center font-bold text-lg shadow-ambient-sm">
                خـ
              </div>
              <div>
                <h3 className="font-bold text-sm text-ink-primary dark:text-ink-inverse">
                  منظومة خَـطّـي
                </h3>
                <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted">
                  العراق • النقل المدرسي والجامعي
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق القائمة"
              className="w-8 h-8 rounded-full bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted hover:text-ink-primary dark:hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-subtle text-brand flex items-center justify-center text-xl font-bold shadow-inner">
              {currentRole === 'parent' ? '👨‍👩‍👧‍👦' : currentRole === 'driver' ? '🚐' : '🛡️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-ink-primary dark:text-ink-inverse truncate">
                  {userName}
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                  موثّق
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted font-mono">
                {userPhone}
              </p>
              <p className="text-[11px] text-bus-dark dark:text-bus font-medium mt-0.5">
                {currentRole === 'parent'
                  ? 'حساب ولي أمر (Partner)'
                  : currentRole === 'driver'
                  ? 'حساب كابتن خط معتمد'
                  : 'مسؤول غرفة العمليات'}
              </p>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-ink-muted dark:text-ink-inverseMuted">
              التبديل السريع بين البوابات
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onRoleChange('parent');
                  onClose();
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                  currentRole === 'parent'
                    ? 'bg-brand text-white border-brand shadow-ambient-brand'
                    : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                }`}
              >
                ولي الأمر
              </button>

              <button
                type="button"
                onClick={() => {
                  onRoleChange('driver');
                  onClose();
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                  currentRole === 'driver'
                    ? 'bg-bus text-slate-900 border-bus shadow-ambient-sm'
                    : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                }`}
              >
                الكابتن
              </button>

              <button
                type="button"
                onClick={() => {
                  onRoleChange('admin');
                  onClose();
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                  currentRole === 'admin'
                    ? 'bg-ink-primary text-white border-ink-primary shadow-ambient-sm'
                    : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                }`}
              >
                الإدارة
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav aria-label="تنقلات القائمة الجانبية" className="space-y-1.5 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-canvas-subtle dark:hover:bg-canvas-subtleDark text-ink-primary dark:text-ink-inverse text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>🧭</span>
              <span>لوحة التحكم والتتبع المباشر</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenPrivacyNotice();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-canvas-subtle dark:hover:bg-canvas-subtleDark text-ink-primary dark:text-ink-inverse text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>🛡️</span>
              <span>ميثاق حماية الخصوصية العمياء (Blind Matching)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-canvas-subtle dark:hover:bg-canvas-subtleDark text-ink-primary dark:text-ink-inverse text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>🌐</span>
              <span>صفحة الهبوط الرئيسية للتعريف بالمنظومة</span>
            </button>
          </nav>
        </div>

        {/* Footer actions: Logout */}
        <div className="pt-4 border-t border-surface-borderLight dark:border-surface-borderDark space-y-3">
          <button
            type="button"
            onClick={() => {
              onNavigateHome();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-alert-crimsonSubtle hover:bg-red-100 text-alert-crimson font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>🚪</span>
            <span>تسجيل الخروج والعودة للرئيسية</span>
          </button>

          <p className="text-[10px] text-center text-ink-muted dark:text-ink-inverseMuted">
            منظومة خطي v1.0.2 • حوكمة B.R.I.C.K السيادية
          </p>
        </div>
      </div>
    </div>
  );
};
