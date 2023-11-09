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
            <span v-if="scope.row.isEditQty && valueOrder.columnName === 'QtyEntered'">
              <el-button v-if="scope.row.isLoading" :loading="scope.row.isLoading" />
              <edit-qty-entered
                v-else
                :qty="Number(scope.row.quantity_ordered.value)"
                :handle-change="updateQuantity"
              />
            </span>
            <span v-else>
              {{ displayValue({ row: scope.row, columnName: valueOrder.columnName }) }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            style="margin-left: 5px;"
            :disabled="scope.row.isLoading"
            :loading="scope.row.isLoading"
            @click="deleteLine(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <info-r-m-a />
    <br>
    <span v-if="isShowCheck" style="float: right;margin-top: 10px;">
      <el-checkbox
        v-model="isCreateNewSubstituteOrder"
        :label="$t('form.pos.orderRMA.createNewSubstituteOrder')"
        :border="true"
        style="margin-right: 10px"
      />
    </span>
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
  displayLabel,
  displayValue
} from '@/utils/ADempiere/dictionary/form/VPOS'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'Shipments',
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

    const isShowCheck = computed(() => {
      return store.getters.getAttributeRMA({
        attribute: 'isShowCheck'
      })
    })

    const currentRMA = computed(() => {
      return store.getters.getAttributeRMA({
        attribute: 'current'
      })
    })

    const isCreateNewSubstituteOrder = computed({
      get() {
        return store.getters.getAttributeRMA({
          attribute: 'isCreateNewSubstituteOrder'
        })
      },
      // setter
      set(show) {
        store.commit('setAttributeRMA', {
          attribute: 'isCreateNewSubstituteOrder',
          value: show
        })
      }
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
      store.dispatch('createRMALine', {
        quantity: quantity_ordered.value,
        sourceOrderLineId: id
      })
    }

    function selectLine(row, column, event) {
      const { columnKey } = column
      if (columnKey === 'QtyEntered') {
        row.isEditQty = true
      }
    }

    function exitLine(row, column, event) {
      const { columnKey } = column
      if (columnKey === 'QtyEntered') {
        row.isEditQty = false
      }
    }

    function updateQuantity(quantity) {
      line.value.isLoading = true
      store.dispatch('updateRMALine', {
        lineId: line.value.id,
        quantity
      })
        .finally(() => {
          line.value.isEditQty = false
          line.value.isLoading = false
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
        .finally(() => {
          line.isLoading = false
        })
    }

    function copyCode(value) {
      copyToClipboard({
        text: value.product.value,
        isShowMessage: true
      })
    }

    return {
      // Ref
      searchProduct,
      // Computed
      lines,
      currentRMA,
      listLineRMA,
      isShowCheck,
      orderLineDefinition,
      isCreateNewSubstituteOrder,
      // Methods
      copyCode,
      exitLine,
      selectLine,
      deleteLine,
      querySearch,
      currentLine,
      handleSelect,
      productFilter,
      updateQuantity,
      displayLabel,
      displayValue,
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
