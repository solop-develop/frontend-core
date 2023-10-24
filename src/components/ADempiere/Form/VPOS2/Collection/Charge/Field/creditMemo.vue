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
    :label="$t('pointOfSales.collection.creditMemo')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="creditMemo"
      filterable
      clearable
      @visible-change="findCreditMemo"
    >
      <el-option
        v-for="item in listCustomerCredits"
        :key="item.id"
        :label="item.document_no + ' - ' + item.document_date + ' - ' + formatPrice(item.open_amount, item.currency.iso_code)"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, watch } from '@vue/composition-api'

import store from '@/store'
// utils and helper methods
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'creditMemo',
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const listCustomerCredits = computed(() => {
      return store.getters.getAttributeField({
        field: 'customerCredits',
        attribute: 'list'
      })
    })

    const creditMemo = computed({
      get() {
        const currentAccount = store.getters.getAttributeField({
          field: 'customerCredits',
          attribute: 'currentCustomerCredist'
        })
        if (currentAccount) return currentAccount.id
        return ''
      },
      // setter
      set(creditMemo) {
        let currentCredit
        if (!isEmptyValue(creditMemo)) {
          currentCredit = listCustomerCredits.value.find(list => list.id === creditMemo)
        }
        store.commit('setAttributeField', {
          field: 'customerCredits',
          attribute: 'currentCustomerCredist',
          value: currentCredit
        })
      }
    })

    function findCreditMemo(show) {
      if (!show) return
      store.dispatch('listCustomerCreditsMemo')
    }

    function setDataAccount(account) {
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'phone',
        value: account.account_no
      })
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'value',
        value: account.driver_license
      })
      store.commit('setAttributeField', {
        field: 'banks',
        attribute: 'issuingBank',
        value: {
          ...account,
          id: account.bank_id
        }
      })
    }

    // function clearDataAccount(value = undefined) {
    //   store.commit('setAttributeField', {
    //     field: 'field',
    //     attribute: 'phone',
    //     value
    //   })
    //   store.commit('setAttributeField', {
    //     field: 'field',
    //     attribute: 'value',
    //     value
    //   })
    //   store.commit('setAttributeField', {
    //     field: 'banks',
    //     attribute: 'issuingBank',
    //     value
    //   })
    // }

    watch(creditMemo, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        const creditMemo = listCustomerCredits.value.find(list => list.id === newValue)
        console.log({ creditMemo })
        // if (isEmptyValue(account)) {
        //   clearDataAccount()
        // } else {
        //   setDataAccount(account)
        // }
      }
    })

    return {
      creditMemo,
      listCustomerCredits,
      formatPrice,
      findCreditMemo,
      setDataAccount
    }
  }
})
</script>
