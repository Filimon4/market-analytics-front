import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import SignIn from '../views/auth/SignIn/SignIn.vue'
import Signup from '../views/auth/Signup/Signup.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: Auth,
    children: [
      {path: 'signin', component: SignIn},
      {path: 'signup', component: Signup}
    ]
  },
  {
    path: '/dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router