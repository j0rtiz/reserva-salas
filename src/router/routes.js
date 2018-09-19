const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: () => import('layouts/login.vue'),
    meta: { rule: 'isEveryone' },
    children: [
      {
        path: '',
        component: () => import('pages/login.vue'),
        meta: { rule: 'isEveryone' }
      },
      {
        path: 'token',
        component: () => import('pages/token.vue'),
        meta: { rule: 'isEveryone' }
      },
      {
        path: 'logout',
        component: () => import('pages/logout.vue'),
        meta: { rule: 'isEveryone' }
      }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/home.vue'),
    meta: { rule: 'isAdmin' },
    children: [
      {
        path: '/home',
        component: () => import('pages/home.vue'),
        meta: { rule: 'isAdmin' }
      },
      {
        path: '/editar/:id',
        component: () => import('pages/editar.vue'),
        meta: { rule: 'isAdmin' }
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/404.vue'),
    meta: { rule: 'isEveryone' }
  }
]
export default routes
