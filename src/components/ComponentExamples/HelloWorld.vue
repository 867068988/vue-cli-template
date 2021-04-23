<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default { components: { HelloWorld } }
</script>

<template>
  <div :class="$style.box">
    <HelloWorld msg="HelloWorldExample" />
    <div :class="$style.right">
      <div>获取源码方式：require('!raw-loader!xxx.xxx').default</div>
      <div>
        高亮源码方式：v-highlight:xml="require('!raw-loader!xxx.xxx').default"
      </div>
      <div
        :class="$style.code"
        v-highlight:xml="
          require('!raw-loader!@/components/HelloWorld.vue').default
        "
      />
    </div>
  </div>
</template>

<style lang="less" module>
.box {
  display: flex;
}
.right {
  overflow: hidden;
  flex: 0 0 60%;
  margin-left: 1em;
}
.code {
  overflow: auto;
  margin-top: 0.5em;
  width: 100%;
  height: 25em;
}
</style>
