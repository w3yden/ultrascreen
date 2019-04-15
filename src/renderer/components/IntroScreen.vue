<template>
    <div class="container">
        <UltraScreenTitle></UltraScreenTitle>
        <div class="nickcontainer">
            <b>Choose your nickname</b>
            <input type="text" v-model="nickname" :class="[valid ? '' : 'is-invalid']" class="form-control" />
            <div v-if="valid === false" class="text-danger" id="nerr">Your nickname may only contain alphanumeric characters</div>
        </div>
        <div class="form-group">

        </div>
        <div>
         <button type="submit" class="btn btn-primary" @click="login">Login</button>
        </div>
    </div>
</template>

<script>
    import Cleave from 'vue-cleave-component'
    import UltraScreenTitle from './UltraScreenTitle'

    export default {
      name: 'IntroScreen',
      components: {
        UltraScreenTitle,
        Cleave
      },
      data () {
        return {
          nickname: null,
          valid: true,
          options: {}
        }
      },
      methods: {
        login () {
          if (this.isValid(this.nickname) && this.nickname !== '' && this.nickname !== null) {
            this.$store.dispatch('selectNickname', this.nickname)
            this.$router.push('/home')
          } else {
            this.valid = false
          }
        },
        isValid (str) { return /^\w+$/.test(str) }
      },
      watch: {
        nickname: function (val, oldVal) {
          this.valid = this.isValid(val)
        }
      }
    }
</script>

<style scoped>
    .container {
        display: flex;
        justify-items: center;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column;
        height: 100vh;
    }

    .nickcontainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .nickcontainer b {
        margin-bottom: 10px;
    }

    #nerr {
        font-size: 0.75em;
    }
</style>
