-- =====================================================================================
-- نظام "خطي" (Khatti) لإدارة خطوط النقل الدراسي الشهري في العراق (المدارس والجامعات)
-- SUPABASE ONE-CLICK PRODUCTION-READY & IDEMPOTENT SQL MIGRATION SCRIPT
-- Architect: Principal Full-Stack & Geo-Spatial Systems Architecture
-- Database: PostgreSQL 15+ / Supabase (PostGIS + Auth + Storage + RLS + Realtime)
-- =====================================================================================

BEGIN;

-- =====================================================================================
-- 1. تفعيل الإضافات الأساسية والجغرافية (EXTENSIONS)
-- =====================================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================================================
-- 2. الأنواع المخصصة (CUSTOM ENUM TYPES - IDEMPOTENT)
-- =====================================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM (
            'admin',
            'driver',
            'student_parent'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'education_level') THEN
        CREATE TYPE public.education_level AS ENUM (
            'primary',
            'middle',
            'high_school',
            'university'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_preference') THEN
        CREATE TYPE public.gender_preference AS ENUM (
            'male_only',
            'female_only',
            'mixed'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
        CREATE TYPE public.vehicle_type AS ENUM (
            'sedan',
            'suv',
            'starex_van',
            'minibus',
            'coaster'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status') THEN
        CREATE TYPE public.match_status AS ENUM (
            'pending_driver',
            'driver_accepted_searching_more',
            'offered_to_student',
            'student_confirmed',
            'rejected_re_search',
            'active_contract'
        );
    END IF;
END $$;

-- =====================================================================================
-- 3. الجداول الأساسية (CORE TABLES)
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 3.1 جدول الملفات الشخصية (profiles) - مرتبط تلقائياً مع auth.users
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 3),
    role public.user_role NOT NULL DEFAULT 'student_parent',
    primary_phone TEXT NOT NULL CHECK (primary_phone ~ '^\+?[0-9]{10,15}$'),
    emergency_backup_phone TEXT NOT NULL CHECK (emergency_backup_phone ~ '^\+?[0-9]{10,15}$'),
    avatar_url TEXT,
    governorate TEXT NOT NULL DEFAULT 'كربلاء المقدسة',
    residential_district TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    fcm_onesignal_player_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_distinct_emergency_phone CHECK (primary_phone <> emergency_backup_phone)
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_governorate ON public.profiles(governorate);

-- -------------------------------------------------------------------------------------
-- 3.2 جدول الوثائق السرية للسائق (driver_private_docs) - معزول للأدمن حصراً
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.driver_private_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    national_id_number TEXT NOT NULL,
    national_id_front_path TEXT NOT NULL,
    national_id_back_path TEXT NOT NULL,
    driving_license_number TEXT NOT NULL,
    driving_license_path TEXT NOT NULL,
    vehicle_registration_number TEXT NOT NULL,
    vehicle_registration_path TEXT NOT NULL,
    residence_card_path TEXT,
    vehicle_exterior_photos TEXT[] NOT NULL DEFAULT '{}',
    vehicle_interior_photos TEXT[] NOT NULL DEFAULT '{}',
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    reviewed_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_private_docs_status ON public.driver_private_docs(verification_status);

-- -------------------------------------------------------------------------------------
-- 3.3 جدول المركبات وخصائص الخط (vehicles)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_type public.vehicle_type NOT NULL,
    brand_make TEXT NOT NULL,
    model_name TEXT NOT NULL,
    manufacture_year INT NOT NULL CHECK (manufacture_year BETWEEN 2005 AND 2030),
    color TEXT NOT NULL,
    plate_number TEXT NOT NULL UNIQUE,
    cooling_ac_status TEXT NOT NULL DEFAULT 'excellent_dual_ac' CHECK (cooling_ac_status IN ('excellent_dual_ac', 'working_standard_ac', 'no_ac')),
    max_capacity INT NOT NULL CHECK (max_capacity BETWEEN 1 AND 35),
    current_occupied INT NOT NULL DEFAULT 0 CHECK (current_occupied >= 0 AND current_occupied <= max_capacity),
    base_location GEOGRAPHY(POINT, 4326) NOT NULL,
    service_radius_meters INT NOT NULL DEFAULT 6000 CHECK (service_radius_meters BETWEEN 500 AND 50000),
    preferred_districts TEXT[] NOT NULL DEFAULT '{}',
    target_education_levels public.education_level[] NOT NULL DEFAULT ARRAY['primary', 'middle', 'high_school', 'university']::public.education_level[],
    target_gender public.gender_preference NOT NULL DEFAULT 'mixed',
    available_study_days INT[] NOT NULL DEFAULT ARRAY[0, 1, 2, 3, 4],
    earliest_morning_time TIME NOT NULL DEFAULT '06:30:00',
    latest_return_time TIME NOT NULL DEFAULT '16:00:00',
    monthly_seat_price_iqd NUMERIC(12, 2) NOT NULL DEFAULT 75000.00 CHECK (monthly_seat_price_iqd > 0),
    driver_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (driver_rating BETWEEN 1.00 AND 5.00),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON public.vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_type_year ON public.vehicles(vehicle_type, manufacture_year);
CREATE INDEX IF NOT EXISTS idx_vehicles_base_location_gist ON public.vehicles USING GIST (base_location);

-- -------------------------------------------------------------------------------------
-- 3.4 جدول شرائح التتبع الجغرافي الصلبة (gps_trackers - Traccar Integration)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gps_trackers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL UNIQUE REFERENCES public.vehicles(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    imei TEXT NOT NULL UNIQUE CHECK (char_length(imei) BETWEEN 8 AND 20),
    traccar_device_id INT UNIQUE,
    sim_card_iccid TEXT,
    last_location GEOGRAPHY(POINT, 4326) NOT NULL DEFAULT ST_SetSRID(ST_MakePoint(44.0249, 32.6160), 4326)::geography,
    current_speed_kmh NUMERIC(6, 2) NOT NULL DEFAULT 0.00 CHECK (current_speed_kmh >= 0),
    heading_degrees NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (heading_degrees >= 0 AND heading_degrees <= 360),
    ignition_on BOOLEAN NOT NULL DEFAULT FALSE,
    operational_state TEXT NOT NULL DEFAULT 'stopped' CHECK (operational_state IN ('en_route', 'arrived_at_school', 'stopped', 'overspeed_alert')),
    max_allowed_speed_kmh NUMERIC(5, 2) NOT NULL DEFAULT 80.00,
    eta_minutes INT DEFAULT 0,
    last_connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gps_trackers_vehicle_id ON public.gps_trackers(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_gps_trackers_last_location_gist ON public.gps_trackers USING GIST (last_location);

-- -------------------------------------------------------------------------------------
-- 3.5 جدول طلبات الخطوط للطلاب وأولياء الأمور (student_line_requests)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_line_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_names TEXT[] NOT NULL DEFAULT '{}',
    students_count INT NOT NULL DEFAULT 1 CHECK (students_count BETWEEN 1 AND 10),
    home_district TEXT NOT NULL,
    home_detailed_address TEXT NOT NULL,
    home_location GEOGRAPHY(POINT, 4326) NOT NULL,
    institution_name TEXT NOT NULL,
    institution_place_id TEXT,
    destination_location GEOGRAPHY(POINT, 4326) NOT NULL,
    education_level public.education_level NOT NULL,
    gender_type public.gender_preference NOT NULL,
    study_days INT[] NOT NULL CHECK (
        array_length(study_days, 1) >= 1
        AND study_days <@ ARRAY[0, 1, 2, 3, 4, 5, 6]
    ),
    morning_departure_time TIME NOT NULL,
    afternoon_return_time TIME NOT NULL,
    daily_schedule_matrix JSONB NOT NULL DEFAULT '[]'::jsonb,
    preferred_vehicle_type public.vehicle_type NULL,
    min_vehicle_model_year INT NULL CHECK (min_vehicle_model_year IS NULL OR (min_vehicle_model_year BETWEEN 2005 AND 2030)),
    subscribe_live_gps_addon BOOLEAN NOT NULL DEFAULT FALSE,
    status public.match_status NOT NULL DEFAULT 'pending_driver',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_requests_parent_id ON public.student_line_requests(parent_student_id);
CREATE INDEX IF NOT EXISTS idx_student_requests_status ON public.student_line_requests(status);
CREATE INDEX IF NOT EXISTS idx_student_requests_home_gist ON public.student_line_requests USING GIST (home_location);
CREATE INDEX IF NOT EXISTS idx_student_requests_dest_gist ON public.student_line_requests USING GIST (destination_location);

-- -------------------------------------------------------------------------------------
-- 3.6 جدول مجموعات الخطوط الشهرية المعتمدة (monthly_lines)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.monthly_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_reference_code TEXT NOT NULL UNIQUE DEFAULT ('KHAT-' || upper(substring(replace(uuid_generate_v4()::text, '-', ''), 1, 6))),
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    origin_district_summary TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    destination_location GEOGRAPHY(POINT, 4326) NOT NULL,
    approved_student_request_ids UUID[] NOT NULL DEFAULT '{}',
    approved_parent_ids UUID[] NOT NULL DEFAULT '{}',
    study_days INT[] NOT NULL DEFAULT ARRAY[0, 1, 2, 3, 4],
    monthly_price_per_seat_iqd NUMERIC(12, 2) NOT NULL CHECK (monthly_price_per_seat_iqd > 0),
    billing_month_start DATE NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date,
    billing_month_end DATE NOT NULL DEFAULT (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::date,
    status public.match_status NOT NULL DEFAULT 'driver_accepted_searching_more',
    is_admin_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    is_first_month_paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_billing_dates CHECK (billing_month_end >= billing_month_start)
);

CREATE INDEX IF NOT EXISTS idx_monthly_lines_driver_id ON public.monthly_lines(driver_id);
CREATE INDEX IF NOT EXISTS idx_monthly_lines_vehicle_id ON public.monthly_lines(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_monthly_lines_approved_parents_gin ON public.monthly_lines USING GIN (approved_parent_ids);

-- -------------------------------------------------------------------------------------
-- 3.7 جدول إشعارات المطابقة العمياء (match_notifications)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.match_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.student_line_requests(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    parent_student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    monthly_line_id UUID REFERENCES public.monthly_lines(id) ON DELETE SET NULL,
    status public.match_status NOT NULL DEFAULT 'pending_driver',
    students_seats_requested INT NOT NULL DEFAULT 1 CHECK (students_seats_requested >= 1),
    blind_driver_prompt_ar TEXT NOT NULL,
    student_offer_summary_ar TEXT,
    estimated_monthly_cost_iqd NUMERIC(12, 2) NOT NULL,
    home_to_driver_distance_meters NUMERIC(10, 2),
    driver_responded_at TIMESTAMPTZ,
    student_responded_at TIMESTAMPTZ,
    is_contact_unmasked BOOLEAN NOT NULL DEFAULT FALSE,
    seat_counted_in_vehicle BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_request_vehicle_match UNIQUE (request_id, vehicle_id)
);

CREATE INDEX IF NOT EXISTS idx_match_notifications_driver_id ON public.match_notifications(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_match_notifications_parent_id ON public.match_notifications(parent_student_id, status);
CREATE INDEX IF NOT EXISTS idx_match_notifications_request_id ON public.match_notifications(request_id);

-- -------------------------------------------------------------------------------------
-- 3.8 جدول اشتراكات أولياء الأمور في الخريطة الحية (parent_map_subscriptions)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_map_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    monthly_line_id UUID NOT NULL REFERENCES public.monthly_lines(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    addon_monthly_fee_iqd NUMERIC(10, 2) NOT NULL DEFAULT 10000.00 CHECK (addon_monthly_fee_iqd >= 0),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'expired', 'cancelled')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    activated_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_parent_line_subscription UNIQUE (parent_id, monthly_line_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_map_subs_lookup ON public.parent_map_subscriptions(parent_id, vehicle_id, is_active, expires_at);

-- -------------------------------------------------------------------------------------
-- 3.9 جدول تنبيهات السياج الجغرافي الذكي (geofence_alerts - 500m Home & School Arrival)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geofence_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monthly_line_id UUID NOT NULL REFERENCES public.monthly_lines(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('approaching_home_500m', 'arrived_school_safely', 'approaching_return_500m', 'overspeed_warning')),
    message_ar TEXT NOT NULL,
    distance_meters NUMERIC(8, 2),
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geofence_alerts_parent_id ON public.geofence_alerts(parent_id, triggered_at DESC);

-- =====================================================================================
-- 4. الدوال المساعدة، الدوال الجغرافية (PostGIS RPC)، والمشغلات (TRIGGERS)
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 4.1 دالة تحديث حقل updated_at تلقائياً
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_driver_docs_updated_at ON public.driver_private_docs;
CREATE TRIGGER trg_driver_docs_updated_at
    BEFORE UPDATE ON public.driver_private_docs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER trg_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_gps_trackers_updated_at ON public.gps_trackers;
CREATE TRIGGER trg_gps_trackers_updated_at
    BEFORE UPDATE ON public.gps_trackers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_student_requests_updated_at ON public.student_line_requests;
CREATE TRIGGER trg_student_requests_updated_at
    BEFORE UPDATE ON public.student_line_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_monthly_lines_updated_at ON public.monthly_lines;
CREATE TRIGGER trg_monthly_lines_updated_at
    BEFORE UPDATE ON public.monthly_lines
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_match_notifications_updated_at ON public.match_notifications;
CREATE TRIGGER trg_match_notifications_updated_at
    BEFORE UPDATE ON public.match_notifications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -------------------------------------------------------------------------------------
-- 4.2 مشغل إنشاء ملف المستخدم تلقائياً عند التسجيل في Supabase Auth
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role public.user_role;
    v_primary_phone TEXT;
    v_backup_phone TEXT;
BEGIN
    v_role := COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'role', '')::public.user_role,
        'student_parent'::public.user_role
    );
    v_primary_phone := COALESCE(NULLIF(NEW.raw_user_meta_data->>'primary_phone', ''), '07700000001');
    v_backup_phone  := COALESCE(NULLIF(NEW.raw_user_meta_data->>'emergency_backup_phone', ''), '07800000002');

    IF v_primary_phone = v_backup_phone THEN
        v_backup_phone := '07899999999';
    END IF;

    INSERT INTO public.profiles (
        id,
        full_name,
        role,
        primary_phone,
        emergency_backup_phone,
        governorate,
        residential_district
    )
    VALUES (
        NEW.id,
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'مستخدم خطي الجديد'),
        v_role,
        v_primary_phone,
        v_backup_phone,
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'governorate', ''), 'كربلاء المقدسة'),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'residential_district', ''), 'حي الهادي')
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = NOW();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- -------------------------------------------------------------------------------------
-- 4.3 دوال التحقق الأمني لسياسات RLS (Security Definer Helpers)
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.can_driver_view_student_identity(p_student_parent_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.match_notifications mn
        JOIN public.vehicles v ON v.id = mn.vehicle_id
        WHERE mn.driver_id = auth.uid()
          AND mn.parent_student_id = p_student_parent_id
          AND mn.status IN ('student_confirmed', 'active_contract')
          AND (
              mn.is_contact_unmasked = TRUE
              OR v.current_occupied >= v.max_capacity
          )
    );
$$;

CREATE OR REPLACE FUNCTION public.has_active_gps_subscription(p_vehicle_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.parent_map_subscriptions pms
        WHERE pms.parent_id = auth.uid()
          AND pms.vehicle_id = p_vehicle_id
          AND pms.is_active = TRUE
          AND pms.payment_status = 'paid'
          AND pms.expires_at > NOW()
    );
$$;

-- -------------------------------------------------------------------------------------
-- 4.4 الدالة الجغرافية لمحرك المطابقة الذكي (PostGIS Spatio-Temporal Matching Engine)
-- find_matching_drivers_for_student(request_id UUID, radius_meters INT)
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.find_matching_drivers_for_student(
    request_id UUID,
    radius_meters INT DEFAULT 5000
)
RETURNS TABLE (
    vehicle_id UUID,
    driver_id UUID,
    driver_display_label TEXT,
    vehicle_type public.vehicle_type,
    brand_make TEXT,
    model_name TEXT,
    manufacture_year INT,
    color TEXT,
    cooling_ac_status TEXT,
    max_capacity INT,
    current_occupied INT,
    available_seats INT,
    driver_rating NUMERIC(3, 2),
    monthly_seat_price_iqd NUMERIC(12, 2),
    estimated_total_monthly_iqd NUMERIC(12, 2),
    distance_from_home_meters NUMERIC(10, 2),
    blind_notification_text_ar TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_req public.student_line_requests%ROWTYPE;
    v_days_label TEXT;
BEGIN
    SELECT *
    INTO v_req
    FROM public.student_line_requests
    WHERE id = find_matching_drivers_for_student.request_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Student line request % not found', find_matching_drivers_for_student.request_id;
    END IF;

    v_days_label := array_to_string(v_req.study_days, '، ');

    RETURN QUERY
    SELECT
        v.id AS vehicle_id,
        v.driver_id AS driver_id,
        ('كابتن موثق #' || upper(substring(v.driver_id::text, 1, 6)))::TEXT AS driver_display_label,
        v.vehicle_type,
        v.brand_make,
        v.model_name,
        v.manufacture_year,
        v.color,
        v.cooling_ac_status,
        v.max_capacity,
        v.current_occupied,
        (v.max_capacity - v.current_occupied)::INT AS available_seats,
        v.driver_rating,
        v.monthly_seat_price_iqd,
        ROUND((v.monthly_seat_price_iqd * v_req.students_count) * (cardinality(v_req.study_days)::numeric / 5.0), 0) AS estimated_total_monthly_iqd,
        ROUND(ST_Distance(v.base_location, v_req.home_location)::numeric, 2) AS distance_from_home_meters,
        format(
            'يوجد طالب (عدد: %s) من منطقة [%s] إلى [%s]، أيام الدوام الأسبوعية [%s]، هل توافق مبدئياً ليقوم النظام بالبحث عن باقي الركاب لإكمال الطاقة الاستيعابية لسيارتك؟',
            v_req.students_count,
            v_req.home_district,
            v_req.institution_name,
            v_days_label
        ) AS blind_notification_text_ar
    FROM public.vehicles v
    JOIN public.profiles p ON p.id = v.driver_id
    LEFT JOIN public.driver_private_docs ddoc ON ddoc.driver_id = v.driver_id
    WHERE v.is_active = TRUE
      AND p.role = 'driver'
      AND (p.is_verified = TRUE OR COALESCE(ddoc.verification_status, 'pending') = 'approved')
      -- 1. توفر مقاعد شاغرة كافية لعدد الطلاب المطلوب حجزهم ضمن الحساب
      AND (v.max_capacity - v.current_occupied) >= v_req.students_count
      -- 2. المطابقة المكانية الجغرافية عبر PostGIS ضمن نصف القطر المحدد
      AND ST_DWithin(
          v.base_location,
          v_req.home_location,
          GREATEST(find_matching_drivers_for_student.radius_meters, v.service_radius_meters)
      )
      -- 3. تطابق المرحلة الدراسية المستهدفة
      AND v_req.education_level = ANY(v.target_education_levels)
      -- 4. تطابق تفضيل الجنس (ذكور، إناث، أو مختلط)
      AND (
          v.target_gender = 'mixed'
          OR v.target_gender = v_req.gender_type
      )
      -- 5. تطابق أيام الدوام الفعلي في الأسبوع (Schedule Matrix Overlap)
      AND v_req.study_days <@ v.available_study_days
      -- 6. تطابق الفلتر الاختياري لنوع السيارة (إن حدده ولي الأمر)
      AND (
          v_req.preferred_vehicle_type IS NULL
          OR v.vehicle_type = v_req.preferred_vehicle_type
      )
      -- 7. تطابق الفلتر الاختياري لأقل موديل سيارة مقبول (إن حدده ولي الأمر)
      AND (
          v_req.min_vehicle_model_year IS NULL
          OR v.manufacture_year >= v_req.min_vehicle_model_year
      )
    ORDER BY
        ST_Distance(v.base_location, v_req.home_location) ASC,
        v.driver_rating DESC,
        v.manufacture_year DESC;
END;
$$;

-- -------------------------------------------------------------------------------------
-- 4.5 مشغل تحديث المقاعد المحجوزة (current_occupied) وكشف الهوية عند تثبيت الخط
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_match_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_vehicle public.vehicles%ROWTYPE;
    v_line_id UUID;
    v_req public.student_line_requests%ROWTYPE;
BEGIN
    SELECT * INTO v_vehicle FROM public.vehicles WHERE id = NEW.vehicle_id FOR UPDATE;
    SELECT * INTO v_req FROM public.student_line_requests WHERE id = NEW.request_id;

    -- أ. عند موافقة السائق مبدئياً: تحويل الحالة وإرسال العرض التفاعلي للطالب/ولي الأمر
    IF NEW.status = 'driver_accepted_searching_more' AND OLD.status = 'pending_driver' THEN
        NEW.driver_responded_at := NOW();
        NEW.student_offer_summary_ar := format(
            'توفّر خط مناسب! المركبة: %s %s موديل %s (%s) | التقييم: %s★ | الركاب الحاليون: %s من %s | التكلفة الشهرية التقديرية: %s د.ع',
            v_vehicle.brand_make,
            v_vehicle.model_name,
            v_vehicle.manufacture_year,
            v_vehicle.color,
            v_vehicle.driver_rating,
            v_vehicle.current_occupied,
            v_vehicle.max_capacity,
            NEW.estimated_monthly_cost_iqd
        );
        UPDATE public.student_line_requests
        SET status = 'offered_to_student'
        WHERE id = NEW.request_id;
    END IF;

    -- ب. عند ضغط الطالب/ولي الأمر على زر [موافق وتثبيت الخط]
    IF NEW.status IN ('student_confirmed', 'active_contract')
       AND OLD.status NOT IN ('student_confirmed', 'active_contract')
       AND NEW.seat_counted_in_vehicle = FALSE THEN

        IF (v_vehicle.current_occupied + NEW.students_seats_requested) > v_vehicle.max_capacity THEN
            RAISE EXCEPTION 'لا توجد مقاعد شاغرة كافية في هذه المركبة (المتاح: %، المطلوب: %)',
                (v_vehicle.max_capacity - v_vehicle.current_occupied), NEW.students_seats_requested;
        END IF;

        -- تحديث عدد المقاعد المحجوزة تلقائياً في جدول المركبات
        UPDATE public.vehicles
        SET current_occupied = current_occupied + NEW.students_seats_requested
        WHERE id = NEW.vehicle_id
        RETURNING * INTO v_vehicle;

        NEW.seat_counted_in_vehicle := TRUE;
        NEW.student_responded_at := NOW();

        -- إنشاء أو تحديث مجموعة الخط الشهري (monthly_lines)
        IF NEW.monthly_line_id IS NULL THEN
            SELECT id INTO v_line_id
            FROM public.monthly_lines
            WHERE vehicle_id = NEW.vehicle_id
              AND billing_month_start = date_trunc('month', CURRENT_DATE)::date
            LIMIT 1;

            IF v_line_id IS NULL THEN
                INSERT INTO public.monthly_lines (
                    driver_id,
                    vehicle_id,
                    origin_district_summary,
                    institution_name,
                    destination_location,
                    approved_student_request_ids,
                    approved_parent_ids,
                    study_days,
                    monthly_price_per_seat_iqd,
                    status
                )
                VALUES (
                    NEW.driver_id,
                    NEW.vehicle_id,
                    v_req.home_district,
                    v_req.institution_name,
                    v_req.destination_location,
                    ARRAY[NEW.request_id],
                    ARRAY[NEW.parent_student_id],
                    v_req.study_days,
                    v_vehicle.monthly_seat_price_iqd,
                    CASE
                        WHEN v_vehicle.current_occupied >= v_vehicle.max_capacity THEN 'active_contract'::public.match_status
                        ELSE 'student_confirmed'::public.match_status
                    END
                )
                RETURNING id INTO v_line_id;
            ELSE
                UPDATE public.monthly_lines
                SET
                    approved_student_request_ids = array_append(approved_student_request_ids, NEW.request_id),
                    approved_parent_ids = array_append(approved_parent_ids, NEW.parent_student_id),
                    status = CASE
                        WHEN v_vehicle.current_occupied >= v_vehicle.max_capacity THEN 'active_contract'::public.match_status
                        ELSE status
                    END
                WHERE id = v_line_id;
            END IF;

            NEW.monthly_line_id := v_line_id;
        END IF;

        -- إذا اكتمل العدد المطلوب للسيارة أو تم تفعيل العقد، يتم كشف البيانات لجميع أعضاء الخط
        IF v_vehicle.current_occupied >= v_vehicle.max_capacity OR NEW.status = 'active_contract' THEN
            NEW.is_contact_unmasked := TRUE;
            NEW.status := 'active_contract';

            UPDATE public.match_notifications
            SET
                is_contact_unmasked = TRUE,
                status = 'active_contract'
            WHERE vehicle_id = NEW.vehicle_id
              AND status = 'student_confirmed'
              AND id <> NEW.id;
        END IF;

        UPDATE public.student_line_requests
        SET status = NEW.status
        WHERE id = NEW.request_id;
    END IF;

    -- ج. عند ضغط الطالب على [تجاوز / ابحث مجدداً] بعد أو قبل التثبيت
    IF NEW.status = 'rejected_re_search' AND OLD.status <> 'rejected_re_search' THEN
        IF OLD.seat_counted_in_vehicle = TRUE THEN
            UPDATE public.vehicles
            SET current_occupied = GREATEST(0, current_occupied - NEW.students_seats_requested)
            WHERE id = NEW.vehicle_id;
            NEW.seat_counted_in_vehicle := FALSE;
        END IF;

        NEW.is_contact_unmasked := FALSE;

        UPDATE public.student_line_requests
        SET status = 'pending_driver'
        WHERE id = NEW.request_id;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_vehicle_occupancy_on_confirm ON public.match_notifications;
CREATE TRIGGER trg_update_vehicle_occupancy_on_confirm
    BEFORE UPDATE ON public.match_notifications
    FOR EACH ROW EXECUTE FUNCTION public.handle_match_status_transition();

-- -------------------------------------------------------------------------------------
-- 4.6 مشغل السياج الجغرافي الذكي (Geofencing 500m Home & School Arrival Trigger)
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.evaluate_gps_geofence_and_speed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    rec RECORD;
    v_dist_home NUMERIC;
    v_dist_school NUMERIC;
BEGIN
    -- تنبيه السرعة الزائدة التلقائي لغرفة عمليات الشركة
    IF NEW.current_speed_kmh > NEW.max_allowed_speed_kmh THEN
        NEW.operational_state := 'overspeed_alert';
    END IF;

    -- فحص المسافة عن منازل الطلاب والمدارس للخطوط الفعالة المرتبطة بالمركبة
    FOR rec IN
        SELECT
            ml.id AS monthly_line_id,
            sr.id AS request_id,
            sr.parent_student_id,
            sr.home_location,
            sr.destination_location,
            sr.institution_name
        FROM public.monthly_lines ml
        JOIN public.student_line_requests sr ON sr.id = ANY(ml.approved_student_request_ids)
        WHERE ml.vehicle_id = NEW.vehicle_id
          AND ml.status IN ('student_confirmed', 'active_contract')
    LOOP
        v_dist_home := ST_Distance(NEW.last_location, rec.home_location);
        v_dist_school := ST_Distance(NEW.last_location, rec.destination_location);

        -- 1. إذا اقتربت السيارة لمسافة 500 متر أو أقل من منزل الطالب
        IF v_dist_home <= 500 AND ST_Distance(OLD.last_location, rec.home_location) > 500 THEN
            INSERT INTO public.geofence_alerts (
                monthly_line_id,
                vehicle_id,
                parent_id,
                alert_type,
                message_ar,
                distance_meters
            )
            VALUES (
                rec.monthly_line_id,
                NEW.vehicle_id,
                rec.parent_student_id,
                'approaching_home_500m',
                'السيارة تقترب من المنزل الآن (على بعد 500 متر) — يرجى تجهيز الطالب للركوب.',
                ROUND(v_dist_home, 1)
            );
        END IF;

        -- 2. إذا وصلت السيارة لمحيط المدرسة أو الكلية (150 متر أو أقل)
        IF v_dist_school <= 150 AND ST_Distance(OLD.last_location, rec.destination_location) > 150 THEN
            NEW.operational_state := 'arrived_at_school';
            INSERT INTO public.geofence_alerts (
                monthly_line_id,
                vehicle_id,
                parent_id,
                alert_type,
                message_ar,
                distance_meters
            )
            VALUES (
                rec.monthly_line_id,
                NEW.vehicle_id,
                rec.parent_student_id,
                'arrived_school_safely',
                format('وصل الطالب بسلام إلى %s.', rec.institution_name),
                ROUND(v_dist_school, 1)
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_gps_geofence_monitor ON public.gps_trackers;
CREATE TRIGGER trg_gps_geofence_monitor
    BEFORE UPDATE OF last_location, current_speed_kmh ON public.gps_trackers
    FOR EACH ROW EXECUTE FUNCTION public.evaluate_gps_geofence_and_speed();

-- =====================================================================================
-- 5. حافظات التخزين السحابية (SUPABASE STORAGE BUCKETS)
-- =====================================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'driver_kyc_documents',
    'driver_kyc_documents',
    FALSE,
    10485760, -- 10 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET
    public = FALSE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'public_avatars',
    'public_avatars',
    TRUE,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
    public = TRUE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================================================
-- 6. سياسات أمن الصفوف الصارمة (ROW LEVEL SECURITY - RLS)
-- =====================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_private_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_line_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_map_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_alerts ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------------------
-- 6.1 سياسات جدول profiles (حماية الهوية وأرقام الهواتف حتى إتمام التعاقد)
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        id = auth.uid()
        OR public.is_admin()
        OR public.can_driver_view_student_identity(id)
        OR EXISTS (
            SELECT 1
            FROM public.match_notifications mn
            WHERE mn.parent_student_id = auth.uid()
              AND mn.driver_id = public.profiles.id
              AND mn.status IN ('student_confirmed', 'active_contract')
              AND mn.is_contact_unmasked = TRUE
        )
    );

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

-- -------------------------------------------------------------------------------------
-- 6.2 سياسات جدول driver_private_docs (قراءة وتدقيق حصري للأدمن فقط + رفع للسائق نفسه)
-- يمنع منعاً باتاً أي مستخدم (سائق أو طالب) من قراءة جدول driver_private_docs
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "driver_docs_admin_only_select" ON public.driver_private_docs;
CREATE POLICY "driver_docs_admin_only_select"
    ON public.driver_private_docs
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "driver_docs_insert_by_owner_or_admin" ON public.driver_private_docs;
CREATE POLICY "driver_docs_insert_by_owner_or_admin"
    ON public.driver_private_docs
    FOR INSERT
    TO authenticated
    WITH CHECK (driver_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "driver_docs_admin_only_update" ON public.driver_private_docs;
CREATE POLICY "driver_docs_admin_only_update"
    ON public.driver_private_docs
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "driver_docs_admin_only_delete" ON public.driver_private_docs;
CREATE POLICY "driver_docs_admin_only_delete"
    ON public.driver_private_docs
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- -------------------------------------------------------------------------------------
-- 6.3 سياسات ملفات Storage لحافظة driver_kyc_documents (محصورة بالأدمن فقط للقراءة/التعديل)
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "kyc_storage_admin_select_only" ON storage.objects;
CREATE POLICY "kyc_storage_admin_select_only"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        (bucket_id = 'driver_kyc_documents' AND public.is_admin())
        OR bucket_id = 'public_avatars'
    );

DROP POLICY IF EXISTS "kyc_storage_driver_upload_own_folder" ON storage.objects;
CREATE POLICY "kyc_storage_driver_upload_own_folder"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (
            bucket_id = 'driver_kyc_documents'
            AND (storage.foldername(name))[1] = auth.uid()::text
        )
        OR (
            bucket_id = 'public_avatars'
            AND (storage.foldername(name))[1] = auth.uid()::text
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "kyc_storage_admin_modify_only" ON storage.objects;
CREATE POLICY "kyc_storage_admin_modify_only"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'driver_kyc_documents' AND public.is_admin())
    WITH CHECK (bucket_id = 'driver_kyc_documents' AND public.is_admin());

DROP POLICY IF EXISTS "kyc_storage_admin_delete_only" ON storage.objects;
CREATE POLICY "kyc_storage_admin_delete_only"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'driver_kyc_documents' AND public.is_admin());

-- -------------------------------------------------------------------------------------
-- 6.4 سياسات جدول المركبات (vehicles)
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "vehicles_select_authenticated" ON public.vehicles;
CREATE POLICY "vehicles_select_authenticated"
    ON public.vehicles
    FOR SELECT
    TO authenticated
    USING (is_active = TRUE OR driver_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "vehicles_manage_owner_or_admin" ON public.vehicles;
CREATE POLICY "vehicles_manage_owner_or_admin"
    ON public.vehicles
    FOR ALL
    TO authenticated
    USING (driver_id = auth.uid() OR public.is_admin())
    WITH CHECK (driver_id = auth.uid() OR public.is_admin());

-- -------------------------------------------------------------------------------------
-- 6.5 سياسات جدول طلبات الطلاب (student_line_requests - Blind Matching RLS)
-- السائق لا يستطيع قراءة الطلب (الذي يضم موقع المنزل الدقيق وبيانات الطالب)
-- إلا إذا كانت حالة المطابقة بينهما student_confirmed أو active_contract
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "student_requests_blind_matching_select" ON public.student_line_requests;
CREATE POLICY "student_requests_blind_matching_select"
    ON public.student_line_requests
    FOR SELECT
    TO authenticated
    USING (
        parent_student_id = auth.uid()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1
            FROM public.match_notifications mn
            WHERE mn.request_id = public.student_line_requests.id
              AND mn.driver_id = auth.uid()
              AND mn.status IN ('student_confirmed', 'active_contract')
        )
    );

DROP POLICY IF EXISTS "student_requests_insert_owner" ON public.student_line_requests;
CREATE POLICY "student_requests_insert_owner"
    ON public.student_line_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (parent_student_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "student_requests_update_owner_or_admin" ON public.student_line_requests;
CREATE POLICY "student_requests_update_owner_or_admin"
    ON public.student_line_requests
    FOR UPDATE
    TO authenticated
    USING (parent_student_id = auth.uid() OR public.is_admin())
    WITH CHECK (parent_student_id = auth.uid() OR public.is_admin());

-- -------------------------------------------------------------------------------------
-- 6.6 سياسات الخرائط المدفوعة على جدول gps_trackers
-- ولي الأمر لا يمكنه قراءة إحداثيات جدول gps_trackers إلا باشتراك فعال في parent_map_subscriptions
-- بينما يقرأها الـ admin دائماً بدون قيود
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "gps_trackers_paid_subscription_or_admin_select" ON public.gps_trackers;
CREATE POLICY "gps_trackers_paid_subscription_or_admin_select"
    ON public.gps_trackers
    FOR SELECT
    TO authenticated
    USING (
        public.is_admin()
        OR driver_id = auth.uid()
        OR public.has_active_gps_subscription(vehicle_id)
    );

DROP POLICY IF EXISTS "gps_trackers_admin_or_driver_update" ON public.gps_trackers;
CREATE POLICY "gps_trackers_admin_or_driver_update"
    ON public.gps_trackers
    FOR ALL
    TO authenticated
    USING (public.is_admin() OR driver_id = auth.uid())
    WITH CHECK (public.is_admin() OR driver_id = auth.uid());

-- -------------------------------------------------------------------------------------
-- 6.7 سياسات جدول إشعارات المطابقة (match_notifications)
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "match_notifications_participant_select" ON public.match_notifications;
CREATE POLICY "match_notifications_participant_select"
    ON public.match_notifications
    FOR SELECT
    TO authenticated
    USING (
        driver_id = auth.uid()
        OR parent_student_id = auth.uid()
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "match_notifications_participant_update" ON public.match_notifications;
CREATE POLICY "match_notifications_participant_update"
    ON public.match_notifications
    FOR UPDATE
    TO authenticated
    USING (
        driver_id = auth.uid()
        OR parent_student_id = auth.uid()
        OR public.is_admin()
    )
    WITH CHECK (
        driver_id = auth.uid()
        OR parent_student_id = auth.uid()
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "match_notifications_insert_system_or_admin" ON public.match_notifications;
CREATE POLICY "match_notifications_insert_system_or_admin"
    ON public.match_notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (
        parent_student_id = auth.uid()
        OR driver_id = auth.uid()
        OR public.is_admin()
    );

-- -------------------------------------------------------------------------------------
-- 6.8 سياسات جدول الخطوط الشهرية (monthly_lines) واشتراكات الخرائط والتنبيهات
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "monthly_lines_participant_select" ON public.monthly_lines;
CREATE POLICY "monthly_lines_participant_select"
    ON public.monthly_lines
    FOR SELECT
    TO authenticated
    USING (
        public.is_admin()
        OR driver_id = auth.uid()
        OR auth.uid() = ANY(approved_parent_ids)
    );

DROP POLICY IF EXISTS "monthly_lines_admin_manage" ON public.monthly_lines;
CREATE POLICY "monthly_lines_admin_manage"
    ON public.monthly_lines
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "parent_map_subs_select" ON public.parent_map_subscriptions;
CREATE POLICY "parent_map_subs_select"
    ON public.parent_map_subscriptions
    FOR SELECT
    TO authenticated
    USING (parent_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "parent_map_subs_insert_or_admin" ON public.parent_map_subscriptions;
CREATE POLICY "parent_map_subs_insert_or_admin"
    ON public.parent_map_subscriptions
    FOR ALL
    TO authenticated
    USING (parent_id = auth.uid() OR public.is_admin())
    WITH CHECK (parent_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "geofence_alerts_select" ON public.geofence_alerts;
CREATE POLICY "geofence_alerts_select"
    ON public.geofence_alerts
    FOR SELECT
    TO authenticated
    USING (parent_id = auth.uid() OR public.is_admin());

-- =====================================================================================
-- 7. تفعيل البث الحي (SUPABASE REALTIME PUBLICATION)
-- =====================================================================================
ALTER TABLE public.gps_trackers REPLICA IDENTITY FULL;
ALTER TABLE public.match_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.geofence_alerts REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'gps_trackers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.gps_trackers;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'match_notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.match_notifications;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'geofence_alerts'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.geofence_alerts;
    END IF;
END $$;

COMMIT;
