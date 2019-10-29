<template>
    <div>
        <q-page padding>
            <h3>Crear Pedido</h3>
            <div class="row q-col-gutter-md">
              <div class="col-sm-3 col-12">
                <q-select
                    class="w-100"
                    v-model="temp.producto"
                    use-input
                    hide-selected
                    fill-input
                    option-value="id"
                    option-label="nombre"
                    label="Producto"
                    option-disable="inactive"
                    input-debounce="0"
                    :options="options.productos"
                    @filter="filterProductos"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
              </div>
              <div class="col-sm-2 col-12">
                <q-select
                    class="w-100"
                    v-model="temp.unidades"
                    use-input
                    hide-selected
                    fill-input
                    option-value="id"
                    option-label="nombre"
                    label="Unidades"
                    option-disable="inactive"
                    input-debounce="0"
                    :options="options.unidades"
                    @filter="filterUnidades"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
              </div>
              <div class="col-sm-2 col-12">
                <q-input type="number" v-model="temp.cantidad" label="Cantidad"/>
              </div>
              <div class="col-sm-2 col-6">
                <q-btn color="positive" v-on:click="addProducto()" label="Agregar" />
              </div>
              <div class="col-sm-2 col-6">
                <q-btn v-if="!showForUpdate" color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
                <q-btn v-if="showForUpdate" color="primary" v-on:click="globalValidate('guardar-edicion', storeItems.id)" label="Guardar Edición" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-sm-6 col-12">
                <q-table
                    title="Productos Cerdo"
                    :data="datos.productosCerdo"
                    :columns="columnsProductos"
                    :separator="separator"
                    :filter="filterTableCerdo"
                    row-key="id"
                    color="secondary"
                    table-style="width:100%"
                >
                  <template slot="top-right" slot-scope="props">
                    <q-input
                        hide-underline
                        color="secondary"
                        v-model="filterTableCerdo"
                        class="col-6"
                        debounce="500"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <q-btn
                        flat round dense
                        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="props.toggleFullscreen"
                    />
                  </template>

                    <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn icon="delete" v-on:click="eliminarFila('productosCerdo',props.value)" color="negative"></q-btn>
                    </q-td>
                </q-table>
              </div>
              <div class="col-sm-6 col-12">
                <q-table
                    title="Productos Res"
                    :data="datos.productosRes"
                    :columns="columnsProductos"
                    :separator="separator"
                    :filter="filterTableRes"
                    row-key="id"
                    color="secondary"
                    table-style="width:100%"
                >
                    <template slot="top-right" slot-scope="props">
                      <q-input
                          hide-underline
                          color="secondary"
                          v-model="filterTableRes"
                          class="col-6"
                          debounce="500"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                      <q-btn
                          flat round dense
                          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                          @click="props.toggleFullscreen"
                      />
                  </template>

                    <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn icon="delete" v-on:click="eliminarFila('productosRes',props.value)" color="negative"></q-btn>
                    </q-td>
                </q-table>
              </div>
            </div>
                        <div class="row q-col-gutter-md q-mt-md">
              <div class="col-sm-6 col-12">
                <q-table
                    title="Otros Productos"
                    :data="datos.productosOtros"
                    :columns="columnsProductos"
                    :separator="separator"
                    :filter="filterTableOtros"
                    row-key="id"
                    color="secondary"
                    table-style="width:100%"
                >
                  <template slot="top-right" slot-scope="props">
                    <q-input
                        hide-underline
                        color="secondary"
                        v-model="filterTableOtros"
                        class="col-6"
                        debounce="500"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <q-btn
                        flat round dense
                        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="props.toggleFullscreen"
                    />
                  </template>

                    <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn icon="delete" v-on:click="eliminarFila('productosOtros',props.value)" color="negative"></q-btn>
                    </q-td>
                </q-table>
              </div>
              <div class="col-sm-6 col-12">
                <div style="width:100%">
                  <q-input
                  ref="observaciones"
                  v-model="storeItems.observaciones"
                  type="textarea"
                  label="Observaciones"
                />
                </div>
              </div>
            </div>
            <div class="row q-mt-xl">
              <div class="col-12">
                  <q-table
                    v-if="tableVisible"
                    title= "Mis pedidos"
                    :data="tableData"
                    :columns="columnsPedidos"
                    :filter="filter"
                    :visible-columns="visibleColumns"
                    :separator="separator"
                    row-key="id"
                    color="secondary"
                    table-style="width:100%"
                >
                    <template slot="top-right" slot-scope="props">
                        <q-input
                            hide-underline
                            color="secondary"
                            v-model="filter"
                            class="col-6"
                            debounce="500"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                        <q-btn
                            flat round dense
                            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                            @click="props.toggleFullscreen"
                        />
                    </template>

                    <q-td slot="body-cell-estado" slot-scope="props" :props="props">
                        <span v-if="parseInt(props.value) === 1">
                        <q-badge color="negative" multi-line>
                          Creado
                        </q-badge>
                      </span>
                      <span v-if="parseInt(props.value) === 0">
                        <q-badge color="positive" multi-line>
                          Recibido
                        </q-badge>
                      </span>
                    </q-td>

                    <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn v-if="validarEstado(props.value) == 1" class="q-ml-xs" icon="edit" v-on:click="globalValidate('editar', props.value)" color="warning"></q-btn>
                        <a v-if="validarEstado(props.value) == 0" target="_blank" :href="$store.state.pedidosjh.url+'api/pedidos/imprimirpedidocliente/'+ props.value + '?token='+ $auth.token()">
                          <q-btn class="q-ml-xs" @click="reload" icon="assignment" color="primary">
                          </q-btn>
                      </a>
                    </q-td>
                </q-table>
              </div>

          </div>
        </q-page>
    </div>
</template>

<script>

import { globalFunctions } from 'boot/mixins.js'

export default {
  name: 'PageSalMercancia',
  data () {
    return {
      urlAPI: 'api/pedidos/items',
      showForUpdate: false,
      productos: [],
      unidades: [],
      storeItems: {
        productos: [],
        observaciones: 'Sin observaciones.'
      },
      datos: {
        productosCerdo: [],
        productosRes: [],
        productosOtros: []
      },
      temp: {
        producto: null,
        unidades: null,
        cantidad: null
      },
      tableData: [],
      options: {
        productos: this.productos,
        unidades: this.unidades
      },
      columnsProductos: [
        { name: 'producto_nombre', required: true, label: 'Nombre', align: 'left', field: 'producto_nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'unidad_nombre', required: true, label: 'Unidades', align: 'left', field: 'unidad_nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'cantidad', required: true, label: 'Cantidad', align: 'left', field: 'cantidad', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      separator: 'horizontal',
      columnsPedidos: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'created_at', required: true, label: 'Fecha de creación', align: 'left', field: 'created_at', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'estado', required: true, label: 'Estado', align: 'left', field: 'estado', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      visibleColumns: ['id', 'nombre', 'actions'],
      filter: '',
      filterTableCerdo: '',
      filterTableRes: '',
      filterTableOtros: '',
      tableVisible: true
    }
  },
  mixins: [globalFunctions],
  methods: {
    preSave () {
      this.storeItems.user_id = this.$auth.user().id
      this.datos.productosCerdo.forEach((item) => {
        this.storeItems.productos.push(item)
      })
      this.datos.productosRes.forEach((item) => {
        this.storeItems.productos.push(item)
      })
      this.datos.productosOtros.forEach((item) => {
        this.storeItems.productos.push(item)
      })
    },
    reload () {
      var app = this
      this.$q.loading.show()
      setTimeout(function () { app.globalGetForSelect('api/pedidos/listadoporcliente/' + this.$auth.user().id, 'tableData') }, 500)
    },
    postSave () {
      this.datos = {
        productosCerdo: [],
        productosRes: []
      }
      this.globalGetForSelect('api/pedidos/listadoporcliente/' + this.$auth.user().id, 'tableData', 'tableVisible')
      this.storeItems = {
        productos: []
      }
    },
    postEdit () {
      this.datos.productosCerdo = this.storeItems.productosCerdo
      this.datos.productosRes = this.storeItems.productosRes
      this.datos.productosOtros = this.storeItems.productosOtros
      this.storeItems.productos = []
    },
    filterProductos (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options.productos = this.productos.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterUnidades (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options.unidades = this.unidades.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    },
    eliminarFila (grupo, id) {
      console.log(id)
      var index = null
      this.datos[grupo].forEach(function (element, i) {
        if (id === element.id) {
          index = i
        }
      })
      this.datos[grupo].splice(index, 1)
    },
    addProducto () {
      var grupoDestino = 'productos' + this.temp.producto.grupo
      var listValidate = this.datos[grupoDestino].filter(v => v.producto_nombre.indexOf(this.temp.producto.nombre) > -1)
      if (listValidate.length > 0) {
        this.$q.notify({ color: 'negative', message: 'Este producto ya fue agregado, verifique cantidad!' })
      } else {
        this.datos[grupoDestino].push({
          id: 'nuevo' + parseInt(this.datos[grupoDestino].length),
          producto_id: this.temp.producto.id,
          producto_nombre: this.temp.producto.nombre,
          cantidad: this.temp.cantidad,
          unidad_id: this.temp.unidades.id,
          unidad_nombre: this.temp.unidades.nombre
        })
      }
      this.temp = {
        producto: null,
        unidades: null,
        cantidad: null
      }
    },
    validarEstado (id) {
      const item = this.tableData.find(item => item.id === id)
      return item.estado
    }
  },
  created: function () {
    this.globalGetForSelect('api/pedidos/listadoporcliente/' + this.$auth.user().id, 'tableData')
    this.globalGetForSelect('api/generales/unidades/estado/activos', 'unidades')
    this.globalGetForSelect('api/generales/productos/estado/activos', 'productos')
  }
}
</script>

<style scoped>
  .my-card{
    width: 100%;
    max-width: 250px;
    cursor:pointer}
  .my-card:hover{
    background-color:greenyellow
  }
  .my-card-prog{
    cursor: pointer;
  }
  .my-card-prog:hover{
    background-color: aqua;
  }
  h5{
    width: 100%;
    margin: 5px;
  }

  .col-lotes {
    max-height: 600px;
    overflow-y: scroll;
  }
</style>
