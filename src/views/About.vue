<!-- 说明 -->
<!-- @author 作者 -->

<template>
  <div>
    <h1>This is an about page</h1>
    <div :class="$style.logo" />
  </div>
</template>

<style lang="less" module>
.logo {
  background: url('~@/assets/logo.png');
  background-size: auto 100%;
  opacity: 0.5;
  height: 30px;
}
</style>
