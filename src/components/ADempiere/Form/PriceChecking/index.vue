<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <div
    style="height: 100% !important;"
    @click="focusProductValue"
  >
    <img
      fit="contain"
      :src="defaultImage"
      class="background-price-checking"
      style="z-index: 5;position: absolute;"
      @click="focusProductValue"
    >
    <el-input
      ref="fieldSearchValue"
      v-model="searchValue"
      :autofocus="true"
      style="z-index: 1;position: absolute;"
      @input="searchProduct"
    />
    <div v-if="!isEmptyValue(productPrice)" class="inquiry-product" style="z-index: 6;">
      <div class="product-description">
        <b> {{ productPrice.product.value }} {{ productPrice.product.name }}</b>
        <br> {{ productPrice.product.description }}
      </div>
      <el-row v-if="!isEmptyValue(productPrice)" :gutter="20">
        <el-col v-if="productPrice.is_tax_included" :span="24" style="padding-left: 0px; padding-right: 0%;">
          <div class="product-price amount">
            <span style="float: right;"> {{ formatPrice(productPrice.price_standard, productPrice.currency.iso_code) }} </span> <br>
          </div>
        </el-col>
        <el-col v-else :span="24" style="padding-left: 0px; padding-right: 0%;">
          <span>
            <div class="product-price-base">
              {{ $t('form.priceChecking.basePrice') }}
              <span class="amount">
                {{ formatPrice(Number(productPrice.price_list), productPrice.currency.iso_code) }}
                <!-- {{ formatPrice(productPrice.price_standard, productPrice.currency.iso_code) }} -->
              </span>
            </div>
            <br><br><br>

            <div class="product-tax">
              {{ productPrice.tax_rate.name }}
              <span class="amount">
                {{ formatPrice(getTaxAmount(productPrice.price_list, productPrice.tax_rate.rate), productPrice.currency.iso_code) }}
              </span>
            </div>
          </span>
          <br><br><br>
          <div class="product-price amount">
            <span style="float: right;"> {{ formatPrice(getGrandTotal(productPrice.price_list, productPrice.tax_rate.rate), productPrice.currency.iso_code) }} </span> <br>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="inquiry-product" style="z-index: 4;">
      <el-row v-if="!isEmptyValue(messageError)" :gutter="20">
        <el-col style="padding-left: 0px; padding-right: 0%;">
          <div class="product-price amount">
            {{ $t('form.priceChecking.productNotFound') }}
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// methods and helpers
import lang from '@/lang'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
// import { getImagePath } from '@/utils/ADempiere/resource.js'
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'PriceChecking',

  props: {
    parentUuid: {
      type: String,
      default: undefined
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

  setup() {
    // Ref
    const searchValue = ref('')
    const timeoutSearch = ref(null)
    const fieldSearchValue = ref(null)
    const productPrice = ref({})
    const messageError = ref('')
    // Computed
    const defaultImage = computed(() => {
      return require('@/image/ADempiere/priceChecking/no-image.jpg')
    })

    function focusProductValue() {
      setTimeout(() => {
        fieldSearchValue.value.focus()
      }, 200)
    }

    function searchProduct(search) {
      clearTimeout(timeoutSearch.value)
      timeoutSearch.value = setTimeout(() => {
        store.dispatch('searchProductList', {
          searchValue: search
        })
          .then(response => {
            productPrice.value = response[0]
          })
          .catch(() => {
            messageError.value = lang.t('form.priceChecking.productNotFound')
          })
          .finally(() => {
            searchValue.value = ''
            focusProductValue()
          })
      }, 500)
    }

    function getGrandTotal(basePrice, taxRate) {
      if (isEmptyValue(basePrice)) {
        return 0
      }
      return Number(basePrice) + getTaxAmount(basePrice, taxRate)
    }

    function getTaxAmount(basePrice, taxRate) {
      if (isEmptyValue(basePrice) || isEmptyValue(taxRate)) {
        return 0
      }
      return (Number(basePrice) * Number(taxRate)) / 100
    }

    focusProductValue()

    return {
      searchValue,
      defaultImage,
      productPrice,
      messageError,
      timeoutSearch,
      fieldSearchValue,
      focusProductValue,
      getGrandTotal,
      searchProduct,
      getTaxAmount,
      formatPrice
    }
  }
})
</script>

<style lang="scss" scoped>
  .background-price-checking {
    width: 100%;
    height: 100%;
    float: inherit;
    background: white;
    // color: white;
    // opacity: 0.5;
  }

  .product-description {
    color: #32363a;
    font-size: 40px;
    font-weight: 900;
    float: right;
    padding-bottom: 1%;
    text-align: end;

  }
  .product-price-base, .product-tax {
    font-size: 30px;
    float: right;
  }
  .product-price {
    padding-top: 15px;
    font-size: 50px;
    float: right;
  }
  .rate-date {
    padding-top: 30%;
    font-size: 50px;
    float: right;
    color: black;
    font-weight: bold;
    text-align: end;
  }
  .inquiry-form {
    // position: absolute;
    position: inherit;
    right: 5%;
    width: 100%;
    top: 10%;
    z-index: 0;
  }
  .inquiry-product {
    position: absolute;
    right: 10%;
    top: 33%;
    .amount {
      color: black;
      font-weight: bold;
    }
  }
</style>
<style lang="scss">
  .price-inquiry {
    input {
      color: #606266 !important;
      font-size: 100% !important;
    }
  }
  .product-value {
    float: right;
    padding-right: 0% !important;
    z-index: 0;
    .el-form-item__label {
      font-size: 15px !important;
      color: #000 !important;
    }
  }

  .el-aside {
    background: white;
    width: 60%;
    overflow: hidden;
  }

  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 0px !important;
  }
</style>
