export function load ({url, params}) {
  const {searchParams} = url
  const {event} = params
  console.log('href:', url.href)
  const callbackUrl = searchParams.get('callbackUrl')
  // const compressionType = searchParams.get('compressionType')
  // const returnType = searchParams.get('returnType')
  // const type = searchParams.get('type')
  console.log('event', event)
  // console.log('callbackUrl', callbackUrl)
  // console.log('compressionType', compressionType)
  // console.log('returnType', returnType)
  // console.log('type', type)
  console.log('Sign request URL parsed ok, loading page now.')
  return {
    event: JSON.parse(event),
    callbackUrl,
    // type,
  }
}
