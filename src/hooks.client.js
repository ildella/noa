import {getCurrentWindow, Window} from '@tauri-apps/api/window'
import {Webview} from '@tauri-apps/api/webview'
import {WebviewWindow} from '@tauri-apps/api/webviewWindow'
import {TrayIcon} from '@tauri-apps/api/tray'
import {defaultWindowIcon} from '@tauri-apps/api/app'
import {Menu} from '@tauri-apps/api/menu'
import {closeConnection} from '$lib/relay-connection'

const quit = itemId => {
  console.log(itemId)
  closeConnection()
  getCurrentWindow().close()
}

// eslint-disable-next-line max-statements
const show = async () => {
  const isVisible = await getCurrentWindow().isVisible()
  const isMinimized = await getCurrentWindow().isMinimized()
  const innerPosition = await getCurrentWindow().innerPosition()
  const outerPosition = await getCurrentWindow().outerPosition()
  console.log(isVisible, isMinimized)
  console.log(innerPosition)
  console.log(outerPosition)
  // const allWindows = await Window.getAll()
  const mainWindow = await Window.getByLabel('main')
  console.log(mainWindow)
  const result = await mainWindow.setVisibleOnAllWorkspaces(true)
  const showed = await mainWindow.show()
  const enabled = await mainWindow.setEnabled(true)
  const unminimized = await mainWindow.unminimize()
  const centered = await mainWindow.center()
  const focused = await mainWindow.setFocus()
  console.log(focused, result, enabled, showed, unminimized, centered)
}

const sign = async () => {
  // const appWindow = new Window('Signer')
  // // const webview = new Webview(appWindow, 'Signer', {url: '/identities'})

  // appWindow.once('tauri://created', () => {
  //   console.log('created window')
  // })
  // appWindow.once('tauri://error', error => {
  //   console.warn('error', error)
  // })
  // await webview.emit('some-event', 'data')
  // const unlisten = await webview.listen('event-name', event => {
  //   console.log('event', event)
  // })
  // unlisten()
  const webview = new WebviewWindow('Signer', {url: '/about'})
  webview.once('tauri://created', () => {
    console.log('created webview window')
  })
  webview.once('tauri://error', error => {
    console.warn('error', error)
  })
}

export async function init () {
  console.log('INIT.')
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
      {
        id: 'sign',
        text: 'Sign',
        action: sign,
      },
    ],
  })
  const options = {
    icon: await defaultWindowIcon(),
    menu,
    menuOnLeftClick: true,
  }
  const tray = await TrayIcon.new(options)
  // const unlisten = await getCurrentWindow().onFocusChanged(({payload: focused}) => {
  //   console.log('Focus changed, window is focused? ' + focused)
  // })

  // await getCurrentWindow().minimize()
  // await getCurrentWindow().hide()
}
