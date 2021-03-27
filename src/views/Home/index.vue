<!-- 说明 -->
<!-- @author 作者 -->

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import PrivateComponent from './components/PrivateComponent.vue'
import { getNewsList, getNewsDetails } from '@/api/news'
import style from './style.module.less'

export default {
  name: 'Home',
  components: { HelloWorld, PrivateComponent },
  data() {
    return {
      style,
      newsList: null,
      newsDetails: null,
    }
  },
  created() {
    getNewsList({ keyword: 'xxx' }).then(res => (this.newsList = res.exData))
    getNewsDetails('xxx').then(res => (this.newsDetails = res.exData))
  },
}
</script>

<template>
  <div :class="[style.bg, $style.box]">
    <div :class="$style.res">
      <b>getNewsList：</b>
      {{ newsList }}
      <b>getNewsDetails：</b>
      {{ newsDetails }}
    </div>

    <!-- 在 template 中使用'@'别名 -->
    <img :class="$style.logo" src="@/assets/logo.png" />

    <HelloWorld :class="$style.hello_world" msg="Welcome to Your Vue.js App" />
    <PrivateComponent :class="$style.private_component" />
  </div>
</template>

<style lang="less" module>
.box {
  margin: 1em;
  padding: 1em;
  border: 2px dashed #ccc;
}
.res {
  b {
    display: block;
    margin: 1em 0 0.25em;
    &:first-child {
      margin-top: 0;
    }
  }
}
.logo {
  display: block;
  margin: 3em 0;
  height: 2em;
}
.hello_world {
  background: url('~@/assets/logo.png') no-repeat right center; // 在 style 中使用'@'别名
  background-size: auto 2em;
}
.private_component {
  margin-top: 3em;
}
</style>
