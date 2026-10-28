import fs from 'node:fs'
import path from 'node:path'

// يعمل بعد البناء: ينسخ الصفحات الثابتة وملفات JS العادية (غير module)
// إلى مجلد dist بنفس مساراتها، لأن Vite لا ينسخ هذه الملفات تلقائياً.
// لا يستبدل أي ملف أنتجه Vite.

const FILES = [
  'index.html',
  'page-10-name.html',
  'page-11-path.html',
  'page-12-location.html',
  'page-13-status.html',
  'page-14-org.html',
  'page-15-org-path.html',
  'nexo-logo.png',
]

const DIRS = [
  '1-home',
  '2-about',
  '3-talents',
  '4-teams',
  '5-opportunities',
  '16-plans',
  '17-payment',
  'assets',
  'css',
  'js',
  'public',
  'src/assets/avatars',
  'nexo-dashboard/js',
]

// ملفات لا تُنسخ كما هي: auth-guard.js وdb.js يُبنيان عبر Vite، وlogout.js غير مستخدم
const EXCLUDE = new Set([
  path.join('nexo-dashboard', 'js', 'auth-guard.js'),
  path.join('nexo-dashboard', 'js', 'logout.js'),
  path.join('nexo-dashboard', 'js', 'db.js'),
])

export function copyStatic({ files = FILES, dirs = DIRS } = {}) {
  let root = process.cwd()
  let outDir = 'dist'

  return {
    name: 'nexo-copy-static',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const copyOne = (rel) => {
        const from = path.join(root, rel)
        const to = path.join(outDir, rel)
        if (!fs.existsSync(from)) return
        fs.mkdirSync(path.dirname(to), { recursive: true })
        fs.cpSync(from, to, {
          recursive: true,
          force: false,
          filter: (src) => !EXCLUDE.has(path.relative(root, src)),
        })
      }

      files.forEach(copyOne)
      dirs.forEach(copyOne)
    },
  }
}
