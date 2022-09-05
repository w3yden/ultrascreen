import { Injectable } from '@angular/core';
import { DataConnection, MediaConnection, Peer } from 'peerjs';
import { Observable, BehaviorSubject } from 'rxjs'

export class PeerConnection {
  peer: Peer
  id: string
  nickname: string
  connected = new BehaviorSubject<boolean>(false)

  constructor(nickname: string) {
    this.nickname = nickname
    this.peer = new Peer()
    this.peer.on('open', (id) => {
      this.connected.next(true)
      this.id = id
      console.log("My ID: %s", id)
    })
    this.peer.on('error', (error) => {
      console.error(error)
    })
  }

  destroy() {
    // TODO: Disconnect all connections
    this.peer.disconnect()
  }

 
}

@Injectable({
  providedIn: 'root'
})
export class PeerJsService {
  public _connection = new BehaviorSubject<PeerConnection>(null)
  readonly connection = this._connection.asObservable();

  constructor() {
  }

  connect(nickname: string, connectedCallback: Function) {
    let peerConnection = new PeerConnection(nickname)
    peerConnection.connected.subscribe((isConnected) => {
      if(isConnected) {
        connectedCallback()
      }
    })
    this._connection.next(peerConnection)
    // TODO: Add callbacks to verify a successful connection
  }

  disconnect() {
    if(this._connection.value !== null) {
      this._connection.getValue().destroy()
      this._connection.next(null)
      console.log("Disconnect.")
    }
  }

}


class PeerJsServiceOld {

  peer: Peer
  peerId: string
  nickname: string
  peerNicknameDictionary: {[key: string]: string}
  connections: { [key: string]: DataConnection}
  isAlive: boolean
  isStreaming: boolean
  connectionCallback: Function
  mediaCallback: Function
  calls: MediaConnection[]
  currentStream: MediaStream
  mediaObjects: {[key: string]: MediaStream}

  constructor (connectionCallback: Function, mediaCallback: Function, nickname: string) {
    this.peer = null
    this.peerId = '-'
    this.nickname = nickname
    this.peerNicknameDictionary = {}
    this.connections = {}
    // this.toaster = toaster
    this.connectionCallback = connectionCallback
    this.mediaCallback = mediaCallback
    this.calls = []
    this.isStreaming = false
    this.isAlive = true
    this.mediaObjects = {}
    this.currentStream = null

  }

  create () {
    this.peer = new Peer()
    /*this.peer.on('open', (id) => { this.onPeerServerConnected(id) })
    this.peer.on('connection', (conn) => { this.onPeerConnection(conn) })
    this.peer.on('error', UltraPeer.onError)
    this.peer.on('call', (call) => { this.onPeerCall(call) })
    console.log('Created Peer')
    */
  }
  static onError (err) {
    console.log(err)
  }

  connect (remoteId: string) {
    if (remoteId === '' || remoteId === this.peerId || this.connections.hasOwnProperty(remoteId)) {
      return
    }
    let conn = this.peer.connect(remoteId)
    // conn.on('error', PeerJsService.onError)
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

  get conns () {
    return this.connections
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
    this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
    console.log(this.connections)
    console.log('Disconnected')
    if (Object.keys(this.connections).length === 0 && !this.isAlive) {
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
          this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
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
          this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
        }
      }
    } else if (data.hasOwnProperty('nickname')) {
      this.peerNicknameDictionary[conn.peer] = data.nickname
      this.connectionCallback(this.connections, this.peerNicknameDictionary)
      console.log(this.peerNicknameDictionary)
    }
  }


  static onCallClose () {
    console.log('Call closed')
  }

  initiateStreamCall (remoteId, stream: MediaStream) {
    console.log(stream)
    let call = this.peer.call(remoteId, stream)
    // call.on('error', PeerJsService.onError)
    this.calls.push(call)
    console.log('Calling remote ' + remoteId)
  }

  destroy (eventHandler) {
    console.log(this.connections)
    for (let remoteId in this.connections) {
      this.disconnect(remoteId)
    }
    this.isAlive = false
    if (Object.keys(this.connections).length === 0) {
      this.kill()
    }
  }

  kill () {
    this.peer.destroy()
    this.peerId = ''
    this.connections = {}
    this.calls = []
    this.isStreaming = false
    this.mediaObjects = {}
    this.currentStream = null
  }


  startStream (stream) {
    this.mediaObjects[this.peerId] = stream
    this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
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
    this.mediaCallback(this.mediaObjects, this.peerNicknameDictionary)
    for (let i in this.calls) {
      let call = this.calls[i]
      if (call.localStream) {
        call.close()
      }
    }
    this.currentStream = null
    this.isStreaming = false
  }
}
