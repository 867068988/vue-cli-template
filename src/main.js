import 'normalize.css'
import './styles/reset.less'
import Vue from 'vue'
import './element-ui' // @PC
import './vant' // @H5
import './styles/global.less'
import App from './App.vue'
import router from './router'
import store from './store'
import './injects'

/* 条件编译 (不能是运行时变量，必须是可用的环境变量，否则模块必定会打包) */
if (process.env.VUE_APP_MOCK === 'true') {
  require('./api/mock')
}

Vue.config.devtools =
  process.env.NODE_ENV === 'development' || process.env.VUE_APP_ENV === 'stage'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
