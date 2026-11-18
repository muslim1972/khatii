'use client';

import React, { useState } from 'react';
import { KhattiInteractiveMap } from '@/components/map/KhattiInteractiveMap';

interface ManifestItem {
  id: string;
  name: string;
  stopName: string;
  order: number;
  status: 'pending' | 'boarded' | 'absent' | 'dropped';
  isExcused: boolean;
}

const initialManifest: ManifestItem[] = [
  { id: 'm-1', name: 'سجاد حيدر الحسيني', stopName: 'كربلاء - حي الحسين (قرب جامع أهل البيت)', order: 1, status: 'boarded', isExcused: false },
  { id: 'm-2', name: 'زينب حيدر الحسيني', stopName: 'كربلاء - حي الحسين (محطة الفواطم)', order: 2, status: 'boarded', isExcused: false },
  { id: 'm-3', name: 'باقر علي الموسوي', stopName: 'كربلاء - حي المعلمين (شارع الكوثر)', order: 3, status: 'pending', isExcused: false },
  { id: 'm-4', name: 'كرار علي الموسوي', stopName: 'كربلاء - حي المعلمين (قرب مدرسة الفرات)', order: 4, status: 'absent', isExcused: true },
  { id: 'm-5', name: 'مريم قاسم العامري', stopName: 'كربلاء - حي الإسكان (مجاور المستشفى العام)', order: 5, status: 'pending', isExcused: false },
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
    <div className="space-y-4 animate-fade-in">
      {/* Cockpit HUD Bar: Compact & Professional */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold shadow-2xs">
            🚐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                كابينة الكابتن • أبو كرار الكربلائي
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                سائق معتمد 🛡️
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              خط ثانوية الذرى للمتميزين - كربلاء • الحافلة: تويوتا هايس 38190 كربلاء أجور
            </p>
          </div>
        </div>

        {/* Driving Mode Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDrivingModeActive(!isDrivingModeActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-2xs ${
              isDrivingModeActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDrivingModeActive ? 'bg-white animate-ping' : 'bg-slate-400'}`}></span>
            <span>{isDrivingModeActive ? 'وضع القيادة نشط (بث GPS حي)' : 'تفعيل وضع القيادة (GPS الهاتف)'}</span>
          </button>
        </div>
      </div>

      {/* Incident Alert if submitted */}
      {incidentReported && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span>⚠️</span>
            <span>{incidentReported}</span>
          </div>
          <button
            type="button"
            onClick={() => setIncidentReported(null)}
            className="text-[11px] font-bold underline px-1"
          >
            إلغاء
          </button>
        </div>
      )}

      {/* Metrics Row: Slim & Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">الطلاب على المتن</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {boardedCount} / {totalCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">الغياب المثبت</div>
          <div className="text-lg font-bold text-amber-600 mt-0.5">
            {manifest.filter((m) => m.isExcused).length} طلاب
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">المحطة القادمة</div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 truncate mt-1">
            حي المعلمين (باقر)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">الوصول للمدرسة</div>
          <div className="text-lg font-bold text-emerald-600 mt-0.5">
            07:42 ص
          </div>
        </div>
      </div>

      {/* Live Driving Navigation Map with Buffer Caching */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>🗺️</span>
            <span>خريطة الملاحة الحية ومسار التوقفات (بث كربلاء المقدسة Traccar & GPS)</span>
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            تحديث 60fps
          </span>
        </div>
        <KhattiInteractiveMap
          busLocation={{ lat: 32.6095, lng: 44.0115, speed: 28 }}
          heightClassName="h-64 sm:h-72"
        />
      </div>

      {/* Passenger Manifest: Compact, High-Density List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>📋</span>
              <span>بوليصة الركاب ومسار التوقفات (Manifest)</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تأكيد الصعود والنزول بلمسة واحدة أثناء الوقوف التام
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIncidentReported('تم إشعار أولياء الأمور وغرفة الإدارة بوجود ازدحام مروري وتأخير تقديري 10 دقائق.')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 font-semibold text-xs border border-amber-500/20 transition-colors"
            >
              ⚠️ إشعار بازدحام أو تأخير
            </button>
          </div>
        </div>

        {/* Student items */}
        <div className="space-y-2">
          {manifest.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                item.status === 'boarded'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                  : item.isExcused
                  ? 'bg-red-50/30 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 opacity-70'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Order and info */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                  #{item.order}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    {item.isExcused && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-600">
                        مُجاز من الأهل
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    📍 {item.stopName}
                  </p>
                </div>
              </div>

              {/* Touch Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(item.id, 'boarded')}
                  disabled={item.isExcused}
                  className={`h-8 px-3 rounded-lg font-semibold text-xs transition-all ${
                    item.status === 'boarded'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  {item.status === 'boarded' ? '✓ تم الصعود' : 'صعد الحافلة'}
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(item.id, 'dropped')}
                  disabled={item.status !== 'boarded'}
                  className={`h-8 px-3 rounded-lg font-semibold text-xs transition-all ${
                    item.status === 'dropped'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600'
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
