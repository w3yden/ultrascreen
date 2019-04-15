<template>
    <div>
    <transition name="modal">
        <div class="modal-mask credits" v-show="show">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <div>
                            <UltraScreenTitle></UltraScreenTitle>
                        </div>
                        <div>
                            <button class="btn btn-danger" @click="$emit('close')">X</button>
                        </div>
                    </div>

                    <div class="modal-body">
                       Made by ThatOneGuy 2019
                    </div>
                </div>
            </div>
        </div>
    </transition>
    </div>
</template>

<script>
  import UltraScreenTitle from './UltraScreenTitle'
  export default {
    name: 'Credits',
    props: {
      show: Boolean
    },
    components: {UltraScreenTitle}
  }
</script>

<style scoped>
    .credits {
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
