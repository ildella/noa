import {redirect} from '@sveltejs/kit'

export async function load ({parent}) {
  const {identities} = await parent()
  if (identities)
    redirect(302, '/home')
}
