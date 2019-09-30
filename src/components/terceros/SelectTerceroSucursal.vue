<template>
    <div :class=columnas class="row q-col-gutter-sm">
        <div class="col-6">
          <q-select
            v-model="datos.tercero_id"
            use-input
            hide-selected
            fill-input
            option-label="nombre"
            :label="labelTercero"
            option-disable="inactive"
            map-options
            input-debounce="0"
            :options="options.terceros"
            @filter="filterTerceros"
            @input="selectedTercero()"
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
        <div class="col-6">
          <q-select
            v-model="datos.sucursal"
            use-input
            hide-selected
            fill-input
            option-label="nombre"
            label="Sucursal"
            option-disable="inactive"
            option-value="id"
            map-options
            emit-value
            input-debounce="0"
            :options="options.sucursales"
            @filter="filterSucursales"
            @input="$emit('input', datos.sucursal)"
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
    </div>
</template>

<script>
const axios = require('axios')
import { globalFunctions } from 'boot/mixins.js'

export default {
  props: ['columnas', 'labelTercero'],
  name: 'SelectTerceroSucursal',
  data: function () {
    return {
      terceros: [],
      sucursales: [],
      datos: {
        tercero_id: null,
        sucursal: null
      },
      options: {
        terceros: this.terceros,
        sucursales: this.sucursales
      }
    }
  },
  mixins: [globalFunctions],
  methods: {
    async selectedTercero () {
      this.datos.sucursal = null
      try {
        let data = await axios.get(this.$store.state.jhsoft.url + 'api/terceros/sucursales/tercerofilter/' + this.datos.tercero_id.id)
        this.sucursales = data.data
      } catch (error) {
        this.$q.notify({ color: 'negative', message: 'Hubo un error al filtrar los Terceros!' })
      } finally {
      }
    },
    filterTerceros (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options.terceros = this.terceros.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterSucursales (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options.sucursales = this.sucursales.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  created: function () {
    this.globalGetForSelect('api/terceros/items').then(v => {
      this.terceros = v
    })
  },
  computed: {
  }
}
</script>
