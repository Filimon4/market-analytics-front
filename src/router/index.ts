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
import CreateChannel from '../views/marketing/channels/CreateChannel.vue'
import Performances from '../views/marketing/performances/Performances.vue'
import CreatePerformance from '../views/marketing/performances/CreatePerformance.vue'
import Performance from '../views/marketing/performances/Performance.vue'
import ChannelV2 from '../views/marketing/channels/ChannelV2.vue'
import CreateChannelMetric from '../views/marketing/channelMetrics/CreateChannelMetric.vue'
import ChannelMetric from '../views/marketing/channelMetrics/ChannelMetric.vue'
import CreateUfChannels from '../views/marketing/ufChannels/CreateUfChannels.vue'
import UfChannel from '../views/marketing/ufChannels/ufChannel.vue'
import PerformanceProperty from '../views/marketing/performances/properties/PerformanceProperty.vue'
import Report from '@/src/views/report/Report.vue'
import Reports from '@/src/views/report/Reports.vue'
import CreateReport from '@/src/views/report/CreateReport.vue'
import CreateComparePerformance from '@/src/views/marketing/performances/CreateComparePerformance.vue'
import CreateCompareStrategyV2 from '@/src/views/marketing/strategies/CreateCompareStrategy/CreateCompareStrategyV2.vue'

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
          {
            path: 'strategies',
            children: [
              { path: '', component: Strategies },
              { path: 'create', component: CreateStrategy },
              { path: 'compare/create', component: CreateCompareStrategyV2 },
              { path: ':id', component: Strategy },
            ],
          },
          {
            path: 'performances',
            children: [
              { path: '', component: Performances },
              { path: 'create', component: CreatePerformance },
              { path: 'compare/create', component: CreateComparePerformance },
              {
                path: ':id',
                children: [
                  { path: '', component: Performance },
                  {
                    path: 'properties',
                    children: [{ path: ':propertyId', component: PerformanceProperty }],
                  },
                ],
              },
            ],
          },
          {
            path: 'channels',
            children: [
              { path: '', component: Channels },
              { path: 'create', component: CreateChannel },
              {
                path: ':id',
                children: [
                  { path: '', component: ChannelV2 },
                  {
                    path: 'metrics',
                    children: [
                      { path: 'create', component: CreateChannelMetric },
                      { path: ':metricId', component: ChannelMetric },
                    ],
                  },
                  {
                    path: 'uf-channels',
                    children: [
                      { path: 'create', component: CreateUfChannels },
                      { path: ':propertyId', component: UfChannel },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'analytics',
            children: [
              { path: '', component: Reports },
              { path: 'create', component: CreateReport },
              { path: ':id', component: Report },
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

          {
            path: 'apikeys',
            children: [
              { path: '', component: Apikeys },
              { path: 'create', component: CreateApiKey },
              { path: ':id', component: Apikey },
            ],
          },

          {
            path: 'users',
            children: [
              { path: '', component: Users },
              { path: ':id', component: User },
            ],
          },

          {
            path: 'roles',
            children: [
              { path: '', component: Roles },
              { path: 'create', component: CreateRole },
              { path: ':id', component: Role },
            ],
          },

          {
            path: 'channelsources',
            children: [
              { path: '', component: ChannelSources },
              { path: 'create', component: ChannelSourcesCreate },
              { path: ':id', component: ChannelSource },
            ],
          },

          {
            path: 'invitations',
            children: [
              { path: '', component: Invitations },
              { path: ':id', component: Invitation },
            ],
          },
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
