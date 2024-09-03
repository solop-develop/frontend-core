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
    style="width: 100%;"
  >
    <template slot="label">
      {{ $t('form.VAllocation.searchCriteria.organization') }}
      <!-- <span style="color: #f34b4b"> * </span> -->
    </template>

    <el-select
      v-model="currentOrganizationValue"
      clearable
      style="width: 100%;"
      filterable
      :default-first-option="true"
      remote
      :remote-method="remoteSearchCurrencies"
      @visible-change="loadOrganizations"
    >
      <empty-option-select
        :current-value="currentOrganizationValue"
      />
      <el-option
        v-for="item in optionsList"
        :key="item.uuid"
        :label="item.label"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, onMounted } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// API Request Methods
import {
  requestListOrganizations
} from '@/api/ADempiere/form/VAllocation.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'OrganizationField',

  components: {
    EmptyOptionSelect
  },

  setup() {
    const organizationIdSession = computed(() => {
      return store.getters['user/getOrganization'].id
    })

    const currentOrganizationValue = computed({
      // getter
      get() {
        const { organizationId } = store.getters.getSearchFilter
        return organizationId
      },
      // setter
      set(newValue) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'organizationId',
          criteria: 'searchCriteria',
          value: newValue
        })
      }
    })

    const optionsList = computed({
      // getter
      get() {
        const { listOrganization } = store.getters.getSearchFilter
        if (!isEmptyValue(listOrganization)) {
          if (listOrganization.some(item => item.label === undefined)) {
            const listFormData = listOrganization.map(item => {
              return {
                id: item.id,
                label: item.values.DisplayColumn,
                uuid: item.values.UUID
              }
            })
            return listFormData
          }
        }
        return listOrganization
      },
      // setter
      set(newValue) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'listOrganization',
          criteria: 'searchCriteria',
          value: newValue
        })
      }
    })
    function loadOrganizations(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListOrganizations({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsList.value = records
        })
    }

    function remoteSearchCurrencies(searchValue) {
      // if (!isEmptyValue(searchValue) && searchValue.length > 1) {
      //   const result = optionsList.value.filter((textValue) => {
      //     const search = searchValue.toLowerCase()
      //     return textValue.label.toLowerCase().includes(search)
      //   })
      //   if (isEmptyValue(result)) {
      //     loadOrganizations(true, searchValue)
      //   }
      // }
      loadOrganizations(true, searchValue)
    }

    onMounted(() => {
      loadOrganizations(true, '')

      const currentValue = currentOrganizationValue.value
      if (isEmptyValue(currentValue) || currentValue <= 0) {
        currentOrganizationValue.value = organizationIdSession.value
      }
    })

    return {
      // Computeds
      organizationIdSession,
      currentOrganizationValue,
      optionsList,
      // Methods
      loadOrganizations,
      remoteSearchCurrencies
    }
  }
})
</script>
