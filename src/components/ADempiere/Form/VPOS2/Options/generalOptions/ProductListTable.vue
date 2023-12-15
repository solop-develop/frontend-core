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
        width="190"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-document-copy"
            @click="copyCode(scope.row)"
          />
          {{ scope.row.product.value }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product.name"
        :label="$t('form.productInfo.name')"
        min-width="200"
      />
      <el-table-column
        prop="quantity_on_hand"
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
      />
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
      >
        <template slot-scope="scope">
          {{ displayAmount(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.pos.collect.convertedAmount')"
        align="right"
      >
        <template slot-scope="scope">
          {{ displayAmount(scope.row) }}
        </template>
      </el-table-column>
    </el-table>
    <p>
      <custom-pagination
        :total="recordCount"
        style="float: right;"
        :selection="selection"
        :current-page="pageToken"
        :records-page="listProducto.length"
        :handle-change-page="handleChangePage"
        :handle-size-change="handleSizeChange"
      />
    </p>
    <el-dialog
      :visible.sync="isDetail"
      :center="true"
      :modal="false"
      :title="isEmptyValue(currentLine) ? '' :currentLine.product.name"
    >
      <span v-if="!isEmptyValue(currentLine)">
        <p><b style="float: left">{{ $t('form.productInfo.code') }}</b><span style="float: right">{{ currentLine.product.value }}</span></p><br>
        <p><b style="float: left">{{ $t('form.productInfo.upc') }}</b><span style="float: right"> {{ currentLine.product.upc }} </span></p><br>
        <p>
          <b style="float: left">{{ $t('form.productInfo.quantityOnHand') }}</b>
          <span style="float: right">
            {{ currentLine.quantity_on_hand }}
          </span>
        </p><br>
        <p>
          <b style="float: left">{{ $t('form.productInfo.price') }}</b>
          <span style="float: right">
            {{ formatPrice({ value: currentLine.price_standard, currency: currentLine.currency.iso_code }) }}
          </span>
        </p><br>
        <p>
          <b style="float: left">{{ $t('form.productInfo.taxAmount') }}</b>
          <span style="float: right">
            {{ formatPrice({ value: getTaxAmount(Number(currentLine.price_standard), Number(currentLine.tax_rate.rate)), currency: currentLine.currency.iso_code }) }}
          </span>
        </p><br>
        <!-- <p>
          <b style="float: left">{{ $t('form.productInfo.grandTotal') }}</b>
          <span style="float: right">
            {{ displayValue(currentLine, 'grandTotal') }}
          </span>
        </p>
        <br>
        <p>
          <b style="float: left">
            {{ $t('form.productInfo.grandTotalConverted') }} ({{ currentLine.schemaCurrency.iSOCode }})
          </b>
          <span style="float: right">
            {{ displayValue(currentLine, 'convertedAmount') }}
          </span>
        </p> -->
        <br>
        <el-divider>
          <b>
            <i>
              {{ $t('form.productInfo.warehouseAvailability') }}
            </i>
          </b>
        </el-divider>
        <el-scrollbar wrap-class="scroll-warehouses">
          <span v-if="!isEmptyValue(listStockProduct)">
            <span
              v-for="stock in listStockProduct"
              :key="stock.id"
            >
              <p>
                <b style="float: left">{{ stock.label }}</b>
                <span style="float: right">
                  {{ formatQuantity({ value: stock.sumaryQty }) }}
                </span>
              </p>
              <br>
            </span>
          </span>
          <loading-view
            v-else
            key="browser-loading"
          />
        </el-scrollbar>
      </span>
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
import {
  listStocks
} from '@/api/ADempiere/form/VPOS/index.js'
export default defineComponent({
  name: 'ProductListTable',
  components: {
    IndexColumn,
    LoadingView,
    CustomPagination
  },
  props: {
    height: {
      type: String,
      default: '450'
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
    const recordCount = computed(() => {
      return store.getters.getProductCount
    })
    const pageToken = computed(() => {
      const page = store.getters.getProductPageToken
      if (page) return Number(page.slice(-1))
      return 0
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
        store.dispatch('searchProductList', {
          searchValue: search,
          pageSize: pageSizeNumber.value
        })
          .finally(() => {
            isLoading.value = false
            searchValue.value = ''
          })
      }, 1000)
    }

    function displayAmount(row) {
      const {
        price_standard,
        currency
      } = row
      return formatPrice({ value: price_standard, currency: currency.iSOCode })
    }

    function addProduct(row) {
      isDetail.value = true
      currentLine.value = row
      setStocks(row)
    }

    function setStocks(row) {
      const listStock = []
      const {
        value,
        sku
      } = row.product
      listStocks({
        posId: store.getters.getVPOS.id,
        value,
        sku
      })
        .then(response => {
          const list = response.stocks.map(stock => {
            return {
              label: stock.warehouse_name,
              id: stock.warehouse_id,
              attributeName: stock.attribute_name,
              qty: stock.quantity,
              sumaryQty: []
            }
          })
          const options = []

          list.forEach(element => {
            if (isEmptyValue(options)) {
              options.push({
                ...element
              })
            }
            const currentStock = options.find(stock => stock.id === element.id)
            const index = options.findIndex(stock => stock.id === element.id)
            if (!isEmptyValue(currentStock) && !isEmptyValue(options)) {
              options[index].qty = currentStock.qty + element.qty
              options[index].sumaryQty.push(element.qty)
            }
            if (isEmptyValue(currentStock)) {
              options.push({
                ...element,
                sumaryQty: [element.qty]
              })
            }
          })
          listStockProduct.value = options.map(list => {
            const sumaryQty = list.sumaryQty.reduce((a, b) => a + b, 0)
            return {
              ...list,
              sumaryQty: sumaryQty
            }
          })
        })
      return listStock
    }

    function close(show = false) {
      store.commit('setShowProductList', show)
      selectProduct.value = {}
      searchValue.value = ''
    }

    function handleCurrentChange(row) {
      if (!isEmptyValue(row)) selection.value = 1
      selectProduct.value = row
    }

    function handleSizeChange(pageSize) {
      isLoading.value = true
      pageSizeNumber.value = pageSize
      timeoutSearch = setTimeout(() => {
        store.dispatch('searchProductList', {
          searchValue: searchValue.value,
          pageSize: pageSize
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    function handleChangePage(pageNumber) {
      isLoading.value = true
      timeoutSearch = setTimeout(() => {
        store.dispatch('searchProductList', {
          searchValue: searchValue.value,
          pageSize: pageSizeNumber.value,
          pageToken: store.getters.getProductPageToken + '-' + pageNumber
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
      selection,
      isLoading,
      isDetail,
      searchValue,
      currentLine,
      selectProduct,
      pageSizeNumber,
      listStockProduct,
      // Computed
      listProducto,
      recordCount,
      pageToken,
      // Methods
      handleCurrentChange,
      handleChangePage,
      handleSizeChange,
      formatQuantity,
      displayAmount,
      searchProduct,
      getTaxAmount,
      formatPrice,
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
  padding-left: 0px;
  padding-right: 0px;
}
.el-autocomplete-suggestion li {
  line-height: 20px;
}
</style>
