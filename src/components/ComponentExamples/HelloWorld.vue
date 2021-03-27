<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default { components: { HelloWorld } }
</script>

<template>
  <div :class="$style.box">
    <HelloWorld msg="HelloWorldExample" />
    <div :class="$style.right">
      <div>可通过 require('!raw-loader!xxx.xxx').default 方式获取源码</div>
      <div>再通过 v-highlight 指令高亮源码</div>
      <div :class="$style.code" v-highlight>
        <pre><code class="xml">{{ require('!raw-loader!@/components/HelloWorld.vue').default }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style lang="less" module>
.box {
  display: flex;
}
.right {
  margin-left: 1em;
  flex: 0 0 60%;
  overflow: hidden;
}
.code {
  width: 100%;
  height: 25em;
  margin-top: 0.5em;
  overflow: auto;
  > pre {
    margin: 0;
  }
}
</style>
