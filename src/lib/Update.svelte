<script>
  import axios from 'axios'
  import semver from 'semver'
  import {onMount} from 'svelte'
  import {open} from '@tauri-apps/plugin-shell'
  import {page} from '$app/state'
  // import { join, downloadDir } from '@tauri-apps/api/path'

  const {data: {platform, about: {currentVersion}}} = page

  let isLoading = $state(false)
  let isNewVersionAvailable = $state(false)
  // let networkError = $state(false)
  // let blobAvailable = $state({})
  let apkDownloadedUrl = $state()

  /* eslint-disable no-undef */
  const packageFolder = platform === 'android'
    ? 'apk'
    : 'linux'
  const filename = platform === 'android'
    ? `noa-app-arm64-${releaseType}.apk`
    : `NOA_amd64-${releaseType}.deb`
  const packageUrl = `${packagesCdnUrl}/${releaseType}/${packageFolder}/${filename}`
  const releasesUrl = `${packagesCdnUrl}/${releaseType}/release.json`
  /* eslint-enable no-undef */

  const openRemote = async () => {
    isLoading = true
    try {
      console.info('Fetch new apk from:', packageUrl)
      await open(packageUrl)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading = false
    }
  }

  const install = async () => {
    isLoading = true
    try {
      // console.info('Instaling update from:', apkFilePath)
      // await open(apkFilePath)
      console.info('Instaling update from:', apkDownloadedUrl)
      await open(apkDownloadedUrl)
      isNewVersionAvailable = false
      console.info('Install completed.')
    } catch (error) {
      console.error(error)
    } finally {
      isLoading = false
    }
  }

  const download = async () => {
    isLoading = true
    const {status, data} = await axios(packageUrl, {
      responseType: 'blob',
      onDownloadProgress: ({progress}) => {
        console.debug(Number(progress).toFixed(2))
      },
    })
    if (status === 200) {
      // console.debug(headers)
      // const type = 'application/vnd.android.package-archive'
      const type = data.type || 'application/octet-stream'
      console.debug('data.type', type)
      const blob = new Blob([data], {type})
      // blobAvailable = {
      //   href: window.URL.createObjectURL(blob),
      //   filename: 'noa.apk',
      //   type,
      // }
      const blobObjectUrl = window.URL.createObjectURL(blob)
      apkDownloadedUrl = blobObjectUrl.replaceAll('blob:', '')
      // const basePath = await downloadDir()
      // apkFilePath = await join(basePath, 'noa.apk')
      // console.log('writing file to:', apkFilePath)
      // await writeFile(apkFilePath, new Uint8Array(await blob.arrayBuffer()))
      // await writeFile('noa.apk', new Uint8Array(await blob.arrayBuffer()), {
      //   baseDir: Download,
      // })
      console.log('Download completed.', apkDownloadedUrl)
      isLoading = false
    } else {
      console.warn('APK download failed:', {status})
    }
  }

  const action = $derived.by(() => {
    console.log('apkDownloadedUrl: ', apkDownloadedUrl)
    if (isNewVersionAvailable && !apkDownloadedUrl)
      return {label: 'Upgrade', run: download}
    if (isNewVersionAvailable && apkDownloadedUrl)
      return {label: 'Install', run: install}
    return ''
  })

  onMount(() => {
    // console.debug('check for release:', releasesUrl)
    if (currentVersion === 'Web') return
    axios(releasesUrl, {timeout: 2500}).then(({data: {version: publishedVersion}}) => {
      // console.debug('Current version:', currentVersion)
      // console.debug('Last published release:', publishedVersion)
      if (semver.gt(publishedVersion, currentVersion)) {
        console.info('New release available.', publishedVersion)
        isNewVersionAvailable = true
      }
    })
      .catch(error => {
        // networkError = true
        console.warn(`
        Can't check new release at ${releasesUrl} cause '${error.code}: ${error.message}'
      `)
      })
  })

</script>

<div class='fixed bottom-0 left-0 right-0 p-0'>
  <!--   {#if networkError}
    <button
      class='custom-mid-warn-button w-full flex items-center justify-center'
      disabled={isLoading}
    >Network error. Click to see logs.</button>
  {/if} -->
  {#if isNewVersionAvailable}
    <button
      class='custom-bottom-button w-full flex items-center justify-center'
      onclick={() => openRemote()}
      disabled={isLoading}
    >
      <span>{action.label}</span>
      <svg
        class='animate-spin h-5 w-5 mr-2 ml-2 {isLoading ? '' : 'hidden'}'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          class='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          stroke-width='4'
        ></circle>
        <path
          class='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8v8H4z'
        ></path>
      </svg>
    </button>
  {/if}
</div>
