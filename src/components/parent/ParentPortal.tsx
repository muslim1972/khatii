'use client';

import React, { useState, useEffect } from 'react';
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
  city: 'karbala' | 'baghdad';
}

export interface DemoFamily {
  id: string;
  fatherName: string;
  motherName: string;
  fatherPhone: string;
  motherPhone: string;
  city: 'karbala' | 'baghdad';
  neighborhood: string;
  landmark: string;
  homeCoords: { lat: number; lng: number };
  captainAgreement: {
    captainName: string;
    captainPhoneEncrypted: string;
    vehiclePlate: string;
    vehicleModel: string;
    seatsCount: number;
    monthlyFee: string;
    status: 'active' | 'pending';
    routeDescription: string;
  };
  students: StudentProfile[];
}

export const karbalaFamilies: DemoFamily[] = [
  {
    id: 'fam-karbala-1',
    fatherName: 'حيدر الحسيني (الأب)',
    motherName: 'أم سجاد (الأم)',
    fatherPhone: '0780••••120',
    motherPhone: '0781••••994',
    city: 'karbala',
    neighborhood: 'حي الحسين',
    landmark: 'قرب جامع أهل البيت',
    homeCoords: { lat: 32.6075, lng: 44.0150 },
    captainAgreement: {
      captainName: 'الكابتن أبو كرار الكربلائي',
      captainPhoneEncrypted: '0780••••319',
      vehiclePlate: 'كربلاء 38190 أجور',
      vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
      seatsCount: 2,
      monthlyFee: '240,000 د.ع (120 ألف/مقعد)',
      status: 'active',
      routeDescription: 'حي المعلمين ⟵ حي الحسين ⟵ حي الإسكان ⟵ ثانوية الذرى للمتميزين & ثانوية المتفوقات الأولى',
    },
    students: [
      {
        id: 'karbala-1',
        name: 'سجاد حيدر الحسيني',
        school: 'ثانوية الذرى للمتميزين للبنين - كربلاء',
        grade: 'الرابع العلمي',
        avatar: '👦',
        status: 'on_bus',
        currentStage: 2,
        driverName: 'الكابتن أبو كرار الكربلائي',
        driverPhoneEncrypted: '0780••••319',
        vehiclePlate: 'كربلاء 38190 أجور',
        vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
        etaMinutes: 4,
        distanceMeters: 480,
        speedKmH: 28,
        isTodayAbsent: false,
        busCoords: { lat: 32.6095, lng: 44.0115 },
        homeCoords: { lat: 32.6075, lng: 44.0150 },
        schoolCoords: { lat: 32.6050, lng: 44.0080 },
        city: 'karbala',
      },
      {
        id: 'karbala-2',
        name: 'زينب حيدر الحسيني',
        school: 'ثانوية المتفوقات الأولى - كربلاء',
        grade: 'الثاني متوسط',
        avatar: '👧',
        status: 'at_home',
        currentStage: 1,
        driverName: 'الكابتن أبو كرار الكربلائي',
        driverPhoneEncrypted: '0780••••319',
        vehiclePlate: 'كربلاء 38190 أجور',
        vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
        etaMinutes: 12,
        distanceMeters: 1400,
        speedKmH: 35,
        isTodayAbsent: false,
        busCoords: { lat: 32.6180, lng: 43.9980 },
        homeCoords: { lat: 32.6075, lng: 44.0150 },
        schoolCoords: { lat: 32.6120, lng: 44.0100 },
        city: 'karbala',
      },
    ],
  },
  {
    id: 'fam-karbala-2',
    fatherName: 'علي الموسوي (الأب)',
    motherName: 'أم باقر (الأم)',
    fatherPhone: '0771••••450',
    motherPhone: '0770••••331',
    city: 'karbala',
    neighborhood: 'حي المعلمين',
    landmark: 'شارع الكوثر',
    homeCoords: { lat: 32.6180, lng: 43.9980 },
    captainAgreement: {
      captainName: 'الكابتن أبو كرار الكربلائي',
      captainPhoneEncrypted: '0780••••319',
      vehiclePlate: 'كربلاء 38190 أجور',
      vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
      seatsCount: 2,
      monthlyFee: '240,000 د.ع (120 ألف/مقعد)',
      status: 'active',
      routeDescription: 'حي المعلمين ⟵ حي الحسين ⟵ حي الإسكان ⟵ ثانوية الذرى للمتميزين & ثانوية المتفوقات الأولى',
    },
    students: [
      {
        id: 'karbala-3',
        name: 'باقر علي الموسوي',
        school: 'جامعة كربلاء - كلية الهندسة (مجمع فريحة)',
        grade: 'المرحلة الرابعة - مدني',
        avatar: '👨‍🎓',
        status: 'at_school',
        currentStage: 4,
        driverName: 'الكابتن أبو كرار الكربلائي',
        driverPhoneEncrypted: '0780••••319',
        vehiclePlate: 'كربلاء 38190 أجور',
        vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
        etaMinutes: 0,
        distanceMeters: 0,
        speedKmH: 0,
        isTodayAbsent: false,
        busCoords: { lat: 32.5710, lng: 44.0780 },
        homeCoords: { lat: 32.6180, lng: 43.9980 },
        schoolCoords: { lat: 32.5710, lng: 44.0780 },
        city: 'karbala',
      },
      {
        id: 'karbala-4',
        name: 'كرار علي الموسوي',
        school: 'ثانوية الذرى للمتميزين للبنين - كربلاء',
        grade: 'الأول متوسط',
        avatar: '👦',
        status: 'at_home',
        currentStage: 1,
        driverName: 'الكابتن أبو كرار الكربلائي',
        driverPhoneEncrypted: '0780••••319',
        vehiclePlate: 'كربلاء 38190 أجور',
        vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
        etaMinutes: 18,
        distanceMeters: 2200,
        speedKmH: 30,
        isTodayAbsent: true,
        busCoords: { lat: 32.6135, lng: 44.0040 },
        homeCoords: { lat: 32.6180, lng: 43.9980 },
        schoolCoords: { lat: 32.6050, lng: 44.0080 },
        city: 'karbala',
      },
    ],
  },
  {
    id: 'fam-karbala-3',
    fatherName: 'قاسم العامري (الأب)',
    motherName: 'أم مريم (الأم)',
    fatherPhone: '0772••••880',
    motherPhone: '0773••••112',
    city: 'karbala',
    neighborhood: 'حي الإسكان',
    landmark: 'مجاور المستشفى العام',
    homeCoords: { lat: 32.6060, lng: 44.0100 },
    captainAgreement: {
      captainName: 'الكابتن أبو كرار الكربلائي',
      captainPhoneEncrypted: '0780••••319',
      vehiclePlate: 'كربلاء 38190 أجور',
      vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
      seatsCount: 1,
      monthlyFee: '120,000 د.ع شهرياً',
      status: 'active',
      routeDescription: 'حي المعلمين ⟵ حي الحسين ⟵ حي الإسكان ⟵ ثانوية الذرى للمتميزين & ثانوية المتفوقات الأولى',
    },
    students: [
      {
        id: 'karbala-5',
        name: 'مريم قاسم العامري',
        school: 'ثانوية المتفوقات الأولى - كربلاء',
        grade: 'الثالث متوسط',
        avatar: '👧',
        status: 'at_home',
        currentStage: 1,
        driverName: 'الكابتن أبو كرار الكربلائي',
        driverPhoneEncrypted: '0780••••319',
        vehiclePlate: 'كربلاء 38190 أجور',
        vehicleModel: 'تويوتا هايس 2023 (14 راكب - مكيفة)',
        etaMinutes: 8,
        distanceMeters: 950,
        speedKmH: 26,
        isTodayAbsent: false,
        busCoords: { lat: 32.6135, lng: 44.0040 },
        homeCoords: { lat: 32.6060, lng: 44.0100 },
        schoolCoords: { lat: 32.6120, lng: 44.0100 },
        city: 'karbala',
      },
    ],
  },
];

export const baghdadStudents: StudentProfile[] = [
  {
    id: 'baghdad-1',
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
    city: 'baghdad',
  },
  {
    id: 'baghdad-2',
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
    city: 'baghdad',
  },
  {
    id: 'baghdad-3',
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
    city: 'baghdad',
  },
];

export const baghdadFamilies: DemoFamily[] = [
  {
    id: 'fam-baghdad-1',
    fatherName: 'أحمد الكرخي (الأب)',
    motherName: 'أم حيدر (الأم)',
    fatherPhone: '0770••••120',
    motherPhone: '0781••••994',
    city: 'baghdad',
    neighborhood: 'المنصور',
    landmark: 'قرب ساحة الرواد',
    homeCoords: { lat: 33.3080, lng: 44.3590 },
    captainAgreement: {
      captainName: 'الكابتن أبو حيدر الساعدي',
      captainPhoneEncrypted: '0770••••192',
      vehiclePlate: 'بغداد 48192 خصوصي',
      vehicleModel: 'تويوتا هايس 2022 (14 راكب - مكيفة)',
      seatsCount: 3,
      monthlyFee: '360,000 د.ع (3 مقاعد)',
      status: 'active',
      routeDescription: 'المنصور ⟵ الداوودي ⟵ حي الجامعة ⟵ ثانوية المتميزات الأولى',
    },
    students: baghdadStudents,
  },
];

// Realistic Karbala GPS Waypoints along real roads
const karbalaSimulationWaypoints = [
  { lat: 32.6180, lng: 43.9980, speed: 42, eta: 8, dist: 1800, stage: 1, notice: 'انطلاق الحافلة من حي المعلمين - كربلاء' },
  { lat: 32.6135, lng: 44.0040, speed: 38, eta: 6, dist: 1200, stage: 1, notice: 'المرور عبر شارع السناتر / حي الإسكان' },
  { lat: 32.6095, lng: 44.0115, speed: 25, eta: 2, dist: 480, stage: 2, notice: '🔔 تنبيه سياج الأمان: الحافلة اقتربت 500 متر من المنزل في حي الحسين!' },
  { lat: 32.6075, lng: 44.0150, speed: 0, eta: 0, dist: 0, stage: 3, notice: '✅ وقوف الحافلة أمام المنزل: تم صعود سجاد وتأمين مقعده بسلام!' },
  { lat: 32.6060, lng: 44.0100, speed: 32, eta: 2, dist: 550, stage: 3, notice: 'التحرك عبر شارع الإسكان نحو الحرم المدرسي' },
  { lat: 32.6050, lng: 44.0080, speed: 0, eta: 0, dist: 0, stage: 4, notice: '🎓 وصول الحافلة بسلام إلى بوابة ثانوية الذرى للمتميزين - كربلاء!' },
];

export const ParentPortal: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<'karbala' | 'baghdad'>('karbala');
  const [activeFamilyId, setActiveFamilyId] = useState<string>('fam-karbala-1');
  const [students, setStudents] = useState<StudentProfile[]>(karbalaFamilies[0].students);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(karbalaFamilies[0].students[0].id);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);
  const [isAgreementDetailsOpen, setIsAgreementDetailsOpen] = useState<boolean>(false);

  // Live GPS Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const currentFamilies = selectedCity === 'karbala' ? karbalaFamilies : baghdadFamilies;
  const activeFamily =
    currentFamilies.find((f) => f.id === activeFamilyId) || currentFamilies[0];

  // Switch city handler
  const handleSwitchCity = (city: 'karbala' | 'baghdad') => {
    setSelectedCity(city);
    setIsSimulating(false);
    if (city === 'karbala') {
      const fam = karbalaFamilies[0];
      setActiveFamilyId(fam.id);
      setStudents(fam.students);
      setSelectedStudentId(fam.students[0].id);
      setActionSuccessNotice('تم تحويل الخريطة والخطوط إلى كربلاء المقدسة (حي الحسين ⟵ ثانوية الذرى للمتميزين).');
    } else {
      const fam = baghdadFamilies[0];
      setActiveFamilyId(fam.id);
      setStudents(fam.students);
      setSelectedStudentId(fam.students[0].id);
      setActionSuccessNotice('تم تحويل الخريطة والخطوط إلى العاصمة بغداد (المنصور ⟵ ثانوية المتميزات الأولى).');
    }
  };

  // Switch family handler
  const handleSelectFamily = (famId: string) => {
    const targetFamily = currentFamilies.find((f) => f.id === famId);
    if (!targetFamily) return;
    setActiveFamilyId(famId);
    setStudents(targetFamily.students);
    setSelectedStudentId(targetFamily.students[0].id);
    setActionSuccessNotice(`تم التبديل إلى حساب ولي الأمر: ${targetFamily.fatherName} (${targetFamily.neighborhood})`);
  };

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // GPS Simulation Loop (Runs on interval without setTimeout UI hacks)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setStudents((current) =>
        current.map((s) => {
          if (s.id === selectedStudentId && s.city === 'karbala') {
            const currentIdx = karbalaSimulationWaypoints.findIndex(
              (w) => Math.abs(w.lat - s.busCoords.lat) < 0.0005 && Math.abs(w.lng - s.busCoords.lng) < 0.0005
            );
            const nextIdx = (currentIdx + 1) % karbalaSimulationWaypoints.length;
            const pt = karbalaSimulationWaypoints[nextIdx];

            setActionSuccessNotice(pt.notice);

            return {
              ...s,
              busCoords: { lat: pt.lat, lng: pt.lng },
              speedKmH: pt.speed,
              etaMinutes: pt.eta,
              distanceMeters: pt.dist,
              currentStage: pt.stage,
              status: pt.stage === 4 ? 'at_school' : pt.stage === 3 ? 'on_bus' : s.status,
            };
          }
          return s;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating, selectedStudentId]);

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
    <div className="space-y-4 animate-fade-in">
      {/* City Switcher & Account Selector Header: Compact, high density */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                بوابة أولياء الأمور • الحسابات الميدانية
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                مطابقة مؤكدة 100%
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {activeFamily.fatherName} • {activeFamily.neighborhood} ({activeFamily.landmark})
            </h2>
          </div>

          {/* City Selection Pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => handleSwitchCity('karbala')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCity === 'karbala'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🕌 كربلاء المقدسة
            </button>
            <button
              type="button"
              onClick={() => handleSwitchCity('baghdad')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCity === 'baghdad'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🏙️ بغداد العاصمة
            </button>
          </div>
        </div>

        {/* Karbala Demo Parent Family Switcher */}
        {selectedCity === 'karbala' && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>👨‍👩‍👧‍👦</span>
              <span>تبديل حساب ولي الأمر (3 عائلات تجريبية بكربلاء):</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {karbalaFamilies.map((fam) => {
                const isFamActive = fam.id === activeFamily.id;
                return (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => handleSelectFamily(fam.id)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 ${
                      isFamActive
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block">
                        {fam.fatherName}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        📍 {fam.neighborhood}
                      </p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-900 border shrink-0">
                      {fam.students.length} {fam.students.length > 1 ? 'أبناء' : 'ابنة'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Children of the Active Family */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>🎒</span>
            <span>الأبناء المسجلون في الخطوط:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {students.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-right transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shadow-inner shrink-0">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`font-semibold text-xs truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {student.name}
                      </p>
                      {student.isTodayAbsent ? (
                        <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950/40 text-red-600">
                          غائب
                        </span>
                      ) : (
                        <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700">
                          نشط
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {student.school}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mutual Agreement & Seat Confirmation Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-base shrink-0 font-bold">
                📜
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    عقد النقل وتثبيت المقعد مع {activeFamily.captainAgreement.captainName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-500/20">
                    موثّق ✅
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {activeFamily.captainAgreement.vehicleModel} • {activeFamily.captainAgreement.vehiclePlate}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAgreementDetailsOpen(!isAgreementDetailsOpen)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors self-start sm:self-auto"
            >
              {isAgreementDetailsOpen ? 'إخفاء التفاصيل ▲' : 'تفاصيل العقد والمسار ▼'}
            </button>
          </div>

          {isAgreementDetailsOpen && (
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-800 dark:text-slate-200 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-500">مسار الخط المعتمد:</span>
                  <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                    {activeFamily.captainAgreement.routeDescription}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">القسط المتفق عليه:</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {activeFamily.captainAgreement.monthlyFee}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                <span>🛡️ فحص جنائي معتمد (KYC) + سنوية وإجازة سوق</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">أرقام الهواتف مشفرة (Blind Matching)</span>
              </div>
            </div>
          )}
        </div>

        {/* Live GPS Hardware Simulation Banner: Slim & Compact */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-base font-bold shrink-0 shadow-2xs">
              🛰️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  محاكي جهاز التتبع الميداني (Traccar Live GPS)
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                  {selectedCity === 'karbala' ? 'كربلاء' : 'بغداد'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                {isSimulating
                  ? 'الحافلة تتحرك فعلياً الآن في شوارع كربلاء (بث الإحداثيات كل ثانيتين وتحديث المسافة وسياج 500م)'
                  : 'اضغط لتشغيل محاكاة سير الحافلة في كربلاء واختبار تنبيه الـ 500 متر دون الحاجة لسيارة حقيقية'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`h-9 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              isSimulating
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span>{isSimulating ? '⏸️ إيقاف المحاكاة' : '▶️ تشغيل محاكاة سير الحافلة'}</span>
          </button>
        </div>
      </div>

      {/* Action Notice */}
      {actionSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2 shadow-2xs text-xs">
          <div className="flex items-center gap-1.5">
            <span>✅</span>
            <span>{actionSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessNotice(null)}
            className="text-[11px] font-bold hover:underline px-1.5 py-0.5"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Main Grid: Tracking Radar + Milestone Journey Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Telemetry Card & Map HUD */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                  التتبع الجغرافي اللحظي
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  رحلة {activeStudent.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeStudent.school} • {activeStudent.grade}
                </p>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                label: `منزل ${activeStudent.name} (${activeFamily.neighborhood})`,
              }}
              schoolLocation={{
                lat: activeStudent.schoolCoords.lat,
                lng: activeStudent.schoolCoords.lng,
                name: activeStudent.school,
              }}
              geofenceRadiusMeters={500}
              heightClassName="h-64 sm:h-80"
            />

            {/* Driver Profile & Vehicle info */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center text-base font-bold">
                  👨‍✈️
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                    {activeStudent.driverName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeStudent.vehicleModel} • {activeStudent.vehiclePlate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>📞</span>
                  <span>اتصال مشفر</span>
                </button>
              </div>
            </div>
          </div>

          {/* Absence Reporting Card (One-Tap Leave Request) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🚫</span>
                <span>طلب إعفاء وتثبيت غياب اليوم</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                في حال كان الطالب مريضاً، انقر الزر لإشعار السائق فوراً لتجاوز نقطة التوقف.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAbsence}
              className={`h-9 px-4 rounded-xl font-semibold text-xs transition-all shrink-0 shadow-2xs ${
                activeStudent.isTodayAbsent
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {activeStudent.isTodayAbsent ? 'إلغاء الغياب (ابني سيذهب)' : 'ابني غائب اليوم (تجاوز المنزل)'}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Milestone Stepper & Authorized Delegates */}
        <div className="space-y-4">
          {/* Milestone Stepper: Compact */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>📍</span>
              <span>مراحل الرحلة الحية</span>
            </h4>

            <div className="relative space-y-4">
              {stages.map((stage, idx) => {
                const isPassed = stage.num < activeStudent.currentStage;
                const isCurrent = stage.num === activeStudent.currentStage;

                return (
                  <div key={stage.num} className="relative flex items-start gap-3">
                    {/* Vertical connector line */}
                    {idx < stages.length - 1 && (
                      <div
                        className={`absolute right-3.5 top-6 -bottom-3 w-0.5 ${
                          isPassed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      ></div>
                    )}

                    {/* Step Circle Indicator */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shrink-0 ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/20 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isPassed ? '✓' : stage.num}
                    </div>

                    {/* Text Details */}
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-amber-700 dark:text-amber-400'
                            : isPassed
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {stage.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authorized Delegates */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>👥</span>
                <span>المفوّضون باستلام الطالب</span>
              </h4>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                {activeFamily.neighborhood}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-xs">{activeFamily.fatherName}</p>
                  <p className="text-slate-500 text-[10px]">{activeFamily.fatherPhone} • مفوّض دائم</p>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700">
                  موثّق
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-xs">{activeFamily.motherName}</p>
                  <p className="text-slate-500 text-[10px]">{activeFamily.motherPhone} • مفوّض دائم</p>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700">
                  موثّق
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Tier & Billing */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                باقة النقل المدرسي الشاملة
              </span>
              <span className="text-[10px] text-slate-400">تشرين الثاني 2026</span>
            </div>

            <div>
              <p className="text-lg font-bold text-white">{activeFamily.captainAgreement.monthlyFee}</p>
              <p className="text-[10px] text-slate-300">ذهاب وإياب • مكيف • تأمين ركاب</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 flex items-center gap-1">
                <span>●</span> المقعد مثبت بنجاح
              </span>
              <button type="button" className="text-sky-300 hover:underline">
                الفاتورة PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
