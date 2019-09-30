<template>
  <div>
    <q-page padding>
      <q-dialog v-model="openedProgramacion" :content-css="{minWidth: '80vw', minHeight: '40vh'}">
        <q-layout view="Lhh lpR fff" container style="height: 400px; max-width: 800px" class="bg-white">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container>
            <q-page padding>
              <h3>Agregar Programación</h3>
            <div class="overflow-hidden">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input label="Fecha de Desposte" v-model="temp.fecha_desposte" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy3" transition-show="scale" transition-hide="scale">
                            <q-date v-model="temp.fecha_desposte" @input="() => $refs.qDateProxy3.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                <div class="col">
                  <q-input color="primary" type="number" v-model="temp.num_animales" label="Numero de animales">
                  </q-input>
                </div>
                <div class="col">
                  <q-checkbox class="q-mt-md" v-model="temp.producto_canal" left-label label="Venta Canal?" />
                </div>
              </div>
            </div>
            <q-btn v-if="!showForUpdateProgramacion" class="q-mt-sm"
              color="primary"
              v-close-popup
              label="Guardar"
              @click="addProgramacion"
            />

            <q-btn v-if="showForUpdateProgramacion" class="q-mt-sm"
                color="primary"
                v-close-popup
                label="Guardar Edición"
                @click="saveEditProgramacion(temp.id)"
              />
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

      <h3>Crear Lote</h3>
        <div class="overflow-hidden">
            <div class="row q-col-gutter-sm">
                <div class="col-3">
                    <q-select
                      label="Seleccione Entrada"
                      v-model="datos.entrada_id"
                      :options="listas.entradas"
                      @input="SelectedEntrada()"
                      option-value="id"
                      option-label="proveedor"
                    />
                </div>
                <div class="col-3">
                    <q-checkbox class="q-mt-md" v-model="storeItems.producto_empacado" @input="showForAnimalsMethod()" left-label label="Producto terminado" />
                </div>
                <div v-if="showForAnimals" class="col-3">
                    <q-checkbox class="q-mt-md" v-model="storeItems.marinado" left-label label="Es Marinado?" />
                </div>
                <div v-if="showForAnimals" class="col-3">
                    <q-checkbox class="q-mt-md" v-model="storeItems.genero" left-label label="Es Hembra?" />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-11 q-ma-sm">
                    <q-table
                      :data="listas.productos"
                      :columns="ColumnsProductos"
                      row-key="name"
                      color="secondary"
                    >
                      <!-- slot name syntax: body-cell-<column_name> -->
                      <q-td slot="body-cell-actionsProductos" slot-scope="props" :props="props">
                        <q-checkbox v-model="storeItems.productos" :val="props.value" />
                      </q-td>
                    </q-table>
                </div>
            </div>
            <div class="row q-col-gutter-sm">
                <div v-if="showForAnimals" class="col-6">
                    <q-input label="Fecha de peso en pie" v-model="storeItems.fecha_peso_pie" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                            <q-date v-model="storeItems.fecha_peso_pie" @input="() => $refs.qDateProxy2.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                <div class="col-6">
                    <q-input label="Fecha de Sacrificio" v-model="storeItems.fecha_sacrificio" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                            <q-date v-model="storeItems.fecha_sacrificio" @input="() => $refs.qDateProxy1.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div v-if="showForAnimals" class="col-6">
                <q-input color="primary" type="number" v-model="storeItems.num_animales" label="N° de animales"></q-input>
              </div>
              <div class="col-6">
                <q-select
                      label="Seleccione Tipo de animal"
                      v-model="storeItems.ProdGrupo_id"
                      :options="listas.grupos"
                      option-value="id"
                      option-label="nombre"
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div  class="col-4">
                <q-input color="primary" type="text" v-model="storeItems.marca" label="Marca"></q-input>
              </div>
              <div v-if="showForAnimals" class="col-4">
                <q-input color="primary" type="number" v-model="storeItems.precio_sacrificio_unit" label="Precio Sacrificio Unidad"></q-input>
              </div>
              <div v-if="showForAnimals" class="col-4">
                <q-input color="primary" type="number" v-model="storeItems.precio_transporte_unit" label="Precio Transporte Unidad"></q-input>
              </div>
            </div>
            <SelectTerceroSucursal v-model="storeItems.transportador_id" labelTercero='Transportador'/>
            <q-separator class="q-mt-md q-mb-md" color="orange"/>
            <div class="row">
              <h4>Programaciones</h4>
            </div>
            <div class="row">
              <q-btn color="primary" v-on:click="showAddProgramacion()" label="Agregar programacion" />
            </div>
            <div class="row">
              <div v-if="showTableProgram" class="col q-ma-sm">
                <q-table
                    :data="storeItems.programaciones"
                    :columns="ColumnsProgramaciones"
                    :separator="separator"
                    row-key="id"
                    color="secondary"
                    table-style="width:100%"
                >
                    <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn v-if="validarEstadoProgramacion(props.value)" class="q-ml-xs" icon="delete" v-on:click="eliminarFila(props.value)" color="negative"></q-btn>
                        <q-btn class="q-ml-xs" icon="edit" v-on:click="editProgramacion(props.value)" color="warning"></q-btn>
                    </q-td>
                </q-table>
              </div>
              <div v-if="!showTableProgram">
                <p>No hay programaciones creadas para este lote..</p>
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-3">
                  <q-btn v-if="!showForUpdate" color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
                  <q-btn v-if="showForUpdate" color="primary" v-on:click="globalValidate('guardar-edicion', storeItems.id, 1)" label="Guardar Edición" />
                </div>
            </div>
        </div>
        <div class="row q-mt-xl">
            <q-table
                title="Listado de Lotes"
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
import SelectTerceroSucursal from 'components/terceros/SelectTerceroSucursal.vue'

export default {
  name: 'PageLotes',
  components: {
    SelectTerceroSucursal
  },
  data: function () {
    return {
      showForUpdate: false,
      urlAPI: 'api/lotes/items',
      titulo: 'Lotes',
      showList: true,
      openedProgramacion: false,
      showForUpdateProgramacion: false,
      programaciones_counter: 0,
      storeItems: {
        fecha_sacrificio: null,
        fecha_peso_pie: null,
        marinado: false,
        genero: false,
        productos: [],
        marca: null,
        transportador_id: null,
        producto_empacado: false,
        precio_sacrificio_unit: null,
        precio_transporte_unit: null,
        num_animales: null,
        programaciones: [],
        ProdGrupo_id: null
      },
      datos: {
        entrada_id: null
      },
      temp: {
        num_animales: null,
        fecha_desposte: null,
        producto_canal: false
      },
      listas: {
        entradas: [],
        productos: [],
        grupos: []
      },
      tableData: [],
      columns: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'grupo', required: true, label: 'Grupo', align: 'left', field: 'grupo', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'marca', required: true, label: 'Marca', align: 'left', field: 'marca', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'num_animales', required: true, label: 'N° Animales', align: 'left', field: 'num_animales', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      ColumnsProductos: [
        { name: 'producto', required: true, label: 'Producto', align: 'left', field: 'producto', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'cantidad', required: true, label: 'Cantidad en kilogramos', align: 'left', field: 'cantidad', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actionsProductos', required: true, label: 'Agregar al Lote', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      ColumnsProgramaciones: [
        { name: 'fecha_desposte', required: true, label: 'Fecha Desposte', align: 'left', field: 'fecha_desposte', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'num_animales', required: true, label: 'N° de Animales', align: 'left', field: 'num_animales', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'producto_canal', required: true, label: 'Venta en Canal', align: 'left', field: 'producto_canal', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      visibleColumns: ['id', 'nombre', 'actions'],
      separator: 'horizontal',
      filter: ''
    }
  },
  mixins: [globalFunctions],
  methods: {
    preSave () {
      this.storeItems.ProdGrupo_id = this.storeItems.ProdGrupo_id.id
      this.storeItems.transportador_id = this.storeItems.transportador_id.id
    },
    postSave () {
      this.datos.tercero_id = null
      this.datos.entrada_id = null
      this.storeItems = {
        fecha_sacrificio: null,
        fecha_peso_pie: null,
        marinado: false,
        genero: false,
        productos: [],
        marca: null,
        transportador_id: null,
        producto_empacado: false,
        precio_sacrificio_unit: null,
        precio_transporte_unit: null,
        num_animales: null,
        programaciones: [],
        ProdGrupo_id: null
      }
    },
    postEdit () {
      this.datos.entrada_id = this.storeItems.entrada_mercancia
      this.SelectedEntrada()
      this.datos.tercero_id = this.storeItems.tercero
      this.globalSelectedTercero()
      this.storeItems.selProductos.forEach((elementProductos) => {
        this.storeItems.productos.push(elementProductos.prodent_id)
      })
    },
    async SelectedEntrada () {
      this.storeItems.productos = []
      try {
        let data = await axios.get(this.$store.state.jhsoft.url + 'api/entradas/entradafilter/' + this.datos.entrada_id.id)
        var tempData = data.data
        this.listas.productos = tempData
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Hubo un error al filtrar los Terceros!' })
      } finally {
      }
    },
    showForAnimalsMethod () {
      if (this.storeItems.producto_empacado) {
        this.storeItems.fecha_peso_pie = null
        this.storeItems.precio_sacrificio_unit = null
        this.storeItems.genero = null
        this.storeItems.marinado = null
        this.storeItems.num_animales = 0
      }
    },
    showAddProgramacion () {
      this.openedProgramacion = true
    },
    addProgramacion () {
      this.storeItems.programaciones.push({
        id: 'nuevo' + this.programaciones_counter,
        fecha_desposte: this.temp.fecha_desposte,
        num_animales: this.temp.num_animales,
        producto_canal: this.temp.producto_canal
      })
      this.programaciones_counter++
      this.temp.fecha_desposte = null
      this.temp.num_animales = null
      this.temp.producto_canal = false
    },
    eliminarFila (id) {
      var index = null
      this.$q.dialog({
        message: '¿ Quieres eliminar esta fila ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.storeItems.programaciones.forEach(function (element, i) {
          if (id === element.id) {
            index = i
          }
        })
        this.storeItems.programaciones.splice(index, 1)
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    validarEstadoProgramacion (id) {
      const item = this.storeItems.programaciones.find(item => item.id === id)
      if (item.id.toString().indexOf('nuevo') !== -1) {
        return true
      } else {
        return false
      }
    },
    editProgramacion (id) {
      const item = this.storeItems.programaciones.find(item => item.id === id)
      this.temp = item
      this.showForUpdateProgramacion = true
      this.openedProgramacion = true
    },
    saveEditProgramacion (id) {
      var index = null
      this.storeItems.programaciones.forEach(function (element, i) {
        if (id === element.id) {
          index = i
        }
      })
      this.storeItems.programaciones.splice(index, 1)
      this.storeItems.programaciones.push({
        id: this.temp.id,
        fecha_desposte: this.temp.fecha_desposte,
        num_animales: this.temp.num_animales,
        producto_canal: this.temp.producto_canal
      })
      this.temp.fecha_desposte = null
      this.temp.num_animales = null
      this.temp.producto_canal = false
      this.showForUpdateProgramacion = false
    }
  },
  created: function () {
    this.globalGetItems()
    this.globalGetForSelect('api/entradas/items').then(v => {
      this.listas.entradas = v
    })
    this.globalGetForSelect('api/productos/grupos/filter/animalfilter').then(v => {
      this.listas.grupos = v
    })
  },
  computed: {
    showTableProgram: function () {
      if (this.storeItems.programaciones.length > 0) {
        return true
      } else {
        return false
      }
    },
    showForAnimals: function () {
      var response = 1
      if (this.storeItems.producto_empacado) {
        response = 0
      }
      return response
    }
  }
}
</script>

<style>
    .q-table-container{
        width: 100%;
    }
</style>
