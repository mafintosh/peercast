# peercast

torrent-stream + chromecast

```
npm install peercast
```

## Node Usage

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
