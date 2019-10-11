<template>
  <q-page class="flex flex-center">
    <img id="logo-ppal" alt="Quasar logo" src="~assets/logo-supercarnes.png">
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
<style scoped>
  #logo-ppal{
    max-width: 600px;
  }

  @media screen and (max-width: 600px) {
    #logo-ppal{
    max-width: 300px;
  }
  }
</style>
