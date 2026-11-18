'use client';

import React from 'react';

export type UserRole = 'parent' | 'driver' | 'admin';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeStudentName?: string;
  onOpenPrivacyNotice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isDark,
  onToggleTheme,
  onOpenPrivacyNotice,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand identity & live status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-2xs">
            <span className="tracking-tight select-none">خـ</span>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                خَـطّـي
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                العراق 🇮🇶
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              منظومة النقل المدرسي والجامعي الذكي
            </p>
          </div>
        </div>

        {/* Role Navigation Pills */}
        <nav aria-label="أدوار النظام" className="hidden md:flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onRoleChange('parent')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'parent'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>👨‍👩‍👧‍👦</span>
            <span>بوابة ولي الأمر</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('driver')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'driver'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🚐</span>
            <span>كابينة الكابتن</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'admin'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span>غرفة العمليات</span>
          </button>
        </nav>

        {/* Global Controls: Privacy badge & Theme toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenPrivacyNotice}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-100/50 transition-colors"
            title="انقر للاطلاع على سياسة حماية الخصوصية العمياء"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>مطابقة عمياء</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="تبديل المظهر"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-xs"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};
