<template>
  <div style="margin-left: 0px; display: flex; align-items: center;">
    <label for="report-format-switch" class="select-label" style="margin-right: 15px;">{{ $t('report.reportEnginer.detail') }}</label>
    <el-switch
      id="report-format-switch"
      v-model="showChildren"
      style="font-weight: bold;"
      :disabled="isLoadingReport"
      @change="expandedAll"
    />
    <label for="report-format-switch" class="select-label" style="margin-left: 15px;">{{ $t('report.reportEnginer.summary') }}</label>
  </div>
</template>
<script>
import store from '@/store'
import { defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    isLoadingReport: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const showChildren = ref(store.getters.getIsSummary)

    function expandedAll() {
      store.commit('setIsSummary', showChildren.value)
    }
    watch(
      () => store.getters.getIsSummary,
      (newValue) => {
        showChildren.value = newValue
      }
    )

    return {
      showChildren,
      expandedAll
    }
  }
})
</script>
