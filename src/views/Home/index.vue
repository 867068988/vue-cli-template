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

    <HelloWorld :class="$style.helloWorld" msg="Welcome to Your Vue.js App" />
    <PrivateComponent :class="$style.privateComponent" />
  </div>
</template>

<style lang="less" module>
.box {
  padding: 1em;
  margin: 1em;
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
  height: 2em;
  margin: 3em 0;
}
.helloWorld {
  background: url('~@/assets/logo.png') no-repeat right center; // 在 style 中使用'@'别名
  background-size: auto 2em;
}
.privateComponent {
  margin-top: 3em;
}
</style>
