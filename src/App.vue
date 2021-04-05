<template>
  <div>
    <div :class="$style.header">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link
        v-if="$env.VUE_APP_ENABLE_DOCS === 'true'"
        to="/component-examples#SvgIcon"
        target="_blank"
        >开发文档</router-link
      >
    </div>
    <router-view />
  </div>
</template>

<style lang="less" module>
.header {
  margin: 1.5em;
  text-align: center;
  a {
    margin: 0 0.3em;
    color: inherit;
    font-weight: bold;
    &:global(.router-link-exact-active) {
      color: #42b983;
    }
  }
}
</style>
