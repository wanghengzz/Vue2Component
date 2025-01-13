/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-09 10:25:38
 * @Description:
 * @FilePath: \vue2-project\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/global.scss'
import components from '@/components'
import * as commonFun from '@/utils/commonFun'
import * as defaultSet from '@/utils/defaultSet'
Vue.prototype.$commonFun = commonFun
Vue.prototype.$defaultSet = defaultSet
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(components)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
