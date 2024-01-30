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
          :min-width="sizeTableColumn(valueOrder.columnName)"
          :align="valueOrder.isNumeric ? 'right' : 'left'"
        >
          <template slot-scope="scope">
            <el-button
              v-show="valueOrder.columnName === 'LineDescription'"
              type="text"
              icon="el-icon-document-copy"
              @click="copyCode(scope.row)"
            />
            <span
              v-if="scope.row.isEditCurrentPrice && valueOrder.columnName === 'CurrentPrice'"
            >
              <p
                v-if="isLoadingPrice"
                style="text-align: center;margin: 0px;"
              >
                <i
                  class="el-icon-loading"
                  style="font-size: 20px;"
                />
              </p>
              <edit-amount
                v-else-if="scope.row.isEditCurrentPrice && valueOrder.columnName === 'CurrentPrice'"
                :value="Number(scope.row.price)"
                :handle-change="updateCurrentPrice"
              />
            </span>
            <!-- <edit-amount
              v-if="scope.row.isEditCurrentPrice && valueOrder.columnName === 'CurrentPrice'"
              :value="Number(scope.row.price)"
              :handle-change="updateCurrentPrice"
            /> -->
            <span
              v-else-if="scope.row.isEditQtyEntered && valueOrder.columnName === 'QtyEntered'"
            >
              <p
                v-if="isLoadingQty"
                style="text-align: center;margin: 0px;"
              >
                <i
                  class="el-icon-loading"
                  style="font-size: 20px;"
                />
              </p>
              <edit-qty-entered
                v-else-if="scope.row.isEditQtyEntered && valueOrder.columnName === 'QtyEntered'"
                :qty="Number(scope.row.quantity_ordered)"
                :handle-change="updateQuantity"
              />
            </span>
            <span
              v-else-if="scope.row.isEditDiscount && valueOrder.columnName === 'Discount'"
            >
              <p
                v-if="isLoadingDiscount"
                style="text-align: center;margin: 0px;"
              >
                <i
                  class="el-icon-loading"
                  style="font-size: 20px;"
                />
              </p>
              <edit-amount
                v-else
                :value="Number(scope.row.discount_rate)"
                :handle-change="updateDiscount"
                :precision="0"
              />
            </span>
            <span v-else>
              {{ displayValue({ row: scope.row, columnName: valueOrder.columnName}) }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
        width="150"
        style="padding: 0px !important;"
      >
        <!-- <template slot-scope="scope"> -->
        <option-line
          slot-scope="scope"
          :line="scope.row"
        />
        <!-- </template> -->
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
  sizeTableColumn,
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
    const isLoadingDiscount = ref(false)
    const isLoadingQty = ref(false)
    const isLoadingPrice = ref(false)
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
      const {
        quantity_ordered
      } = currentLine.value
      if (!is_modify_price) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.price'),
          doneMethod: () => {
            isLoadingPrice.value = true
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              quantity: quantity_ordered,
              price
            })
              .then(updateLineResponse => {
                refreshLine(updateLineResponse)
                isLoadingPrice.value = false
                currentLine.value.isEditCurrentPrice = false
              })
              .catch(() => {
                isLoadingPrice.value = false
                currentLine.value.isEditCurrentPrice = true
              })
          },
          cancelMethod: () => {
            currentLine.value.isEditCurrentPrice = false
            isLoadingPrice.value = false
          },
          requestedAccess: 'IsModifyPrice',
          requestedAmount: price,
          isShowed: true
        })
        return
      }
      isLoadingPrice.value = true
      store.dispatch('updateCurrentLine', {
        lineId: currentLine.value.id,
        quantity: quantity_ordered,
        price
      })
        .then(updateLineResponse => {
          refreshLine(updateLineResponse)
          isLoadingPrice.value = false
          currentLine.value.isEditCurrentPrice = false
        })
        .catch(() => {
          isLoadingPrice.value = false
          currentLine.value.isEditCurrentPrice = true
        })
    }
    function updateQuantity(quantity) {
      const { is_allows_modify_quantity } = currentPos.value
      if (!is_allows_modify_quantity) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.qtyEntered'),
          doneMethod: () => {
            isLoadingQty.value = true
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              quantity
            })
              .then(updateLineResponse => {
                refreshLine(updateLineResponse)
                isLoadingQty.value = false
                currentLine.value.isEditQtyEntered = false
              })
              .catch(() => {
                isLoadingQty.value = false
                currentLine.value.isEditQtyEntered = true
              })
          },
          cancelMethod: () => {
            currentLine.value.isEditQtyEntered = false
            isLoadingQty.value = false
          },
          requestedAccess: 'IsAllowsModifyQuantity',
          requestedAmount: quantity,
          isShowed: true
        })
        return
      }
      isLoadingQty.value = true
      store.dispatch('updateCurrentLine', {
        lineId: currentLine.value.id,
        quantity
      })
        .then(updateLineResponse => {
          refreshLine(updateLineResponse)
          isLoadingQty.value = false
          currentLine.value.isEditQtyEntered = false
        })
        .catch(() => {
          isLoadingQty.value = false
          currentLine.value.isEditQtyEntered = true
        })
    }
    function updateDiscount(discount_rate) {
      const { is_allows_modify_discount, maximum_line_discount_allowed } = currentPos.value
      const {
        quantity_ordered
      } = currentLine.value
      isLoadingDiscount.value = true
      if (!is_allows_modify_discount || (Number(maximum_line_discount_allowed) !== 0 && discount_rate > Number(maximum_line_discount_allowed))) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.qtyEntered'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              discount_rate,
              quantity: quantity_ordered
            })
              .then(updateLineResponse => {
                refreshLine(updateLineResponse)
                currentLine.value.isEditDiscount = false
                isLoadingDiscount.value = false
              })
              .catch(() => {
                currentLine.value.isEditDiscount = false
                isLoadingDiscount.value = false
              })
          },
          cancelMethod: () => {
            currentLine.value.isEditDiscount = false
            isLoadingDiscount.value = false
          },
          requestedAccess: 'IsAllowsModifyDiscount',
          requestedAmount: discount_rate,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: currentLine.value.id,
        discount_rate,
        quantity: quantity_ordered
      })
        .then(updateLineResponse => {
          refreshLine(updateLineResponse)
          currentLine.value.isEditDiscount = false
          isLoadingDiscount.value = false
        })
        .catch(() => {
          currentLine.value.isEditDiscount = false
          isLoadingDiscount.value = false
        })
    }

    function refreshLine(line) {
      currentLine.value.available_quantity = line.line.available_quantity
      currentLine.value.base_tax_amoun = line.base_tax_amoun
      currentLine.value.charge = line.charge
      currentLine.value.description = line.description
      currentLine.value.discount_amount = line.discount_amount
      currentLine.value.discount_rate = line.discount_rate
      currentLine.value.id = line.id
      currentLine.value.line = line.line
      currentLine.value.line_description = line.line_description
      currentLine.value.list_tax_amount = line.list_tax_amount
      currentLine.value.order_id = line.order_id
      currentLine.value.price = line.price
      currentLine.value.price_base = line.price_base
      currentLine.value.price_base_with_tax = line.price_base_with_tax
      currentLine.value.price_list = line.price_list
      currentLine.value.price_list_with_tax = line.price_list_with_tax
      currentLine.value.price_with_tax = line.price_with_tax
      currentLine.value.product = line.product
      currentLine.value.product_uom = line.product_uom
      currentLine.value.quantity = line.quantity
      currentLine.value.quantity_ordered = line.quantity_ordered
      currentLine.value.resource_assignment = line.resource_assignment
      currentLine.value.source_rma_line_id = line.source_rma_line_id
      currentLine.value.tax_amount = line.tax_amount
      currentLine.value.tax_rate = line.tax_rate
      currentLine.value.total_amount = line.total_amount
      currentLine.value.total_amount_converted = line.total_amount_converted
      currentLine.value.total_amount_with_tax = line.total_amount_with_tax
      currentLine.value.total_amount_with_tax_converted = line.total_amount_with_tax_converted
      currentLine.value.total_base_amount = line.total_base_amount
      currentLine.value.total_base_amount_with_tax = line.total_base_amount_with_tax
      currentLine.value.total_discount_amount = line.total_discount_amount
      currentLine.value.total_tax_amount = line.total_tax_amount
    }

    return {
      currentPos,
      orderLineDefinition,
      isLoadingDiscount,
      isLoadingPrice,
      isLoadingQty,
      currentLine,
      lines,
      // Methods
      handleCurrentChangeOrderLine,
      displayLabel,
      displayValue,
      editLineExit,
      updateQuantity,
      updateDiscount,
      sizeTableColumn,
      updateCurrentPrice,
      displayLineQtyEntered,
      editLine,
      copyCode
    }
  }
})
</script>

<style lang="scss">
.el-table .cell {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
