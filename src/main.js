// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import GeminiScrollbar from 'vue-gemini-scrollbar'
import JsBarcode from 'jsbarcode'
import jrQrcode from 'jr-qrcode'

Vue.config.productionTip = false
Vue.use(VueI18n) // 通过插件的形式挂载
Vue.use(GeminiScrollbar)
const i18n = new VueI18n({
  locale: 'cn',
  messages: {
    'zh': require('./common/lang/zh'),
    'cn': require('./common/lang/cn'),
    'en': require('./common/lang/en'),
    'ja': require('./common/lang/ja')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  JsBarcode,
  jrQrcode,
  components: { App },
  template: '<App/>'
})
