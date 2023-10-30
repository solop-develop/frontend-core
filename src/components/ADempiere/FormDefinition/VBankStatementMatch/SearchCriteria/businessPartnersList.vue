<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.www.erpya.com
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
    :label="$t('form.VBankStatementMatch.field.businessPartner')"
    class="form-item-criteria"
    style="width: 100%;"
  >
    <el-select
      v-model="businessPartnerValue"
      filterable
      clearable
      style="width: 100%;"
      remote
      :remote-method="remoteSearch"
      @visible-change="getBusinessPartnerList"
      @clear="clearValues"
    >
      <el-option
        v-for="item in businessPartnersList"
        :key="item.id"
        :label="item.displayedValue"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'BusinessPartner',

  setup() {
    const timeOut = ref(null)

    const businessPartnerValue = computed({
      set(newValue) {
        store.commit('setBusinessPartnerId', newValue)
      },
      get() {
        return store.getters.getBusinessPartnerValueStatementMatch
      }
    })

    const businessPartnersList = computed(() => {
      return store.getters.getBusinessPartnersListStatementMatch
    })

    function getBusinessPartnerList(isExpand) {
      if (!isExpand || !isEmptyValue(businessPartnersList.value)) {
        return
      }
      store.dispatch('listBusinessPartner', {})
    }

    function localSearch(searchQuery = '') {
      if (isEmptyValue(searchQuery)) {
        return businessPartnersList.value
      }
      return businessPartnersList.value.filter(option => {
        return option.displayedValue.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    function remoteSearch(searchQuery = '') {
      const results = localSearch(searchQuery)
      if (isEmptyValue(searchQuery) ||
        (!isEmptyValue(searchQuery) && (isEmptyValue(results) || results.length < 3))) {
        clearTimeout(timeOut.value)
        timeOut.value = setTimeout(() => {
          store.dispatch('listBusinessPartner', {
            searchValue: searchQuery
          })
        }, 500)
        return
      }
    }

    function clearValues() {
      businessPartnerValue.value = undefined
      store.commit('setBusinessPartnersList', [])
    }

    return {
      businessPartnerValue,
      businessPartnersList,
      //
      getBusinessPartnerList,
      remoteSearch,
      clearValues
    }
  }
})
</script>
