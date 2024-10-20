<template>
  <div>
    <label>{{ $t('report.reportEnginer.optionsImport.typeNotify') }}</label>
    <el-select
      v-model="notify"
      filterable
      allow-create
      style="width: 100%;"
      @visible-change="searchNotify"
      @change="setNotify"
    >
      <el-option
        v-for="(item, key) in listNotify"
        :key="key"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script>
import store from '@/store'
import { defineComponent, ref, watch, computed } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
export default defineComponent({
  name: 'typeNotify',
  setup() {
    const notify = ref(store.getters.getTypeNotify)
    const listNotify = ref([])
    const typeNotifySend = computed(() => {
      return store.getters.getTypeNotify
    })
    watch(typeNotifySend, (newValue) => {
      notify.value = newValue
    })
    function searchNotify() {
      store.dispatch('ListNotifications')
        .then(response => {
          if (!isEmptyValue(response)) {
            const { records } = response
            listNotify.value = records.map(item => {
              return {
                label: item.name,
                value: item.value
              }
            })
          }
        })
    }
    function setNotify(data) {
      store.commit('setTypeNotify', data)
    }
    return {
      notify,
      listNotify,
      typeNotifySend,
      setNotify,
      searchNotify
    }
  }
})
</script>

