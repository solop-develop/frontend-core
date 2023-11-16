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
              @command="selectOptions"
            >
              <span class="el-dropdown-link">
                <svg-icon icon-class="tree-table" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="$t('pointOfSales.customer.newBusinessPartner')"
                >
                  <i
                    class="el-icon-plus"
                    style="font-size: 20px"
                  />
                  {{ $t('pointOfSales.customer.newBusinessPartner') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :command="$t('pointOfSales.customer.listBusinessPartners')"
                >
                  <i
                    class="el-icon-search"
                    style="font-size: 20px"
                  />
                  {{ $t('pointOfSales.customer.listBusinessPartners') }}
                </el-dropdown-item>
                <el-dropdown-item
                  :command="$t('pointOfSales.customer.updateBusinessPartner')"
                >
                  <i
                    class="el-icon-edit"
                    style="font-size: 22px"
                  />
                  {{ $t('pointOfSales.customer.updateBusinessPartner') }}
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
    <el-dialog
      :title="currentOptions"
      :center="true"
      :modal="false"
      :visible.sync="isShowCustomer"
      :custom-class="'option-customer'"
      class="panel-customer-new"
      width="75%"
    >
      <component
        :is="isComponentRender"
      />
    </el-dialog>
  </span>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'
import language from '@/lang'
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
    // Ref

    const searchCustomer = ref('')
    const currentOptions = ref('')
    const listCustomer = ref([])
    const isLoading = ref(false)
    const isTrigger = ref(false)
    const componentDialog = ref()

    // Computed

    const currentVPOS = computed(() => {
      return store.getters.getVPOS
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const isShowCustomer = computed({
      get() {
        return store.getters.getShowCustomerList
      },
      // setter
      set(show) {
        store.commit('setShowCustomerList', show)
      }
    })

    const isComponentRender = computed(() => {
      return componentDialog.value
    })

    // Methods

    function localSearch(search, callBack) {
      if (search !== '') {
        isLoading.value = true
        setTimeout(() => {
          listCustomer.value = []
          store.dispatch('searchCustomersList', {
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
      if (!isEmptyValue(currentOrder.value.id)) {
        store.dispatch('updateCurrentOrder', {
          customer_id: search.id
        })
      }
    }

    function blurCustomer() {
      if (!isEmptyValue(currentOrder.value.id)) {
        const { customer } = currentOrder.value
        searchCustomer.value = customer.value + ' - ' + customer.name
        return
      }
      if (!isEmptyValue(currentVPOS.value.id)) {
        const { template_customer } = currentVPOS.value
        if (isEmptyValue(template_customer)) return
        searchCustomer.value = template_customer.value + ' - ' + template_customer.name
        return
      }
    }

    function selectOptions(options) {
      if (options === language.t('pointOfSales.customer.listBusinessPartners')) {
        store.dispatch('searchCustomersList', {})
        componentDialog.value = () => import('../Customer/ListCostumer')
        isShowCustomer.value = true
      } else if (options === language.t('pointOfSales.customer.newBusinessPartner')) {
        const {
          is_allows_create_customer
        } = currentVPOS.value
        if (!is_allows_create_customer) {
          store.dispatch('setModalPin', {
            title: language.t('form.pos.pinMessage.pin') + language.t('pointOfSales.customer.newBusinessPartner'),
            doneMethod: () => {
              store.dispatch('newOrder')
            },
            requestedAccess: 'isAllowsCreateCustomer',
            isShowed: true
          })
          return
        }
        componentDialog.value = () => import('../Customer/NewCustomer')
        isShowCustomer.value = true
      } else if (options === language.t('pointOfSales.customer.updateBusinessPartner')) {
        const {
          is_allows_modify_customer
        } = currentVPOS.value
        if (!is_allows_modify_customer) {
          store.dispatch('setModalPin', {
            title: language.t('form.pos.pinMessage.pin') + language.t('pointOfSales.customer.updateBusinessPartner'),
            doneMethod: () => {
              store.dispatch('newOrder')
            },
            requestedAccess: 'isAllowsModifyCustomer',
            isShowed: true
          })
          return
        }
        componentDialog.value = () => import('../Customer/UpdateCustomer')
        isShowCustomer.value = true
      }
      currentOptions.value = options
    }

    watch(currentOrder, (newValue) => {
      if (!isEmptyValue(newValue)) {
        blurCustomer()
      }
    })
    watch(currentVPOS, (newValue) => {
      if (!isEmptyValue(newValue)) {
        blurCustomer()
      }
    })

    return {
      isTrigger,
      isLoading,
      listCustomer,
      searchCustomer,
      currentOptions,
      componentDialog,
      // Computed
      isComponentRender,
      isShowCustomer,
      currentOrder,
      currentVPOS,
      // Methods
      blurCustomer,
      selectOptions,
      selectCustomer,
      localSearch
      // OptionCustomer
    }
  }
})
</script>

<style lang="scss">
.label {
  display: contents;
}

.panel-customer-new {
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
  .el-dialog--center .el-dialog__body {
    padding: 5px 15px 10px 15px !important;
  }
}
</style>
