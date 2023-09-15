<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-main
    v-shortkey="shortsKey"
    :style="{height: height}"
  >
    <el-form
      v-shortkey="shortsKey"
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
      ref="singleTable"
      v-loading="!productPrice.isLoaded"
      :data="listWithPrice"
      border
      fit
      height="50"
      class="table-product-info"
      highlight-current-row
      @row-click="findlistProductWithRow"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        v-for="(header, key) in listHeader"
        :key="key"
        :label="header.label"
        :align="header.align"
      >
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" @click="show(scope.row)">
            {{ displayValue(scope.row, header.column) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="productPrice.recordCount"
      :current-page="productPrice.pageNumber"
      :handle-change-page="handleChangePage"
      :records-page="listWithPrice.length"
    />
    <el-dialog
      :visible.sync="isDetail"
      :center="true"
      :modal="false"
      :title="isEmptyValue(currentLine) ? '' : currentLine.product.name"
    >
      <span v-if="!isEmptyValue(currentLine)">
        <p><b style="float: left">{{ $t('form.productInfo.code') }}</b><span style="float: right">{{ currentLine.product.value }}</span></p><br>
        <p><b style="float: left">{{ $t('form.productInfo.upc') }}</b><span style="float: right"> {{ currentLine.product.upc }} </span></p><br>
        <p>
          <b style="float: left">{{ $t('form.productInfo.quantityOnHand') }}</b>
          <span style="float: right">
            {{ formatQuantity({ value: currentLine.quantityOnHand }) }}
          </span>
        </p><br>
        <p>
          <b style="float: left">{{ $t('form.productInfo.price') }}</b>
          <span style="float: right">
            {{ formatPrice({ value: currentLine.priceStandard, currency: currentLine.currency.iSOCode }) }}
          </span>
        </p><br>
        <p>
          <b style="float: left">{{ $t('form.productInfo.taxAmount') }}</b>
          <span style="float: right">
            {{ formatPrice({ value: getTaxAmount(currentLine.priceStandard, currentLine.taxRate.rate), currency: currentLine.currency.iSOCode }) }}
          </span>
        </p><br>
        <p>
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
        </p>
        <br>
        <el-divider>
          <b>
            <i>
              {{ $t('form.productInfo.warehouseAvailability') }}
            </i>
          </b>
        </el-divider>
        <el-scrollbar wrap-class="scroll-warehouses">
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
        </el-scrollbar>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
// components and mixins
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'

// constants
import fieldsListProductPrice from './fieldsList.js'

// utils and herlper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import {
  getLookupList,
  isDisplayedField,
  isDisplayedDefault,
  generalInfoSearch,
  searchTableHeader,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@/components/ADempiere/Form/VPOS/containerManagerPos.js'

import {
  listStocks
} from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'ProductList',

  components: {
    CustomPagination
  },

  mixins: [
    formMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Products-Price-List-ProductInfo',
          containerUuid: 'Products-Price-List-ProductInfo'
        }
      }
    },
    height: {
      type: String,
      default: '90vh'
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    },
    reportAsociated: {
      type: Array,
      default() {
        return []
      }
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    }
  },

  data() {
    return {
      defaultMaxPagination: 50,
      resource: {},
      fieldsList: fieldsListProductPrice,
      isCustomForm: true,
      timeOut: null,
      indexTable: 0,
      currentLine: {},
      listStockProduct: [],
      searchValue: '',
      isDetail: false
    }
  },
  computed: {
    showProductSearch() {
      return this.$store.getters.getShowProductSearch
    },
    listHeader() {
      return [
        {
          label: this.$t('form.productInfo.code'),
          column: 'value',
          align: 'center'
        },
        {
          label: this.$t('form.productInfo.product'),
          column: 'name',
          align: 'center'
        },
        {
          label: this.$t('form.productInfo.quantityOnHand'),
          column: 'quantityOnHand',
          align: 'right'
        },
        {
          label: this.$t('form.productInfo.quantityAvailable'),
          column: 'quantityAvailable',
          align: 'right'
        },
        {
          label: this.$t('form.productInfo.price'),
          column: 'priceStandard',
          align: 'right'
        },
        {
          label: this.$t('form.pos.collect.convertedAmount'),
          column: 'convertedAmount',
          align: 'right'
        },
        {
          label: this.$t('form.productInfo.taxAmount'),
          column: 'taxAmount',
          align: 'right'
        },
        {
          label: this.$t('form.productInfo.grandTotal'),
          column: 'grandTotal',
          align: 'right'
        }
      ]
    },
    defaultImage() {
      return require('@/image/ADempiere/pos/no-image.jpg')
    },
    isShowProductsPriceList() {
      return this.$store.state['pointOfSales/listProductPrice'].productPrice[this.attribute]
    },
    currentPoint() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    productPrice() {
      return this.$store.getters.getProductPrice
    },
    listWithPrice() {
      const { productPricesList } = this.productPrice
      if (!isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    },
    shortsKey() {
      return {
        options: ['enter'],
        up: ['arrowup'],
        down: ['arrowdown']
      }
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.productPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    },
    listPrice() {
      const pos = this.currentPoint
      if (!isEmptyValue(pos)) {
        return pos.priceList.id
      }
      return 0
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  watch: {
    indexTable(value) {
      this.setCurrent(this.listWithPrice[value])
    },
    showProductSearch(value) {
      this.searchValue = ''
    }
  },
  created() {
    this.loadProductsPricesList()
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPoint)
    }, 1000)
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatPrice,
    formatQuantity,
    getLookupList,
    isDisplayedField,
    isDisplayedDefault,
    generalInfoSearch,
    searchTableHeader,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    show(row) {
      this.isDetail = true
      this.currentLine = row
      this.setStocks(row)
    },
    displayValue(row, column) {
      let value
      switch (column) {
        case 'quantityOnHand':
          value = formatQuantity({ value: row.quantityOnHand })
          break
        case 'quantityAvailable':
          value = formatQuantity({ value: row.quantityAvailable })
          break
        case 'priceStandard':
          value = formatPrice({ value: row.priceStandard, currency: row.currency.iSOCode })
          break
        case 'convertedAmount':
          value = formatPrice({ value: row.schemaPriceStandard, currency: row.schemaCurrency.iSOCode })
          break
        case 'taxAmount':
          value = formatPrice({ value: this.getTaxAmount(row.priceStandard, row.taxRate.rate), currency: row.currency.iSOCode })
          break
        case 'grandTotal':
          value = formatPrice({ value: ((this.getTaxAmount(row.priceStandard, row.taxRate.rate)) + row.priceStandard), currency: row.currency.iSOCode })
          break
        default:
          value = row.product[column]
          break
      }
      return value
    },
    setStocks(row) {
      const listStock = []
      const {
        value,
        sku
      } = row.product
      listStocks({
        posUuid: this.currentPointOfSales.uuid,
        value,
        sku
      })
        .then(response => {
          const list = response.stocks.map(stock => {
            return {
              label: stock.warehouse_name,
              id: stock.warehouse_id,
              uuid: stock.warehouse_uuid,
              attributeName: stock.attribute_name,
              qty: stock.qty,
              sumaryQty: []
            }
          })
          const options = []

          list.forEach(element => {
            if (this.isEmptyValue(options)) {
              options.push({
                ...element
              })
            }
            const currentStock = options.find(stock => stock.id === element.id)
            const index = options.findIndex(stock => stock.id === element.id)
            if (!this.isEmptyValue(currentStock) && !this.isEmptyValue(options)) {
              options[index].qty = currentStock.qty + element.qty
              options[index].sumaryQty.push(element.qty)
            }
            if (this.isEmptyValue(currentStock)) {
              options.push({
                ...element,
                sumaryQty: [element.qty]
              })
            }
          })
          this.listStockProduct = options.map(list => {
            const sumaryQty = list.sumaryQty.reduce((a, b) => a + b, 0)
            return {
              ...list,
              sumaryQty: sumaryQty
            }
          })
        })
      return listStock
    },
    getImageFromSource(keyValue) {
      if (isEmptyValue(keyValue)) {
        return this.defaultImage
      }

      // const image = this.valuesImage.find(item => item.identifier === fileName).value
      const image = this.resource[keyValue]
      if (isEmptyValue(image)) {
        return this.defaultImage
      }
      return image
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.currentRow = val
      this.findPosition(val)
      this.setCurrent(this.currentRow)
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
          this.$store.commit('showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
        case 'down':
          if (this.indexTable < (this.listWithPrice.length - 1)) {
            this.indexTable++
          }
          break
        case 'up':
          if (this.indexTable > 0) {
            this.indexTable--
          }
          break
        case 'options':
          this.$store.commit('setIsReloadProductPrice')
          break
      }
    },
    loadProductsPricesList(searchValue) {
      this.$store.dispatch('listProductPriceFromServer', {
        searchValue
      })
    },
    /**
     * @param {number} newPage
     */
    handleChangePage(newPage) {
      this.$store.dispatch('setProductPicePageNumber', newPage)
      this.$store.dispatch('listProductPriceFromServer', {
        searchValue: this.searchValue
      })
    },
    findlistProductWithRow(row) {
      if (!this.isSelectable) {
        return
      }
      // TODO: Change this dispatch for set values with local methods, to delete subscripton
      this.$store.dispatch('notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: row.product.name
      })

      // close popover of list product price
      this.$store.commit('showListProductPrice', {
        attribute: this.popoverName,
        isShowed: false
      })
    },
    getTaxAmount(basePrice, taxRate) {
      if (isEmptyValue(basePrice) || isEmptyValue(taxRate)) {
        return 0
      }
      return (basePrice * taxRate) / 100
    },
    associatedprocesses(product, report) {
      // report.parametersList.push({ columnName: 'M_Product_ID', value: product }, { columnName: 'M_PriceList_ID', value: this.listPrice })
      // this.$store.dispatch('processOption', {
      //   action: report,
      //   parametersList: report.parametersList,
      //   reportFormat: 'pdf',
      //   routeToDelete: this.$route
      // })
    },
    findPosition(current) {
      const arrow = this.listWithPrice.findIndex(element => {
        if (!this.isEmptyValue(current) && element.product.id === current.product.id) {
          return element
        }
      })
      this.indexTable = arrow
    },
    searchProduct(search) {
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.loadProductsPricesList(search)
      }, 1500)
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
      if (isEmptyValue(PointOfSales)) {
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
    }
  }
}
</script>
<style lang="scss">
.table-product-info {
  max-height: 80%;
  min-height: 80%;
  overflow: auto
}
.scroll-warehouses {
  max-height: 25vh;
}
.el-dialog {
  .el-dialog__header {
    border: 1px solid #d3d4d6;
    background: #FFFFFF;
    padding: 0px;
    font-weight: bold;
    padding-top: 25px;
    border-bottom: 0px;
    padding-bottom: 5px;
  }
}
</style>
