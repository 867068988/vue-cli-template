import Vue from 'vue'
import * as _utils from '@/scripts/utils'
import * as _constants from '@/scripts/constants'
const utils = { ..._utils }
const constants = { ..._constants }

declare module 'vue/types/vue' {
  interface Vue {
    $env: NodeJS.ProcessEnv
    $utils: typeof utils
    $const: typeof constants
    $isCancel: typeof _utils.isCancel
  }
}
