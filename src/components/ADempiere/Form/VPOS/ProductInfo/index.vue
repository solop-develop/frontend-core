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
  <div>
    <el-form-item @submit.native.prevent="notSubmitForm">
      <template slot="label">
        {{ $t('form.productInfo.codeProduct') }}
        <el-popover
          v-if="!isMobile"
          v-model="isShowProductsPriceList"
          v-shortkey="keyShortcuts"
          placement="bottom-start"
          trigger="click"
          width="1250"
          @shortkey.native="close"
        >
          <el-button
            icon="el-icon-close"
            type="text"
            style="float: right;padding: 1% 1% 0px 0px;font-size: 20px;"
            @click="close"
          />
          <br>

          <product-info-list />

          <el-button
            slot="reference"
            type="text"
            icon="el-icon-search"
            style="color: black"
          />
        </el-popover>
      </template>

      <el-autocomplete
        ref="product"
        v-model="sendProduct"
        v-shortkey="keyShortcuts"
        :placeholder="$t('quickAccess.searchWithEnter')"
        clearable
        style="width: 100%; height: 600px;"
        popper-class="custom-field-prodcut-info"
        :trigger-on-focus="false"
        :validate-event="true"
        :fetch-suggestions="localSearch"
        :select-when-unmatched="true"
        :highlight-first-item="false"
        @keyup.native="enterKey"
        @focus="searchFocus"
        @shortkey.native="shortcutKeyMethod"
        @select="handleSelect"
        @clear="clearProductPriceList"
      >
        <template slot="prefix">
          <svg-icon
            icon-class="shopping"
            class="el-input__icon"
          />
        </template>

        <template slot-scope="props">
          <div class="header" style="margin: 0px">
            <b> {{ props.item.product.value }} - {{ props.item.product.name }} </b>
          </div>
          <div style="margin: 0px">
            <div style="float: left;width: 70%;margin: 0px">
              <p style="overflow: hidden;text-overflow: ellipsis;text-align: inherit;margin: 0px">
                {{ props.item.product.upc }} <br>
                {{ props.item.product.description }}
              </p>
            </div>
            <div style="width: 30%;float: right;margin: 0px">
              <p style="overflow: hidden;text-overflow: ellipsis;text-align: end;margin: 0px">
                {{ formatPrice({ value: props.item.priceStandard, currency: props.item.currency.iSOCode }) }}
                <br>
                {{ formatQuantity({ value: props.item.quantityAvailable }) }}
              </p>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
  </div>
</template>

<script>
// Components and Mixins
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import ProductInfoList from './productList'
// import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'

// Utils and Helper Methods
import {
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/formatValue/numberFormat'

/**
 * This component is made to be the prototype of the Product Info search field
 */
export default {
  name: 'ProductPriceInfo',

  components: {
    ProductInfoList
  },

  mixins: [
    // fieldMixin,
    posMixin
  ],

  props: {
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        changeFieldShowedFromUser: () => {},
        getFieldsLit: () => {},
        isDisplayedField: () => { return true },
        isMandatoryField: () => { return true },
        isReadOnlyField: () => { return false },
        setDefaultValues: () => {}
      })
    }
  },

  data() {
    return {
      visible: false,
      KeyPerformed: false,
      sendProduct: '',
      timeOut: null,
      timeOutProduct: null
    }
  },

  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isShowProductsPriceList: {
      get() {
        return this.$store.getters.getShowProductPriceList
      },
      set(isShowed) {
        this.$store.commit('setIsShowListProductPrice', isShowed)
      }
    },
    listWithPrice() {
      const { productPricesList } = this.$store.getters.getProductPrice
      if (!this.isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    },
    keyShortcuts() {
      return {
        refreshList: ['f5'],
        refreshList2: ['shift', 'f5'],
        closeProductList: ['esc']
      }
    },
    getProductValue() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'POS',
        columnName: 'ProductValue'
      })
    }
  },

  watch: {
    getProductValue(value) {
      this.sendProduct = value
    },
    sendProduct(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        value
      })
    }
  },

  beforeMount() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    formatPrice,
    formatQuantity,
    shortcutKeyMethod(event) {
      switch (event.srcKey) {
        case 'refreshList':
        case 'refreshList2':
          this.$store.dispatch('listProductPriceFromServer', {})
          break
        case 'closeProductList':
          this.isShowProductsPriceList = false
          break
      }
    },
    enterKey(event) {
      // TODO: Implement key enter event.
    },
    searchFocus() {
      if (this.isEmptyValue(this.sendProduct) || this.listWithPrice.length <= 1) {
        this.$refs.product.close()
      } else {
        this.$refs.product.getData()
      }
    },
    localSearch(stringToMatch, callBack) {
      this.$refs.product.activated = true
      let results = this.listWithPrice
      if (!this.isEmptyValue(stringToMatch)) {
        // const parsedValue = stringToMatch.toLowerCase().trim()

        // results = results.filter(rowProduct => {
        //   const productAttributes = rowProduct.product
        //   for (const columnProductPrice in productAttributes) {
        //     const valueToCompare = String(productAttributes[columnProductPrice]).toLowerCase()
        //     if (valueToCompare.includes(parsedValue)) {
        //       return true
        //     }
        //   }
        //   return false
        // })
        // // Remote search
        if (stringToMatch.length > 2) {
          results = []
        }
        if (stringToMatch.length > 2) {
          (this.timeOut)
          this.timeOut = setTimeout(() => {
            this.$store.dispatch('listProductPriceFromServer', {
              pageNumber: 1,
              searchValue: stringToMatch
            })
              .then(() => {
                const recordsList = this.listWithPrice

                if (this.isEmptyValue(recordsList)) {
                  this.$message({
                    message: this.$t('notifications.searchWithOutRecords'),
                    type: 'info',
                    showClose: true
                  })
                }
                this.KeyPerformed = true
                callBack(this.orderedByProduct(recordsList))
              })
          }, 1500)
          return
        }
      }
      if (this.isEmptyValue(this.sendProduct) || results.length <= 1) {
        this.$refs.product.activated = false
      }
      this.KeyPerformed = true
      // call callback function to return suggestions
      callBack(this.orderedByProduct(results))
    },
    close() {
      this.isShowProductsPriceList = false
    },
    handleSelect(elementSelected) {
      const valueProduct = this.isEmptyValue(elementSelected.product) ? elementSelected.value : elementSelected.product.value
      this.$store.dispatch('notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: valueProduct
      })
      this.sendProduct = ''
      if (this.allowsCreateOrder) {
        this.findProduct(valueProduct)
      } else {
        this.sendProduct = ''
        const attributePin = {
          columnName: 'ProductValue',
          value: valueProduct,
          type: 'addProduct',
          requestedAccess: 'IsAllowsCreateOrder',
          label: this.$t('form.pos.pinMessage.addProduct')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
      }
      this.sendProduct = ''
      this.$refs.product.focus()
      this.KeyPerformed = false
    },
    orderedByProduct(productList) {
      return productList.sort((element, item) => {
        if (element.product.name > item.product.name) {
          return 1
        }
        if (element.product.name < item.product.name) {
          return -1
        }
        // a must be equal to b
        return 0
      })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // TODO: Add container uuid comparison
        if (mutation.type === 'addActionKeyPerformed') {
          this.KeyPerformed = false
        } else if (mutation.type === 'updateValueOfField' && mutation.payload.columnName === 'ProductValue') {
          clearTimeout(this.timeOutProduct)
          this.timeOutProduct = setTimeout(() => {
            if (this.listWithPrice.length === 1 && this.KeyPerformed && !this.isEmptyValue(this.sendProduct)) {
              const productSelected = this.listWithPrice.at()
              this.$message({
                message: this.$t('form.productInfo.addProduct') + productSelected.product.name,
                type: 'success',
                showClose: true
              })
              this.handleSelect(productSelected)
            }
          }, 3000)
        }
      })
    },
    clearProductPriceList() {
      this.$store.commit('setListProductPrice', {
        isLoaded: true,
        productPricesList: []
      })
    }
  }
}
</script>

<style lang="scss" scope>
  .transition-box {
    z-index: 3;
    position: absolute;
    width: 800px;
    left: 15%;
  }
  .el-autocomplete-suggestion {
    position: absolute;
    top: 179px;
    left: 105px;
    transform-origin: center top;
    z-index: 2033;
    width: 849px;
    max-height: 400px;
  }
  .custom-field-prodcut-info {
    li {
      line-height: normal;
      padding-bottom: 15px;
      padding-top: 5px;
      padding-right: 15px;
      padding-left: 15px;

      .header {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: initial;
      }

      .upc {
        color: #7e7e7e;
        padding-top: 10px;
        float: left;
      }
      .description {
        padding-top: 10px;
        float: left;
      }
      .price {
        color: #7e7e7e;
        padding-top: 10px;
        float: right;
        padding-right: 10px;
      }
      .quantityAvailable {
        float: right;
        padding-top: 10px;
      }
    }
  }
</style>
