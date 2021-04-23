/* @PC.element-ui */

import _ from 'lodash'
import Vue from 'vue'
import { Dialog } from 'element-ui'
import root from '@/main'
const DialogConstructor = Vue.extend(Dialog)

/**
 * 用 js 方式调用 el-dialog 组件。适用情况：无需缓存，关闭即销毁 & title、main、footer 之间无联动
 * @typedef {import('vue').VNode} VNode
 * @param {object} props
 * @param {VNode | string | number} [props.title]
 * @param {VNode | string | number} [props.main]
 * @param {VNode | string | number} [props.footer]
 * @param {Function} [props.onOpen]
 * @param {Function} [props.onOpened]
 * @param {Function} [props.onClose]
 * @param {Function} [props.onClosed]
 * @returns {Function}
 * @example
   const h = dialog.h // 支持 JSX 的 h 变量。在 vue 组件中可省略 (除 function 关键字及箭头函数外)
   const close = dialog({
      // el-dialog props ...
      title: row.title,
      main: <Detail id={row.id} />,
      footer: <ElButton onClick={() => close()}>关闭</ElButton>,
   })
 */
export default function dialog(props) {
  if (!root) {
    let close = _.noop
    Vue.nextTick(() => {
      close = dialog.apply(this, arguments)
    })
    return () => close()
  }

  const { title, main, footer, ...rest } = props
  const { onOpen, onOpened, onClose, onClosed, ...attrs } = rest
  const propsData = {
    ...attrs,
    visible: false, // 挂载后再显示才能触发入场动画
    destroyOnClose: false, // 不能为 true，否则传入的 vNode 会被实例化多次（官方 bug）
    appendToBody: false,
    modalAppendToBody: true,
  }
  let instance = new DialogConstructor({
    propsData,
    parent: root, // 让子孙组件可以使用 $store、$router、$route 等特性，因为这些特性是从根组件注入的
  })

  // 绑定事件
  _.isFunction(onOpen) && instance.$on('open', onOpen)
  _.isFunction(onOpened) && instance.$on('opened', onOpened)
  _.isFunction(onClose) && instance.$on('close', onClose)
  _.isFunction(onClosed) && instance.$on('closed', onClosed)

  // 关闭后销毁
  instance.$on('update:visible', visible => {
    setProps(instance, { visible })
  })
  instance.$on('closed', () => {
    instance.$destroy()
    if (document.body.contains(instance.$el)) {
      document.body.removeChild(instance.$el)
    }
    instance = null
  })

  // 处理插槽
  instance.$slots.title = title
  instance.$slots.default = main
  instance.$slots.footer = footer

  // 显示
  instance.$mount()
  document.body.appendChild(instance.$el)
  setProps(instance, { visible: true })

  // 返回可关闭弹窗的方法
  return () => {
    if (instance) {
      setProps(instance, { visible: false })
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

Object.defineProperty(dialog, 'h', {
  value: new Vue().$createElement,
  enumerable: true,
})
