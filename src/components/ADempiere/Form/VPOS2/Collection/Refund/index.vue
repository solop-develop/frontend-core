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
        <el-col v-if="typeOptions === '2'" :span="8">
          <banks-accounts />
        </el-col>
        <!-- Payment Methods (Fields Display Logic) -->
        <!-- <el-col v-if="isDisplayFieldPayment('creditMemo', currentPaymentMethod)" :span="8">
          <credit-memo />
        </el-col> -->
        <!-- <el-col v-if="isDisplayFieldPayment('recipientBank', currentPaymentMethod)" :span="8">
          <recipient-bank />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('issuingBank', currentPaymentMethod)" :span="8">
          <issuing-bank />
        </el-col> -->
        <el-col
          v-if="typeOptions === '2'"
          :span="8"
        >
          <bank />
        </el-col>
        <el-col v-if="typeOptions === '2'" :span="8">
          <bankAccount-type />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Value', currentPaymentMethod)" :span="8">
          <value />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Description', currentPaymentMethod)" :span="8">
          <description />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Date', currentPaymentMethod)" :span="8">
          <date />
        </el-col>
        <el-col v-if="isDisplayFieldPayment('Phone', currentPaymentMethod)" :span="8">
          <phone />
        </el-col>
        <el-col
          v-if="typeOptions === '2'"
          :span="8"
        >
          <account-no />
        </el-col>
      </el-row>
    </el-form>
    <el-row style="text-align: end;padding: 5px 0px;">
      <span class="dialog-footer">
        <el-button
          type="success"
          icon="el-icon-plus"
          class="button-base-icon"
          :disabled="amount <= 0 || isLoadingPay"
          :loading="isLoadingPay"
          @click="addPayment"
        />
      </span>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'
// import router from '@/router'
// Component and Mixins
import fieldAmount from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/fieldAmount.vue'
import paymentMethods from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/paymentMethods'
import currencie from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/currencies'
import recipientBank from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/recipientBank.vue'
import banksAccounts from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/banksAccounts.vue'
import creditMemo from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/creditMemo.vue'
import issuingBank from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/issuingBank.vue'
import bankAccountType from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/bankAccountType.vue'
import bank from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/bank.vue'
import Value from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/value'
import description from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/description'
import date from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/date'
import phone from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/phone'
import accountNo from '@/components/ADempiere/Form/VPOS2/Collection/Refund/Field/accountNo'
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
    issuingBank,
    bankAccountType,
    description,
    accountNo,
    date,
    phone,
    Value
  },
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const isLoadingPay = ref(false)
    const currentPaymentMethod = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'paymentMethods'
      })
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const currentAccount = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'currentAccount'
      })
    })

    const customerCredits = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'currentCustomerCredist'
      })
    })

    const typeOptions = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'typeOptions'
      })
    })

    const code = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'value'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'value',
          value
        })
      }
    })
    const description = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'description'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'description',
          value
        })
      }
    })

    const date = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'date'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'date',
          value
        })
      }
    })

    const phone = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'phone'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'phone',
          value
        })
      }
    })

    const referenceNo = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'referenceNo'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'referenceNo',
          value
        })
      }
    })

    date.value = new Date()

    const currentCurrency = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'currencie'
      })
    })

    const currentAmount = computed(() => {
      return Number(store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'amount'
      }))
    })

    if (!isEmptyValue(currentOrder.value.open_amount)) {
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'amount',
        value: Number(currentOrder.value.refund_amount.value)
      })
      // store.commit('setPayAmount', currentOrder.value.refund_amount.value)
    }

    /**
     * Hangle Change Payment Methods
     * @param {Object} paymentMethods
     */
    function changePaymentMethods(paymentMethods) {
      if (isEmptyValue(paymentMethods)) return
      const currentPaymentMethod = store.getters.getListPaymentMethods.find(list => list.id === paymentMethods)
      const currency = getCurrencyPayment({
        paymentMethods: currentPaymentMethod,
        isRefund: true
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'currencie',
        value: currency
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'amount',
        value: Number(currentOrder.value.refund_amount.value)
      })
      // store.commit('setAvailableCurrencies', currency)
      clearFieldsCollections()
    }

    const amount = computed(() => {
      const {
        refund_amount
      } = currentOrder.value
      if (isEmptyValue(refund_amount)) return 0.00
      return Number(store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'amount'
      }))
    })

    const amountDisplay = computed(() => {
      const {
        refund_amount,
        price_list
      } = currentOrder.value
      let currencyPayment = price_list.currency
      if (isEmptyValue(refund_amount)) return '0.00'
      if (!isEmptyValue(currentCurrency.value)) currencyPayment = currentCurrency.value
      return formatPrice({ value: Number(amount.value), currency: currencyPayment.iso_code })
    })

    const currentPos = computed(() => {
      return store.getters.getVPOS
    })

    function updateAmount(amount) {
      // store.commit('setPayAmount', amount)
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'amount',
        value: amount
      })
    }

    function validatePaye() {
      const currency = store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'currencie'
      })
      store.dispatch('setModalPin', {
        title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.collect.overdrawnInvoice.amountLimitOrder'),
        doneMethod: () => {
          isLoadingPay.value = true
          store.dispatch('addPayment', {
            reference_no: referenceNo.value,
            description: description.value,
            amount: amount.value,
            tender_type_code: currentPaymentMethod.value.payment_method.tender_type,
            currency_id: currency.id,
            payment_method_id: currentPaymentMethod.value.payment_method.id,
            payment_account_date: date.value,
            is_refund: true
          })
            .then(() => {
              isLoadingPay.value = false
            })
        },
        requestedAccess: 'IsAllowsInvoiceOpen',
        requestedAmount: Number(amount.value),
        isShowed: true
      })
    }

    function addPayment() {
      isLoadingPay.value = true
      const currency = store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'currencie'
      })
      if (isEmptyValue(currentAccount.value) && typeOptions.value === '2') {
        let accountNo
        accountNo = store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'accountNo'
        })
        const driverLicense = store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'value'
        })
        const bankId = store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'bank'
        })
        const bankAccountType = store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'bankAccountType'
        })
        if (isEmptyValue(accountNo)) accountNo = phone.value
        store.dispatch('newCustomerBankAccount', {
          accountNo,
          driverLicense,
          bankId: bankId.id,
          bankAccountType
        })
      }
      if (
        !isEmptyValue(currentPos.value.maximum_refund_allowed.value) &&
        Number(currentPos.value.maximum_refund_allowed.value) > 0 &&
        (Number(currentPos.value.maximum_refund_allowed.value) > amount.value && currentPos.value.refund_reference_currency.id === currency.id)
      ) {
        validatePaye()
      }
      store.dispatch('addPayment', {
        reference_no: referenceNo.value,
        description: description.value,
        amount: amount.value,
        tender_type_code: currentPaymentMethod.value.payment_method.tender_type,
        currency_id: currency.id,
        payment_method_id: currentPaymentMethod.value.payment_method.id,
        payment_account_date: date.value,
        is_refund: true
      })
        .then(() => {
          isLoadingPay.value = false
        })
    }

    return {
      currentPos,
      isLoadingPay,
      currentOrder,
      amount,
      amountDisplay,
      code,
      date,
      phone,
      currentAmount,
      typeOptions,
      description,
      referenceNo,
      currentAccount,
      customerCredits,
      currentPaymentMethod,
      addPayment,
      formatPrice,
      updateAmount,
      changePaymentMethods,
      isDisplayFieldPayment
    }
  }
})
</script>

<style lang="scss" scoped></style>
