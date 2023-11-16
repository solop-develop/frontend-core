<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <el-form
    label-position="top"
    class="form-min-label"
    inline
    @submit.native.prevent="notSubmitForm"
  >
    <el-form-item
      style="width: 100% !important;display: contents;"
    >
      <template slot="label">
        <span class="label">
          {{ $t('form.productInfo.codeProduct') }}
          <el-popover
            :value="show"
            style="color: black"
            trigger="click"
            width="1250"
            @show="showPopever"
          >
            <product-list-table />
            <el-button
              slot="reference"
              type="text"
              style="color: black"
            >
              <svg-icon icon-class="search" />
            </el-button>
          </el-popover>
        </span>
      </template>
      <el-autocomplete
        v-model="searchProduct"
        popper-class="my-autocomplete"
        :fetch-suggestions="localSearch"
        :placeholder="$t('quickAccess.searchWithEnter')"
        :trigger-on-focus="false"
        :highlight-first-item="true"
        :select-when-unmatched="true"
        style="width: 100% !important;"
        @select="selectProduct"
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
                {{ props.item.priceStandard }}
                <br>
                {{ props.item.quantityAvailable }}
              </p>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import ProductListTable from './ProductListTable'
// utils and helper methods
import {
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/formatValue/numberFormat'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'SearchProduct',
  components: {
    ProductListTable
  },
  setup() {
    const searchProduct = ref('')
    const productList = ref([])
    const isLoading = ref(false)
    const isTrigger = ref(false)
    const order = computed(() => {
      return store.getters.getCurrentOrder
    })

    const show = computed({
      get() {
        return store.getters.getShowProductList
      },
      // setter
      set(show) {
        store.commit('setShowProductList', show)
      }
    })

    function localSearch(search, callBack) {
      if (search !== '') {
        isLoading.value = true
        setTimeout(() => {
          productList.value = []
          store.dispatch('searchProductList', {
            searchValue: search
          })
            .then(response => {
              productList.value = response.map(list => {
                return {
                  ...list,
                  priceStandard: formatPrice({ value: list.priceStandard, currency: list.currency.iSOCode }),
                  quantityAvailable: formatQuantity({ value: list.quantityAvailable })
                }
              })
              callBack(productList.value)
              isLoading.value = false
            })
        }, 200)
      } else {
        this.options = []
      }
    }

    function selectProduct(search) {
      if (
        !isEmptyValue(search) &&
        !isEmptyValue(search.value)
      ) {
        isTrigger.value = true
      }
      if (
        !isEmptyValue(search) &&
        !isEmptyValue(search.product)
      ) {
        isTrigger.value = false
        // store.dispatch('Line' )
        if (isEmptyValue(order.value.id)) {
          store.dispatch('newOrder')
            .then(() => {
              store.dispatch('newLine', {
                productId: search.product.id
              })
            })
        } else {
          store.dispatch('newLine', {
            productId: search.product.id
          })
        }
      }
    }

    function showPopever() {
      show.value = true
    }

    watch(productList, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue.length === 1 && isTrigger.value) {
        selectProduct(newValue[0])
      }
    })

    return {
      isTrigger,
      isLoading,
      productList,
      searchProduct,
      // Computed
      order,
      show,
      // Methods
      showPopever,
      localSearch,
      selectProduct
    }
  }
})
</script>

<style lang="scss" scoped>
.label {
  display: contents;
}
</style>
