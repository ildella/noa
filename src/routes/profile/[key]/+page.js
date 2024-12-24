export async function load ({params}) {
  const {key: publicKey} = params
  const profile = await localStorage.getItem(publicKey)
  return {
    publicKey,
    profile: profile
      ? JSON.parse(profile)
      : {
        name: '',
        about: '',
        display_name: '',
        website: '',
        bot: false,
        // picture: '',
        // banner: '',
      },
  }
}
