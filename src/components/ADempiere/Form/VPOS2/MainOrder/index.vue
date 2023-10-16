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
  <span>
    <!-- {{ lines[0].quantityOrdered }} -->
    <el-table
      id="linesOrder"
      ref="linesTable"
      :data="lines"
      border
      fit
      highlight-current-row
      style="height: 100% !important;"
    >
      <template v-for="(valueOrder, key) in orderLineDefinition">
        <el-table-column
          v-if="displayLabel({ row: valueOrder })"
          :key="key"
          :column-key="valueOrder.columnName"
          :label="valueOrder.label"
          :align="valueOrder.isNumeric ? 'right' : 'left'"
        >
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            {{ displayValue({ row: scope.row, columnName: valueOrder.columnName}) }}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// Utils and Helper Methods
import { displayLabel, displayValue } from './Lines.ts'

export default defineComponent({
  name: 'infoOrder',
  setup() {
    const orderLineDefinition = computed(() => {
      return {
        lineDescription: {
          columnName: 'LineDescription',
          label: lang.t('form.pos.tableProduct.product'),
          isNumeric: false,
          size: 'auto'
        },
        currentPrice: {
          columnName: 'CurrentPrice',
          label: lang.t('form.productInfo.price'),
          isNumeric: true,
          size: '150px'
        },
        quantityOrdered: {
          columnName: 'QtyEntered',
          label: lang.t('form.pos.tableProduct.quantity'),
          isNumeric: true,
          size: '125px'
        },
        uom: {
          columnName: 'UOM',
          label: lang.t('form.pos.tableProduct.uom'),
          isNumeric: false,
          size: '75px'
        },
        discount: {
          columnName: 'Discount',
          label: lang.t('form.pos.order.discount'),
          isNumeric: true,
          size: '100px'
        },
        discountTotal: {
          columnName: 'DiscountTotal',
          label: lang.t('form.pos.tableProduct.displayDiscountAmount'),
          isNumeric: true,
          size: '125px'
        },
        discounDisplayTaxIndicator: {
          columnName: 'taxIndicator',
          label: lang.t('form.pos.tableProduct.taxRate'),
          isNumeric: true,
          size: '80px'
        },
        discounDisplayTaxAmounttTotal: {
          columnName: 'DisplayTaxAmount',
          label: lang.t('form.pos.tableProduct.taxAmount'),
          isNumeric: true,
          size: '150px'
        },
        grandTotal: {
          columnName: 'GrandTotal',
          label: 'Total',
          isNumeric: true,
          isVisible: true,
          size: '150px'
        },
        convertedAmount: {
          columnName: 'ConvertedAmount',
          label: lang.t('form.pos.collect.convertedAmount'),
          isNumeric: true,
          size: '150px'
        }
      }
    })
    const lines = computed(() => {
      return store.getters.getListOrderLines
    })

    return {
      orderLineDefinition,
      lines,
      // Methods
      displayLabel,
      displayValue
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
