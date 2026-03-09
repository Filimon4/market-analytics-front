import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import SignIn from '../views/auth/SignIn/SignIn.vue'
import Signup from '../views/auth/Signup/Signup.vue'
import DashboardLayout from '../views/dashboard/DashboardLayout.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import NotFound from '../views/notFound/NotFound.vue'
import Account from '../views/account/Account.vue'
import { useUserStore } from '../store/user'
import Strategy from '../views/marketing/strategy/Strategy.vue'
import Channels from '../views/marketing/channels/Channels.vue'
import Performance from '../views/marketing/performance/Performance.vue'
import Developer from '../views/projects/developer/Developer.vue'
import Apikeys from '../views/projects/apikeys/Apikeys.vue'
import Users from '../views/projects/users/Users.vue'
import Roles from '../views/projects/roles/Roles.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: Auth,
    children: [
      {path: 'signin', component: SignIn},
      {path: 'signup', component: Signup}
    ],
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
      {
        path: 'marketing',
        children: [
          {path: 'strategy', component: Strategy },
          {path: 'channels', children: [
            {path: '', component: Channels },
            {path: 'performance', component: Performance },
          ]},
        ]
      },
      {
        path: 'projects',
        children: [
          {path: 'developer', component: Developer },
          {path: 'apikeys', component: Apikeys },
          {path: 'users', component: Users },
          {path: 'roles', component: Roles },
        ]
      },
    ],
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

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (to.path.startsWith('/auth')) {
    if (userStore.accessToken) {
      next('/')
      return;
    }
  }

  if (to.path.startsWith('/') && !to.path.split('/').includes('auth')) {
    if (!userStore.accessToken) {
      next('/auth/signin')
      return;
    }
  }

  next()
})

export default router