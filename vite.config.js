import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyStatic } from './vite-plugins/copy-static.js'

const r = (p) => resolve(dirname(fileURLToPath(import.meta.url)), p)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyStatic()],
  build: {
    // مجلد ملفات Vite المبنية، بعيداً عن مجلد assets الخاص بالمشروع
    assetsDir: 'bundle',
    rollupOptions: {
      input: {
        // الصفحات العامة (تقرأ البيانات من Supabase عبر src/public-data.js)
        home: r('1-home/home.html'),
        talents: r('3-talents/talents.html'),
        teams: r('4-teams/teams.html'),
        opportunities: r('5-opportunities/opportunities.html'),
        // صفحات React (الدخول، التسجيل، MFA، استعادة كلمة المرور)
        auth: r('auth.html'),
        recovery: r('recovery.html'),
        // صفحات الـ Dashboard المحمية بـ auth-guard.js
        dashHome: r('nexo-dashboard/dash-home.html'),
        dashTalents: r('nexo-dashboard/dash-talents.html'),
        dashTeams: r('nexo-dashboard/dash-teams.html'),
        dashOpportunities: r('nexo-dashboard/dash-opportunities.html'),
        dashOpportunityDetails: r('nexo-dashboard/dash-opportunity-details.html'),
        dashTalentProfile: r('nexo-dashboard/dash-talent-profile.html'),
        dashTalentVisitor: r('nexo-dashboard/dash-talent-visitor.html'),
        dashEntityProfile: r('nexo-dashboard/dash-entity-profile.html'),
        dashEntityVisitor: r('nexo-dashboard/dash-entity-visitor.html'),
        dashCreateOpportunity: r('nexo-dashboard/dash-create-opportunity.html'),
        dashPayment: r('nexo-dashboard/dash-payment.html'),
      },
    },
  },
})
