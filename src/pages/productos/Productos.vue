<template>
  <div>
    <q-page padding>
      <q-dialog v-model="openedVencimiento" :content-css="{minWidth: '80vw', minHeight: '40vh'}">
        <q-layout view="Lhh lpR fff" container style="height: 400px; max-width: 800px" class="bg-white">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container>
            <q-page padding>
              <h3>Agregar Vencimiento</h3>
            <div class="overflow-hidden">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select
                      label="Seleccione tipo de almacenamiento"
                      v-model="tempVencimiento.prod_almacenamiento"
                      :options="almacenamientos"
                      option-value="id"
                      option-label="nombre"
                    />
                </div>
                <div class="col">
                  <q-input color="primary" type="number" v-model="tempVencimiento.dias_vencimiento" label="Ingrese los días de vencimiento">
                  </q-input>
                </div>
              </div>
            </div>
            <q-btn v-if="!showForUpdateVencimiento" class="q-mt-sm"
              color="primary"
              v-close-popup
              label="Guardar"
              @click="addVencimiento"
            />
            <q-btn v-if="showForUpdateVencimiento" class="q-mt-sm"
                  color="primary"
                  v-close-popup
                  label="Guardar Edición"
                  @click="saveEditSucursal(temp.id)"
                />
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

      <q-dialog v-model="showItemModal" :content-css="{minWidth: '80vw', minHeight: '40vh'}">
        <q-layout view="Lhh lpR fff" style="height: 400px; max-width: 800px" container class="bg-white">
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
                    <p><strong>Grupo:</strong> {{ showItem.grupo }}</p>
                    <p><strong>Subgrupo:</strong> {{ showItem.subgrupo }}</p>
                    <p><strong>Codigo:</strong> {{ showItem.codigo }}</p>
                    <p><strong>Unidades por animal:</strong> {{ showItem.unid_por_animal }}</p>
                    <p><strong>Impuesto:</strong> {{ showItem.impuesto }}</p>
                    <p><strong>Precios:</strong></p>
                    <ul v-for="precios in showItem.precios" :key="precios.prodListaPrecio_nombre">
                      <li><p>{{ precios.prodListaPrecio_nombre }} = ${{ precios.precio }} </p></li>
                    </ul>
                    <p><strong>Vencimientos:</strong></p>
                    <ul v-for="vencimiento in showItem.vencimientos" :key="vencimiento.prodAlmacenamiento_nombre">
                      <li><p>{{ vencimiento.prodAlmacenamiento_nombre }} = {{ vencimiento.dias_vencimiento }} días </p></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

      <q-dialog v-model="openedPrecios" :content-css="{minWidth: '80vw', minHeight: '40vh'}">
        <q-layout view="Lhh lpR fff" style="height: 400px; max-width: 800px" container class="bg-white">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container>
            <q-page padding>
              <div class="layout-padding">
              <h3>Agregar Precio</h3>
              <div class="overflow-hidden">
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-select
                        label="Seleccione la lista de precios"
                        v-model="tempPrecio.prod_lista_precio"
                        :options="listaprecios"
                        option-value="id"
                        option-label="nombre"
                      />
                  </div>
                  <div class="col">
                    <q-input color="primary" type="number" v-model="tempPrecio.precio" label="Ingrese el valor">
                    </q-input>
                  </div>
                </div>
              </div>
              <q-btn v-if="!showForUpdatePrecio" class="q-mt-sm"
                color="primary"
                v-close-popup
                label="Guardar"
                @click="addPrecio"
              />

              <q-btn v-if="showForUpdatePrecio" class="q-mt-sm"
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

        <h3>Crear Producto</h3>
        <div class="overflow-hidden">
            <div class="row q-col-gutter-sm">
                <div class="col-3">
                    <q-select
                      label="Seleccione Grupo Padre"
                      v-model="storeItems.prodGrupo_id"
                      @input="selectedGrupo()"
                      :options="grupos"
                      option-value="id"
                      option-label="nombre"
                    />
                </div>
                <div v-if="showSubgrupos" class="col-3">
                    <q-select
                      label="Seleccione Subgrupo Padre"
                      v-model="storeItems.prodSubgrupo_id"
                      option-value="id"
                      option-label="nombre"
                      :options="subgrupos"
                      @input="selectedSubgrupo()"
                    />
                </div>
                <div v-if="showProducto" class="col-3">
                    <q-input v-model="storeItems.nombre" label="Nombre del producto"/>
                </div>
                <div v-if="showProducto" class="col-1">
                    <q-input v-model="storeItems.codigo" label="Codigo"/>
                </div>
                <div v-if="showProducto" class="col-2">
                    <q-checkbox class="q-mt-md" v-model="storeItems.marinado" left-label label="Es Marinado?" />
                </div>
            </div>
            <div v-if="showProducto" class="row q-col-gutter-sm q-mt-sm">
                <div class="col-3">
                    <q-select
                      label="Seleccione impuestos"
                      v-model="storeItems.genImpuesto_id"
                      :options="impuestos"
                      option-value="id"
                      option-label="nombre"
                    />
                </div>
                <div class="col-3">
                    <q-select
                      label="Seleccione Unidades"
                      v-model="storeItems.genUnidades_id"
                      :options="unidades"
                      option-value="id"
                      option-label="nombre"
                    />
                </div>
                <div class="col-2" v-if="showAnimales">
                    <q-input v-model="storeItems.unid_por_animal" label="Unid por animal"/>
                </div>
                <div class="col-2" v-if="showAnimales">
                    <q-input v-model="storeItems.unid_por_canasta" label="Unid por Canasta"/>
                </div>
                <div class="col-2">
                     <q-select v-model="storeItems.visible_marinacion" :options="optionsVisibleMarinacion" option-value="value" emit-value
                      map-options option-label="label" label="Visible Marinacion" />
                </div>
            </div>
            <div v-if="showProducto" class="row q-col-gutter-sm q-mt-sm">
                <div class="col-5">
                  <q-btn color="secondary" icon="add_circle" v-on:click="openedVencimiento = true" label="Vencimiento" />
                </div>
                <div class="col-5">
                  <q-btn color="secondary" icon="add_circle" v-on:click="openedPrecios = true" label="Lista de precios" />
                </div>
            </div>
            <div  v-if="showProducto" class="row q-col-gutter-sm q-mt-sm">
                <div class="col-5 q-ma-sm">
                    <template>
                      <q-table
                        :data="storeItems.vencimientos"
                        :columns="ColumnsVencimientos"
                        row-key="prodAlmacenamiento_id"
                      >
                      <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn class="q-ml-xs" icon="delete" v-on:click="eliminarFilaVencimientos(props.value)" color="negative"></q-btn>
                        <q-btn class="q-ml-xs" icon="edit" v-on:click="editVencimiento(props.value)" color="warning"></q-btn>
                      </q-td>
                      </q-table>
                    </template>
                </div>
                <div class="col-5 q-ma-sm">
                    <template>
                      <q-table
                        :data="storeItems.precios"
                        :columns="ColumnsPrecios"
                        row-key="prodListaPrecio_id"
                      >
                      <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn class="q-ml-xs" icon="delete" v-on:click="eliminarFilaPrecios(props.value)" color="negative"></q-btn>
                        <q-btn class="q-ml-xs" icon="edit" v-on:click="editPrecio(props.value)" color="warning"></q-btn>
                      </q-td>
                      </q-table>
                    </template>
                </div>
            </div>
            <div v-if="showProducto" class="row q-col-gutter-sm">
                <div class="col-3">
                  <q-btn v-if="!showForUpdate" color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
                  <q-btn v-if="showForUpdate" color="primary" v-on:click="globalValidate('guardar-edicion', storeItems.id)" label="Guardar Edición" />
                </div>
            </div>
        </div>
        <div class="row q-mt-xl">
            <q-table
                title="Listado de productos"
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
                    <q-btn class="q-ml-xs" icon="edit" v-on:click="preEditar(props.value)" color="warning"></q-btn>
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
  name: 'Productos',
  data: function () {
    return {
      showForUpdate: false,
      urlAPI: 'api/productos/items',
      impuestos: [],
      unidades: [],
      showSubgrupos: false,
      showProducto: false,
      optionsVisibleMarinacion: [
        { label: 'Si',
          value: 1
        },
        {
          label: 'No',
          value: 0
        },
        {
          label: 'N/A',
          value: 2
        }
      ],
      storeItems: {
        nombre: null,
        prodSubgrupo_id: null,
        codigo: null,
        vencimientos: [],
        precios: [],
        genImpuesto_id: null,
        genUnidades_id: null,
        unid_por_animal: null,
        unid_por_canasta: null,
        visible_marinacion: null,
        marinado: false
      },
      showAnimales: true,
      showItemModal: false,
      showForUpdateVencimiento: false,
      showForUpdatePrecio: false,
      showItem: [],
      almacenamientos: [],
      openedVencimiento: false,
      openedPrecios: false,
      tempVencimiento: {
        prodAlmacenamiento_id: null,
        prodAlmacenamiento_nombre: null,
        dias_vencimiento: null
      },
      tempPrecio: {
        prodListaPrecio_id: null,
        precio: null,
        prodListaPrecio_nombre: null
      },
      vencimientos_counter: 0,
      precio_counter: 0,
      ColumnsVencimientos: [
        { name: 'almacenamiento', required: true, label: 'Almacenamiento', align: 'left', field: 'prodAlmacenamiento_nombre', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'dias', required: true, label: 'Días', align: 'left', field: 'dias_vencimiento', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      listaprecios: [],
      ColumnsPrecios: [
        { name: 'lista', required: true, label: 'Lista', align: 'left', field: 'prodListaPrecio_nombre', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'valor', required: true, label: 'Precio', align: 'left', field: 'precio', sortable: true, classes: 'my-class', style: 'width: 100px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      tableData: [],
      grupos: [],
      subgrupos: [],
      columns: [
        { name: 'codigo', required: true, label: 'Codigo', align: 'left', field: 'codigo', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'subgrupo', required: true, label: 'Subgrupo', align: 'left', field: 'subgrupo', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'grupo', required: true, label: 'Grupo', align: 'left', field: 'grupo', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      visibleColumns: ['id', 'nombre', 'subgrupo', 'grupo', 'actions'],
      separator: 'horizontal',
      filter: ''
    }
  },
  mixins: [globalFunctions],
  methods: {
    preEditar (id) {
      this.globalValidate('editar', id)
      this.showAnimales = true
      this.showSubgrupos = true
      this.showProducto = true
    },
    postEdit () {
      this.selectedGrupo()
    },
    postSave () {
      this.showSubgrupos = false
      this.showProducto = false
      this.storeItems = {
        nombre: null,
        prodSubgrupo_id: null,
        codigo: null,
        vencimientos: [],
        precios: [],
        genImpuesto_id: null,
        genUnidades_id: null,
        unid_por_animal: null,
        unid_por_canasta: null,
        visible_marinacion: null,
        marinado: false
      }
    },
    preSave () {
      this.storeItems.prodSubgrupo_id = this.storeItems.prodSubgrupo_id.id
      this.storeItems.genImpuesto_id = this.storeItems.genImpuesto_id.id
      this.storeItems.genUnidades_id = this.storeItems.genUnidades_id.id
    },
    addVencimiento () {
      this.storeItems.vencimientos.push({
        id: 'nuevo' + this.vencimientos_counter,
        prodAlmacenamiento_id: this.tempVencimiento.prod_almacenamiento.id,
        dias_vencimiento: this.tempVencimiento.dias_vencimiento,
        prodAlmacenamiento_nombre: this.tempVencimiento.prod_almacenamiento.nombre
      })
      this.vencimientos_counter++
      this.tempVencimiento.prod_almacenamiento = null
      this.tempVencimiento.dias_vencimiento = null
    },
    addPrecio () {
      this.storeItems.precios.push({
        id: 'nuevo' + this.precio_counter,
        prodListaPrecio_id: this.tempPrecio.prod_lista_precio.id,
        precio: this.tempPrecio.precio,
        prodListaPrecio_nombre: this.tempPrecio.prod_lista_precio.nombre
      })
      this.precio_counter++
      this.tempPrecio.prod_lista_precio = null
      this.tempPrecio.precio = null
    },
    editVencimiento (id) {
      const item = this.storeItems.vencimientos.find(item => item.id === id)
      this.tempVencimiento = item
      this.showForUpdateVencimiento = true
      this.openedVencimiento = true
    },
    editPrecio (id) {
      const item = this.storeItems.precios.find(item => item.id === id)
      this.tempPrecio = item
      this.showForUpdatePrecio = true
      this.openedPrecios = true
    },
    eliminarFilaVencimientos (id) {
      var index = null
      this.$q.dialog({
        message: '¿ Quieres eliminar esta fila ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.storeItems.vencimientos.forEach(function (element, i) {
          if (id === element.id) {
            index = i
          }
        })
        this.storeItems.vencimientos.splice(index, 1)
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    eliminarFilaPrecios (id) {
      var index = null
      this.$q.dialog({
        message: '¿ Quieres eliminar esta fila ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.storeItems.precios.forEach(function (element, i) {
          if (id === element.id) {
            index = i
          }
        })
        this.storeItems.precios.splice(index, 1)
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    async selectedSubgrupo () {
      this.showProducto = true
    },
    async selectedGrupo () {
      if (!this.showForUpdate) {
        this.storeItems.prodSubgrupo_id = null
      }
      if (this.storeItems.prodGrupo_id.animal === '0') {
        this.showAnimales = false
        this.storeItems.unid_por_animal = 99
      }
      try {
        let data = await axios.get(this.$store.state.jhsoft.url + 'api/productos/subgrupos/grupofilter/' + this.storeItems.prodGrupo_id.id)
        this.subgrupos = data.data
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Hubo un error al filtrar los subgrupos!' })
      } finally {
        this.showSubgrupos = true
      }
    },
    async getShowItem (id) {
      this.$q.loading.show()
      try {
        let data = await axios.get(this.$store.state.jhsoft.url + 'api/productos/items/' + id)
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
    this.globalGetForSelect('api/generales/unidades/estado/activos').then(v => {
      this.unidades = v
    })
    this.globalGetForSelect('api/generales/impuestos/estado/activos').then(v => {
      this.impuestos = v
    })
    this.globalGetForSelect('api/productos/listadeprecios/estado/activos').then(v => {
      this.listaprecios = v
    })
    this.globalGetForSelect('api/productos/almacenamiento/estado/activos').then(v => {
      this.almacenamientos = v
    })
    this.globalGetForSelect('api/productos/grupos/estado/activos').then(v => {
      this.grupos = v
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
