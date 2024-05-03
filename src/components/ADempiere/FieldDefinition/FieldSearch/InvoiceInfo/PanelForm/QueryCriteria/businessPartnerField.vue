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
  <el-form-item label="Socio del negocio">
    <el-select
      v-model="businessPartnerField"
      clearable
      filterable
      size="mini"
      :filter-method="filterSearchBusinnes"
      style="margin: 0px; width: 100%"
      @visible-change="showList"
      @change="currentValue"
    >
      <el-option
        v-for="item in optionsListBussines"
        :key="item.id"
        :label="item.displayColumn"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>

import {
  defineComponent, ref
} from '@vue/composition-api'

// import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

//
import { requestListBusinessPartners } from '@/api/ADempiere/field/search/invoice.ts'
import store from '@/store'

export default defineComponent({
  name: 'BusinessPartnerField',

  setup() {
    const optionsListBussines = ref([])
    const businessPartnerField = ref('')

    function showList(isShow) {
      if (isShow && isEmptyValue(optionsListBussines.value)) { filterSearchBusinnes({}) }
    }

    function filterSearchBusinnes(
      searchQuery
    ) {
      requestListBusinessPartners({
        searchValue: searchQuery
      })
        .then(response => {
          const { records } = response
          optionsListBussines.value = records.map((list) => {
            return {
              ...list,
              displayColumn: list.values.DisplayColumn
            }
          })
        })
    }

    const currentValue = () => {
      store.dispatch('searchInvociesInfos', {
        business_partner_id: businessPartnerField.value
      })
    }

    return {
      optionsListBussines,
      businessPartnerField,
      //
      currentValue,
      //
      filterSearchBusinnes,
      showList
    }
  }
})
</script>
