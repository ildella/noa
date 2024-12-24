const http = require('http')

// eslint-disable-next-line @stylistic/js/max-len
const sha256CertFingerprint = '1F:AF:60:C7:BE:E0:30:FE:DC:19:40:62:34:DA:E3:48:02:F6:FC:A9:5B:95:3F:98:A8:E6:1E:D4:7F:C4:5F:E0'

const assetLinksJson = JSON.stringify([
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'tools.frankie.nostr.noa',
      sha256_cert_fingerprints: [sha256CertFingerprint],
    },
  },
])

const server = http.createServer((req, res) => {
  console.log(req.url)
  if (req.url === '/.well-known/assetlinks.json') {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(assetLinksJson)
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not Found')
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
