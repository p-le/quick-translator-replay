import Vue from 'vue'
import Vuetify from 'vuetify'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Sortable from 'vue-sortable'
import Router from 'vue-router'

import App from './App'
import routes from './routes'
import store from './vuex/store'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.use(Vuetify)
Vue.use(Sortable)
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  history: true,
  routes
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  ...App
}).$mount('#app')
