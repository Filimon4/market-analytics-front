import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import SignIn from '../views/auth/SignIn/SignIn.vue'
import Signup from '../views/auth/Signup/Signup.vue'
import DashboardLayout from '../views/dashboard/DashboardLayout.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import NotFound from '../views/notFound/NotFound.vue'
import Account from '../views/account/Account.vue'
import { useUserStore } from '../store/user'
import Channels from '../views/marketing/channels/Channels.vue'
import Performance from '../views/marketing/performance/Performance.vue'
import Developer from '../views/projects/developer/Developer.vue'
import Apikeys from '../views/projects/apikeys/Apikeys.vue'
import Apikey from '../views/projects/apikeys/Apikey.vue'
import Users from '../views/projects/users/Users.vue'
import User from '../views/projects/users/User.vue'
import Roles from '../views/projects/roles/Roles.vue'
import Role from '../views/projects/roles/Role.vue'
import CreateRole from '../views/projects/roles/CreateRole.vue'
import CreateApiKey from '../views/projects/apikeys/CreateApiKey.vue'
import Invite from '../views/invite/Invite.vue'
import CreateProject from '../views/projects/CreateProject.vue'
import Project from '../views/projects/Project.vue'
import ChannelSources from '../views/projects/channelSources/ChannelSources.vue'
import ChannelSource from '../views/projects/channelSources/ChannelSource.vue'
import Invitations from '../views/projects/Invitations/Invitations.vue'
import Invitation from '../views/projects/Invitations/Invitation.vue'
import ChannelSourcesCreate from '../views/projects/channelSources/ChannelSourcesCreate.vue'
import Strategies from '../views/marketing/strategies/Strategies.vue'
import CreateStrategy from '../views/marketing/strategies/CreateStrategy.vue'
import Strategy from '../views/marketing/strategies/Strategy.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/invite',
    component: Invite,
  },
  {
    path: '/auth',
    component: Auth,
    children: [
      { path: 'signin', component: SignIn },
      { path: 'signup', component: Signup },
    ],
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: Dashboard },
      {
        path: 'account',
        component: Account,
      },
      {
        path: 'marketing',
        children: [
          { path: 'strategies', component: Strategies },
          { path: 'strategies/:id', component: Strategy },
          { path: 'strategies/create', component: CreateStrategy },
          {
            path: 'channels',
            children: [
              { path: '', component: Channels },
              { path: 'performance', component: Performance },
            ],
          },
        ],
      },
      {
        path: 'projects',
        children: [
          { path: 'create', component: CreateProject },
          { path: ':id', component: Project },

          { path: 'developer', component: Developer },

          { path: 'apikeys', component: Apikeys },
          { path: 'apikeys/create', component: CreateApiKey },
          { path: 'apikeys/:id', component: Apikey },

          { path: 'users', component: Users },
          { path: 'users/:id', component: User },

          { path: 'roles', component: Roles },
          { path: 'roles/create', component: CreateRole },
          { path: 'roles/:id', component: Role },

          { path: 'channelsources', component: ChannelSources },
          { path: 'channelsources/:id', component: ChannelSource },
          { path: 'channelsources/create', component: ChannelSourcesCreate },

          { path: 'invitations', component: Invitations },
          { path: 'invitations/:id', component: Invitation },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (to.path.startsWith('/auth')) {
    if (userStore.accessToken) {
      next('/')
      return
    }
  }

  if (to.path.startsWith('/') && !to.path.startsWith('/auth') && !to.path.startsWith('/invite')) {
    if (!userStore.accessToken) {
      next('/auth/signin')
      return
    }
  }

  next()
})

export default router
