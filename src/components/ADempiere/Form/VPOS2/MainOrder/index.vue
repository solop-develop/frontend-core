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
    <el-table
      id="linesOrder"
      ref="linesTable"
      :data="lines"
      :border="true"
      height="60vh"
      fit
      highlight-current-row
      style="height: 100% !important;"
      @cell-click="editLine"
      @cell-dblclick="editLineExit"
      @current-change="handleCurrentChangeOrderLine"
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
            <edit-amount
              v-if="scope.row.isEditCurrentPrice && valueOrder.columnName === 'CurrentPrice'"
              :value="Number(scope.row.price.value)"
              :handle-change="updateCurrentPrice"
            />
            <edit-qty-entered
              v-else-if="scope.row.isEditQtyEntered && valueOrder.columnName === 'QtyEntered'"
              :qty="Number(scope.row.quantity_ordered.value)"
              :handle-change="updateQuantity"
            />
            <edit-amount
              v-else-if="scope.row.isEditDiscount && valueOrder.columnName === 'Discount'"
              :value="Number(scope.row.discount_rate.value)"
              :handle-change="updateDiscount"
              :precision="0"
            />
            <span v-else>
              {{ displayValue({ row: scope.row, columnName: valueOrder.columnName}) }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
        width="175"
      >
        <template slot-scope="scope">
          <option-line
            :line="scope.row"
          />
        </template>
      </el-table-column>
    </el-table>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// Components and Mixins
import OptionLine from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine'
import editQtyEntered from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/editQtyEntered.vue'
import editAmount from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/editAmount.vue'
// Utils and Helper Methods
import {
  displayLabel,
  displayValue,
  displayLineQtyEntered
} from '@/utils/ADempiere/dictionary/form/VPOS'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'infoOrder',
  components: {
    OptionLine,
    editAmount,
    editQtyEntered
  },
  setup() {
    const currentLine = ref({})
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

    const currentPos = computed(() => {
      return store.getters.getVPOS
    })

    function copyCode(value) {
      copyToClipboard({
        text: value.product.value,
        isShowMessage: true
      })
    }

    function handleCurrentChangeOrderLine(line) {
      store.commit('setCurrentLine', line)
      currentLine.value = line
    }

    function editLine(row, column, cell) {
      const { columnKey } = column
      // const {
      //   is_modify_price,
      //   is_allows_modify_quantity,
      //   is_allows_modify_discount
      // } = currentPos.value
      if (columnKey === 'CurrentPrice') row.isEditCurrentPrice = true
      if (columnKey === 'QtyEntered') row.isEditQtyEntered = true
      if (columnKey === 'Discount') row.isEditDiscount = true
    }

    function editLineExit(row, column, cell) {
      const { columnKey } = column
      if (columnKey === 'QtyEntered') row.isEditQtyEntered = false
      if (columnKey === 'CurrentPrice') row.isEditCurrentPrice = false
      if (columnKey === 'Discount') row.isEditDiscount = false
    }

    function updateCurrentPrice(price) {
      const { is_modify_price } = currentPos.value
      if (!is_modify_price) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.price'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              price
            })
              .then(() => {
                currentLine.value.isEditQtyEntered = false
              })
          },
          requestedAccess: 'IsModifyPrice',
          requestedAmount: price,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: currentLine.value.id,
        price
      })
        .then(() => {
          currentLine.value.isEditCurrentPrice = false
        })
    }
    function updateQuantity(quantity) {
      const { is_allows_modify_quantity } = currentPos.value
      if (!is_allows_modify_quantity) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.qtyEntered'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              quantity
            })
              .then(() => {
                currentLine.value.isEditQtyEntered = false
              })
          },
          requestedAccess: 'IsAllowsModifyQuantity',
          requestedAmount: quantity,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: currentLine.value.id,
        quantity
      })
        .then(() => {
          currentLine.value.isEditQtyEntered = false
        })
    }
    function updateDiscount(discount_rate) {
      const { is_allows_modify_discount } = currentPos.value
      if (!is_allows_modify_discount) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.qtyEntered'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              discount_rate
            })
              .then(() => {
                currentLine.value.isEditQtyEntered = false
              })
          },
          requestedAccess: 'IsAllowsModifyDiscount',
          requestedAmount: discount_rate,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: currentLine.value.id,
        discount_rate
      })
        .then(() => {
          currentLine.value.isEditDiscount = false
        })
    }

    return {
      currentPos,
      orderLineDefinition,
      currentLine,
      lines,
      // Methods
      handleCurrentChangeOrderLine,
      displayLabel,
      displayValue,
      editLineExit,
      updateQuantity,
      updateDiscount,
      updateCurrentPrice,
      displayLineQtyEntered,
      editLine,
      copyCode
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
