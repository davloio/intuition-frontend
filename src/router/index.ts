import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/blocks',
    name: 'blocks',
    component: () => import('@/views/BlocksPage.vue')
  },
  {
    path: '/blocks/:identifier',
    name: 'block-detail',
    component: () => import('@/views/BlockDetailPage.vue')
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/TransactionsPage.vue')
  },
  {
    path: '/transactions/:hash',
    name: 'transaction-detail',
    component: () => import('@/views/TransactionDetailPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
