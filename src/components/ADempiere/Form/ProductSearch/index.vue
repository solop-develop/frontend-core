<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div
    class="product-list-content"
  >
    <el-form
      label-position="top"
      label-width="10px"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item :label="$t('form.productInfo.codeProduct')">
        <el-input
          v-model="searchValue"
          :placeholder="$t('quickAccess.searchWithEnter')"
          clearable
          @input="searchProduct"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="isLoading"
      :data="listProducto"
      :empty-text="$t('quickAccess.searchWithEnter')"
      highlight-current-row
      :border="true"
      :height="height"
      fit
      @current-change="addProduct"
    >
      <index-column
        :page-number="1"
        :page-size="50"
      />
      <el-table-column
        :label="$t('form.productInfo.code')"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-document-copy"
            @click="copyCode(scope.row)"
          />
          {{ scope.row.value }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('form.productInfo.name')"
        header-align="center"
        min-width="120"
      />
      <el-table-column
        prop="standard_price"
        :label="$t('field.product.standardPrice')"
        header-align="center"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.standard_price }) }}
        </span>
      </el-table-column>
      <el-table-column
        prop="uom"
        :label="$t('field.product.uom')"
        header-align="center"
      />
      <el-table-column
        prop="quantity_on_hand"
        :label="$t('form.productInfo.quantityOnHand')"
        header-align="center"
        align="right"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: Number(scope.row.quantity_on_hand) }) }}
        </span>
      </el-table-column>
    </el-table>

    <p>
      <custom-pagination
        style="float: right;"
        :total-records="recordCount"
        :selection="selection"
        :page-number="pageToken"
        :page-size="listProducto.length"
        :handle-change-page-number="handleChangePage"
        :handle-change-page-size="handleSizeChange"
      />
    </p>

    <el-dialog
      :visible.sync="isDetail"
      :center="true"
      :modal="false"
      :custom-class="'product-search-details'"
      width="81%"
      :title="isEmptyValue(currentLine) ? '' :currentLine.name"
    >
      <span v-if="!isEmptyValue(currentLine)">
        <p>
          <b style="float: left">
            {{ $t('form.productInfo.code') }}
          </b>
          <span style="float: right">
            {{ currentLine.value }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('field.product.productCategory') }}
          </b>
          <span style="float: right">
            {{ currentLine.product_category }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('field.product.productGroup') }}
          </b>
          <span style="float: right">
            {{ currentLine.product_group }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('field.product.upc') }}
          </b>
          <span style="float: right">
            {{ currentLine.upc }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('form.productInfo.quantityOnHand') }}
          </b>
          <span style="float: right">
            {{ currentLine.quantity_on_hand }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('field.product.uom') }}
          </b>
          <span style="float: right">
            {{ currentLine.uom }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('field.product.standardPrice') }}
          </b>
          <span style="float: right">
            {{ currentLine.standard_price }}
          </span>
        </p>
        <br>
      </span>
      <el-divider />
      <span v-if="!isEmptyValue(currentLine)">
        <el-tabs
          v-model="activeName"
          type="border-card"
          @tab-click="selectTabs"
        >
          <el-tab-pane :label="$t('field.product.warehouseStocks')" name="warehouseStocks">
            <el-table
              :data="listWarehouseStocks"
              border
              height="300"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                header-align="center"
                :label="$t('field.product.wrehouseTables.name')"
              />
              <el-table-column
                prop="available_quantity"
                header-align="center"
                :label="$t('field.product.wrehouseTables.availableQuantity')"
              />
              <el-table-column
                prop="on_hand_quantity"
                header-align="center"
                :label="$t('field.product.wrehouseTables.reservedQuantity')"
              />
              <el-table-column
                prop="reserved_quantity"
                header-align="center"
                :label="$t('field.product.wrehouseTables.orderedQuantity')"
              />
              <el-table-column
                prop="ordered_quantity"
                header-align="center"
                :label="$t('field.product.wrehouseTables.onHandQuantity')"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('field.product.substitute')" name="substitute">
            <el-table
              :data="listSubstituteProducts"
              border
              height="300"
              style="width: 100%"
            >
              <el-table-column
                prop="value"
                header-align="center"
                :label="$t('field.product.substituteTables.value')"
              />
              <el-table-column
                prop="name"
                header-align="center"
                :label="$t('field.product.substituteTables.name')"
              />
              <el-table-column
                prop="warehouse"
                header-align="center"
                :label="$t('field.product.substituteTables.warehouse')"
              />
              <el-table-column
                prop="available_quantity"
                header-align="center"
                :label="$t('field.product.substituteTables.availableQuantity')"
              />
              <el-table-column
                prop="reserved_quantity"
                header-align="center"
                :label="$t('field.product.substituteTables.reservedQuantity')"
              />
              <el-table-column
                prop="on_hand_quantity"
                header-align="center"
                :label="$t('field.product.substituteTables.onHandQuantity')"
              />
              <el-table-column
                prop="standard_price"
                header-align="center"
                :label="$t('field.product.substituteTables.standardPrice')"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('field.product.relateds')" name="relateds">
            <el-table
              :data="listRelatedsProducts"
              border
              height="300"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                header-align="center"
                :label="$t('field.product.relatedsTables.value')"
              />
              <el-table-column
                prop="name"
                header-align="center"
                :label="$t('field.product.relatedsTables.name')"
              />
              <el-table-column
                prop="warehouse"
                header-align="center"
                :label="$t('field.product.relatedsTables.warehouse')"
              />
              <el-table-column
                prop="available_quantity"
                header-align="center"
                :label="$t('field.product.relatedsTables.availableQuantity')"
              />
              <el-table-column
                prop="reserved_quantity"
                header-align="center"
                :label="$t('field.product.relatedsTables.reservedQuantity')"
              />
              <el-table-column
                prop="on_hand_quantity"
                header-align="center"
                :label="$t('field.product.relatedsTables.onHandQuantity')"
              />
              <el-table-column
                prop="standard_price"
                header-align="center"
                :label="$t('field.product.relatedsTables.standardPrice')"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('field.product.availableToPromises')" name="availableToPromises">
            <el-table
              :data="listAvailableToPromise"
              border
              height="300"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.value')"
              />
              <el-table-column
                prop="locator"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.locator')"
              />
              <el-table-column
                prop="available_quantity"
                :label="$t('field.product.availableToPromisesTables.availableQuantity')"
              />
              <el-table-column
                prop="on_hand_quantity"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.onHandQuantity')"
              />
              <el-table-column
                prop="expected_change_quantity"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.expectedChangeQuantity')"
                width="220"
              />
              <el-table-column
                prop="business_partner"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.businessPartner')"
              />
              <el-table-column
                prop="reserved_quantity"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.reservedQuantity')"
              />
              <el-table-column
                prop="document_no"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.documentNo')"
              />
              <el-table-column
                prop="attribute_set_instance"
                header-align="center"
                :label="$t('field.product.availableToPromisesTables.attributeSetInstance')"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('field.product.vendorPurchases')" name="vendorPurchases">
            <el-table
              :data="listVendorPurchase"
              border
              height="300"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                header-align="center"
                :label="$t('field.product.vendorPurchasesTables.name')"
              />
              <el-table-column
                prop="is_current_vendor"
                header-align="center"
                :label="$t('field.product.vendorPurchasesTables.isCurrentVendor')"
              />
              <el-table-column
                prop="unit_of_measure"
                header-align="center"
                :label="$t('field.product.vendorPurchasesTables.uom')"
              />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </span>
      <loading-view
        v-else
        key="browser-loading"
      />
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

// API Request Methods
import {
  requestListProducts,
  requestListWarehouseStocks,
  requestListSubstituteProducts,
  requestListRelatedProducts,
  requestListAvailableToPromises,
  requestListVendorPurchases
} from '@/api/ADempiere/field/search/product.ts'

export default defineComponent({
  name: 'ProductSearch',

  components: {
    IndexColumn,
    LoadingView,
    CustomPagination
  },

  props: {
    height: {
      type: String,
      default: '65vh'
    }
  },

  setup() {
    /**
     * Ref
     */
    const searchValue = ref('')
    const isDetail = ref(false)
    const isLoading = ref(false)
    const pageSizeNumber = ref(15)
    const currentLine = ref({})
    const selection = ref(0)
    const selectProduct = ref({})
    const listStockProduct = ref([])
    const activeName = ref('warehouseStocks')
    const recordCount = ref(0)
    const pageToken = ref('')
    const listWarehouseStocks = ref([])
    const listSubstituteProducts = ref([])
    const listRelatedsProducts = ref([])
    const listVendorPurchase = ref([])
    const listAvailableToPromise = ref([])
    const isLoadingWarehouse = ref(false)
    const isLoadingSubstitute = ref(false)
    const isLoadingRelateds = ref(false)
    const isLoadingVendor = ref(false)
    const isLoadingvailable = ref(false)

    let timeoutSearch

    /**
     * Computed
     */

    const isShowDialogo = computed(() => {
      return isDetail.value && !isEmptyValue(currentLine.value)
    })

    const listProducto = computed(() => {
      return store.getters.getProductList.map(list => {
        return {
          ...list,
          quantity_on_hand: formatQuantity({ value: Number(list.quantity_on_hand) })
        }
      })
    })

    // Methods
    function copyCode(row) {
      copyToClipboard({
        text: row.product.value,
        isShowMessage: true
      })
    }

    function searchProduct(search) {
      clearTimeout(timeoutSearch)
      isLoading.value = true
      timeoutSearch = setTimeout(() => {
        requestListProducts({
          tableName: 'M_Product',
          columnName: 'M_Product_ID',
          // Query
          searchValue: search,
          pageSize: pageSizeNumber.value
        })
          .then(response => {
            const { records, record_count, next_page_token } = response
            pageToken.value = next_page_token
            recordCount.value = Number(record_count)
            store.commit('setProductList', records)
          })
          .finally(() => {
            isLoading.value = false
          })
      }, 1000)
    }

    function addProduct(row) {
      isDetail.value = true
      currentLine.value = row
    }

    function warehouseStocks() {
      isLoadingWarehouse.value = true
      requestListWarehouseStocks({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          listWarehouseStocks.value = records
        })
        .finally(() => {
          isLoadingWarehouse.value = false
        })
    }

    function substitute() {
      isLoadingSubstitute.value = true
      requestListSubstituteProducts({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          listSubstituteProducts.value = records
        })
        .finally(() => {
          isLoadingSubstitute.value = false
        })
    }

    function relateds() {
      isLoadingRelateds.value = true
      requestListRelatedProducts({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          listRelatedsProducts.value = records
        })
        .finally(() => {
          isLoadingRelateds.value = false
        })
    }

    function availableToPromises() {
      isLoadingVendor.value = true
      requestListAvailableToPromises({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          listAvailableToPromise.value = records
        })
        .finally(() => {
          isLoadingVendor.value = false
        })
    }

    function vendorPurchases() {
      isLoadingvailable.value = true
      requestListVendorPurchases({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          listVendorPurchase.value = records
        })
        .finally(() => {
          isLoadingvailable.value = false
        })
    }

    function close(show = false) {
      store.commit('setShowProductList', show)
      selectProduct.value = {}
      searchValue.value = ''
    }

    function handleSizeChange(pageSize) {
      isLoading.value = true
      pageSizeNumber.value = pageSize
      timeoutSearch = setTimeout(() => {
        requestListProducts({
          tableName: 'M_Product',
          columnName: 'M_Product_ID',
          // Query
          searchValue: searchValue.value,
          pageSize: pageSize
        })
          .then(response => {
            const { record_count, records, next_page_token } = response
            recordCount.value = Number(record_count)
            pageToken.value = next_page_token
            store.commit('setProductList', records)
          })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    function selectTabs(tab) {
      const { name } = tab
      switch (name) {
        case 'warehouseStocks':
          warehouseStocks()
          break
        case 'substitute':
          substitute()
          break
        case 'relateds':
          relateds()
          break
        case 'availableToPromises':
          availableToPromises()
          break
        case 'vendorPurchases':
          vendorPurchases()
          break
      }
    }

    function handleChangePage(pageNumber) {
      isLoading.value = true
      timeoutSearch = setTimeout(() => {
        requestListProducts({
          tableName: 'M_Product',
          columnName: 'M_Product_ID',
          // Query
          searchValue: searchValue.value,
          pageSize: pageSizeNumber.value,
          pageToken: store.getters.getProductPageToken + '-' + pageNumber
        })
          .then(response => {
            const { record_count, records, next_page_token } = response
            recordCount.value = Number(record_count)
            pageToken.value = next_page_token
            store.commit('setProductList', records)
          })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    function getTaxAmount(basePrice, taxRate) {
      if (isEmptyValue(basePrice) || isEmptyValue(taxRate)) {
        return 0
      }
      return (basePrice * taxRate) / 100
    }

    return {
      // Ref
      isDetail,
      selection,
      isLoading,
      activeName,
      searchValue,
      currentLine,
      selectProduct,
      pageSizeNumber,
      listStockProduct,
      listWarehouseStocks,
      listSubstituteProducts,
      listRelatedsProducts,
      listVendorPurchase,
      listAvailableToPromise,
      isLoadingWarehouse,
      isLoadingSubstitute,
      isLoadingRelateds,
      isLoadingVendor,
      isLoadingvailable,
      // Computed
      listProducto,
      recordCount,
      pageToken,
      isShowDialogo,
      // Methods
      handleChangePage,
      handleSizeChange,
      warehouseStocks,
      formatQuantity,
      searchProduct,
      getTaxAmount,
      formatPrice,
      selectTabs,
      addProduct,
      copyCode,
      close
    }
  }
})
</script>

<style lang="scss">
.product-list-content {
  height: 100% !important;
  padding-top: 0px;
  padding-bottom: 4px;
  padding-left: 10px;
  padding-right: 10px;
}
.el-autocomplete-suggestion li {
  line-height: 20px;
}
.product-search-details {
  .el-dialog__header {
    background: transparent;
    .el-dialog__title {
      line-height: 24px;
      font-size: 18px;
      color: #303133;
      font-weight: bolder;
    }
  }
}
</style>
