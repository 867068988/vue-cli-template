/* dev 环境的移动端直接启用 */
if (process.env.VUE_APP_ENV === 'dev') {
  if (
    /\bMobile\b/i.test(navigator.userAgent) &&
    !localStorage._vConsole_close
  ) {
    const VConsole = require('vconsole')
    window.console.log(
      '\n移动端模拟器环境禁用 vConsole 的方法：\nlocalStorage._vConsole_close = 1\n\n',
    )
    new VConsole()
  }
}

/* stage 环境的移动端需要在页面中快速 6 连击才会启用或禁用 */
if (process.env.VUE_APP_ENV === 'stage') {
  if (/\bMobile\b/i.test(navigator.userAgent)) {
    let vConsole
    const loadVconsole = async function() {
      const { default: VConsole } = await import('vconsole')
      vConsole = new VConsole()
    }
    // 启用后在指定时间内，页面刷新或重新进入时直接启用
    if (Date.now() - localStorage._vConsole_enabledTime < 30 * 60 * 1000) {
      loadVconsole()
    }
    let timer
    let x, y
    let count = 0
    const reset = () => {
      x = y = null
      count = 0
    }
    const eventHandler = async function(event) {
      clearTimeout(timer)
      timer = setTimeout(reset, 200)
      if (event.targetTouches.length > 1) {
        reset()
      } else {
        const { clientX, clientY } = event.targetTouches[0]
        if (x == null || y == null) {
          x = clientX
          y = clientY
          count = 1
        } else {
          if (Math.abs(clientX - x) > 40 || Math.abs(clientY - y) > 40) {
            x = clientX
            y = clientY
            count = 1
          } else {
            count++
          }
        }
      }
      if (count >= 6) {
        reset()
        if (vConsole) {
          vConsole.destroy()
          vConsole = null
          delete localStorage._vConsole_enabledTime
        } else {
          await loadVconsole()
          localStorage._vConsole_enabledTime = Date.now()
        }
      }
    }
    window.addEventListener('touchstart', eventHandler, true)
  }
}
