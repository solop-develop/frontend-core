<template>
  <div class="select-container" style="margin-top: 0px; margin-left: 200px">
    <label for="report-format-switch" class="select-label">{{ $t('report.summary') }}</label>
    <el-switch
      id="report-format-switch"
      v-model="showChildren"
      style="font-weight: bold;"
      @change="changeAllChildren"
    />
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const showChildren = ref(false)

    function changeAllChildren() {
      store.commit('setAllChildren', showChildren.value)
    }

    return {
      showChildren,
      changeAllChildren
    }
  }
})
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
}

.select-label {
  margin-bottom: 5px;
  font-weight: bold;
}
</style>
