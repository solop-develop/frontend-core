<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <div class="wrapper">
    <el-row
      v-if="!isEmptyValue(metadataList) && isLoadedField"
    >
      <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
        <el-col v-if="!isEmptyValue(fieldPriceProduct)" :span="24">
          <el-form-item
            v-if="!isModifyPrice && !isAllowChangePrice"
            :label="$t('form.productInfo.price')"
            style="padding-left: 3%;padding-right: 2%;"
          >
            <el-input
              v-model="currentValuePriceField"
              disabled
            >
              <el-button
                slot="append"
                type="success"
                style="color: #FFFFFF;background-color: #13ce66;border-color: #13ce66;"
                @click="allowChangePrice"
              >
                {{ $t('form.pos.order.BusinessPartnerCreate.address.edit') }}
              </el-button>
            </el-input>
          </el-form-item>
          <!-- <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm"> -->
          <field-definition
            v-else
            :ref="fieldPriceProduct.columnName"
            :metadata-field="{
              ...fieldPriceProduct,
              labelCurrency: currencyPointOfSales.iSOCode,
            }"
            :container-uuid="'line'"
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
          <!-- </el-form> -->
        </el-col>
        <el-col v-if="!isEmptyValue(fieldQtyProduct)" :span="24" :style="!isModifyPrice && !isAllowChangePrice ? 'margin-bottom: 5%;' : 'margin-top: 5%;margin-bottom: 5%;'">
          <el-form-item
            v-if="!allowsModifyQuantity && !isAllowChangeQty"
            :label="$t('form.pos.tableProduct.quantity')"
            style="padding-left: 3%;padding-right: 2%;"
          >
            <el-input
              v-model="currentValueQtyField"
              disabled
            >
              <el-button
                slot="append"
                type="success"
                round
                style="color: #FFFFFF;background-color: #13ce66;border-color: #13ce66;"
                @click="allowChangeQty"
              >
                {{ $t('form.pos.order.BusinessPartnerCreate.address.edit') }}
              </el-button>
            </el-input>
          </el-form-item>
          <field-definition
            v-else
            :metadata-field="{
              ...fieldQtyProduct,
              precision: precisionUom
            }"
            :container-uuid="'line'"
            :container-manager="{
              ...containerManager,
              getLookupList,
              isDisplayedField,
              generalInfoSearch,
              searchTableHeader,
              isDisplayedDefault,
              isMandatoryField,
              isReadOnlyField,
              changeFieldShowedFromUser
            }"
          />
          <!-- </el-form> -->
        </el-col>
        <el-col v-if="!isEmptyValue(fieldDiscountProduct)" :span="24">
          <el-form-item
            v-if="!isAllowsModifyDiscount && !currentValueDiscuentField"
            :label="$t('form.pos.order.discount')"
            style="padding-left: 3%;padding-right: 2%;"
          >
            <el-input
              v-model="currentValueDiscuentField"
              disabled
            >
              <el-button
                slot="append"
                type="success"
                round
                style="color: #FFFFFF;background-color: #13ce66;border-color: #13ce66;"
                @click="allowChangePrice"
              >
                {{ $t('form.pos.order.BusinessPartnerCreate.address.edit') }}
              </el-button>
            </el-input>
          </el-form-item>
          <field-definition
            v-else
            :metadata-field="fieldDiscountProduct"
            :container-uuid="'line'"
            :container-manager="{
              ...containerManager,
              getLookupList,
              isDisplayedField,
              generalInfoSearch,
              searchTableHeader,
              isDisplayedDefault,
              isMandatoryField,
              isReadOnlyField,
              changeFieldShowedFromUser
            }"
          />
          <!-- </el-form> -->
        </el-col>
      </el-form>
    </el-row>
    <div
      v-else
      key="form-loading"
      v-loading="isEmptyValue(metadataList)"
      :element-loading-text="$t('notifications.loading')"
      :element-loading-spinner="'el-icon-loading'"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="view-loading"
    />
  </div>
</template>
<script>
// constants
import fieldsListLine from './fieldsListLine.js'

// components and mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// api request methods
import { validatePin, updateOrderLine } from '@/api/ADempiere/form/point-of-sales.js'

import orderLineMixin from '@/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'
// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'

// Format of values ( Date, Price, Quantity )
// import {
//   formatQuantity
// } from '@/utils/ADempiere/valueFormat.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

import {
  getLookupList,
  isDisplayedField,
  isDisplayedDefault,
  isMandatoryField,
  generalInfoSearch,
  searchTableHeader,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'EditLineMobile',

  components: {
    FieldDefinition
  },

  mixins: [
    orderLineMixin
  ],

  props: {
    dataLine: {
      type: Object,
      default: () => {}
    },
    showField: {
      type: Boolean,
      default: false
    },
    currentLine: {
      type: Object,
      default: () => {}
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
      metadataList: [],
      panelMetadata: {},
      isLoaded: false,
      isAllowChangePrice: false,
      isAllowChangeQty: false,
      isAllowChangeDiscount: false,
      num: '',
      conver: '',
      qtyAvalible: 5,
      isLoadedField: false,
      panelType: 'custom',
      defaultData: {},
      fieldsListLine,
      fieldsList: [],
      options: [],
      priceBase: '',
      stock: '',
      uomValue: '',
      uomValueRate: '',
      uomList: [],
      baseUom: 0,
      unsubscribe: () => {}
    }
  },

  computed: {
    currentValuePriceField() {
      return this.displayValue(this.currentLine, {
        row: this.currentLine,
        columnName: 'CurrentPrice'
      })
    },
    currentValueQtyField() {
      return this.displayValue(this.currentLine, {
        row: this.currentLine,
        columnName: 'QtyEntered'
      })
    },
    currentValueDiscuentField() {
      return this.displayValue(this.currentLine, {
        row: this.currentLine,
        columnName: 'Discount'
      })
    },
    fieldPriceProduct() {
      return this.metadataList.find(field => field.columnName === 'PriceEntered')
    },
    fieldQtyProduct() {
      return this.metadataList.find(field => field.columnName === 'QtyEntered')
    },
    fieldDiscountProduct() {
      return this.metadataList.find(field => field.columnName === 'Discount')
    },
    currentLineOrde() {
      const line = this.currentPointOfSales.currentOrder.lineOrder.find(a => a.uuid === this.currentLine.uuid)
      return line
    },

    isAllowsModifyDiscount() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyDiscount
    },

    allowsModifyQuantity() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyQuantity
    },
    precisionUom() {
      if (!isEmptyValue(this.uomValue) && this.currentLine.uom.uom !== this.uomValue) {
        const uomSelected = this.uomList.find(uomItem => {
          return uomItem.uom.uuid === this.uomValue
        })
        if (!isEmptyValue(this.uomSelected)) {
          return uomSelected.uom.starndard_precision
        }
      }
      if (this.currentLine.uom && this.currentLine.uom.uom) {
        return this.currentLine.uom.uom.starndard_precision
      }
      return undefined
    },
    currentWarehouseQty: {
      get() {
        const warehouseQty = this.currentPointOfSales.currentOrder.lineOrder.find(a => a.uuid === this.currentLine.uuid)
        return warehouseQty.quantityOrdered
      },
      set(value) {
        return value
      }
    },
    modifyDiscount() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyDiscount
    },
    currentLineOrder() {
      const line = this.$store.state['pointOfSales/orderLine/index'].line
      if (!this.isEmptyValue(line)) {
        return line
      }
      return {}
    },
    isModifyPrice() {
      return this.$store.getters.posAttributes.currentPointOfSales.isModifyPrice
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin) && !this.validatePin) {
        return pos.isPosRequiredPin
      }
      return false
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    validatePin() {
      return this.$store.state['pointOfSales/orderLine/index'].validatePin
    },
    currencyPointOfSales() {
      if (!this.isEmptyValue(this.currentPointOfSales)) {
        return this.currentPointOfSales.priceList.currency
      }
      return ''
    },
    isDisplayTaxAmount() {
      return this.currentPointOfSales.isDisplayTaxAmount
    },
    isDisplayDiscount() {
      return this.currentPointOfSales.isDisplayDiscount
    },
    listWarehouseLine() {
      const listWarehouseLine = this.$store.getters.getListWarehouseLine
      let defaultLineWarehouse
      if (!this.isEmptyValue(this.currentLine.warehouse)) {
        defaultLineWarehouse = listWarehouseLine.find(stock => stock.uuid === this.currentLine.warehouse.uuid)
      }
      if (this.isEmptyValue(defaultLineWarehouse)) {
        listWarehouseLine.push({
          ...this.currentLine.warehouse,
          label: this.currentLine.warehouse.name,
          id: this.currentLine.warehouse.id,
          uuid: this.currentLine.warehouse.uuid,
          sumaryQty: this.currentLine.availableQuantity
        })
        const list = listWarehouseLine
        return list
      }
      return listWarehouseLine
    }
  },

  watch: {
    showField(value) {
      this.restarAllow()
      this.baseUom = this.currentLine.quantityOrderedLine
      this.priceBase = this.currencyPointOfSales.curSymbol + this.currentLine.priceBase
      // this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: true })
      if (value && this.isEmptyValue(this.metadataList) && (this.dataLine.uuid === this.$store.state['pointOfSales/orderLine/index'].line.uuid)) {
        this.metadataList = this.setFieldsList()
        this.isLoadedField = true
      }
      if (value) {
        this.fillOrderLineQuantities({
          currentPrice: this.fieldShowValue({
            row: this.currentLine,
            columnName: 'CurrentPrice'
          }),
          quantityOrdered: this.currentLine.quantity,
          discount: this.currentLine.discount
        })
        this.isLoadedField = true
      }
      if (!this.isEmptyValue(this.currentLine.warehouse)) {
        this.stock = this.currentLine.warehouse.uuid
      }
      this.uomValue = this.currentLine.uom.uom.uuid
      this.uomValueRate = this.currentLine.productUom.uom.name
      if (this.currentLine.uom.divide_rate >= this.currentLine.uom.multiply_rate) {
        this.num = '1 ' + this.currentLine.uom.uom.name + ' (' + this.currentLine.uom.uom.symbol + ') ' + ' ~ ' + this.formatQuantity({ value: this.currentLine.uom.divide_rate }) + ' ' + this.currentLine.productUom.product_uom.name + ' (' + this.currentLine.productUom.product_uom.symbol + ') '
      } else {
        this.num = '1 ' + this.currentLine.uom.uom.name + ' (' + this.currentLine.uom.uom.symbol + ') ' + ' ~ ' + this.formatQuantity({ value: this.currentLine.uom.multiply_rate }) + ' ' + this.currentLine.productUom.product_uom.name + ' (' + this.currentLine.productUom.product_uom.symbol + ') '
      }
      this.findUomList(value)
    }
  },

  beforeMount() {
    this.unsubscribe = this.subscribeChanges()
  },

  mounted() {
    if (this.isEmptyValue(this.metadataList) && (this.dataLine.uuid === this.$store.state['pointOfSales/orderLine/index'].line.uuid)) {
      this.metadataList = this.setFieldsList()
      this.isLoadedField = true
    }
    this.restarAllow()
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
    createFieldFromDictionary,
    formatQuantity,
    restarAllow() {
      this.isAllowChangePrice = false
      this.isAllowChangeDiscount = false
      this.isAllowChangeQty = false
    },
    allowChangePrice() {
      this.isAllowChangePrice = true
    },
    allowChangeQty() {
      this.isAllowChangeQty = true
    },
    allowChangeDiscount() {
      this.isAllowChangeDiscount = true
    },
    findUomList(value) {
      if (value) {
        if (!this.isEmptyValue(this.currentLine.product)) {
          this.$store.dispatch('findUom', {
            productId: this.currentLine.product.id
          })
            .then(response => {
              this.uomList = response.records
            })
        }
      }
    },
    loadStock(value) {
      if (value) {
        if (!this.isEmptyValue(this.currentLine.product)) {
          this.$store.dispatch('findWarehouse', {
            value: this.currentLine.product.value,
            sku: this.currentLine.product.sku
          })
        }
      }
    },
    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.fieldsListLine.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(metadata => {
            const data = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'line'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      return fieldsList
    },
    fillOrderLineQuantities({
      currentPrice,
      quantityOrdered,
      discount
    }) {
      this.defaultData = {
        currentPrice,
        quantityOrdered,
        discount
      }
      const containerUuid = 'line'
      // Editable fields
      if (!this.isEmptyValue(quantityOrdered)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'line',
          columnName: 'QtyEntered',
          value: quantityOrdered
        })
      }
      if (!this.isEmptyValue(currentPrice)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'PriceEntered',
          value: currentPrice
        })
      }
      if (!this.isEmptyValue(discount)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'Discount',
          value: discount
        })
      }
    },
    closePing() {
      this.$refs.ping[this.$refs.ping.length - 1].showPopper = false
      // this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
    },
    checkclosePin(pin) {
      const { requestedAccess } = this.$store.getters.getOverdrawnInvoice.attributePin
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin,
        orderId: this.currentOrder.id,
        requestedAccess
      })
        .then(response => {
          this.$store.commit('pin', true)
          this.pin = ''
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pin = ''
        })
      this.closePing()
    },
    convertValuesToSend(values) {
      const valuesToSend = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (this.isEmptyValue(value)) {
          return
        }
        switch (value.columnName) {
          case 'PriceEntered':
            valuesToSend['currentPrice'] = value.value
            break
          case 'QtyEntered':
            valuesToSend['quantityOrdered'] = value.value
            break
          case 'Discount':
            valuesToSend['discount'] = value.value
            break
        }
      })
      return valuesToSend
    },
    changeWarehouseLine(value) {
      updateOrderLine({
        posUuid: this.currentPointOfSales.uuid,
        orderLineUuid: this.currentLine.uuid,
        warehouseUuid: value
      })
        .then(response => {
          this.$store.dispatch('currentLine', response)
          this.stock = response.warehouse.uuid
          this.$message({
            type: 'success',
            message: this.$t('pointOfSales.orderLine.updateSuccess'),
            showClose: true
          })
        })
        .catch(error => {
          this.stock = this.currentLine.warehouse.uuid
          console.warn(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    changUomLine(value) {
      const uom = this.uomList.find(uom => {
        if (value === uom.uom.uuid) {
          return uom
        }
      })
      // this.uomValueRate = uom.uom.name + ' ' + this.currentLine.productUom.product_uom.name + ' ( ' + this.currentLine.productUom.product_uom.symbol + ')'
      if (uom.divide_rate >= uom.multiply_rate) {
        this.num = '1 ' + uom.uom.name + ' (' + uom.uom.symbol + ') ' + ' ~ ' + this.formatQuantity({ value: uom.divide_rate }) + ' ' + this.currentLine.productUom.product_uom.name + ' (' + this.currentLine.productUom.product_uom.symbol + ') '
        // this.num = uom.divide_rate
      } else {
        this.num = '1 ' + uom.uom.name + ' (' + uom.uom.symbol + ') ' + ' ~ ' + this.formatQuantity({ value: uom.multiply_rate }) + ' ' + this.currentLine.productUom.product_uom.name + ' (' + this.currentLine.productUom.product_uom.symbol + ') '
      }
      updateOrderLine({
        posUuid: this.currentPointOfSales.uuid,
        orderLineUuid: this.currentLine.uuid,
        uomUuid: uom.uom.uuid
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: this.$t('pointOfSales.orderLine.updateSuccess'),
            showClose: true
          })
          this.$store.dispatch('currentLine', response)
          this.baseUom = response.quantityOrdered
          this.$store.commit('updateValueOfField', {
            containerUuid: 'line',
            columnName: 'PriceEntered',
            value: response.price
          })
          this.fillOrderLine(response)
          this.priceBase = this.currencyPointOfSales.curSymbol + response.priceBase
          this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
        })
        .catch(error => {
          this.stock = this.currentLine.warehouse.uuid
          console.warn(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (!this.isEmptyValue(mutation.payload) && !this.isEmptyValue(mutation.payload.containerUuid) && mutation.payload.containerUuid === 'line') {
          if (mutation.type === 'updateValueOfField') {
            switch (mutation.payload.columnName) {
              case 'QtyEntered':
                // qtyEntered = this.fieldShowValue({
                //   row: this.currentLineOrder,
                //   columnName: 'QtyEntered'
                // })
                if (mutation.payload.value === this.$store.state['pointOfSales/orderLine/index'].line.quantity) {
                  return
                }
                if (this.allowsModifyQuantity && !this.isEmptyValue(this.$store.state['pointOfSales/orderLine/index'].line)) {
                  this.$message({
                    type: 'success',
                    message: this.$t('form.pos.pinMessage.updateQtyEntered'),
                    showClose: true
                  })
                  this.updateOrderLine(mutation.payload)
                } else {
                  const attributePin = {
                    ...mutation.payload,
                    type: 'updateOrder',
                    requestedAccess: 'IsAllowsModifyQuantity',
                    label: this.$t('form.pos.pinMessage.qtyEntered')
                  }
                  this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                }
                break
              case 'PriceEntered':
                if (this.isEmptyValue(mutation.payload.value) || mutation.payload.value === this.$store.state['pointOfSales/orderLine/index'].line.price) {
                  return
                }
                if (this.modifyPrice) {
                  this.$message({
                    type: 'success',
                    message: this.$t('form.pos.pinMessage.updatePriceEntered'),
                    showClose: true
                  })
                  this.updateOrderLine(mutation.payload)
                } else {
                  const attributePin = {
                    ...mutation.payload,
                    type: 'updateOrder',
                    requestedAccess: 'IsModifyPrice',
                    label: mutation.payload.columnName === 'PriceEntered' ? this.$t('form.pos.pinMessage.price') : this.$t('form.pos.pinMessage.discount')
                  }
                  this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                }
                break
              case 'Discount':
                // discount = this.fieldShowValue({
                //   row: this.currentLineOrder,
                //   columnName: 'Discount'
                // })
                if (this.isEmptyValue(mutation.payload.value) || mutation.payload.value === this.$store.state['pointOfSales/orderLine/index'].line.discount) {
                  return
                }
                if (this.modifyDiscount) {
                  this.$message({
                    type: 'success',
                    message: this.$t('form.pos.pinMessage.updateDiscountEntered'),
                    showClose: true
                  })
                  this.updateOrderLine(mutation.payload)
                } else {
                  const attributePin = {
                    ...mutation.payload,
                    type: 'updateOrder',
                    requestedAccess: 'IsAllowsModifyDiscount',
                    label: mutation.payload.columnName === 'PriceEntered' ? this.$t('form.pos.pinMessage.price') : this.$t('form.pos.pinMessage.discount')
                  }
                  this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                }
                break
            }
          }
        }
        if (mutation.type === 'addFocusGained' && this.isPosRequiredPin && (mutation.payload.columnName === 'PriceEntered' || mutation.payload.columnName === 'Discount' || mutation.payload.columnName === 'QtyEntered')) {
          this.columnNameVisible = mutation.payload.columnName
          // this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: true })
        }
        // if (mutation.type === 'updateValueOfField' && (mutation.payload.columnName === 'PriceEntered' || mutation.payload.columnName === 'Discount' || mutation.payload.columnName === 'QtyEntered')) {
        //   const values = this.$store.getters.getValuesView({
        //     containerUuid: mutation.payload.containerUuid,
        //     format: 'array'
        //   })
        //   const { currentPrice, quantityOrdered, discount } = this.convertValuesToSend(values)

        //   if (!this.isEmptyValue(currentPrice) && this.defaultData.currentPrice !== currentPrice) {
        //     this.fillOrderLineQuantities({
        //       currentPrice,
        //       quantityOrdered,
        //       discount
        //     })
        //     this.updateOrderLine({
        //       columnName: mutation.payload.columnName,
        //       value: mutation.payload.value
        //     })
        //   } else if (!this.isEmptyValue(discount) && this.defaultData.discount !== discount) {
        //     this.fillOrderLineQuantities({
        //       currentPrice,
        //       quantityOrdered,
        //       discount
        //     })
        //     this.updateOrderLine({
        //       columnName: mutation.payload.columnName,
        //       value: mutation.payload.value
        //     })
        //   } else if (!this.isEmptyValue(quantityOrdered) && this.defaultData.quantityOrdered !== quantityOrdered) {
        //     this.fillOrderLineQuantities({
        //       currentPrice,
        //       quantityOrdered,
        //       discount
        //     })
        //     this.updateOrderLine({
        //       columnName: mutation.payload.columnName,
        //       value: mutation.payload.value
        //     })
        //   }
        // }
      })
    }
  }
}
</script>

<style>
.el-input.is-disabled .el-input__inner {
  text-align: right;
}
</style>
