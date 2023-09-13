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
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ $t('pointOfSales.order.showHistoryOrdersList') }}
        </template>
        <el-form
          v-if="!isEmptyValue(sortFieldsListOrder)"
          label-position="top"
          label-width="10px"
          @submit.native.prevent="notSubmitForm"
        >
          <field-definition
            v-for="(field) in sortFieldsListOrder"
            :key="field.columnName"
            :metadata-field="field"
            :container-uuid="'Orders-List'"
            :container-manager="{
              ...containerManager,
              getLookupList,
              isDisplayedField,
              isDisplayedDefault,
              generalInfoSearch,
              searchTableHeader,
              isMandatoryField,
              isReadOnlyField,
              changeFieldShowedFromUser
            }"
          />
        </el-form>
        <div
          v-else
          key="form-loading"
          v-loading="isEmptyValue(sortFieldsListOrder)"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          class="loading-panel"
        />
      </el-collapse-item>
    </el-collapse>
    <el-table
      ref="orderTable"
      v-shortkey="shortsKey"
      :data="sortTableOrderList"
      :border="true"
      :empty-text="$t('form.byInvoice.emptyList')"
      fit
      highlight-current-row
      height="550"
      @shortkey.native="keyAction"
      @current-change="handleCurrentChange"
      @row-dblclick="selectionChangeOrder"
    >
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
              @click="sortAscendingTable(sortTableOrderList, scope.column.property)"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, scope.column.property)"
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
              @click="sortAscendingTable(sortTableOrderList, 'documentStatus', 'name')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'documentStatus', 'name')"
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
              @click="sortAscendingTable(sortTableOrderList, 'salesRepresentative', 'name')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'salesRepresentative', 'name')"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
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
              @click="sortAscendingTable(sortTableOrderList, 'businessPartner', 'name')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'businessPartner', 'name')"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          {{ scope.row.businessPartner.name }}
        </template>
      </el-table-column>

      <el-table-column
        width="155"
      >
        <template slot="header">
          {{ $t('pointOfSales.order.dateOfOrder') }}
          <el-button-group
            style="display: inline-grid;vertical-align: inherit;"
          >
            <el-button
              type="text"
              icon="el-icon-caret-top"
              style="margin: 0px;padding: 0px;"
              @click="sortAscendingDate(sortTableOrderList)"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingDate(sortTableOrderList)"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          {{ formatDate({ value: scope.row.dateOrdered }) }}
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
              @click="sortAscendingTable(sortTableOrderList, 'grandTotal')"
            />
            <el-button
              type="text"
              icon="el-icon-caret-bottom"
              style="margin: 0px;padding: 0px;"
              @click="sortDescendingTable(sortTableOrderList, 'grandTotal')"
            />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.grandTotal, currency: scope.row.priceList.currency.iso_code }) }}
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="24" class="orders-list-footer">
      <el-col :span="18">
        <custom-pagination
          :total="ordersList.recordCount"
          :current-page="ordersList.pageNumber"
          :handle-change-page="handleChangePage"
          :records-page="sortTableOrderList.length"
        />
      </el-col>

      <el-col :span="6">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            :loading="!ordersList.isLoaded || isLoadRecord"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            size="small"
            @click="loadOrdersList();"
          />
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            size="small"
            @click="clear"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            size="small"
            @click="selectionChangeOrder"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// Constants
import fieldsListOrders from './fieldsListOrders.js'

// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'

// API Request Methods
import { holdOrder } from '@/api/ADempiere/form/point-of-sales.js'

// Utils and Helper Methods
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
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default {
  name: 'OrdersList',

  components: {
    CustomPagination,
    DocumentStatusTag,
    FieldDefinition
  },

  mixins: [
    posMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Orders-List',
          containerUuid: 'Orders-List'
        }
      }
    },
    showField: {
      type: Boolean,
      default: false
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
      fieldsList: fieldsListOrders,
      metadataList: [],
      isLoadRecord: false,
      isCustomForm: true,
      changeOrder: {},
      activeAccordion: 'query-criteria',
      timeOut: null
    }
  },

  computed: {
    heightTable() {
      if (isEmptyValue(this.activeAccordion)) {
        return 600
      }
      return 350
    },
    highlightRow() {
      if (!isEmptyValue(this.selectOrder)) {
        return true
      }
      return false
    },
    selectOrder() {
      const action = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
      if (!isEmptyValue(this.ordersList.ordersList)) {
        const order = this.ordersList.ordersList.find(item => item.uuid === action)
        if (!isEmptyValue(order)) {
          return order
        }
      }
      return null
    },
    valuesField() {
      const values = this.$store.getters.getValuesView({
        containerUuid: 'Orders-List',
        format: 'object'
      })
      return values
    },
    isReadyFromGetData() {
      const { isReload } = this.ordersList
      return isReload
    },
    shortsKey() {
      return {
        closeOrdersList: ['esc'],
        refreshList: ['f5']
      }
    },
    sortFieldsListOrder() {
      return this.sortfield(this.metadataList)
    },
    sortTableOrderList: {
      get() {
        if (isEmptyValue(this.ordersList.ordersList)) {
          return []
        }
        return this.ordersList.ordersList
      },
      set(value) {
        return value
      }

    }
  },

  watch: {
    showField(value) {
      if (value && isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    },
    sortTableOrderList(value) {
      this.isLoadRecord = false
    },
    valuesField(values) {
      this.loadOrdersList()
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
    if (this.isReadyFromGetData) {
      this.loadOrdersList()
    }
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    formatDate,
    formatPrice,
    getLookupList,
    isDisplayedField,
    generalInfoSearch,
    searchTableHeader,
    isDisplayedDefault,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    createFieldFromDictionary,
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
        if ((!isEmptyValue(params) && element[column][params] > item[column][params]) || element[column] > item[column]) {
          return 1
        }
        if ((!isEmptyValue(params) && element[column][params] < item[column][params]) || (element[column] < item[column])) {
          return -1
        }
        return 0
      })
    },
    sortAscendingTable(listDate, column, params) {
      return listDate.sort((element, item) => {
        if ((!isEmptyValue(params) && element[column][params] < item[column][params]) || (element[column] < item[column])) {
          return 1
        }
        if ((!isEmptyValue(params) && element[column][params] > item[column][params]) || (element[column] > item[column])) {
          return -1
        }
        return 0
      })
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          this.loadOrdersList()
          break

        case 'closeOrdersList':
          this.$store.commit('showListOrders', false)
          break
      }
    },
    loadOrdersList(pageNumber = 0) {
      const point = this.$store.getters.posAttributes.currentPointOfSales.uuid
      if (!isEmptyValue(point)) {
        // this.$store.commit('setListOrder', {
        //   isLoaded: false,
        //   ordersList: this.sortTableOrderList,
        //   isReload: true,
        //   posUuid: point
        // })
        this.isLoadRecord = true
        this.$store.dispatch('listOrdersFromServer', {
          posUuid: point,
          pageNumber
        })
          .finally(() => {
            this.isLoadRecord = false
          })
      }
    },
    handleChangePage(pageNumber) {
      this.loadOrdersList(pageNumber)
    },
    handleCurrentChange(row) {
      this.changeOrder = row
    },
    selectionChangeOrder() {
      const posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (!isEmptyValue(this.changeOrder) && this.changeOrder.documentNo !== currentOrder.documentNo) {
        this.$store.state['pointOfSales/point/index'].conversionsList = []
        this.$store.dispatch('currentOrder', this.changeOrder)
        this.$store.dispatch('deleteAllCollectBox')
        this.$router.push({
          params: {
            ...this.$route.params
          },
          query: {
            ...this.$route.query,
            action: this.changeOrder.uuid
          }
        }, () => {})
        const orderUuid = this.changeOrder.uuid
        this.$store.dispatch('listPayments', { posUuid, orderUuid })
      }
      if (this.changeOrder.documentStatus.value === 'DR') {
        holdOrder({
          posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
          salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
          orderUuid: this.changeOrder.uuid
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
      this.$store.commit('setDialogoComponent', false)
      this.$store.commit('showListOrders', false)
    },
    orderPrpcess(row) {
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: row.id
      }]
      this.$store.dispatch('addParametersProcessPos', parametersList)
    },
    setFieldsList() {
      const list = []
      // Create Panel
      this.$store.dispatch('addPanel', {
        containerUuid: this.metadata.containerUuid,
        isCustomForm: false,
        uuid: this.metadata.uuid,
        panelType: this.metadata.panelType,
        fieldsList: this.fieldsList
      })
      // Product Code
      this.fieldsList.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(response => {
            const data = response
            list.push({
              ...data,
              containerUuid: 'Orders-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = list
    },
    sortDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    sortfield(field) {
      return field.sort((elementA, elementB) => {
        return elementA.sequence - elementB.sequence
      })
    }

  }
}
</script>
