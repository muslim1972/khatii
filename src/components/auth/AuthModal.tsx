'use client';

import React, { useState } from 'react';
import { UserRole } from '../common/Header';

export interface UserSession {
  name: string;
  phone: string;
  role: UserRole;
  studentLevel?: 'primary' | 'intermediate' | 'highschool' | 'university';
  schoolOrUniversity?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Registration flow state
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent'>('parent');
  const [studentLevel, setStudentLevel] = useState<
    'primary' | 'intermediate' | 'highschool' | 'university' | null
  >(null);
  
  // Form fields
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Interception check for student: Primary or Intermediate MUST be Parent Partner account!
  const isMinorRestricted =
    selectedRole === 'student' &&
    (studentLevel === 'primary' || studentLevel === 'intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (mode === 'login') {
      if (!phoneNumber.trim()) {
        setValidationError('الرجاء إدخال رقم الهاتف.');
        return;
      }
      onSuccess({
        name: 'أحمد الكرخي',
        phone: phoneNumber,
        role: 'parent',
      });
      return;
    }

    // Sign up mode
    if (!fullName.trim() || !phoneNumber.trim()) {
      setValidationError('الرجاء إكمال الاسم ورقم الهاتف.');
      return;
    }

    if (selectedRole === 'student') {
      if (!studentLevel) {
        setValidationError('الرجاء تحديد المرحلة الدراسية للطالب.');
        return;
      }
      if (isMinorRestricted) {
        setValidationError('لا يمكن لطلبة الابتدائية أو المتوسطة إنشاء حساب مستقل؛ يجب التحويل لحساب ولي الأمر.');
        return;
      }
      onSuccess({
        name: fullName,
        phone: phoneNumber,
        role: 'parent', // handled inside parent portal or student view
        studentLevel,
        schoolOrUniversity: schoolName || 'المدرسة المستهدفة',
      });
      return;
    }

    // Parent
    onSuccess({
      name: fullName,
      phone: phoneNumber,
      role: 'parent',
    });
  };

  const handleConvertToParent = () => {
    setSelectedRole('parent');
    setStudentLevel(null);
    setValidationError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-lg p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-bus text-slate-900 flex items-center justify-center text-xl font-bold shadow-ambient-sm">
              خـ
            </div>
            <div>
              <h3 id="auth-modal-title" className="text-lg font-bold text-ink-primary dark:text-ink-inverse">
                {mode === 'login' ? 'تسجيل الدخول إلى منظومة خطي' : 'إنشاء حساب جديد في خطي'}
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
                {mode === 'login'
                  ? 'أدخل رقم هاتفك للوصول المباشر إلى لوحة التحكم'
                  : 'حدد صفتك للبدء بتجربة النقل الدراسي الأكثر أماناً في العراق'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-full bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted hover:text-ink-primary dark:hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setValidationError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'signup'
                ? 'bg-surface-light dark:bg-surface-dark text-brand shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            فتح حساب جديد
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setValidationError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'login'
                ? 'bg-surface-light dark:bg-surface-dark text-brand shadow-ambient-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            تسجيل الدخول (لدي حساب)
          </button>
        </div>

        {/* Validation error display */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-alert-crimsonSubtle border border-alert-crimson/30 text-alert-crimson text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <>
              {/* Step 1: Role Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse">
                  اختر صفتك في المنظومة:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('parent');
                      setStudentLevel(null);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all ${
                      selectedRole === 'parent'
                        ? 'border-brand bg-brand-subtle/40 dark:bg-brand-subtleDark/40 text-brand shadow-ambient-sm ring-2 ring-brand/20'
                        : 'border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-ink-secondary hover:border-slate-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">👨‍👩‍👧‍👦</div>
                    <div className="text-sm font-bold">ولي أمر (Partner)</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">تسجيل ومتابعة الأبناء</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('student');
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all ${
                      selectedRole === 'student'
                        ? 'border-brand bg-brand-subtle/40 dark:bg-brand-subtleDark/40 text-brand shadow-ambient-sm ring-2 ring-brand/20'
                        : 'border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-ink-secondary hover:border-slate-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">🎓</div>
                    <div className="text-sm font-bold">طالب / طالبة</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">إعدادية وكلية وجامعة</div>
                  </button>
                </div>
              </div>

              {/* Step 2: If Student, ask for Education Level */}
              {selectedRole === 'student' && (
                <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark space-y-3">
                  <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse">
                    ما هي مرحلتك الدراسية الحالية؟
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentLevel('primary')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        studentLevel === 'primary'
                          ? 'bg-alert-crimson text-white border-alert-crimson'
                          : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                      }`}
                    >
                      🎒 ابتدائية
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentLevel('intermediate')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        studentLevel === 'intermediate'
                          ? 'bg-alert-crimson text-white border-alert-crimson'
                          : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                      }`}
                    >
                      📚 متوسطة
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentLevel('highschool')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        studentLevel === 'highschool'
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                      }`}
                    >
                      🏫 إعدادية
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentLevel('university')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        studentLevel === 'university'
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark text-ink-muted hover:text-ink-primary'
                      }`}
                    >
                      🎓 كلية / جامعة
                    </button>
                  </div>

                  {/* CRITICAL GOVERNANCE INTERCEPTION FOR MINORS (Primary & Intermediate) */}
                  {isMinorRestricted && (
                    <div className="p-4 rounded-2xl bg-alert-crimsonSubtle border-2 border-alert-crimson/40 text-alert-crimson space-y-3 animate-fade-in">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">🛡️</span>
                        <div>
                          <h4 className="font-bold text-sm">
                            تنبيه حوكمة الأمان والالتزام المالي (Partner Requirement)
                          </h4>
                          <p className="text-xs leading-relaxed mt-1 text-ink-secondary dark:text-ink-inverse">
                            عذراً، طلبة المرحلتين <strong>الابتدائية والمتوسطة</strong> دون السن القانونية ولا يملكون الأهلية لإبرام العقود والترتيبات المالية مع كابتن الخط. بموجب ميثاق منظومة خطي، <strong>يجب أن يكون الحساب مسجلاً باسم ولي الأمر (Parent Partner)</strong> لضمان سلامة الطفل ومتابعة المسار والمدفوعات.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleConvertToParent}
                        className="w-full py-2.5 rounded-xl bg-alert-crimson hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-ambient-sm transition-all flex items-center justify-center gap-2"
                      >
                        <span>👨‍👩‍👧‍👦</span>
                        <span>التحويل الفوري لفتح حساب كـ «ولي أمر»</span>
                      </button>
                    </div>
                  )}

                  {/* High School Notice */}
                  {studentLevel === 'highschool' && (
                    <div className="p-3 rounded-xl bg-bus-subtle dark:bg-bus-subtleDark border border-bus/30 text-xs text-bus-dark dark:text-bus font-medium">
                      💡 لطلبة المرحلة الإعدادية: سيُطلب منك إدخال رقم هاتف ولي الأمر كجهة اتصال ضامنة للطوارئ والموافقة على مسار الخط.
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Form Fields: Not shown if blocked by minor restriction */}
          {!isMinorRestricted && (
            <>
              <div>
                <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                  {mode === 'signup' ? 'الاسم الثلاثي أو اللقب الرسمي' : 'اسم المستخدم أو رقم الهاتف'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={mode === 'signup' ? 'مثال: أحمد عبد الحسين الكرخي' : '0770•••••••'}
                  className="w-full px-4 py-3 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-ink-primary dark:text-ink-inverse text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                  رقم الهاتف (العراق)
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0770 123 4567"
                  className="w-full px-4 py-3 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-ink-primary dark:text-ink-inverse text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono text-right"
                />
              </div>

              {mode === 'signup' && selectedRole === 'student' && (studentLevel === 'highschool' || studentLevel === 'university') && (
                <div>
                  <label className="block text-xs font-bold text-ink-primary dark:text-ink-inverse mb-1">
                    اسم {studentLevel === 'university' ? 'الجامعة والكلية' : 'المدرسة الإعدادية'}
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="مثال: جامعة بغداد - كلية الهندسة / إعدادية المنصور"
                    className="w-full px-4 py-3 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark text-ink-primary dark:text-ink-inverse text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-sm shadow-ambient-brand transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{mode === 'login' ? '🔐' : '🚀'}</span>
                <span>{mode === 'login' ? 'تسجيل الدخول ومتابعة الخط' : 'إتمام الحساب والانتقال للوحة التحكم'}</span>
              </button>
            </>
          )}
        </form>

        {/* Security & Blind matching seal */}
        <div className="pt-3 border-t border-surface-borderLight dark:border-surface-borderDark text-center">
          <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted flex items-center justify-center gap-1.5">
            <span>🛡️</span>
            <span>بياناتك محمية بموجب ميثاق المطابقة العمياء وسياسات Supabase RLS</span>
          </p>
        </div>
      </div>
    </div>
  );
};
