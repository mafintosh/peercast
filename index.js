var Client = require('castv2-client').Client
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver
var mdns = require('mdns')
var peerflix = require('peerflix')
var network = require('network-address')
var events = require('events')

module.exports = function(torrent, opts) {
  if (!opts) opts = {}

  if (!opts.type) {
    opts.type = function() {
      return 'video/mp4'
    }
  }

  var engine = peerflix(torrent, opts)
  var browser = mdns.createBrowser(mdns.tcp('googlecast'))

  browser.on('serviceUp', function(service) {
    var host = service.addresses[0]
    var client = new Client()

    engine.server.on('listening', function() {
      var addr = 'http://'+network()+':'+engine.server.address().port

      client.connect(host, function(err) {
        if (err) return engine.emit('error', err)

        engine.emit('chromecast-connected')

        client.launch(DefaultMediaReceiver, function(err, player) {
          if (err) return engine.emit('error', err)

          var media = {
            contentId: addr,
            contentType: 'video/mp4',
            streamType: 'BUFFERED', // or LIVE
            metadata: {
              type: 0,
              metadataType: 0,
              title: engine.server.index.name,
              images: []
            }
          }

          player.on('status', function(status) {
            engine.emit('chromecast-status', status)
          })

          engine.emit('chromecast-player', player)

          player.load(media, { autoplay: true }, function(err) {
            if (err) return engine.emit('error', err)
            engine.emit('chromecast-playing', engine.server.index)
          })
        })
      })
    })

    client.on('error', function(err) {
      client.close()
    })

    browser.stop()
  })

  browser.start()

  return engine
}
