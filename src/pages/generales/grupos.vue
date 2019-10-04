<template>
  <div>
    <CreateSingle urlAPI="api/generales/grupos" titulo="Grupos"/>
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
