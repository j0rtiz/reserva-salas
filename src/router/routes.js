export default [
  {
    path: '/',
    component: () => import('layouts/home'),
    children: [
      {
        path: '/',
        component: () => import('pages/home')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/login'),
    children: [
      {
        path: '/',
        component: () => import('pages/login/login')
      },
      {
        path: 'token',
        component: () => import('pages/login/token')
      },
      {
        path: 'logout',
        component: () => import('pages/login/logout')
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/404')
  }
]
