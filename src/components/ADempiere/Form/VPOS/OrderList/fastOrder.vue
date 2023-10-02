<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
    <el-form label-position="top" label-width="100px" :style="isMobile ? '' : 'margin-top: 5%;'">
      <el-form-item style="margin-bottom: 0px;">
        <document-status-tag
          v-if="!isEmptyValue(currentOrder.documentStatus.value) && !isMobile"
          :value="currentOrder.documentStatus.value"
          :displayed-value="currentOrder.documentStatus.name"
          style="font-size: 12px;margin-right: 2%;"
        />
        <el-button v-if="isMobile" type="primary" icon="el-icon-document-add" plain @click="newOrder()" />
        <el-button v-else type="primary" plain @click="newOrder()">
          {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
        </el-button>
        <el-dropdown size="mini" trigger="click" @command="handleCommand">
          <el-button type="primary" size="small" style="padding: 10px;padding-left: 5px;">
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <template v-for="(option, key) in quickOptions">
              <el-dropdown-item v-show="option.isShow" :key="key" :command="option">
                <span v-if="isMobile">
                  {{ option.title }}
                </span>
                <el-popover
                  v-else
                  :key="key"
                  v-model="option.isVisible"
                  placement="right"
                  trigger="click"
                  width="1200"
                >
                  <find-orders
                    :data="option"
                    :data-list="orderList"
                    :is-loading-table="isLoading"
                    :params="option.params"
                    :show-field="showToDeliveOrders"
                    :page-number="currentPage"
                  >
                    <template v-slot:header>
                      <el-form label-position="top" :inline="true" class="demo-form-inline" @submit.native.prevent="notSubmitForm">
                        <el-form-item label="No. del Documento">
                          <el-input v-model="input" placeholder="Please input" @change="listOrdersInvoiced" />
                        </el-form-item>
                        <el-form-item
                          v-for="(field) in metadataList"
                          :key="field.columnName"
                        >
                          <field-definition
                            :metadata-field="{
                              ...field,
                              name: field.columnName === 'DateOrderedFrom' ? $t('form.pos.optionsPoinSales.generalOptions.dateOrder') : field.name,
                              size: {
                                xs: 24,
                                sm: 24,
                                md: 24,
                                lg: 24,
                                xl: 24
                              }
                            }"
                            :container-uuid="'Cash-Withdrawal'"
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
                        </el-form-item>
                      </el-form>
                    </template>
                  </find-orders>

                  <el-row :gutter="24" class="orders-list-footer">
                    <el-col :span="18">
                      <custom-pagination
                        :total="total"
                        :current-page="currentPage"
                        :handle-change-page="handleChangePage"
                        layout="total, prev, pager, next"
                        style="float: right;"
                        :records-page="orderList.length"
                      />
                    </el-col>

                    <el-col :span="6">
                      <samp style="float: right; padding-right: 10px;">
                        <el-button
                          :loading="isLoading"
                          type="success"
                          icon="el-icon-refresh-right"
                          class="button-base-icon"
                          size="small"
                          @click="listOrdersInvoiced();"
                        />
                        <el-button
                          type="danger"
                          class="button-base-icon"
                          icon="el-icon-close"
                          @click="closeSearch(option)"
                        />
                        <el-button
                          type="primary"
                          class="button-base-icon"
                          icon="el-icon-check"
                          @click="openOrder(option)"
                        />
                      </samp>
                    </el-col>
                  </el-row>
                  <el-button slot="reference" type="text" style="color: #333" @click="option.isVisible = true">
                    {{ option.title }}
                  </el-button>
                </el-popover>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <el-drawer
      v-if="isMobile"
      :visible.sync="currentOptions.isVisible"
      :with-header="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      size="100%"
    >
      <find-orders
        :data="currentOptions"
        :data-list="orderList"
        :is-loading-table="isLoading"
        :params="currentOptions.params"
        :show-field="showToDeliveOrders"
        :page-number="currentPage"
      >
        <template v-slot:header>
          <el-form
            label-position="top"
            label-width="10px"
            style="float: right; display: contents; line-height: 10px;"
            :disabled="validateOpenAmount"
            @submit.native.prevent="notSubmitForm"
          >
            <el-row id="fieldListCollection">
              <el-col
                v-for="field in metadataList"
                :key="field.sequence"
                :span="12"
              >
                <field-definition
                  :metadata-field="{
                    ...field,
                    name: field.columnName === 'DateOrderedFrom' ? $t('form.pos.optionsPoinSales.generalOptions.dateOrder') : field.name,
                    size: {
                      xs: 24,
                      sm: 24,
                      md: 24,
                      lg: 24,
                      xl: 24
                    }
                  }"
                  :container-uuid="'Collection'"
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
              </el-col>
            </el-row>
          </el-form>
        </template>

        <template v-slot:footer>
          <el-row :gutter="24" class="orders-list-footer">
            <el-col :span="18">
              <custom-pagination
                :total="total"
                :current-page="currentPage"
                :handle-change-page="handleChangePage"
                layout="total, prev, pager, next"
                style="float: right;"
                :records-page="orderList.length"
              />
            </el-col>

            <el-col :span="6">
              <samp style="float: right; padding-right: 10px;">
                <el-button
                  :loading="isLoading"
                  type="success"
                  class="button-base-icon"
                  icon="el-icon-refresh-right"
                  size="small"
                  @click="listOrdersInvoiced();"
                />
                <el-button
                  type="danger"
                  class="button-base-icon"
                  icon="el-icon-close"
                  @click="closeSearch(currentOptions)"
                />
                <el-button
                  type="primary"
                  class="button-base-icon"
                  icon="el-icon-check"
                  @click="openOrder(currentOptions)"
                />
              </samp>
            </el-col>
          </el-row>
        </template>
      </find-orders>
    </el-drawer>
  </span>
</template>

<script>
// constants
import fieldsListOrders from './fieldsListOrders.js'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// components and mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import FindOrders from './FindOrders'

// api request methods
import { holdOrder } from '@/api/ADempiere/form/point-of-sales.js'
import {
  listOrders
} from '@/api/ADempiere/form/point-of-sales.js'

// ultils and helper methods
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat.js'
import { extractPagingToken } from '@/utils/ADempiere/dataUtils'
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

export default {
  name: 'FastOrder',

  components: {
    CustomPagination,
    DocumentStatusTag,
    FieldDefinition,
    FindOrders
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Aisle-Vendor-List',
          containerUuid: 'Aisle-Vendor-List'
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
      fieldsList: fieldsListOrders,
      metadataList: {},
      total: 0,
      currentPage: 1,
      tokenPage: '',
      input: '',
      isCustomForm: true,
      timeOut: null,
      changeOrder: {},
      isLoading: true,
      ordersInvoiced: [],
      currentOptions: {},
      orderList: []
    }
  },

  computed: {
    allowsConfirmShipment() {
      return this.currentPointOfSales.isAllowsConfirmShipment
    },
    quickOptions() {
      return [
        {
          title: this.$t('form.byInvoice.label'),
          params: {
            isWaitingForInvoice: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.aisleSales'),
          params: {
            isOnlyAisleSeller: true,
            isWaitingForInvoice: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.toCollect'),
          params: {
            isWaitingForPay: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.toDeliver'),
          params: {
            isWaitingForShipment: true
          },
          isVisible: false,
          isShow: this.allowsConfirmShipment
        },
        {
          title: this.$t('form.byInvoice.searchCompleteOrders'),
          params: {
            isOnlyProcessed: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.proposals'),
          params: {
            isBindingOffer: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.cancelled'),
          params: {
            isNullified: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.closed'),
          params: {
            isClosed: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: this.$t('form.byInvoice.return'),
          params: {
            isOnlyRMA: true
          },
          isVisible: false,
          isShow: true
        }
      ]
    },
    isProcessed() {
      if (!this.isEmptyValue(this.currentOrder.documentStatus.value) && this.currentOrder.documentStatus.value === 'CO' && this.allowsConfirmShipment) {
        return true
      }
      return false
    },
    currentOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    sortFieldsListOrder() {
      return this.fieldsList.find(field => field.columnName === 'C_BPartner_ID')
    },
    dateOrderedFromField() {
      return this.fieldsList.find(field => {
        if (field.columnName === 'DateOrdered') {
          return field
        }
      })
    },
    allowsCreateOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCreateOrder
    },
    showToDeliveOrders: {
      get() {
        return this.$store.getters.getSearchToDeliveOrders
      },
      set(value) {
        this.$store.commit('setShowsearchToDeliveOrders', value)
      }
    },
    businessPartnerUuid: {
      get() {
        // main panel values
        return this.$store.getters.getValueOfField({
          containerUuid: 'Aisle-Vendor-List',
          columnName: 'C_BPartner_ID_UUID'
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Aisle-Vendor-List',
          columnName: 'C_BPartner_ID_UUID',
          value
        })
      }
    },
    dateOrderedFrom: {
      get() {
        // main panel values
        return this.$store.getters.getValueOfField({
          containerUuid: 'Aisle-Vendor-List',
          columnName: 'DateOrderedFrom'
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Aisle-Vendor-List',
          columnName: 'DateOrderedFrom',
          value
        })
      }
    },
    getSearchOrder() {
      return this.$store.getters.getQuickSearchOrder
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isDisplayedDefault,
    generalInfoSearch,
    searchTableHeader,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    handleCommand(command) {
      if (this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
      const index = this.quickOptions.findIndex(option => option.title === command.title)
      this.quickOptions[index].isVisible = true
      this.currentOptions = command
      this.listOrdersInvoiced(this.currentOptions)
    },
    closeSearch(command) {
      const index = this.quickOptions.findIndex(option => option.title === command.title)
      this.quickOptions[index].isVisible = false
      this.orderList = []
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

      this.businessPartnerUuid = undefined
      this.dateOrderedFrom = undefined
    },
    openOrder(command) {
      const posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      const currentOrder = this.$store.getters.posAttributes.currentPointOfSales.currentOrder
      if (!this.isEmptyValue(this.getSearchOrder) && this.getSearchOrder.documentNo !== currentOrder.documentNo) {
        this.$store.state['pointOfSales/point/index'].conversionsList = []
        this.$store.dispatch('currentOrder', this.getSearchOrder)
        this.$store.dispatch('deleteAllCollectBox')
        this.$router.push({
          params: {
            ...this.$route.params
          },
          query: {
            ...this.$route.query,
            action: this.getSearchOrder.uuid
          }
        }, () => {})
        const orderUuid = this.getSearchOrder.uuid
        this.$store.dispatch('listPayments', { posUuid, orderUuid })
      }
      if (this.getSearchOrder.documentStatus.value === 'DR') {
        holdOrder({
          posUuid: this.currentPointOfSales.uuid,
          salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
          orderUuid: this.getSearchOrder.uuid
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
      this.closeSearch(command)
    },
    handleChangePage(newPage) {
      this.tokenPage = this.tokenPage + '-' + newPage
      this.listOrdersInvoiced(this.currentOptions)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        const { type } = mutation
        if (type === 'updateValueOfField') {
          const { payload } = mutation
          if (payload.containerUuid === this.metadata.containerUuid) {
            const { columnName } = payload

            if (!columnName.startsWith(DISPLAY_COLUMN_PREFIX) &&
              !columnName.endsWith('_UUID')) {
              clearTimeout(this.timeOut)
              this.timeOut = setTimeout(() => {
                this.listOrdersInvoiced(this.currentOptions)
              }, 2000)
            }
          }
        }
      })
    },
    setFieldsList() {
      const fieldsList = [
        {
          ...this.sortFieldsListOrder,
          containerUuid: 'Aisle-Vendor-List'
        },
        {
          ...this.dateOrderedFromField,
          containerUuid: 'Aisle-Vendor-List'
        }
      ]
      const newfieldsList = []
      // Create Panel
      this.$store.dispatch('addPanel', {
        containerUuid: 'Aisle-Vendor-List',
        isCustomForm: false,
        uuid: this.metadata.uuid,
        panelType: this.metadata.panelType,
        fieldsList: fieldsList
      })
      // Product Code
      fieldsList.forEach(element => {
        createFieldFromDictionary(element)
          .then(response => {
            newfieldsList.push({
              ...response,
              containerUuid: 'Aisle-Vendor-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = newfieldsList
    },
    listOrdersInvoiced(option) {
      this.isLoading = true

      /*
      // send multiple request with close list orders
      if (this.isEmptyValue(this.dateOrdered) || this.isEmptyValue(this.businessPartnerUuid)) {
        // with mandatory empty values
        this.isLoading = false
        return
      }
      */
      const dateOrderedTo = dateTimeFormats(this.dateOrderedFrom, 'YYYY-MM-DD')

      const values = {
        ...this.currentOptions.params,
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        documentNo: this.input,
        pageToken: this.tokenPage,
        dateOrderedTo,
        businessPartnerUuid: this.businessPartnerUuid,
        salesRepresentativeUuid: this.$store.getters['user/getUserUuid']
      }
      listOrders(
        values
      )
        .then(response => {
          this.orderList = response.ordersList
          this.tokenPage = extractPagingToken(response.nextPageToken)
          this.total = response.recordCount
          // this.ordersInvoiced = response.ordersList
        })
        .catch(error => {
          this.orderList = []
          console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    newOrder() {
      if (!this.allowsCreateOrder) {
        const attributePin = {
          withLine: false,
          newOrder: true,
          customer: this.currentPointOfSales.templateCustomer.uuid,
          action: 'newOrder',
          type: 'actionPos',
          requestedAccess: 'IsAllowsCreateOrder',
          label: this.$t('form.pos.pinMessage.newOrder')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
        return
      }
      this.$store.commit('setShowPOSCollection', false)
      const posUuid = this.currentPointOfSales.uuid
      // const documentTypeUuid = this.$store.getters.getValueOfField({
      //   containerUuid: this.$route.meta.uuid,
      //   columnName: 'C_DocTypeTarget_ID_UUID'
      // })
      const bpartner = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'DisplayColumn_C_BPartner_UUID' // this.parentMetadata.columnName
      })
      let customerUuid = this.isEmptyValue(bpartner) ? this.$store.getters.getNewCustomer.uuid : bpartner
      if (this.isEmptyValue(customerUuid)) {
        customerUuid = this.currentPointOfSales.salesRepresentative.uuid
      }

      this.$store.dispatch('createOrder', {
        posUuid,
        customerUuid: this.currentPointOfSales.templateCustomer.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
        priceListUuid: this.$store.getters.currentPriceList.uuid,
        documentTypeUuid: this.currentPointOfSales.documentType.uuid
      })
        .then(response => {
          this.$store.commit('setCurrentPriceList', response.priceList)
          this.$store.dispatch('reloadOrder', { orderUuid: response.uuid })
          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: response.uuid
            }
          }).then(() => {
            this.$store.commit('setShowPOSCollection', false)
            this.$store.dispatch('listOrdersFromServer', {
              posUuid: this.currentPointOfSales.uuid
            })
          }).catch(() => {})
        })
      this.$store.dispatch('changeFocusNewOrder', true)
    }
  }
}
</script>

<style>
.el-form--label-top .el-form-item__label {
  padding: 0px;
}
</style>
