<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <div class="panel">
        <transition name="expand"
                    v-on:enter="enter"
                    v-on:after-leave="leave"
                    v-on:after-enter="finishExpand"
                    v-on:before-leave="startCollapse"
        >
            <div class="left-panel" ref="leftPanel" v-show="expanded">
                <div class="expand-button" @click="toggleExpand">
                    <
                </div>
                <transition name="fade">
                    <div v-show="showContent" class="content">
                        <UltraScreenTitle></UltraScreenTitle>
                        <div class="peer-info">
                            <div class="id-line">
                        <span>ID: {{ultraPeer.peerId}}</span><div class="clipboard" v-clipboard:copy="ultraPeer.peerId" v-clipboard:success="onCopy"></div>
                            </div>
                        <span> [{{nickname}}] </span>
                        </div>
                        <div class="conn-stream-container">
                        <Connections :connections="connections" :ultraPeer="ultraPeer" :mediaObjects="mediaObjects" :peerNicknames="peerNicknames"></Connections>
                        <div class="stream-section">
                            <h5>STREAM</h5>
                            <div v-bind:class="{ 'screen-streaming': streams }" class="screen" @click="toggleStream"></div>
                            <!--<div v-bind:class="{ disabled: streams, turnedOn: useAudio && !streams }" class="audio" @click="toggleAudio"></div>!-->
                        </div>
                        </div>
                        <div class="footer">
                        <a id="disconnect" href='#' @click="disconnectAll">Disconnect</a>
                            <a id="credits" href='#' @click="$emit('openCredits')">Credits</a>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
        <div class="collapsed" v-if="showBorder">
            <div class="expand-button" @click="toggleExpand">
                >
            </div>
        </div>

    </div>
</template>

<script>
  import UltraScreenTitle from './UltraScreenTitle'
  import Connections from './Connections'

  export default {
    name: 'SidePanel',
    components: {Connections, UltraScreenTitle},
    data () {
      return {
        expanded: true,
        showBorder: true,
        showContent: true,
        inTransition: false,
        connections: [],
        mediaObjects: [],
        peerNicknames: {},
        useAudio: false
      }
    },
    props: {
      ultraPeer: Object
    },
    computed: {
      nickname () {
        return this.$store.state.Nickname.nickname
      },
      connectionKeys () {
        return Object.keys(this.connections)
      },
      streams () {
        return this.ultraPeer.isStreaming
      }
    },
    methods: {
      setConnections (newConnections) {
        this.connections = Object.keys(newConnections)
      },
      setPeerNicknames (peerNicknames) {
        this.peerNicknames = peerNicknames
      },
      setMediaObjects (newMedia) {
        this.mediaObjects = newMedia
      },
      disconnectAll () {
        this.ultraPeer.destroy(() => {
          this.$router.push('/')
        })
      },
      toggleStream () {
        this.$emit('toggleStream', this.useAudio)
      },
      toggleAudio () {
        this.useAudio = !this.useAudio
      },
      toggleExpand () {
        if (!this.inTransition) {
          this.expanded = !this.expanded
        }
      },
      addConnection () {
        this.$emit('addConnection', this.remotePeer)
        console.log(this.peer)
      },
      leave () {
        this.showBorder = true
      },
      enter () {
        this.showBorder = false
      },
      finishExpand () {
        this.showContent = true
      },
      startCollapse () {
        this.showContent = false
      },
      onCopy () {
        this.$toasted.info('Copied!', {
          position: 'bottom-right',
          duration: 500
        })
      }
    }
  }
</script>

<style scoped>
    .left-panel {
        height: 100vh;
        width: 300px;
        background-color: rgba(245, 245, 245, 1);
        position: relative;
        float: left;
        border-right: 2px solid gray;
    }
    .panel {
        position: fixed;
        z-index: 9999;
    }

    .expand-button {
        color: black;
        background-color: rgba(245, 245, 245, 1);
        border-radius: 50%;
        display: inline;
        width: 25px;
        height: 25px;
        text-align: center;
        user-select: none;
        font-weight: bolder;
        font-size: 1.2em;
        line-height: 23px;
        top: calc( 50% - 25px) ;
        float: right;
        position: relative;
        left: 10px;
        padding-left: 2px;
        z-index: 9999;
        border-right: 2px solid gray;
    }

    .clipboard {
        width: 17px;
        height: 17px;
        background-color: black;
        -webkit-mask-image: url(../assets/clipboard.svg);
        -webkit-mask-size: 17px;
    }

    .clipboard:hover {
        background-color: deepskyblue;
    }

    .collapsed {
        height: 100vh;
        width: 5px;
        background-color: rgba(245, 245, 245, 1);
        margin: 0;
    }

    .expand-button:hover {
        color: gray;
    }

    .expand-enter-active {
        animation: expand .5s;
    }

    .expand-leave-active {
        animation: expand .5s reverse;
    }

    @keyframes expand {
        0% {
            width: 5px;
        }
        100% {
            width: 300px;
        }
    }

    .id-line {
        display: flex;
        flex-direction: row;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
        padding-left: 25px;
        padding-top: 5px;
        height: 100%;
    }

    .conn-stream-container {
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        height: 50%;
        width: 250px;
    }

    .footer {
        width: 100%;
        position: absolute;
        padding: 0 10px 0 10px;
        bottom: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    #disconnect {
        float: left;
    }

    #credits {
        align-self: flex-end;
    }

    .title {
        font-size: 1em;
    }

    .peer-info {
        font-size: 1em;
        text-align: center;
    }

    .stream-section {
        text-transform: uppercase;
        margin-top: 10px;
        text-align: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        min-height: 64px;
    }

    .screen {
        width: 48px;
        height: 48px;
        background-color: black;
        -webkit-mask-image: url(../assets/screen.svg);
        -webkit-mask-size: 48px;
        align-self: center;
    }

    .audio {
        width: 48px;
        height: 48px;
        background-color: orangered;
        -webkit-mask-image: url(../assets/audio.svg);
        -webkit-mask-size: 48px;
        align-self: center;
    }

    .audio:hover {
        background-color: black;
    }

    .audio:active {
        background-color: gray;
    }

    .disabled {
        background-color: gray;
    }

    .turnedOn {
        background-color: deepskyblue;
        -webkit-mask-image: url(../assets/audio.svg);
    }

    .screen-streaming {
        background-color: orangered;
        -webkit-mask-image: url(../assets/screen.svg);
    }

    .screen:hover {
        background-color: gray;
    }

    .screen-streaming:hover {
        background-color: darkred;
    }

</style>
