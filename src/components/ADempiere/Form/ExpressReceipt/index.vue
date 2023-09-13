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
  <div class="main-express-receipt">
    <el-card class="box-card" style="margin: 0px;">
      <div slot="header" class="clearfix-express-receipt">
        <el-form
          ref="form-express-receipt"
          label-position="top"
          class="field-from"
          inline
        >
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item class="front-item-receipt">
                <template slot="label" style="width: 450px;">
                  {{ $t('VBankStatementMatch.field.businessPartner') }}
                  <!-- <br>
                  <br> -->
                </template>
                <el-select
                  v-model="currentBusinessPartners"
                  placeholder="Please Select Business Partner"
                  style="width: 100%;"
                  filterable
                  class="select-from"
                  @visible-change="findBusinessPartners"
                >
                  <el-option
                    v-for="item in listBusinessPartners"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                    popper-class="select-from"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="front-item-receipt">
                <template slot="label" style="width: 450px;">
                  {{ $t('form.expressReceipt.field.salesOrder') }}
                  <!-- <br>
                  <br> -->
                </template>
                <el-select
                  v-model="salesOrder"
                  placeholder="Please Select Purchase Order"
                  style="width: 100%;"
                  filterable
                  clearable
                  class="select-from"
                  @visible-change="findSalesOrder"
                  @change="selectSalesOrder"
                >
                  <el-option
                    v-for="item in listOrder"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                    class="select-from"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="!isEmptyValue(salesOrder)" :span="8">
              <el-form-item
                class="front-item-receipt"
                style="width: 450px;"
              >
                <template slot="label" style="width: 450px;">
                  {{ $t('form.expressReceipt.field.productcode') }}
                  <!-- <p style="margin: 0px;">
                    <el-checkbox v-model="isQuantityFromOrderLine">
                      Cantidad Completa de la Linea
                    </el-checkbox>
                  </p> -->
                </template>
                <el-autocomplete
                  ref="searchValue"
                  v-model="findProduct"
                  :trigger-on-focus="false"
                  :select-when-unmatched="true"
                  :highlight-first-item="true"
                  :placeholder="$t('quickAccess.searchWithEnter')"
                  :fetch-suggestions="querySearchAsync"
                  style="width: 100%;"
                  :disabled="isComplete"
                  @focus="focusSuggestions"
                  @select="handleSelect"
                >
                  <template slot="prefix">
                    <svg-icon
                      icon-class="shopping"
                      class="el-input__icon"
                    />
                  </template>

                  <template slot-scope="props">
                    <div class="header" style="margin: 0px;">
                      <b> {{ props.item.value }} - {{ props.item.name }} </b>
                    </div>
                  </template>
                </el-autocomplete>
                <el-checkbox v-model="isQuantityFromOrderLine" class="add-qauntity">
                  {{ $t('form.expressReceipt.field.isQuantityFromOrderLine') }}
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card v-if="!isEmptyValue(salesOrder)" class="box-card">
      <el-table
        ref="listProducto"
        v-loading="isLoadedServer"
        :data="productdeliveryList"
        :empty-text="$t('quickAccess.searchWithEnter')"
        :border="true"
        fit
        highlight-current-row
        style="min-height: 400px;"
        class="table-form"
        @cell-click="editQuantity"
      >
        <el-table-column
          prop="product.value"
          :label="$t('form.productInfo.code')"
        />
        <el-table-column
          prop="product.name"
          :label="$t('form.pos.tableProduct.product')"
        />
        <el-table-column
          prop="quantity"
          :label="$t('form.pos.tableProduct.quantity')"
          :align="'right'"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isEditQuantity && isEditQuantity">
              <el-input-number
                ref="editQuantityField"
                v-model="scope.row.quantity"
                controls-position="right"
                :min="1"
                @change="updateShipmentLine(scope.row)"
              />
            </span>
            <span v-else>
              {{ scope.row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('form.pos.tableProduct.options')"
          column-key="value"
          width="160"
        >
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteShipmentLine(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- Action Panel Footer -->
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary"
            icon="el-icon-check"
            class="button-base-icon"
            style="float: right; margin-top: 10px;font-size: 28px;"
            :disabled="isEmptyValue(salesOrder) || isComplete"
            @click="visible = true"
          />
          <el-button
            type="danger"
            icon="el-icon-close"
            style="float: right; margin-top: 10px;font-size: 28px;"
            class="button-base-icon"
            @click="closeForm"
          />
          <el-button
            type="info"
            plain
            style="float: right; margin-top: 10px;font-size: 28px;"
            class="button-base-icon"
            @click="clearForm"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            style="float: right; margin-top: 10px;font-size: 28px;"
            @click="refreshLine"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      :title="$t('form.expressReceipt.title')"
      :visible.sync="visible"
    >
      <p class="total">
        {{ $t('form.expressReceipt.modal.nrOrder') }}:
        <b class="order-info">
          {{ currentOrder.document_no }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.expressReceipt.modal.nrShipments') }}:
        <b class="order-info">
          {{ currentShipment.documentNo }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.itemQuantity') }}:
        <b v-if="!isEmptyValue(productdeliveryList)" class="order-info">
          {{ quantityProduct }}
        </b>
        <b v-else>
          {{ 0 }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.numberLines') }}:
        <b class="order-info">
          {{ productdeliveryList.length }}
        </b>
      </p>
      <!-- <div slot="footer"> -->
      <el-button
        type="primary"
        icon="el-icon-check"
        class="button-base-icon"
        style="float: right; margin: 10px;"
        :disabled="isEmptyValue(salesOrder)"
        @click="processShipment"
      />
      <el-button
        type="danger"
        icon="el-icon-close"
        style="float: right;margin-top: 10px;"
        class="button-base-icon"
        @click="visible = false"
      />
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'
import router from '@/router'

// Api Request Methods
import {
  listOrders,
  listBusinessPartnersReceipt
  // Shipment
} from '@/api/ADempiere/form/ExpressReceipt.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'ExpressShipment',

  setup(props, { root, refs }) {
    /**
   * Ref
   */
    const editQuantityField = ref(null)
    const timeOut = ref(null)
    const currentBusinessPartners = ref('')
    const findProduct = ref('')
    const salesOrder = ref('')
    const quantity = ref(0)
    const isQuantityFromOrderLine = ref(false)
    const isLoadedServer = ref(false)
    const isEditQuantity = ref(false)
    const isLoadingLine = ref(false)
    const visible = ref(false)
    const listBusinessPartners = ref([])
    const listOrder = ref([])
    /**
     * Computed
     */
    const listProdcut = computed(() => {
      return store.getters.getListProductReceipt
    })
    const productdeliveryList = computed(() => {
      return store.getters.getListReceipt
    })
    const currentShipment = computed(() => {
      return store.getters.getCurrentReceipt
    })
    const isComplete = computed(() => {
      const { isCompleted } = store.getters.getCurrentReceipt
      if (!isEmptyValue(store.getters.getCurrentReceipt)) {
        return isCompleted
      }
      return false
    })
    const quantityProduct = computed(() => {
      if (isEmptyValue(productdeliveryList)) return 0

      const result = productdeliveryList.value.map(line => {
        return line.quantity
      })

      if (!isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    })
    const currentOrder = computed(() => {
      if (isEmptyValue(listOrder.value) || isEmptyValue(salesOrder.value)) {
        return {
          document_no: ''
        }
      }
      return listOrder.value.find(order => salesOrder.value === order.id)
    })
    /**
     * Methods
     */
    function findSalesOrder(isFindOrder) {
      if (!isFindOrder) return
      listOrders({
        searchValue: salesOrder.value,
        businessPartnerId: currentBusinessPartners.value
      })
        .then(response => {
          const { records } = response
          listOrder.value = records.map(order => {
            const { id, uuid, document_no, date_ordered } = order
            return {
              id,
              label: document_no + '_' + dateTimeFormats(date_ordered, 'YYYY-MM-DD \ HH:MM:SS'),
              document_no,
              uuid
            }
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    function findBusinessPartners(isFindOrder) {
      if (!isFindOrder) return
      listBusinessPartnersReceipt({
        searchValue: currentBusinessPartners.value
      })
        .then(response => {
          const { records } = response
          listBusinessPartners.value = records.map(order => {
            const { id, uuid, document_no, name } = order
            return {
              id,
              label: name,
              document_no,
              uuid
            }
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    function selectSalesOrder(order) {
      store.dispatch('createReceipt', {
        id: order
      })
      if (!isEmptyValue(refs.searchValue)) {
        refs.searchValue.suggestions = []
      }
      store.commit('setListProductReceipt', [])
      findProduct.value = null
    }

    function querySearchAsync(queryString, callBack) {
      let results = listProdcut.value.filter(createFilter(queryString))
      if (isEmptyValue(results)) {
        store.dispatch('findListProductReceipt', {
          searchValue: queryString,
          receiptId: salesOrder.value
        })
          .then(response => {
            results = response
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: lang.t('form.pos.optionsPoinSales.salesOrder.emptyProductDelivery')
            })
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      }
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        const suggestionOpen = results.length
        if (queryString.length < 4 && suggestionOpen > 1) {
          // not show list
          callBack(results)
          return
        }

        if (suggestionOpen <= 1) {
          handleSelect(results[0])
          refs.searchValue.activated = false
          callBack(results)
          return
        }
        callBack(results)
      }, 500)
    }

    function createFilter(queryString) {
      return (link) => {
        const search = queryString.toLowerCase()
        return link.value.toLowerCase().includes(search) || link.name.toLowerCase().includes(search) || link.upc.toLowerCase().includes(search)
      }
    }

    function handleSelect(product) {
      if (typeof product === 'object' && !isEmptyValue(product.id)) {
        // if (!isEmptyValue(productdeliveryList.value)) {
        const isProductExists = productdeliveryList.value.find(list => list.product.value === product.value)
        if (isEmptyValue(isProductExists)) {
          createShipmentLine(product)
          findProduct.value = null
          return
        }
        const { id, uuid, quantity } = isProductExists
        updateShipmentLine({
          id,
          uuid,
          quantity: quantity + 1
        })
        findProduct.value = null
        // }
      }
    }

    function editQuantity(row) {
      isEditQuantity.value = !row.isEditQuantity
      const list = productdeliveryList.value.filter(line => line.id !== row.id)
      list.forEach(element => {
        element.isEditQuantity = false
      })
      row.isEditQuantity = true
      quantity.value = row.quantity
      setTimeout(() => {
        if (!isEmptyValue(editQuantityField.value)) {
          editQuantityField.value.focus()
        }
      }, 500)
    }
    /**
     * Shipment Line
     */
    function createShipmentLine(product) {
      store.dispatch('createLineReceipt', {
        receiptId: 0,
        productId: product.id,
        productUuid: product.uuid,
        isQuantityFromOrderLine: isQuantityFromOrderLine.value
      })
    }

    function updateShipmentLine({
      id,
      uuid,
      quantity
    }) {
      isEditQuantity.value = false
      store.dispatch('updateLineReceipt', {
        id,
        uuid,
        quantity
      })
    }

    function deleteShipmentLine(line) {
      const { id, uuid } = line
      store.dispatch('deleteLineReceipt', {
        id,
        uuid,
        shipmentId: currentShipment.value.id
      })
    }
    /**
     * Action Panel Footer
     */
    function closeForm() {
      const currentRoute = router.app._route
      const tabViewsVisited = store.getters.visitedViews
      store.dispatch('tagsView/delView', currentRoute)
      const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
      router.push({
        path: oldRouter.path
      }, () => {})
    }

    function clearForm(params) {
      salesOrder.value = ''
      findProduct.value = ''
    }

    function processShipment() {
      if (isEmptyValue(salesOrder.value)) return
      store.dispatch('processReceipt')
      visible.value = false
    }

    function refreshLine() {
      const { id, uuid } = store.getters.getCurrentReceipt
      store.dispatch('listLineReceipt', {
        receiptId: id,
        receiptUuid: uuid
      })
    }

    function focusSuggestions(params) {
      if (refs.searchValue.suggestions.length <= 1) {
        refs.searchValue.suggestions = []
        return
      }
    }
    /**
   * Watch
   */
    watch(salesOrder, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        findSalesOrder(true)
      }
    })

    return {
      editQuantityField,
      salesOrder,
      listOrder,
      currentBusinessPartners,
      listBusinessPartners,
      findProduct,
      productdeliveryList,
      isLoadedServer,
      isEditQuantity,
      quantity,
      isComplete,
      currentOrder,
      currentShipment,
      quantityProduct,
      visible,
      isQuantityFromOrderLine,
      isLoadingLine,
      // Methods
      findSalesOrder,
      findBusinessPartners,
      selectSalesOrder,
      handleSelect,
      createFilter,
      querySearchAsync,
      editQuantity,
      // Shipment Line
      createShipmentLine,
      updateShipmentLine,
      deleteShipmentLine,
      // Action Panel Footer
      processShipment,
      closeForm,
      clearForm,
      refreshLine,
      focusSuggestions
    }
  }
})
</script>

<style scoped lang="scss">
.el-form-item--medium .el-form-item__label {
  width: 450px;
}

.front-item-receipt {
  width: 100%;
}
.custom-field-number {
  &.el-input-number, &.el-input {
    .el-input__inner {
      text-align-last: end !important;
    }
  }
}
</style>
<style lang="scss">
.field-from {
  .el-form-item--medium .el-form-item__label {
    line-height: 36px;
    width: 450px;
    font-size: 18px;
  }
}
.select-from {
  .el-select-dropdown__item {
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 18px;
  }
}
.table-form {
  .el-table__header-wrapper {
    font-size: 18px;
    line-height: 22px;
  }
}
.add-qauntity {
  .el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 16px;
  }
}
</style>

