import {isRegistered} from '@tauri-apps/plugin-deep-link'
import {checkStatus} from '@tauri-apps/plugin-biometric'

const nostrsigner = async () => {
  try {
    const isNostrSignerRegistered = await isRegistered('nostrsigner')
    console.debug('Registered scheme nostrsigner:', isNostrSignerRegistered)
  } catch (error) {
    console.debug(error)
  }
}

const biometric = async () => {
  try {
    const biometricStatus = await checkStatus()
    if (biometricStatus.isAvailable) {
      console.debug('Yes! Biometric Authentication is available')
    } else {
      console.debug('No! Biometric Authentication is not available:', biometricStatus.error)
    }
  } catch (error) {
    console.debug(error)
  }
}

export {
  nostrsigner,
  biometric,
}
