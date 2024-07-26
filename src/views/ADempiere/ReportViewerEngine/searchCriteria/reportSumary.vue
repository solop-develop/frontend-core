<template>
  <div style="margin-left: 0px; display: flex; align-items: center;">
    <label for="report-format-switch" class="select-label" style="margin-right: 15px;">{{ $t('report.reportEnginer.summary') }}</label>
    <el-switch
      id="report-format-switch"
      v-model="showChildren"
      style="font-weight: bold;"
      @change="expandedAll"
    />
    <label for="report-format-switch" class="select-label" style="margin-left: 15px;">{{ $t('report.reportEnginer.Detail') }}</label>
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const showChildren = ref(store.getters.getExpandedAll)

    function expandedAll() {
      store.commit('setExpandedAll', showChildren.value)
    }

    watch(
      () => store.getters.getExpandedAll,
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

<style scoped>

</style>
