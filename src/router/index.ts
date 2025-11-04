import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: DashBoard,
      component: () => import('../views/Main.vue'),
      children: [
        {
          path: '/home/orders',
          name: 'orders',
          component: () => import('../views/OrdersView.vue'),
        },
        {
          path: '/home/my-orders',
          name: 'my-orders',
          component: () => import('../views/MyOrdersView.vue'),
        },
        {
          path: '/home/order-template',
          name: 'order-template',
          component: () => import('../views/OrderTemplatesView.vue'),
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // component: DashBoard,
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/order-template/:id',
      name: 'OrderTemplateDetails',
      component: () => import('../views/OrderTemplatesDetailView.vue'),
      props: true
    },
  ],
})
export default router
