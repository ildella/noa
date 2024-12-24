export async function load () {
  const identities = await localStorage.getItem('identities')
  const [{publicKey}] = JSON.parse(identities)
  console.log('Selected identity:', publicKey)
  location.href = `/profile/${publicKey}`
}
