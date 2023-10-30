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
    class="product-list-content"
  >
    <el-table
      :data="listLineRMA"
      :empty-text="$t('quickAccess.searchWithEnter')"
      border
      fit
      highlight-current-row
      @row-click="selectLine"
      @row-dblclick="exitLine"
      @current-change="currentLine"
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
            <el-button
              v-show="valueOrder.columnName === 'LineDescription'"
              type="text"
              icon="el-icon-document-copy"
              @click="copyCode(scope.row)"
            />
            {{ displayValue({ row: scope.row, columnName: valueOrder.columnName}) }}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </el-main>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
import lang from '@/lang'
// // Components and Mixins
import infoRMA from '@/components/ADempiere/Form/VPOS2/Options/RMA/infoRMA.vue'
import editQtyEntered from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/editQtyEntered.vue'
// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import {
  displayLabel
} from '@/utils/ADempiere/dictionary/form/VPOS'

export default defineComponent({
  name: 'PreviwerRMA',
  components: {
    infoRMA,
    editQtyEntered
  },
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
    const searchProduct = ref('')
    const line = ref({})
    const lines = computed(() => {
      return store.getters.getListOrderLines
    })

    const listLineRMA = computed(() => {
      return store.getters.getAttributeRMA({
        attribute: 'listLine'
      })
    })

    // Methods

    /**
     * Query Search
     */
    function querySearch(queryString, callback) {
      var results = queryString ? lines.value.filter(productFilter(queryString)) : lines.value
      callback(results)
    }

    function productFilter(queryString) {
      return (link) => {
        const search = queryString.toLowerCase()
        return link.product.value.toLowerCase().includes(search) || link.product.name.toLowerCase().includes(search) || link.product.upc.toLowerCase().includes(search)
      }
    }

    function handleSelect(item) {
      const {
        id,
        quantity_ordered
      } = item
      store.dispatch('createShipmentLine', {
        quantity: quantity_ordered.value,
        orderLineId: id
      })
    }

    function selectLine(row, column, event) {
      const { property } = column
      if (property === 'quantity') {
        row.isEditQty = true
      }
    }

    function exitLine(row, column, event) {
      const { property } = column
      if (property === 'quantity') {
        row.isEditQty = false
      }
    }

    function updateQuantity(quantity) {
      store.dispatch('updateRMALine', {
        lineId: line.value.id,
        quantity
      })
    }

    function currentLine(currentRow, oldCurrentRow) {
      line.value = currentRow
    }

    function deleteLine(line) {
      line.isLoading = true
      store.dispatch('deleteRMALine', {
        lineId: line.id
      })
        .then(() => {
          line.isLoading = false
        })
    }

    return {
      // Ref
      searchProduct,
      // Computed
      lines,
      listLineRMA,
      orderLineDefinition,
      // Methods
      exitLine,
      selectLine,
      deleteLine,
      querySearch,
      currentLine,
      handleSelect,
      productFilter,
      updateQuantity,
      displayLabel,
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
