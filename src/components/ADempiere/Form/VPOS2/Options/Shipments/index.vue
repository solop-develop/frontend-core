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
    <el-card
      shadow="never"
    >
      <el-form
        label-position="top"
        label-width="10px"
        @submit.native.prevent="notSubmitForm"
      >
        <el-form-item
          :label="$t('form.productInfo.codeProduct')"
          style="width: 100%"
        >
          <el-autocomplete
            v-model="searchProduct"
            style="width: 100%"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            :placeholder="$t('quickAccess.searchWithEnter')"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="header" style="margin: 0px">
                <b> {{ item.product.value }} - {{ item.product.name }} </b>
              </div>
              <div style="margin: 0px">
                <div style="float: left;width: 70%;margin: 0px">
                  <p style="overflow: hidden;text-overflow: ellipsis;text-align: inherit;margin: 0px">
                    {{ item.product.upc }} <br>
                    {{ item.product.description }}
                  </p>
                </div>
                <div style="width: 30%;float: right;margin: 0px">
                  <p style="overflow: hidden;text-overflow: ellipsis;text-align: end;margin: 0px">
                    {{ formatQuantity(item.quantity_ordered.value) }}
                  </p>
                </div>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <!-- <el-table
        ref="listProducto"
        v-shortkey="shortsKey"
        v-loading="isLoadedServer"
        :data="productdeliveryList"
        :empty-text="$t('quickAccess.searchWithEnter')"
        border
        fit
        height="450"
        highlight-current-row
        @cell-dblclick="editDelivery"
        @shortkey.native="keyAction"
      > -->
    </el-card>
  </el-main>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
// // Components and Mixins
// import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
// import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere'
// import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
// import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'Shipments',
  setup() {
    const searchProduct = ref('')
    const lines = computed(() => {
      return store.getters.getListOrderLines
    })

    // Methods

    /**
     * Query Search
     */
    function querySearch(queryString, callback) {
      var results = queryString ? lines.value.filter(productFilter(queryString)) : lines.value
      callback(results)
    }

    function productFilter(queryString) {
      return (link) => {
        const search = queryString.toLowerCase()
        return link.product.value.toLowerCase().includes(search) || link.product.name.toLowerCase().includes(search) || link.product.upc.toLowerCase().includes(search)
      }
    }

    function handleSelect(item) {
      console.log(item)
    }

    return {
      // Ref
      searchProduct,
      // Computed
      lines,
      // Methods
      querySearch,
      handleSelect,
      productFilter,
      formatQuantity
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
