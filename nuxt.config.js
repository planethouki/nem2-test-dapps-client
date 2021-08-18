
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Primitives NFT',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'NFT test dApps Powered by Symbol Blockchain' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/i18n',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  i18n: {
    locales: [
      { code: 'ja', iso: 'ja_JP', file: 'ja.js' },
      { code: 'en', iso: 'en-US', file: 'en.js' },
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'ja',
    vueI18n: {
      fallbackLocale: 'en',
    },
    detectBrowserLanguage: { alwaysRedirect: false },
  },
}
