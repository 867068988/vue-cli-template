<template>
  <div :class="$style.box">
    <div :class="$style.nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link
        v-if="$env.VUE_APP_ENV === 'dev'"
        to="/component-examples"
        target="_blank"
        >开发文档</router-link
      >
    </div>
    <router-view />
  </div>
</template>

<style lang="less" module>
.box {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.nav {
  padding: 30px;
  text-align: center;
  a {
    margin: 0 6px;
    font-weight: bold;
    color: #2c3e50;
    &:global(.router-link-exact-active) {
      color: #42b983;
    }
  }
}
</style>
