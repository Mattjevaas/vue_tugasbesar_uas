import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Userpage from '../views/Userpage.vue'
import Useredit from '../views/Useredit.vue'
import StaffPage from '../views/StaffPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/userpage',
    name: 'userpage',
    component: Userpage
  },
  {
    path: '/useredit',
    name: 'useredit',
    component: Useredit
  },
  {
    path: '/staffpage',
    name: 'staffpage',
    component: StaffPage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
