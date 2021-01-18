import Vue from 'vue'

const checkName = function(name) {
  const keys = Array.isArray(name) ? name : [name]
  const errKeys = keys.filter(k => /^hook:/.test(k))
  if (errKeys.length > 0) {
    throw new Error(`事件名 ${errKeys} 不符合规范`)
  }
}

export const createBus = function() {
  const vueIns = new Vue()
  const bus = Object.freeze({
    /**
     * @param  {Parameters<vueIns['$on']>} args
     */
    on(...args) {
      checkName(args[0])
      vueIns.$on(...args)
      return bus
    },

    /**
     * @param  {Parameters<vueIns['$once']>} args
     */
    once(...args) {
      checkName(args[0])
      vueIns.$once(...args)
      return bus
    },

    /**
     * @param  {Parameters<vueIns['$off']>} args
     */
    off(...args) {
      checkName(args[0])
      vueIns.$off(...args)
      return bus
    },

    /**
     * @param  {Parameters<vueIns['$emit']>} args
     */
    emit(...args) {
      checkName(args[0])
      vueIns.$emit(...args)
      return bus
    },

    get _events() {
      return vueIns._events
    },
  })

  return bus
}

export default createBus()
