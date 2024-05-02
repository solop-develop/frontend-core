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
      size="mini"
      class="form-base"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item :label="$t('form.productInfo.codeProduct')">
        <el-input
          v-model="searchValue"
          :placeholder="$t('quickAccess.searchWithEnter')"
          clearable
          @input="searchProduct"
        />
        <el-row :gutter="10">
          <el-col :span="6">
            <product-category-field
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <product-group-field
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <product-class-field
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <product-classification-field
              :uuid-form="uuidForm"
            />
          </el-col>
        </el-row>
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
        v-for="(fieldAttributes, key) in headerList"
        :key="key"
        :label="fieldAttributes.label"
        header-align="center"
        :min-width="widthColumn(fieldAttributes)"
        :align="fieldAttributes.align"
      >
        <template slot-scope="scope">
          <el-button
            v-if="fieldAttributes.columName === 'value'"
            type="text"
            icon="el-icon-document-copy"
            @click="copyCode(scope.row)"
          />
          {{ displayValue({ row: scope.row, columName: fieldAttributes.columName}) }}
        </template>
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
            {{ $t('field.product.stocked') }}
          </b>
          <span style="float: right">
            {{ convertBooleanToTranslationLang(currentLine.is_stocked) }}
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
            {{ $t('field.product.productClass') }}
          </b>
          <span style="float: right">
            {{ currentLine.product_class }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('field.product.vendor') }}
          </b>
          <span style="float: right">
            {{ currentLine.vendor }}
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
              v-loading="isLoadingTable"
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
              v-loading="isLoadingTable"
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
              v-loading="isLoadingTable"
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
              v-loading="isLoadingTable"
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
              v-loading="isLoadingTable"
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
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import store from '@/store'
// Const
import headerList from '@/components/ADempiere/Form/ProductSearch/headerList.ts'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import ProductCategoryField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productCategoryField.vue'
import ProductClassField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productClassField.vue'
import ProductClassificationField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productClassificationField.vue'
import ProductGroupField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productGroupField.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
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
    CustomPagination,
    ProductCategoryField,
    ProductClassField,
    ProductClassificationField,
    ProductGroupField
  },

  props: {
    height: {
      type: String,
      default: '65vh'
    }
  },

  setup() {
    /**
     * Const
     */
    const uuidForm = 'product_search_form'
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
    const isLoadingTable = ref(false)
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

    const getProductCategoryField = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'product_category_id'
      })
    })

    const getProductClassField = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'product_class_id'
      })
    })

    const getProductClassificationField = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'product_classification_id'
      })
    })

    const getProductGroupField = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'product_group_id'
      })
    })

    const queryCriteria = computed(() => {
      return store.getters.getProductSearchFieldQueryFilters({ containerUuid: uuidForm })
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
          ...queryCriteria.value,
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
      // isLoadingWarehouse.value = true
      requestListWarehouseStocks({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          isLoadingTable.value = records
        })
        .finally(() => {
          isLoadingTable.value = false
        })
    }

    function substitute() {
      // isLoadingSubstitute.value = true
      requestListSubstituteProducts({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          isLoadingTable.value = records
        })
        .finally(() => {
          isLoadingTable.value = false
        })
    }

    function relateds() {
      // isLoadingRelateds.value = true
      requestListRelatedProducts({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          isLoadingTable.value = records
        })
        .finally(() => {
          isLoadingTable.value = false
        })
    }

    function availableToPromises() {
      // isLoadingVendor.value = true
      requestListAvailableToPromises({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          listAvailableToPromise.value = records
          isLoadingTable.value = false
        })
        .finally(() => {
          isLoadingTable.value = false
        })
    }

    function vendorPurchases() {
      // isLoadingvailable.value = true
      requestListVendorPurchases({
        productId: currentLine.value.id
      })
        .then(response => {
          const { records } = response
          isLoadingTable.value = records
        })
        .finally(() => {
          isLoadingTable.value = false
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
      isLoadingTable.value = true
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
          product_group_id: getProductGroupField.value,
          product_class_id: getProductClassField.value,
          product_category_id: getProductCategoryField.value,
          product_classification_id: getProductClassificationField.value,
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

    /**
     * Tables
     */
    function widthColumn(fieldAttributes) {
      const { columName } = fieldAttributes
      if (['vendor', 'name'].includes(columName)) return '120'
      return '50'
    }

    function displayValue({ row, columName }) {
      const value = row[columName]
      if (typeof value === 'boolean') return convertBooleanToTranslationLang(value)
      if (['standard_price', 'quantityOnHand'].includes(columName)) return formatQuantity({ value: Number(value) })
      return value
    }

    function setQuery() {
      store.commit('setProductSearchFieldData', {
        containerUuid: uuidForm
      })
    }

    setQuery()

    /**
     * Watch - watch works directly on a ref
     * @param newValue - New Assessed Property value
     * @param oldValue - Old Assessed Property value
     */

    watch(getProductCategoryField, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    watch(getProductClassField, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    watch(getProductClassificationField, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    watch(getProductGroupField, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    return {
      uuidForm,
      // Ref
      isDetail,
      selection,
      isLoading,
      isLoadingTable,
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
      getProductCategoryField,
      getProductClassField,
      getProductClassificationField,
      getProductGroupField,
      queryCriteria,
      // Import Constants
      headerList,
      // Methods
      convertBooleanToTranslationLang,
      handleChangePage,
      handleSizeChange,
      warehouseStocks,
      formatQuantity,
      searchProduct,
      getTaxAmount,
      displayValue,
      widthColumn,
      formatPrice,
      selectTabs,
      addProduct,
      copyCode,
      setQuery,
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
