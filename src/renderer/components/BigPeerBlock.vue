<template>
    <PeerBlock :media="media"
               @toggleFullscreen="toggleFullfocus"></PeerBlock>
</template>

<script>
  import PeerBlock from './PeerBlock'
  export default {
    name: 'BigPeerBlock',
    components: {PeerBlock},
    data () {
      return {
        isFullscreen: false
      }
    },
    props: {
      media: Object
    },
    methods: {
      toggleFullfocus () {
        this.$emit('toggleFullscreen')
      }
    }
  }
</script>

<style scoped>
    .block {
        max-width: 100%;
        width:100vw;
        height: 100vh;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .block .media {
        width: 100%;
        height: 95%;
    }

    .subtitle {
        user-select: none;
    }

    .fullscreen {
        width: 80%;
        height: 80%;
        border: blue 2px solid;
    }
</style>
