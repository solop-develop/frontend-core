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
  <!-- <el-card
    shadow="never"
    :body-style="{ padding: '5px' }"
  >
    <h2> {{ 'InfoCollection' }} </h2>
  </el-card> -->
  <el-row>
    <el-col
      :span="24"
      style="margin-top: 0px;"
      class="border-info"
    >
      <p class="line-info">
        <b
          style="float: left"
        >
          {{ $t('form.pos.collect.orderTotal') }} {{ '(' + currentOrder.document_no + ')' }}:
        </b>
        <b style="float: right">
          {{ displayAmount(currentOrder.grand_total.value) }}
        </b>
      </p>
      <p class="line-info">
        <b
          style="float: left"
        >
          {{ $t('form.pos.collect.convertedAmount') }}:
        </b>
        <b style="float: right">
          {{ formatPrice({ value: currentOrder.grand_total_converted.value, currency: displayCurrency.iso_code}) }}
        </b>
      </p>
    </el-col>
    <el-row :gutter="10">
      <el-col
        v-for="(payment, key) in listPayments"
        :key="key"
        :span="12"
        style="margin: 10px 0px;"
      >
        <card-payments
          :payment="payment"
          :readonly="true"
        />
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import store from '@/store'
// Utils and Helper Methods
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import CardPayments from '@/components/ADempiere/Form/VPOS2/Collection/Payments/CardPayments.vue'

export default defineComponent({
  name: 'InfoCollection',
  components: {
    CardPayments
  },
  setup() {
    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const listPayments = computed(() => {
      return store.getters.getListPayments
    })

    const displayCurrency = computed(() => {
      return store.getters.getVPOS.display_currency
    })

    const dayRate = computed(() => {
      const rate = store.getters.getRate({ date: currentOrder.value.date_ordered })
      if (isEmptyValue(rate.multiply_rate)) return displayAmount(0.00)
      const {
        multiply_rate,
        divide_rate,
        currency_to
      } = rate
      if (multiply_rate.value > divide_rate.value) return formatPrice({ value: multiply_rate.value, currency: currency_to.iso_code })
      return formatPrice({ value: divide_rate.value, currency: currency_to.iso_code })
    })

    function displayAmount(amount) {
      const { price_list } = currentOrder.value
      if (isEmptyValue(price_list)) return amount
      return formatPrice({ value: amount, currency: price_list.currency.iso_code })
    }

    return {
      dayRate,
      currentOrder,
      displayCurrency,
      formatPrice,
      listPayments,
      displayAmount
    }
  }
})
</script>

<style lang="scss" scoped>
.border-info {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
  padding: 0px 5px;
}
.line-info {
  width: 100%;
  display: flow-root;
  margin: 10px 0px;
}
</style>
