// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import store from './store'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(VueFire)

const moment = require('moment')
require('moment/locale/fr')

Vue.use(require('vue-moment'), {
  moment
})

Vue.config.productionTip = false

const requireComponent = require.context(
  './lib/components',
  true,
  /Component+\.vue$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace('/Component.vue', '')
  let finalName = ''
  for (let i = componentName.length - 1; i >= 0; i--) {
    if (componentName[i] !== '/') {
      finalName += componentName[i]
    } else {
      i -= componentName.length
    }
  }
  finalName = finalName.split('').reverse().join('')
  Vue.component(
    finalName,
    componentConfig.default || componentConfig
  )
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
