<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-form-item :label="orderTitle">
    <el-select
      v-model="currentSaleOrder"
      filterable
      clearable
      remote
      :loading="isLoading"
      :remote-method="remoteMethod"
      @visible-change="showOrder"
    >
      <empty-option-select
        :current-value="currentSaleOrder"
        :is-allows-zero="false"
      />
      <el-option
        v-for="item in optionsListOrder"
        :key="item.id"
        :label="item.values.DisplayColumn"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import {
  computed, defineComponent, ref
} from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// API Request Methods
import { requestListOrders } from '@/api/ADempiere/fields/search/invoice.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

export default defineComponent({
  name: 'OrderField',

  components: {
    EmptyOptionSelect
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    }
  },

  setup(props) {
    const optionsListOrder = ref([])
    const isLoading = ref(false)
    const saleOrderField = ref('')
    const timeOut = ref(null)

    const isSalesTransaction = computed(() => {
      const stringValue = store.getters.getPaymentQueryFilterByAttribute({
        containerUuid: props.uuidForm,
        attributeKey: 'is_sales_transaction'
      })
      return convertStringToBoolean(stringValue)
    })

    const currentSaleOrder = computed({
      set(newValue) {
        store.commit('setPaymentFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: 'orderId',
          value: isEmptyValue(newValue) ? -1 : newValue
        })
      },
      get() {
        return store.getters.getPaymentQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: 'orderId'
        })
      }
    })

    const orderTitle = computed(() => {
      if (isSalesTransaction.value) {
        return lang.t('field.invoice.salesOrder')
      }
      return lang.t('field.invoice.purchaseOrder')
    })

    function showOrder(show) {
      if (show && isEmptyValue(optionsListOrder.value)) remoteMethod()
    }

    function remoteMethod(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        isLoading.value = true
        requestListOrders({
          search_value: searchValue
        })
          .then(response => {
            const { records } = response
            optionsListOrder.value = records
          })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    return {
      optionsListOrder,
      saleOrderField,
      currentSaleOrder,
      isLoading,
      timeOut,
      //
      orderTitle,
      showOrder,
      remoteMethod
      //
      // filterSearchOrder,
      // showOrder,
      // currentValue
    }
  }
})
</script>
