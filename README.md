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

## هيكل الصفحات

- `1-home` إلى `5-opportunities`: صفحات عامة (زر تسجيل دخول يفتح `/auth.html#/login`).
- `auth.html`: الدخول، التسجيل، تأكيد البريد، MFA (React).
- `recovery.html`: استعادة كلمة المرور (متاحة بدون MFA).
- `nexo-dashboard/*`: الـ Dashboard، كل صفحة تحمّل `js/auth-guard.js`
  ويمنع الدخول بدون تسجيل دخول وإكمال MFA (`aal2`).
- `vite-plugins/copy-static.js`: ينسخ الصفحات الثابتة وملفات JS العادية إلى `dist` بعد البناء.
