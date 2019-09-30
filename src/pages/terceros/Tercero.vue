<template>
  <div>
    <q-page padding>

      <q-dialog v-model="openedSucursales">
        <q-layout view="Lhh lpR fff" container  style="height: 400px; max-width: 800px" class="bg-white">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container>
            <q-page padding>
              <div class="layout-padding">
                <h3>Agregar Sucursal</h3>
                <div class="overflow-hidden">
                  <div class="row q-col-gutter-sm">
                    <div class="col-3">
                      <q-input color="primary" type="text" v-model="temp.nombre" label="Ingrese el nombre">
                      </q-input>
                    </div>
                    <div class="col-3">
                      <q-input color="primary" type="text" v-model="temp.direccion" label="Ingrese la dirección">
                      </q-input>
                    </div>
                    <div class="col-3">
                      <q-input color="primary" type="number" v-model="temp.telefono" label="Ingrese el teléfono">
                      </q-input>
                    </div>
                    <div class="col-3">
                        <q-select
                          label="Seleccione Lista de precio"
                          v-model="temp.prod_lista_precio"
                          :options="listaprecios"
                          option-label="nombre"
                          option-value="id"
                        />
                    </div>
                  </div>
                </div>
                <q-btn v-if="!showForUpdateSucursal" class="q-mt-sm"
                  color="primary"
                  v-close-popup
                  label="Guardar"
                  @click="addSucursal"
                />
                <q-btn v-if="showForUpdateSucursal" class="q-mt-sm"
                  color="primary"
                  v-close-popup
                  label="Guardar Edición"
                  @click="saveEditSucursal(temp.id)"
                />
              </div>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

      <q-dialog v-model="showItemModal" :content-css="{minWidth: '80vw', minHeight: '40vh'}">
        <q-layout view="Lhh lpR fff" container class="bg-white">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container>
            <q-page padding>
              <div class="layout-padding">
                <h3>{{ showItem.nombre }}</h3>
                <div class="overflow-hidden">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <p><strong>Documento:</strong> {{ showItem.documento }}</p>
                      <p><strong>Sucursales:</strong></p>
                      <ul v-for="sucursal in showItem.sucursales" :key="sucursal.direccion">
                        <li><p>Dirección = {{ sucursal.direccion }}, Teléfono =  {{ sucursal.telefono }}, Lista de precios = {{ sucursal.listaprecio }} </p></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>
        <h3>Crear Tercero</h3>
        <div class="overflow-hidden">
            <div class="row q-col-gutter-sm">
                <div  class="col-3">
                    <q-input v-model="storeItems.documento" label="Numero del documento"/>
                </div>
                <div  class="col-3">
                    <q-input v-model="storeItems.nombre" label="Nombre del tercero"/>
                </div>
                <div class="col-2">
                    <q-checkbox class="q-mt-md" v-model="storeItems.proveedor" left-label label="Proveedor" />
                </div>
                <div class="col-2">
                    <q-checkbox class="q-mt-md" v-model="storeItems.cliente" left-label label="Cliente" />
                </div>
                <div class="col-2">
                    <q-checkbox class="q-mt-md" v-model="storeItems.empleado" left-label label="Empleado" />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-5">
                  <q-btn color="secondary" icon="add_circle" v-on:click="openedSucursales = true" label="Sucursales" />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div v-if="!showForUpdate" class="col-10 q-ma-sm">
                    <template>
                      <q-table
                        title = 'Sucursales'
                        :data="storeItems.sucursales"
                        :columns="ColumnsSucursales"
                        row-key="direccion"
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
                        <q-btn icon="delete" v-on:click="eliminarFila('nuevo' + props.value)" color="negative"></q-btn>
                      </q-td>
                      </q-table>
                    </template>
                </div>
                <div v-if="showForUpdate" class="col-10 q-ma-sm">
                    <template>
                      <q-table
                        title = 'Sucursales'
                        :data="storeItems.sucursales"
                        :columns="ColumnsSucursalesUpdate"
                        row-key="direccion"
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
                        <q-btn v-if="validarEstadoSucursales(props.value) == undefined" class="q-ml-xs" icon="delete" v-on:click="eliminarFila(props.value)" color="negative"></q-btn>
                        <q-btn v-if="validarEstadoSucursales(props.value) == 0" class="q-ml-xs" icon="add_circle" v-on:click="estadoSucursal('activar', props.value)" color="primary"></q-btn>
                        <q-btn v-if="validarEstadoSucursales(props.value) == 1" class="q-ml-xs" icon="remove_circle" v-on:click="estadoSucursal('desactivar', props.value)" color="negative"></q-btn>
                        <q-btn class="q-ml-xs" icon="edit" v-on:click="editSucursal(props.value)" color="warning"></q-btn>
                      </q-td>
                      </q-table>
                    </template>
                </div>
            </div>
            <div class="row q-col-gutter-sm">
                <div class="col-3">
                    <q-btn v-if="!showForUpdate" color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
                    <q-btn v-if="showForUpdate" color="primary" v-on:click="globalValidate('guardar-edicion', storeItems.id)" label="Guardar Edición" />
                </div>
            </div>
        </div>
        <div class="row q-mt-xl">
            <q-table
                title="Listado de Terceros"
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
                    <q-btn v-if="goblalValidarEstado(props.value) == 0" class="q-ml-xs" icon="add_circle" v-on:click="globalValidate('activar', props.value)" color="primary"></q-btn>
                    <q-btn v-if="goblalValidarEstado(props.value) == 1" class="q-ml-xs" icon="remove_circle" v-on:click="globalValidate('inactivar', props.value)" color="negative"></q-btn>
                    <q-btn class="q-ml-xs" icon="remove_red_eye" v-on:click="getShowItem(props.value)" color="positive"></q-btn>
                    <q-btn class="q-ml-xs" icon="edit" v-on:click="globalValidate('editar', props.value)" color="warning"></q-btn>
                </q-td>
            </q-table>
        </div>
    </q-page>
  </div>
</template>

<script>
const axios = require('axios')
import { globalFunctions } from 'boot/mixins.js'

export default {
  name: 'Tercero',
  data: function () {
    return {
      storeItems: {
        nombre: null,
        documento: null,
        proveedor: false,
        empleado: false,
        cliente: false,
        sucursales: []
      },
      urlAPI: 'api/terceros/items',
      listaprecios: [],
      showItemModal: false,
      showItem: [],
      showForUpdate: false,
      showForUpdateSucursal: false,
      openedSucursales: false,
      idEdit: null,
      temp: {
        direccion: null,
        telefono: null,
        nombre: null,
        prod_lista_precio: null,
        id: null
      },
      sucursales_counter: 0,
      ColumnsSucursales: [
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'direccion', required: true, label: 'Dirección', align: 'left', field: 'direccion', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'telefono', required: true, label: 'Teléfono', align: 'left', field: 'telefono', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'lista_de_precio', required: true, label: 'Lista de precio', align: 'left', field: 'lista_de_precio', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      ColumnsSucursalesUpdate: [
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'direccion', required: true, label: 'Dirección', align: 'left', field: 'direccion', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'telefono', required: true, label: 'Teléfono', align: 'left', field: 'telefono', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'lista_de_precio', required: true, label: 'Lista de precio', align: 'left', field: 'lista_de_precio', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'estado', required: true, label: 'Estado', align: 'left', field: 'activo', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      tableData: [],
      tiposTercero: [],
      columns: [
        { name: 'documento', required: true, label: 'Documento', align: 'left', field: 'documento', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'proveedor', required: true, label: 'Proveedor', align: 'left', field: 'proveedor', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'cliente', required: true, label: 'Cliente', align: 'left', field: 'cliente', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'empleado', required: true, label: 'Empleado', align: 'left', field: 'empleado', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'estado', required: true, label: 'Estado', align: 'left', field: 'activo', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      visibleColumns: ['id', 'nombre', 'subgrupo', 'grupo', 'actions'],
      separator: 'horizontal',
      filter: ''
    }
  },
  mixins: [globalFunctions],
  methods: {
    postSave () {
      this.storeItems = {
        nombre: null,
        documento: null,
        proveedor: false,
        empleado: false,
        cliente: false,
        sucursales: []
      }
    },
    preSave () {
    },
    postEdit () {
    },
    validarEstadoSucursales (id) {
      const item = this.storeItems.sucursales.find(item => item.id === id)
      return item.activo
    },
    editSucursal (id) {
      const item = this.storeItems.sucursales.find(item => item.id === id)
      this.temp = item
      this.showForUpdateSucursal = true
      this.openedSucursales = true
    },
    saveEditSucursal (id) {
      var index = null
      this.storeItems.sucursales.forEach(function (element, i) {
        if (id === element.id) {
          index = i
        }
      })
      this.storeItems.sucursales.splice(index, 1)
      this.storeItems.sucursales.push({
        id: this.temp.id,
        direccion: this.temp.direccion,
        nombre: this.temp.nombre,
        telefono: this.temp.telefono,
        prod_lista_precio: this.temp.prod_lista_precio,
        prodListaPrecio_id: this.temp.prod_lista_precio.id,
        lista_de_precio: this.temp.prod_lista_precio.nombre,
        activo: 1
      })
      this.temp.direccion = null
      this.temp.nombre = null
      this.temp.telefono = null
      this.temp.prod_lista_precio = null
      this.showForUpdateSucursal = false
    },
    estadoSucursal (text, id) {
      var index = null
      this.storeItems.sucursales.forEach(function (element, i) {
        if (id === element.id) {
          index = i
        }
      })
      if (text === 'activar') {
        this.storeItems.sucursales[index].activo = 1
      } else {
        this.storeItems.sucursales[index].activo = 0
      }
    },
    eliminarFila (id) {
      var index = null
      this.$q.dialog({
        message: '¿ Quieres eliminar esta fila ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.storeItems.sucursales.forEach(function (element, i) {
          if (id === element.id) {
            index = i
          }
        })
        this.storeItems.sucursales.splice(index, 1)
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    addSucursal () {
      this.storeItems.sucursales.push({
        id: 'nuevo' + this.sucursales_counter,
        direccion: this.temp.direccion,
        nombre: this.temp.nombre,
        telefono: this.temp.telefono,
        prodListaPrecio_id: this.temp.prod_lista_precio.id,
        lista_de_precio: this.temp.prod_lista_precio.nombre
      })
      this.sucursales_counter++
      this.temp.direccion = null
      this.temp.nombre = null
      this.temp.telefono = null
      this.temp.prod_lista_precio = null
    },
    async getShowItem (id) {
      this.$q.loading.show()
      try {
        let data = await axios.get(this.$store.state.jhsoft.url + 'api/terceros/items/' + id)
        this.showItem = await data.data
      } catch (error) {
      } finally {
        this.$q.loading.hide()
        this.showItemModal = true
      }
    }
  },
  created: function () {
    this.globalGetItems()
    this.globalGetForSelect('api/productos/listadeprecios/estado/activos').then(v => {
      this.listaprecios = v
    })
  },
  computed: {
  }
}
</script>

<style>
    .q-table-container{
        width: 100%;
    }
</style>
