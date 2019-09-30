
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
    path: '/generales',
    component: () => import('layouts/MyLayout.vue'),
    // meta: {
    //   auth: true
    // },
    children: [
      { path: 'tipoimpuestos', component: () => import('pages/generales/GenTipoImpuesto.vue') },
      { path: 'impuestos', component: () => import('pages/generales/GenImpuesto.vue') },
      { path: 'unidades', component: () => import('pages/generales/GenUnidades.vue') },
      { path: 'generalidades', component: () => import('pages/generales/Generalidades.vue') }
    ]
  },
  {
    path: '/productos',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: 'almacenamiento', component: () => import('pages/productos/ProdAlmacenamiento.vue') },
      { path: 'grupos', component: () => import('pages/productos/ProdGrupo.vue') },
      { path: 'subgrupos', component: () => import('pages/productos/ProdSubgrupo.vue') },
      { path: '', component: () => import('pages/productos/Productos.vue') },
      { path: 'listadodeprecios', component: () => import('pages/productos/ProdListaPrecio.vue') }
    ]
  },
  {
    path: '/terceros',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/terceros/Tercero.vue') }
    ]
  },
  {
    path: '/entradas',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/entradas/EntMercancia.vue') },
      { path: 'tipos', component: () => import('pages/entradas/EntTipo.vue') }
    ]
  },
  {
    path: '/lotes',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/lotes/Lote.vue') },
      { path: 'empaque', component: () => import('pages/lotes/LotEmpaque.vue') },
      { path: 'peso-planta', component: () => import('pages/lotes/PesoPlanta.vue') },
      { path: 'etiqueta-interna', component: () => import('pages/lotes/LotEtiquetaInterna.vue') }
    ]
  },
  {
    path: '/despachos',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/despacho/SalMercancia.vue') },
      { path: 'listado', component: () => import('pages/despacho/ListadoSalMercancia.vue') },
      { path: 'crearporlote', component: () => import('pages/despacho/DespachoPorLote.vue') }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/Register.vue'),
    meta: {
      auth: false
    }
  },
  {
    path: '/inventario',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/inventario/ListadoInventario.vue') }
    ]
  },
  {
    path: '/informes',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: 'peso-planta', component: () => import('pages/informes/pesoplanta.vue') }
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
