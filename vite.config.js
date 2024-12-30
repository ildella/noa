import {defineConfig} from 'vite'
import {sveltekit} from '@sveltejs/kit/vite'

const host = process.env.TAURI_DEV_HOST
const platform = process.env.TAURI_ENV_PLATFORM
const debugMode = Boolean(process.env.TAURI_ENV_DEBUG)
console.debug({host, platform, debugMode})

const packagesCdnUrl = 'https://packages.frankie.tools/noa'
const releaseType = debugMode
  ? 'debug'
  : 'release'

const assets = {
  target: 'http://localhost:3000',
  changeOrigin: true,
  // rewrite: (path) =>
  //   path.replace(/^\/.well-known\/assetlinks.json/, 'assetlinks.json'),
  secure: false,
  ws: false,
  // configure: (proxy, options) => {
  //   proxy.on('error', (err, request, response) => {
  //     console.log('proxy error', err)
  //   })
  //   proxy.on('proxyReq', (proxyReq, request, response) => {
  //     console.log('Sending Request to the Target:', request.method, request.url)
  //     // console.log(request.headers)
  //   })
  //   proxy.on('proxyRes', (proxyRes, request, response) => {
  //     console.log('Response:', proxyRes.statusCode, request.url)
  //   })
  // },
}

export default defineConfig({
  plugins: [
    sveltekit(),
  ],
  // Vite options tailored for Tauri development.
  // Only applied in `tauri dev` or `tauri build`
  define: {
    PLATFORM: JSON.stringify(platform),
    packagesCdnUrl: JSON.stringify(packagesCdnUrl),
    releaseType: JSON.stringify(releaseType),
  },
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1520,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: 'ws',
        host,
        port: 1521,
      }
      // eslint-disable-next-line no-undefined
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: [
        '**/src-tauri/**',
        '**/test-results/**',
        // '**/playwright-report/**',
      ],
    },
    proxy: {'/.well-known/assetlinks.json': assets},
  },
  resolve: process.env.VITEST
    ? {conditions: ['browser']}
    // eslint-disable-next-line no-undefined
    : undefined,
})
