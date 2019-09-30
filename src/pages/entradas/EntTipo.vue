<template>
  <div>
    <q-page padding>

        <h3>Tipos de entrada de mercancia</h3>
        <div class="overflow-hidden">
            <div class="row gutter-x-sm gutter-y-l">
                <div class="col-3">
                    <q-input v-model="storeItems.nombre" label="Nombre"/>
                </div>
                <div class="col-3">
                    <q-checkbox class="q-mt-md" v-model="storeItems.inventario" left-label label="Afecta inventario?" />
                </div>
                <div class="col-3">
                    <q-checkbox class="q-mt-md" v-model="storeItems.inventario_directo" left-label label="Inventario Directo?" />
                </div>
            </div>
            <div class="row gutter-x-sm gutter-y-l q-mt-sm">
                <div class="col-3">
                    <q-btn color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
                </div>
            </div>
        </div>
        <div class="row q-mt-xl">
            <q-table
                title="Listado de tipos de entrada"
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

export default {
  name: 'pageEntTipo',
  data: function () {
    return {
      urlAPI: 'api/entradas/tipos',
      storeItems: {
        nombre: null,
        inventario: false,
        inventario_directo: false
      },
      tableData: [],
      columns: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      visibleColumns: ['id', 'nombre', 'actions'],
      separator: 'horizontal',
      filter: ''
    }
  },
  mixins: [globalFunctions],
  methods: {
    postSave () {
    },
    preSave () {
    }
  },
  created: function () {
    this.globalGetItems()
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
