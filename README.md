# peercast

torrent-stream + chromecast

```
npm install peercast
```

## Usage

Be on the same wifi as your chromecast and do

```
peercast magnet:?xt=urn:btih:99feae0a05c6a5dd9af939ffce5ca9b0d16f31b0
```

## Programmatic usage

``` js
var peercast = require('peercast')

var engine = peercast(torrentOrMagnetLink)

engine.on('chromecast-status', function(status) {
  console.log('chromecast status: %s', status.playerState)
})

engine.on('chromecast-playing', function(file) {
  console.log('chromcast is playing %s', file.name)
})
```

## License

MIT
