<!-- 非单例公共组件需要在 ComponentExamples 目录中写示例 -->

<script>
import { Container, Aside, Main, Popover, Tooltip } from 'element-ui'
import _ from 'lodash'

import 'highlight.js/styles/vs2015.css'
import hljs from 'highlight.js/lib/highlight'
import hljs_xml from 'highlight.js/lib/languages/xml'
import hljs_css from 'highlight.js/lib/languages/css'
import hljs_less from 'highlight.js/lib/languages/less'
import hljs_javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('xml', hljs_xml)
hljs.registerLanguage('css', hljs_css)
hljs.registerLanguage('less', hljs_less)
hljs.registerLanguage('javascript', hljs_javascript)

const README_src = require('!file-loader!../../../README.html')
const requireCtx = require.context(
  '../ComponentExamples',
  false, // 不解析子文件夹
  /[/\\][A-Z][a-zA-Z0-9]+\.vue$/, // 文件名使用 PascalCase 命名法
)
const requireCtxRaw = require.context(
  '!raw-loader!../ComponentExamples',
  false, // 同上
  /[/\\][A-Z][a-zA-Z0-9]+\.vue$/, // 同上
)

const getModules = ctx => {
  const modules = {}
  ctx.keys().forEach(fileName => {
    const name = fileName
      .split(/[/\\]+/)
      .pop()
      .replace(/\.\w+$/, '')
    const m = ctx(fileName)
    modules[name] = m && m.__esModule ? m.default : m
  })
  return modules
}
const comps = getModules(requireCtx)
const compsRaw = getModules(requireCtxRaw)

export default {
  name: 'ComponentExamples',
  components: {
    ...comps,
    ElContainer: Container,
    ElAside: Aside,
    ElMain: Main,
    ElPopover: Popover,
    ElTooltip: Tooltip,
  },
  directives: {
    highlight: {
      bind(el) {
        let blocks = el.querySelectorAll('pre >code')
        blocks.forEach(block => hljs.highlightBlock(block))
      },
    },
  },
  data() {
    return {
      README_src,
      compNames: Object.keys(comps),
      compsRaw,
      uid: `id${Date.now()}${_.uniqueId()}`,
    }
  },
  computed: {
    currLinkName() {
      const hash = this.$route.hash.slice(1)
      return this.compNames.find(compName => compName === hash) || 'README'
    },
    currLinkIsComp() {
      return !!this.compNames.find(compName => compName === this.currLinkName)
    },
  },
  created() {
    if (this.$route.hash.slice(1) !== this.currLinkName) {
      this.$router.replace({ ...this.$route, hash: this.currLinkName })
    }
  },
  mounted() {
    document.body.classList.add('ComponentExamples')
    this.targetScrollIntoView()
  },
  beforeRouteUpdate(to, from, next) {
    next()
    !this.isRouteChangeFromMouseEnter && this.targetScrollIntoView()
  },
  destroyed() {
    document.body.classList.remove('ComponentExamples')
  },
  methods: {
    showCode(compName) {
      const key = `${compName}_popoverInited`
      if (!this.compsRaw[key]) {
        this.$set(this.compsRaw, key, true)
      }
    },
    README_onLoad(event) {
      const doc = event.currentTarget.contentDocument
      const bodyId = doc.body.id ? doc.body.id : (doc.body.id = this.uid)
      const div = doc.createElement('div')
      div.innerHTML = `
        <a id="gotoTop_${bodyId}" href="#${bodyId}">↑</a>
        <style>
          #gotoTop_${bodyId} {
            position: fixed;
            z-index: 999999999;
            bottom: 8%;
            right: 30px;
            width: 40px;
            height: 40px;
            line-height: 36px;
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            color: #fff;
            background: rgba(0,0,0, 0.2)
          }
          #gotoTop_${bodyId}:hover {
            background: rgba(0,0,0, 0.3)
          }
        </style>
      `
      doc.body.appendChild(div)
    },
    toKebabCase: name => _.kebabCase(name),
    targetScrollIntoView() {
      if (this.currLinkIsComp) {
        const id = `${this.currLinkName}_${this.uid}`
        const target = document.getElementById(id)
        target && target.scrollIntoView()
      }
    },
    mouseEnterComp(compName) {
      if (compName === this.currLinkName) return
      clearTimeout(this.mouseEnterCompTimer)
      this.mouseEnterCompTimer = setTimeout(() => {
        this.isRouteChangeFromMouseEnter = true
        this.$router.replace({ ...this.$route, hash: compName })
        this.isRouteChangeFromMouseEnter = false
      }, 300)
    },
  },
}
</script>

<template>
  <el-container :class="$style.box">
    <el-aside :class="$style.aside" width="230px">
      <div :class="$style.linkGroup">
        <a
          :class="$style.link"
          target="_blank"
          href="https://cn.vuejs.org/v2/api/"
          >vue 官网 api</a
        >
        <a
          :class="$style.link"
          target="_blank"
          href="https://element.eleme.cn/2.12/#/zh-CN/component/table"
          >element-ui 官网 @2.12</a
        >
      </div>
      <div :class="$style.linkGroup">
        <router-link :class="$style.link" :to="{ ...$route, hash: 'README' }"
          >README</router-link
        >
      </div>
      <div :class="$style.linkGroup">
        <router-link
          v-for="compName in compNames"
          :key="compName"
          :class="$style.link"
          :to="{ ...$route, hash: compName }"
          >&lt;{{ toKebabCase(compName) }}&gt;</router-link
        >
      </div>
    </el-aside>
    <el-main :class="$style.main">
      <iframe
        v-if="currLinkName === 'README'"
        :class="$style.README"
        :src="README_src"
        @load="README_onLoad"
      ></iframe>
      <template v-if="currLinkIsComp">
        <div v-for="(compName, i) in compNames" :key="compName">
          <div
            :id="`${compName}_${uid}`"
            @mouseenter="mouseEnterComp(compName)"
          >
            <h2>
              <el-popover
                placement="right"
                trigger="hover"
                @show="showCode(compName)"
              >
                <i
                  class="el-icon-view"
                  style="font-size:20px;color:#666"
                  slot="reference"
                />
                <div
                  :class="$style.highlightBox"
                  v-if="!!compsRaw[`${compName}_popoverInited`]"
                  v-highlight
                >
                  <pre><code>{{ compsRaw[compName] }}</code></pre>
                </div>
              </el-popover>
              &lt;{{ toKebabCase(compName) }}&gt;
              <el-tooltip
                content="可通过 vue-devtools 中的 Open in editor 快速定位至源文件"
                effect="light"
                placement="right"
              >
                <i class="el-icon-aim" style="font-size:20px;color:#ccc" />
              </el-tooltip>
            </h2>
            <div style="padding-left:30px">
              <component :is="compName"></component>
            </div>
          </div>
          <hr
            v-if="i < compNames.length - 1"
            style="margin:40px 0;opacity:0.3"
          />
        </div>
      </template>
    </el-main>
  </el-container>
</template>

<style lang="less" module>
:global(body.ComponentExamples) {
  overflow: hidden !important;
}
.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
}
.aside {
  padding: 10px 0;
  border-right: 1px solid #e5e5e5;
}
.main {
  position: relative;
}
.linkGroup {
  margin: 10px 0;
}
.link {
  display: block;
  padding: 5px 15px;
  margin-bottom: 1px;
  font-size: 14px;
  font-weight: bold;
  &:hover {
    background: fade(#000, 3%);
  }
  &:global(.router-link-active) {
    background: fade(#000, 5%);
  }
}
.README {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: none;
}
.highlightBox {
  font-size: 14px;
  max-height: calc(100vh - 66px);
  max-width: calc(100vw - 66px);
  overflow: auto;
  > pre {
    margin: 0;
    > code {
      overflow: visible;
      padding: 20px;
    }
  }
}
</style>
