#!/usr/bin/env node

var peercast = require('./')
var prettysize = require('prettysize')
var log = require('single-line-log').stdout
var readTorrent = require('read-torrent')

if (process.argv.length < 3) {
  console.error('Usage: peercast torrent-or-magnet-link')
  process.exit(1)
}

readTorrent(process.argv[2], function(err, torrent) {
  if (err) {
    console.error(err.message)
    process.exit(2)
  }

  var engine = peercast(torrent)
  var status = 'connecting'
  var hs = 0

  var notChoked = function(result, wire) {
    return result + (wire.peerChoking ? 0 : 1)
  }

  engine.on('chromecast-status', function(st) {
    status = st.playerState.toLowerCase()
  })

  engine.on('hotswap', function() {
    hs++
  })

  var render = function() {
    var down = prettysize(engine.swarm.downloaded)
    var downSpeed = prettysize(engine.swarm.downloadSpeed()).replace('Bytes', 'b')+'/s'
    var up = prettysize(engine.swarm.uploaded)
    var upSpeed = prettysize(engine.swarm.uploadSpeed()).replace('Bytes', 'b')+'/s'

    log(
      'Chromecast is '+status+'\n'+
      'Connected to '+engine.swarm.wires.reduce(notChoked, 0)+'/'+engine.swarm.wires.length+' peers\n'+
      'Downloaded '+down+' ('+downSpeed+') with '+hs+' hotswaps\n'+
      'Uploaded '+up+ ' ('+upSpeed+')\n'
    )
  }

  var interval = setInterval(render, 500)
  render()
})