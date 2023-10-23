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
      v-model="currencie"
      :disabled="isDisabled"
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
import { computed, defineComponent, watch } from '@vue/composition-api'

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
    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const dayRate = computed(() => {
      const rate = store.getters.getRate({ date: currentOrder.value.date_ordered })
      if (isEmptyValue(rate.multiply_rate)) return 1
      const {
        multiply_rate,
        divide_rate
      } = rate
      if (multiply_rate.value > divide_rate.value) return multiply_rate.value
      return divide_rate.value
    })

    const isDisabled = computed(() => {
      const {
        reference_currency,
        refund_reference_currency
      } = store.getters.getPaymentMethods
      if (props.isRefund) return !isEmptyValue(refund_reference_currency)
      return !isEmptyValue(reference_currency)
    })
    const listCurrencies = computed(() => {
      return store.getters.getAvailableCurrencies.listCurrencies
    })

    const currencie = computed({
      get() {
        return store.getters.getAvailableCurrencies.currencie.id
      },
      // setter
      set(currencie) {
        let currency
        if (currencie) {
          currency = listCurrencies.value.find(list => list.id === currencie)
        }
        store.commit('setAvailableCurrencies', currency)
      }
    })

    function findConverRate(currency) {
      const { price_list } = currentOrder.value
      let amountConvert = Number(store.getters.getCurrentOrder.open_amount.value)
      if (
        isEmptyValue(currency) ||
        !isEmptyValue(price_list) &&
        currency.id === price_list.currency.id
      ) {
        store.commit('setPayAmount', amountConvert)
      } else {
        const rate = store.getters.getRate({ date: currentOrder.value.date_ordered })
        if (!isEmptyValue(rate)) {
          amountConvert = amountConvert / dayRate.value
          store.commit('setPayAmount', amountConvert)
        } else {
          store.dispatch('findRate', {
            currencyToId: currency.id
          })
            .then(response => {
              const {
                multiply_rate,
                divide_rate
              } = response
              if (
                !isEmptyValue(multiply_rate) &&
                !isEmptyValue(divide_rate)
              ) {
                const amountRate = (multiply_rate.value > divide_rate.value) ? multiply_rate.value : divide_rate.value
                amountConvert = amountConvert / amountRate.value
                store.commit('setPayAmount', amountConvert)
              }
            })
        }
      }
    }

    watch(currencie, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        const currency = listCurrencies.value.find(list => list.id === newValue)
        findConverRate(currency)
      }
    })

    return {
      dayRate,
      currencie,
      isDisabled,
      currentOrder,
      listCurrencies,
      findConverRate
    }
  }
})
</script>
