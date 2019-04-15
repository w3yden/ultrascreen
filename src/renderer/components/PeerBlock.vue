<template>
    <div class="block">
        <div class="video-container">
        <div class="wrap-video">
            <video ref="video" class="media" v-on:dblclick="toggleFullfocus"></video>
            <div class="video-overlay">
              {{media.nickname}}
             </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'PeerBlock',
    data () {
      return {
        isFullscreen: false
      }
    },
    props: {
      id: Number,
      media: Object
    },
    watch: {
      media: function (val, oldVal) {
        console.log('stream play')
        this.$refs.video.srcObject = val.video
        this.$refs.video.onloadedmetadata = (e) => this.$refs.video.play()
      }
    },
    mounted () {
      this.$refs.video.srcObject = this.media.video
      this.$refs.video.onloadedmetadata = (e) => this.$refs.video.play()
    },
    methods: {
      toggleFullfocus () {
        this.$emit('toggleFullscreen', this.media)
      }
    }
  }
</script>

<style scoped>
    .block {
        min-width: 25%;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
        flex: 1 1;
        margin: 5px;
        max-width: 90%;
        height: 100%;
    }

    .video-container {
        height: 100%;
        display: flex;
        align-items: center;
    }



    .video-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background-image: -webkit-linear-gradient(bottom, rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.04) 34%,rgba(0,0,0,0) 100%);
        z-index:9990;
        width: 100%;
        height: 100%;
        pointer-events: none;
        align-items: flex-end;
        justify-content: center;
        display: none;
        opacity: 1;
        -webkit-animation: fadein 0.25s;
    }

    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    video:hover  + .video-overlay{
        display: flex;
    }


    .wrap-video {
        position: relative;
    }

    video {
        width: 100%;
        flex-shrink: 1;

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
