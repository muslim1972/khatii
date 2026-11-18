'use client';

import React, { useState } from 'react';
import { UserRole } from '../common/Header';
import { ParentPortal } from '../parent/ParentPortal';
import { DriverCockpit } from '../driver/DriverCockpit';
import { AdminOperationsRadar } from '../admin/AdminOperationsRadar';
import { AppDrawer } from '../navigation/AppDrawer';
import { BlindMatchingModal } from '../modals/BlindMatchingModal';

interface DashboardLayoutProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateHome: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userName?: string;
  userPhone?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentRole,
  onRoleChange,
  onNavigateHome,
  isDark,
  onToggleTheme,
  userName = 'أحمد الكرخي',
  userPhone = '0770••••120',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-inverse transition-colors duration-200">
      {/* Drawer Component */}
      <AppDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        onNavigateHome={onNavigateHome}
        onOpenPrivacyNotice={() => setIsPrivacyModalOpen(true)}
        userName={userName}
        userPhone={userPhone}
      />

      {/* Top Application Bar: Compact 56px Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: Hamburger Button + Brand */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="فتح القائمة الجانبية"
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex flex-col justify-center items-center gap-1 w-9 h-9 shadow-2xs"
            >
              <span className="w-4 h-0.5 bg-current rounded-full transition-all"></span>
              <span className="w-4 h-0.5 bg-current rounded-full transition-all"></span>
              <span className="w-4 h-0.5 bg-current rounded-full transition-all"></span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              title="العودة لصفحة الهبوط"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-2xs">
                خـ
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  لوحة خَـطّـي
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  التتبع والمطابقة الحية
                </p>
              </div>
            </button>
          </div>

          {/* Center: Navigation Pills */}
          <nav aria-label="أدوار اللوحة" className="hidden md:flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
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

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20"
              title="ميثاق المطابقة العمياء"
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

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {currentRole === 'parent' && <ParentPortal />}
        {currentRole === 'driver' && <DriverCockpit />}
        {currentRole === 'admin' && <AdminOperationsRadar />}
      </main>

      {/* Privacy modal */}
      <BlindMatchingModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-surface-borderLight dark:border-surface-borderDark text-center text-xs text-ink-muted dark:text-ink-inverseMuted space-y-1">
        <p>منظومة خطي للنقل الطلابي الذكي في العراق © 2026</p>
        <p className="text-[11px] text-slate-400">
          تتبع مباشر Traccar • خوارزمية فرز PostGIS • حوكمة B.R.I.C.K v4.0
        </p>
      </footer>
    </div>
  );
};
