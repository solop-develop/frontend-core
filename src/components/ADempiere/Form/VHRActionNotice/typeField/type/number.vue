<template>
  <el-input-number
    v-model="value"
    controls-position="right"
    style="display: contents;"
    :precision="2"
    :step="0.1"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Number',

  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    }
  }
})
</script>
