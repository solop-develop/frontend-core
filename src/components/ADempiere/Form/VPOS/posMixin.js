// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  findProduct,
  updateOrderLine,
  deleteOrderLine,
  processOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import {
  formatDate,
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import orderLineMixin from './Order/orderLineMixin.js'
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

export default {
  name: 'POSMixin',
  mixins: [
    orderLineMixin
  ],
  props: {
    metadata: {
      type: Object,
      required: false
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        changeFieldShowedFromUser: () => {},
        getFieldsLit: () => {},
        isDisplayedField: () => { return true },
        isMandatoryField: () => { return true },
        isReadOnlyField: () => { return false },
        setDefaultValues: () => {}
      })
    }
  },
  data() {
    return {
      product: {},
      currentTable: 0,
      orderLines: [],
      products: {
        uuid: '',
        quantityAvailable: 0
      },
      edit: false,
      displayType: '',
      pin: '',
      attributePin: {},
      validatePin: false,
      visible: false
    }
  },
  computed: {
    IsAllowsPreviewDocument() {
      return this.currentPointOfSales.isAllowsPreviewDocument
    },
    allowsCreateOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCreateOrder
    },
    allowsCollectOrder() {
      if (this.isValidForDeleteLine(this.listOrderLine)) {
        return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCollectOrder
      }
      return false
    },
    validateOpenAmount() {
      if (this.currentOrder.openAmount > 0) {
        return false
      }
      if (!this.isEmptyValue(this.pendingPayments)) {
        return this.isEmptyValue(this.pendingPayments)
      }
      return this.isDisabled
    },
    pendingPayments() {
      if (!this.isEmptyValue(this.currentOrder.listPayments.payments)) {
        return this.currentOrder.listPayments.payments.filter(payment => payment.documentStatus.value === 'DR')
      }
      return []
    },
    allowsModifyQuantity() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyQuantity
    },
    allowsReturnOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsReturnOrder
    },
    modifyPrice() {
      return this.$store.getters.posAttributes.currentPointOfSales.isModifyPrice
    },
    modifyDiscount() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyDiscount
    },
    adviserPin() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAisleSeller
    },
    isSetTemplateBP() {
      const currentPOS = this.currentPointOfSales
      if (!this.isEmptyValue(currentPOS) &&
        !this.isEmptyValue(currentPOS.templateCustomer) &&
        this.isEmptyValue(this.$route.query.action)) {
        return currentPOS.templateCustomer
      }
      return false
    },
    updateOrderProcessPos() {
      return this.$store.getters.getUpdateOrderPos
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Currency Point Of Sales
    pointOfSalesCurrency() {
      // const currency = this.currentPointOfSales
      if (!this.isEmptyValue(this.currentPointOfSales.priceList)) {
        return {
          ...this.currentPointOfSales.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1,
        divideRate: 1
      }
    },
    listPointOfSales() {
      return this.$store.getters.posAttributes.pointOfSalesList
    },
    curretnPriceList() {
      if (!this.isEmptyValue(this.$store.getters.currentPriceList)) {
        return this.$store.getters.currentPriceList
      }
      return {}
    },
    priceListPointOfSales() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    warehousesListPointOfSales() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.warehousesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    ordersList() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return []
      }
      return this.currentPointOfSales.listOrder
    },
    currentOrder() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        }
      }
      return this.currentPointOfSales.currentOrder
    },
    isDisabled() {
      return this.currentPointOfSales.currentOrder.isProcessed
    },
    listOrderLine() {
      if (this.isEmptyValue(this.currentOrder)) {
        return []
      }
      return this.currentOrder.lineOrder
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin)) {
        return pos.isPosRequiredPin
      }
      return false
    },
    showOverdrawnInvoice() {
      return this.$store.getters.getOverdrawnInvoice.visible
    },
    isNewOrder() {
      return this.$store.getters.getFocusNewOrder
    },
    isProcessLoading() {
      return this.$store.getters.getProcessLoading
    }
  },
  watch: {
    currentOrder(value) {
      if (this.isEmptyValue(value)) {
        this.orderLines = []
        this.$store.dispatch('listOrderLine', [])
        this.listOrderLines()
      } else {
        const businessPartner = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
        })
        const documentType = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_DocTypeTarget_ID' // this.parentMetadata.columnName
        })
        if (!this.isEmptyValue(businessPartner) && businessPartner !== value.businessPartner.id) {
          this.setBusinessPartner(value.businessPartner)
        } else if (this.isEmptyValue(businessPartner) && value.businessPartner.id) {
          this.setBusinessPartner(value.businessPartner)
        }
        if (!this.isEmptyValue(documentType) && documentType !== value.documentType.id) {
          this.setDocumentType(value.documentType)
        }
      }
    },
    // updateOrderProcessPos(value) {
    //   if (!value && !this.isEmptyValue(this.$route.query)) {
    //     this.reloadOrder(true)
    //   }
    // },
    showOverdrawnInvoice(value) {
      this.visible = value
    }
  },

  methods: {
    formatDate,
    formatPrice,
    formatQuantity,
    theAction(event) {
      if (this.visible) {
        switch (event.srcKey) {
          case 'enter':
            this.openPin(this.pin)
            break
          case 'close':
            this.closePin()
            break
        }
      }
    },
    openPin(pin) {
      const { requestedAccess, value } = this.$store.getters.getOverdrawnInvoice.attributePin
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin,
        requestedAmount: (typeof value === 'number') ? value : '',
        requestedAccess,
        orderId: this.currentOrder.id
      })
        .then(response => {
          this.validatePin = true
          this.pin = ''
          this.visible = false
          this.pinAction(this.attributePin)
          this.$message({
            type: 'success',
            message: this.$t('pointOfSales.pin.validateSuccessfully'),
            showClose: true
          })
          if (!this.isEmptyValue(this.$refs) && !this.isEmptyValue(this.$refs.showFieldLine)) {
            this.$refs.showFieldLine.doClose()
          }
          this.exitEdit()
        })
        .catch(error => {
          this.reloadOrder(true, this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid)
          this.$store.commit('updateValueOfField', {
            containerUuid: 'line',
            columnName: 'QtyEntered',
            value: this.currentOrderLine.quantity
          })
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pin = ''
        })
        .finally(() => {
          this.visible = false
          this.pin = ''
        })
    },
    pinAction(action) {
      action = this.isEmptyValue(action) ? this.$store.getters.getOverdrawnInvoice.attributePin : action
      if (action.type === 'updateOrder') {
        switch (action.columnName) {
          case 'QtyEntered':
            setTimeout(() => {
              // this.$message({
              //   type: 'success',
              //   message: this.$t('form.pos.pinMessage.updateQtyEntered'),
              //   showClose: true
              // })
              this.updateOrderLine(action)
            }, 500)
            break
          case 'PriceEntered':
            setTimeout(() => {
              // this.$message({
              //   type: 'success',
              //   message: this.$t('form.pos.pinMessage.updatePriceEntered'),
              //   showClose: true
              // })
              this.updateOrderLine(action)
            }, 500)
            break
          case 'Discount':
            setTimeout(() => {
              // this.$message({
              //   type: 'success',
              //   message: this.$t('form.pos.pinMessage.updateDiscountEntered'),
              //   showClose: true
              // })
              this.updateOrderLine(action)
            }, 500)
            break
          case 'C_DocTypeTarget_ID': {
            const documentTypeUuid = this.$store.getters.getValueOfField({
              containerUuid: this.$route.meta.uuid,
              columnName: 'C_DocTypeTarget_ID_UUID'
            })
            this.$store.dispatch('updateOrder', {
              orderUuid: this.currentOrder.uuid,
              posUuid: this.currentPointOfSales.uuid,
              priceListUuid: this.currentPointOfSales.priceList.uuid,
              warehouseUuid: this.currentPointOfSales.warehouse.uuid,
              documentTypeUuid
            })
            break
          }
        }
      } else if (action.type === 'addProduct') {
        this.findProduct(action.value)
      } else if (action.type === 'deleteLine') {
        deleteOrderLine({
          orderLineUuid: action.uuid
        })
          .then(response => {
            this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
            this.$store.dispatch('changeFocusNewOrder', true)
            this.$refs.ProductValue[0].$refs.product.focus()
          })
          .catch(error => {
            console.error(error.message)
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      } else if (action.type === 'maximumRefundAllowed') {
        this.refundAllowed(action.posUuid, action.orderUuid, action.payments)
      } else if (action.type === 'actionPos') {
        switch (action.action) {
          case 'changeWarehouse':
            this.$store.dispatch('updateOrder', {
              orderUuid: this.currentOrder.uuid,
              posUuid: this.currentPointOfSales.uuid,
              documentTypeUuid: this.currentOrder.documentStatus.uuid,
              priceListUuid: this.currentPointOfSales.priceList.uuid,
              warehouseUuid: action.uuid
            })
            break
          case 'changeDocumentType':
            this.$store.dispatch('updateOrder', {
              orderUuid: this.currentOrder.uuid,
              posUuid: this.currentPointOfSales.uuid,
              documentTypeUuid: action.uuid,
              priceListUuid: this.currentPointOfSales.priceList.uuid,
              warehouseUuid: this.currentPointOfSales.warehouse.uuid
            })
            this.$store.commit('setCurrentDocumentTypePos', action)
            break
          case 'newOrder':
            this.createOrder({ withLine: action.withLine, newOrder: action.newOrder, customer: action.customer })
            break
          case 'maximumRefundAllowed':
            this.$store.dispatch('sendCreateCustomerAccount', action.payments)
            break
          case 'changePriceList':
            // this.$store.commit('setCurrentPriceList', action)
            this.$store.dispatch('updateOrder', {
              orderUuid: this.currentOrder.uuid,
              posUuid: this.currentPointOfSales.uuid,
              documentTypeUuid: this.currentOrder.documentStatus.uuid,
              priceListUuid: action.uuid,
              warehouseUuid: this.currentPointOfSales.warehouse.uuid
            })
            break
          case 'openBalanceInvoice':
            switch (action.typeRefund) {
              case 0:
                this.refundAllowed(this.currentPointOfSales.uuid, this.currentOrder.uuid, action.payment)
                break
              case 1:
                this.refundAllowed(action.posUuid, action.orderUuid, action.payments)
                break
              case 3:
                this.refundAllowed(action.posUuid, action.orderUuid, action.payments)
                break
              case 4:
                this.refundAllowed(action.posUuid, action.orderUuid, action.payments)
                break
            }
            this.$store.commit('dialogoInvoce', { show: true, type: 2 })
            this.$store.commit('dialogoInvoce', { show: false })
            break
        }
      }
    },
    closePin() {
      this.visible = false
      this.pin = ''
      this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
      this.setDocumentType(this.currentOrder.documentType)
      if (!this.isEmptyValue(this.currentOrder.uuid)) {
        this.$store.dispatch('reloadOrder', { orderUuid: this.currentOrder.uuid })
      }
    },
    refundAllowed(posUuid, orderUuid, payments) {
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      this.$store.commit('setProcessLoading', true)
      processOrder({
        posUuid,
        orderUuid,
        isOpenRefund: !this.isEmptyValue(this.$store.getters.getListRefundReference),
        createPayments: !this.isEmptyValue(payments),
        payments: payments
      })
        .then(response => {
          this.$store.dispatch('printTicket', {
            posId: this.currentPointOfSales.id,
            orderId: this.currentOrder.id
          })
          if (this.IsAllowsPreviewDocument) this.printPreview(posUuid, orderUuid)
          this.clearOrder()
          this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
          this.$store.dispatch('listPayments', { posUuid: this.currentPointOfSales.uuid, orderUuid: this.currentOrder.uuid })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          this.$store.dispatch('updatePaymentPos', false)
          this.$store.commit('dialogoInvoce', { show: false })
          this.$store.commit('setProcessLoading', false)
        })
    },
    printPreview(posUuid, orderUuid) {
      this.$store.dispatch('printTicketPreviwer', { posUuid, orderUuid })
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
            showClose: true
          })
        })
    },
    withoutPOSTerminal() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        this.$message({
          type: 'warn',
          message: this.$t('pointOfSales.withoutPOSTerminal'),
          showClose: true
        })
        return true
      }
      return false
    },
    arrowTop() {
      if (this.currentTable > 0) {
        this.currentTable--
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    arrowBottom() {
      const top = this.listOrderLine.length - 1
      if (this.currentTable < top) {
        this.currentTable++
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    updateOrder(update) {
      // user session
      const documentTypeUuid = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID_UUID'
      })
      if (!this.isEmptyValue(update.value) && update.value !== this.currentOrder.businessPartner.uuid && !this.isEmptyValue(this.currentPointOfSales)) {
        this.$store.dispatch('updateOrder', {
          orderUuid: this.currentOrder.uuid,
          posUuid: this.currentPointOfSales.uuid,
          customerUuid: update.value,
          priceListUuid: this.$store.getters.currentPriceList.uuid,
          warehouseUuid: this.currentPointOfSales.warehouse.uuid,
          documentTypeUuid
        })
      }
    },
    setBusinessPartner({ name, id, uuid }) {
      // Use update values of container (without subscription)
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID',
        value: id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'DisplayColumn_C_BPartner_ID',
        value: name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID_UUID',
        value: uuid
      })
    },
    setDocumentType({ name, id, uuid }) {
      // Use update values of container (without subscription)
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID',
        value: id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'DisplayColumn_C_DocTypeTarget_ID',
        value: name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID_UUID',
        value: uuid
      })
    },
    findProduct(searchValue) {
      if (this.withoutPOSTerminal()) {
        return
      }
      if (this.isEmptyValue(this.curretnPriceList)) {
        this.$message({
          type: 'warn',
          message: this.$t('pointOfSales.withoutPriceList'),
          showClose: true
        })
        return
      }
      const searchProduct = (typeof searchValue === 'object') ? searchValue.value : searchValue
      findProduct({
        searchValue: searchProduct,
        posUuid: this.currentPointOfSales.uuid,
        priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
        warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
      })
        .then(productPrice => {
          this.product = productPrice.product
          this.createOrder({ withLine: true })
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'info',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.commit('updateValuesOfContainer', {
            containerUuid: this.$route.meta.uuid,
            attributes: [{
              columnName: 'ProductValue',
              value: undefined
            }]
          })
        })
    },
    createOrder({ withLine = false, newOrder = false, customer }) {
      if (this.withoutPOSTerminal()) {
        return
      }
      if (newOrder || this.isEmptyValue(this.currentOrder.uuid)) {
        const posUuid = this.currentPointOfSales.uuid
        const bpartner = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_BPartner_ID_UUID'
        })
        const id = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_BPartner_ID'
        })
        const documentTypeUuid = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_DocTypeTarget_ID_UUID'
        })

        let customerUuid = this.isEmptyValue(bpartner) ? this.$store.getters.getNewCustomer.uuid : bpartner

        if (this.isEmptyValue(customerUuid) || id === 1000006) {
          customerUuid = this.currentPointOfSales.templateCustomer.uuid
        }
        // user session
        this.$store.dispatch('createOrder', {
          posUuid,
          customerUuid: this.currentPointOfSales.templateCustomer.uuid,
          salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
          priceListUuid: this.currentPointOfSales.priceList.uuid,
          warehouseUuid: this.currentPointOfSales.warehouse.uuid,
          documentTypeUuid
        })
          .then(response => {
            // this.order = response
            this.reloadOrder(true, response.uuid)
            this.$store.dispatch('listPayments', { posUuid, orderUuid: response.uuid })
            this.$store.commit('setShowPOSCollection', false)
            this.$router.push({
              params: {
                ...this.$route.params
              },
              query: {
                ...this.$route.query,
                action: response.uuid
              }
            }).then(() => {
              if (withLine) {
                this.createOrderLine(response.uuid)
              }
              this.$store.dispatch('listOrdersFromServer', {
                posUuid: this.currentPointOfSales.uuid
              })
            }).catch(() => {})
          })
      } else {
        this.createOrderLine(this.currentOrder.uuid)
      }
      this.$store.dispatch('changeFocusNewOrder', true)
    },
    reloadOrder(requery, orderUuid) {
      if (requery) {
        if (this.isEmptyValue(orderUuid)) {
          orderUuid = this.currentOrder.uuid
          // if (this.isEmptyValue(orderUuid)) {
          //   orderUuid = this.$store.getters.currentOrder.uuid // this.currentOrder.uuid
          // }
        }
        if (!this.isEmptyValue(orderUuid)) {
          this.$store.dispatch('reloadOrder', { orderUuid })
        }
      }
      this.setDocumentType(this.currentOrder.documentType)
    },
    fillOrder(order, setToStore = true) {
      const orderToPush = {
        uuid: order.uuid,
        id: order.id,
        businessPartner: order.businessPartner, // description, duns, id, lastName, naics, name, taxId, uuid, value
        documentNo: order.documentNo,
        dateOrdered: order.dateOrdered,
        documentStatus: order.documentStatus, // value, name, description
        documentType: order.documentType, // name, printName
        salesRepresentative: order.salesRepresentative, // id, uuid, name, description,
        totalLines: order.totalLines,
        grandTotal: order.grandTotal
      }
      if (setToStore) {
        this.$store.dispatch('setOrder', {
          ...orderToPush
        })
      }
    },
    getOrderTax(currency) {
      return this.formatPrice(this.currentOrder.grandTotal - this.currentOrder.totalLines, currency)
    },
    deleteOrderLine(lineSelection) {
      if (this.currentPointOfSales.isAllowsModifyQuantity) {
        deleteOrderLine({
          orderLineUuid: lineSelection.uuid
        })
          .then(response => {
            this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
            this.$store.dispatch('changeFocusNewOrder', true)
          })
          .catch(error => {
            console.error(error.message)
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      } else {
        const attributePin = {
          ...lineSelection,
          type: 'deleteLine',
          label: this.$t('form.pos.pinMessage.delete'),
          requestedAccess: 'IsAllowsModifyQuantity'
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
      }
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // TODO: Add container uuid comparison
        if (mutation.type === 'addActionPerformed') {
          switch (mutation.payload.columnName) {
            case 'QtyEntered':
              if (this.allowsModifyQuantity && !this.isEmptyValue(this.$store.state['pointOfSales/orderLine/index'].line)) {
                this.updateOrderLine(mutation.payload)
                // this.$message({
                //   type: 'success',
                //   message: this.$t('form.pos.pinMessage.updateQtyEntered'),
                //   showClose: true
                // })
              } else {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder',
                  label: this.$t('form.pos.pinMessage.qtyEntered'),
                  requestedAccess: 'IsAllowsModifyQuantity'
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              }
              break
            case 'PriceEntered':
              if (this.modifyPrice) {
                this.updateOrderLine(mutation.payload)
                // this.$message({
                //   type: 'success',
                //   message: this.$t('form.pos.pinMessage.updatePriceEntered'),
                //   showClose: true
                // })
              } else {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder',
                  label: this.$t('form.pos.pinMessage.price'),
                  requestedAccess: 'IsModifyPrice'
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              }
              break
            case 'Discount':
              if (this.modifyPrice) {
                this.updateOrderLine(mutation.payload)
                // this.$message({
                //   type: 'success',
                //   message: this.$t('form.pos.pinMessage.updateDiscountEntered'),
                //   showClose: true
                // })
              } else {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder',
                  label: this.$t('form.pos.pinMessage.discount'),
                  requestedAccess: 'isAllowsApplyDiscount'
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              }
              break
          }
        }
      })
    },
    shortcutKeyMethod(event) {
      switch (event.srcKey) {
        // case 'options':
        case 'up':
          this.arrowTop()
          break
        case 'popoverConvet':
          this.seeConversion = !this.seeConversion
          break
        case 'down':
          this.arrowBottom()
          break
        case 'plus':
          updateOrderLine({
            orderLineUuid: this.currentOrderLine.uuid,
            quantity: this.listOrderLine[this.currentTable].quantity + 1,
            priceListUuid: this.currentPointOfSales.priceList.uuid,
            warehouseUuid: this.currentPointOfSales.warehouse.uuid
          })
            .then(response => {
              this.fillOrderLine(response)
              this.reloadOrder(true)
            })
            .catch(error => {
              console.error(error.message)
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })

          break
        case 'minus':
          updateOrderLine({
            orderLineUuid: this.currentOrderLine.uuid,
            quantity: this.listOrderLine[this.currentTable].quantity - 1,
            priceListUuid: this.currentPointOfSales.priceList.uuid,
            warehouseUuid: this.currentPointOfSales.warehouse.uuid
          })
            .then(response => {
              this.fillOrderLine(response)
              this.reloadOrder(true)
            })
            .catch(error => {
              console.error(error.message)
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })
          break
      }
    },
    clearOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: this.currentPointOfSales.id
        }
      }).catch(() => {
      }).finally(() => {
        this.$store.commit('setListPayments', {})
        const { templateCustomer } = this.currentPointOfSales
        this.$store.commit('updateValuesOfContainer', {
          containerUuid: this.metadata.containerUuid,
          attributes: [{
            columnName: 'UUID',
            value: undefined
          },
          {
            columnName: 'ProductValue',
            value: undefined
          },
          {
            columnName: 'C_BPartner_ID',
            value: templateCustomer.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: templateCustomer.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: templateCustomer.uuid
          }]
        })
        this.$store.dispatch('setOrder', {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        })
        this.$store.commit('setShowPOSCollection', false)
        this.$store.dispatch('listOrderLine', [])
      })
    },
    changePos(posElement) {
      this.$store.dispatch('setCurrentPOS', posElement)
      this.clearOrder()
    }
  }
}
