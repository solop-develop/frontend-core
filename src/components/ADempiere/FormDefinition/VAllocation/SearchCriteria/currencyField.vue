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
    :required="true"
  >
    <template slot="label">
      {{ $t('form.VAllocation.searchCriteria.currency') }}
      <!-- <span style="color: #f34b4b"> * </span> -->
    </template>

    <el-select
      v-model="currentCurrencyValue"
      clearable
      style="width: 100%;"
      filterable
      :default-first-option="true"
      remote
      :remote-method="remoteSearchCurrencies"
      @visible-change="findCurrencies"
    >
      <empty-option-select
        :current-value="currentCurrencyValue"
      />
      <el-option
        v-for="item in optionsCurrency"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// API Request Methods
import {
  requestListCurrencies
} from '@/api/ADempiere/form/VAllocation.ts'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'CurrencyField',

  components: {
    EmptyOptionSelect
  },

  setup() {
    const currentCurrencyValue = computed({
      // getter
      get() {
        const { currencyId } = store.getters.getSearchFilter
        return currencyId
      },
      // setter
      set(id) {
        // store.commit('setCurrency', id)
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'currencyId',
          criteria: 'searchCriteria',
          value: id
        })
      }
    })

    const optionsCurrency = computed({
      // getter
      get() {
        const { listCurrency } = store.getters.getSearchFilter
        return listCurrency
      },
      // setter
      set(list) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'listCurrency',
          criteria: 'searchCriteria',
          value: list
        })
        // store.commit('setBusinessPartner', id)
      }
    })

    function findCurrencies(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListCurrencies({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsCurrency.value = records.map(currency => {
            const { id, uuid, values } = currency
            return {
              id,
              uuid,
              label: values.DisplayColumn
            }
          })
        })
    }

    function remoteSearchCurrencies(searchValue) {
      // if (!isEmptyValue(searchValue) && searchValue.length > 1) {
      //   const result = optionsCurrency.value.filter((textValue) => {
      //     const search = searchValue.toLowerCase()
      //     return textValue.label.toLowerCase().includes(search)
      //   })
      //   if (isEmptyValue(result)) {
      //     findCurrencies(true, searchValue)
      //   }
      // }
      findCurrencies(true, searchValue)
    }

    return {
      // Computeds
      currentCurrencyValue,
      optionsCurrency,
      // Methods
      findCurrencies,
      remoteSearchCurrencies
    }
  }
})
</script>
