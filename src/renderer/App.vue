<template>
  <div id="app">
    <transition name="slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'ultrascreen'
  }
</script>

<style>
  /* CSS */
  @import './assets/bootstrap.min.css';

  body {
    overflow: hidden;
  }

  /*slide transition*/
  .slide-enter-active,.slide-leave-active {
    transition: transform 0.35s ease-out;
  }
  .slide-enter {  transform: translateX(-80%);}
  .slide-leave-to {  transform: translateX(100%);}


  .fade-enter-active, .fade-leave-active {
    transition: opacity .15s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }


</style>
