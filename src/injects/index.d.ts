import Vue from 'vue'

interface Env {
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly VUE_APP_ENV: 'dev' | 'test' | 'prod'

  readonly BASE_URL: string
  readonly VUE_APP_BASEURL_XXX: string
  readonly VUE_APP_BASEURL_YYY: string

  readonly VUE_APP_MOCK: 'true' | 'false'
}

declare module 'vue/types/vue' {
  interface Vue {
    $env: Env
  }
}
