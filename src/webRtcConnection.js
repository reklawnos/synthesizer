import * as timesync from 'timesync';
import Peer from 'peerjs';

// This was mostly taken from the Peer.js example from timesync, see
// https://github.com/enmasseio/timesync
export default function connect(peers, audioCtx, onOpen) {
  const domSystemTime = document.getElementById('systemTime');
  const domSyncTime   = document.getElementById('syncTime');
  const domOffset     = document.getElementById('offset');
  const domSyncing    = document.getElementById('syncing');

  const ts = timesync.create({
    peers: [], // start empty, will be updated at the start of every synchronization
    interval: peers.length > 0 ? 5000 : null,
    delay: 200,
    timeout: 1000,
    now: () => audioCtx.currentTime,
  });

  ts.on('sync', function (state) {
    console.log('sync ' + state);
    if (state === 'start') {
      ts.options.peers = openConnections();
      console.log('syncing with peers [' + ts.options.peers.join(', ') + ']');
      if (ts.options.peers.length) {
        domSyncing.innerHTML = 'syncing with ' + ts.options.peers.join(', ') + '...';
      }
    }
    if (state === 'end') {
      domSyncing.innerHTML = '';
    }
  });

  ts.on('change', function (offset) {
    console.log('changed offset: ' + offset);
    domOffset.innerHTML = `Offset: ${offset.toFixed(1)}s`;
  });

  ts.send = function (id, data) {
    //console.log('send', id, data);
    const all = peer.connections[id];
    const conn = all && all.filter(function (conn) {
      return conn.open;
    })[0];

    if (conn) {
      conn.send(data);
    }
    else {
      console.log(new Error('Cannot send message: not connected to ' + id).toString());
    }
  };

  // show the system time and synced time once a second on screen
  function updateDisplay() {
    domSystemTime.innerText = `Local time: ${audioCtx.currentTime.toFixed(2)}`;
    domSyncTime.innerText   = `Synced time: ${ts.now().toFixed(2)}`;

    setTimeout(updateDisplay, 100);
  }
  setTimeout(updateDisplay, 100);

  // Create a new Peer with the demo API key
  const peer = new Peer({
    host: 'synth-beat-connection.herokuapp.com',
    port: '443',
    secure: true,
    debug: 1,
  });
  peer.on('open', connectToPeers);
  peer.on('connection', setupConnection);

  function openConnections() {
    if (!peer.connections) {
      return [];
    }
    return Object.keys(peer.connections).filter(function (id) {
      return peer.connections[id].some(function (conn) {
        return conn.open;
      });
    });
  }

  function connectToPeers() {
    onOpen(peer);
    peers
        .filter(function (id) {
          return !peer.connections || peer.connections[id] === undefined;
        })
        .forEach(function (id) {
          console.log('connecting with ' + id + '...');
          const conn = peer.connect(id);
          setupConnection(conn);
        });
  }

  function setupConnection(conn) {
    conn
        .on('open', function () {
          console.log('connected with ' + conn.peer);
        })
        .on('data', function(data) {
          //console.log('receive', conn.peer, data);
          ts.receive(conn.peer, data);
        })
        .on('close', function () {
          console.log('disconnected from ' + conn.peer);
        })
        .on('error', function (err) {
          console.log('Error', err);
        });
  }

  // check whether there are connections missing every 10 sec
  setInterval(connectToPeers, 10000);

  return {
    peer: peer,
    ts: ts
  };
}
