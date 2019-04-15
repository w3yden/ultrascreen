import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VueCleave from 'vue-cleave-component'
import VueModalTor from 'vue-modaltor'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueCleave)
Vue.use(VueModalTor)
Vue.use(VueClipboard)
Vue.use(Toasted, {
  theme: 'bubble'
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
