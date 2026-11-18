'use client';

import React, { useState } from 'react';
import { KhattiInteractiveMap } from '@/components/map/KhattiInteractiveMap';

export interface StudentProfile {
  id: string;
  name: string;
  school: string;
  grade: string;
  avatar: string;
  status: 'on_bus' | 'at_school' | 'at_home' | 'absent';
  currentStage: number; // 1 to 5
  driverName: string;
  driverPhoneEncrypted: string;
  vehiclePlate: string;
  vehicleModel: string;
  etaMinutes: number;
  distanceMeters: number;
  speedKmH: number;
  isTodayAbsent: boolean;
  busCoords: { lat: number; lng: number };
  homeCoords: { lat: number; lng: number };
  schoolCoords: { lat: number; lng: number };
}

const mockStudents: StudentProfile[] = [
  {
    id: 'std-1',
    name: 'زينب أحمد الكرخي',
    school: 'ثانوية المتميزات الأولى - المنصور',
    grade: 'الرابع العلمي',
    avatar: '👧',
    status: 'on_bus',
    currentStage: 3,
    driverName: 'الكابتن أبو حيدر الساعدي',
    driverPhoneEncrypted: '0770••••192',
    vehiclePlate: 'بغداد 48192 خصوصي',
    vehicleModel: 'تويوتا هايس (14 راكب - مكيفة)',
    etaMinutes: 6,
    distanceMeters: 850,
    speedKmH: 34,
    isTodayAbsent: false,
    busCoords: { lat: 33.3152, lng: 44.3661 },
    homeCoords: { lat: 33.3080, lng: 44.3590 },
    schoolCoords: { lat: 33.3280, lng: 44.3720 },
  },
  {
    id: 'std-2',
    name: 'علي أحمد الكرخي',
    school: 'مدرسة دجلة الابتدائية للبنين',
    grade: 'الصف الخامس الابتدائي',
    avatar: '👦',
    status: 'at_school',
    currentStage: 4,
    driverName: 'الكابتن مصطفى الربيعي',
    driverPhoneEncrypted: '0780••••841',
    vehiclePlate: 'بغداد 19024 أجور',
    vehicleModel: 'كيا موهافي (7 ركاب)',
    etaMinutes: 0,
    distanceMeters: 0,
    speedKmH: 0,
    isTodayAbsent: false,
    busCoords: { lat: 33.2980, lng: 44.4120 },
    homeCoords: { lat: 33.2950, lng: 44.4080 },
    schoolCoords: { lat: 33.3020, lng: 44.4190 },
  },
  {
    id: 'std-3',
    name: 'فاطمة أحمد الكرخي',
    school: 'جامعة بغداد - كلية الهندسة',
    grade: 'المرحلة الثالثة - حاسبات',
    avatar: '👩‍🎓',
    status: 'at_home',
    currentStage: 1,
    driverName: 'الكابتن سلام العزاوي',
    driverPhoneEncrypted: '0771••••550',
    vehiclePlate: 'بغداد 88310 خصوصي',
    vehicleModel: 'هيونداي H1 (11 راكب)',
    etaMinutes: 25,
    distanceMeters: 3200,
    speedKmH: 42,
    isTodayAbsent: false,
    busCoords: { lat: 33.2711, lng: 44.3789 },
    homeCoords: { lat: 33.2650, lng: 44.3710 },
    schoolCoords: { lat: 33.2790, lng: 44.3850 },
  },
];

export const ParentPortal: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>(mockStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(mockStudents[0].id);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleToggleAbsence = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === selectedStudentId) {
          const newAbsent = !s.isTodayAbsent;
          return {
            ...s,
            isTodayAbsent: newAbsent,
            status: newAbsent ? 'absent' : 'on_bus',
          };
        }
        return s;
      })
    );

    const willBeAbsent = !activeStudent.isTodayAbsent;
    setActionSuccessNotice(
      willBeAbsent
        ? `تم تسجيل غياب ${activeStudent.name} لهذا اليوم وإشعار السائق فوراً لتجاوز نقطة التوقف.`
        : `تم إلغاء غياب ${activeStudent.name} وإعادة إدراجها في مسار رحلة السائق.`
    );
  };

  const stages = [
    { num: 1, label: 'انطلاق الحافلة', desc: 'غادرت نقطة التجمع' },
    { num: 2, label: 'اقتراب 500م', desc: 'استعد للنزول إلى الباب' },
    { num: 3, label: 'صعود وتأمين المقعد', desc: 'على متن الحافلة بأمان' },
    { num: 4, label: 'الوصول للمدرسة', desc: 'دخول الحرم الدراسي' },
    { num: 5, label: 'رحلة العودة', desc: 'الرجوع إلى المنزل عصراً' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Sibling Switcher Header Bar (Inspired by Schoolz) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div>
            <h2 className="text-xl font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>محفظة الأبناء المسجلين</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-subtle dark:bg-brand-subtleDark text-brand">
                {students.length} خطوط نشطة
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-inverseMuted">
              اختر الابن أو الابنة لمتابعة التتبع اللحظي للرحلة ومسار السائق
            </p>
          </div>

          <button
            type="button"
            className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark hover:bg-canvas-subtle/80 dark:hover:bg-canvas-subtleDark/80 text-brand font-semibold text-xs border border-brand/20 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            <span>إضافة طالب / خط جديد</span>
          </button>
        </div>

        {/* Horizontal Sibling Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {students.map((student) => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => setSelectedStudentId(student.id)}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl text-right transition-all duration-200 border ${
                  isSelected
                    ? 'bg-brand-subtle/40 dark:bg-brand-subtleDark/40 border-brand shadow-ambient-sm'
                    : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark flex items-center justify-center text-2xl shadow-inner">
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`font-bold text-sm truncate ${isSelected ? 'text-brand dark:text-white' : 'text-ink-primary dark:text-ink-inverse'}`}>
                      {student.name}
                    </p>
                    {student.isTodayAbsent ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-alert-crimsonSubtle text-alert-crimson">
                        غائب
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                        نشط
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted dark:text-ink-inverseMuted truncate">
                    {student.school}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notice (Dismissible without setTimeout) */}
      {actionSuccessNotice && (
        <div className="p-4 rounded-2xl bg-safety-subtle border border-safety/30 text-safety-darkText flex items-center justify-between gap-3 shadow-ambient-sm">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>✅</span>
            <span>{actionSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessNotice(null)}
            className="text-xs font-bold hover:underline px-2 py-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Main Grid: Tracking Radar + Milestone Journey Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telemetry Card & Map HUD */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-bus-dark dark:text-bus">
                  التتبع الجغرافي اللحظي المباشر
                </span>
                <h3 className="text-2xl font-bold text-ink-primary dark:text-ink-inverse mt-1">
                  رحلة {activeStudent.name}
                </h3>
                <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
                  {activeStudent.school} • {activeStudent.grade}
                </p>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-safety-subtle dark:bg-safety-subtleDark border border-safety/30 text-safety-darkText dark:text-safety text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-safety animate-pulse"></span>
                <span>الحافلة تتحرك باتجاه المدرسة</span>
              </div>
            </div>

            {/* Live Interactive Map with Buffer Tile Caching */}
            <KhattiInteractiveMap
              busLocation={{
                lat: activeStudent.busCoords.lat,
                lng: activeStudent.busCoords.lng,
                speed: activeStudent.speedKmH,
              }}
              homeLocation={{
                lat: activeStudent.homeCoords.lat,
                lng: activeStudent.homeCoords.lng,
                label: `منزل ${activeStudent.name}`,
              }}
              schoolLocation={{
                lat: activeStudent.schoolCoords.lat,
                lng: activeStudent.schoolCoords.lng,
                name: activeStudent.school,
              }}
              geofenceRadiusMeters={500}
              heightClassName="h-80 sm:h-96"
            />

            {/* Driver Profile & Vehicle info */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-bus-subtle dark:bg-bus-subtleDark text-bus-dark flex items-center justify-center text-xl font-bold">
                  👨‍✈️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-ink-primary dark:text-ink-inverse">
                    {activeStudent.driverName}
                  </h4>
                  <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
                    {activeStudent.vehicleModel} • {activeStudent.vehiclePlate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark hover:bg-canvas-subtle text-ink-secondary dark:text-ink-inverseMuted text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>📞</span>
                  <span>اتصال مشفر</span>
                </button>
              </div>
            </div>
          </div>

          {/* Absence Reporting Card (One-Tap Leave Request) */}
          <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-ink-primary dark:text-ink-inverse flex items-center gap-2">
                <span>🚫</span>
                <span>طلب إعفاء وتثبيت غياب اليوم</span>
              </h4>
              <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-inverseMuted mt-1">
                في حال كان الطالب مريضاً أو مجازاً، انقر الزر لإشعار السائق فوراً دون الحاجة للاتصال به صباحاً.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAbsence}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 shrink-0 shadow-sm ${
                activeStudent.isTodayAbsent
                  ? 'bg-safety hover:bg-safety-hover text-white shadow-ambient-safety'
                  : 'bg-alert-crimson hover:bg-red-700 text-white shadow-ambient-sm'
              }`}
            >
              {activeStudent.isTodayAbsent ? 'إلغاء الغياب (ابني سيذهب)' : 'ابني غائب اليوم (لا تمر بالمنزل)'}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Milestone Stepper & Authorized Delegates */}
        <div className="space-y-6">
          {/* Milestone Stepper */}
          <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-md space-y-6">
            <h4 className="font-bold text-base text-ink-primary dark:text-ink-inverse flex items-center gap-2 pb-3 border-b border-surface-borderLight dark:border-surface-borderDark">
              <span>📍</span>
              <span>مراحل الرحلة الحية</span>
            </h4>

            <div className="relative space-y-6">
              {stages.map((stage, idx) => {
                const isPassed = stage.num < activeStudent.currentStage;
                const isCurrent = stage.num === activeStudent.currentStage;

                return (
                  <div key={stage.num} className="relative flex items-start gap-4">
                    {/* Vertical connector line */}
                    {idx < stages.length - 1 && (
                      <div
                        className={`absolute right-4 top-8 -bottom-4 w-0.5 ${
                          isPassed ? 'bg-safety' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      ></div>
                    )}

                    {/* Step Circle Indicator */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isPassed
                          ? 'bg-safety text-white shadow-ambient-safety'
                          : isCurrent
                          ? 'bg-bus text-slate-900 ring-4 ring-bus/20 animate-pulse'
                          : 'bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted border border-surface-borderLight dark:border-surface-borderDark'
                      }`}
                    >
                      {isPassed ? '✓' : stage.num}
                    </div>

                    {/* Text Details */}
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-bus-dark dark:text-bus'
                            : isPassed
                            ? 'text-ink-primary dark:text-ink-inverse'
                            : 'text-ink-muted dark:text-ink-inverseMuted'
                        }`}
                      >
                        {stage.label}
                      </p>
                      <p className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authorized Delegates (المفوّضون بالاستلام) */}
          <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-borderLight dark:border-surface-borderDark">
              <h4 className="font-bold text-sm text-ink-primary dark:text-ink-inverse flex items-center gap-1.5">
                <span>👥</span>
                <span>المفوّضون باستلام الطالب</span>
              </h4>
              <button type="button" className="text-xs text-brand font-semibold hover:underline">
                + إضافة
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark">
                <div>
                  <p className="font-bold text-ink-primary dark:text-ink-inverse">أحمد الكرخي (الأب)</p>
                  <p className="text-ink-muted dark:text-ink-inverseMuted">0770••••120 • مفوّض دائم</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                  موثّق
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark">
                <div>
                  <p className="font-bold text-ink-primary dark:text-ink-inverse">أم حيدر (الأم)</p>
                  <p className="text-ink-muted dark:text-ink-inverseMuted">0781••••994 • مفوّض دائم</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                  موثّق
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Tier & Billing */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-ambient-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bus/20 text-bus border border-bus/30">
                باقة النقل المدرسي الشاملة
              </span>
              <span className="text-xs text-slate-400">تشرين الثاني 2026</span>
            </div>

            <div>
              <p className="text-2xl font-bold">120,000 د.ع <span className="text-xs font-normal text-slate-300">/ شهرياً</span></p>
              <p className="text-xs text-slate-300 mt-1">ذهاب وإياب • مكيف بالكامل • تأمين ركاب</p>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-safety flex items-center gap-1">
                <span>●</span> تم الدفع إلكترونياً
              </span>
              <button type="button" className="text-sky-300 hover:underline">
                تحميل الفاتورة PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
