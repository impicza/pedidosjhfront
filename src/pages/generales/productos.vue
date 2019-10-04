<template>
    <div>
        <q-page padding>
            <h3>Crear Productos</h3>
            <div class="row q-col-gutter-md">
              <div class="col-3">
                <q-select
                    class="w-100"
                    v-model="storeItems.grupo_id"
                    use-input
                    hide-selected
                    fill-input
                    option-value="id"
                    option-label="nombre"
                    label="Grupo"
                    option-disable="inactive"
                    emit-value
                    map-options
                    input-debounce="0"
                    :options="options.grupos"
                    @filter="filterGrupos"
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
              <div class="col-3">
                <q-input type="text" v-model="storeItems.nombre" label="Nombre de producto"/>
              </div>
              <div class="col-2">
                <q-btn color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-6">
                <q-table
                    title="Productos"
                    :data="tableData"
                    :columns="columnsProductos"
                    :separator="separator"
                    row-key="id"
                    color="secondary"
                    table-style="width:100%"
                >
                    <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                        <q-btn icon="delete" v-on:click="eliminarFila('canal', props.value)" color="negative"></q-btn>
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
      urlAPI: 'api/generales/productos',
      tableData: [],
      storeItems: {
        nombre: null,
        grupo_id: null
      },
      options: {
        grupos: this.grupos
      },
      grupos: [],
      columnsProductos: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'grupo', required: true, label: 'Grupo', align: 'left', field: 'grupo', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      separator: 'horizontal'
    }
  },
  mixins: [globalFunctions],
  methods: {
    preSave () {
    },
    postSave () {
    },
    filterGrupos (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options.grupos = this.grupos.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  created: function () {
    this.globalGetItems()
    this.globalGetForSelect('api/generales/grupos').then(v => {
      this.grupos = v
    })
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
