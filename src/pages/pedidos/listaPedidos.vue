<template>
  <div>
    <q-page padding>
        <div class="row q-mt-xl">
            <q-table
                title = 'Pedidos JH'
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
                    <span v-if="props.value === 1">
                      <q-badge color="negative" multi-line>
                        Creado
                      </q-badge>
                    </span>
                    <span v-if="props.value === 0">
                      <q-badge color="positive" multi-line>
                        Recibido
                      </q-badge>
                    </span>
                </q-td>

                <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                    <a target="_blank" :href="$store.state.pedidosjh.url+'api/pedidos/imprimirpedido/'+ props.value + '?token='+ $auth.token()">
                        <q-btn class="q-ml-xs" @click="reload" icon="assignment" color="primary">
                        </q-btn>
                    </a>
                </q-td>
            </q-table>
        </div>
    </q-page>
  </div>
</template>

<script>
import { globalFunctions } from 'boot/mixins.js'

export default {
  name: 'CreateTipoAlmacen',
  data: function () {
    return {
      urlAPI: 'api/pedidos/items',
      storeItems: {
        nombre: null
      },
      showForUpdate: false,
      tableData: [],
      columnsPedidos: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'user', required: true, label: 'Cliente', align: 'left', field: 'cliente', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'created_at', required: true, label: 'Fecha de creación', align: 'left', field: 'fecha_creacion', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'estado', required: true, label: 'Estado', align: 'left', field: 'estado', sortable: true, classes: 'my-class', style: 'width: 200px' },
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
    },
    postEdit () {
    },
    reload () {
      this.globalGetForSelect('api/pedidos/listadocompleto', 'tableData')
    }
  },
  created: function () {
    this.globalGetForSelect('api/pedidos/listadocompleto', 'tableData')
  },
  computed: {
  }
}
</script>

<style>
    .q-table__container{
        width: 100%;
    }
</style>
