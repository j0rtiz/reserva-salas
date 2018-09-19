export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('layouts/home'),
    children: [
      {
        path: '/home',
        component: () => import('pages/home')
      }
    ]
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
    path: '*',
    component: () => import('pages/404')
  }
]
