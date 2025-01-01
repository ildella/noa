import {getCurrentWindow, Window} from '@tauri-apps/api/window'
import {TrayIcon} from '@tauri-apps/api/tray'
import {defaultWindowIcon} from '@tauri-apps/api/app'
import {Menu} from '@tauri-apps/api/menu'
import {enable, isEnabled} from '@tauri-apps/plugin-autostart'
import {closeConnection} from '$lib/relay-connection'
import {nostrsigner, biometric} from '$lib/support'

const quit = itemId => {
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
  const mainWindow = await Window.getByLabel('main')
  // await mainWindow.setVisibleOnAllWorkspaces(true)
  await mainWindow.show()
  // await mainWindow.setEnabled(true)
  await mainWindow.unminimize()
  // await mainWindow.center()
  await mainWindow.setFocus()
}

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
  console.log('Initializing:', platform)
  window.addEventListener('keydown', handleKeydown)
  if (platform === 'linux') {
    await registerTrayIcon()
    await enable()
    console.log(`Registered for autostart? ${await isEnabled()}`)
  }

  // await registerDeepLinkSigner()
  nostrsigner()
    .then(() => ({})).catch(error => console.error(error))
  biometric()
    .then(() => ({})).catch(error => console.error(error))

  // const unlisten = await getCurrentWindow().onFocusChanged(({payload: focused}) => {
  //   console.log('Focus changed, window is focused? ' + focused)
  // })
  // await getCurrentWindow().minimize()
  // await getCurrentWindow().hide()
}
