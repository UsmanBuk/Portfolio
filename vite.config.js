import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const MIME_TYPES = {
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.css': 'text/css; charset=utf-8'
}

const SERVE_EXTENSIONS = new Set(Object.keys(MIME_TYPES))

function serveAndCopyStatic() {
  const isStaticUrl = (url) =>
    url.startsWith('/assets/') || url.startsWith('/case-studies/')

  const resolveStaticPath = (url) =>
    path.join(__dirname, url.replace(/^\//, '').replace(/\//g, path.sep))

  return {
    name: 'serve-and-copy-static',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent((req.url || '').split('?')[0])
          if (!isStaticUrl(url)) {
            next()
            return
          }

          const filePath = resolveStaticPath(url)
          const ext = path.extname(filePath).toLowerCase()
          if (!SERVE_EXTENSIONS.has(ext)) {
            next()
            return
          }

          if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
            next()
            return
          }

          res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
        })
      }
    },
    closeBundle() {
      const dist = path.join(__dirname, 'dist')
      const copy = (src, dest) => {
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true })
        }
      }

      copy(path.join(__dirname, 'assets'), path.join(dist, 'assets'))
      copy(path.join(__dirname, 'case-studies'), path.join(dist, 'case-studies'))

      const reactStyle = path.join(__dirname, 'src', 'styles', 'style.css')
      const caseStudyStyle = path.join(dist, 'assets', 'css', 'style.css')
      if (fs.existsSync(reactStyle)) {
        fs.mkdirSync(path.dirname(caseStudyStyle), { recursive: true })
        fs.copyFileSync(reactStyle, caseStudyStyle)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), serveAndCopyStatic()],
  publicDir: false,
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        schedule: path.resolve(__dirname, 'schedule.html')
      }
    }
  }
})
