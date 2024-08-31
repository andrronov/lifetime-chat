import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
   {
      path: '/',
      name: 'home',
      component: () => import('../pages/homePage.vue')
   },
   {
      path: '/chat',
      name: 'chatPage',
      component: () => import('../pages/chatComponent.vue')
   },
   {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../pages/chatComponent.vue')
   },
   {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('../pages/errorPage.vue')
   }
]

const router = createRouter({
   history: createWebHashHistory(),
   routes
})

router.beforeEach((to, from) => {
   if(!sessionStorage.getItem('userProfile') && to.path !== '/') return {path: '/'}
})

export default router;