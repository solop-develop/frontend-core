<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
      v-model="saleOrderField"
      clearable
      filterable
      size="mini"
      :filter-method="filterSearchOrder"
      style="margin: 0px; width: 100%"
      @visible-change="showList"
      @change="currentValue()"
    >
      <el-option
        v-for="item in optionsListOrder"
        :key="item.id"
        :label="item.displayColumn"
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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

//
import { requestListOrders } from '@/api/ADempiere/field/search/invoice.ts'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

export default defineComponent({
  name: 'OrderField',

  props: {
    uuidForm: {
      required: true,
      type: String
    }
  },

  setup(props) {
    const optionsListOrder = ref([])
    const saleOrderField = ref('')

    const isSalesTransaction = computed(() => {
      const stringValue = store.getters.getInvoiceSearchQueryFilterByAttribute({
        containerUuid: props.uuidForm,
        attributeKey: 'is_sales_transaction'
      })
      return convertStringToBoolean(stringValue)
    })

    const orderTitle = computed(() => {
      if (isSalesTransaction.value) {
        return lang.t('field.invoice.salesOrder')
      }
      return lang.t('field.invoice.purchaseOrder')
    })

    function showList(isShow) {
      if (isShow && isEmptyValue(optionsListOrder.value)) { filterSearchOrder({}) }
    }

    function filterSearchOrder(
      searchQuery
    ) {
      requestListOrders({
        search_value: searchQuery
      })
        .then(response => {
          const { records } = response
          optionsListOrder.value = records.map((list) => {
            return {
              ...list,
              displayColumn: list.values.DisplayColumn
            }
          })
        })
    }

    const currentValue = () => {
      store.dispatch('searchInvociesInfos', {
        order_id: saleOrderField.value
      })
    }

    return {
      optionsListOrder,
      saleOrderField,
      //
      orderTitle,
      //
      filterSearchOrder,
      showList,
      currentValue
    }
  }
})
</script>
