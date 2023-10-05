<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-form-item
    :label="$t('form.accountingViewer.accountingSchema')"
    required
  >
    <el-select
      v-model="accountingShemaId"
      style="width: 100%;"
      filterable
      @visible-change="getAccoutingShemasList"
    >
      <el-option
        v-for="item in accountingShemasList"
        :key="item.KeyColumn"
        :label="item.DisplayColumn"
        :value="item.KeyColumn"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'AccoutingSchemaFilter',

  setup() {
    const accountingShemaId = computed({
      set(newValue) {
        store.commit('setAccountSchemaId', newValue)
      },
      get() {
        return store.getters.getCurrentStoredAccoutingSchemaId
      }
    })

    const accountingShemasList = computed(() => {
      return store.getters.getStoredAccoutingShemasList
    })

    function getAccoutingShemasList() {
      if (!isEmptyValue(accountingShemasList.value)) {
        return
      }
      store.dispatch('getAccoutingSchemasFromServer', {
        searchValue: ''
      })
    }

    if (isEmptyValue(accountingShemasList.value)) {
      getAccoutingShemasList()
    }
    // set context value
    if (isEmptyValue(accountingShemaId.value)) {
      const globalAccoutingSchemaId = store.getters.getSessionContext({
        columnName: '$C_AcctSchema_ID'
      })
      accountingShemaId.value = globalAccoutingSchemaId
    }

    return {
      accountingShemaId,
      accountingShemasList,
      // Methods
      getAccoutingShemasList
    }
  }
})
</script>
