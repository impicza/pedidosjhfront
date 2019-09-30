<template>
      <q-list>
        <q-expansion-item
          expand-separator
          icon="explore"
          label="Productos"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/productos" class="menuItem">Crear Productos</router-link>
            <router-link to="/productos/grupos" class="menuItem">Crear Grupos</router-link>
            <router-link to="/productos/subgrupos" class="menuItem">Crear Subgrupos</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="add_shopping_cart"
          label="Entrada de mercancía"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/entradas" class="menuItem">Crear Entrada</router-link>
            <router-link to="/entradas/tipos" class="menuItem">Crear tipo de entrada</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="assignment_turned_in"
          label="Lotes"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/lotes" class="menuItem">Crear Lote</router-link>
            <router-link to="/lotes/peso-planta" class="menuItem">Peso Planta</router-link>
            <router-link to="/lotes/empaque" class="menuItem">Empaque</router-link>
            <router-link to="/lotes/etiqueta-interna" class="menuItem">Etiqueta Interna</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="attach_money"
          label="Despachos"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/despachos" class="menuItem">Salida de Mercancia</router-link>
            <router-link to="/despachos/listado" class="menuItem">Ver despachos</router-link>
            <router-link to="/despachos/crearporlote" class="menuItem">Crear despacho por lote completo</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="notes"
          label="General"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/generales/generalidades" class="menuItem">Generalidades</router-link>
            <router-link to="/productos/almacenamiento" class="menuItem">Crear Tipo de Almacenamiento</router-link>
            <router-link to="/generales/tipoimpuestos" class="menuItem">Crear Tipo de Impuesto</router-link>
            <router-link to="/generales/impuestos" class="menuItem">Crear Impuesto</router-link>
            <router-link to="/generales/unidades" class="menuItem">Crear Unidad</router-link>
            <router-link to="/productos/listadodeprecios" class="menuItem">Lista de precios</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="expansion-block"
          expand-separator
          icon="perm_identity"
          label="Terceros"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/terceros" class="menuItem">Crear Terceros</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="expansion-block"
          expand-separator
          icon="dashboard"
          label="Inventarios"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/inventario" class="menuItem">Listado de inventario</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="expansion-block"
          expand-separator
          icon="library_books"
          label="Informes"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/informes/peso-planta" class="menuItem">Informe Peso planta</router-link>
          </div>
        </q-expansion-item>
        <li v-if="$auth.check()">
            <a href="#" @click.prevent="$auth.logout()">Logout</a>
        </li>
        <li v-if="$auth.check()">
            {{ $auth.user().name }}
        </li>
      </q-list>
</template>

<style>
    .menuItem{
        display: block;
    }
    .expansion-block{
      background-color:#027be3;
      color: #ffffff;
    }
    .expansion-items{
      background-color: #ffffff;
    }
</style>
