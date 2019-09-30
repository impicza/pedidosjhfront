<template>
    <div>
        <q-page padding>
          <h3>Salida de mercancía <q-btn v-on:click="eliminarCache()" color="negative"> Eliminar caché</q-btn></h3>
          <q-dialog v-model="showCanastas" :content-css="{minWidth: '80vw', minHeight: '10vh'}">
            <q-layout view="Lhh lpR fff" container style="height: 400px; max-width: 800px" class="bg-white">
              <q-header class="bg-primary">
                <q-toolbar>
                  <q-btn flat v-close-popup round dense icon="close" />
                </q-toolbar>
              </q-header>

              <q-page-container>
                <q-page padding>
                  <h3>Canastas pesadas</h3>
                  <div class="overflow-hidden">
                    <div class="row q-col-gutter-sm">
                      <div v-if="datos.listaCanastas.canastas !== null">
                        <div v-if="datos.listaCanastas.canastas.length > 0">
                          {{ datos.listaCanastas.canastas[0].producto }}
                        </div>
                      </div>
                      <div v-for="canasta in datos.listaCanastas.canastas" v-bind:key='canasta.id' class="row col-12">
                        <div class="col-4">
                          {{ canasta.id }}
                        </div>
                        <div class="col-4">
                          {{canasta.peso}}
                        </div>
                        <div class="col-4">
                          <q-btn icon="remove_circle" v-on:click="eliminarCanasta(canasta.producto, canasta.id)" color="negative"></q-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-page>
              </q-page-container>
            </q-layout>
          </q-dialog>
          <div class="row q-col-gutter-sm">
              <SelectTerceroSucursal v-model="storeItems.terceroSucursal_id" columnas='col-8' labelTercero='Cliente'/>
              <div class="col-4">
                <q-input color="primary" type="number" v-model="storeItems.temperatura" label="Temperatura"></q-input>
              </div>
            </div>
            <div class="column col-6 q-mt-lg">
              <div class="col-6 self-center q-mb-lg">
                <q-input filled v-model="datos.barcode" v-on:keyup.enter="submitBarcode" label="Escanear..." />
              </div>
              <q-btn color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
            </div>
            <div class="column q-mt-lg">
              <div class="col-10 self-center">
                <q-table
                    title="Listado de productos"
                    :data="datos.items"
                    :columns="columns"
                    row-key="id"
                    :pagination.sync="pagination"
                    color="secondary"
                    table-style="width:100%"
                >
                  <q-td slot="body-cell-actions" slot-scope="props" :props="props">
                      <q-btn icon="remove_red_eye" v-on:click="verCanastas(props.value)" color="positive"></q-btn>
                  </q-td>
                </q-table>
              </div>
            </div>
        </q-page>
    </div>
</template>

<script>
const axios = require('axios')
import { globalFunctions } from 'boot/mixins.js'
import SelectTerceroSucursal from 'components/terceros/SelectTerceroSucursal.vue'

export default {
  name: 'PageSalMercancia',
  components: {
    SelectTerceroSucursal
  },
  data () {
    return {
      urlAPI: 'api/despachos/items',
      left: true,
      right: true,
      showCanastas: false,
      storeItems: {
        items: [],
        terceroSucursal_id: null,
        temperatura: null
      },
      datos: {
        items: [],
        listaCanastas: {
          canastas: null
        }
      },
      columns: [
        { name: 'producto', required: true, label: 'Producto', align: 'left', field: 'producto', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'peso', required: true, label: 'Peso', align: 'left', field: 'peso', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'cantidad', required: true, label: 'Cantidad', align: 'left', field: 'cantidad', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      pagination: {
        rowsPerPage: 10
      },
      columnsCanastas: [
        { name: 'producto', required: true, label: 'Producto', align: 'left', field: 'producto', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'peso', required: true, label: 'Peso', align: 'left', field: 'peso', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      show: {
        subgrupos: false,
        productos: false
      }
    }
  },
  mixins: [globalFunctions],
  methods: {
    preSave () {
    },
    postSave () {
      this.datos.tercero_id = null
    },
    async submitBarcode () {
      var verify = this.storeItems.items.indexOf(this.datos.barcode)
      if (verify < 0) {
        try {
          let data = await axios.get(this.$store.state.jhsoft.url + 'api/inventario/idfilter/' + this.datos.barcode)
          if (data.data === 'error') {
            this.$q.notify({ color: 'negative', message: 'Producto ya existente en otro despacho!' })
          } else {
            var tempData = data.data[0]
            // guardar en store items
            this.storeItems.items.push(tempData.id)
            // guardar para visualizacion
            var index = null
            this.datos.items.forEach(function (element, i) {
              if (tempData.producto === element.producto) {
                index = i
              }
            })
            var item
            tempData.peso = parseFloat(tempData.peso).toFixed(3)
            if (index !== null) {
              this.datos.items[index].peso = parseFloat(tempData.peso) + parseFloat(this.datos.items[index].peso)
              this.datos.items[index].peso = this.datos.items[index].peso.toFixed(3)
              this.datos.items[index].cantidad = this.datos.items[index].cantidad + 1
              item = { id: tempData.id, producto: tempData.producto, peso: tempData.peso }
              this.datos.items[index].canastas.push(item)
            } else {
              item = { id: tempData.id, producto: tempData.producto, peso: tempData.peso }
              tempData.canastas = [item]
              tempData.cantidad = 1
              this.datos.items.push(tempData)
            }
            this.datos.barcode = null
          }
        } catch (error) {
          this.$q.notify({ color: 'negative', message: 'Hubo un error al agregar el producto!' })
        } finally {
        }
      } else {
        this.$q.notify({ color: 'negative', message: 'Producto ya existente en este despacho!' })
      }
    },
    verCanastas (id) {
      this.datos.listaCanastas = this.datos.items.filter(v => v.id === id)
      this.datos.listaCanastas = this.datos.listaCanastas[0]
      this.showCanastas = true
    },
    eliminarCanasta (producto, id) {
      var indexI, indexJ, indexK, pesoRestar
      this.$q.dialog({
        message: '¿ Quieres eliminar esta fila ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.storeItems.items.forEach(function (element, i) {
          if (id === element.id) {
            indexI = i
          }
        })
        this.storeItems.items.splice(indexI, 1)
        //
        this.datos.items.forEach(function (element, j) {
          if (producto === element.producto) {
            indexJ = j
          }
        })
        //
        this.datos.items[indexJ].cantidad = this.datos.items[indexJ].cantidad - 1
        this.datos.items[indexJ].canastas.forEach(function (element, k) {
          if (id === element.id) {
            indexK = k
            pesoRestar = element.peso
          }
        })
        this.datos.items[indexJ].canastas.splice(indexK, 1)
        this.datos.items[indexJ].peso -= pesoRestar
        this.datos.items[indexJ].peso = this.datos.items[indexJ].peso.toFixed(3)
        if (this.datos.items[indexJ].peso < 0.0001) {
          this.datos.items.splice(indexJ, 1)
        }
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    },
    eliminarCache () {
      this.$q.dialog({
        message: '¿ Quieres eliminar la caché ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        localStorage.removeItem('despachoDatosItems')
        localStorage.removeItem('despachoStoreItemsItems')
        this.storeItems.items = []
        this.datos.items = []
      }).onCancel(() => {
        this.$q.notify('Cancelado...')
      }).onDismiss(() => {
      })
    }
  },
  created: function () {
    this.globalGetForSelect('api/productos/grupos').then(v => {
      this.grupos = v
    })
  },
  computed: {
  },
  watch: {
    datos: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler () {
        localStorage.despachoDatosItems = JSON.stringify(this.datos.items)
      }
    },
    storeItems: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler () {
        localStorage.despachoStoreItemsItems = JSON.stringify(this.storeItems.items)
      }
    }
  },
  mounted: function () {
    if (localStorage.despachoStoreItemsItems) {
      this.storeItems.items = JSON.parse(localStorage.despachoStoreItemsItems)
    }
    if (localStorage.despachoDatosItems) {
      this.datos.items = JSON.parse(localStorage.despachoDatosItems)
    }
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
