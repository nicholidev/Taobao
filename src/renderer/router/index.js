import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/order',
      name: 'order',
      component: require('@/components/Taobao/getOrder')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
