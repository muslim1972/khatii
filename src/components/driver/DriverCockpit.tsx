'use client';

import React, { useState } from 'react';

interface ManifestItem {
  id: string;
  name: string;
  stopName: string;
  order: number;
  status: 'pending' | 'boarded' | 'absent' | 'dropped';
  isExcused: boolean;
}

const initialManifest: ManifestItem[] = [
  { id: 'm-1', name: 'زينب أحمد الكرخي', stopName: 'اليرموك - مجاور مأكولات الرواد', order: 1, status: 'boarded', isExcused: false },
  { id: 'm-2', name: 'عمر ياسين الدليمي', stopName: 'حي الجامعة - شارع الربيع', order: 2, status: 'pending', isExcused: false },
  { id: 'm-3', name: 'مريم حيدر الخفاجي', stopName: 'حي الخضراء - تقاطع السدرة', order: 3, status: 'absent', isExcused: true },
  { id: 'm-4', name: 'سيف علي الجبوري', stopName: 'الداوودي - خلف جامع الفرقان', order: 4, status: 'pending', isExcused: false },
  { id: 'm-5', name: 'نور مصطفى العامري', stopName: 'المنصور - 14 رمضان', order: 5, status: 'pending', isExcused: false },
];

export const DriverCockpit: React.FC = () => {
  const [manifest, setManifest] = useState<ManifestItem[]>(initialManifest);
  const [isDrivingModeActive, setIsDrivingModeActive] = useState<boolean>(true);
  const [incidentReported, setIncidentReported] = useState<string | null>(null);

  const boardedCount = manifest.filter((m) => m.status === 'boarded').length;
  const totalCount = manifest.length;

  const handleUpdateStatus = (id: string, newStatus: ManifestItem['status']) => {
    setManifest((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cockpit HUD Bar */}
      <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-bus text-slate-900 flex items-center justify-center text-3xl font-bold shadow-ambient-md">
            🚐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-ink-primary dark:text-ink-inverse">
                كابينة الكابتن • أبو حيدر الساعدي
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-safety-subtle text-safety-darkText border border-safety/30">
                سائق معتمد 🛡️
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-inverseMuted">
              خط ثانوية المتميزات الأولى (صباحي) • الحافلة: تويوتا هايس 48192
            </p>
          </div>
        </div>

        {/* Zero-Hardware Phone GPS Switcher (SmartBus feature) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrivingModeActive(!isDrivingModeActive)}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-ambient-sm min-h-touch-lg ${
              isDrivingModeActive
                ? 'bg-safety hover:bg-safety-hover text-white shadow-ambient-safety'
                : 'bg-canvas-subtle dark:bg-canvas-subtleDark text-ink-muted border border-surface-borderLight dark:border-surface-borderDark'
            }`}
          >
            <span className={`w-3 h-3 rounded-full ${isDrivingModeActive ? 'bg-white animate-ping' : 'bg-slate-400'}`}></span>
            <span>{isDrivingModeActive ? 'وضع القيادة نشط (بث GPS حي)' : 'تفعيل وضع القيادة (GPS الهاتف)'}</span>
          </button>
        </div>
      </div>

      {/* Incident Alert if submitted */}
      {incidentReported && (
        <div className="p-4 rounded-2xl bg-alert-amberSubtle border border-alert-amber/40 text-alert-amber flex items-center justify-between shadow-ambient-sm">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>⚠️</span>
            <span>{incidentReported}</span>
          </div>
          <button
            type="button"
            onClick={() => setIncidentReported(null)}
            className="text-xs font-semibold px-2 py-1 underline"
          >
            إلغاء التنبيه
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-sm text-center">
          <div className="text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">الطلاب على المتن</div>
          <div className="text-2xl font-black text-ink-primary dark:text-ink-inverse mt-1">
            {boardedCount} / {totalCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-sm text-center">
          <div className="text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">الغياب المثبت مسبقاً</div>
          <div className="text-2xl font-black text-alert-amber mt-1">
            {manifest.filter((m) => m.isExcused).length} طلاب
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-sm text-center">
          <div className="text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">المحطة القادمة</div>
          <div className="text-base font-bold text-bus-dark dark:text-bus truncate mt-1">
            شارع الربيع (عمر)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-sm text-center">
          <div className="text-xs text-ink-muted dark:text-ink-inverseMuted font-medium">توقيت الوصول للمدرسة</div>
          <div className="text-2xl font-black text-safety mt-1">
            07:42 ص
          </div>
        </div>
      </div>

      {/* Passenger Manifest: Large-target touch list for safe driving */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div>
            <h3 className="text-lg font-bold text-ink-primary dark:text-ink-inverse flex items-center gap-2">
              <span>📋</span>
              <span>بوليصة الركاب ومسار التوقفات (Manifest)</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
              أزرار سريعة كبيرة (56px) لتأكيد الصعود والنزول بلمسة واحدة أثناء الوقوف التام
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIncidentReported('تم إشعار أولياء الأمور وغرفة الإدارة بوجود ازدحام مروري وتأخير تقديري 10 دقائق.')}
              className="px-3.5 py-2 rounded-xl bg-alert-amberSubtle text-alert-amber hover:bg-alert-amber/20 font-bold text-xs border border-alert-amber/30 transition-colors"
            >
              ⚠️ إشعار بازدحام أو تأخير
            </button>
          </div>
        </div>

        {/* Student items */}
        <div className="space-y-3.5">
          {manifest.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.status === 'boarded'
                  ? 'bg-safety-subtle/30 dark:bg-safety-subtleDark/20 border-safety/40'
                  : item.isExcused
                  ? 'bg-alert-crimsonSubtle/30 dark:bg-alert-crimsonSubtle/10 border-alert-crimson/20 opacity-75'
                  : 'bg-canvas-subtle dark:bg-canvas-subtleDark border-surface-borderLight dark:border-surface-borderDark'
              }`}
            >
              {/* Order and info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark flex items-center justify-center font-bold text-sm text-ink-primary dark:text-ink-inverse shadow-inner shrink-0">
                  #{item.order}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-ink-primary dark:text-ink-inverse">
                      {item.name}
                    </span>
                    {item.isExcused && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-alert-crimsonSubtle text-alert-crimson border border-alert-crimson/30">
                        مُجاز من الأهل (لا تمر به)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-0.5">
                    📍 {item.stopName}
                  </p>
                </div>
              </div>

              {/* Large Safe Touch Buttons (56px minimum height) */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(item.id, 'boarded')}
                  disabled={item.isExcused}
                  className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-bold text-xs sm:text-sm min-h-touch transition-all shadow-sm ${
                    item.status === 'boarded'
                      ? 'bg-safety text-white shadow-ambient-safety'
                      : 'bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark text-ink-secondary dark:text-ink-inverseMuted hover:border-safety hover:text-safety'
                  }`}
                >
                  {item.status === 'boarded' ? '✓ تم الصعود' : 'صعد الحافلة'}
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(item.id, 'dropped')}
                  disabled={item.status !== 'boarded'}
                  className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-bold text-xs sm:text-sm min-h-touch transition-all shadow-sm ${
                    item.status === 'dropped'
                      ? 'bg-brand text-white'
                      : 'bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark text-ink-secondary dark:text-ink-inverseMuted hover:border-brand hover:text-brand'
                  }`}
                >
                  {item.status === 'dropped' ? '✓ نزل بسلام' : 'تأكيد النزول'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
