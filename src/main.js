import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from'./router'
import MyTop from './components/MyTop.vue'
import ASIDE from './components/ASIDE.vue'
import SearchIn from './components/SearchIn'
// import SearchImg from './components/SearchImg'
// import LITERATURE from'./components/LITERATURE'
// import IMAGE from './components/IMAGE'
Vue.config.productionTip = false

Vue.component('MyTop',MyTop)
Vue.component('ASIDE',ASIDE)
Vue.component('SearchIn',SearchIn)
// Vue.component('SearchImg',SearchImg)
// Vue.component('LITERATURE',LITERATURE)
// Vue.component('IMAGE',IMAGE)
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

 