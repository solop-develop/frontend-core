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
    <el-table
      v-loading="isLoading"
      :data="dataList"
      style="width: 100%"
      height="45vh"
      :border="true"
      :empty-text="$t('form.byInvoice.emptyList')"
      highlight-current-row
      @row-dblclick="selectOrder"
      @current-change="handleCurrentChangeOrder"
    >
      <index-column
        :page-number="1"
        :page-size="pageSizeNumber"
      />

      <el-table-column
        prop="document_no"
        width="155"
        :label="$t('form.byInvoice.documentNo')"
      />

      <el-table-column
        width="155"
        :label="$t('pointOfSales.order.dateOfOrder')"
      >
        <template slot-scope="scope">
          {{ formatDate({ value: scope.row.date_ordered }) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="customer.name"
        min-width="160"
        :label="$t('form.byInvoice.businessPartner')"
      />

      <el-table-column
        prop="sales_representative.name"
        min-width="170"
        :label="$t('form.byInvoice.salesRepresentative')"
      />

      <el-table-column
        width="100"
        :label="$t('page.processActivity.status')"
      >
        <template slot-scope="scope">
          <document-status-tag
            :value="scope.row.document_status.value"
            :displayed-value="scope.row.document_status.name"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="150"
        :label="$t('form.productInfo.grandTotal')"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.grand_total.value, currency: scope.row.price_list.currency.iso_code }) }}
        </template>
      </el-table-column>
    </el-table>
    <p>
      <custom-pagination
        :total="recordCount"
        style="float: left;"
        :selection="selection"
        :current-page="pageToken"
        :records-page="dataList.length"
        :handle-change-page="handleChangePage"
        :handle-size-change="handleSizeChange"
      />
      <el-button
        type="primary"
        class="button-base-icon"
        icon="el-icon-check"
        style="float: right;margin-left: 5px;"
        :disabled="isEmptyValue(currentOrder)"
        @click="setSelectedOrder()"
      />
      <el-button
        type="danger"
        class="button-base-icon"
        icon="el-icon-close"
        style="float: right;"
        @click="close(false)"
      />
    </p>
  </span>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
import store from '@/store'
// import language from '@/lang'
// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'ListOrders',
  components: {
    DocumentStatusTag,
    CustomPagination,
    IndexColumn
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchParameters: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const selection = ref(0)
    const currentOrder = ref({})
    const pageSizeNumber = ref(15)

    const isLoading = computed(() => {
      return store.getters.getLoadingRecord
    })

    const recordCount = computed(() => {
      return store.getters.getOrderRecords.recordCount
    })

    const pageToken = computed(() => {
      const page = store.getters.getOrderRecords.pageToken
      if (page) return Number(page.slice(-1)) - 1
      return 0
    })

    const dataListOrders = computed(() => {
      const { list } = store.getters.getOrderRecords
      if (!isEmptyValue(list)) return list
      return []
    })

    /**
     * Close Modal the Record Orders
     * @param {boolean} show
     */
    function close(show = false) {
      store.commit('setShowQuickOptions', show)
    }

    /**
     * Records Selections
     * @param {object} order
     */
    function handleCurrentChangeOrder(order) {
      if (!isEmptyValue(order)) selection.value = 1
      currentOrder.value = order
    }

    function selectOrder(order) {
      currentOrder.value = order
      setSelectedOrder()
    }

    /**
     * Set Select Order
     */
    function setSelectedOrder() {
      const storeCurrentOrder = store.getters.getCurrentOrder
      if (!isEmptyValue(storeCurrentOrder)) {
        store.dispatch('releaseCurrentOrder', {
          order: storeCurrentOrder
        })
          .then(() => {
            store.dispatch('holdCurrentOrder', {
              order: currentOrder.value
            })
          })
        close(false)
        return
      }
      store.dispatch('holdCurrentOrder', {
        order: currentOrder.value
      })
      close(false)
    }

    function handleChangePage(pageNumber) {
      setTimeout(() => {
        store.dispatch('listOrder', {
          ...props.searchParameters,
          pageSize: pageSizeNumber.value,
          pageToken: store.getters.getOrderRecords.pageToken + '-' + pageNumber
        })
      }, 500)
    }

    function handleSizeChange(pageSize) {
      pageSizeNumber.value = pageSize
      setTimeout(() => {
        store.dispatch('listOrder', {
          ...props.searchParameters,
          pageSize: pageSize
        })
      }, 500)
    }

    return {
      selection,
      pageToken,
      isLoading,
      recordCount,
      currentOrder,
      pageSizeNumber,
      dataListOrders,
      close,
      formatDate,
      formatPrice,
      selectOrder,
      setSelectedOrder,
      handleSizeChange,
      handleChangePage,
      handleCurrentChangeOrder
    }
  }
})
</script>

<style lang="scss" scoped>
.order-info {
  float: right;
}
.total {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
}
</style>
