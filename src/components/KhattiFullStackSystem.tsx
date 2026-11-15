'use client';

import React, { useState, useEffect } from 'react';
import { Header, UserRole } from './common/Header';
import { ParentPortal } from './parent/ParentPortal';
import { DriverCockpit } from './driver/DriverCockpit';
import { AdminOperationsRadar } from './admin/AdminOperationsRadar';
import { BlindMatchingModal } from './modals/BlindMatchingModal';

export default function KhattiFullStackSystem() {
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Sync theme with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-inverse transition-colors duration-200">
      {/* Sovereign Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenPrivacyNotice={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Role Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'parent' && <ParentPortal />}
        {currentRole === 'driver' && <DriverCockpit />}
        {currentRole === 'admin' && <AdminOperationsRadar />}
      </main>

      {/* Blind Matching Protocol Modal */}
      <BlindMatchingModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Global Footer */}
      <footer className="mt-16 py-8 border-t border-surface-borderLight dark:border-surface-borderDark text-center text-xs text-ink-muted dark:text-ink-inverseMuted space-y-2">
        <p>
          منظومة خطي للنقل المدرسي والجامعي الذكي في العراق © 2026 • حوكمة معمارية حتمية وفق إطار عمل B.R.I.C.K
        </p>
        <p className="text-[11px] text-slate-400">
          ربط جغرافي PostGIS • تتبع أجهزة Traccar Hardware • حماية الخصوصية العمياء (Blind Matching RLS)
        </p>
      </footer>
    </div>
  );
}
