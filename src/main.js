import Vue from 'vue'
import App from './App.vue'

import router from './router';//引入路由
import ElementUI from 'element-ui';//引入elementUI
import VueI18n from 'vue-i18n';//引入国际化插件
import { messages } from './components/common/i18n';
import store from "@/store"//引入仓库
import Plugin from 'v-fit-columns';//引入表格工具使其自动撑开

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';


// Vue.config.productionTip = false//阻止启动生产消息
Vue.use(VueI18n);
Vue.use(Plugin);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
  locale: 'zh',
  messages
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');