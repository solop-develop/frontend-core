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
  <el-card
    shadow="never"
    :body-style="{ padding: '5px' }"
  >
    <el-form
      :inline="true"
      label-position="top"
      class="form-base"
      @submit.native.prevent="notSubmitForm"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            :label="$t('pointOfSales.collection.field.fullPayment')"
            class="form-item-criteria"
            style="margin: 0px;width: 100%;"
          >
            <field-amount
              :value-amount="amount"
              :value-display="amountDisplay"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <payment-methods
            :handle-change="changePaymentMethods"
          />
        </el-col>
        <el-col :span="8">
          <currencie />
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item
            :label="$t('form.pos.tableProduct.quantity')"
            class="form-item-criteria"
            style="margin: 0px;width: 100%;"
          >
            <field-amount
              :value-amount="Number(editLine.quantity.value)"
              :value-display="editLine.quantity.value"
              :precision="editLine.uom.uom.starndard_precision"
              :handle-change="updateQuantity"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'
// import router from '@/router'
// Component and Mixins
import fieldAmount from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/fieldAmount.vue'
import paymentMethods from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/paymentMethods'
import currencie from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/currencies'
// import HeaderOrder from './HeaderOrder'
// import MainOrder from './MainOrder'
// import FooterOrder from './FooterOrder'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'Charge',
  components: {
    currencie,
    fieldAmount,
    paymentMethods
  },
  setup() {
    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const currentCurrency = computed(() => {
      return store.getters.getAvailableCurrencies.currencie
    })

    /**
     * Hangle Change Payment Methods
     * @param {Object} paymentMethods
     */
    function changePaymentMethods(paymentMethods) {
      if (isEmptyValue(paymentMethods)) return
      const currentPaymentMethod = store.getters.getListPaymentMethods.find(list => list.id === paymentMethods)
      const { reference_currency } = currentPaymentMethod
      store.commit('setAvailableCurrencies', reference_currency)
    }

    const amount = computed(() => {
      const {
        grand_total
      } = currentOrder.value
      if (isEmptyValue(grand_total)) return 0.00
      return Number(grand_total.value)
    })

    const amountDisplay = computed(() => {
      const {
        grand_total,
        price_list
      } = currentOrder.value
      let currencyPayment = price_list.currency
      if (isEmptyValue(grand_total)) return '0.00'
      if (!isEmptyValue(currentCurrency.value)) currencyPayment = currentCurrency.value
      return formatPrice({ value: Number(grand_total.value), currency: currencyPayment.iso_code })
    })

    return {
      currentOrder,
      amount,
      amountDisplay,
      formatPrice,
      changePaymentMethods
    }
  }
})
</script>

<style lang="scss" scoped></style>
