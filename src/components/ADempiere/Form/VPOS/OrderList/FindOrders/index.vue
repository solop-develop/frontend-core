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
  <el-container style="height: 80vh;">
    <el-header :style="isMobile ? 'height: 2%;' : 'height: 20%;'">
      <p style="text-align: center;"> <b> {{ data.title }} </b></p>
      <slot name="header" />
    </el-header>

    <el-main>
      <el-table
        v-loading="isLoadingTable"
        :data="dataList"
        style="width: 100%"
        border
        :empty-text="$t('form.byInvoice.emptyList')"
        fit
        highlight-current-row
        @current-change="handleCurrentChange"
        @row-dblclick="selectionChangeOrder"
      >
        <index-column
          :page-number="pageNumber"
        />

        <el-table-column
          prop="documentNo"
          width="155"
        >
          <template slot="header" slot-scope="scope">
            {{ $t('form.byInvoice.documentNo') }}
            <el-button-group
              style="display: inline-grid;vertical-align: inherit;"
            >
              <el-button
                type="text"
                icon="el-icon-caret-top"
                style="margin: 0px;padding: 0px;"
                @click="sortAscendingTable(dataList, scope.column.property)"
              />
              <el-button
                type="text"
                icon="el-icon-caret-bottom"
                style="margin: 0px;padding: 0px;"
                @click="sortDescendingTable(dataList, scope.column.property)"
              />
            </el-button-group>
          </template>
        </el-table-column>

        <el-table-column
          width="155"
        >
          <template slot="header" slot-scope="scope">
            {{ $t('pointOfSales.order.dateOfOrder') }}
            <el-button-group
              style="display: inline-grid;vertical-align: inherit;"
            >
              <el-button
                type="text"
                icon="el-icon-caret-top"
                style="margin: 0px;padding: 0px;"
                @click="sortAscendingDate(dataList, scope.column.property)"
              />
              <el-button
                type="text"
                icon="el-icon-caret-bottom"
                style="margin: 0px;padding: 0px;"
                @click="sortDescendingDate(dataList, scope.column.property)"
              />
            </el-button-group>
          </template>
          <template slot-scope="scope">
            {{ formatDate({ value: scope.row.dateOrdered }) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="businessPartner.name"
          min-width="160"
        >
          <template slot="header">
            {{ $t('form.byInvoice.businessPartner') }}
            <el-button-group
              style="display: inline-grid;vertical-align: inherit;"
            >
              <el-button
                type="text"
                icon="el-icon-caret-top"
                style="margin: 0px;padding: 0px;"
                @click="sortAscendingTable(dataList, 'businessPartner', 'name')"
              />
              <el-button
                type="text"
                icon="el-icon-caret-bottom"
                style="margin: 0px;padding: 0px;"
                @click="sortDescendingTable(dataList, 'businessPartner', 'name')"
              />
            </el-button-group>
          </template>
        </el-table-column>

        <el-table-column
          prop="salesRepresentative.name"
          min-width="170"
        >
          <template slot="header">
            {{ $t('form.byInvoice.salesRepresentative') }}
            <el-button-group
              style="display: inline-grid;vertical-align: inherit;"
            >
              <el-button
                type="text"
                icon="el-icon-caret-top"
                style="margin: 0px;padding: 0px;"
                @click="sortAscendingTable(dataList, 'salesRepresentative', 'name')"
              />
              <el-button
                type="text"
                icon="el-icon-caret-bottom"
                style="margin: 0px;padding: 0px;"
                @click="sortDescendingTable(dataList, 'salesRepresentative', 'name')"
              />
            </el-button-group>
          </template>
        </el-table-column>

        <el-table-column
          width="100"
        >
          <template slot="header">
            {{ $t('page.processActivity.status') }}
            <el-button-group
              style="display: inline-grid;vertical-align: inherit;"
            >
              <el-button
                type="text"
                icon="el-icon-caret-top"
                style="margin: 0px;padding: 0px;"
                @click="sortAscendingTable(dataList, 'documentStatus', 'name')"
              />
              <el-button
                type="text"
                icon="el-icon-caret-bottom"
                style="margin: 0px;padding: 0px;"
                @click="sortDescendingTable(dataList, 'documentStatus', 'name')"
              />
            </el-button-group>
          </template>
          <template slot-scope="scope">
            <document-status-tag
              :value="scope.row.documentStatus.value"
              :displayed-value="scope.row.documentStatus.name"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          width="150"
        >
          <template slot="header">
            {{ $t('form.productInfo.grandTotal') }}
            <el-button-group
              style="display: inline-grid;vertical-align: inherit;"
            >
              <el-button
                type="text"
                icon="el-icon-caret-top"
                style="margin: 0px;padding: 0px;"
                @click="sortAscendingTable(dataList, 'grandTotal')"
              />
              <el-button
                type="text"
                icon="el-icon-caret-bottom"
                style="margin: 0px;padding: 0px;"
                @click="sortDescendingTable(dataList, 'grandTotal')"
              />
            </el-button-group>
          </template>
          <template slot-scope="scope">
            {{ formatPrice({ value: scope.row.grandTotal, currency: scope.row.priceList.currency.iso_code }) }}
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer>
      <slot name="footer" />
    </el-footer>
  </el-container>
</template>

<script>
// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// API Request Methods
import { holdOrder } from '@/api/ADempiere/form/point-of-sales.js'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import { extractPagingToken } from '@/utils/ADempiere/dataUtils'

export default {
  name: 'FindOrders',

  components: {
    DocumentStatusTag,
    IndexColumn
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Find-Orders',
          containerUuid: 'Find-Orders'
        }
      }
    },
    showField: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    dataList: {
      type: Array,
      default: () => []
    },
    isLoadingTable: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showPanel: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      metadataList: {},
      total: 0,
      currentPage: 1,
      tokenPage: '',
      input: '',
      isCustomForm: true,
      businessPartner: '',
      timeOut: null,
      changeOrder: {},
      isloading: true,
      ordersInvoiced: [],
      dateOrdered: '',
      openPopover: false
    }
  },

  computed: {
    highlightRow() {
      if (!this.isEmptyValue(this.selectOrder)) {
        return true
      }
      return false
    },
    selectOrder() {
      const action = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
      if (!this.isEmptyValue(this.ordersInvoiced)) {
        const order = this.ordersInvoiced.find(item => item.uuid === action)
        if (!this.isEmptyValue(order)) {
          return order
        }
      }
      return null
    },
    sortFieldsListOrder() {
      return this.fieldsList.find(field => field.columnName === 'C_BPartner_ID')
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },

  methods: {
    formatDate,
    formatPrice,
    extractPagingToken,
    sortAscendingDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    sortDescendingDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementA.dateOrdered).getTime()) - new Date().setTime(new Date(elementB.dateOrdered).getTime())
      })
    },
    sortDescendingTable(listDate, column, params) {
      return listDate.sort((element, item) => {
        if ((!this.isEmptyValue(params) && element[column][params] > item[column][params]) || element[column] > item[column]) {
          return 1
        }
        if ((!this.isEmptyValue(params) && element[column][params] < item[column][params]) || (element[column] < item[column])) {
          return -1
        }
        return 0
      })
    },
    sortAscendingTable(listDate, column, params) {
      return listDate.sort((element, item) => {
        if ((!this.isEmptyValue(params) && element[column][params] < item[column][params]) || (element[column] < item[column])) {
          return 1
        }
        if ((!this.isEmptyValue(params) && element[column][params] > item[column][params]) || (element[column] > item[column])) {
          return -1
        }
        return 0
      })
    },
    handleCurrentChange(row) {
      // close popover
      this.$store.commit('setQuickSearchOrder', row)
    },
    selectionChangeOrder(row) {
      this.$store.commit('setQuickSearchOrder', row)
      // this.changeOrder = row
      // const posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      // const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      // if (!this.isEmptyValue(this.changeOrder) && this.changeOrder.documentNo !== currentOrder.documentNo) {
      //   this.$store.state['pointOfSales/point/index'].conversionsList = []
      //   this.$store.dispatch('currentOrder', this.changeOrder)
      //   this.$store.dispatch('deleteAllCollectBox')
      //   this.$router.push({
      //     params: {
      //       ...this.$route.params
      //     },
      //     query: {
      //       ...this.$route.query,
      //       action: this.changeOrder.uuid
      //     }
      //   }, () => {})
      //   const orderUuid = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
      //   this.$store.dispatch('listPayments', { posUuid, orderUuid })
      // }
      // if (this.changeOrder.documentStatus.value === 'DR') {
      //   holdOrder({
      //     posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
      //     salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
      //     orderUuid: this.changeOrder.uuid
      //   })
      //     .then(response => {
      //       this.$message.success(this.$t('form.pos.generalNotifications.selectedOrder') + response.documentNo)
      //     })
      //     .catch(error => {
      //       this.$message({
      //         message: error.message,
      //         isShowClose: true,
      //         type: 'error'
      //       })
      //       console.warn(`Error Hold Order ${error.message}. Code: ${error.code}.`)
      //     })
      // }
      const posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (!this.isEmptyValue(this.$store.getters.getQuickSearchOrder) && this.$store.getters.getQuickSearchOrder.documentNo !== currentOrder.documentNo) {
        this.$store.state['pointOfSales/point/index'].conversionsList = []
        this.$store.dispatch('currentOrder', this.$store.getters.getQuickSearchOrder)
        this.$store.dispatch('deleteAllCollectBox')
        this.$router.push({
          params: {
            ...this.$route.params
          },
          query: {
            ...this.$route.query,
            action: this.$store.getters.getQuickSearchOrder.uuid
          }
        }, () => {})
        const orderUuid = this.$store.getters.getQuickSearchOrder.uuid
        this.$store.dispatch('listPayments', { posUuid, orderUuid })
      }
      if (this.$store.getters.getQuickSearchOrder.documentStatus.value === 'DR') {
        holdOrder({
          posUuid,
          salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
          orderUuid: this.$store.getters.getQuickSearchOrder.uuid
        })
          .then(response => {
            this.$message.success(this.$t('form.pos.generalNotifications.selectedOrder') + response.documentNo)
          })
          .catch(error => {
            this.$message({
              message: error.message,
              isShowClose: true,
              type: 'error'
            })
            console.warn(`Error Hold Order ${error.message}. Code: ${error.code}.`)
          })
      }
      this.clear()
    },
    clear() {
      this.$store.commit('setShowsearchToDeliveOrders', false)
      this.input = ''
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'C_BPartner_ID',
        value: undefined
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'DisplayColumn_C_BPartner_ID',
        value: undefined
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Aisle-Vendor-List',
        columnName: 'C_BPartner_ID_UUID',
        value: undefined
      })
    }
  }
}
</script>
