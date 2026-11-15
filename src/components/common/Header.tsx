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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-surface-glassLight dark:bg-surface-glassDark border-b border-surface-borderLight dark:border-surface-borderDark transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity & live status */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-bus to-bus-dark text-slate-900 shadow-ambient-sm">
            <span className="text-xl font-bold tracking-tight select-none">خـ</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safety opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-safety"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-ink-primary dark:text-ink-inverse">
                مـنـظـومـة خَـطّـي
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-bus-subtle dark:bg-bus-subtleDark text-bus-dark border border-bus/30">
                العراق 🇮🇶
              </span>
            </div>
            <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
              إدارة خطوط النقل المدرسي والجامعي • PostGIS + Traccar
            </p>
          </div>
        </div>

        {/* Role Navigation Pills */}
        <nav aria-label="أدوار النظام" className="flex items-center p-1 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark shadow-inner">
          <button
            type="button"
            onClick={() => onRoleChange('parent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentRole === 'parent'
                ? 'bg-surface-light dark:bg-surface-dark text-brand dark:text-white shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary dark:text-ink-inverseMuted dark:hover:text-white'
            }`}
          >
            <span>👨‍👩‍👧‍👦</span>
            <span>بوابة ولي الأمر والطلبة</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('driver')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentRole === 'driver'
                ? 'bg-surface-light dark:bg-surface-dark text-bus-dark dark:text-bus shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary dark:text-ink-inverseMuted dark:hover:text-white'
            }`}
          >
            <span>🚐</span>
            <span>كابينة السائق (الكابتن)</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              currentRole === 'admin'
                ? 'bg-surface-light dark:bg-surface-dark text-ink-primary dark:text-white shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary dark:text-ink-inverseMuted dark:hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span>غرفة العمليات (Admin)</span>
          </button>
        </nav>

        {/* Global Controls: Privacy badge & Theme toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPrivacyNotice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-safety-darkText dark:text-safety bg-safety-subtle dark:bg-safety-subtleDark border border-safety/30 hover:bg-safety/20 transition-colors"
            title="انقر للاطلاع على سياسة حماية الخصوصية العمياء"
          >
            <span className="w-2 h-2 rounded-full bg-safety inline-block"></span>
            <span>المطابقة العمياء مفعلة</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="تبديل المظهر"
            className="p-2 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted dark:text-ink-inverseMuted hover:text-ink-primary dark:hover:text-white transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};
