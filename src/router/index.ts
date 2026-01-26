import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import SignIn from '../views/auth/SignIn/SignIn.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: Auth,
    children: [
      {path: 'signin', component: SignIn}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router