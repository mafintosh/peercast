var peerflix = require('peerflix')
var network = require('network-address')
var player = require('chromecast-player');

process.on('SIGINT', function() {
  // we're doing some heavy lifting so it can take some time to exit... let's
  // better output a status message so the user knows we're working on it :)
  console.log('\nPeercast is exiting...')
  process.exit()
})

module.exports = function(torrent, opts) {
  if (!opts) opts = {}
  var engine = peerflix(torrent, opts)

  engine.server.on('listening', function() {
    var addr = 'http://'+network()+':'+engine.server.address().port
    player({
      path: addr,
      type: opts.type || 'video/mp4',
      metadata: { title: engine.server.index.name }
    }, function(err, p) {
      if (err) return engine.emit('error', err)
      p.on('status', function(status) {
        engine.emit('chromecast-status', status)
      })
      engine.emit('chromecast-player', p)
      engine.emit('chromecast-playing', engine.server.index)
    });
  })

  return engine
}
