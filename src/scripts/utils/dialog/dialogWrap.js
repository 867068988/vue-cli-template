/* @PC.element-ui */

import _ from 'lodash'
import Vue from 'vue'
import root from '@/main'

/**
 * 用 js 方式调用包装了 el-dialog 组件的组件。适用情况：无需缓存，关闭即销毁 & title、main、footer 之间有联动，如 disabled、loading 等
 * @param {import('vue').VNode} vNode
 * @returns {Function}
 * @example
   const h = dialogWrap.h // 支持 JSX 的 h 变量。在 vue 组件中可省略 (除 function 关键字及箭头函数外)
   dialogWrap(<CreateOrEdit props={props} />) // 推荐 (内部的 el-dialog 组件 visible 属性需要加 .sync)
   // or
   const close = dialogWrap(<CreateOrEdit props={{ ...props, close: () => close() }} />) // 不推荐
 */
export default function dialogWrap(vNode) {
  if (!root) {
    let close = _.noop
    Vue.nextTick(() => {
      close = dialogWrap.apply(this, arguments)
    })
    return () => close()
  }

  const instance = new Vue({
    parent: root, // 让子孙组件可以使用 $store、$router、$route 等特性，因为这些特性是从根组件注入的
    render: () => vNode,
  }).$mount()
  let dialogInstance = findDialogInstance(instance.$children)
  if (!dialogInstance) {
    instance.$destroy()
    return _.noop
  }

  // 关闭后销毁
  dialogInstance.$on('update:visible', visible => {
    setProps(dialogInstance, { visible })
  })
  dialogInstance.$on('closed', () => {
    instance.$destroy()
    if (document.body.contains(instance.$el)) {
      document.body.removeChild(instance.$el)
    }
    dialogInstance = null
  })

  // 显示
  document.body.appendChild(instance.$el)
  Object.defineProperties(dialogInstance, {
    destroyOnClose: {
      get: () => false, // 重写 props：不能为 true，否则 dialog 插槽会被实例化多次（官方 bug）
      enumerable: true,
    },
    appendToBody: {
      get: () => true, // 重写 props
      enumerable: true,
    },
    modalAppendToBody: {
      get: () => true, // 重写 props
      enumerable: true,
    },
  })
  const oldVisible = dialogInstance.$props.visible
  setProps(dialogInstance, { visible: true })
  oldVisible !== true && dialogInstance.$emit('update:visible', true)

  // 返回可关闭弹窗的方法
  return () => {
    if (dialogInstance) {
      setProps(dialogInstance, { visible: false })
    }
  }
}

const findDialogInstance = function(children) {
  for (const ins of children) {
    if (ins.$options.name === 'ElDialog') return ins
    if (ins.$children.length > 0) {
      return findDialogInstance(ins.$children)
    }
  }
}

const setProps = function(ins, props) {
  const oldSilent = Vue.config.silent
  Vue.config.silent = true
  _.each(props, (val, key) => {
    ins.$props[key] = val
  })
  Vue.config.silent = oldSilent
}

Object.defineProperty(dialogWrap, 'h', {
  value: new Vue().$createElement,
  enumerable: true,
})
