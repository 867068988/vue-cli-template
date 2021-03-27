<script>
import { names } from '@/components/SvgIcon/index.vue'

export default {
  data: () => ({ names }),
}
</script>

<template>
  <div>
    <div :class="$style.title">
      - 图标集中放置在 @/components/SvgIcon/icons/ 目录里<br />
      - 单色模式(非'mt-'前缀)，大小继承至 font-size，颜色继承至 color<br />
      - 多色模式('mt-'前缀)，大小继承至 font-size，颜色则原始显示
    </div>
    <div :class="$style.items_box">
      <el-tooltip v-for="name in names" :key="name">
        <div :class="$style.item">
          <svg-icon :class="$style.svg" :icon="name" />
          <div :class="$style.name">{{ name }}</div>
        </div>
        <div slot="content">{{ `&lt;svg-icon icon="${name}" /&gt;` }}</div>
      </el-tooltip>
    </div>
  </div>
</template>

<style lang="less" module>
.title {
  margin-bottom: 0.6em;
}
.items_box {
  display: flex;
  flex-flow: wrap;
  text-align: center;
}
.item {
  padding: 10px 5px;
  width: 110px;
}
.svg {
  color: #606266;
  font-size: 32px;
  transition: color 0.3s;
}
.item:hover .svg {
  color: #5cb6ff;
}
.name {
  margin-top: 10px;
}
</style>
