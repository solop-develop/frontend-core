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
      style="width: 100%;"
      @visible-change="findCreditMemo"
    >
      <el-option
        v-for="item in listCustomerCredits"
        :key="item.id"
        :label="item.document_no + ' - ' + item.document_date + ' - ' + formatPrice({ value: item.open_amount.value, currency: item.currency.iso_code })"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, watch } from '@vue/composition-api'

import store from '@/store'
// utils and helper methods
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
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

    function setData(creditMemo) {
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'referenceNo',
        value: creditMemo.document_no
      })
      store.commit('setPayAmount', creditMemo.open_amount.value)
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'description',
        value: creditMemo.description
      })
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'date',
        value: creditMemo.document_date
      })
    }

    function clearData(value = undefined) {
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'referenceNo',
        value
      })
      store.commit('setPayAmount', value)
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'description',
        value
      })
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'date',
        value
      })
    }

    watch(creditMemo, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        const creditMemo = listCustomerCredits.value.find(list => list.id === newValue)
        if (isEmptyValue(creditMemo)) {
          clearData()
        } else {
          setData(creditMemo)
        }
      }
    })

    return {
      creditMemo,
      listCustomerCredits,
      formatPrice,
      findCreditMemo,
      setData
    }
  }
})
</script>
