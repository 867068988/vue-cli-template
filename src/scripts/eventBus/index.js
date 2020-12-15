import Vue from 'vue'

export const createBus = function(name = '') {
  const vueIns = new Vue()
  const bus = Object.freeze({
    /**
     * @param  {Parameters<vueIns['$on']>} args
     */
    on(...args) {
      vueIns.$on(...args)
      return bus
    },

    /**
     * @param  {Parameters<vueIns['$once']>} args
     */
    once(...args) {
      vueIns.$once(...args)
      return bus
    },

    /**
     * @param  {Parameters<vueIns['$off']>} args
     */
    off(...args) {
      vueIns.$off(...args)
      return bus
    },

    /**
     * @param  {Parameters<vueIns['$emit']>} args
     */
    emit(...args) {
      vueIns.$emit(...args)
      return bus
    },

    get eventNames() {
      return Object.keys(vueIns._events)
    },

    name,
  })

  return bus
}

export default createBus('global')
