'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from './common/Header';
import { LandingPage } from './landing/LandingPage';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { AuthModal, UserSession } from './auth/AuthModal';
import { BlindMatchingModal } from './modals/BlindMatchingModal';

export default function KhattiFullStackSystem() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // Sync theme with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (session: UserSession) => {
    setUserSession(session);
    setCurrentRole(session.role);
    setIsAuthOpen(false);
    setViewMode('dashboard');
  };

  const handleExploreDemo = () => {
    setUserSession({
      name: 'أحمد الكرخي (معاينة تجريبية)',
      phone: '0770••••120',
      role: 'parent',
    });
    setViewMode('dashboard');
  };

  return (
    <>
      {viewMode === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onExploreDemo={handleExploreDemo}
          onOpenPrivacyNotice={() => setIsPrivacyModalOpen(true)}
        />
      ) : (
        <DashboardLayout
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onNavigateHome={() => setViewMode('landing')}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          userName={userSession?.name}
          userPhone={userSession?.phone}
        />
      )}

      {/* Authentication and Onboarding Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Sovereign Privacy & Blind Matching Policy Modal */}
      <BlindMatchingModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
