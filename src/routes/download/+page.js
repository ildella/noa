export async function load ({fetch}) {
  const response = await fetch('https://api.github.com/repos/ildella/noa/releases/latest')
  const {tag_name: lastVersion} = await response.json()
  const githubBaseUrl = `https://github.com/ildella/noa/releases/download/${lastVersion}`
  const platforms = {
    Linux: [
      {name: 'Deb', link: `${githubBaseUrl}/NOA_0.6.7_amd64.deb `, icon: 'debian.png'},
      {name: 'RPM', link: `${githubBaseUrl}/NOA-0.6.7-1.x86_64.rpm `, icon: 'redhat.png'},
      // {name: 'Flatpak', link: '#flatpak-link', icon: 'linux.gif'},
      // {name: 'Snap', link: '#snap-link', icon: 'linux.gif'},
    ],
    macOS: [
      {name: 'DMG aarch64', link: `${githubBaseUrl}/NOA_0.6.7_aarch64.dmg`, icon: 'apple.png'},
      {name: 'DMG x64', link: `${githubBaseUrl}/NOA_0.6.7_x64.dmg`, icon: 'apple.png'},
      {name: 'App (tar.gz) aarch64', link: `${githubBaseUrl}/NOA_aarch64.app.tar.gz`, icon: 'apple.png'},
      {name: 'App (tar.gz) x64', link: `${githubBaseUrl}/NOA_x64.app.tar.gz`, icon: 'apple.png'},
    ],
    Windows: [
      {name: 'MSI Installer', link: `${githubBaseUrl}/NOA_0.6.7_x64_en-US.msi`, icon: 'windows.png'},
      // {name: 'EXE Installer', link: `${githubBaseUrl}/`, icon: 'windows.png'},
    ],
    Android: [
      {name: 'APK', link: `${githubBaseUrl}/app-arm64-release.apk`, icon: 'android.png'},
      {name: 'ZapStore', link: 'zapstore://tools.frankie.nostr.noa', icon: 'zapstore.png'},
      // {name: 'Google Play Store', link: '#google-play-store-link', icon: 'android-store.png'},
    ],
  }

  return {
    platforms,
  }
}
