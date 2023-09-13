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
  <el-main
    v-shortkey="shortsKey"
    class="product-list-content"
    @shortkey.native="keyAction"
  >
    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      label-width="10px"
      @shortkey.native="keyAction"
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
      ref="listProducto"
      v-shortkey="shortsKey"
      v-loading="isLoadingRecords"
      :data="localTableSearch(listWithPrice)"
      :empty-text="$t('quickAccess.searchWithEnter')"
      :border="true"
      fit
      height="450"
      highlight-current-row
      @row-click="selectProduct"
      @row-dblclick="addSelectProduct"
      @shortkey.native="keyAction"
    >
      <el-table-column
        :label="$t('form.productInfo.code')"
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
      />
      <el-table-column
        prop="quantityOnHand"
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
      />
      <el-table-column
        prop="quantityAvailable"
        :label="$t('form.productInfo.quantityAvailable')"
        align="right"
      />
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.priceStandard, currency: scope.row.currency.iSOCode }) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.pos.collect.convertedAmount')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.schemaPriceStandard, currency: scope.row.schemaCurrency.iSOCode }) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.taxAmount')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), currency: scope.row.currency.iSOCode }) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.grandTotal')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: ((getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate)) + scope.row.priceStandard), currency: scope.row.currency.iSOCode }) }}
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="24" class="products-list-footer">
      <el-col :span="18">
        <custom-pagination
          :total="productPrice.recordCount"
          :current-page="productPrice.pageNumber"
          :handle-change-page="handleChangePage"
          :records-page="listWithPrice.length"
        />
      </el-col>

      <el-col :span="6">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            @click="loadProductsPricesList"
          />
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="close"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="addProductFromList"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// Components and Mixins
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'

// Utils and Helper Methods
// import fieldsListProductPrice from './fieldsList.js'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default {
  name: 'ProductList',

  components: {
    CustomPagination
  },

  mixins: [
    formMixin,
    posMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Products-Price-List',
          containerUuid: 'Products-Price-List'
        }
      }
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    }
  },

  data() {
    return {
      // fieldsList: fieldsListProductPrice,
      isLoadingRecords: false,
      isCustomForm: true,
      currentProduct: {},
      isSearchProduct: false,
      timeOut: null
    }
  },

  computed: {
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    productListPrice() {
      return this.$store.getters.getProductPrice
    },
    isShowProductsPriceList: {
      get() {
        return this.$store.getters.getShowProductPriceList
      },
      set(newValue) {
        this.$store.commit('setIsShowListProductPrice', newValue)
      }
    },
    listWithPrice() {
      const { productPricesList } = this.productListPrice
      if (!this.isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    },
    shortsKey() {
      return {
        closeProductList: ['esc'],
        refreshList: ['f5']
      }
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.productListPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    },
    searchValue: {
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.metadata.containerUuid,
          columnName: 'ProductValue',
          value
        })

        // refresh search
        if (this.isEmptyValue(value)) {
          this.loadProductsPricesList()
        }
      },
      get() {
        return this.$store.getters.getValueOfField({
          containerUuid: this.metadata.containerUuid,
          columnName: 'ProductValue'
        })
      }
    }
  },

  watch: {
    isShowProductsPriceList(newValue, oldValue) {
      // TODO: This is calling 2 request
      if (newValue && !this.isLoadingRecords && this.isEmptyValue(this.listWithPrice)) {
        this.loadProductsPricesList()
      }
    }
  },

  created() {
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPointOfSales)
    }, 3000)
  },

  methods: {
    formatPrice,
    localTableSearch(listWithPrice) {
      let filtersProduct = []
      if (!this.isEmptyValue(this.searchValue) && this.isSearchProduct) {
        filtersProduct = listWithPrice.filter(data => data.product.name.toLowerCase().includes(this.searchValue.toLowerCase()) || data.product.value.toLowerCase().includes(this.searchValue.toLowerCase()))
        if (!this.isEmptyValue(filtersProduct)) {
          this.isSearchProduct = true
          return filtersProduct
        }

        if (this.isSearchProduct) {
          this.isLoadingRecords = true
          this.timeOut = setTimeout(() => {
            this.$store.dispatch('listProductPriceFromServer', {
              containerUuid: this.metadata.containerUuid,
              pageNumber: 1,
              searchValue: this.searchValue
            })
              .then(() => {
                const recordsList = this.listWithPrice

                if (this.isEmptyValue(recordsList)) {
                  this.$message({
                    message: this.$t('notifications.searchWithOutRecords'),
                    type: 'info',
                    showClose: true
                  })
                  this.isSearchProduct = false
                  return recordsList
                }
                this.isSearchProduct = false
                return recordsList
              })
              .finally(() => {
                this.isLoadingRecords = false
              })
          }, 2000)
        }
      }
      return listWithPrice
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.loadProductsPricesList()
          break

        case 'closeProductList':
          this.close()
          break
      }
    },
    loadProductsPricesList() {
      this.isLoadingRecords = true
      this.$store.dispatch('listProductPriceFromServer', {})
        .finally(() => {
          this.isLoadingRecords = false
        })
    },
    /**
     * @param {number} newPage
     */
    handleChangePage(newPage) {
      this.$store.dispatch('setProductPicePageNumber', newPage)
      this.loadProductsPricesList()
    },
    selectProduct(row) {
      this.currentProduct = row
    },
    addSelectProduct(row) {
      this.findProduct(row.product.value)
      this.close()
    },
    close() {
      // this.$store.commit('setIsShowListProductPrice', false)
      this.isShowProductsPriceList = false
      this.$store.commit('setDialogoComponent', false)
    },
    addProductFromList() {
      if (!this.isSelectable) {
        return
      }
      this.findProduct(this.currentProduct.product.value)

      // close popover of list product price
      this.close()
    },
    searchProduct(value) {
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.isSearchProduct = true
        this.$store.commit('updateValueOfField', {
          containerUuid: this.metadata.containerUuid,
          columnName: 'ProductValue',
          value: value
        })
      }, 1500)
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
      if (this.isEmptyValue(PointOfSales)) {
        const message = this.$t('notifications.errorPointOfSale')
        this.$store.commit('setListProductPrice', {
          isLoaded: true,
          productPricesList: []
        })
        this.$message({
          type: 'info',
          message,
          duration: 1500,
          showClose: true
        })
      }
    },
    copyCode(row) {
      copyToClipboard({
        text: row.product.value,
        isShowMessage: true
      })
    },
    getTaxAmount(basePrice, taxRate) {
      if (this.isEmptyValue(basePrice) || this.isEmptyValue(taxRate)) {
        return 0
      }
      return (basePrice * taxRate) / 100
    }
  }
}
</script>

<style lang="scss">
.product-list-content {
  padding-top: 0px;

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
