<template>
  <div>
    <CreateSingle urlAPI="api/tipoalmacen" titulo="Grupos"/>
  </div>
</template>

<script>

import CreateSingle from 'components/generales/CreateSingle.vue'

export default {
  name: 'PageCreateVencimiento',
  components: {
    CreateSingle
  }
}
</script>
