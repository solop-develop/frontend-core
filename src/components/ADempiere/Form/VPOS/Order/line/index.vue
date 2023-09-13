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
      <!-- <template> -->
      <el-col :span="8">
        <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
          <field-definition
            v-if="!isEmptyValue(fieldPriceProduct)"
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
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form label-position="top" @submit.native.prevent="notSubmitForm">
          <el-form-item label="Unidad de Medida">
            <el-select
              v-model="uomValue"
              style="width: 100% !important;"
              @change="changUomLine"
              @visible-change="findUomList"
            >
              <el-option
                v-for="(item, key) in uomList"
                :key="key"
                :label="item.uom.name"
                :value="item.uom.uuid"
              >
                <span style="float: left">{{ item.uom.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
          <field-definition
            v-if="!isEmptyValue(fieldQtyProduct)"
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
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
              <el-form-item label="Precio Base" style="margin-left: 10px;">
                <el-input
                  v-model="priceBase"
                  :disabled="true"
                  controls-position="right"
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
              <el-form-item label="Unidad de Medida Base" style="margin-right: -4px !important;">
                <el-input
                  v-model="currentLine.productUom.product_uom.name"
                  :disabled="true"
                  controls-position="right"
                  style="width: 100% !important;"
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
              <el-form-item label="Cantidad Base" style="margin-right: 9px;margin-left: 10px;">
                <el-input
                  v-model="baseUom"
                  :disabled="true"
                  controls-position="right"
                  style="width: 100% !important;"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
      <el-divider>
        {{ num }}
      </el-divider>
      <el-col :span="24">
        <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
          <field-definition
            v-if="!isEmptyValue(fieldDiscountProduct)"
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
        </el-form>
      </el-col>
    </el-row>
    <el-row
      v-if="!isEmptyValue(metadataList) && isLoadedField"
      :gutter="20"
    >
      <el-col :span="12">
        <el-form label-position="top" :inline="true" label-width="10px" @submit.native.prevent="notSubmitForm">
          <el-form-item :label="$t('route.warehouse')" style="margin-left: 2%;width: 100% !important;">
            <el-select
              v-model="stock"
              style="display: block;"
              @change="changeWarehouseLine"
              @visible-change="loadStock"
            >
              <el-option
                v-for="(item, key) in listWarehouseLine"
                :key="key"
                :label="item.label"
                :value="item.uuid"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.sumaryQty }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form label-position="top" :inline="true" label-width="10px" @submit.native.prevent="notSubmitForm">
          <el-form-item label="Cantidad Disponible" style="width: 98% !important;">
            <el-input-number
              v-model="$store.state['pointOfSales/orderLine/index'].line.availableQuantity"
              :disabled="true"
              controls-position="right"
              :precision="2"
              style="text-align: end !important;width: 100%;"
            />
          </el-form-item>
        </el-form>
      </el-col>
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
// Constants
import fieldsListLine from './fieldsListLine.js'

// Components and Mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import orderLineMixin from '@/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'

// API Request Methods
import { validatePin, updateOrderLine } from '@/api/ADempiere/form/point-of-sales.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'

// Format of values ( Date, Price, Quantity )
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
  name: 'FieldLine',

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
      timeOutUpdate: null,
      // isloadedUpdateLine: false,
      unsubscribe: () => {}
    }
  },

  computed: {
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
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isModifyPrice)) {
        return pos.isModifyPrice
      }
      return false
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
                if (this.$store.state['pointOfSales/orderLine/index'].isloadedLine) {
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
                if (this.modifyPrice && !this.$store.state['pointOfSales/orderLine/index'].isloadedLine) {
                  this.updateOrderLine(mutation.payload)
                  this.$message({
                    type: 'success',
                    message: this.$t('form.pos.pinMessage.updatePriceEntered'),
                    showClose: true
                  })
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
                if (this.isEmptyValue(mutation.payload.value) || mutation.payload.value === this.$store.state['pointOfSales/orderLine/index'].line.discountRate) {
                  return
                }
                if (
                  this.currentPointOfSales.isAllowsModifyDiscount &&
                  (mutation.payload.value > this.currentPointOfSales.maximumLineDiscountAllowed && this.currentPointOfSales.maximumLineDiscountAllowed === 0)
                ) {
                  this.updateOrderLine(mutation.payload)
                } else if (
                  this.modifyDiscount &&
                  mutation.payload.value <= this.currentPointOfSales.maximumLineDiscountAllowed
                ) {
                  this.updateOrderLine(mutation.payload)
                } else {
                  const attributePin = {
                    ...mutation.payload,
                    type: 'updateOrder',
                    requestedAccess: 'IsAllowsModifyDiscount',
                    label: this.$t('form.pos.pinMessage.discount')
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
