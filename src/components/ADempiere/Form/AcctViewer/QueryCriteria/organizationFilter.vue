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
    :label="$t('form.accountingViewer.organization')"
  >
    <el-select
      v-model="organizationId"
      style="width: 100%;"
      filterable
      @visible-change="getAccoutingOrganizationsList"
    >
      <el-option
        v-for="item in accountingOrganizationsList"
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
  name: 'OrganizationFilter',

  setup() {
    const organizationId = computed({
      set(newValue) {
        store.commit('setAccountingOrganizationId', newValue)
      },
      get() {
        return store.getters.getCurrentStoredAccoutingOrganizationId
      }
    })

    const accountingOrganizationsList = computed(() => {
      return store.getters.getStoredAccoutingOrganizationsList
    })

    function getAccoutingOrganizationsList() {
      if (!isEmptyValue(accountingOrganizationsList.value)) {
        return
      }
      store.dispatch('getAccoutingOrganizationsFromServer', {
        searchValue: ''
      })
    }

    return {
      organizationId,
      accountingOrganizationsList,
      // Methods
      getAccoutingOrganizationsList
    }
  }
})
</script>
