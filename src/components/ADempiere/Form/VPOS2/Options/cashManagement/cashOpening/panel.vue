<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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
            <payment-methods />
          </el-col>
          <el-col :span="8">
            <currency />
          </el-col>
          <el-col v-if="isAddAcount" :span="8">
            <cash-bank />
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row>
      <el-col
        :span="24"
        style="text-align: right;padding-top: 5px;"
      >
        <el-checkbox
          v-model="isAddAcount"
          style="padding-right: 10px;"
        >
          {{ $t('form.pos.collect.transferFunds') }}
        </el-checkbox>
        <!-- <el-button
          type="info"
          icon="el-icon-minus"
          class="button-base-icon"
        /> -->
        <el-button
          type="success"
          icon="el-icon-plus"
          class="button-base-icon"
          :disabled="isLoadingPayment || amount <= 0"
          :loading="isLoadingPayment"
          @click="addPayment"
        />
      </el-col>
    </el-row>
    <el-row v-if="!isEmptyValue(listPaymentsOpenst)" :gutter="10">
      <el-col
        v-for="(payment, key) in listPaymentsOpenst"
        :key="key"
        :span="8"
        style="margin: 10px 0px;"
      >
        <card-payments
          :payment="payment"
          :delete-payment="deletePaymentsOpen"
        />
      </el-col>
    </el-row>
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
            <collection-agent />
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('pointOfSales.collection.field.description')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-input
                v-model="description"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </el-card>
</template>
<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// Component and Mixins
import fieldAmount from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/fieldAmount.vue'
import paymentMethods from '@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashOpening/fields/paymentMethods.vue'
import collectionAgent from '@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashOpening/fields/collectionAgent.vue'
import cashBank from '@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashOpening/fields/cashBank.vue'
import currency from '@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashOpening/fields/currency.vue'
import CardPayments from '@/components/ADempiere/Form/VPOS2/Collection/Payments/CardPayments.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
// import { getCurrencyPayment } from '@/utils/ADempiere/dictionary/form/VPOS'
export default defineComponent({
  name: 'PanelCashOpening',
  components: {
    collectionAgent,
    paymentMethods,
    CardPayments,
    fieldAmount,
    cashBank,
    currency
  },
  setup() {
    const isLoadingPayment = ref(false)
    const isAddAcount = ref(false)

    // Computed

    const amount = computed(() => {
      return store.getters.getAttributeCashOpenFields({
        attribute: 'amount'
      })
    })

    const description = computed({
      get() {
        return store.getters.getAttributeCashOpenFields({
          attribute: 'description'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeCashOpenFields', {
          attribute: 'description',
          value: value
        })
      }
    })

    const currencyPayment = computed(() => {
      const currency = store.getters.getAttributeCashOpenFields({
        attribute: 'currency'
      })
      if (isEmptyValue(currency)) return { iso_code: '' }
      return currency
    })

    const amountDisplay = computed(() => {
      return formatPrice({ value: Number(amount.value), currency: currencyPayment.iso_code })
    })

    const listPaymentsOpenst = computed(() => {
      return store.getters.getCashOpeningPayments
    })

    // Methods

    function openCahs() {
      store.dispatch('setModalDialogVPOS', {
        title: lang.t('form.pos.optionsPoinSales.cashManagement.cashOpening'),
        doneMethod: () => {
          store.commit('setShowedModalDialogVPOS', {
            isShowed: false
          })
        },
        componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashOpening/panel.vue'),
        isShowed: true
      })
    }

    function updateAmount(value) {
      store.commit('setAttributeCashOpenFields', {
        attribute: 'amount',
        value
      })
    }

    /**
     * Hangle Change Payment Methods
     * @param {Object} paymentMethods
     */
    function changePaymentMethods(paymentMethods) {
      store.commit('setAttributeCashOpenFields', {
        attribute: 'amount',
        value: 0
      })
    }

    function addPayment() {
      isLoadingPayment.value = true
      const currency = store.getters.getAttributeCashOpenFields({
        attribute: 'currency'
      })

      const paymentMethods = store.getters.getAttributeCashOpenFields({
        attribute: 'paymentMethods'
      })

      const { default_opening_charge_id } = store.getters.getVPOS

      store.dispatch('createPaymentOpen', {
        amount: amount.value,
        currency_id: currency.id,
        charge_id: default_opening_charge_id,
        payment_method_id: paymentMethods.payment_method.id
      })
        .finally(() => {
          isLoadingPayment.value = false
          store.commit('setCashOpeningPayments', {
            attribute: 'amount',
            value: 0
          })
        })
    }

    function deletePaymentsOpen(payment) {
      return store.dispatch('deletePaymentsOpen', { payment_id: payment.id })
        .finally(() => {
          return false
        })
    }

    return {
      // Ref
      isAddAcount,
      isLoadingPayment,
      // Computed
      amount,
      description,
      amountDisplay,
      currencyPayment,
      listPaymentsOpenst,
      // Methods
      openCahs,
      addPayment,
      updateAmount,
      deletePaymentsOpen,
      changePaymentMethods
    }
  }
})
</script>

<style lang="scss" scoped>
.card-options-buttons {
  cursor: pointer;
  text-align: center !important;
  color: black;
  min-height: 50px;
}
.custom-card-options {
  margin: 1px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
