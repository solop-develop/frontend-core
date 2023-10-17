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
  <span>
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
            {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
            <el-dropdown
              trigger="click"
            >
              <span class="el-dropdown-link">
                <svg-icon icon-class="tree-table" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="$t('pointOfSales.customer.newBusinessPartner')"
                >
                  {{ $t('pointOfSales.customer.newBusinessPartner') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :command="$t('pointOfSales.customer.listBusinessPartners')"
                >
                  {{ $t('pointOfSales.customer.listBusinessPartners') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </template>
        <el-autocomplete
          v-model="searchCustomer"
          popper-class="my-autocomplete"
          :fetch-suggestions="localSearch"
          :placeholder="$t('quickAccess.searchWithEnter')"
          :trigger-on-focus="false"
          :highlight-first-item="true"
          :select-when-unmatched="true"
          style="width: 100% !important;"
          @blur="blurCustomer"
          @select="selectCustomer"
        >
          <template slot="prefix">
            <svg-icon
              icon-class="shopping"
              class="el-input__icon"
            />
          </template>
          <template slot-scope="props">
            <div class="header" style="margin: 0px">
              <b> {{ props.item.name }} {{ props.item.lastName }} </b>
            </div>
            <div style="margin: 0px">
              <div style="float: left;width: 70%;margin: 0px">
                <p style="overflow: hidden;text-overflow: ellipsis;text-align: inherit;margin: 0px">
                  {{ props.item.value }}
                </p>
              </div>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <!-- <el-dialog
      :modal="false"
      :title="currentOptions"
      :center="true"
      :visible.sync="isShowCustomer"
      :custom-class="'option-customer'"
      width="75%"
    >
      <component
        :is="isComponentRender"
        v-if="!isEmptyValue(isComponentRender)"
      />
    </el-dialog> -->
  </span>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'
// import language from '@/lang'
import store from '@/store'
// Components and Mixins
import NewCustomer from './NewCustomer'
// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'searchCustomer',
  components: {
    NewCustomer
  },
  setup() {
    const searchCustomer = ref('')
    const currentOptions = ref('')
    const listCustomer = ref([])
    const isLoading = ref(false)
    const isTrigger = ref(false)
    const order = computed(() => {
      // return store.getters.getPoint.order
      return {}
    })

    const pos = computed(() => {
      return store.getters.getVPOS
      // return {}
    })

    const isShowCustomer = computed({
      get() {
        return store.getters.getShowCustomer
      },
      // setter
      set(show) {
        store.commit('setShowCustomer', show)
      }
    })

    // const isComponentRender = computed(() => {
    //   // if (currentOptions.value === language.t('pointOfSales.customer.newBusinessPartner')) return () => import('@/components/ADempiere/Form/NewVPOS/HeaderOrder/Customer/NewCustomer.vue')
    //   // if (currentOptions.value === language.t('pointOfSales.customer.listBusinessPartners')) return () => import('@/components/ADempiere/Form/NewVPOS/HeaderOrder/Customer/ListCustomer.vue')
    //   // if (currentOptions.value === language.t('pointOfSales.customer.updateBusinessPartner')) return () => import('@/components/ADempiere/Form/NewVPOS/HeaderOrder/Customer/NewCustomer.vue')
    //   // if (currentOptions.value === language.t('form.pos.order.BusinessPartnerCreate.address.addNewAddress')) return () => import('@/components/ADempiere/Form/NewVPOS/HeaderOrder/Customer/NewCustomer.vue')
    //   // return () => import('@/components/ADempiere/Form/NewVPOS/HeaderOrder/Customer/ListCustomer.vue')
    //   return () => import('../Customer/ListCostumer.vue')
    // })

    // Methods

    function localSearch(search, callBack) {
      if (search !== '') {
        isLoading.value = true
        setTimeout(() => {
          listCustomer.value = []
          store.dispatch('listCustomer', {
            searchValue: search
          })
            .then(response => {
              listCustomer.value = response
              callBack(listCustomer.value)
              isLoading.value = false
            })
        }, 200)
      } else {
        this.options = []
      }
    }

    function selectCustomer(search) {
      searchCustomer.value = search.name
    }

    function blurCustomer() {
      if (!isEmptyValue(searchCustomer.value)) {
        searchCustomer.value
        return
      }
      if (
        !isEmptyValue(order.value) &&
        !isEmptyValue(order.value.customer)
      ) {
        searchCustomer.value = order.value.customer.name
        return
      }
      if (!isEmptyValue(pos.value)) {
        searchCustomer.value = pos.value.templateCustomer.name
        return
      }
    }

    function selectOptions(options) {
      currentOptions.value = options
      store.commit('setShowCustomer', true)
    }

    // function OptionCustomer() {
    //   return 'option-customer'
    // }

    watch(listCustomer, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue.length === 1 && isTrigger.value) {
        selectCustomer(newValue[0])
      }
    })

    if (
      !isEmptyValue(order.value) &&
      !isEmptyValue(order.value.customer)
    ) {
      searchCustomer.value = order.value.customer.name
    }
    if (!isEmptyValue(pos.value)) {
      searchCustomer.value = pos.value.templateCustomer.name
    }

    return {
      isTrigger,
      isLoading,
      listCustomer,
      searchCustomer,
      currentOptions,
      // Computed
      // isComponentRender,
      isShowCustomer,
      order,
      pos,
      // Methods
      localSearch,
      blurCustomer,
      selectOptions,
      selectCustomer
      // OptionCustomer
    }
  }
})
</script>

<style lang="scss">
.label {
  display: contents;
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
