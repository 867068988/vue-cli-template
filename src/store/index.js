import Vue from 'vue'
import Vuex from 'vuex'
import root from './root'
Vue.use(Vuex)

/**
 * 全局唯一 Store 实例
 */
export const store = new Vuex.Store({
  strict: process.env.VUE_APP_ENV === 'dev',
  ...root,

  /* module 应该启用命名空间，即 namespaced: true */
  modules: {},
})

export default store
