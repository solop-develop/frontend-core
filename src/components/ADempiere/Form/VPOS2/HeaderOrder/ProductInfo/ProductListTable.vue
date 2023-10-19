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
  <el-main
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
      height="450"
      fit
      @current-change="handleCurrentChange"
      @row-dblclick="addProduct"
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
        prop="quantity_ordered.value"
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
        style="float: left;"
        :selection="selection"
        :current-page="pageToken"
        :records-page="listProducto.length"
        :handle-change-page="handleChangePage"
        :handle-size-change="handleSizeChange"
      />
      <el-button
        type="primary"
        class="button-base-icon"
        icon="el-icon-check"
        style="float: right;margin-left: 5px;"
        :disabled="isEmptyValue(selectProduct)"
        @click="addProduct(selectProduct)"
      />
      <el-button
        type="danger"
        class="button-base-icon"
        icon="el-icon-close"
        style="float: right;"
        @click="close(false)"
      />
    </p>
  </el-main>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'ProductListTable',
  components: {
    IndexColumn,
    CustomPagination
  },
  setup() {
    /**
     * Ref
     */
    const searchValue = ref('')
    const isLoading = ref(false)
    const pageSizeNumber = ref(15)
    const selection = ref(0)
    const selectProduct = ref({})
    let timeoutSearch
    /**
     * Computed
     */
    const listProducto = computed(() => {
      return store.getters.getProductList
    })
    const recordCount = computed(() => {
      return store.getters.getProductCount
    })
    const pageToken = computed(() => {
      const page = store.getters.getProductPageToken
      if (page) return Number(page.slice(-1))
      return 0
    })

    const order = computed(() => {
      return store.getters.getCurrentOrder
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
      return formatPrice({ value: price_standard.value, currency: currency.iSOCode })
    }

    function addProduct(row) {
      if (isEmptyValue(order.value.id)) {
        store.dispatch('newOrder')
          .finally(() => {
            store.dispatch('newLine', {
              productId: row.product.id
            })
          })
      } else {
        store.dispatch('newLine', {
          productId: row.product.id
        })
      }
      close(false)
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

    return {
      // Ref
      selection,
      isLoading,
      searchValue,
      selectProduct,
      pageSizeNumber,
      // Computed
      listProducto,
      recordCount,
      pageToken,
      // Methods
      handleCurrentChange,
      handleChangePage,
      handleSizeChange,
      displayAmount,
      searchProduct,
      addProduct,
      copyCode,
      close
    }
  }
})
</script>

<style lang="scss">
.product-list-content {
  padding-top: 0px;
}
.el-autocomplete-suggestion li {
  line-height: 20px;
}
</style>
