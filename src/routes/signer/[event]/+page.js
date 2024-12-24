export function load ({url, params}) {
  const {searchParams} = url
  const {event} = params
  // console.debug(href)
  const callbackUrl = searchParams.get('callbackUrl')
  // const compressionType = searchParams.get('compressionType')
  // const returnType = searchParams.get('returnType')
  const type = searchParams.get('type')
  // console.debug('event', event)
  // console.debug('callbackUrl', callbackUrl)
  // console.debug('compressionType', compressionType)
  // console.debug('returnType', returnType)
  // console.debug('type', type)
  return {
    event: JSON.parse(event),
    callbackUrl,
    type,
  }
}
