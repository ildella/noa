export async function load () {
  const identities = await localStorage.getItem('identities')
  const [{publicKey}] = JSON.parse(identities)
  location.href = `/profile/${publicKey}`
}
