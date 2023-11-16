<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-main
    v-if="!isEmptyValue(currentShipment)"
    class="product-list-content"
  >
    <p class="total">
      {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}:
      <b class="order-info">
        {{ currentShipment.sales_representative.name }}
      </b>
    </p>
    <p class="total">
      {{ $t('form.pos.order.order') }}:
      <b class="order-info">
        {{ currentShipment.document_no }}
      </b>
    </p>
    <p class="total">
      {{ $t('form.pos.order.itemQuantity') }}:
      <b class="order-info">
        {{ formatQuantity({ value: getItemQuantity }) }}
      </b>
    </p>
    <p class="total">
      {{ $t('form.pos.order.numberLines') }}:
      <b class="order-info">
        {{ formatQuantity({ value: numberOfLines }) }}
      </b>
    </p>
  </el-main>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
// // Components and Mixins
// import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
// import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere'
// import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
// import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'Info',
  setup() {
    const currentShipment = computed(() => {
      return store.getters.getCurrentShipment
    })

    const getItemQuantity = computed(() => {
      const list = store.getters.getShipmentList
      if (list) {
        const result = list.map(list => list.quantity)
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
    })

    const numberOfLines = computed(() => {
      return store.getters.getShipmentList.length
    })

    return {
      currentShipment,
      getItemQuantity,
      numberOfLines,
      formatQuantity
    }
  }
})
</script>

<style lang="scss">
.product-list-content {
  padding-top: 0px;
}
.el-autocomplete-suggestion li {
  line-height: 20px;
}
</style>
