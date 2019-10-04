<template>
  <div>
    <CreateSingle urlAPI="api/generales/unidades" titulo="Unidades"/>
  </div>
</template>

<script>

import CreateSingle from 'components/generales/CreateSingle.vue'

export default {
  name: 'PageCreateUnidades',
  components: {
    CreateSingle
  }
}
</script>
