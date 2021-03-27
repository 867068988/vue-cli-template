<!-- svg-sprite 图标 -->
<!-- 单色模式(非'mt-'前缀)，大小继承至 font-size，颜色继承至 color -->
<!-- 多色模式('mt-'前缀)，大小继承至 font-size，颜色则原始显示 -->

<script>
let requireCtx
try {
  requireCtx = require.context(
    './icons/',
    false, // 不解析子文件夹
    /\.svg$/,
  )
} catch (err) {
  if (
    /* 允许文件夹缺失（处理 git 无法提交空文件夹的情况） */
    err.code === 'MODULE_NOT_FOUND'
  ) {
    requireCtx = () => {}
    requireCtx.keys = () => []
  } else {
    throw err
  }
}

const fileNames = requireCtx.keys()
const names = Object.freeze(
  fileNames.map(fileName =>
    fileName
      .split(/[/\\]+/)
      .pop()
      .replace(/\.\w+$/, ''),
  ),
)
fileNames.forEach(fileName => requireCtx(fileName))

export { names }
export default {
  name: 'SvgIcon',
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <i :class="['svg-icon', `svg-icon-${icon}`]">
    <svg class="svg-icon__icon">
      <use :xlink:href="`#svgSpriteIcon__${icon}`" />
    </svg>
  </i>
</template>

<style lang="less">
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.165em;
  font-style: normal;
  line-height: 1;
  &__icon {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}

[id^='svgSpriteIcon__']:not([id^='svgSpriteIcon__mt-']) {
  // svgo-loader 会自动计算内联样式并应用到 fill 属性上
  [fill]:not([fill='none']):not([fill='transparent']) {
    fill: currentColor;
  }
  // svgo-loader 会自动计算内联样式并应用到 stroke 属性上
  [stroke]:not([stroke='none']):not([stroke='transparent']) {
    stroke: currentColor;
  }
}
</style>
