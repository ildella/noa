import {getCurrentWindow, Window} from '@tauri-apps/api/window'
// import {Webview} from '@tauri-apps/api/webview'
// import {WebviewWindow} from '@tauri-apps/api/webviewWindow'
import {TrayIcon} from '@tauri-apps/api/tray'
import {defaultWindowIcon} from '@tauri-apps/api/app'
import {Menu} from '@tauri-apps/api/menu'
import {enable, isEnabled} from '@tauri-apps/plugin-autostart'
import {closeConnection} from '$lib/relay-connection'

const quit = itemId => {
  console.log(itemId)
  closeConnection()
  getCurrentWindow().hide()
  if (itemId === 'quit')
    return getCurrentWindow().close()
}

const show = async () => {
  // const isVisible = await getCurrentWindow().isVisible()
  // const isMinimized = await getCurrentWindow().isMinimized()
  // const innerPosition = await getCurrentWindow().innerPosition()
  // const outerPosition = await getCurrentWindow().outerPosition()
  // console.log(isVisible, isMinimized)
  // console.log(innerPosition)
  // console.log(outerPosition)
  const mainWindow = await Window.getByLabel('main')
  console.log(mainWindow)
  // const result = await mainWindow.setVisibleOnAllWorkspaces(true)
  const showed = await mainWindow.show()
  const enabled = await mainWindow.setEnabled(true)
  // const unminimized = await mainWindow.unminimize()
  // const centered = await mainWindow.center()
  const focused = await mainWindow.setFocus()
  // console.log(focused, presented, enabled, showed, unminimized, centered)
}

// const testOpenWindow = () => {
//   // const appWindow = new Window('Signer')
//   // // const webview = new Webview(appWindow, 'Signer', {url: '/identities'})

//   // appWindow.once('tauri://created', () => {
//   //   console.log('created window')
//   // })
//   // appWindow.once('tauri://error', error => {
//   //   console.warn('error', error)
//   // })
//   // await webview.emit('some-event', 'data')
//   // const unlisten = await webview.listen('event-name', event => {
//   //   console.log('event', event)
//   // })
//   // unlisten()
//   const url = '/src/routes/about/+page.svelte'
//   const webview = new WebviewWindow('Test', {url})
//   webview.once('tauri://created', () => {
//     console.log('created webview window')
//   })
//   webview.once('tauri://error', error => {
//     console.warn('error', error)
//   })
// }

// const sign = ({decoded}) => {
//   console.log(decoded)
//   // const url = `/src/routes/signer/xxxxxxx/+page.svelte`
//   // const url = '/src/routes/about/+page.svelte'
//   // // console.log(url)
//   // const webview = new WebviewWindow('Signer', {url})
//   // webview.once('tauri://created', () => {
//   //   console.log('created webview window')
//   // })
//   // webview.once('tauri://error', error => {
//   //   console.warn('error', error)
//   // })
// }

const handleKeydown = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'q') {
    event.preventDefault()
    return quit()
  }
}

const registerTrayIcon = async () => {
  const menu = await Menu.new({
    items: [
      {
        id: 'quit',
        text: 'Quit',
        action: quit,
      },
      {
        id: 'show',
        text: 'Show',
        action: show,
      },
    ],
  })
  const options = {
    icon: await defaultWindowIcon(),
    menu,
    menuOnLeftClick: true,
  }
  await TrayIcon.new(options)
}

export async function init () {
  // eslint-disable-next-line no-undef
  const platform = PLATFORM
  console.log('INIT.', {platform})
  window.addEventListener('keydown', handleKeydown)
  await registerTrayIcon()
  // await registerDeepLinkSigner()
  await enable()
  console.log(`Registered for autostart? ${await isEnabled()}`)

  // const unlisten = await getCurrentWindow().onFocusChanged(({payload: focused}) => {
  //   console.log('Focus changed, window is focused? ' + focused)
  // })
  // await getCurrentWindow().minimize()
  // await getCurrentWindow().hide()
}
