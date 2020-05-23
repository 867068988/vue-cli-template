const tip = `移动端模拟器环境可设置 localStorage._vConsole_close = 1 来禁用 vConsole`

/* dev 环境移动端直接启用 */
if (process.env.VUE_APP_ENV === 'dev') {
  if (
    /\bMobile\b/i.test(navigator.userAgent) &&
    !localStorage._vConsole_close
  ) {
    window.console.log(tip)
    new (require('vconsole'))()
  }
}

/* stage 环境移动端需要在页面中快速 6 连击才会启用 */
if (process.env.VUE_APP_ENV === 'stage') {
  if (
    /\bMobile\b/i.test(navigator.userAgent) &&
    !localStorage._vConsole_close
  ) {
    import('vconsole').then(({ default: VConsole }) => {
      const timeLimit = 1000 * 60 * 15 // 在指定时间内，页面刷新或重新进入时直接启用
      if (Date.now() - localStorage._vConsole_lastDate < timeLimit) {
        window.console.log(tip)
        new VConsole()
        return
      }
      let timer
      let count = 0
      const handlerEvent = function(e) {
        clearTimeout(timer)
        if (e.targetTouches.length === 1) {
          count++
        }
        if (count >= 6) {
          window.console.log(tip)
          new VConsole()
          window.removeEventListener('touchstart', handlerEvent, true)
          localStorage._vConsole_lastDate = Date.now()
        } else {
          timer = setTimeout(() => (count = 0), 190)
        }
      }
      window.addEventListener('touchstart', handlerEvent, true)
    })
  }
}
