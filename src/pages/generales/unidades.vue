<template>
  <div>
    <CreateSingle urlAPI="api/tipoalmacen" titulo="Unidades"/>
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
