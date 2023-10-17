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
  <el-row :gutter="20" style="margin-top: 10px;">
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
        </el-col>
        <el-col :span="24" style="margin: 0px;">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.numberLines') + ':' }}
          </span>
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
            <i class="el-icon-s-custom" />
            {{ $t('form.pos.order.seller') + ':' }}
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
            {{ infoOrder.totalLines }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.tableProduct.displayDiscountAmount') + ':' }}
          </span>
          <b style="float: right">
            {{ infoOrder.discountAmount }}
          </b>
        </el-col>
        <el-col :span="24">
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.tax') + ':' }}
          </span>
          <b style="float: right">
            {{ infoOrder.taxAmount }}
          </b>
        </el-col>
        <el-col
          :span="24"
          class="total"
        >
          <span
            style="float: left"
          >
            {{ $t('form.pos.order.total') }}
          </span>
          <b style="float: right">
            {{ infoOrder.grandTotal }}
          </b>
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

export default defineComponent({
  name: 'infoOrder',
  setup() {
    const infoOrder = computed(() => {
      const order = store.getters.getCurrentOrder
      if (
        !isEmptyValue(order) &&
        !isEmptyValue(order.uuid)
      ) {
        return {
          documentNo: order.documentNo,
          salesRepresentative: order.salesRepresentative,
          totalLines: order.totalLines,
          discountAmount: order.discountAmount,
          taxAmount: order.taxAmount,
          grandTotal: order.grandTotal,
          dateOrdered: order.dateOrdered,
          documentType: order.documentType
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

    return {
      infoOrder
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
