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
              :handle-change="updateAmount"
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
        <!-- Payment Methods (Fields Display Logic) -->
        <el-col v-if="isDisplayFieldPayment('creditMemo')" :span="8">
          <credit-memo />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('recipientBank')" :span="8">
          <recipient-bank />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('banksAccounts')" :span="8">
          <banks-accounts />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('issuingBank')" :span="8">
          <issuing-bank />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Bank')" :span="8">
          <bank />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Value')" :span="8">
          <el-form-item
            :label="$t('pointOfSales.collection.field.code')"
            class="form-item-criteria"
            style="margin: 0px;width: 100%;"
          >
            <el-input
              v-model="code"
              :disabled="!isEmptyValue(currentAccount)"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Description')" :span="8">
          <el-form-item
            :label="$t('pointOfSales.collection.field.description')"
            class="form-item-criteria"
            style="margin: 0px;width: 100%;"
          >
            <el-input
              v-model="description"
              type="textarea"
              :rows="2"
              :disabled="!isEmptyValue(currentAccount) || !isEmptyValue(customerCredits)"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Date')" :span="8">
          <el-form-item
            :label="$t('pointOfSales.collection.field.date')"
            class="form-item-criteria"
            :disabled="!isEmptyValue(customerCredits)"
            style="margin: 0px;width: 100%;"
          >
            <el-date-picker
              v-model="date"
              type="date"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Phone')" :span="8">
          <el-form-item
            :label="$t('pointOfSales.collection.field.phone')"
            class="form-item-criteria"
            style="margin: 0px;width: 100%;"
          >
            <el-input
              v-model="phone"
              :disabled="!isEmptyValue(currentAccount)"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isDisplayFieldPayment('ReferenceNo')" :span="8">
          <el-form-item
            :label="$t('pointOfSales.collection.field.referenceNo')"
            class="form-item-criteria"
            style="margin: 0px;width: 100%;"
            :disabled="!isEmptyValue(customerCredits)"
          >
            <el-input
              v-model="referenceNo"
            />
          </el-form-item>
        </el-col>
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
import recipientBank from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/recipientBank.vue'
import banksAccounts from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/banksAccounts.vue'
import creditMemo from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/creditMemo.vue'
import issuingBank from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/issuingBank.vue'
import bank from '@/components/ADempiere/Form/VPOS2/Collection/Charge/Field/bank.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import { getCurrencyPayment, clearFieldsCollections, isDisplayFieldPayment } from '@/utils/ADempiere/dictionary/form/VPOS'

export default defineComponent({
  name: 'Charge',
  components: {
    bank,
    currencie,
    fieldAmount,
    paymentMethods,
    recipientBank,
    banksAccounts,
    creditMemo,
    issuingBank
  },
  setup() {
    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const currentAccount = computed(() => {
      return store.getters.getAttributeField({
        field: 'bankAccounts',
        attribute: 'currentAccount'
      })
    })

    const customerCredits = computed(() => {
      return store.getters.getAttributeField({
        field: 'customerCredits',
        attribute: 'currentCustomerCredist'
      })
    })

    const code = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'field',
          attribute: 'value'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'field',
          attribute: 'value',
          value
        })
      }
    })
    const description = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'field',
          attribute: 'description'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'field',
          attribute: 'description',
          value
        })
      }
    })

    const date = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'field',
          attribute: 'date'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'field',
          attribute: 'date',
          value
        })
      }
    })

    const phone = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'field',
          attribute: 'phone'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'field',
          attribute: 'phone',
          value
        })
      }
    })

    const referenceNo = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'field',
          attribute: 'referenceNo'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'field',
          attribute: 'referenceNo',
          value
        })
      }
    })

    date.value = new Date()

    const currentCurrency = computed(() => {
      return store.getters.getAvailableCurrencies.currencie
    })

    if (!isEmptyValue(currentOrder.value.open_amount)) store.commit('setPayAmount', currentOrder.value.open_amount.value)

    /**
     * Hangle Change Payment Methods
     * @param {Object} paymentMethods
     */
    function changePaymentMethods(paymentMethods) {
      if (isEmptyValue(paymentMethods)) return
      const currentPaymentMethod = store.getters.getListPaymentMethods.find(list => list.id === paymentMethods)
      const currency = getCurrencyPayment({
        paymentMethods: currentPaymentMethod
      })
      store.commit('setAvailableCurrencies', currency)
      clearFieldsCollections()
    }

    const amount = computed(() => {
      const {
        open_amount
      } = currentOrder.value
      if (isEmptyValue(open_amount)) return 0.00
      return store.getters.getPayAmount
    })

    const amountDisplay = computed(() => {
      const {
        open_amount,
        price_list
      } = currentOrder.value
      let currencyPayment = price_list.currency
      if (isEmptyValue(open_amount)) return '0.00'
      if (!isEmptyValue(currentCurrency.value)) currencyPayment = currentCurrency.value
      return formatPrice({ value: Number(amount.value), currency: currencyPayment.iso_code })
    })

    function updateAmount(amount) {
      store.commit('setPayAmount', amount)
    }

    return {
      currentOrder,
      amount,
      amountDisplay,
      code,
      date,
      phone,
      description,
      referenceNo,
      currentAccount,
      customerCredits,
      formatPrice,
      updateAmount,
      changePaymentMethods,
      isDisplayFieldPayment
    }
  }
})
</script>

<style lang="scss" scoped></style>
