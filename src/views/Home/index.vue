<!-- 说明 -->
<!-- @author 作者 -->

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import PrivateComponent from './components/PrivateComponent.vue'
import { getNews, getNewsDetails } from '@/api/news'
import style from './style.module.less'

export default {
  name: 'Home',
  components: { HelloWorld, PrivateComponent },
  data() {
    return {
      style,
      news: {},
      newsDetails: {},
    }
  },
  created() {
    getNews({ keyword: 'test' }).then(res => (this.news = res.data))
    getNewsDetails('idxxx').then(res => (this.newsDetails = res.data))
  },
}
</script>

<template>
  <div :class="[style.bg, $style.box]">
    <div>
      <b>getNews：</b>
      <br />
      {{ news }}
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
