<template>
    <div class="connections">
        <h5>Connections</h5>
        <ul class="list-group">
            <li class="list-group-item connection-item" v-for="remote in connections">
                <span class="dot" :class="currentlyStreaming[remote] ? 'streaming' : 'online'"></span>
                {{resolveNickname[remote]}}(<span class="small">{{remote}}</span>)
                <div class="remove" @click="disconnect(remote)">X</div>
            </li>
        </ul>
        <div>
            <input id="remoteInput" placeholder="Remote ID" type="text" class="form-control form-control-sm" v-model="connectionPeerId" />
            <button id="addConn-btn" class="btn btn-primary btn-sm" @click="connect(connectionPeerId)">+</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Connections',
    data () {
      return {
        connectionPeerId: ''
      }
    },
    props: {
      connections: Array,
      ultraPeer: Object,
      mediaObjects: Array,
      peerNicknames: Object
    },
    computed: {
      currentlyStreaming () {
        let streaming = {}
        for (let i = 0; i < this.mediaObjects.length; i++) {
          streaming[this.mediaObjects[i].owner] = true
        }
        return streaming
      },
      resolveNickname () {
        let emptyNicknames = {}
        for (let i in this.connections) {
          emptyNicknames[this.connections[i]] = '-'
        }
        return Object.assign(emptyNicknames, this.peerNicknames)
      }
    },
    methods: {
      disconnect (id) {
        this.ultraPeer.disconnect(id)
      },
      connect (id) {
        this.ultraPeer.connect(id)
        this.connectionPeerId = ''
      },
      isStreaming (remoteId) {
        for (let i = 0; i < this.mediaObjects.length; i++) {
          if (this.mediaObjects[i].owner === remoteId) {
            return true
          }
        }
        return false
      },
      nicknameResolve (id) {
        return this.ultraPeer.peerNickname[id]
      }
    }
  }
</script>

<style scoped>

    li {
        height: 25px;
        line-height: 0;
        text-align: left;
    }

    .connections {
        text-transform: uppercase;
        margin-top: 10px;
        text-align: center;
        width: 100%;
    }

    .dot {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        display: inline-block;
        align-self: center;
        margin-right: 5px;
    }

    .online {
        background-color: mediumseagreen;
        border: 1px solid green;
    }

    .streaming {
        background-color: blueviolet;
        border: 1px solid darkviolet;
    }

    .connection-item {
        padding-left: 10px;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        margin-bottom: 3px;
        font-size: 0.9em;
    }

    #addConn-btn{
        float: right;
        font-size: 0.7em;
    }

    #remoteInput {
        width: 87%;
        float: left;
        font-size: 0.7em;
    }

    .remove {
        justify-self: flex-end;
        justify-content: flex-end;
        right: 5px;
        position: absolute;
        display: inline-block;
        color: red;
        width: 20px;
        height: 20px;
        text-align: center;
        user-select: none;
    }

    .remove:hover {
        color: darkred;
    }
</style>
