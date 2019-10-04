<template>
    <div>
        <q-page padding>
            <h3>Crear Pedido</h3>
            <div class="row q-col-gutter-md">
              <div class="col-3">
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
              <div class="col-2">
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
                    emit-value
                    map-options
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
              <div class="col-2">
                <q-input type="number" v-model="temp.cantidad" label="Cantidad"/>
              </div>
              <div class="col-2">
                <q-btn color="positive" v-on:click="addProducto()" label="Agregar" />
              </div>
              <div class="col-2">
                <q-btn color="primary" v-on:click="globalValidate('guardar')" label="Guardar" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-6">
                <q-table
                    title="Productos Cerdo"
                    :data="datos.productosCerdo"
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
              <div class="col-6">
                <q-table
                    title="Productos Res"
                    :data="datos.productosRes"
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
      urlAPI: 'api/despachos/crearporlote',
      productos: [],
      unidades: [],
      storeItems: {
        productos: []
      },
      datos: {
        productosCerdo: [],
        productosRes: []
      },
      temp: {
        producto: null,
        unidades: null,
        cantidad: null
      },
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
      separator: 'horizontal'
    }
  },
  mixins: [globalFunctions],
  methods: {
    preSave () {
      this.datos.productosCerdo.forEach((item) => {
        this.storeItems.productos.push(item)
      })
      this.datos.productosRes.forEach((item) => {
        this.storeItems.productos.push(item)
      })
    },
    postSave () {
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
    addProducto () {
      if (this.temp.producto.grupo === 'Cerdo') {
        this.datos.productosCerdo.push({
          id: 'nuevo' + parseInt(this.datos.productosCerdo.length),
          producto_id: this.temp.producto.id,
          producto_nombre: this.temp.producto.nombre,
          cantidad: this.temp.cantidad,
          unidad_id: this.temp.unidades.id,
          unidad_nombre: this.temp.unidades.nombre
        })
      }
      if (this.temp.producto.grupo === 'Res') {
        this.datos.productosRes.push({
          id: 'nuevo' + parseInt(this.datos.productosRes.length),
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
    }
  },
  created: function () {
    this.globalGetForSelect('api/generales/unidades').then(v => {
      this.unidades = v
    })
    this.globalGetForSelect('api/generales/productos').then(v => {
      this.productos = v
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
