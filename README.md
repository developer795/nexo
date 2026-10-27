# NEXO

موقع NEXO: صفحات عامة + تسجيل دخول مع MFA + Dashboard محمي.

## التشغيل محلياً

```
npm install
npm run dev
```

أنشئ ملف `.env` في جذر المشروع (انسخ `.env.example`) وعبّئ:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## البناء والنشر

```
npm run build      # يطلع مجلد dist
npm run preview    # تجربة النسخة المبنية محلياً
```

### النشر على Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Environment Variables: أضف `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY`
  (ملف `.env` لا يُرفع إلى GitHub، فلازم تضيفها في إعدادات الاستضافة ثم تعيد البناء).
- انشره على جذر الدومين (مو داخل مسار فرعي)، لأن المسارات مثل `/auth.html` مطلقة.

### إعداد Supabase بعد النشر

من Authentication ثم URL Configuration:

- Site URL: رابط موقعك
- Redirect URLs: أضف `https://رابط-موقعك/recovery.html` و`https://رابط-موقعك/auth.html`

## قاعدة البيانات (Supabase)

كل بيانات الموقع محفوظة في Supabase (مو في المتصفح):

| الجدول | وش فيه |
|---|---|
| `talents` | المواهب. حساب الفرد ملفه صف هنا (`user_id` = حسابه) |
| `teams` | الأندية والجهات ومقدمي الخدمة. حساب الجهة ملفه صف هنا |
| `posts` | المنشورات (والعرض `post_feed` يجيبها مع اسم وصورة الكاتب) |
| `opportunities` | الفرص، وعدد المتقدمين يتحدث تلقائيًا |
| `applications` | من قدّم على أي فرصة |
| Storage: `media` | كل الصور (الصور الشخصية، الأغلفة، الشعارات، صور المنشورات) |

### التركيب (مرة وحدة)

1. افتح مشروعك في Supabase ثم **SQL Editor** ثم **New query**
2. الصق محتوى `supabase/schema.sql` كامل واضغط **Run**
   (آمن لو شغلته أكثر من مرة)

### الصلاحيات

- المواهب والفرق والفرص: أي أحد يقدر يشوفها (تظهر في الصفحات العامة).
- المنشورات: للمسجلين فقط.
- الإضافة والتعديل: لازم تسجيل دخول + MFA، وكل واحد يعدّل اللي له بس.
- الصور: كل مستخدم يرفع داخل مجلده فقط `media/<user_id>/`.
- بيانات التسجيل (الجوال وتاريخ الميلاد) تبقى في حساب Supabase Auth ولا تظهر لأحد.

### الأونبوردنق

صفحات الأونبوردنق (10 إلى 15) تشتغل قبل تسجيل الدخول، فتحفظ الإجابات مؤقتًا
في المتصفح، وأول ما يدخل المستخدم الـ Dashboard تنتقل لقاعدة البيانات تلقائيًا
وتنمسح من المتصفح.

### ملفات الربط

- `nexo-dashboard/js/db.js`: كل القراءة والكتابة للـ Dashboard.
- `src/public-data.js`: قراءة البيانات للصفحات العامة.

## هيكل الصفحات

- `1-home` إلى `5-opportunities`: صفحات عامة (زر تسجيل دخول يفتح `/auth.html#/login`)، تعرض البيانات الحقيقية من Supabase.
- `auth.html`: الدخول، التسجيل، تأكيد البريد، MFA (React).
- `recovery.html`: استعادة كلمة المرور (متاحة بدون MFA).
- `nexo-dashboard/*`: الـ Dashboard، كل صفحة تحمّل `js/auth-guard.js`
  ويمنع الدخول بدون تسجيل دخول وإكمال MFA (`aal2`).
- `vite-plugins/copy-static.js`: ينسخ الصفحات الثابتة وملفات JS العادية إلى `dist` بعد البناء.
