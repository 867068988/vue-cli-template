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
      newsList: {},
      newsDetails: {},
    }
  },
  created() {
    getNewsList({ keyword: 'xxx' }).then(res => (this.newsList = res.data))
    getNewsDetails('xxx').then(res => (this.newsDetails = res.data))
  },
}
</script>

<template>
  <div :class="[style.bg, $style.box]">
    <div>
      <b>getNewsList：</b>
      <br />
      {{ newsList }}
    </div>
    <br />
    <div>
      <b>getNewsDetails：</b>
      <br />
      {{ newsDetails }}
    </div>
    <br />
    <img alt="Vue logo" height="80" src="@/assets/logo.png" />
    <hello-world msg="Welcome to Your Vue.js App" />
    <br />
    <private-component />
  </div>
</template>

<style lang="less" module>
.box {
  text-align: center;
  border: 2px dashed #ccc;
}
</style>
