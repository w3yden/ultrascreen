<template>
  <div id="container">
    <main>
      <SidePanel ref="sidePanel"
                 :ultraPeer="ultraPeer"
      @toggleStream="toggleStream"
      @openCredits="openCredits"></SidePanel>
      <div>
        <transition name="fade" mode="out-in">
          <div key="x" class="content" v-if="!focusPeerblock">
              <PeerBlock v-for="(media, index) in mediaObjects"
                         :key="index"
                         :media="media"
                         :id=index @toggleFullscreen="enterPeerFullscreen"
                         >
              </PeerBlock>
          </div>
            <div key="one" class="content" v-else>
              <BigPeerBlock :media=focusedPeerblock :id="focusedPeerblock" @toggleFullscreen="leavePeerFullScreen"></BigPeerBlock>
            </div>
        </transition>
      </div>
    </main>
    <PickScreen :show=showPickScreen ref="picker" @close="hidePickScreen"></PickScreen>
    <Credits :show="showCredits" @close="closeCredits"></Credits>
  </div>
</template>

<script>
  import PickScreen from './PickScreen'
  import UltraPeer from '../peerjs'
  import SidePanel from './SidePanel'
  import PeerBlock from './PeerBlock'
  import BigPeerBlock from './BigPeerBlock'
  import Credits from './Credits'

  export default {
    name: 'home-page',
    components: { Credits, BigPeerBlock, PeerBlock, SidePanel, PickScreen },
    data: () => {
      return {
        showPickScreen: false,
        showCredits: false,
        selectedSource: null,
        focusPeerblock: false,
        focusedPeerblock: {},
        mediaObjects: [],
        connections: {},
        ultraPeer: {},
        peerNicknames: {},
        useAudio: false
      }
    },
    mounted () {
      this.ultraPeer = new UltraPeer((newConnections, nicknames) => {
        this.connections = newConnections
        this.peerNicknames = nicknames
        console.log(this.connections)
        this.$refs.sidePanel.setConnections(this.connections)
        this.$refs.sidePanel.setPeerNicknames(this.peerNicknames)
        // this.redoMediaObjects(this.mediaObjects)
      }, (newMedia, nicknames) => {
        this.peerNicknames = nicknames
        this.redoMediaObjects(newMedia)
      }, this.$store.state.Nickname.nickname, this.$toasted)
      this.ultraPeer.create()
      this.connections = this.ultraPeer.conns
      console.log(this.ultraPeer)
    },
    computed: {
      streamButtonLabel () {
        if (this.streaming) {
          return 'Stop Stream'
        }
        return 'Start Stream'
      },
      nickname () {
        return this.$store.state.Nickname.nickname
      }
    },
    watch: {
      ultraPeer: {
        handler: function (val, oldVal) {
          this.mediaObjects = Object.entries(val.mediaObjects)
        }
      }
    },
    methods: {
      redoMediaObjects (newMedia) {
        let tmpArray = []
        console.log(newMedia)
        for (let peerId in newMedia) {
          tmpArray.push({
            owner: peerId,
            nickname: this.peerNicknames[peerId],
            video: newMedia[peerId]
          })
        }
        console.log(this.peerNicknames)
        console.log(tmpArray)
        this.mediaObjects = tmpArray
        this.leavePeerFullScreen()
        this.$refs.sidePanel.setMediaObjects(this.mediaObjects)
      },
      enterPeerFullscreen (media) {
        this.focusPeerblock = true
        this.focusedPeerblock = media
      },
      leavePeerFullScreen () {
        this.focusPeerblock = false
        this.focusedPeerblock = null
      },
      toggleStream (useAudio) {
        if (!this.ultraPeer.isStreaming) {
          this.useAudio = useAudio
          this.showPickScreen = true
        } else {
          this.ultraPeer.stopStream()
        }
      },
      hidePickScreen () {
        this.showPickScreen = false
      },
      openCredits () {
        if (!this.showPickScreen) {
          this.showCredits = true
        }
      },
      closeCredits () {
        this.showCredits = false
      },
      stopStream () {
        this.currentStream.getTracks().forEach(t => t.stop())
        this.streaming = false
        this.currentStream = null
      },
      handleStream (stream) {
        console.log('Started stream')
        this.ultraPeer.startStream(stream)
      },
      handleError (error) {
        console.log(error)
      },
      startDesktopStream () {
        this.showPickScreen = false
        console.log(this.selectedSource)
        if (this.selectedSource.id.includes('screen') && this.useAudio) {
          navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: 'desktop'
              }
            },
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                minWidth: 1280,
                maxWidth: 1920,
                minHeight: 720,
                maxHeight: 1080
              }
            }
          }).then((stream) => this.handleStream(stream)).catch((e) => this.handleError(e))
        } else {
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: this.selectedSource.id,
                minWidth: 1280,
                maxWidth: 1920,
                minHeight: 720,
                maxHeight: 1080
              }
            }
          }).then((stream) => this.handleStream(stream)).catch((e) => this.handleError(e))
        }
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    height: 100%;
    padding: 60px 80px;
    width: 100%;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  video {
    width: 800px;
    height: 600px;
    display: block;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .content {
    margin-left: 5px;
    height: 100vh;
    background-color: #bdd4e7;
    display: flex;
    flex-flow: row wrap;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: space-around;
    align-items: center;
    background-image: linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%);
  }



#container {
  width: 100vw;
  height: 100vh;
}

</style>
