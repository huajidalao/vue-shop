import Vue from 'vue'
import Router from 'vue-router'
// login组件是在这里加载的
import login from './components/login.vue'
import home from './components/home.vue'
import Users from './components/users/users.vue'
Vue.use(Router)

let router = new Router({
  routes: [
    //新增一个login组件的路由规则
    {path: '/login',component: login},
    {path:'/',redirect: '/login'},
    {path:'/home',component: home,children: [
      { path: '/users', component: Users }
    ]},
  ]
})

router.beforeEach((to,from,next) => {
  if(to.path=='/login')  return next();
  let tokenStr = sessionStorage.getItem("token");
  if(!tokenStr) return next('/login');
  next();
})
export default router;
