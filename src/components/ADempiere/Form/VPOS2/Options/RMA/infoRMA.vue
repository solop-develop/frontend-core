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
  <el-row>
    <el-col
      :offset="10"
      :span="14"
      style="border: 1px solid #d3d4d6;border-radius: 10px;padding-left: 10px;padding-right: 10px;margin-top: 10px;"
    >
      <el-row
        :gutter="10"
      >
        <el-col
          :span="16"
        >
          <p
            class="total-return-info"
          >
            <span class="info-label">
              {{ $t('form.pos.order.order') }}:
              <b class="order-info">
                {{ display('document_no') }}
              </b>
            </span>
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.date') }}:
              <b class="order-info">
                {{ formatDate(display('date_ordered')) }}
              </b>
            </span>
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.type') }}:
              <b class="order-info">
                {{ display('document_type').value }}
              </b>
            </span>
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.itemQuantity') }}:
              <b class="order-info">
                {{ formatQuantity({ value: itemQuantity }) }}
              </b>
            </span>
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.numberLines') }}:
              <b class="order-info">
                {{ listLineRMA.length }}
              </b>
            </span>
          </p>
        </el-col>
        <el-col
          :span="8"
        >
          <p
            class="total-return-info"
          >
            <span class="info-label">
              {{ $t('form.pos.order.seller') }}:
              <b class="order-info">
                {{ display('sales_representative').name }}
              </b>
            </span>
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.subTotal') }}:
              <b class="order-info">
                {{ displayAmount('total_lines') }}
              </b>
            </span>
            <!-- <br> -->
            <!-- <span class="info-label">
              {{ $t('form.pos.tableProduct.displayDiscountAmount') }}:
              <b v-if="!isEmptyValue(currentOrderReturn.priceList) && !isEmptyValue(currentOrderReturn.priceList.currency)" class="order-info">
                {{ formatPrice(currentOrderReturn.discountAmount, currentOrderReturn.priceList.currency.iso_code) }}
              </b>
            </span> -->
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.tax') }}:
              <b class="order-info">
                {{ displayAmount('tax_amount') }}
              </b>
              <!-- <b v-if="!isEmptyValue(currentOrderReturn.priceList) && !isEmptyValue(currentOrderReturn.priceList.currency)" class="order-info">
                {{ formatPrice(currentOrderReturn.taxAmount, currentOrderReturn.priceList.currency.iso_code) }}
              </b> -->
            </span>
            <br>
            <span class="info-label">
              {{ $t('form.pos.order.total') }}:
              <b class="order-info">
                {{ displayAmount('grand_total') }}
              </b>
            </span>
          </p>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import store from '@/store'
import { defineComponent, computed } from '@vue/composition-api'
// Utils and Helper Methods
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import { formatDate } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'infoRMA',
  setup() {
    const currentRMA = computed(() => {
      return store.getters.getAttributeRMA({
        attribute: 'current'
      })
    })

    const listLineRMA = computed(() => {
      return store.getters.getAttributeRMA({
        attribute: 'listLine'
      })
    })

    const itemQuantity = computed(() => {
      const result = listLineRMA.value.map(order => {
        return order.quantity
      })

      if (!isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    })

    function display(attribute) {
      if (isEmptyValue(currentRMA.value[attribute])) return ''
      return currentRMA.value[attribute]
    }

    function displayAmount(attribute) {
      if (isEmptyValue(currentRMA.value[attribute])) return formatPrice({ value: 0.00 })
      return formatPrice({ value: currentRMA.value[attribute].value, currency: currentRMA.value.price_list.currency.iso_code })
    }

    return {
      // Computed
      currentRMA,
      listLineRMA,
      itemQuantity,
      // Methods
      display,
      formatDate,
      formatQuantity,
      displayAmount
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
