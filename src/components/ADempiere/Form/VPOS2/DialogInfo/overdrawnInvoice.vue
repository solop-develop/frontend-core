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
  <span>
    <el-row :gutter="20">
      <el-col
        :span="8"
        style="text-align: center;"
      >
        <el-radio
          v-model="typeOptions"
          label="1"
        >
          {{ $t('form.pos.collect.overdrawnInvoice.returned') }} {{ formatPrice({ value: currentOrder.refund_amount.value, currency: currentOrder.price_list.currency.iso_code }) }}
        </el-radio>
      </el-col>
      <el-col
        :span="8"
        style="text-align: center;"
      >
        <el-radio
          v-model="typeOptions"
          label="2"
        >
          {{ $t('form.pos.collect.overdrawnInvoice.returnMoney') }}
        </el-radio>
      </el-col>
      <el-col
        :span="8"
        style="text-align: center;"
      >
        <el-radio
          v-model="typeOptions"
          label="3"
        >
          {{ $t('form.pos.collect.overdrawnInvoice.adjustDocument') }}
        </el-radio>
      </el-col>
    </el-row>
    <br>
    <el-card
      shadow="never"
      :body-style="{ padding: '5px' }"
    >
      <div slot="header" class="clearfix">
        <span>
          {{ currentPaymentMethods.name }}
        </span>
        <span style="float: right;text-align: end">
          <b>
            {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice({ value: currentPos.maximum_daily_refund_allowed.value, currency: currentPos.refund_reference_currency.iso_code }) }}
            {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice({ value: currentPos.maximum_refund_allowed.value, currency: currentPos.refund_reference_currency.iso_code }) }}
          </b>
        </span>
      </div>
      <charge-refund
        v-if="typeOptions !== '3'"
      />
    </el-card>
    <el-card
      v-if="!isEmptyValue(listPaymentsRefund)"
      shadow="never"
      :body-style="{ padding: '2px' }"
    >
      <el-row :gutter="10">
        <el-col
          v-for="(payment, key) in listPaymentsRefund"
          :key="key"
          :span="8"
          style="margin: 10px 0px;"
        >
          <card-payments
            :payment="payment"
          />
        </el-col>
      </el-row>
    </el-card>
  </span>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import store from '@/store'
// Component and Mixins
import ChargeRefund from '@/components/ADempiere/Form/VPOS2/Collection/Refund'
import CardPayments from '@/components/ADempiere/Form/VPOS2/Collection/Payments/CardPayments.vue'
// Utils and Helper Methods
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'overdrawnInvoice',
  components: {
    ChargeRefund,
    CardPayments
  },
  setup() {
    // const typeOptions = ref('1')
    const typeOptions = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'typeOptions'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'typeOptions',
          value: value
        })
      }
    })

    const currentPos = computed(() => {
      return store.getters.getVPOS
    })

    const currentPaymentMethods = computed(() => {
      return store.getters.getPaymentMethods
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const listPaymentsRefund = computed(() => {
      return store.getters.getListPayments.filter(list => list.is_refund)
    })

    return {
      typeOptions,
      currentPos,
      currentOrder,
      listPaymentsRefund,
      currentPaymentMethods,
      formatPrice
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
