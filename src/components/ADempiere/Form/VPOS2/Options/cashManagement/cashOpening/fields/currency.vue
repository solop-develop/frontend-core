<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
    :label="$t('pointOfSales.collection.field.currency')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="currency"
      :disabled="isDisabled"
      style="width: 100%;"
    >
      <el-option
        v-for="item in listCurrencies"
        :key="item.id"
        :label="item.iso_code + '(' + item.cur_symbol + ')'"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'FieldCurrencies',
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const listCurrencies = computed(() => {
      return store.getters.getAvailableCurrencies.listCurrencies
    })

    const currency = computed({
      get() {
        const currency = store.getters.getAttributeCashOpenFields({
          attribute: 'currency'
        })
        if (currency) return currency.id
        return ''
      },
      // setter
      set(value) {
        let currency
        if (value) {
          currency = listCurrencies.value.find(list => list.id === value)
        }
        store.commit('setAttributeCashOpenFields', {
          attribute: 'currency',
          value: currency
        })
      }
    })

    const isDisabled = computed(() => {
      const {
        reference_currency,
        refund_reference_currency
      } = store.getters.getAttributeCashOpenFields({
        attribute: 'paymentMethods'
      })
      if (props.isRefund) return !isEmptyValue(refund_reference_currency)
      return !isEmptyValue(reference_currency)
    })

    return {
      currency,
      isDisabled,
      listCurrencies
    }
  }
})
</script>
