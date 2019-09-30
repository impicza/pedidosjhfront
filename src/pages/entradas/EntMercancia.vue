<template>
  <div>
    <q-page padding>

      <div class="fixed-total"><span>Subtotal: </span> {{ subtotal }} | Impuesto: {{ impuesto_total }} | Total: {{ total }}</div>

      <q-dialog v-model="openedAddProducto" :content-css="{minWidth: '80vw', minHeight: '10vh'}">
        <q-layout view="Lhh lpR fff" container style="height: 400px; max-width: 800px" class="bg-white">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container>
            <q-page padding>
              <h3>Agregar Producto</h3>
              <div class="overflow-hidden">
                <div class="row q-col-gutter-sm">
                  <div class="col-4">
                    <q-select
                      v-model="temp.producto_nombre"
                      use-input
                      hide-selected
                      fill-input
                      option-value="nombre"
                      option-label="nombre"
                      label="Producto"
                      option-disable="inactive"
                      emit-value
                      map-options
                      input-debounce="0"
                      :options="optionsProductos"
                      @filter="filterFn"
                      @input="selectedProducto"
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
                  <div class="col-2">
                    <q-input color="primary" type="number" v-model="temp.producto_cantidad" label="Cantidad" ref="cantidad" v-on:keyup.enter="() => $refs.precio.focus()">
                    </q-input>
                  </div>
                  <div class="col-2">
                    <q-input color="primary" type="number" v-model="temp.producto_precio" label="Precio" ref="precio">
                    </q-input>
                  </div>
                  <div class="col-2">
                    <q-input filled readonly color="primary" type="number" v-model="temp_impuesto_unit" label="Impuesto Unit">
                    </q-input>
                  </div>
                  <div class="col-2">
                    <q-input filled readonly color="primary" type="number" v-model="temp_total" label="total">
                    </q-input>
                  </div>
                </div>
              </div>
            <q-btn class="q-mt-sm"
              color="primary"
              label="Guardar"
              @click="addProducto"
            />
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

        <h3>Crear Entrada de mercancia</h3>
        <div class="overflow-hidden">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-select
                      label="Seleccione Tipo de entrada"
                      v-model="storeItems.entTipo_id"
                      :options="tiposEntrada"
                      option-value="id"
                      option-label="nombre"
                      option-disable="inactive"
                      emit-value
                      map-options
                    />
                </div>
                <div class="col-6">
                    <q-input label="Fecha de entrada" v-model="storeItems.fecha_entrada" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="storeItems.fecha_entrada" @input="() => $refs.qDateProxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
            </div>
            <SelectTerceroSucursal v-model="storeItems.proveedor_id" columnas='col-12' labelTercero='Proveedor'/>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-5">
                  <q-btn color="secondary" icon="add_circle" v-on:click="openedAddProducto = true" label="Producto" />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-11 q-ma-sm">
                    <q-table
                      :data="storeItems.productos"
                      :columns="ColumnsProductos"
                      row-key="name"
                      color="secondary"
                    >
                      <!-- slot name syntax: body-cell-<column_name> -->
                      <q-td slot="body-cell-actionsProductos" slot-scope="props" :props="props">
                        <q-btn icon="remove" v-on:click="eliminarFila(props.value)" color="negative"></q-btn>
                      </q-td>
                    </q-table>
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-3">
                    <q-btn color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
                </div>
            </div>
        </div>
        <div v-if="showList" class="row q-mt-xl q-mb-xl">
            <q-table
                title="Listado de entradas"
                :data="tableData"
                :columns="columns"
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

                <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                    <q-btn icon="delete" v-on:click="globalValidate('eliminar', props.value)" color="negative"></q-btn>
                </q-td>
            </q-table>
        </div>
    </q-page>
  </div>
</template>

<script>
import { globalFunctions } from 'boot/mixins.js'
import SelectTerceroSucursal from 'components/terceros/SelectTerceroSucursal.vue'

export default {
  name: 'pageEntradaMercancia',
  components: {
    SelectTerceroSucursal
  },
  data: function () {
    return {
      urlAPI: 'api/entradas/items',
      showList: true,
      storeItems: {
        entTipo_id: null,
        fecha_entrada: null,
        proveedor_id: null,
        productos: [],
        subtotal: null,
        impuesto_total: null,
        total: null
      },
      temp: {
        producto_id: null,
        producto_cantidad: null,
        producto_nombre: null,
        producto_precio: 0
      },
      optionsProductos: this.productos,
      precios: [],
      openedAddProducto: false,
      productos: [],
      tiposEntrada: [],
      tableData: [],
      columns: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'proveedor', required: true, label: 'Proveedor', align: 'left', field: 'proveedor', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'sucursal', required: true, label: 'Sucursal', align: 'left', field: 'sucursal', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'valor_total', required: true, label: 'Valor total', align: 'left', field: 'total', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'fecha', required: true, label: 'Fecha', align: 'left', field: 'fecha_entrada', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      ColumnsProductos: [
        { name: 'producto', required: true, label: 'Producto', align: 'left', field: 'producto_nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'cantidad', required: true, label: 'Peso en kilos', align: 'left', field: 'cantidad', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'precio_unit', required: true, label: 'Precio unit', align: 'left', field: 'precio_unit', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'impuesto_unit', required: true, label: 'Impuesto Unit', align: 'left', field: 'impuesto_unit', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'precio_total', required: true, label: 'Precio total', align: 'left', field: 'precio_total', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actionsProductos', required: true, label: 'Eliminar', align: 'left', field: 'position', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      visibleColumns: ['id', 'nombre', 'actions'],
      separator: 'horizontal',
      filter: ''
    }
  },
  mixins: [globalFunctions],
  methods: {
    preSave () {
      this.storeItems.subtotal = this.subtotal
      this.storeItems.impuesto_total = this.impuesto_total
      this.storeItems.total = this.total
      this.storeItems.proveedor_id = this.storeItems.proveedor_id.id
    },
    postSave () {
      this.datos.tercero_id = null
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.optionsProductos = this.productos.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    },
    eliminarFila (id) {
      var index = null
      this.$q.dialog({
        message: '¿ Quieres eliminar esta fila ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.storeItems.productos.forEach(function (element, i) {
          if (id === element.id) {
            index = i
          }
        })
        this.storeItems.productos.splice(index, 1)
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    async selectedProducto () {
      const getProducto = this.productos.find(producto => producto.nombre === this.temp.producto_nombre)
      this.temp.producto_id = getProducto.id
      this.temp.impuesto = getProducto.impuesto
      this.$refs.cantidad.focus()
    },
    addProducto () {
      var pos = this.storeItems.productos.length
      this.storeItems.productos.push({
        producto_id: this.temp.producto_id,
        cantidad: this.temp.producto_cantidad,
        impuesto_unit: this.temp_impuesto_unit,
        precio_unit: this.temp.producto_precio,
        producto_nombre: this.temp.producto_nombre,
        precio_total: this.temp_total,
        position: pos
      })
      this.temp.producto_id = null
      this.temp.producto_cantidad = null
      this.temp_precio = null
      this.temp.producto_nombre = null
      this.precio_total = null
      this.temp.producto_precio = null
    }
  },
  created: function () {
    this.globalGetItems()
    this.globalGetForSelect('api/entradas/tipos').then(v => {
      this.tiposEntrada = v
    })
    this.globalGetForSelect('api/productos/todosconimpuestos').then(v => {
      this.productos = v
    })
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    today = yyyy + '/' + mm + '/' + dd
    this.storeItems.fecha_entrada = today
  },
  computed: {
    temp_impuesto_unit: function () {
      var response = null
      const getProducto = this.productos.find(producto => producto.nombre === this.temp.producto_nombre)
      if (getProducto) {
        response = (getProducto.impuesto / 100) * this.temp.producto_precio
      }
      return response
    },
    temp_total: function () {
      var response = 0
      if (this.temp.producto_cantidad != null) {
        response = (parseInt(this.temp.producto_precio) + parseInt(this.temp_impuesto_unit)) * this.temp.producto_cantidad
      }
      return response
    },
    subtotal: function () {
      var acum = 0
      var item = 0
      this.storeItems.productos.forEach(function (element) {
        item = element.precio_unit * element.cantidad
        acum = item + acum
      })
      return acum
    },
    impuesto_total: function () {
      var acum = 0
      var item = 0
      this.storeItems.productos.forEach(function (element) {
        item = element.impuesto_unit * element.cantidad
        acum = item + acum
      })
      return acum
    },
    total: function () {
      return this.subtotal + this.impuesto_total
    }
  }
}
</script>

<style>
    .q-table-container{
        width: 100%;
    }
    .fixed-total{
      color:#fff;
      background: green;
      display: table;
      padding: 8px;
      border-radius: 10px 10px 0px 0px;
      position: fixed;
      bottom: 0px;
      right: 60px;
      z-index: 1;
    }
</style>
