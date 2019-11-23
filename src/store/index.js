import Vue from 'vue'
import Vuex from 'vuex'
import root from './root'
Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  ...root,

  /* module 应该启用命名空间，即 namespaced: true */
  modules: {},
})

export default store
