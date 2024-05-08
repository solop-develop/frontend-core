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
    <query-criteria
      :uuid-form="uuidForm"
      :hangle-change="searchProduct"
    />
    <el-table
      id="productInfoTable"
      ref="productInfoTable"
      v-loading="isLoading"
      :data="listProducto"
      :empty-text="$t('quickAccess.searchWithEnter')"
      highlight-current-row
      :border="true"
      max-height="500"
      class="products-table-avalaible"
      fit
      @current-change="addProduct"
      @row-dblclick="openProductInfo"
    >
      <index-column
        :page-number="1"
        :page-size="50"
      />
      <el-table-column
        prop="value"
        :label="$t('field.product.value')"
        header-align="center"
        min-width="90"
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
        :label="$t('field.product.name')"
        header-align="center"
        min-width="190"
      />
      <template v-if="getPriceListVersion">
        <el-table-column
          prop="standard_price"
          :label="$t('field.product.standardPrice')"
          header-align="center"
          min-width="129"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.standard_price }) }}
          </span>
        </el-table-column>
      </template>
      <el-table-column
        prop="uom"
        :label="$t('field.product.uom')"
        header-align="center"
        min-width="60"
      />
      <el-table-column
        prop="is_stocked"
        :label="$t('field.product.stocked')"
        header-align="center"
        min-width="105"
      >
        <span slot-scope="scope">
          {{ convertBooleanToTranslationLang(scope.row.is_stocked) }}
        </span>
      </el-table-column>

      <template v-if="isStockQuantities">
        <el-table-column
          prop="available_quantity"
          :label="$t('field.product.available')"
          header-align="center"
          min-width="100"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.available_quantity }) }}
          </span>
        </el-table-column>
        <el-table-column
          prop="on_hand_quantity"
          :label="$t('field.product.onHandQuantity')"
          header-align="center"
          min-width="130"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.on_hand_quantity }) }}
          </span>
        </el-table-column>
      </template>
      <el-table-column
        prop="product_category"
        :label="$t('field.product.productCategory')"
        header-align="center"
        min-width="180"
      />
      <el-table-column
        prop="product_group"
        :label="$t('field.product.productGroup')"
        header-align="center"
        min-width="150"
      />
      <el-table-column
        prop="product_class"
        :label="$t('field.product.productClass')"
        header-align="center"
        min-width="150"
      />
      <el-table-column
        prop="vendor"
        :label="$t('field.product.vendor')"
        header-align="center"
        min-width="150"
      />
    </el-table>

    <p>
      <custom-pagination
        style="text-align: left;float: left;"
        :total-records="recordCount"
        :selection="selection"
        :page-number="pageTokenNumber"
        :page-size="listProducto.length"
        :handle-change-page-number="handleChangePage"
        :handle-change-page-size="handleSizeChange"
      />
      <span style="text-align: right; float: right;">
        <el-button
          type="danger"
          class="button-base-icon"
          icon="el-icon-close"
          @click="close()"
        />
        <el-button
          type="info"
          class="button-base-icon"
          plain
          @click="cleanQueryCriteria()"
        >
          <svg-icon icon-class="layers-clear" />
        </el-button>

        <el-button
          :loading="isLoading"
          type="success"
          class="button-base-icon"
          icon="el-icon-refresh-right"
          @click="searchProduct()"
        />

        <el-button
          v-if="!isEmptyValue(product)"
          type="primary"
          class="button-base-icon"
          icon="el-icon-check"
          @click="openProductInfo"
        />
      </span>
    </p>
    <show-info-product
      :is-show="isDetail"
    />
  </div>
</template>

<script>
import { defineComponent, onMounted, computed, watch, ref } from '@vue/composition-api'
import store from '@/store'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import QueryCriteria from '@/components/ADempiere/Form/ProductSearch/queryCriteria'
import ShowInfoProduct from '@/components/ADempiere/Form/ProductSearch/dialogo/showInfoProduct'

// Utils and Helper Methods
import { getContext } from '@/utils/ADempiere/contextUtils'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { closeTagView } from '@/utils/ADempiere/componentUtils.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
// API Request Methods
import {
  requestListProducts
} from '@/api/ADempiere/field/search/product.ts'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'ProductSearch',

  components: {
    IndexColumn,
    LoadingView,
    CustomPagination,
    QueryCriteria,
    ShowInfoProduct
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
    // const searchValue = ref('')
    const isDetail = ref(false)
    const isLoading = ref(false)
    const pageSizeNumber = ref(15)
    const pageTokenNumber = ref('')
    const selection = ref(0)
    const recordCount = ref(0)
    const productInfoTable = ref(null)

    let timeoutSearch

    /**
     * Computed
     */

    const listProducto = computed(() => {
      return store.getters.getProductList.map(list => {
        return {
          ...list,
          quantity_on_hand: formatQuantity({ value: Number(list.quantity_on_hand) })
        }
      })
    })

    const searchValue = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'SearchValue'
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

    const getPriceListVersion = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'price_list_version_id'
      })
    })

    const getIsStocked = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'is_stocked'
      })
    })

    const isStockQuantities = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'warehouse_id'
      })
    })

    const getVendorId = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: uuidForm,
        attributeKey: 'vendor_id'
      })
    })

    const queryCriteria = computed(() => {
      return store.getters.getProductSearchFieldQueryFilters({ containerUuid: uuidForm })
    })

    const product = computed(() => {
      return store.getters.getCurrentProduct
    })

    // Methods
    function copyCode(row) {
      copyToClipboard({
        text: row.value,
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
          searchValue: queryCriteria.value.search_value,
          pageSize: pageSizeNumber.value,
          pageToken: pageTokenNumber.value
        })
          .then(response => {
            const { records, record_count, next_page_token } = response
            pageTokenNumber.value = next_page_token
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
      store.commit('setCurrentProduct', row)
    }

    function openProductInfo(params) {
      store.dispatch('changeShowDialog', true)
      store.dispatch('requestListWarehouseStocks')
    }

    function handleSizeChange(pageSize) {
      pageSizeNumber.value = pageSize
      searchProduct()
    }

    function handleChangePage(pageNumber) {
      let newTokenPage = pageTokenNumber.value
      newTokenPage = newTokenPage.slice(0, -1) + pageNumber.toString()
      pageTokenNumber.value = newTokenPage
      searchProduct()
    }

    function setQuery() {
      store.commit('setProductSearchFieldData', {
        containerUuid: uuidForm
      })
    }

    function cleanQueryCriteria() {
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'product_category_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'product_class_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'product_classification_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'product_group_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'price_list_version_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'is_stocked',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'warehouse_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'vendor_id',
        value: undefined
      })
      store.commit('setProductSearchFieldQueryFilterByAttribute', {
        containerUuid: uuidForm,
        attributeKey: 'search_value',
        value: ''
      })
      searchProduct()
    }

    setQuery()

    function setCurrent(row) {
      productInfoTable.value.setCurrentRow(row)
    }

    function close() {
      closeTagView()
    }

    function setContextValue() {
      const warehouse = getContext({
        parentUuid: uuidForm,
        columnName: '#M_Warehouse_ID',
        isForceSession: true
      })
      const priceListVersion = getContext({
        parentUuid: uuidForm,
        columnName: '#M_PriceList_ID',
        isForceSession: true
      })
      if (warehouse > 0) {
        store.dispatch('loadWarehouses')
          .then(() => {
            store.commit('setProductSearchFieldQueryFilterByAttribute', {
              containerUuid: uuidForm,
              attributeKey: 'warehouse_id',
              value: warehouse
            })
          })
      }

      if (!isEmptyValue(priceListVersion)) {
        store.commit('setProductSearchFieldQueryFilterByAttribute', {
          containerUuid: uuidForm,
          attributeKey: 'price_list_version_id',
          value: priceListVersion
        })
      }
    }

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

    watch(getPriceListVersion, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    watch(getIsStocked, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    watch(isStockQuantities, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })

    watch(getVendorId, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        searchProduct()
      }
    })
    setContextValue()

    onMounted(() => {
      if (isEmptyValue(listProducto.value)) {
        searchProduct()
        if (!isEmptyValue(product.value)) setCurrent(product.value)
      }
    })

    return {
      uuidForm,
      // Ref
      isDetail,
      selection,
      isLoading,
      pageTokenNumber,
      searchValue,
      pageSizeNumber,
      productInfoTable,
      // Computed
      listProducto,
      recordCount,
      getIsStocked,
      getVendorId,
      isStockQuantities,
      getPriceListVersion,
      getProductCategoryField,
      getProductClassField,
      getProductClassificationField,
      getProductGroupField,
      queryCriteria,
      product,
      // Methods
      convertBooleanToTranslationLang,
      cleanQueryCriteria,
      handleChangePage,
      handleSizeChange,
      openProductInfo,
      formatQuantity,
      searchProduct,
      closeTagView,
      addProduct,
      getContext,
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
