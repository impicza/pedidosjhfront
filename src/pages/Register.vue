<template>
    <div>
        <q-page padding>
            <h3>Usuarios</h3>
              <div class="alert alert-danger" v-if="has_error && !success">
                  <p v-if="error == 'registration_validation_error'">Erreur(s) de validation, veuillez consulter le(s) message(s) ci-dessous.</p>
                  <p v-else>Erreur, impossible de s'inscrire pour le moment. Si le problème persiste, veuillez contacter un administrateur.</p>
              </div>
            <div class="row q-col-gutter-md">
                  <form  class="col-md-6 col-12" autocomplete="off" @submit.prevent="register" v-if="!success" method="post">
                    <div class="form-group col-6" v-bind:class="{ 'has-error': has_error && errors.name }">
                        <q-input type="text" required v-model="name" label="Nombre"/>
                        <span class="help-block" v-if="has_error && errors.name">{{ errors.name }}</span>
                    </div>
                    <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.password }">
                        <q-input type="password" required v-model="password" label="Contraseña"/>
                        <span class="help-block" v-if="has_error && errors.password">{{ errors.password }}</span>
                    </div>
                    <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.password }">
                        <q-input type="password" required v-model="password_confirmation" label="Confirmar Contraseña"/>
                    </div>
                    <div class="form-group">
                        <q-select
                            filled
                            v-model="dias_despacho"
                            :options="optionsDias"
                            label="Días de despacho"
                            multiple
                            emit-value
                            map-options
                        >
                          <template v-slot:option="scope">
                            <q-item
                              v-bind="scope.itemProps"
                              v-on="scope.itemEvents"
                            >
                              <q-item-section>
                                <q-item-label v-html="scope.opt.label" ></q-item-label>
                              </q-item-section>
                              <q-item-section side>
                                <q-toggle v-model="dias_despacho" :val="scope.opt.value" />
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                    </div>
                    <div class="q-mt-sm">
                      <q-btn type="submit" color="primary" label="inscribir" />
                    </div>
                </form>
            </div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-md-12 col-12">
                <q-table
                    title="Productos"
                    :data="tableData"
                    :columns="columnsProductos"
                    :separator="separator"
                    :filter="filter"
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
                    <q-btn v-if="goblalValidarEstado(parseInt(props.value)) == 0" class="q-ml-xs" icon="add_circle" v-on:click="editEstateItem('activar', props.value)" color="primary"></q-btn>
                    <q-btn v-if="goblalValidarEstado(parseInt(props.value)) == 1" class="q-ml-xs" icon="remove_circle" v-on:click="editEstateItem('inactivar', props.value)" color="negative"></q-btn>
                    <q-btn class="q-ml-xs" icon="cached" v-on:click="reinitPassword(props.value)" color="warning"></q-btn>
                  </q-td>
                </q-table>
              </div>
            </div>
        </q-page>
    </div>
</template>

<script>
import { globalFunctions } from 'boot/mixins.js'
const axios = require('axios')

export default {
  name: 'PageSalMercancia',
  data () {
    return {
      urlAPI: 'api/users',
      tableData: [],
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      dias_despacho: [],
      has_error: false,
      error: '',
      errors: {},
      success: false,
      options: {
        grupos: this.grupos
      },
      grupos: [],
      columnsProductos: [
        { name: 'id', required: true, label: 'id', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'name', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'dias_despacho', required: true, label: 'Dias despacho', align: 'left', field: 'dias_despacho', sortable: true, classes: 'my-class', style: 'width: 200px' },
        { name: 'actions', required: true, label: 'Acciones', align: 'left', field: 'id', sortable: true, classes: 'my-class', style: 'width: 200px' }
      ],
      separator: 'horizontal',
      filter: '',
      optionsDias: [
        {
          label: 'Lunes',
          value: 1
        },
        {
          label: 'Martes',
          value: 2
        },
        {
          label: 'Miércoles',
          value: 3
        },
        {
          label: 'Jueves',
          value: 4
        },
        {
          label: 'Viernes',
          value: 5
        },
        {
          label: 'Sabado',
          value: 6
        }
      ]
    }
  },
  mixins: [globalFunctions],
  methods: {
    register () {
      var app = this
      this.$auth.register({
        data: {
          name: app.name,
          email: app.name + '@pedidosjh.com',
          password: app.password,
          password_confirmation: app.password_confirmation,
          dias_despacho: app.dias_despacho
        },
        success: function () {
          app.success = true
          this.$router.push({ name: 'home' })
        },
        error: function (res) {
          console.log(res.response.data.errors)
          app.has_error = true
          app.error = res.response.data.error
          app.errors = res.response.data.errors || {}
        }
      })
    },
    editEstateItem (text, id) {
      var app = this
      app.$q.loading.show()
      axios.get(this.$store.state.pedidosjh.url + this.urlAPI + '/estado/' + id + '/' + text).then(
        function (response) {
          if (response.data === true) {
            app.$q.notify({ color: 'primary', message: 'item modificado!' })
            axios.get(app.$store.state.pedidosjh.url + 'api/users').then(
              function (response) {
                app.tableData = response.data.users
              }
            ).catch(function (error) {
              console.log(error)
            }).finally(function () {
              app.$q.loading.hide()
            })
          } else {
            this.$q.notify({ color: 'negative', message: 'Hubo un error no se pudo ' + text })
          }
        }
      ).catch(function (error) {
        console.log(error)
        app.$q.notify({ color: 'negative', message: 'Hubo un error inesperado.' })
      }).finally(function () {
      })
    },
    reinitPassword (id) {
      var app = this
      app.$q.loading.show()
      axios.get(this.$store.state.pedidosjh.url + this.urlAPI + '/reinitpassword/' + id).then(
        function (response) {
          if (response.data === true) {
            app.$q.notify({ color: 'primary', message: 'Contraseña reiniciada!' })
          } else {
            this.$q.notify({ color: 'negative', message: 'Hubo un error no se pudo reiniciar la contraseña.' })
          }
        }
      ).catch(function (error) {
        console.log(error)
        app.$q.notify({ color: 'negative', message: 'Hubo un error inesperado.' })
      }).finally(function () {
        app.$q.loading.hide()
      })
    }
  },
  created: function () {
    var app = this
    app.$q.loading.show()
    axios.get(this.$store.state.pedidosjh.url + 'api/users').then(
      function (response) {
        app.tableData = response.data.users
      }
    ).catch(function (error) {
      console.log(error)
    }).finally(function () {
      app.$q.loading.hide()
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
