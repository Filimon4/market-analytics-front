import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import SignIn from '../views/auth/SignIn/SignIn.vue'
import Signup from '../views/auth/Signup/Signup.vue'
import DashboardLayout from '../views/dashboard/DashboardLayout.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import NotFound from '../views/notFound/NotFound.vue'
import Account from '../views/account/Account.vue'
import { useUserStore } from '../store/user'

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
    path: '/',
    component: DashboardLayout,
    children: [
      {path: '', component: Dashboard },
      {
        path: 'account',
        component: Account,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const user = useUserStore()

  if (!user.)

  console.log('beforeEach')
})

router.beforeResolve((to) => {
  console.log('beforeResolve')
})

export default router