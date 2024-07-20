<template>
  <div class="select-container">
    <label for="report-format-select" class="select-label">{{ $t('route.reportViewer') }}</label>
    <el-select
      id="report-format-select"
      :placeholder="$t('route.reportViewer')"
      @visible-change="showList"
    >
      <el-option
        v-for="(item, key) in reportView.childs"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, ref } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'reportView',
  props: {
    containerUuid: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const reportView = ref([])

    function reportAsView() {
      reportView.value = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      })
    }

    function showList(isShow) {
      if (isShow && isEmptyValue(reportView.value)) reportAsView()
    }

    return {
      reportView,
      reportAsView,
      showList
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
