'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from './common/Header';
import { LandingPage } from './landing/LandingPage';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { AuthModal, UserSession } from './auth/AuthModal';
import { BlindMatchingModal } from './modals/BlindMatchingModal';
import { CaptainPortalModal } from './captain/CaptainPortalModal';

export default function KhattiFullStackSystem() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCaptainModalOpen, setIsCaptainModalOpen] = useState<boolean>(false);
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
          onOpenCaptainPortal={() => setIsCaptainModalOpen(true)}
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

      {/* Dedicated Captain Work & KYC Onboarding Modal */}
      <CaptainPortalModal
        isOpen={isCaptainModalOpen}
        onClose={() => setIsCaptainModalOpen(false)}
        onSuccess={(session) => {
          setUserSession(session);
          setCurrentRole('driver');
          setIsCaptainModalOpen(false);
          setViewMode('dashboard');
        }}
      />

      {/* Sovereign Privacy & Blind Matching Policy Modal */}
      <BlindMatchingModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
