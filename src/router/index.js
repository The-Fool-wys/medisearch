import VueRouter from 'vue-router'
import Vue from 'vue'
import RegisterForm from '@/views/RegisterForm' 
import LoginForm from '@/views/LoginForm'
import MySearch from '@/views/MySearch'
import MyManage from '@/views/MyManage'
import FileDetail from '@/views/FileDetail'
import MyDetail from '@/views/MyDetail'
import MyHistory from '@/views/MyHistory'
import MyFavorites from '@/views/MyFavorites'
// import ImgDetail from '@/views/ImgDetail'
import SearchDetail from '@/views/SearchDetail'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm
    },
    {
      path: '/register',
      name: 'RegisterForm',
      component: RegisterForm,
    },
    {
      path: '/search',
      name: 'MySearch',
      component: MySearch,
    },
    {
      path: '/manager',
      name: 'MyManage',
      component: MyManage,
    },
    {
      path: '/detail',
      name: 'MyDetail',
      component: MyDetail,
    },
    {
      path: '/history',
      name: 'MyHistor',
      component: MyHistory,
    },
    {
      path: '/favorites',
      name: 'MyFavorites',
      component: MyFavorites,
    },
    {
      path: '/searchdetail',
      name: 'SearchDetail',
      component: SearchDetail,
    },
    {
      path: '/file/:fileName', 
      name: 'FileDetail',
      component: FileDetail, 
      props: true 
    }
  ],
});

export default router