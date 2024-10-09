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
    <el-collapse v-model="activeCollapse">
      <el-collapse-item name="1">
        <span slot="title" style="font-size: 18px !important; font-weight: bold !important">
          {{ $t('field.product.searchCriteria') }}
          <i style="font-size: 18px;" class="el-icon-s-operation" />
        </span>
        <query-criteria
          :uuid-form="uuidForm"
          :hangle-change="searchProduct"
        />
      </el-collapse-item>
    </el-collapse>
    <el-table
      id="productInfoTable"
      ref="productInfoTable"
      v-loading="isLoading"
      :data="listProducto"
      :empty-text="$t('quickAccess.searchWithEnter')"
      highlight-current-row
      :border="true"
      class="products-table-avalaible"
      :height="tableHeight"
      fit
      style="width: 100%; overflow: scroll; font-size: 14px;"
      @current-change="addProduct"
      @row-dblclick="openProductInfo"
    >
      <index-column
        :page-number="1"
        :page-size="50"
      />
      <el-table-column
        v-for="(header, key) in headerList"
        :key="key"
        :align="header.align"
        :min-width="header.width"
        :label="header.label"
        :prop="header.columnName"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="header.columnName === 'value'"
            type="text"
            icon="el-icon-document-copy"
            @click="copyCode(scope.row)"
          />
          <el-dropdown
            v-if="header.columnName === 'name'"
            trigger="click"
            @command="zoomInWindow(scope.row)"
          >
            <span>{{ scope.row[header.columnName] }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <i class="el-icon-zoom-in" style="font-weight: bolder;" />
                <b>
                  {{ $t('page.processActivity.zoomIn') }} {{ ' - ' }} {{ scope.row[header.columnName] }}
                </b>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-else>
            {{ scope.row[header.columnName] }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <p>
      <span style="float: right;">
        <span style="display: inline-block; vertical-align: middle; margin-left: 50px;">
          <el-button
            type="info"
            class="button-base-icon"
            plain
            @click="cleanQueryCriteria()"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="close()"
          />
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
        <custom-pagination
          style="display: inline-block; vertical-align: middle;"
          :total-records="recordCount"
          :selection="selection"
          :page-number="pageTokenNumber"
          :page-size="listProducto.length"
          :handle-change-page-number="handleChangePage"
          :handle-change-page-size="handleSizeChange"
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
import lang from '@/lang'
// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import QueryCriteria from '@/components/ADempiere/Form/ProductSearch/queryCriteria'
import ShowInfoProduct from '@/components/ADempiere/Form/ProductSearch/dialogo/showInfoProduct'

// API Request Methods
import {
  requestListProducts
} from '@/api/ADempiere/fields/search/product.ts'

// Utils and Helper Methods
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { closeTagView } from '@/utils/ADempiere/componentUtils.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
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
    const activeCollapse = ref(['1'])
    const headerList = ref([
      {
        label: lang.t('field.product.value'),
        columnName: 'value',
        width: '70',
        align: 'left'
      },
      {
        label: lang.t('field.product.name'),
        columnName: 'name',
        width: '300',
        align: 'left'
      },
      {
        label: lang.t('field.product.standardPrice'),
        columnName: 'standard_price',
        width: '100',
        align: 'right'
      },
      {
        label: lang.t('field.product.uom'),
        columnName: 'uom',
        width: '70',
        align: 'left'
      },
      {
        label: lang.t('field.product.stocked'),
        columnName: 'is_stocked',
        width: '100',
        align: 'left'
      },
      {
        label: lang.t('field.product.available'),
        columnName: 'available_quantity',
        width: '150',
        align: 'right'
      },
      {
        label: lang.t('field.product.onHandQuantity'),
        columnName: 'on_hand_quantity',
        width: '150',
        align: 'right'
      },
      {
        label: lang.t('field.product.productCategory'),
        columnName: 'product_category',
        width: '150',
        align: 'left'
      },
      {
        label: lang.t('field.product.productGroup'),
        columnName: 'product_group',
        width: '150',
        align: 'left'
      },
      {
        label: lang.t('field.product.productClass'),
        columnName: 'product_class',
        width: '130',
        align: 'left'
      },
      {
        label: lang.t('field.product.vendor'),
        columnName: 'vendor',
        width: '150',
        align: 'left'
      }
    ])
    let timeoutSearch

    /**
     * Computed
     */

    const listProducto = computed(() => {
      return store.getters.getProductList.map(list => {
        return {
          ...list,
          quantity_on_hand: formatQuantity({ value: Number(list.quantity_on_hand) }),
          standard_price: formatQuantity({ value: Number(list.standard_price) }),
          is_stocked: convertBooleanToTranslationLang(list.is_stocked),
          available_quantity: formatQuantity({ value: Number(list.available_quantity) }),
          on_hand_quantity: formatQuantity({ value: Number(list.on_hand_quantity) })
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
    const tableHeight = computed(() => {
      if (activeCollapse.value[0] === '1') {
        return 'calc(100vh - 480px)'
      }
      return 'calc(100vh - 230px)'
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
    function zoomInWindow(scope) {
      const value = scope.id
      const id = 140
      const columnName = 'M_Product_ID'
      zoomIn({
        attributeValue: `window_${id}`,
        attributeName: 'containerKey',
        query: {
          [columnName]: value
        },
        params: {
          [columnName]: value
        }
      })
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
      activeCollapse,
      headerList,
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
      tableHeight,
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
      close,
      zoomInWindow
    }
  }
})
</script>

<style lang="scss">
.products-table-avalaible.el-table .el-table__body .el-table__row .el-table__cell {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
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
  .el-dialog__body{
    padding-top: 0px !important;
  }
  .el-dialog__header {
    background: transparent;
    padding-bottom: 0px !important;
    .el-dialog__title {
      line-height: 24px;
      font-size: 18px;
      color: #303133;
      font-weight: bolder;
    }
  }
}
</style>
