const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: () => import('layouts/login.vue'),
    meta: { rule: 'isPublic' },
    children: [
      {
        path: '',
        component: () => import('pages/login.vue'),
        meta: { rule: 'isPublic' }
      },
      {
        path: 'token',
        component: () => import('pages/token.vue'),
        meta: { rule: 'isPublic' }
      },
      {
        path: 'logout',
        component: () => import('pages/logout.vue'),
        meta: { rule: 'isPublic' }
      }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/home.vue'),
    meta: { rule: 'isPublic' },
    children: [
      {
        path: '/home',
        component: () => import('pages/home.vue'),
        meta: { rule: 'isPublic' }
      }
    ]
  },
  {
    path: '/usuario',
    component: () => import('layouts/home.vue'),
    meta: { rule: 'isAdmin' },
    children: [
      {
        path: '/usuario/:id',
        component: () => import('pages/usuario.vue'),
        meta: { rule: 'isAdmin' }
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/404.vue'),
    meta: { rule: 'isPublic' }
  }
]
export default routes
