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
            <router-link to="/pedidos" class="menuItem">Crear Pedido</router-link>
            <router-link v-if="$auth.user().role === 2" to="/pedidos/listapedidos" class="menuItem">Ver Pedidos</router-link>
          </div>
        </q-expansion-item>
        <q-expansion-item
          v-if="$auth.user().role === 2"
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
        <q-expansion-item
          v-if="$auth.user().role === 2"
          expand-separator
          icon="people"
          label="Usuarios"
          class="expansion-block"
          expand-icon-class="text-white"
        >
          <div class="expansion-items">
            <router-link to="/register" class="menuItem">Ver/Crear Usuarios</router-link>
          </div>
        </q-expansion-item>
        <div class="q-mt-md row">
          <div v-if="$auth.check()" class="text-center col-12">
              Usuario: {{ $auth.user().name }}
          </div>
        </div>
        <div class="row q-mt-sm">
          <div v-if="$auth.check()" class="text-center col-12">
            <a href="./" @click.prevent="$auth.logout(), $router.push({ name: 'login' })"><q-btn color="negative">Salir</q-btn></a>
          </div>
        </div>
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
