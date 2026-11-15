'use client';

import React, { useState } from 'react';

interface DriverKYC {
  id: string;
  name: string;
  phoneEncrypted: string;
  vehicleModel: string;
  plateNumber: string;
  docsStatus: 'verified' | 'pending' | 'review';
  appliedDate: string;
}

const mockKYCList: DriverKYC[] = [
  { id: 'kyc-1', name: 'أبو حيدر الساعدي', phoneEncrypted: '0770••••192', vehicleModel: 'تويوتا هايس 2022', plateNumber: 'بغداد 48192 خصوصي', docsStatus: 'verified', appliedDate: '2026-11-01' },
  { id: 'kyc-2', name: 'مصطفى الربيعي', phoneEncrypted: '0780••••841', vehicleModel: 'كيا موهافي 2021', plateNumber: 'بغداد 19024 أجور', docsStatus: 'verified', appliedDate: '2026-11-04' },
  { id: 'kyc-3', name: 'كرار فاضل الموسوي', phoneEncrypted: '0772••••309', vehicleModel: 'هيونداي H1 2023', plateNumber: 'كربلاء 33118 خصوصي', docsStatus: 'review', appliedDate: '2026-11-14' },
];

export const AdminOperationsRadar: React.FC = () => {
  const [kycQueue, setKycQueue] = useState<DriverKYC[]>(mockKYCList);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const handleApproveDriver = (id: string) => {
    setKycQueue((prev) =>
      prev.map((d) => (d.id === id ? { ...d, docsStatus: 'verified' } : d))
    );
    setAdminNotice('تم توثيق السائق وتفعيل ربطه الجغرافي بالمنظومة بعد تدقيق عدم المحكومية وإجازة السوق.');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">
            <span>المركبات النشطة لحظياً</span>
            <span className="text-safety">● مباشر</span>
          </div>
          <div className="text-3xl font-black text-ink-primary dark:text-ink-inverse mt-2">
            28 <span className="text-xs font-normal text-ink-muted">حافلة</span>
          </div>
          <p className="text-[11px] text-safety-darkText dark:text-safety mt-1">
            ↑ 100% تغطية عبر Traccar & الهواتف
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">
            <span>الطلبة على متن الخطوط</span>
            <span className="text-bus-dark">● قيد النقل</span>
          </div>
          <div className="text-3xl font-black text-ink-primary dark:text-ink-inverse mt-2">
            342 <span className="text-xs font-normal text-ink-muted">طالباً</span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted mt-1">
            24 طالباً مثبت غيابهم عبر التطبيق
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">
            <span>محرك PostGIS المكاني</span>
            <span className="text-brand">● سحابي</span>
          </div>
          <div className="text-3xl font-black text-ink-primary dark:text-ink-inverse mt-2">
            0.18 <span className="text-xs font-normal text-ink-muted">ثانية</span>
          </div>
          <p className="text-[11px] text-brand mt-1">
            استجابة الاستعلام الجغرافي ST_DWithin
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">
            <span>حماية الخصوصية العمياء</span>
            <span className="text-safety">● 100% RLS</span>
          </div>
          <div className="text-3xl font-black text-safety-darkText dark:text-safety mt-2">
            صفر <span className="text-xs font-normal text-ink-muted">تسريب</span>
          </div>
          <p className="text-[11px] text-safety-darkText dark:text-safety mt-1">
            تشفير كامل للأرقام والمسارات
          </p>
        </div>
      </div>

      {/* Admin Notice */}
      {adminNotice && (
        <div className="p-4 rounded-2xl bg-safety-subtle border border-safety/30 text-safety-darkText flex items-center justify-between shadow-ambient-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>🛡️</span>
            <span>{adminNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminNotice(null)}
            className="text-xs font-bold underline px-2 py-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Live Fleet Telemetry Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div>
            <h3 className="text-lg font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>📡</span>
              <span>رادار الحركة اللحظي للأسطول (Traccar Live Telemetry)</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
              بث مباشر لبيانات الموقع والسرعة وحالة الاتصال للخطوط المدرسية
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-safety-subtle text-safety-darkText">
              <span className="w-2 h-2 rounded-full bg-safety animate-pulse"></span>
              WebSockets متصل
            </span>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-borderLight dark:border-surface-borderDark text-ink-muted dark:text-ink-inverseMuted">
                <th className="pb-3 font-semibold">معرّف الجهاز / المركبة</th>
                <th className="pb-3 font-semibold">الكابتن</th>
                <th className="pb-3 font-semibold">المسار / المدرسة</th>
                <th className="pb-3 font-semibold">السرعة اللحظية</th>
                <th className="pb-3 font-semibold">إحداثيات GPS</th>
                <th className="pb-3 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-borderLight dark:divide-surface-borderDark text-ink-secondary dark:text-ink-inverse">
              <tr className="hover:bg-canvas-subtle/50 dark:hover:bg-canvas-subtleDark/50">
                <td className="py-3.5 font-mono text-xs font-bold text-brand">TRAC-90812 (هايس)</td>
                <td className="py-3.5 font-bold">أبو حيدر الساعدي</td>
                <td className="py-3.5">اليرموك ⟵ المتميزات</td>
                <td className="py-3.5 font-semibold text-bus-dark">34 كم/س</td>
                <td className="py-3.5 font-mono text-xs text-ink-muted">33.3152, 44.3661</td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                    مباشر (60fps)
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-canvas-subtle/50 dark:hover:bg-canvas-subtleDark/50">
                <td className="py-3.5 font-mono text-xs font-bold text-brand">PHONE-GPS-104 (موهافي)</td>
                <td className="py-3.5 font-bold">مصطفى الربيعي</td>
                <td className="py-3.5">الكرادة ⟵ دجلة الابتدائية</td>
                <td className="py-3.5 font-semibold text-ink-muted">0 كم/س (متوقف)</td>
                <td className="py-3.5 font-mono text-xs text-ink-muted">33.2980, 44.4120</td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bus-subtle text-bus-dark">
                    عند نقطة التوقف
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-canvas-subtle/50 dark:hover:bg-canvas-subtleDark/50">
                <td className="py-3.5 font-mono text-xs font-bold text-brand">TRAC-77140 (H1)</td>
                <td className="py-3.5 font-bold">سلام العزاوي</td>
                <td className="py-3.5">الدورة ⟵ جامعة بغداد</td>
                <td className="py-3.5 font-semibold text-bus-dark">42 كم/س</td>
                <td className="py-3.5 font-mono text-xs text-ink-muted">33.2711, 44.3789</td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                    مباشر (60fps)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver KYC Verification Queue */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div>
            <h3 className="text-lg font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>🗂️</span>
              <span>طابور تدقيق مستمسكات السائقين (KYC Verification Queue)</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
              تدقيق السنوية، إجازة السوق العامة، وشهادة عدم المحكومية لضمان سلامة الطلبة
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {kycQueue.map((driver) => (
            <div
              key={driver.id}
              className="p-4 sm:p-5 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-surface-light dark:bg-surface-dark flex items-center justify-center text-xl font-bold shadow-inner">
                  👨‍✈️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink-primary dark:text-ink-inverse">
                      {driver.name}
                    </span>
                    <span className="text-xs text-ink-muted font-mono">{driver.phoneEncrypted}</span>
                  </div>
                  <p className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-0.5">
                    المركبة: {driver.vehicleModel} • {driver.plateNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {driver.docsStatus === 'verified' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-safety-subtle text-safety-darkText border border-safety/30">
                    ✓ تم التوثيق والاعتماد
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-alert-amberSubtle text-alert-amber border border-alert-amber/30">
                      قيد التدقيق الجنائي
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApproveDriver(driver.id)}
                      className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-ambient-brand transition-colors"
                    >
                      اعتماد وتفعيل الخط
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
