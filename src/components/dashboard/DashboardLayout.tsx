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

      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-surface-glassLight dark:bg-surface-glassDark border-b border-surface-borderLight dark:border-surface-borderDark transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
          {/* Left: Hamburger Button (3 lines) + Brand Icon */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="فتح القائمة الجانبية"
              className="p-2.5 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-ink-primary dark:text-ink-inverse hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex flex-col justify-center items-center gap-1.5 w-11 h-11 shadow-sm"
            >
              <span className="w-5 h-0.5 bg-current rounded-full transition-all"></span>
              <span className="w-5 h-0.5 bg-current rounded-full transition-all"></span>
              <span className="w-5 h-0.5 bg-current rounded-full transition-all"></span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              title="العودة لصفحة الهبوط"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-bus text-slate-900 font-bold text-lg shadow-ambient-sm">
                خـ
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safety opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-safety"></span>
                </span>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-base font-bold text-ink-primary dark:text-ink-inverse">
                  لوحة خَـطّـي
                </span>
                <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted">
                  التتبع والعمليات المباشرة
                </p>
              </div>
            </button>
          </div>

          {/* Center: Navigation Pills */}
          <nav aria-label="أدوار اللوحة" className="hidden md:flex items-center p-1 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark">
            <button
              type="button"
              onClick={() => onRoleChange('parent')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'parent'
                  ? 'bg-surface-light dark:bg-surface-dark text-brand shadow-ambient-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <span>👨‍👩‍👧‍👦</span>
              <span>بوابة ولي الأمر</span>
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('driver')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'driver'
                  ? 'bg-surface-light dark:bg-surface-dark text-bus-dark shadow-ambient-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <span>🚐</span>
              <span>كابينة الكابتن</span>
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'admin'
                  ? 'bg-surface-light dark:bg-surface-dark text-ink-primary shadow-ambient-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <span>🛡️</span>
              <span>غرفة العمليات</span>
            </button>
          </nav>

          {/* Right Controls: User info & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-safety-darkText dark:text-safety bg-safety-subtle dark:bg-safety-subtleDark border border-safety/30"
              title="ميثاق المطابقة العمياء"
            >
              <span className="w-2 h-2 rounded-full bg-safety inline-block"></span>
              <span>مطابقة عمياء</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="تبديل المظهر"
              className="p-2 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted dark:text-ink-inverseMuted hover:text-ink-primary dark:hover:text-white transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark hover:bg-slate-200 text-xs font-bold text-ink-muted hover:text-ink-primary transition-colors flex items-center gap-1"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Role Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
