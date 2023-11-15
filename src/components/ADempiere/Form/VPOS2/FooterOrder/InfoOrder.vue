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
  <el-row :gutter="10" style="margin-top: 10px;">
    <el-col
      :span="14"
      style="float: left"
    >
      <el-row>
        <el-col :span="24" style="margin-top: 0px;">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.order') + ':' }}
          </span>
          <b style="float: right">
            {{ infoOrder.documentNo }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.date') + ':' }}
          </span>
          <b style="float: right">
            {{ infoOrder.dateOrdered }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.type') + ':' }}
          </span>
          <b style="float: right">
            {{ infoOrder.documentType.name }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.itemQuantity') + ':' }}
          </span>
          <b style="float: right">
            {{ formatQuantity({ value: getItemQuantity }) }}
          </b>
        </el-col>
        <el-col :span="24" style="margin: 0px;">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.numberLines') + ':' }}
          </span>
          <b style="float: right">
            {{ lines.length }}
          </b>
        </el-col>
      </el-row>
    </el-col>
    <el-col
      :span="10"
      style="float: right"
    >
      <el-row>
        <el-col :span="24" style="margin-top: 0px;">
          <span
            style="float: left"
          >
            <el-dropdown
              trigger="click"
              class="info-pos"
              @command="changeSeller"
            >
              <span>
                <span
                  style="float: left;color: black;font-size: 16px;"
                >
                  <i class="el-icon-s-custom" />
                  {{ $t('form.pos.order.seller') + ':' }}
                </span>
                <!-- <b style="float: right">
                  {{ infoOrder.salesRepresentative.name }}
                </b> -->
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in listSellers"
                  :key="index"
                  :command="item"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <i class="el-icon-s-custom" />
            {{ $t('form.pos.order.seller') + ':' }} -->
          </span>
          <b style="float: right">
            {{ infoOrder.salesRepresentative.name }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.subTotal') + ':' }}
          </span>
          <b style="float: right">
            {{ displayAmount(infoOrder.totalLines) }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.tableProduct.displayDiscountAmount') + ':' }}
          </span>
          <b style="float: right">
            {{ displayAmount(infoOrder.discountAmount) }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.tax') + ':' }}
          </span>
          <b style="float: right">
            {{ displayAmount(infoOrder.taxAmount) }}
          </b>
        </el-col>
        <el-col :span="24" class="total">
          <el-col
            :span="24"
          >
            <span
              style="float: left"
            >
              {{ $t('form.pos.order.total') }}
            </span>
            <b style="float: right">
              {{ displayAmount(infoOrder.grandTotal) }}
            </b>
          </el-col>
          <el-col
            v-if="!isEmptyValue(infoOrder)"
            :span="24"
          >
            <span
              style="float: left"
            >
              {{ $t('form.pos.collect.convertedAmount') }}
            </span>
            <b style="float: right">
              {{ formatPrice({ value: Number(infoOrder.grand_total_converted), currency: displayCurrency}) }}
            </b>
          </el-col>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'infoOrder',
  setup() {
    const infoOrder = computed(() => {
      const order = store.getters.getCurrentOrder
      if (
        !isEmptyValue(order) &&
        !isEmptyValue(order.id)
      ) {
        return {
          ...order,
          documentNo: order.document_no,
          salesRepresentative: order.sales_representative,
          totalLines: order.total_lines.value,
          discountAmount: order.discount_amount.value,
          taxAmount: order.tax_amount.value,
          grandTotal: order.grand_total.value,
          dateOrdered: order.date_ordered,
          documentType: order.document_type
        }
      }
      return {
        documentNo: '',
        salesRepresentative: {
          id: null,
          name: ''
        },
        documentType: {
          id: null,
          name: ''
        },
        discountAmount: null,
        totalLines: null,
        taxAmount: null,
        grandTotal: null,
        dateOrdered: ''
      }
    })

    const lines = computed(() => {
      return store.getters.getListOrderLines
    })

    const listSellers = computed(() => {
      return store.getters.getListSellers
    })

    const displayCurrency = computed(() => {
      const { display_currency } = store.getters.getVPOS
      if (display_currency) return displayCurrency.iso_code
      return ''
    })

    const getItemQuantity = computed(() => {
      if (isEmptyValue(store.getters.getCurrentOrder.id)) return 0
      const arrayQuantity = lines.value.map(line => Number(line.quantity_ordered.value))
      if (isEmptyValue(arrayQuantity)) return 0
      return arrayQuantity.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    })

    function displayAmount(amount) {
      const { price_list } = store.getters.getCurrentOrder
      if (isEmptyValue(price_list)) return amount
      return formatPrice({ value: amount, currency: price_list.currency.iso_code })
    }

    function changeSeller(seller) {
      store.dispatch('updateCurrentOrder', {
        sales_representative_id: seller.id
      })
    }

    return {
      lines,
      infoOrder,
      listSellers,
      getItemQuantity,
      displayCurrency,
      formatPrice,
      changeSeller,
      displayAmount,
      formatQuantity
    }
  }
})
</script>

<style lang="scss" scoped>
.order-info {
  float: right;
}
.total {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
}
</style>
