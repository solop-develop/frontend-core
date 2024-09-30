<template>
  <div style="margin-left: 50px; margin-top: -5px; display: flex; align-items: center;">
    <input v-model="showChildren" :disabled="isLoadingReport" type="checkbox" style="height: 15px; width: 15px; margin-left: 15px; margin-right: 10px;">
    <label class="select-label">{{ $t('report.reportEnginer.summary') }}</label>
  </div>
</template>
<script>
import store from '@/store'
import { defineComponent, watch, computed } from '@vue/composition-api'

export default defineComponent({
  props: {
    isLoadingReport: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    // const showChildren = ref()
    const showChildren = computed({
      get() {
        return store.getters.getIsSummary
      },
      set(value) {
        store.commit('setIsSummary', value)
      }
    })
    watch(
      () => store.getters.getIsSummary,
      (newValue) => {
        showChildren.value = newValue
      }
    )

    return {
      showChildren
    }
  }
})
</script>
