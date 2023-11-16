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
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Socio de Negocios (Punto de Venta)" name="1">
        <el-form
          :inline="true"
          label-position="top"
          style="padding: 0px !important;margin: 0px;"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="Código"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <el-input
                  v-model="value"
                  style="margin: 0px;width: 100%;"
                  @input="filterValue"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="Nombre"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <el-input
                  v-model="name"
                  style="margin: 0px;width: 100%;"
                  @input="filterName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="Valor de la Búsqueda"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <el-input
                  v-model="searchValue"
                  style="margin: 0px;width: 100%;"
                  @input="filterSearchValue"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table
      v-loading="isLoading"
      :data="list"
      height="30vh"
      :border="true"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <index-column
        :page-number="1"
        :page-size="50"
      />
      <el-table-column
        prop="value"
        label="Código"
      />
      <el-table-column
        prop="tax_id"
        label="Número Identificación"
      />
      <el-table-column
        prop="name"
        label="Nombre"
      />
    </el-table>
    <p>
      <custom-pagination
        :total="recordCount"
        style="float: left;"
        :current-page="pageToken"
        :records-page="list.length"
        :handle-change-page="handleChangePage"
        :handle-size-change="handleSizeChange"
      />
      <el-button
        type="primary"
        class="button-base-icon"
        icon="el-icon-check"
        style="float: right;margin-left: 5px;"
        :disabled="isEmptyValue(customer)"
        @click="changeCustomerOrder"
      />
      <el-button
        type="danger"
        class="button-base-icon"
        icon="el-icon-close"
        style="float: right;"
        @click="close()"
      />
    </p>
  </span>
</template>

<script>
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import { isEmptyValue } from '@/utils/ADempiere'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'ListCostumer',
  components: {
    IndexColumn,
    CustomPagination
  },
  setup() {
    const isLoading = ref(false)
    const activeNames = ref('')
    const value = ref('')
    const name = ref('')
    const searchValue = ref('')
    const pageSizeNumber = ref(15)
    const customer = ref({})
    const list = computed(() => {
      return store.getters.getCustomersList
    })
    const recordCount = computed(() => {
      return store.getters.getCustomerCount
    })
    const pageToken = computed(() => {
      const page = store.getters.getCustomerPageToken
      if (page) return (Number(page.slice(-1)) - 1)
      return 0
    })

    /**
     * Handle Current Change
     * @param {object} row
     */
    function handleCurrentChange(row) {
      if (isEmptyValue(row)) return
      customer.value = row
    }

    /**
     * Handle Page Change
     * @param {number} pageNumber
     */
    function handleChangePage(pageNumber) {
      isLoading.value = true
      setTimeout(() => {
        store.dispatch('searchCustomersList', {
          pageSize: pageSizeNumber.value,
          searchValue: searchValue.value,
          name: name.value,
          value: value.value,
          pageToken: pageNumber
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    /**
     * Handle Size Change
     * @param {number} pageSize
     */
    function handleSizeChange(pageSize) {
      isLoading.value = true
      pageSizeNumber.value = pageSize
      setTimeout(() => {
        store.dispatch('searchCustomersList', {
          pageSize: pageSize,
          searchValue: searchValue.value,
          name: name.value,
          value: value.value
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    /**
     * Filter Value
     * @param {string} value
     */
    function filterValue(value) {
      setTimeout(() => {
        store.dispatch('searchCustomersList', {
          searchValue: searchValue.value,
          name: name.value,
          value: value
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    /**
     * Filter Name
     * @param {string} value
     */
    function filterName(value) {
      setTimeout(() => {
        store.dispatch('searchCustomersList', {
          searchValue: searchValue.value,
          name: value,
          value: value.value
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    /**
     * Filter for Search Value
     * @param {string} value
     */
    function filterSearchValue(value) {
      setTimeout(() => {
        store.dispatch('searchCustomersList', {
          searchValue: value,
          name: name.value,
          value: value.value
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    /**
     * Close Panel Create New Customer
     */
    function close() {
      store.commit('setShowCustomerList', false)
    }

    /**
     * Change Business Partner in Order
     */
    function changeCustomerOrder() {
      store.dispatch('changeCustomerOrder', customer.value.id)
        .finally(() => {
          close()
        })
    }

    return {
      // Ref
      name,
      value,
      customer,
      isLoading,
      searchValue,
      activeNames,
      pageSizeNumber,
      // Computed
      recordCount,
      pageToken,
      list,
      // Methods
      close,
      filterName,
      filterValue,
      handleChangePage,
      handleSizeChange,
      filterSearchValue,
      handleCurrentChange,
      changeCustomerOrder
    }
  }
})
</script>

<style lang="scss" scoped>
.label {
  display: contents;
}
</style>
