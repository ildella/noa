// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
import adapter from '@sveltejs/adapter-static'
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte'

const staticConfig = {
  fallback: 'index.html',
  pages: 'build',
  assets: 'build',
  precompress: false,
  strict: true,
}

const config = {
  kit: {adapter: adapter(staticConfig)},
  preprocess: vitePreprocess(),
}

export default config
