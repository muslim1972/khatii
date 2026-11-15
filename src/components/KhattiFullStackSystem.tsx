'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

// =====================================================================================
// 2. الأنواع البرمجية الصارمة (TypeScript Domain Models)
// =====================================================================================
export type UserRole = 'admin' | 'driver' | 'student_parent';
export type EducationLevel = 'primary' | 'middle' | 'high_school' | 'university';
export type GenderPreference = 'male_only' | 'female_only' | 'mixed';
export type VehicleType = 'sedan' | 'suv' | 'starex_van' | 'minibus' | 'coaster';
export type MatchStatus =
  | 'pending_driver'
  | 'driver_accepted_searching_more'
  | 'offered_to_student'
  | 'student_confirmed'
  | 'rejected_re_search'
  | 'active_contract';

export interface LiveVehicleTelemetry {
  id: string;
  vehicleId: string;
  driverName: string;
  driverPhoneMasked: string;
  driverPhoneUnmasked: string;
  vehicleLabel: string;
  vehicleType: VehicleType;
  modelYear: number;
  plateNumber: string;
  imei: string;
  lat: number;
  lng: number;
  targetLat: number;
  targetLng: number;
  speedKmh: number;
  heading: number;
  maxCapacity: number;
  currentOccupied: number;
  institutionName: string;
  districtOrigin: string;
  operationalState: 'en_route' | 'arrived_at_school' | 'stopped' | 'overspeed_alert';
  etaMinutes: number;
  distanceToHomeMeters: number;
}

export interface DriverKycRecord {
  id: string;
  driverId: string;
  fullName: string;
  primaryPhone: string;
  emergencyPhone: string;
  residentialDistrict: string;
  vehicleLabel: string;
  vehicleType: VehicleType;
  manufactureYear: number;
  maxCapacity: number;
  nationalIdNumber: string;
  drivingLicenseNumber: string;
  vehicleRegistrationNumber: string;
  nationalIdFrontPath: string;
  drivingLicensePath: string;
  vehicleRegistrationPath: string;
  exteriorPhotoPath: string;
  interiorPhotoPath: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface BlindMatchNotificationItem {
  id: string;
  requestId: string;
  vehicleId: string;
  driverId: string;
  parentStudentId: string;
  homeDistrict: string;
  exactHomeAddress: string;
  studentFullName: string;
  parentPrimaryPhone: string;
  parentEmergencyPhone: string;
  institutionName: string;
  studentsCount: number;
  studyDays: number[];
  morningTime: string;
  returnTime: string;
  vehicleBrandModel: string;
  vehicleType: VehicleType;
  vehicleModelYear: number;
  driverRating: number;
  currentOccupied: number;
  maxCapacity: number;
  estimatedMonthlyCostIqd: number;
  status: MatchStatus;
  isContactUnmasked: boolean;
}

// =====================================================================================
// 3. الثوابت المرجعية للبيئة التعليمية العراقية (المدارس والجامعات والأحياء)
// =====================================================================================
export const IRAQ_INSTITUTIONS = [
  { id: 'inst-1', name: 'جامعة كربلاء - مجمع فريحة', level: 'university' as EducationLevel, lat: 32.6024, lng: 44.0862 },
  { id: 'inst-2', name: 'جامعة الزهراء (ع) للبنات', level: 'university' as EducationLevel, lat: 32.6341, lng: 44.0518 },
  { id: 'inst-3', name: 'جامعة وارث الأنبياء (ع)', level: 'university' as EducationLevel, lat: 32.5895, lng: 44.1120 },
  { id: 'inst-4', name: 'ثانوية المتميزين - كربلاء', level: 'high_school' as EducationLevel, lat: 32.6188, lng: 44.0195 },
  { id: 'inst-5', name: 'إعدادية كربلاء للبنات', level: 'high_school' as EducationLevel, lat: 32.6122, lng: 44.0280 },
  { id: 'inst-6', name: 'مدرسة الروضتين الابتدائية النموذجية', level: 'primary' as EducationLevel, lat: 32.6250, lng: 44.0095 },
];

export const WEEKDAYS_AR = [
  { index: 0, short: 'الأحد', full: 'الأحد' },
  { index: 1, short: 'الإثنين', full: 'الإثنين' },
  { index: 2, short: 'الثلاثاء', full: 'الثلاثاء' },
  { index: 3, short: 'الأربعاء', full: 'الأربعاء' },
  { index: 4, short: 'الخميس', full: 'الخميس' },
  { index: 5, short: 'السبت', full: 'السبت (تكميلي)' },
];

export const VEHICLE_TYPE_LABELS: Record<VehicleType, { label: string; defaultSeats: number }> = {
  sedan: { label: 'صالون خصوصي (4 ركاب)', defaultSeats: 4 },
  suv: { label: 'دفع رباعي تاهو / سورينتو (6 ركاب)', defaultSeats: 6 },
  starex_van: { label: 'هيونداي ستاركس / باص حديث (10 ركاب)', defaultSeats: 10 },
  minibus: { label: 'ميني باص (14 راكباً)', defaultSeats: 14 },
  coaster: { label: 'كوستر جامعي (22 راكباً)', defaultSeats: 22 },
};

// =====================================================================================
// 4. مكونات نظام الهوية البصرية (Optical Design System Components - 8pt Grid & WCAG AAA)
// =====================================================================================

export const OpticalCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}> = ({ children, className = '', elevated = false }) => (
  <div
    className={`rounded-xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-6 transition-all duration-300 ${
      elevated ? 'shadow-ambient-lg' : 'shadow-ambient-md'
    } ${className}`}
  >
    {children}
  </div>
);

export const ErgonomicButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'safety' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const styles: Record<string, string> = {
    primary:
      'bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white shadow-ambient-brand',
    safety:
      'bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white shadow-ambient-safety',
    secondary:
      'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700',
    danger:
      'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[48px] px-6 py-2 rounded-lg font-semibold text-base inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${
        styles[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const StatusBadge: React.FC<{
  tone: 'blue' | 'emerald' | 'amber' | 'crimson' | 'slate';
  children: React.ReactNode;
}> = ({ tone, children }) => {
  const toneMap = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800',
    emerald:
      'bg-emerald-50 text-[#065F46] border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
    amber:
      'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
    crimson:
      'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800',
    slate:
      'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1 rounded-md text-xs font-bold border ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
};

// =====================================================================================
// 5. التطبيق المتكامل بجميع الواجهات الثلاث (Landing + Student/Parent + Driver + Admin)
// =====================================================================================
export default function KhattiFullStackSystem() {
  const [activePortal, setActivePortal] = useState<'landing' | 'student_parent' | 'driver' | 'admin'>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -----------------------------------------------------------------------------------
  // حالة التتبع الحي للأسطول (60fps Smooth Marker Interpolation Simulation & WebSocket Ready)
  // -----------------------------------------------------------------------------------
  const [fleetVehicles, setFleetVehicles] = useState<LiveVehicleTelemetry[]>([
    {
      id: 'gps-101',
      vehicleId: 'veh-101',
      driverName: 'كابتن حيدر عبد الرضا الكربلائي',
      driverPhoneMasked: '0770 ••• ••84 (محجوب حتى تثبيت الخط)',
      driverPhoneUnmasked: '07704829184',
      vehicleLabel: 'هيونداي ستاركس H1',
      vehicleType: 'starex_van',
      modelYear: 2023,
      plateNumber: 'كربلاء 48291 أ',
      imei: '864209041829104',
      lat: 32.6145,
      lng: 44.0312,
      targetLat: 32.6024,
      targetLng: 44.0862,
      speedKmh: 54,
      heading: 118,
      maxCapacity: 10,
      currentOccupied: 8,
      institutionName: 'جامعة كربلاء - مجمع فريحة',
      districtOrigin: 'حي الهادي / حي الموظفين',
      operationalState: 'en_route',
      etaMinutes: 6,
      distanceToHomeMeters: 460,
    },
    {
      id: 'gps-102',
      vehicleId: 'veh-102',
      driverName: 'كابتن مرتضى جاسم الشمري',
      driverPhoneMasked: '0781 ••• ••19 (محجوب حتى تثبيت الخط)',
      driverPhoneUnmasked: '07813920119',
      vehicleLabel: 'شيفروليه تاهو LTZ',
      vehicleType: 'suv',
      modelYear: 2024,
      plateNumber: 'كربلاء 91044 ب',
      imei: '864209049912031',
      lat: 32.6188,
      lng: 44.0195,
      targetLat: 32.6188,
      targetLng: 44.0195,
      speedKmh: 0,
      heading: 45,
      maxCapacity: 6,
      currentOccupied: 6,
      institutionName: 'ثانوية المتميزين - كربلاء',
      districtOrigin: 'حي الحسين / حي الأسرة',
      operationalState: 'arrived_at_school',
      etaMinutes: 0,
      distanceToHomeMeters: 2150,
    },
    {
      id: 'gps-103',
      vehicleId: 'veh-103',
      driverName: 'كابتن عمار كاظم الفتلاوي',
      driverPhoneMasked: '0772 ••• ••61 (محجوب حتى تثبيت الخط)',
      driverPhoneUnmasked: '07726619061',
      vehicleLabel: 'تويوتا كورولا الهجينة',
      vehicleType: 'sedan',
      modelYear: 2022,
      plateNumber: 'كربلاء 31805 ج',
      imei: '864209047725190',
      lat: 32.6290,
      lng: 44.0410,
      targetLat: 32.6341,
      targetLng: 44.0518,
      speedKmh: 92,
      heading: 75,
      maxCapacity: 4,
      currentOccupied: 3,
      institutionName: 'جامعة الزهراء (ع) للبنات',
      districtOrigin: 'حي النقيب',
      operationalState: 'overspeed_alert',
      etaMinutes: 4,
      distanceToHomeMeters: 1280,
    },
  ]);

  // -----------------------------------------------------------------------------------
  // حالة إشعارات المطابقة العمياء (Blind Matching Workflow State)
  // -----------------------------------------------------------------------------------
  const [matchNotifications, setMatchNotifications] = useState<BlindMatchNotificationItem[]>([
    {
      id: 'match-901',
      requestId: 'req-501',
      vehicleId: 'veh-101',
      driverId: 'drv-101',
      parentStudentId: 'stu-301',
      homeDistrict: 'حي الهادي',
      exactHomeAddress: 'حي الهادي - شارع السناتر - زقاق 14 - دار 22 (قرب جامع الهادي)',
      studentFullName: 'أحمد مسلم عقيل العنزي (وأخوه علي)',
      parentPrimaryPhone: '07701234567',
      parentEmergencyPhone: '07807654321',
      institutionName: 'ثانوية المتميزين - كربلاء',
      studentsCount: 2,
      studyDays: [0, 1, 2, 3, 4],
      morningTime: '07:15',
      returnTime: '13:30',
      vehicleBrandModel: 'هيونداي ستاركس H1 (تبريد مركزي مضاعف)',
      vehicleType: 'starex_van',
      vehicleModelYear: 2023,
      driverRating: 4.95,
      currentOccupied: 8,
      maxCapacity: 10,
      estimatedMonthlyCostIqd: 140000,
      status: 'pending_driver',
      isContactUnmasked: false,
    },
  ]);

  // -----------------------------------------------------------------------------------
  // حالة نموذج طلب الخط للطالب / ولي الأمر (Student / Parent Form State)
  // -----------------------------------------------------------------------------------
  const [parentForm, setParentForm] = useState({
    parentOrStudentName: 'مسلم عقيل العنزي',
    primaryPhone: '07701234567',
    emergencyBackupPhone: '07807654321',
    studentsCount: 2,
    homeDistrict: 'حي الهادي',
    homeDetailedAddress: 'شارع السناتر - مجاور مدرسة الروضتين',
    homeLat: 32.6085,
    homeLng: 44.0345,
    selectedInstitutionId: 'inst-4',
    educationLevel: 'high_school' as EducationLevel,
    genderPreference: 'male_only' as GenderPreference,
    studyDays: [0, 1, 2, 3, 4] as number[],
    morningTime: '07:30',
    returnTime: '13:30',
    optionalVehicleType: '' as '' | VehicleType,
    optionalMinModelYear: '2021',
    hasLiveGpsSubscription: false,
  });

  // -----------------------------------------------------------------------------------
  // حالة نموذج تسجيل السائق ورفع الوثائق السرية (Driver KYC & Vehicle Portal State)
  // -----------------------------------------------------------------------------------
  const [driverKycList, setDriverKycList] = useState<DriverKycRecord[]>([
    {
      id: 'kyc-701',
      driverId: 'drv-101',
      fullName: 'كابتن حيدر عبد الرضا الكربلائي',
      primaryPhone: '07704829184',
      emergencyPhone: '07804829111',
      residentialDistrict: 'حي الموظفين - كربلاء',
      vehicleLabel: 'هيونداي ستاركس H1 - أبيض لؤلؤي',
      vehicleType: 'starex_van',
      manufactureYear: 2023,
      maxCapacity: 10,
      nationalIdNumber: '198614029381',
      drivingLicenseNumber: 'KRB-2024-88412',
      vehicleRegistrationNumber: 'SNW-9928174',
      nationalIdFrontPath: 'driver_kyc_documents/drv-101/national_id_front.jpg',
      drivingLicensePath: 'driver_kyc_documents/drv-101/driving_license.jpg',
      vehicleRegistrationPath: 'driver_kyc_documents/drv-101/annual_registration.jpg',
      exteriorPhotoPath: 'driver_kyc_documents/drv-101/exterior_starex.jpg',
      interiorPhotoPath: 'driver_kyc_documents/drv-101/interior_seats.jpg',
      verificationStatus: 'approved',
      submittedAt: '2026-11-10 09:15',
    },
    {
      id: 'kyc-702',
      driverId: 'drv-205',
      fullName: 'كابتن وسام رحيم الحسيني',
      primaryPhone: '07815543210',
      emergencyPhone: '07715543299',
      residentialDistrict: 'حي العباس - كربلاء',
      vehicleLabel: 'كيا سورينتو 2024 - فضي',
      vehicleType: 'suv',
      manufactureYear: 2024,
      maxCapacity: 6,
      nationalIdNumber: '199023841102',
      drivingLicenseNumber: 'KRB-2025-19204',
      vehicleRegistrationNumber: 'SNW-4410928',
      nationalIdFrontPath: 'driver_kyc_documents/drv-205/national_id_front.jpg',
      drivingLicensePath: 'driver_kyc_documents/drv-205/driving_license.jpg',
      vehicleRegistrationPath: 'driver_kyc_documents/drv-205/annual_registration.jpg',
      exteriorPhotoPath: 'driver_kyc_documents/drv-205/exterior_sorento.jpg',
      interiorPhotoPath: 'driver_kyc_documents/drv-205/interior_sorento.jpg',
      verificationStatus: 'pending',
      submittedAt: '2026-11-15 08:20',
    },
  ]);

  const [newDriverForm, setNewDriverForm] = useState({
    fullName: '',
    primaryPhone: '',
    emergencyPhone: '',
    residentialDistrict: 'حي الهادي',
    vehicleType: 'starex_van' as VehicleType,
    brandModel: 'هيونداي ستاركس H1',
    manufactureYear: 2023,
    color: 'أبيض',
    plateNumber: '',
    acStatus: 'تبريد مركزي ممتاز (قطعتان)',
    maxCapacity: 10,
    preferredDistricts: 'حي الهادي، حي الحسين، حي الموظفين',
    targetEducation: 'high_school' as EducationLevel,
    targetGender: 'mixed' as GenderPreference,
    nationalIdNumber: '',
    drivingLicenseNumber: '',
    vehicleRegistrationNumber: '',
  });

  // -----------------------------------------------------------------------------------
  // محاكاة انزلاق السيارة بنعومة فائقة على الخريطة (Smooth Marker Interpolation)
  // -----------------------------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setFleetVehicles((prev) =>
        prev.map((v) => {
          if (v.operationalState === 'arrived_at_school' || v.operationalState === 'stopped') {
            return v;
          }
          const deltaLat = (v.targetLat - v.lat) * 0.08;
          const deltaLng = (v.targetLng - v.lng) * 0.08;
          const nextDistance = Math.max(80, Math.round(v.distanceToHomeMeters - 18));
          return {
            ...v,
            lat: Number((v.lat + deltaLat).toFixed(5)),
            lng: Number((v.lng + deltaLng).toFixed(5)),
            distanceToHomeMeters: nextDistance,
          };
        })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const showNotice = (msg: string) => {
    setToastMessage(msg);
  };

  // -----------------------------------------------------------------------------------
  // دوال دورة الإشعارات العمياء (Blind Matching Actions)
  // -----------------------------------------------------------------------------------

  // 1. موافقة السائق المبدئية دون رؤية هوية الطالب
  const handleDriverInitialApprove = (matchId: string) => {
    setMatchNotifications((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, status: 'offered_to_student' }
          : m
      )
    );
    showNotice(
      'تمت الموافقة المبدئية على طلب الخط (مع بقاء هوية الطالب محجوبة). تم إرسال عرض المركبة والتسعيرة لولي الأمر للتثبيت.'
    );
  };

  // 2. اعتذار السائق عن الطلب
  const handleDriverPass = (matchId: string) => {
    setMatchNotifications((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, status: 'rejected_re_search' }
          : m
      )
    );
    showNotice('تم تجاوز الطلب، وسيقوم محرك المطابقة الجغرافي بالبحث عن مركبة أخرى.');
  };

  // 3. موافقة الطالب/ولي الأمر وتثبيت الخط (تحديث المقاعد + كشف الهوية عند اكتمال العدد)
  const handleStudentConfirmLine = (matchId: string) => {
    setMatchNotifications((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const newOccupied = Math.min(m.maxCapacity, m.currentOccupied + m.studentsCount);
        const contractReady = newOccupied >= m.maxCapacity;
        return {
          ...m,
          currentOccupied: newOccupied,
          status: contractReady ? 'active_contract' : 'student_confirmed',
          isContactUnmasked: true,
        };
      })
    );
    showNotice(
      'تم تثبيت الخط بنجاح! تم تحديث المقاعد المحجوزة تلقائياً وتفعيل العقد الشهري وكشف بيانات التواصل المباشر.'
    );
  };

  // 4. رفض الطالب للعرض وإعادة البحث في المحرك الجغرافي
  const handleStudentRejectAndResearh = (matchId: string) => {
    setMatchNotifications((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'pending_driver',
              driverRating: 4.98,
              vehicleBrandModel: 'شيفروليه تاهو LTZ (تبريد مركزي)',
              vehicleModelYear: 2024,
              currentOccupied: 4,
              maxCapacity: 6,
              estimatedMonthlyCostIqd: 160000,
              isContactUnmasked: false,
            }
          : m
      )
    );
    showNotice('تم تجاوز العرض الحالي وإعادة حسابك فوراً إلى محرك البحث الجغرافي لإيجاد سائق بديل.');
  };

  // 5. إرسال طلب خط جديد من بوابة الطالب/ولي الأمر
  const handleCreateStudentLineRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentForm.primaryPhone.trim() === parentForm.emergencyBackupPhone.trim()) {
      showNotice('تنبيه أمني: يجب أن يكون رقم الهاتف البديل للطوارئ مختلفاً عن رقم الهاتف الأساسي.');
      return;
    }
    const inst =
      IRAQ_INSTITUTIONS.find((i) => i.id === parentForm.selectedInstitutionId) ||
      IRAQ_INSTITUTIONS[0];

    const actualDaysFactor = parentForm.studyDays.length / 5;
    const baseSeatPrice = 75000;
    const calculatedCost = Math.round(
      baseSeatPrice * parentForm.studentsCount * actualDaysFactor
    );

    const newMatch: BlindMatchNotificationItem = {
      id: `match-${Date.now()}`,
      requestId: `req-${Date.now()}`,
      vehicleId: 'veh-101',
      driverId: 'drv-101',
      parentStudentId: 'stu-current',
      homeDistrict: parentForm.homeDistrict,
      exactHomeAddress: `${parentForm.homeDistrict} - ${parentForm.homeDetailedAddress} (${parentForm.homeLat.toFixed(4)}, ${parentForm.homeLng.toFixed(4)})`,
      studentFullName: parentForm.parentOrStudentName,
      parentPrimaryPhone: parentForm.primaryPhone,
      parentEmergencyPhone: parentForm.emergencyBackupPhone,
      institutionName: inst.name,
      studentsCount: parentForm.studentsCount,
      studyDays: parentForm.studyDays,
      morningTime: parentForm.morningTime,
      returnTime: parentForm.returnTime,
      vehicleBrandModel: 'هيونداي ستاركس H1 (تبريد مركزي)',
      vehicleType: (parentForm.optionalVehicleType || 'starex_van') as VehicleType,
      vehicleModelYear: Number(parentForm.optionalMinModelYear) || 2023,
      driverRating: 4.95,
      currentOccupied: 8,
      maxCapacity: 10,
      estimatedMonthlyCostIqd: calculatedCost,
      status: 'pending_driver',
      isContactUnmasked: false,
    };

    setMatchNotifications((prev) => [newMatch, ...prev]);
    showNotice(
      'تم تسجيل طلب الخط بنجاح! أرسل محرك المطابقة الجغرافي (PostGIS) إشعاراً أعمى للسائقين المطابقين في منطقتك بدون كشف بياناتك الشخصية.'
    );
  };

  // 6. إرسال مستمسكات السائق السرية للأدمن
  const handleDriverRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdRecord: DriverKycRecord = {
      id: `kyc-${Date.now()}`,
      driverId: `drv-${Date.now()}`,
      fullName: newDriverForm.fullName || 'كابتن جديد قيد التدقيق',
      primaryPhone: newDriverForm.primaryPhone || '07709998877',
      emergencyPhone: newDriverForm.emergencyPhone || '07809998877',
      residentialDistrict: newDriverForm.residentialDistrict,
      vehicleLabel: `${newDriverForm.brandModel} (${newDriverForm.color})`,
      vehicleType: newDriverForm.vehicleType,
      manufactureYear: Number(newDriverForm.manufactureYear),
      maxCapacity: Number(newDriverForm.maxCapacity),
      nationalIdNumber: newDriverForm.nationalIdNumber || '198810928374',
      drivingLicenseNumber: newDriverForm.drivingLicenseNumber || 'KRB-2026-55120',
      vehicleRegistrationNumber: newDriverForm.vehicleRegistrationNumber || 'SNW-8821900',
      nationalIdFrontPath: 'driver_kyc_documents/encrypted/national_id_front.jpg',
      drivingLicensePath: 'driver_kyc_documents/encrypted/driving_license.jpg',
      vehicleRegistrationPath: 'driver_kyc_documents/encrypted/vehicle_registration.jpg',
      exteriorPhotoPath: 'driver_kyc_documents/encrypted/exterior_photo.jpg',
      interiorPhotoPath: 'driver_kyc_documents/encrypted/interior_photo.jpg',
      verificationStatus: 'pending',
      submittedAt: 'الآن (مخزن مشفر خاص بالأدمن)',
    };
    setDriverKycList((prev) => [createdRecord, ...prev]);
    showNotice(
      'تم تشفير ورفع المستمسكات الرسمية إلى الحافظة السرية (driver_kyc_documents). لا يمكن لأي طالب أو مستخدم الاطلاع عليها سوى إدارة الشركة.'
    );
  };

  // حساب أيام التوصيل الفعلية في الشهر للطالب حسب مصفوفة الدوام (Schedule Matrix)
  const monthlyActualDeliveryDays = useMemo(() => {
    return parentForm.studyDays.length * 4;
  }, [parentForm.studyDays]);

  return (
    <div dir="rtl" className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] font-sans transition-colors duration-300">
        {/* ===========================================================================
            شريط التنقل العلوي الموحد (Top Optical Navigation Bar - 8pt Grid Aligned)
           =========================================================================== */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#111827]/90 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            {/* الشعار والهوية */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-xl shadow-ambient-brand">
                خ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight">
                    خطي | KHATTI IRAQ
                  </span>
                  <StatusBadge tone="emerald">PostGIS + Traccar Live</StatusBadge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  النظام الذكي لإدارة خطوط النقل الدراسي الشهري للمدارس والجامعات
                </p>
              </div>
            </div>

            {/* أزرار التبديل بين البوابات الثلاث + صفحة الهبوط */}
            <nav className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActivePortal('landing')}
                className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activePortal === 'landing'
                    ? 'bg-[#2563EB] text-white shadow-ambient-brand'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                الرئيسية والمعمارية
              </button>
              <button
                onClick={() => setActivePortal('student_parent')}
                className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activePortal === 'student_parent'
                    ? 'bg-[#2563EB] text-white shadow-ambient-brand'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                بوابة الطالب / ولي الأمر
              </button>
              <button
                onClick={() => setActivePortal('driver')}
                className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activePortal === 'driver'
                    ? 'bg-[#2563EB] text-white shadow-ambient-brand'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                بوابة السائق والوثائق
              </button>
              <button
                onClick={() => setActivePortal('admin')}
                className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activePortal === 'admin'
                    ? 'bg-[#2563EB] text-white shadow-ambient-brand'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                غرفة القيادة الحية (Admin)
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="min-h-[48px] px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold border border-slate-300 dark:border-slate-700"
                title="تبديل الوضع النهاري / الليلي (60-30-10 Optical Contrast)"
              >
                {darkMode ? '☀️ نهاري (#F8FAFC)' : '🌙 ليلي (#0B0F19)'}
              </button>
            </nav>
          </div>
        </header>

        {/* إشعار عائم فوري (Toast Notification) */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-xl z-50 bg-[#0F172A] text-white border border-emerald-500/50 rounded-xl p-4 shadow-ambient-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-4 h-4 rounded-full bg-[#10B981] shrink-0 animate-pulse" />
              <p className="text-sm font-medium leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="px-2 py-1 text-xs bg-slate-800 rounded-md hover:bg-slate-700"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* المساحة الرئيسية مع التزام صارم بنسبة المساحة البيضاء (Negative Space >= 25%) */}
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
          {/* =========================================================================
              الواجهة 0: شاشة الهبوط والترحيب المعماري (Landing & Onboarding Portal)
             ========================================================================= */}
          {activePortal === 'landing' && (
            <div className="space-y-12">
              <OpticalCard elevated className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="blue">عزل بيانات صارم (RLS & Blind Matching)</StatusBadge>
                      <StatusBadge tone="emerald">تتبع جغرافي حي 60fps عبر شرائح GPS</StatusBadge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">
                      منظومة &laquo;خطي&raquo; لإدارة خطوط النقل الدراسي الشهري في العراق
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      أول منصة هندسية متكاملة تربط أولياء الأمور وطلاب المدارس والجامعات بسائقي
                      الخطوط الموثقين عبر خوارزمية مطابقة جغرافية وزمنية عمياء تحمي خصوصية
                      العائلات ومستمسكات السائقين، مع ربط مباشر بشرائح التتبع الصلبة (Traccar
                      Hardware GPS) والسياج الجغرافي الذكي (500 متر).
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <ErgonomicButton
                        variant="primary"
                        onClick={() => setActivePortal('student_parent')}
                      >
                        احجز مقعد طالب الآن (بوابة ولي الأمر)
                      </ErgonomicButton>
                      <ErgonomicButton
                        variant="safety"
                        onClick={() => setActivePortal('driver')}
                      >
                        سجّل مركبتك كسائق خط (بوابة الكابتن)
                      </ErgonomicButton>
                      <ErgonomicButton
                        variant="secondary"
                        onClick={() => setActivePortal('admin')}
                      >
                        غرفة العمليات المركزية (Admin)
                      </ErgonomicButton>
                    </div>
                  </div>

                  {/* ملخص بصري لدورة الإشعارات العمياء */}
                  <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/90 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      دورة المطابقة العمياء وحماية الخصوصية
                    </h2>
                    <ol className="space-y-4 text-sm">
                      <li className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            مطابقة جغرافية وزمنية (PostGIS)
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            فرز الطلاب المتقاربين سكنياً وفي نفس المدرسة/الجامعة مع تطابق أيام
                            الدوام الفعلي ونوع وموديل السيارة المطلوب.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                          2
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            إشعار مبدئي أعمى للسائق (Privacy First)
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            يرى السائق اسم الحي والمدرسة وأيام الدوام فقط دون اسم الطالب أو رقم
                            هاتفه أو موقع المنزل الدقيق.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                          3
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            تثبيت الخط وكشف الهوية المشروط
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            بعد موافقة الطالب وتثبيت الخط واكتمال العدد، تُكشف أرقام الهواتف
                            وموقع المنزل الدقيق ويُفعّل العقد الشهري.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </OpticalCard>

              {/* بطاقات البوابات الثلاث */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OpticalCard className="space-y-4">
                  <StatusBadge tone="blue">بوابة الطالب / ولي الأمر</StatusBadge>
                  <h3 className="text-lg font-bold">حجز الخط ومصفوفة الدوام والتتبع الحي</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    تحديد موقع المنزل على الخريطة، اختيار أيام الدوام الفعلي لحساب التكلفة
                    العادلة، تحديد نوع وموديل السيارة الاختياري، والاشتراك في خريطة التتبع الحي.
                  </p>
                  <ErgonomicButton
                    variant="primary"
                    fullWidth
                    onClick={() => setActivePortal('student_parent')}
                  >
                    دخول بوابة ولي الأمر
                  </ErgonomicButton>
                </OpticalCard>

                <OpticalCard className="space-y-4">
                  <StatusBadge tone="emerald">بوابة السائق / مالك المركبة</StatusBadge>
                  <h3 className="text-lg font-bold">رفع المستمسكات المشفرة وإدارة المقاعد</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    رفع البطاقة الموحدة وإجازة السوق والسنوية في حافظة مشفرة لا يراها إلا الأدمن،
                    وتحديد سعة المركبة واستقبال إشعارات المطابقة العمياء.
                  </p>
                  <ErgonomicButton
                    variant="safety"
                    fullWidth
                    onClick={() => setActivePortal('driver')}
                  >
                    دخول بوابة السائق
                  </ErgonomicButton>
                </OpticalCard>

                <OpticalCard className="space-y-4">
                  <StatusBadge tone="amber">غرفة عمليات الشركة (Admin)</StatusBadge>
                  <h3 className="text-lg font-bold">مراقبة الأسطول الحية وتوثيق المستمسكات</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    خريطة عمليات حية لجميع المركبات المربوطة بشرائح Traccar GPS، تنبيهات السرعة
                    الزائدة، تدقيق وثائق السائقين، وتجديد العقود الشهرية.
                  </p>
                  <ErgonomicButton
                    variant="secondary"
                    fullWidth
                    onClick={() => setActivePortal('admin')}
                  >
                    فتح غرفة القيادة الحية
                  </ErgonomicButton>
                </OpticalCard>
              </div>
            </div>
          )}

          {/* =========================================================================
              الواجهة 1: بوابة الطالب / ولي الأمر (Student / Parent Portal)
             ========================================================================= */}
          {activePortal === 'student_parent' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold">
                    بوابة الطالب وولي الأمر — حجز الخط الشهري والتتبع الحي
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    بياناتك وأرقام هواتفك وموقع منزلك الدقيق محمية بسياسات RLS ولا تظهر للسائق
                    إلا بعد تثبيت الخط.
                  </p>
                </div>
                <StatusBadge tone="emerald">
                  أيام التوصيل الفعلية شهرياً: {monthlyActualDeliveryDays} يوماً
                </StatusBadge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* العمود الأيمن: نموذج طلب خط جديد (Pin Drop + Schedule Matrix + Filters) */}
                <div className="lg:col-span-7">
                  <OpticalCard elevated className="space-y-6">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-xl font-bold">1. بيانات التسجيل وطلب الخط الشهري</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        جميع الحقول مصممة وفق شبكة 8pt لضمان سهولة الاستخدام على الهاتف والكمبيوتر
                      </p>
                    </div>

                    <form onSubmit={handleCreateStudentLineRequest} className="space-y-6">
                      {/* الاسم وعدد الطلاب */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-sm font-bold">
                            اسم ولي الأمر أو الطالب الكامل *
                          </label>
                          <input
                            type="text"
                            required
                            value={parentForm.parentOrStudentName}
                            onChange={(e) =>
                              setParentForm({ ...parentForm, parentOrStudentName: e.target.value })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">
                            عدد الطلاب ضمن الحساب *
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={8}
                            required
                            value={parentForm.studentsCount}
                            onChange={(e) =>
                              setParentForm({
                                ...parentForm,
                                studentsCount: Number(e.target.value),
                              })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      {/* رقم الهاتف الأساسي + رقم الهاتف البديل الإلزامي للطوارئ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-blue-950 dark:text-blue-200">
                            رقم الهاتف الأساسي (واتساب / اتصال) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={parentForm.primaryPhone}
                            onChange={(e) =>
                              setParentForm({ ...parentForm, primaryPhone: e.target.value })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-red-700 dark:text-red-300">
                            رقم هاتف بديل إلزامي للطوارئ (مختلف عن الأساسي) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={parentForm.emergencyBackupPhone}
                            onChange={(e) =>
                              setParentForm({
                                ...parentForm,
                                emergencyBackupPhone: e.target.value,
                              })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      {/* تحديد الموقع الجغرافي للمنزل (Interactive Pin Drop) والمدرسة/الجامعة */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">
                              الحي السكني (يظهر في الإشعار المبدئي للسائق) *
                            </label>
                            <input
                              type="text"
                              required
                              value={parentForm.homeDistrict}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, homeDistrict: e.target.value })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">
                              العنوان الدقيق (محجوب حتى إتمام التعاقد) *
                            </label>
                            <input
                              type="text"
                              required
                              value={parentForm.homeDetailedAddress}
                              onChange={(e) =>
                                setParentForm({
                                  ...parentForm,
                                  homeDetailedAddress: e.target.value,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        {/* خريطة تحديد موقع المنزل التفاعلية (Pin Drop Map Canvas) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold">
                              تحديد موقع المنزل على الخريطة (Pin Drop - اضغط لتحريك الدبوس)
                            </label>
                            <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                              POINT({parentForm.homeLng.toFixed(4)} {parentForm.homeLat.toFixed(4)})
                            </span>
                          </div>
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const relX = (e.clientX - rect.left) / rect.width;
                              const relY = (e.clientY - rect.top) / rect.height;
                              setParentForm({
                                ...parentForm,
                                homeLat: Number((32.59 + (1 - relY) * 0.05).toFixed(5)),
                                homeLng: Number((44.0 + relX * 0.08).toFixed(5)),
                              });
                            }}
                            className="relative h-48 w-full rounded-xl bg-slate-900 overflow-hidden cursor-crosshair border-2 border-blue-500/40 select-none"
                          >
                            {/* شبكة شوارع هندسية تحاكي خريطة كربلاء */}
                            <div
                              className="absolute inset-0 opacity-25"
                              style={{
                                backgroundImage:
                                  'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                              }}
                            />
                            <div className="absolute top-4 right-4 bg-slate-950/85 text-white px-4 py-2 rounded-lg text-xs border border-slate-700">
                              📍 دبوس المنزل ({parentForm.homeDistrict}) — محمي بـ PostGIS Geography
                            </div>
                            <div
                              style={{
                                left: `${((parentForm.homeLng - 44.0) / 0.08) * 100}%`,
                                top: `${(1 - (parentForm.homeLat - 32.59) / 0.05) * 100}%`,
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                            >
                              <div className="w-10 h-10 rounded-full bg-blue-600/30 animate-ping absolute -inset-1" />
                              <div className="w-8 h-8 rounded-full bg-[#2563EB] border-2 border-white text-white flex items-center justify-center font-bold shadow-lg">
                                🏠
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* المدرسة / الجامعة + المرحلة + الجنس */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">
                              المدرسة / الكلية / الجامعة *
                            </label>
                            <select
                              value={parentForm.selectedInstitutionId}
                              onChange={(e) =>
                                setParentForm({
                                  ...parentForm,
                                  selectedInstitutionId: e.target.value,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            >
                              {IRAQ_INSTITUTIONS.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                  {inst.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">المرحلة الدراسية *</label>
                            <select
                              value={parentForm.educationLevel}
                              onChange={(e) =>
                                setParentForm({
                                  ...parentForm,
                                  educationLevel: e.target.value as EducationLevel,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            >
                              <option value="primary">ابتدائي</option>
                              <option value="middle">متوسط</option>
                              <option value="high_school">إعدادي / ثانوي</option>
                              <option value="university">جامعي / كليات</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">تفضيل الخط (الجنس) *</label>
                            <select
                              value={parentForm.genderPreference}
                              onChange={(e) =>
                                setParentForm({
                                  ...parentForm,
                                  genderPreference: e.target.value as GenderPreference,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            >
                              <option value="male_only">ذكور فقط</option>
                              <option value="female_only">إناث فقط</option>
                              <option value="mixed">مختلط</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 2. مصفوفة جدول الدوام الزمني (Schedule Matrix) */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-bold">
                            2. مصفوفة جدول الدوام الأسبوعي (Schedule Matrix)
                          </h3>
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                            {parentForm.studyDays.length} أيام أسبوعياً = {monthlyActualDeliveryDays}{' '}
                            يوم توصيل فعلي في الشهر
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {WEEKDAYS_AR.map((day) => {
                            const selected = parentForm.studyDays.includes(day.index);
                            return (
                              <button
                                key={day.index}
                                type="button"
                                onClick={() => {
                                  const exists = parentForm.studyDays.includes(day.index);
                                  if (exists && parentForm.studyDays.length === 1) return;
                                  setParentForm({
                                    ...parentForm,
                                    studyDays: exists
                                      ? parentForm.studyDays.filter((d) => d !== day.index)
                                      : [...parentForm.studyDays, day.index].sort(),
                                  });
                                }}
                                className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                  selected
                                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-ambient-brand'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                }`}
                              >
                                {selected ? '✓ ' : ''}
                                {day.full}
                              </button>
                            );
                          })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">
                              وقت الانطلاق الصباحي من المنزل *
                            </label>
                            <input
                              type="time"
                              value={parentForm.morningTime}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, morningTime: e.target.value })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold">
                              وقت العودة بعد انتهاء الدوام *
                            </label>
                            <input
                              type="time"
                              value={parentForm.returnTime}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, returnTime: e.target.value })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. التفضيلات الاختيارية (Optional Filters) + اشتراك الخريطة الحية */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="text-base font-bold">
                          3. الفلاتر الاختيارية للسيارة واشتراك التتبع الحي
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold">
                              نوع السيارة المطلوبة (اختياري)
                            </label>
                            <select
                              value={parentForm.optionalVehicleType}
                              onChange={(e) =>
                                setParentForm({
                                  ...parentForm,
                                  optionalVehicleType: e.target.value as '' | VehicleType,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            >
                              <option value="">أي مركبة حديثة ومكيفة (الافتراضي)</option>
                              <option value="sedan">صالون خصوصي (4 طلاب)</option>
                              <option value="suv">دفع رباعي تاهو / سورينتو (6 طلاب)</option>
                              <option value="starex_van">باص حديث / ستاركس (10 طلاب)</option>
                              <option value="minibus">ميني باص (14 طالباً)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold">
                              الحد الأدنى لموديل السيارة (اختياري)
                            </label>
                            <input
                              type="number"
                              min={2010}
                              max={2027}
                              placeholder="مثلاً: 2020 فما فوق"
                              value={parentForm.optionalMinModelYear}
                              onChange={(e) =>
                                setParentForm({
                                  ...parentForm,
                                  optionalMinModelYear: e.target.value,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                          </div>
                        </div>

                        <label className="flex items-center justify-between gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                          <div>
                            <p className="font-bold text-sm">
                              تفعيل الاشتراك المدفوع في خدمة التتبع الحي بالخرائط (Live GPS Add-on)
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              يفتح خريطة 60fps حية لحركة السيارة على الشارع مع السرعة والوقت المتبقي
                              للوصول (+10,000 د.ع شهرياً)
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={parentForm.hasLiveGpsSubscription}
                            onChange={(e) =>
                              setParentForm({
                                ...parentForm,
                                hasLiveGpsSubscription: e.target.checked,
                              })
                            }
                            className="w-6 h-6 accent-[#2563EB]"
                          />
                        </label>
                      </div>

                      {/* منطقة الإبهام السفلية للموبايل (Thumb Zone CTA >= 48px) */}
                      <ErgonomicButton type="submit" variant="primary" fullWidth>
                        إرسال طلب الخط إلى محرك المطابقة الذكي (Blind Match)
                      </ErgonomicButton>
                    </form>
                  </OpticalCard>
                </div>

                {/* العمود الأيسر: الإشعار التفاعلي للطالب + السياج الجغرافي + الخريطة الحية / شاشة الترقية */}
                <div className="lg:col-span-5 space-y-6">
                  {/* بطاقة عرض الخط المطابق للطالب مع أزرار القرار */}
                  {matchNotifications.map((match) => (
                    <OpticalCard key={match.id} elevated className="space-y-4">
                      <div className="flex items-center justify-between">
                        <StatusBadge
                          tone={
                            match.status === 'active_contract' ||
                            match.status === 'student_confirmed'
                              ? 'emerald'
                              : 'blue'
                          }
                        >
                          {match.status === 'pending_driver' && 'بانتظار موافقة السائق المبدئية'}
                          {match.status === 'offered_to_student' &&
                            'توفّر خط مطابق — بانتظار تثبيتك'}
                          {(match.status === 'student_confirmed' ||
                            match.status === 'active_contract') &&
                            'تم تثبيت الخط وتفعيل العقد الشهري'}
                        </StatusBadge>
                        <span className="text-sm font-bold text-amber-600">
                          ★ {match.driverRating} تقييم الكابتن
                        </span>
                      </div>

                      <h3 className="text-lg font-bold">
                        {match.vehicleBrandModel} — موديل {match.vehicleModelYear}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        المسار: من <strong>{match.homeDistrict}</strong> إلى{' '}
                        <strong>{match.institutionName}</strong>
                      </p>

                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm">
                        <div>
                          <span className="text-xs text-slate-500 block">عدد الركاب الحاليين</span>
                          <span className="font-bold">
                            {match.currentOccupied} من {match.maxCapacity} مقاعد
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block">
                            التكلفة الشهرية التقديرية
                          </span>
                          <span className="font-bold text-[#065F46] dark:text-emerald-400">
                            {match.estimatedMonthlyCostIqd.toLocaleString()} د.ع / شهرياً
                          </span>
                        </div>
                      </div>

                      {/* حالة حجب أو كشف الهوية */}
                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-xs space-y-1">
                        {match.isContactUnmasked ? (
                          <>
                            <p className="font-bold text-emerald-700 dark:text-emerald-400">
                              🔓 تم إتمام التعاقد وكشف بيانات السائق المعتمدة:
                            </p>
                            <p>اسم السائق: كابتن حيدر عبد الرضا الكربلائي</p>
                            <p>رقم هاتف السائق: 07704829184 | اللوحة: كربلاء 48291 أ</p>
                          </>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-400">
                            🔒 الخصوصية مفعلة: لا يرى السائق اسمك أو رقم هاتفك أو عنوان منزلك الدقيق
                            إلا بعد ضغطك على &laquo;موافق وتثبيت الخط&raquo;.
                          </p>
                        )}
                      </div>

                      {/* أزرار القرار الحاسمة للطالب / ولي الأمر (Thumb-Zone >= 48px) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <ErgonomicButton
                          variant="safety"
                          onClick={() => handleStudentConfirmLine(match.id)}
                          disabled={
                            match.status === 'student_confirmed' ||
                            match.status === 'active_contract'
                          }
                        >
                          موافق وتثبيت الخط
                        </ErgonomicButton>
                        <ErgonomicButton
                          variant="secondary"
                          onClick={() => handleStudentRejectAndResearh(match.id)}
                        >
                          تجاوز / ابحث مجدداً
                        </ErgonomicButton>
                      </div>
                    </OpticalCard>
                  ))}

                  {/* إشعارات السياج الجغرافي الذكي التلقائية (Geofencing 500m & School Arrival) */}
                  <OpticalCard className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold">
                        إشعارات السياج الجغرافي الذكي (Geofencing)
                      </h3>
                      <StatusBadge tone="emerald">تلقائي مجاناً</StatusBadge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                        <p className="font-bold text-amber-950 dark:text-amber-200">
                          🔔 السيارة تقترب من المنزل الآن (على بعد{' '}
                          {fleetVehicles[0].distanceToHomeMeters} متر)
                        </p>
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                          تنبيه تلقائي عبر PostGIS ST_Distance عند دخول المركبة نطاق 500 متر.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <p className="font-bold text-[#065F46] dark:text-emerald-200">
                          ✅ وصل الطالب بسلام إلى ثانوية المتميزين - كربلاء (07:42 ص)
                        </p>
                      </div>
                    </div>
                  </OpticalCard>

                  {/* نظام صلاحيات الخريطة لولي الأمر (Paid Add-on vs Text-Only State) */}
                  <OpticalCard elevated className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold">
                        التتبع الحي لمركبة الخط (Hardware GPS Tracker)
                      </h3>
                      <StatusBadge tone={parentForm.hasLiveGpsSubscription ? 'emerald' : 'slate'}>
                        {parentForm.hasLiveGpsSubscription ? 'باقة التتبع مفعلة' : 'الحالة النصية فقط'}
                      </StatusBadge>
                    </div>

                    {!parentForm.hasLiveGpsSubscription ? (
                      /* شاشة غير المشترك: حالة النص فقط + دعوة أنيقة للترقية */
                      <div className="p-6 rounded-xl bg-slate-900 text-white space-y-4 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">الحالة النصية الحالية للخط:</span>
                          <span className="px-4 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                            السائق في الطريق • ETA {fleetVehicles[0].etaMinutes} دقائق
                          </span>
                        </div>
                        <div className="border-t border-slate-800 pt-4 space-y-4">
                          <h4 className="text-base font-bold">
                            افتح الخريطة الحية فائقة السلاسة (60fps Live Map)
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            شاهد تحرك سيارة الخط على الشارع لحظة بلحظة عبر شريحة الـ GPS المزروعة في
                            السيارة مع السرعة الحالية والوقت المتبقي للوصول.
                          </p>
                          <ErgonomicButton
                            variant="primary"
                            fullWidth
                            onClick={() => {
                              setParentForm({ ...parentForm, hasLiveGpsSubscription: true });
                              showNotice(
                                'تم تفعيل اشتراك التتبع الحي بالخرائط (parent_map_subscriptions)! سمحت سياسة RLS الآن بقراءة إحداثيات gps_trackers.'
                              );
                            }}
                          >
                            ترقية وتفعيل الخريطة الحية الآن (10,000 د.ع / شهرياً)
                          </ErgonomicButton>
                        </div>
                      </div>
                    ) : (
                      /* شاشة المشترك: خريطة حية فائقة السلاسة 60fps مع Smooth Marker Interpolation */
                      <div className="space-y-4">
                        <div className="relative h-64 rounded-xl bg-[#0B0F19] border border-blue-500/40 overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)',
                              backgroundSize: '24px 24px',
                            }}
                          />
                          {/* مسار الخط */}
                          <svg className="absolute inset-0 w-full h-full">
                            <line
                              x1="22%"
                              y1="72%"
                              x2="78%"
                              y2="28%"
                              stroke="#2563EB"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                            />
                          </svg>

                          {/* موقع المنزل */}
                          <div className="absolute left-[20%] top-[68%] text-xs bg-slate-900/90 text-white px-2 py-1 rounded border border-slate-700">
                            🏠 المنزل ({parentForm.homeDistrict})
                          </div>

                          {/* موقع المدرسة */}
                          <div className="absolute right-[12%] top-[18%] text-xs bg-emerald-950/90 text-emerald-200 px-2 py-1 rounded border border-emerald-700">
                            🎓 {fleetVehicles[0].institutionName}
                          </div>

                          {/* أيقونة السيارة المتحركة بانسيابية (Smooth Gliding Marker) */}
                          <div
                            style={{
                              left: `${45 + ((fleetVehicles[0].lng - 44.03) * 400) % 30}%`,
                              top: `${50 - ((fleetVehicles[0].lat - 32.60) * 400) % 25}%`,
                            }}
                            className="absolute transition-all duration-1000 ease-gps-glide"
                          >
                            <div className="px-4 py-1 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-ambient-brand flex items-center gap-2">
                              <span>🚐</span>
                              <span>{fleetVehicles[0].speedKmh} كم/س</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <span className="text-slate-500 block">السرعة الحالية</span>
                            <span className="font-bold text-sm">
                              {fleetVehicles[0].speedKmh} كم/س
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <span className="text-slate-500 block">الوقت المتبقي (ETA)</span>
                            <span className="font-bold text-sm text-blue-600">
                              {fleetVehicles[0].etaMinutes} دقائق
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <span className="text-slate-500 block">معرف الشريحة IMEI</span>
                            <span className="font-mono font-bold">
                              ...{fleetVehicles[0].imei.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </OpticalCard>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              الواجهة 2: بوابة السائق / مالك المركبة (Driver Registration & Blind Match)
             ========================================================================= */}
          {activePortal === 'driver' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold">
                    بوابة الكابتن / مالك المركبة — الوثائق المشفرة وإدارة الخط
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    جميع وثائقك الرسمية تُحفظ في حافظة مشفرة (driver_kyc_documents) ولا يراها أي
                    طالب أو ولي أمر إطلاقاً — يطلع عليها الأدمن فقط للتوثيق.
                  </p>
                </div>
                <StatusBadge tone="blue">حماية RLS للوثائق السرية مفعلة</StatusBadge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* العمود الأيمن: إشعارات المطابقة العمياء الواردة للسائق */}
                <div className="lg:col-span-5 space-y-6">
                  <OpticalCard elevated className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">
                        إشعارات المطابقة العمياء (Blind Match Requests)
                      </h2>
                      <StatusBadge tone="amber">Privacy First</StatusBadge>
                    </div>

                    {matchNotifications.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
                      >
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-sm leading-relaxed">
                          &laquo;يوجد طالب (عدد: <strong>{item.studentsCount}</strong>) من منطقة [
                          <strong>{item.homeDistrict}</strong>] إلى [
                          <strong>{item.institutionName}</strong>]، أيام الدوام الأسبوعية [
                          <strong>{item.studyDays.length} أيام</strong>: الذهاب {item.morningTime}{' '}
                          والعودة {item.returnTime}]، هل توافق مبدئياً ليقوم النظام بالبحث عن باقي
                          الركاب لإكمال الطاقة الاستيعابية لسيارتك؟&raquo;
                        </div>

                        {/* عرض حالة حجب أو كشف بيانات الطالب للسائق */}
                        {item.isContactUnmasked ? (
                          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
                            <p className="font-bold text-[#065F46] dark:text-emerald-300">
                              ✅ اكتمل التثبيت — تم كشف بيانات الطالب وولي الأمر:
                            </p>
                            <p>الاسم الكامل: {item.studentFullName}</p>
                            <p>هاتف ولي الأمر الأساسي: {item.parentPrimaryPhone}</p>
                            <p>هاتف الطوارئ البديل: {item.parentEmergencyPhone}</p>
                            <p>الموقع الدقيق للمنزل: {item.exactHomeAddress}</p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                            🔒 اسم الطالب، أرقام الهواتف، والموقع الدقيق للمنزل محجوبة تلقائياً حتى
                            يثبت الطالب الخط ويكتمل نصاب المركبة.
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <ErgonomicButton
                            variant="safety"
                            onClick={() => handleDriverInitialApprove(item.id)}
                            disabled={item.status !== 'pending_driver'}
                          >
                            موافق مبدئياً - ابحث عن البقية
                          </ErgonomicButton>
                          <ErgonomicButton
                            variant="secondary"
                            onClick={() => handleDriverPass(item.id)}
                          >
                            اعتذار / تجاوز
                          </ErgonomicButton>
                        </div>
                      </div>
                    ))}
                  </OpticalCard>
                </div>

                {/* العمود الأيسر: تسجيل السائق والوثائق السرية ومواصفات المركبة */}
                <div className="lg:col-span-7">
                  <OpticalCard elevated className="space-y-6">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-xl font-bold">
                        نموذج تسجيل السائق والوثائق السرية (Admin-Only Visibility)
                      </h2>
                      <p className="text-xs text-slate-500">
                        تُرفع المستمسكات في حافظة Supabase Storage خاصة ومشفرة مع سياسة RLS تمنع
                        الطلاب والسائقين الآخرين من الوصول إليها.
                      </p>
                    </div>

                    <form onSubmit={handleDriverRegistrationSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">الاسم الكامل للسائق *</label>
                          <input
                            type="text"
                            required
                            placeholder="الاسم الرباعي واللقب"
                            value={newDriverForm.fullName}
                            onChange={(e) =>
                              setNewDriverForm({ ...newDriverForm, fullName: e.target.value })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">رقم الهاتف الأساسي *</label>
                          <input
                            type="tel"
                            required
                            placeholder="0770XXXXXXX"
                            value={newDriverForm.primaryPhone}
                            onChange={(e) =>
                              setNewDriverForm({ ...newDriverForm, primaryPhone: e.target.value })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">رقم الهاتف البديل *</label>
                          <input
                            type="tel"
                            required
                            placeholder="0780XXXXXXX"
                            value={newDriverForm.emergencyPhone}
                            onChange={(e) =>
                              setNewDriverForm({ ...newDriverForm, emergencyPhone: e.target.value })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      {/* المستمسكات السرية الأربعة */}
                      <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                            🔒 الوثائق الرسمية السرية (لا يراها إلا الأدمن وكادر الشركة حصراً)
                          </h3>
                          <StatusBadge tone="amber">Private Storage Bucket</StatusBadge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold">
                              رقم البطاقة الوطنية الموحدة *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="19XXXXXXXXXX"
                              value={newDriverForm.nationalIdNumber}
                              onChange={(e) =>
                                setNewDriverForm({
                                  ...newDriverForm,
                                  nationalIdNumber: e.target.value,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold">رقم إجازة السوق *</label>
                            <input
                              type="text"
                              required
                              placeholder="KRB-2026-XXXX"
                              value={newDriverForm.drivingLicenseNumber}
                              onChange={(e) =>
                                setNewDriverForm({
                                  ...newDriverForm,
                                  drivingLicenseNumber: e.target.value,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold">رقم سنوية السيارة *</label>
                            <input
                              type="text"
                              required
                              placeholder="SNW-XXXXXXX"
                              value={newDriverForm.vehicleRegistrationNumber}
                              onChange={(e) =>
                                setNewDriverForm({
                                  ...newDriverForm,
                                  vehicleRegistrationNumber: e.target.value,
                                })
                              }
                              className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-4 rounded-lg border border-dashed border-slate-400 bg-white dark:bg-slate-900">
                            🪪 صورة البطاقة الموحدة + إجازة السوق + السنوية (مشفرة PDF/JPG)
                          </div>
                          <div className="p-4 rounded-lg border border-dashed border-slate-400 bg-white dark:bg-slate-900">
                            📸 صور المركبة من الداخل والخارج (للتحقق من نظافة المقاعد والتبريد)
                          </div>
                        </div>
                      </div>

                      {/* مواصفات المركبة والخط */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">نوع المركبة *</label>
                          <select
                            value={newDriverForm.vehicleType}
                            onChange={(e) => {
                              const vt = e.target.value as VehicleType;
                              setNewDriverForm({
                                ...newDriverForm,
                                vehicleType: vt,
                                maxCapacity: VEHICLE_TYPE_LABELS[vt].defaultSeats,
                              });
                            }}
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          >
                            {Object.entries(VEHICLE_TYPE_LABELS).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">الموديل (سنة الصنع) *</label>
                          <input
                            type="number"
                            min={2010}
                            max={2027}
                            value={newDriverForm.manufactureYear}
                            onChange={(e) =>
                              setNewDriverForm({
                                ...newDriverForm,
                                manufactureYear: Number(e.target.value),
                              })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold">
                            السعة القصوى للركاب (مقاعد) *
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={newDriverForm.maxCapacity}
                            onChange={(e) =>
                              setNewDriverForm({
                                ...newDriverForm,
                                maxCapacity: Number(e.target.value),
                              })
                            }
                            className="w-full min-h-[48px] px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      <ErgonomicButton type="submit" variant="primary" fullWidth>
                        رفع الوثائق السرية وتسجيل المركبة في النظام
                      </ErgonomicButton>
                    </form>
                  </OpticalCard>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              الواجهة 3: لوحة القيادة والتحكم للشركة (Admin & Fleet Command Center)
             ========================================================================= */}
          {activePortal === 'admin' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold">
                    غرفة العمليات المركزية ومراقبة الأسطول (Admin & Fleet Command Center)
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    وصول كامل غير مقيد لخريطة تتبع جميع المركبات (Traccar GPS WebSockets) ومستمسكات
                    السائقين المشفرة وإدارة العقود الشهرية.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone="emerald">3 مركبات متصلة حياً</StatusBadge>
                  <StatusBadge tone="crimson">1 تنبيه سرعة زائدة</StatusBadge>
                </div>
              </div>

              {/* 1. شاشة المراقبة الحية للأسطول (Live Operations Room Map) */}
              <OpticalCard elevated className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-xl font-bold">
                    خريطة العمليات الحية (Live Fleet Telemetry — 60fps Smooth Interpolation)
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    WebSocket: wss://traccar.khatti-iq.com/api/socket | Supabase Realtime: Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* الخريطة التفاعلية العريضة */}
                  <div className="lg:col-span-8 relative h-96 rounded-xl bg-[#0B0F19] border border-slate-800 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                      }}
                    />
                    {fleetVehicles.map((v, idx) => {
                      const leftPct = 18 + idx * 28;
                      const topPct = 25 + ((idx * 22) % 55);
                      const badgeColor =
                        v.operationalState === 'overspeed_alert'
                          ? 'bg-red-600'
                          : v.operationalState === 'arrived_at_school'
                          ? 'bg-emerald-600'
                          : 'bg-[#2563EB]';
                      return (
                        <div
                          key={v.id}
                          style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                          className="absolute transition-all duration-1000 ease-gps-glide"
                        >
                          <div
                            className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-lg ${badgeColor} space-y-1`}
                          >
                            <div className="flex items-center gap-2">
                              <span>🚐 {v.vehicleLabel}</span>
                              <span>({v.speedKmh} كم/س)</span>
                            </div>
                            <div className="text-[11px] opacity-90">
                              {v.institutionName} • المقاعد: {v.currentOccupied}/{v.maxCapacity}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* قائمة حالات المركبات الحية */}
                  <div className="lg:col-span-4 space-y-4">
                    {fleetVehicles.map((v) => (
                      <div
                        key={v.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{v.driverName}</span>
                          {v.operationalState === 'en_route' && (
                            <StatusBadge tone="blue">في الطريق ({v.speedKmh} كم/س)</StatusBadge>
                          )}
                          {v.operationalState === 'arrived_at_school' && (
                            <StatusBadge tone="emerald">وصلت للمدرسة</StatusBadge>
                          )}
                          {v.operationalState === 'overspeed_alert' && (
                            <StatusBadge tone="crimson">
                              تنبيه سرعة ({v.speedKmh} كم/س)
                            </StatusBadge>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {v.vehicleLabel} ({v.modelYear}) | اللوحة: {v.plateNumber}
                        </p>
                        <p className="text-xs font-mono text-slate-500">
                          IMEI: {v.imei} | الإحداثيات: {v.lat}, {v.lng}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </OpticalCard>

              {/* 2. قسم تدقيق المستمسكات السرية للسائقين (driver_private_docs Admin-Only Review) */}
              <OpticalCard elevated className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      مراجعة وتوثيق مستمسكات السائقين السرية (driver_private_docs)
                    </h2>
                    <p className="text-xs text-slate-500">
                      هذه البيانات والصور محجوبة تماماً عن الطلاب والسائقين الآخرين بموجب سياسة
                      driver_docs_admin_only_select
                    </p>
                  </div>
                  <StatusBadge tone="blue">صلاحية الأدمن الحصرية</StatusBadge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900">
                        <th className="p-4 font-bold">اسم السائق والهواتف</th>
                        <th className="p-4 font-bold">المركبة والسعة</th>
                        <th className="p-4 font-bold">أرقام الوثائق الرسمية</th>
                        <th className="p-4 font-bold">ملفات الحافظة السرية</th>
                        <th className="p-4 font-bold">الحالة والقرار</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {driverKycList.map((doc) => (
                        <tr key={doc.id}>
                          <td className="p-4">
                            <p className="font-bold">{doc.fullName}</p>
                            <p className="text-xs text-slate-500">
                              أساسي: {doc.primaryPhone} | بديل: {doc.emergencyPhone}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold">
                              {doc.vehicleLabel} ({doc.manufactureYear})
                            </p>
                            <p className="text-xs text-slate-500">
                              السعة القصوى: {doc.maxCapacity} ركاب | {doc.residentialDistrict}
                            </p>
                          </td>
                          <td className="p-4 text-xs font-mono space-y-1">
                            <p>البطاقة الموحدة: {doc.nationalIdNumber}</p>
                            <p>إجازة السوق: {doc.drivingLicenseNumber}</p>
                            <p>السنوية: {doc.vehicleRegistrationNumber}</p>
                          </td>
                          <td className="p-4 text-xs">
                            <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                              {doc.nationalIdFrontPath}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {doc.verificationStatus === 'approved' ? (
                                <StatusBadge tone="emerald">موثّق ومعتمد</StatusBadge>
                              ) : (
                                <ErgonomicButton
                                  variant="safety"
                                  onClick={() => {
                                    setDriverKycList((prev) =>
                                      prev.map((d) =>
                                        d.id === doc.id
                                          ? { ...d, verificationStatus: 'approved' }
                                          : d
                                      )
                                    );
                                    showNotice(
                                      `تم توثيق حساب ${doc.fullName} واعتماد مستمسكاته السرية.`
                                    );
                                  }}
                                >
                                  اعتماد وتوثيق
                                </ErgonomicButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </OpticalCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
