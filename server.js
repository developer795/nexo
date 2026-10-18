import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// إخفاء .html من الروابط: /page.html -> /page
app.use((req, res, next) => {
  if (req.path.endsWith('.html') && req.path !== '/index.html') {
    const clean = req.path.slice(0, -5)
    const qs = req.url.slice(req.path.length)
    return res.redirect(301, clean + qs)
  }
  next()
})

app.use(express.static(path.join(__dirname, 'dist'), { extensions: ['html'] }))

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => console.log(`NEXO running on port ${port}`))
