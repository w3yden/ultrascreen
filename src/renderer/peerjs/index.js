import Peer from 'peerjs'

export default class UltraPeer {
  constructor (connectionCallback, mediaCallback, nickname, toaster) {
    this.peer = null
    this.peerId = '-'
    this.nickname = nickname
    this.peerNickname = {}
    this.connections = {}
    this.toaster = toaster
    this.connectionCallback = connectionCallback
    this.mediaCallback = mediaCallback
    this.calls = []
    this.isStreaming = false
    this.mediaObjects = {}
    this.alive = true
    this.currentStream = null
    window.onbeforeunload = (e) => {
      this.destroy()
    }
  }
  static onError (err) {
    console.log(err)
  }
  get conns () {
    return this.connections
  }
  onPeerServerConnected (id) {
    this.peerId = id
    this.peerNickname[id] = this.nickname
    this.connectionCallback(this.connections, this.peerNickname)
  }
  onConnectionOpen (conn) {
    console.log(conn.peer + ' connected!')
    this.connections[conn.peer] = conn
    this.connectionCallback(this.connections)
    if (this.isStreaming) {
      this.initiateStreamCall(conn.peer, this.currentStream)
    }
    this.connections[conn.peer].send({nickname: this.nickname})
  }
  onConnectionClose (conn) {
    this.connections[conn.peer].close()
    delete this.mediaObjects[conn.peer]
    delete this.connections[conn.peer]
    this.connectionCallback(this.connections)
    this.mediaCallback(this.mediaObjects, this.peerNickname)
    console.log(this.connections)
    this.toaster.error(conn.peer + ' (' + this.peerNickname[conn.peer] + ') ' + ' disconnected', {
      position: 'bottom-right',
      duration: 3000
    })
    console.log('Disconnected')
    if (Object.keys(this.connections).length === 0 && !this.alive) {
      this.kill()
    }
  }
  onConnectionData (data, conn) {
    console.log('Got data: ')
    console.log(data)
    if (data === 'CLOSE') {
      console.log('Close his call')
      for (let i in this.calls) {
        let call = this.calls[i]
        if (call.peer === conn.peer) {
          call.close()
          console.log('Closed call to: ' + call.peer)
          delete this.mediaObjects[call.peer]
          this.mediaCallback(this.mediaObjects, this.peerNickname)
        }
      }
      conn.close()
    } else if (data === 'STOP-MY-STREAM') {
      for (let i in this.calls) {
        let call = this.calls[i]
        if (call.peer === conn.peer && call.remoteStream) {
          call.close()
          console.log('Closed call to: ' + call.peer)
          delete this.mediaObjects[call.peer]
          this.mediaCallback(this.mediaObjects, this.peerNickname)
        }
      }
    } else if (data.hasOwnProperty('nickname')) {
      this.peerNickname[conn.peer] = data.nickname
      this.toaster.success(conn.peer + ' (' + this.peerNickname[conn.peer] + ') ' + ' connected', {
        position: 'bottom-right',
        duration: 3000
      })
      this.connectionCallback(this.connections, this.peerNickname)
      console.log(this.peerNickname)
    }
  }
  onPeerConnection (conn) {
    conn.on('data', (data) => {
      this.onConnectionData(data, conn)
    })
    conn.on('open', () => {
      this.onConnectionOpen(conn)
    })
    conn.on('close', () => {
      this.onConnectionClose(conn)
    })
    conn.on('error', UltraPeer.errorHandler)
  }
  onCallStream (stream, call) {
    console.log('Got stream')
    console.log(this)
    console.log(stream)
    this.mediaObjects[call.peer] = stream
    this.mediaCallback(this.mediaObjects, this.peerNickname)
  }
  static onCallClose () {
    console.log('Call closed')
  }
  onPeerCall (call) {
    console.log('Receiving a call from: ' + call.peer)
    call.answer()
    this.calls.push(call)
    call.on('error', UltraPeer.onError)
    call.on('stream', (stream) => { this.onCallStream(stream, call) })
    call.on('close', UltraPeer.onCallClose)
  }
  initiateStreamCall (remoteId, stream) {
    console.log(stream)
    let call = this.peer.call(remoteId, stream)
    call.on('error', UltraPeer.onError)
    this.calls.push(call)
    console.log('Calling remote ' + remoteId)
  }
  connect (remoteId) {
    if (remoteId === '' || remoteId === this.peerId || this.connections.hasOwnProperty(remoteId)) {
      return
    }
    let conn = this.peer.connect(remoteId)
    conn.on('error', UltraPeer.onError)
    conn.on('data', (data) => {
      this.onConnectionData(data, conn)
    })
    conn.on('open', () => {
      this.onConnectionOpen(conn)
    })
    conn.on('close', () => {
      this.onConnectionClose(conn)
    })
    console.log('Connecting...')
  }
  disconnect (remoteId) {
    console.log('Disconnect: ' + remoteId)
    console.log(this.connections)
    this.connections[remoteId].send('CLOSE')
    console.log(this.calls)
    for (let i in this.calls) {
      let call = this.calls[i]
      if (call.peer === remoteId) {
        call.close()
        console.log('Closed call to: ' + call.peer)
      }
    }
    setTimeout(() => {
      if (this.connections[remoteId]) {
        this.connections[remoteId].close()
      }
    }, 500)
  }
  startStream (stream) {
    this.mediaObjects[this.peerId] = stream
    this.mediaCallback(this.mediaObjects, this.peerNickname)
    this.isStreaming = true
    this.currentStream = stream
    for (let remoteId in this.connections) {
      this.initiateStreamCall(remoteId, stream)
    }
  }
  stopStream () {
    this.currentStream.getTracks().forEach(function (track) {
      track.stop()
    })
    for (let remoteId in this.connections) {
      this.connections[remoteId].send('STOP-MY-STREAM')
    }
    delete this.mediaObjects[this.peerId]
    this.mediaCallback(this.mediaObjects, this.peerNickname)
    for (let i in this.calls) {
      let call = this.calls[i]
      if (call.localStream) {
        call.close()
      }
    }
    this.currentStream = null
    this.isStreaming = false
  }
  create () {
    this.peer = new Peer()
    this.peer.on('open', (id) => { this.onPeerServerConnected(id) })
    this.peer.on('connection', (conn) => { this.onPeerConnection(conn) })
    this.peer.on('error', UltraPeer.onError)
    this.peer.on('call', (call) => { this.onPeerCall(call) })
    console.log('Created Peer')
  }
  destroy (eventHandler) {
    console.log(this.connections)
    for (let remoteId in this.connections) {
      this.disconnect(remoteId)
    }
    this.alive = false
    this.finishDestroy = eventHandler
    if (Object.keys(this.connections).length === 0) {
      this.kill()
      this.finishDestroy()
    }
  }
  kill () {
    this.peer.destroy()
    this.peerId = ''
    this.connections = {}
    this.calls = []
    this.isStreaming = false
    this.mediaObjects = []
    this.currentStream = null
    this.finishDestroy()
  }
}
