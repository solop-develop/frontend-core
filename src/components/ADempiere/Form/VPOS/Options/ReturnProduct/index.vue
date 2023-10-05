<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for morej details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div
    class="return-product"
  >
    <el-form
      label-position="top"
      label-width="10px"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item
        :label="$t('form.productInfo.codeProduct')"
        style="width: 100%;"
      >
        <el-select
          v-model="searchProduct"
          remote
          filterable
          reserve-keyword
          style="width: 100%;"
          :visible-change="listReturnProduct"
          :placeholder="$t('quickAccess.searchWithEnter')"
          @change="addLine"
        >
          <el-option
            v-for="item in currentOrder.lineOrder"
            :key="item.value"
            :value="item"
          >
            <span style="float: left">{{ item.product.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{
                formatQuantity({
                  value: item.quantityOrdered,
                  precision: item.uom.uom.starndard_precision
                })
              }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      ref="listProducto"
      v-loading="false"
      :data="listProduct"
      fit
      :empty-text="$t('quickAccess.searchWithEnter')"
      :border="true"
      highlight-current-row
      style="height: 60% !important;"
      @cell-dblclick="editLine"
    >
      <template v-for="(valueOrder, item, key) in orderLineDefinition">
        <el-table-column
          v-if="displayLabel(valueOrder)"
          :key="key"
          :column-key="valueOrder.columnName"
          :label="valueOrder.label"
          :width="sizeTableColumn(valueOrder)"
          :align="valueOrder.isNumeric ? 'right' : 'left'"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="(scope.row.isEditLine && valueOrder.columnName === 'QtyEntered')"
              ref="editField"
              v-model="scope.row.quantity"
              :autofocus="true"
              controls-position="right"
              style="width: 100%;"
              @change="editQuantityLine(scope.row)"
            />
            <span v-else>
              {{ displayValue(scope.row, valueOrder) }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
        column-key="value"
        :align="'center'"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteLine(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
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
                  {{ currentOrderReturn.documentNo }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ formatDate(currentOrderReturn.dateOrdered) }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.type') }}:
                <b v-if="!isEmptyValue(currentOrderReturn) && !isEmptyValue(currentOrderReturn.documentType)" class="order-info">
                  {{ currentOrderReturn.documentType.name }}
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
                  {{ listProduct.length }}
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
                <b v-if="!isEmptyValue(currentOrderReturn.salesRepresentative)" class="order-info">
                  {{ currentOrderReturn.salesRepresentative.name }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.subTotal') }}:
                <b v-if="!isEmptyValue(currentOrderReturn.priceList) && !isEmptyValue(currentOrderReturn.priceList.currency)" class="order-info">
                  {{ formatPrice(currentOrderReturn.totalLines, currentOrderReturn.priceList.currency.iso_code) }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.tableProduct.displayDiscountAmount') }}:
                <b v-if="!isEmptyValue(currentOrderReturn.priceList) && !isEmptyValue(currentOrderReturn.priceList.currency)" class="order-info">
                  {{ formatPrice(currentOrderReturn.discountAmount, currentOrderReturn.priceList.currency.iso_code) }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.tax') }}:
                <b v-if="!isEmptyValue(currentOrderReturn.priceList) && !isEmptyValue(currentOrderReturn.priceList.currency)" class="order-info">
                  {{ formatPrice(currentOrderReturn.taxAmount, currentOrderReturn.priceList.currency.iso_code) }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.total') }}:
                <b v-if="!isEmptyValue(currentOrderReturn.priceList) && !isEmptyValue(currentOrderReturn.priceList.currency)" class="order-info">
                  {{ formatPrice(currentOrderReturn.grandTotal, currentOrderReturn.priceList.currency.iso_code) }}
                </b>
              </span>
            </p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="products-list-footer">
      <el-col :span="24">
        <samp style="float: right; padding-top: 5px;">
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="close"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="process"
          />
        </samp>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// constants
// api request methods
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
import store from '@/store'
import lang from '@/lang'

// Utils and Helper Methods
import { formatPrice, formatDate } from '@/utils/ADempiere/valueFormat.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'ReturnProduct',
  setup(props, { root }) {
    // Ref
    const searchProduct = ref('')
    const isEditQuantity = ref(false)
    // Computed
    const listProduct = computed(() => {
      return store.getters.getListProduct.map(product => {
        return {
          ...product,
          isEditLine: false
        }
      })
    })

    const currentPointOfSales = computed(() => {
      return store.getters.posAttributes.currentPointOfSales
    })

    const currentOrder = computed(() => {
      return store.getters.posAttributes.currentPointOfSales.currentOrder
    })

    const currentOrderReturn = computed({
      get() {
        return store.getters.getOrderReturn
      },
      set(value) {
        store.commit('setOrderReturn', value)
      }
    })

    const itemQuantity = computed(() => {
      const result = listProduct.value.map(order => {
        return order.quantity
      })

      if (!isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const orderLineDefinition = computed(() => {
      return {
        lineDescription: {
          columnName: 'LineDescription',
          label: lang.t('form.pos.tableProduct.product'),
          isNumeric: false,
          size: '300px'
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
          size: '150px'
        },
        uom: {
          columnName: 'UOM',
          label: lang.t('form.pos.tableProduct.uom'),
          isNumeric: false,
          size: 'auto'
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
    // Variable (Let)
    let loading
    // Methods
    function listReturnProduct(show) {
      if (!show) return
    }
    function close() {
      store.commit('setShowReturnProduct', false)
    }

    function loadARM() {
      store.dispatch('openRMA', {
        sourceOrderId: currentOrder.value.id,
        posId: currentPointOfSales.value.id
      })
        .then(response => {
          currentOrderReturn.value = {
            ...response,
            isLoading: false
          }
        })
    }

    function addLine(line) {
      store.dispatch('createLineRMA', {
        sourceOrderLineId: line.id,
        quantity: line.quantityOrdered,
        rmaId: currentOrderReturn.value.id,
        posId: currentPointOfSales.value.id
      })
      searchProduct.value = ''
    }

    function displayLabel(row) {
      if (isMobile.value) {
        if (row.columnName === 'LineDescription') {
          return true
        } else if (row.columnName === 'CurrentPrice') {
          return true
        } else if (row.columnName === 'QtyEntered') {
          return true
        } else if (row.columnName === 'GrandTotal') {
          return true
        }
        return false
      }
      if (row.columnName === 'ConvertedAmount') {
        return !isEmptyValue(currentPointOfSales.value.displayCurrency)
      } else if (row.columnName === 'Discount') {
        return currentPointOfSales.value.isDisplayDiscount
      } else if (row.columnName === 'DiscountTotal') {
        return currentPointOfSales.value.isDisplayDiscount
      } else if (row.columnName === 'taxIndicator') {
        return currentPointOfSales.value.isDisplayTaxAmount
      } else if (row.columnName === 'DisplayTaxAmount') {
        return currentPointOfSales.value.isDisplayTaxAmount
      } else if (row.columnName === 'GrandTotal') {
        return true
      }
      return true
    }

    function sizeTableColumn(table) {
      if (isMobile.value) {
        if (table.columnName === 'LineDescription') {
          return table.size
        } else if (table.columnName === 'CurrentPrice') {
          return '100px'
        } else if (table.columnName === 'QtyEntered') {
          return '250px'
        } else if (table.columnName === 'GrandTotal') {
          return '90px'
        }
        return
      }

      return table.size
    }

    /**
     * Show the correct display format
     * @param {object} row record
     * @param {object} orderLine or field definition
     */
    function displayValue(row, orderLine) {
      const { columnName } = orderLine
      // const iSOCode = this.isEmptyValue(currentPointOfSales.value.displayCurrency) ? '' : currentPointOfSales.value.displayCurrency.iSOCode
      if (columnName === 'LineDescription') {
        if (!isEmptyValue(row.resourceAssignment)) return row.product.name + ' - (' + row.resourceAssignment.name + ')'
        if (isEmptyValue(row.product.name)) return row.description
        if (isEmptyValue(row.product.value)) return row.charge.columnName
        if (isMobile.value) {
          return row.product.name
        }
        return row.product.value + ' - ' + row.product.name
      }
      const currency = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.priceList.currency.iso_code
      if (columnName === 'CurrentPrice') {
        let price = row.price
        if (!currentPointOfSales.value.isDisplayTaxAmount && !currentPointOfSales.value.isDisplayDiscount) {
          price = row.priceWithTax
        }
        if (isMobile.value) {
          return this.formatPrice(price)
        }
        return this.formatPrice(price, currency)
      } else if (columnName === 'QtyEntered') {
        if (isEmptyValue(row.uom.uom)) {
          return formatQuantity({
            value: row.quantity
          })
        }
        let precision = row.uom.uom.starndard_precision
        if (isEmptyValue(precision)) {
          precision = 0
        }
        return formatQuantity({
          value: row.quantity,
          precision
        })
      } else if (columnName === 'UOM') {
        return row.uom.uom.name
      } else if (columnName === 'Discount') {
        return formatQuantity({ value: row.discount }) + ' %'
      } else if (columnName === 'taxIndicator') {
        const rate = row.taxRate.rate
        let taxIndicator = Number.parseFloat(rate).toFixed(2) + ' %'
        if (rate <= 0) {
          taxIndicator = row.taxRate.name
        }
        return taxIndicator
      } else if (columnName === 'GrandTotal') {
        let price = row.totalAmountWithTax
        if (currentPointOfSales.value.currentPriceList.isTaxIncluded) {
          price = row.totalAmount
        }
        if (isMobile.value) {
          return this.formatPrice(price)
        }
        return this.formatPrice(price, currency)
      } else if (columnName === 'DiscountTotal') {
        return this.formatPrice(row.totalDiscountAmount, currency)
      } else if (columnName === 'DisplayTaxAmount') {
        return this.formatPrice(row.totalTaxAmount, currency)
      }
    }

    function deleteLine(row) {
      store.dispatch('deleteLineRMA', {
        id: row.id,
        posId: currentPointOfSales.value.id
      })
    }

    function editQuantityLine(row) {
      store.dispatch('updateLineRMA', {
        id: row.id,
        quantity: row.quantity,
        posId: currentPointOfSales.value.id
      })
        .finally(() => {
          row.isEditLine = !row.isEditLine
        })
    }

    function process() {
      store.dispatch('processRma')
    }

    function editLine(row, column, cell) {
      if (column.columnKey === 'QtyEntered') {
        row.isEditLine = !row.isEditLine
      }
    }

    return {
      // Import
      formatDate,
      formatPrice,
      formatQuantity,
      // Ref
      loading,
      isEditQuantity,
      searchProduct,
      // Computed
      currentPointOfSales,
      orderLineDefinition,
      currentOrderReturn,
      itemQuantity,
      currentOrder,
      listProduct,
      isMobile,
      // Methods
      close,
      loadARM,
      process,
      addLine,
      editLine,
      deleteLine,
      displayLabel,
      displayValue,
      sizeTableColumn,
      editQuantityLine,
      // selectLine,
      listReturnProduct
    }
  }
})
</script>

<style lang="scss" scoped>
.return-product {
  padding: 0px;
  width: 100%;
  height: -webkit-fill-available;
  overflow-x: hidden;
}
.order-info {
  float: right;
}
.info-label {
  margin-bottom: 5px;
  padding-bottom: 5px;
}
.total-return-info {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}
</style>
<style lang="scss">
.el-dialog--center .el-dialog__body {
  text-align: initial;
  padding: 15px 16px;
}
</style>
