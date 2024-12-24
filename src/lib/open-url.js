import {open as shellOpen} from '@tauri-apps/plugin-shell'

export const open = url => {
  // eslint-disable-next-line no-undef
  if (PLATFORM) {
    return shellOpen(url)
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
