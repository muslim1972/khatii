# منظومة وتطبيق "خطي" (Khatti) لإدارة خطوط النقل الدراسي الشهري في العراق

## خطوات التشغيل السريع (من الألف إلى الياء)

1. **إعداد قاعدة بيانات Supabase بضغطة واحدة:**
   - افتح لوحة تحكم مشروعك في Supabase وانتقل إلى **SQL Editor**.
   - انسخ محتوى الملف `supabase/migrations/001_supabase_one_click_migration.sql` بالكامل والصقه ثم اضغط **Run**.
   - سيقوم السكربت تلقائياً بتفعيل إضافتي `uuid-ossp` و`postgis`، وإنشاء كافة الجداول التسعة، وحافظات التخزين السرية `driver_kyc_documents`، ودالة المطابقة المكانية والزمانية `find_matching_drivers_for_student`، وسياسات `RLS` الصارمة، وتفعيل البث الحي `supabase_realtime`.

2. **إضافة مفاتيح البيئة (`.env.local`):**
   - انسخ ملف `.env.example` إلى `.env.local` وضع رابط `NEXT_PUBLIC_SUPABASE_URL` ومفتاح `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. **تشغيل التطبيق على الكمبيوتر والويب (PWA):**
   ```bash
   npm install
   npm run dev
   ```

4. **تحويل التطبيق إلى Android و iOS عبر Capacitor:**
   ```bash
   npm run build
   npx cap add android
   npx cap add ios
   npx cap sync
   ```
