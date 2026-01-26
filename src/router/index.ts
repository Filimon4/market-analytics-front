import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import SignIn from '../views/auth/SignIn/SignIn.vue'
import Signup from '../views/auth/Signup/Signup.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: Auth,
    children: [
      {path: 'signin', component: SignIn},
      {path: 'signup', component: Signup}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router