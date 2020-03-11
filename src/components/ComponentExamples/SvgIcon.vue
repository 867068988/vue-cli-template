<script>
import { names } from '@/components/SvgIcon/index.vue'

export default {
  data: () => ({ names }),
}
</script>

<template>
  <div>
    <div :class="$style.title">
      图标集中放置在 @/components/SvgIcon/icons/ 目录里，颜色与大小的控制同
      iconfont
    </div>
    <div :class="$style.itemsBox">
      <el-tooltip v-for="name in names" :key="name" effect="light">
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
.itemsBox {
  display: flex;
  flex-flow: wrap;
  text-align: center;
}
.item {
  width: 110px;
  padding: 10px 5px;
}
.svg {
  font-size: 32px;
  color: #606266;
  transition: color 0.3s;
}
.item:hover .svg {
  color: #5cb6ff;
}
.name {
  margin-top: 10px;
}
</style>
