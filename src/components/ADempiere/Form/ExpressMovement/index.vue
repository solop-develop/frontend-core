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
    <el-card class="box-card">
      <div slot="header" class="clearfix-express-receipt">
        <el-form ref="form-express-receipt" class="field-from" inline label-position="top">
          <el-row :gutter="20">
            <el-col v-if="!isEmptyValue(currentMovement)" :span="3">
              <el-form-item class="front-item-receipt">
                <template slot="label" style="width: 450px;">
                  {{ $t('form.expressMovement.field.documentNo') }}
                </template>
                <b>
                  <el-tag style="width: 100%;font-size: 16px;">
                    <i class="el-icon-tickets" />
                    {{ currentMovement.documentNo }}
                  </el-tag>
                </b>
              </el-form-item>
            </el-col>
            <el-col v-if="!isEmptyValue(currentMovement)" :span="3">
              <el-form-item
                :label="$t('form.expressMovement.field.dateMoviment')"
                class="front-item-receipt"
              >
                <b>
                  <el-tag style="width: 100%;font-size: 15px;">
                    <i class="el-icon-date" />
                    {{ dateTimeFormats(currentMovement.movementDate, 'YYYY-MM-DD \ HH:MM:SS') }}
                  </el-tag>
                </b>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                :label="$t('form.expressMovement.field.warehouse')"
                class="front-item-receipt"
              >
                <el-select
                  v-model="warehouseBase"
                  placeholder="Please Select Warehouse Base"
                  style="width: 100%;"
                  filterable
                  @visible-change="listBaseWarehouse"
                >
                  <el-option
                    v-for="item in baseWarehouseOptionsList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                class="front-item-receipt"
              >
                <template slot="label" style="width: 450px;">
                  {{ $t('form.expressMovement.field.warehouseTo') }}
                </template>
                <el-select
                  v-model="warehouseDestination"
                  placeholder="Please Select Warehouse Destination"
                  style="width: 100%;"
                  filterable
                  @visible-change="listDestinationWarehouse"
                >
                  <el-option
                    v-for="item in destinationWarehouseOptionsList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                v-if="!isEmptyValue(warehouseBase) && !isEmptyValue(warehouseDestination)"
                :label="$t('form.expressMovement.field.productcode')"
                class="front-item-receipt"
              >
                <el-autocomplete
                  ref="searchValue"
                  v-model="findProduct"
                  :trigger-on-focus="false"
                  :select-when-unmatched="true"
                  :highlight-first-item="true"
                  :placeholder="$t('quickAccess.searchWithEnter')"
                  :fetch-suggestions="querySearchAsync"
                  :disabled="isComplete"
                  style="width: 100%;"
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
                    <div class="header" style="margin: 0px">
                      <b> {{ props.item.value }} - {{ props.item.name }} </b>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card v-if="!isEmptyValue(currentMovement)" class="box-card">
      <el-table
        ref="listProducto"
        :data="listMovementLines"
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
                @change="updateMovementLine(scope.row)"
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
          :align="'center'"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="isEmptyValue(currentMovement) || isComplete"
              @click="deleteMovementLine(scope.row)"
            />
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
            :disabled="isEmptyValue(currentMovement) || isComplete"
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
      :title="$t('form.expressMovement.title')"
      :visible.sync="visible"
    >
      <p class="total">
        {{ $t('form.expressMovement.field.documentNo') }}:
        <b class="order-info">
          {{ currentMovement.documentNo }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.itemQuantity') }}:
        <b v-if="!isEmptyValue(listMovementLines)" class="order-info">
          {{ quantityProduct }}
        </b>
        <b v-else>
          {{ 0 }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.numberLines') }}:
        <b class="order-info">
          {{ listMovementLines.length }}
        </b>
      </p>
      <!-- <div slot="footer"> -->
      <el-button
        type="primary"
        icon="el-icon-check"
        class="button-base-icon"
        style="float: right; margin: 10px;"
        :disabled="isEmptyValue(currentMovement)"
        @click="processMovement"
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
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'
import router from '@/router'

// Api Request Methods
import {
  listWarehouses
  // Shipment
} from '@/api/ADempiere/form/expresMovement.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'ExpressMovement',

  setup(props, { root, refs }) {
    /**
     * Ref
     */
    const destinationWarehouseOptionsList = ref([])
    const baseWarehouseOptionsList = ref([])
    const warehouseDestination = ref('')
    const editQuantityField = ref(null)
    const isEditQuantity = ref(false)
    const warehouseBase = ref('')
    const findProduct = ref('')
    const visible = ref(false)
    const timeOut = ref(null)
    const quantity = ref(0)
    /**
     * Computed
     */
    const listProdcut = computed(() => {
      return store.getters.getListProduct
    })
    const listMovementLines = computed(() => {
      return store.getters.getListMovementLines
    })
    const currentMovement = computed(() => {
      return store.getters.getCurrentMovement
    })
    const isComplete = computed(() => {
      const { isCompleted } = store.getters.getCurrentMovement
      if (!isEmptyValue(store.getters.getCurrentMovement)) {
        return isCompleted
      }
      return false
    })
    const quantityProduct = computed(() => {
      if (isEmptyValue(listMovementLines)) return 0

      const result = listMovementLines.value.map(line => {
        return line.quantity
      })

      if (!isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    })
    /**
     * Methods
     */

    function listBaseWarehouse(isFind) {
      if (!isFind) return
      listWarehouses({
        searchValue: warehouseBase.value
      })
        .then(response => {
          const { records } = response
          let list = records
          if (!isEmptyValue(warehouseDestination.value)) {
            list = records.filter(warehouse => warehouse.id !== warehouseDestination.value)
          }
          baseWarehouseOptionsList.value = list.map(warehouse => {
            const { id, uuid, document_no, name } = warehouse
            return {
              id,
              label: name,
              document_no,
              uuid
            }
          })
        })
    }

    function listDestinationWarehouse(isFind) {
      if (!isFind) return
      listWarehouses({
        searchValue: warehouseDestination.value
      })
        .then(response => {
          const { records } = response
          let list = records
          if (!isEmptyValue(warehouseBase.value)) {
            list = records.filter(warehouse => warehouse.id !== warehouseBase.value)
          }
          destinationWarehouseOptionsList.value = list.map(warehouse => {
            const { id, uuid, document_no, name } = warehouse
            return {
              id,
              label: name,
              document_no,
              uuid
            }
          })
        })
    }

    function querySearchAsync(queryString, callBack) {
      let results = listProdcut.value.filter(createFilter(queryString))
      if (isEmptyValue(results)) {
        store.dispatch('findListProductWarehouses', {
          searchValue: queryString
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
        // if (!isEmptyValue(listMovementLines.value)) {
        const isProductExists = listMovementLines.value.find(list => list.product.value === product.value)
        if (isEmptyValue(isProductExists)) {
          createMovementLine(product)
          findProduct.value = null
          return
        }
        const getCurrentMovement = store.getters.getCurrentMovement
        if (isEmptyValue(getCurrentMovement)) {
          createMovementLine(product)
        }
        const { id, uuid, quantity } = isProductExists
        updateMovementLine({
          id,
          uuid,
          quantity: quantity + 1
        })
        findProduct.value = null
        // }
      }
    }

    /**
     * Action the Table
     */

    function editQuantity(row) {
      if (isComplete.value) return
      isEditQuantity.value = !row.isEditQuantity
      const list = listMovementLines.value.filter(line => line.id !== row.id)
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

    function deleteMovementLine(line) {
      const { id, uuid } = line
      store.dispatch('deleteMovementLine', {
        id,
        uuid
      })
    }

    /**
     *  Line
     */
    function createMovementLine(product) {
      const getCurrentMovement = store.getters.getCurrentMovement
      if (isEmptyValue(getCurrentMovement)) {
        store.dispatch('createMovement', {})
          .then(response => {
            store.dispatch('createLineMovement', {
              productId: product.id,
              productUuid: product.uuid,
              warehouseId: warehouseBase.value,
              warehouseToId: warehouseDestination.value
            })
          })
      }
      store.dispatch('createLineMovement', {
        productId: product.id,
        productUuid: product.uuid,
        warehouseId: warehouseBase.value,
        warehouseToId: warehouseDestination.value
      })
    }

    function updateMovementLine({
      id,
      uuid,
      quantity
    }) {
      isEditQuantity.value = false
      store.dispatch('updateMovementLine', {
        id,
        uuid,
        quantity
      })
    }

    /**
     * Action Panel Footer
     */

    /**
     * Watch
     */

    function closeForm() {
      const currentRoute = router.app._route
      const tabViewsVisited = store.getters.visitedViews
      store.dispatch('tagsView/delView', currentRoute)
      const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
      router.push({
        path: oldRouter.path
      }, () => {})
      store.commit('setCurrentMovement', {})
    }

    function clearForm(params) {
      warehouseDestination.value = ''
      warehouseBase.value = ''
      store.commit('setCurrentMovement', {})
    }

    function processMovement() {
      if (isEmptyValue(listMovementLines.value)) return
      store.dispatch('processMovement')
      visible.value = false
    }

    function refreshLine() {
      store.dispatch('listLineMovement')
    }

    function focusSuggestions(params) {
      if (refs.searchValue.suggestions.length <= 1) {
        refs.searchValue.suggestions = []
        return
      }
    }

    return {
      destinationWarehouseOptionsList,
      baseWarehouseOptionsList,
      warehouseDestination,
      editQuantityField,
      isEditQuantity,
      warehouseBase,
      findProduct,
      quantity,
      visible,
      // Computed
      listMovementLines,
      currentMovement,
      quantityProduct,
      listProdcut,
      isComplete,
      // Methods
      dateTimeFormats,
      listDestinationWarehouse,
      listBaseWarehouse,
      querySearchAsync,
      createFilter,
      handleSelect,
      focusSuggestions,
      // Action Table
      deleteMovementLine,
      editQuantity,
      // Line
      createMovementLine,
      updateMovementLine,
      // Action Panel Footer
      processMovement,
      refreshLine,
      clearForm,
      closeForm
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
</style>
