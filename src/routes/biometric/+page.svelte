<script>
  import {onMount} from 'svelte'
  import {authenticate} from '@tauri-apps/plugin-biometric'

  onMount(async () => {
    console.log('biometric')
    const options = {
      // Set true if you want the user to be able to authenticate using phone password
      allowDeviceCredential: false,
      cancelTitle: 'Cancel',
      // iOS only feature
      fallbackTitle: 'Sorry, authentication failed',
      // Android only features
      title: 'Fingerprint encryption',
      // subtitle: 'Fingerprint encryption',
      confirmationRequired: true,
    }

    try {
      await authenticate('New identity will be encrypted.', options)
      console.log('Successfully Authenticated!')
    } catch (err) {
      console.log('Oh no! Authentication failed because ' + err.message)
    }
  })
</script>

<div>
</div>
