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
  <el-row>
    <el-col
      :span="24"
      style="text-align: right;padding-top: 5px;"
    >
      <el-button
        type="danger"
        icon="el-icon-close"
        class="button-base-icon"
        @click="close"
      />
      <el-button
        type="success"
        icon="el-icon-plus"
        class="button-base-icon"
        :disabled="isLoading || payAmount <= 0"
        :loading="isLoading"
        @click="addPayment"
      />
      <el-button
        type="primary"
        icon="el-icon-shopping-cart-full"
        class="button-base-icon"
        :disabled="isLoadingProcess"
        :loading="isLoadingProcess"
        @click="processOrdes"
      />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
import lang from '@/lang'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getPaymentValues } from '@/utils/ADempiere/dictionary/form/VPOS'
// import { defaultValueCollections } from '@/utils/ADempiere/dictionary/form/VPOS'

export default defineComponent({
  name: 'ButtonGroupOptions',
  setup() {
    const isLoading = ref(false)
    const isLoadingProcess = ref(false)

    const currentAccount = computed(() => {
      return store.getters.getAttributeField({
        field: 'bankAccounts',
        attribute: 'currentAccount'
      })
    })

    const currentPos = computed(() => {
      return store.getters.getVPOS
    })

    const payAmount = computed(() => {
      return store.getters.getPayAmount
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    function addPayment() {
      const { payment_method } = store.getters.getPaymentMethods
      isLoading.value = true
      if (
        !isEmptyValue(payment_method) &&
        isEmptyValue(currentAccount.value) &&
        payment_method.tender_type === 'P'
      ) {
        store.dispatch('newCustomerBankAccount')
          .then((responseCutomer) => {
            const { bank_id, customer_id } = responseCutomer
            const params = getPaymentValues({
              bank_id,
              customer_bank_account_id: customer_id
            })
            store.dispatch('addPayment', params)
              .then(() => {
                isLoading.value = false
              })
          })
        return
      }
      const params = getPaymentValues({})
      store.dispatch('addPayment', params)
        .then(() => {
          isLoading.value = false
        })
    }

    function processOrdes() {
      const {
        grand_total,
        charge_amount,
        credit_amount,
        payment_amount,
        refund_amount,
        open_amount
      } = currentOrder.value
      const total = Number(grand_total.value) + Number(charge_amount.value) - Number(credit_amount.value) - Number(payment_amount.value)
      if (total === 0) {
        isLoadingProcess.value = true
        store.dispatch('process', {})
          .then(() => {
            isLoadingProcess.value = false
          })
      } else if (Number(open_amount.value) > 0) {
        store.dispatch('setModalDialogVPOS', {
          title: lang.t('form.pos.collect.overdrawnInvoice.below'),
          doneMethod: () => {
            if (Number(open_amount.value) > Number(currentPos.value.write_off_amount_tolerance.value)) {
              /**
               * Request PIN
               */
              store.dispatch('setModalPin', {
                title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.invoiceOpen'),
                doneMethod: () => {
                  isLoadingProcess.value = true
                  store.dispatch('process', {})
                    .then(() => {
                      isLoadingProcess.value = false
                    })
                },
                requestedAccess: 'IsAllowsInvoiceOpen',
                requestedAmount: Number(open_amount.value),
                isShowed: true
              })
              return
            }
            store.dispatch('process', {})
          },
          componentPath: () => import('@/components/ADempiere/Form/VPOS2/DialogInfo/openBalance.vue'),
          isShowed: true
        })
      } else {
        store.dispatch('setModalDialogVPOS', {
          title: lang.t('form.pos.collect.overdrawnInvoice.title'),
          doneMethod: () => {
            if (Number(open_amount.value) > Number(currentPos.value.write_off_amount_tolerance.value)) {
              /**
               * Request PIN
               */
              store.dispatch('setModalPin', {
                title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.invoiceOpen'),
                doneMethod: () => {
                  isLoadingProcess.value = true
                  store.dispatch('process', {})
                    .then(() => {
                      isLoadingProcess.value = false
                    })
                },
                requestedAccess: 'IsAllowsInvoiceOpen',
                requestedAmount: Number(refund_amount.value),
                isShowed: true
              })
              return
            }
            store.dispatch('process', {})
          },
          componentPath: () => import('@/components/ADempiere/Form/VPOS2/DialogInfo/overdrawnInvoice.vue'),
          isShowed: true
        })
      }
    }
    function close() {
      store.commit('setShowCollection', false)
    }

    return {
      isLoading,
      payAmount,
      currentOrder,
      currentPos,
      currentAccount,
      isLoadingProcess,
      close,
      addPayment,
      processOrdes
    }
  }
})
</script>

<style lang="scss" scoped>
.buttons-and-options {
  text-align: left;
}
.order-info {
  text-align: right;
}
</style>
