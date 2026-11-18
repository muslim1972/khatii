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
    <div className="space-y-6 animate-fade-in">
      {/* City Switcher & Account Selector Header */}
      <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark shadow-ambient-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-bus-dark dark:text-bus">
                بوابة أولياء الأمور • حسابات تجريبية واقعية
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText border border-safety/30">
                مطابقة مؤكدة 100%
              </span>
            </div>
            <h2 className="text-xl font-bold text-ink-primary dark:text-ink-inverse mt-1">
              {activeFamily.fatherName} • {activeFamily.neighborhood} ({activeFamily.landmark})
            </h2>
            <p className="text-xs text-ink-muted dark:text-ink-inverseMuted">
              اختر عائلة ولي الأمر ثم اختر الطالب لمتابعة رحلته المباشرة وعقد الربط مع الكابتن
            </p>
          </div>

          {/* City Selection Pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark">
              <button
                type="button"
                onClick={() => handleSwitchCity('karbala')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === 'karbala'
                    ? 'bg-bus text-slate-900 shadow-sm'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
              >
                🕌 كربلاء المقدسة
              </button>
              <button
                type="button"
                onClick={() => handleSwitchCity('baghdad')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === 'baghdad'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
              >
                🏙️ بغداد العاصمة
              </button>
            </div>
          </div>
        </div>

        {/* Karbala Demo Parent Family Switcher */}
        {selectedCity === 'karbala' && (
          <div className="pt-4 space-y-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-inverseMuted flex items-center gap-1.5">
              <span>👨‍👩‍👧‍👦</span>
              <span>تبديل حساب ولي الأمر (3 عائلات تجريبية مختلفة العناوين بكربلاء):</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {karbalaFamilies.map((fam) => {
                const isFamActive = fam.id === activeFamily.id;
                return (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => handleSelectFamily(fam.id)}
                    className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                      isFamActive
                        ? 'bg-bus/10 border-bus text-slate-900 dark:text-white shadow-sm ring-2 ring-bus/20'
                        : 'bg-canvas-subtle dark:bg-canvas-subtleDark border-surface-borderLight dark:border-surface-borderDark hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-ink-primary dark:text-ink-inverse">
                        {fam.fatherName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-light dark:bg-surface-dark border">
                        {fam.students.length} {fam.students.length > 1 ? 'أبناء' : 'ابنة'}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted truncate">
                      📍 {fam.neighborhood} ({fam.landmark})
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Children of the Active Family */}
        <div className="pt-4 space-y-2">
          <span className="text-xs font-bold text-ink-muted dark:text-ink-inverseMuted flex items-center gap-1.5">
            <span>🎒</span>
            <span>أبناء وبنات {activeFamily.fatherName} المسجلين في الخطوط:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {students.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl border text-right transition-all ${
                    isSelected
                      ? 'bg-bus/15 border-bus shadow-ambient-sm ring-2 ring-bus/30'
                      : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark hover:border-slate-300'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`font-bold text-xs sm:text-sm truncate ${isSelected ? 'text-brand dark:text-white' : 'text-ink-primary dark:text-ink-inverse'}`}>
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
                    <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted truncate">
                      {student.school}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mutual Agreement & Seat Confirmation Card */}
        <div className="mt-5 p-4 rounded-2xl bg-canvas-subtle dark:bg-canvas-subtleDark border border-surface-borderLight dark:border-surface-borderDark space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-safety/20 text-safety flex items-center justify-center text-xl shrink-0 font-bold">
                📜
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-ink-primary dark:text-ink-inverse">
                    عقد النقل المتبادل وتثبيت المقعد مع {activeFamily.captainAgreement.captainName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText border border-safety/30">
                    اتفاق ساري وموثّق ✅
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted dark:text-ink-inverseMuted mt-0.5">
                  المركبة: {activeFamily.captainAgreement.vehicleModel} • {activeFamily.captainAgreement.vehiclePlate}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAgreementDetailsOpen(!isAgreementDetailsOpen)}
              className="px-3.5 py-2 rounded-xl bg-surface-light dark:bg-surface-dark hover:bg-slate-200 text-xs font-bold text-ink-secondary border border-surface-borderLight transition-colors self-start sm:self-auto"
            >
              {isAgreementDetailsOpen ? 'إخفاء بنود الاتفاق ▲' : 'عرض تفاصيل الاتفاق والمسار ▼'}
            </button>
          </div>

          {isAgreementDetailsOpen && (
            <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight space-y-2.5 text-xs text-ink-primary dark:text-ink-inverse animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-surface-borderLight dark:border-surface-borderDark">
                <div>
                  <span className="text-ink-muted">المسار المعتمد للخط:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeFamily.captainAgreement.routeDescription}
                  </p>
                </div>
                <div>
                  <span className="text-ink-muted">القسط الشهري المتفق عليه:</span>
                  <p className="font-semibold text-safety-darkText dark:text-safety mt-0.5">
                    {activeFamily.captainAgreement.monthlyFee}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
                <span>🛡️ فحص جنائي معتمد (KYC) للسائق مع فحص سنوية وإجازة سوق المرور</span>
                <span className="text-brand font-semibold">حماية كاملة لأرقام الهواتف (Blind Matching)</span>
              </div>
            </div>
          )}
        </div>

        {/* Live GPS Hardware Simulation Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-bus/15 via-safety/10 to-brand/15 border border-bus/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-bus text-slate-900 flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm">
              🛰️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-ink-primary dark:text-ink-inverse">
                  محاكي جهاز التتبع الميداني (Traccar Live GPS Simulator)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bus text-slate-900">
                  {selectedCity === 'karbala' ? 'كربلاء المقدسة' : 'بغداد'}
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-inverseMuted mt-0.5">
                {isSimulating
                  ? 'الحافلة تتحرك فعلياً الآن في شوارع كربلاء (بث الإحداثيات كل ثانيتين عبر الخريطة والـ HUD وتحديث المسافة)'
                  : 'لا تحتاج لسيارة حقيقية الآن! انقر الزر لترى الحافلة تنطلق وتقترب من المنزل وتتجاوز السياج 500م'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 flex items-center justify-center gap-2 ${
              isSimulating
                ? 'bg-alert-crimson hover:bg-red-700 text-white animate-pulse'
                : 'bg-safety hover:bg-safety-hover text-white shadow-ambient-safety'
            }`}
          >
            <span>{isSimulating ? '⏸️ إيقاف محاكاة GPS' : '▶️ تشغيل محاكاة سير الحافلة في كربلاء'}</span>
          </button>
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
                label: `منزل ${activeStudent.name} (${activeFamily.neighborhood})`,
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
              <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                {activeFamily.neighborhood}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark">
                <div>
                  <p className="font-bold text-ink-primary dark:text-ink-inverse">{activeFamily.fatherName}</p>
                  <p className="text-ink-muted dark:text-ink-inverseMuted">{activeFamily.fatherPhone} • مفوّض دائم</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-safety-subtle text-safety-darkText">
                  موثّق
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle dark:bg-canvas-subtleDark">
                <div>
                  <p className="font-bold text-ink-primary dark:text-ink-inverse">{activeFamily.motherName}</p>
                  <p className="text-ink-muted dark:text-ink-inverseMuted">{activeFamily.motherPhone} • مفوّض دائم</p>
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
              <p className="text-2xl font-bold">{activeFamily.captainAgreement.monthlyFee}</p>
              <p className="text-xs text-slate-300 mt-1">ذهاب وإياب • مكيف بالكامل • تأمين ركاب</p>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-safety flex items-center gap-1">
                <span>●</span> تم الدفع وتثبيت المقعد
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
