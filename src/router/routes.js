
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue'), meta: { auth: true } },
      { path: 'register', name: 'register', component: () => import('pages/Register.vue'), meta: { auth: { roles: 'admin' } } },
      { path: 'changepass', name: 'changepass', component: () => import('pages/user/cambiarPass.vue'), meta: { auth: true } }
    ]
  },
  {
    path: '/pedidos',
    component: () => import('layouts/MyLayout.vue'),
    meta: {
      auth: true
    },
    children: [
      { path: '', component: () => import('pages/pedidos/crearPedido.vue') },
      { path: 'listapedidos', component: () => import('pages/pedidos/listaPedidos.vue'), meta: { auth: { roles: 'admin' } } }
    ]
  },
  {
    path: '/generales',
    component: () => import('layouts/MyLayout.vue'),
    meta: {
      auth: {
        roles: 'admin'
      }
    },
    children: [
      { path: 'productos', component: () => import('pages/generales/productos.vue') },
      { path: 'grupos', component: () => import('pages/generales/grupos.vue') },
      { path: 'unidades', component: () => import('pages/generales/unidades.vue') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue'),
    meta: {
      auth: false
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
