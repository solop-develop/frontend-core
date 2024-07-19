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
    :label="$t('form.VAllocation.footer.organization')"
    label-width="120px"
    style="margin: 0px;padding: 0px;"
    :required="true"
  >
    <el-select
      v-model="transactionOrganizationId"
      style="width: 100%;"
      filterable
      clearable
      :filter-method="remoteSearchOrganizations"
      required
      @visible-change="findOrganizations"
    >
      <empty-option-select
        :current-value="transactionOrganizationId"
        :is-allows-zero="true"
        :disabled="true"
      />

      <el-option
        v-for="item in optionsOrganizationsList"
        :key="item.id"
        :label="item.values.DisplayColumn"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed, onMounted } from '@vue/composition-api'

import store from '@/store'

// API Request Methods
import {
  requestListTransactionOrganizations
} from '@/api/ADempiere/form/VAllocation.ts'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'OrganizationTransatcionField',

  components: {
    EmptyOptionSelect
  },

  setup() {
    const organizationId = computed(() => {
      const { organizationId } = store.getters.getSearchFilter
      return organizationId
    })

    const transactionOrganizationId = computed({
      // getter
      get() {
        const { transactionOrganizationId } = store.getters.getProcess
        return transactionOrganizationId
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'transactionOrganizationId',
          value
        })
      }
    })

    const optionsOrganizationsList = computed({
      // getter
      get() {
        const { transactionOrganizationsList } = store.getters.getSearchFilter
        return transactionOrganizationsList
      },
      // setter
      set(list) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'transactionOrganizationsList',
          criteria: 'searchCriteria',
          value: list
        })
      }
    })

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
      }
    }

    function remoteSearchOrganizations(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsOrganizationsList.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findOrganizations(true, query)
        }
      }
    }

    function findOrganizations(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListTransactionOrganizations({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsOrganizationsList.value = records
        })
    }

    onMounted(() => {
      if (!isEmptyValue(organizationId.value) && organizationId.value > 0 &&
        (isEmptyValue(transactionOrganizationId.value) || transactionOrganizationId.value <= 0)) {
        transactionOrganizationId.value = organizationId.value
      }
      if (isEmptyValue(optionsOrganizationsList.value) && !isEmptyValue(transactionOrganizationId.value) && transactionOrganizationId.value > 0) {
        findOrganizations(true, '')
      }
    })

    return {
      transactionOrganizationId,
      optionsOrganizationsList,
      findOrganizations,
      remoteSearchOrganizations
    }
  }
})
</script>
