<template>
  <el-input
    v-model="value"
    style="display: contents;"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Text',

  props: {
    value: {
      type: String,
      default: '',
      required: true
    }
  }
})
</script>
