<template>
      <q-list>
        <q-expansion-item
          expand-separator
          icon="add_shopping_cart"
          label="Pedidos"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/pedidos" class="menuItem">Crear Productos</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="explore"
          label="Generales"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/generales/productos" class="menuItem">Crear Productos</router-link>
            <router-link to="/generales/grupos" class="menuItem">Crear Grupos</router-link>
            <router-link to="/generales/unidades" class="menuItem">Crear Unidades</router-link>
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
