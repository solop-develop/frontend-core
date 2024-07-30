<template>
  <el-form-item>
    <template slot="label">
      {{ $t('report.reportEnginer.optionsImport.contactsSend') }}
    </template>
    <el-select
      v-model="contantSend"
      filterable
      allow-create
      multiple
      style="width: 100%;"
      @change="setUser"
      @visible-change="searchUser"
    >
      <el-option
        v-for="(item, key) in listUserSend"
        :key="key"
        :label="item.label"
        :value="item"
      />
    </el-select>
  </el-form-item>
</template>
<script>
import store from '@/store'
import { defineComponent, computed, ref } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
export default defineComponent({
  name: 'contactSend',
  setup() {
    const contantSend = computed(() => {
      return store.getters.getContactSend
    })
    const listUserSend = ref([])
    function searchUser() {
      store.dispatch('ListUser')
        .then(response => {
          if (!isEmptyValue(response)) {
            const { records } = response
            listUserSend.value = records.map(item => {
              return {
                label: item.values.DisplayColumn,
                value: item.id
              }
            })
          }
        })
    }
    function setUser(data) {
      store.commit('setContactSend', data)
    }
    return {
      contantSend,
      listUserSend,
      setUser,
      searchUser
    }
  }
})
</script>
