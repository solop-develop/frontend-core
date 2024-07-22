<template>
  <div class="select-container" style="margin-top: 10px; margin-left: 25px; display: flex; align-items: center;">
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
.select-label {
  margin-bottom: 5px;
  font-weight: bold;
}
@media screen and (min-width: 1050px) {
  .select-container{
    margin-left: -30px;
    margin-top: 2px;
    font-size: 12px
  }
}
</style>
