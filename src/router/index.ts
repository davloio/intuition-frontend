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
    path: '/addresses',
    name: 'addresses',
    component: () => import('@/views/AddressesPage.vue')
  },
  {
    path: '/addresses/:address',
    name: 'address-detail',
    component: () => import('@/views/AddressDetailPage.vue')
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
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

export default router
