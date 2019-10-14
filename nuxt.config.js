import pkg from './package'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: "闲云旅游网",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_1168872_ehvuah8v57g.css'} // 新增全局字体样式
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
    'element-ui/lib/theme-chalk/index.css',
    'assets/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    "@/plugins/axios",
    { src: '@/plugins/localStorage', ssr: false }
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
    // https://axios.nuxtjs.org/setup
    '@nuxtjs/axios'
  ],
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: "http://157.122.54.189:9095" // 新增备用地址
    baseURL: "http://127.0.0.1:1337" // 新增axios默认请求路径 		  
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
