import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $env: {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      readonly VUE_APP_ENV: 'dev' | 'stage' | 'prod'

      readonly BASE_URL: string
      readonly VUE_APP_BASEURL_XXX: string
      readonly VUE_APP_BASEURL_YYY: string

      readonly VUE_APP_MOCK: 'true' | 'false'
    }
  }
}
