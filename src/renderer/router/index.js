import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home-page',
      component: require('@/components/HomeScreen').default
    },
    {
      path: '/',
      name: 'intro',
      component: require('@/components/IntroScreen').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
