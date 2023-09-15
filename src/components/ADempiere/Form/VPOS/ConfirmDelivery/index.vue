<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <el-main
    v-shortkey="shortsKey"
    style="padding-top: 0px;"
    @shortkey.native="keyAction"
  >
    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      label-width="10px"
      @shortkey.native="keyAction"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item label="Código Producto">
        <el-autocomplete
          ref="searchValue"
          v-model="input"
          :fetch-suggestions="querySearchAsyncDelivery"
          :select-when-unmatched="true"
          :trigger-on-focus="false"
          :placeholder="$t('quickAccess.searchWithEnter')"
          class="search-delivery"
          @select="searchProduct"
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
                  {{ formatQuantity(props.item.quantityOrdered) }}
                </p>
              </div>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <el-table
      ref="listProducto"
      v-shortkey="shortsKey"
      v-loading="isLoadedServer"
      :data="productdeliveryList"
      :empty-text="$t('quickAccess.searchWithEnter')"
      border
      fit
      height="450"
      highlight-current-row
      @cell-dblclick="editDelivery"
      @shortkey.native="keyAction"
    >
      <el-table-column
        prop="product.value"
        :label="$t('form.productInfo.code')"
      />
      <el-table-column
        prop="product.name"
        :label="$t('form.pos.tableProduct.product')"
      />
      <el-table-column
        prop="quantity"
        :label="$t('form.pos.tableProduct.quantity')"
        align="right"
        :width="isEditQuantity ? '210px' : '110px'"
      >
        <template slot-scope="scope">
          <el-input-number
            v-if="isEditQuantity"
            v-model="scope.row.quantity"
            controls-position="right"
            :min="1"
            @change="handleChange(scope.row)"
          />
          <span v-else>
            {{ formatQuantity({ value: scope.row.quantity }) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="uom.uom.name"
        :label="$t('form.pos.tableProduct.uom')"
      />
      <el-table-column
        prop="quantity"
        :label="$t('form.pos.tableProduct.movementQuantity')"
        align="right"
        width="200px"
      >
        <template slot-scope="scope">
          {{ formatQuantity({ value: scope.row.movement_quantity }) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
        column-key="value"
        width="160"
      >
        <template slot-scope="scope">
          <el-popover
            :value="scope.row.isInfo"
            placement="bottom"
            trigger="click"
            width="750"
          >
            <el-form
              label-position="top"
              :style="currentLineInfo === scope.row.uuid ? 'float: right;display: contents;line-height: 30px;' : 'float: right;display: none;line-height: 30px;'"
              @submit.native.prevent="notSubmitForm"
            >
              <el-row :gutter="10">
                <el-col :span="4">
                  <el-skeleton-item
                    variant="image"
                    style="width: 110px; height: 150px;"
                  />
                </el-col>
                <el-col :span="20">
                  <el-row>
                    <el-col :span="24">
                      {{ $t('form.productInfo.code') }}: <b>{{ scope.row.product.value }}</b><br>
                      {{ $t('form.productInfo.name') }}: <b>{{ scope.row.product.name }}</b><br>
                      {{ $t('form.productInfo.description') }}: <b>{{ scope.row.product.description }}</b><br>
                      {{ $t('form.productInfo.UM') }}: <b>{{ scope.row.uom.product_uom.name }}</b>
                    </el-col>
                    <el-col :span="24">
                      <el-divider>
                        {{ '1 ' + scope.row.uom.uom.name + ' (' + scope.row.uom.uom.symbol + ') ' + ' ~ ' + formatQuantity({ value: (scope.row.uom.divide_rate >= scope.row.uom.multiply_rate) ? scope.row.uom.divide_rate : scope.row.uom.multiply_rate }) + ' ' + scope.row.uom.product_uom.name + ' (' + scope.row.uom.product_uom.symbol + ') ' }}
                      </el-divider>
                    </el-col>
                    <el-col :span="8">
                      {{ $t('form.pos.tableProduct.quantity') }}: <b>{{ formatQuantity({ value: scope.row.quantity }) }}</b>
                    </el-col>
                    <el-col :span="8">
                      {{ $t('form.productInfo.UM') }}: <b>{{ scope.row.uom.uom.name }}</b>
                    </el-col>
                    <el-col :span="8">
                      {{ $t('form.pos.tableProduct.movementQuantity') }}: <b>{{ formatQuantity({ value: scope.row.movement_quantity }) }}</b>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
            <el-button
              slot="reference"
              type="primary"
              icon="el-icon-info"
              size="mini"
              style="margin-right: 3%;"
              @click="showInfoLine(scope.row)"
            />
          </el-popover>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteLine(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('form.pos.optionsPoinSales.salesOrder.confirmDelivery')"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
    >
      <p class="total">
        {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}:
        <b class="order-info">
          {{ currentOrder.businessPartner.name }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.order') }}:
        <b class="order-info">
          {{ currentOrder.documentNo }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.itemQuantity') }}:
        <b v-if="!isEmptyValue(productdeliveryList)" class="order-info">
          {{ getItemQuantity }}
        </b>
      </p>
      <p class="total">
        {{ $t('form.pos.order.numberLines') }}:
        <b v-if="!isEmptyValue(productdeliveryList)" class="order-info">
          {{ numberOfLines }}
        </b>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="24">
          <el-col :span="24">
            <samp style="float: right; padding-right: 10px;">
              <el-button
                type="danger"
                class="custom-button-create-bp"
                icon="el-icon-close"
                @click="closeDialog"
              />
              <el-button
                type="primary"
                class="custom-button-create-bp"
                icon="el-icon-check"
                :loading="isLoadedConfirm"
                :disabled="isLoadedConfirm"
                @click="makeDelivery"
              />
            </samp>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="close"
          />
          <el-button
            v-if="allowsConfirmShipment"
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            @click="dialogVisible = true"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// components and mixins
import formMixin from '@/components/ADempiere/Form/formMixin.js'

// api request methods
import {
  createShipmentLine,
  createShipment,
  deleteShipment,
  shipments,
  processShipment,
  printShipmentPreviwer
} from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'

export default {
  name: 'ConfirmDelivery',
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Confirm-Delivery',
          containerUuid: 'Confirm-Delivery'
        }
      }
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    },
    isCompleteProducts: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoadedServer: false,
      isSearchProduct: false,
      input: '',
      shipment: {},
      dialogVisible: false,
      deliveryList: [],
      showInfo: false,
      value: false,
      isEditQuantity: false,
      isLoadedConfirm: false,
      isLoadedProcessShipment: false,
      timeOut: null
    }
  },
  computed: {
    getItemQuantity() {
      if (this.isEmptyValue(this.productdeliveryList)) {
        return 0
      }
      const result = this.productdeliveryList.map(order => {
        return order.quantity
      })

      if (!this.isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    },
    numberOfLines() {
      if (this.isEmptyValue(this.productdeliveryList)) {
        return 0
      }
      return this.productdeliveryList.length
    },
    currentOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder
    },
    currentOrderLine() {
      return this.$store.getters.posAttributes.currentPointOfSales.currentOrder.lineOrder
    },
    productdeliveryList() {
      return this.$store.getters.getDeliveryList.map(a => {
        return {
          ...a,
          isInfo: false
        }
      })
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    allowsConfirmShipment() {
      return this.currentPointOfSales.isAllowsConfirmShipment
    },
    shortsKey() {
      return {
        closeProductList: ['esc'],
        refreshList: ['f5']
      }
    },
    searchValue() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'ProductValue'
      })
    },
    currentLineInfo() {
      const currentLine = this.$store.state['pointOfSales/orderLine/index'].line
      if (this.isEmptyValue(currentLine)) {
        return ''
      }
      return currentLine.uuid
    },
    currentShipment() {
      return this.$store.getters.getShipment
    }
  },
  watch: {
    currentLineInfo(value) {
      if (!this.isEmptyValue(this.$refs.open)) {
        this.$refs.open.showPopper = false
        this.$refs.open.destroyPopper()
      }
    },
    isVisible(value) {
      if (value) {
        this.timeOut = setTimeout(() => {
          this.$refs.searchValue.focus()
        }, 500)
      }
    }
  },
  created() {
    this.$store.commit('setListProductPrice', {
      isLoaded: false
    })
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPointOfSales)
    }, 3000)
  },
  methods: {
    formatPrice,
    formatQuantity,
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.loadProductsPricesList()
          break

        case 'closeProductList':
          this.$store.commit('setIsShowListProductPrice', false)
          break
      }
    },
    loadProductsPricesList() {
      this.$store.dispatch('listProductPriceFromServer', {})
    },
    close() {
      this.$store.commit('setShowFastConfirmDelivery', false)
      this.$store.commit('setDeliverAllProducts', false)
      this.$store.commit('setConfirmDelivery', false)
    },
    listShipments({ shipmentUuid }) {
      shipments({ shipmentUuid })
        .then(response => {
          this.$store.commit('setDeliveryList', response.records)
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
    },
    searchProduct(value) {
      const searchValue = this.isEmptyValue(value.product) ? value : value.product.value
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.isSearchProduct = true
        const product = this.findProductFromOrder(searchValue)
        const quantity = !Number.isInteger(product.quantity) ? product.quantity : undefined
        this.addLineShipment({ shipmentUuid: this.currentShipment.uuid, orderLineUuid: product.uuid, quantity })
        this.input = ''
      }, 500)
    },
    addLineShipment({ shipmentUuid, orderLineUuid, quantity }) {
      createShipmentLine({
        posUuid: this.currentPointOfSales.uuid,
        shipmentUuid,
        orderLineUuid,
        quantity
      })
        .then(response => {
          return response
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
        .finally(() => {
          this.listShipments({ shipmentUuid })
          this.$refs.searchValue.focus()
        })
    },
    createFilter(queryString) {
      return (link) => {
        const search = queryString.toLowerCase()
        return link.product.value.toLowerCase().includes(search) || link.product.name.toLowerCase().includes(search) || link.product.upc.toLowerCase().includes(search)
      }
    },
    querySearchAsyncDelivery(queryString, callBack) {
      const results = queryString ? this.currentOrderLine.filter(this.createFilter(queryString)) : this.currentOrderLine
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (this.isEmptyValue(results)) {
          this.$message({
            type: 'error',
            message: this.$t('form.pos.optionsPoinSales.salesOrder.emptyProductDelivery'),
            duration: 3500,
            showClose: true
          })
        }
        const suggestionOpen = results.length
        if (this.isEmptyValue(queryString) || queryString.length < 4) {
          // not show list
          callBack(results)
          return
        }
        if (suggestionOpen <= 1) {
          this.searchProduct(results[0])
          this.$refs.searchValue.close()
        }
        callBack(results)
      }, 500)
    },
    findProductFromOrder(value) {
      const search = typeof value === 'string' ? value : value.value
      return this.currentOrderLine.find(line => line.product.name === search || line.product.value === search || line.product.upc === search)
    },
    deleteLine(line) {
      deleteShipment({
        posUuid: this.currentPointOfSales.uuid,
        shipmentLineUuid: line.uuid
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: response,
            duration: 1500,
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
        .finally(() => {
          this.listShipments({ shipmentUuid: this.currentShipment.uuid })
          this.$refs.searchValue.focus()
        })
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
      if (this.isEmptyValue(PointOfSales)) {
        const message = this.$t('notifications.errorPointOfSale')
        this.$store.commit('setListProductPrice', {
          isLoaded: true,
          productPricesList: []
        })
        this.$message({
          type: 'info',
          message,
          duration: 1500,
          showClose: true
        })
      }
    },
    createDelivery({ posUuid, orderUuid, salesRepresentativeUuid }) {
      createShipment({
        posUuid,
        orderUuid,
        salesRepresentativeUuid,
        isCreateLinesFromOrder: this.isCompleteProducts
      })
        .then(shipment => {
          this.$store.commit('setShipment', shipment)
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
    },
    makeDelivery() {
      if (this.isEmptyValue(this.currentShipment)) {
        return
      }
      this.isLoadedConfirm = true
      this.isLoadedProcessShipment = false
      processShipment({
        shipmentUuid: this.currentShipment.uuid
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: 'OK',
            duration: 1500,
            showClose: true
          })
          this.previwerShipment(response)
          this.$store.commit('setSummaryConfirmDelivery', {
            type: 'success',
            businessPartner: this.currentOrder.businessPartner.name,
            documentNo: this.currentOrder.documentNo,
            getItemQuantity: this.getItemQuantity,
            numberOfLines: this.numberOfLines
          })
          return response
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
          this.$store.commit('setSummaryConfirmDelivery', {
            type: 'error',
            businessPartner: this.currentOrder.businessPartner.name,
            documentNo: this.currentOrder.documentNo,
            getItemQuantity: this.getItemQuantity,
            numberOfLines: this.numberOfLines
          })
        })
        .finally(() => {
          this.dialogVisible = false
          this.isLoadedProcessShipment = true
          this.isLoadedConfirm = false
          this.$store.commit('setShowConfirmDelivery', true)
          this.$store.commit('setShowPOSOptions', false)
          this.$store.commit('setConfirmDelivery', false)
        })
    },
    previwerShipment(shipment) {
      printShipmentPreviwer({
        posUuid: this.currentPointOfSales.uuid,
        shipmentUuid: shipment.uuid,
        reportType: 'application/pdf'
      })
        .then(response => {
          const { processLog } = response
          if (!this.isEmptyValue(processLog)) {
            const link = buildLinkHref({
              fileName: processLog.output.file_name,
              outputStream: processLog.output.output_stream,
              mimeType: processLog.output.mime_type
            })
            this.$store.commit('setReportOutput', {
              download: link.download,
              format: processLog.output.report_type,
              fileName: processLog.output.file_name,
              link,
              content: processLog.output.output,
              mimeType: processLog.output.mime_type,
              name: processLog.output.name,
              output: processLog.output,
              outputStream: processLog.output.output_stream,
              outputStream_asB64: processLog.output.output_stream_asB64,
              outputStream_asU8: processLog.output.output_stream_asU8,
              reportType: processLog.output.report_type,
              reportUuid: processLog.uuid,
              reportViewUuid: processLog.uuid,
              tableName: 'C_Order',
              url: link.href,
              uuid: processLog.uuid,
              instanceUuid: processLog.instance_uuid
            })
            this.$router.push({
              name: REPORT_VIEWER_NAME,
              params: {
                processId: 110,
                reportUuid: processLog.uuid,
                tableName: 'C_Order',
                menuParentUuid: '',
                instanceUuid: processLog.instance_uuid,
                fileName: processLog.output.name,
                name: processLog.output.name,
                mimeType: processLog.output.mime_type
              }
            }, () => {})
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
    },
    closeInfo(line) {
      this.showInfo = false
    },
    showInfoLine(line) {
      this.$store.commit('setLine', line)
      line.isInfo = true
      const list = this.productdeliveryList.filter(lines => lines.id !== line.id)
      list.forEach(element => {
        element.isInfo = false
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.$store.commit('setConfirmDelivery', false)
    },
    editDelivery(row, column, cell, event) {
      if (column.property === 'quantity') {
        this.isEditQuantity = !this.isEditQuantity
      }
    },
    handleChange(row) {
      const product = this.findProductFromOrder(row.product.value)
      this.addLineShipment({ shipmentUuid: this.currentShipment.uuid, orderLineUuid: product.uuid, quantity: row.quantity })
      this.isEditQuantity = false
    }
  }
}
</script>
<style scoped>
  .search-delivery {
    position: relative;
    display: contents;
  }
</style>
