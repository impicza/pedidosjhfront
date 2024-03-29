
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/login', name: 'login', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/pedidos',
    component: () => import('layouts/MyLayout.vue'),
    // meta: {
    //   auth: true
    // },
    children: [
      { path: '', component: () => import('pages/pedidos/crearPedido.vue') }
    ]
  },
  {
    path: '/generales',
    component: () => import('layouts/MyLayout.vue'),
    // meta: {
    //   auth: true
    // },
    children: [
      { path: 'productos', component: () => import('pages/generales/productos.vue') },
      { path: 'grupos', component: () => import('pages/generales/grupos.vue') },
      { path: 'unidades', component: () => import('pages/generales/unidades.vue') }
    ]
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
