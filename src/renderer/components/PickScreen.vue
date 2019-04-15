<template>
    <!--
  <div class="pickscreen" v-if="show">
    <div class="title">
      Select a Screen
    </div>
      <div class="sourcesContainer">
        <div class="sources" v-for="source of sources">
            <div class="sourceWrap" @click="selectWindow(source)">
            <img v-bind:src="source.thumbnail.toDataURL()" /><br>
                 {{ source.name }}
            </div>
        </div>
      </div>
  </div>!-->
    <div>
        <transition name="modal">
            <div class="modal-mask pickscreen" v-show="show">
                <div class="modal-wrapper">
                    <div class="modal-container">

                        <div class="modal-header">
                           <div>
                               Select a screen
                           </div>
                            <div>
                                <button class="btn btn-danger" @click="$emit('close')">X</button>
                            </div>
                        </div>

                        <div class="modal-body">
                            <div class="sourcesContainer">
                                <div class="sources" v-for="source of sources">
                                    <div class="sourceWrap" @click="selectWindow(source)">
                                        <img v-bind:src="source.thumbnail.toDataURL()" /><br>
                                        {{ source.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  import {desktopCapturer} from 'electron'

  export default {
    name: 'pickscreen',
    components: { },
    data: () => {
      return {
        sources: null,
        showModal: false
      }
    },
    props: {
      show: false
    },
    watch: {
      show: {
        handler: function (val, oldVal) {
          console.log('ASD')
          if (val) {
            this.showPicker()
          }
        }
      }
    },
    methods: {
      showPicker () {
        this.show = true
        desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, src) => {
          if (error) throw error
          this.sources = src
        })
      },
      selectWindow (source) {
        this.$parent.selectedSource = source
        this.$parent.startDesktopStream()
        this.close()
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
  .pickscreen {
    position: absolute;
      overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    color: black;
    display: flex;
    justify-content: start;
      flex-direction: column;
      align-items: center;
    padding: 50px;
  }

  .sources {
      display: block;
      position: relative;
      width: 200px;
      height: 100px;
      text-overflow: ellipsis;
      text-align: center;
      font-size: 0.7em;
      margin: 10px 10px 70px;
      padding: 10px;
  }

  .sourceWrap {
      z-index: 999;
      width: 200px;
      height: 100px;
  }

  .sourceWrap:hover {
      background-color: #039BE5;
  }

  img:hover {
      background-color: #039BE5;
  }

  img {
      height: 100%;
  }

  .sourcesContainer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
  }

  .title {
    margin-bottom: 50px;
  }

  .modal-mask {
      position: fixed;
      z-index: 9998;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: table;
      transition: opacity .3s ease;
  }

  .modal-wrapper {
      display: table-cell;
      vertical-align: middle;
  }

  .modal-container {
      width: 70%;
      margin: 0 auto 0 290px;
      padding: 10px 10px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      max-height: 80vh;
      transition: all .3s ease;
      overflow-y: scroll;
      font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
      margin-top: 0;
      color: #42b983;
  }

  .modal-body {
      margin: 20px 0;
  }

  .modal-default-button {
      float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
      opacity: 0;
  }

  .modal-leave-active {
      opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
  }
</style>
