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
  <div
    v-if="isLoaded"
    id="headerContainer"
    style="display: flex; height: 100% !important;"
  >
    <el-container style="background: white; height: 100%!important;">
      <el-header
        height="100px"
        :style="isShowedPOSKeyLayout ? 'padding-right: 1%; padding-left: 1%;' : 'padding-right: 1%; padding-left: 1%;'"
      >
        <el-form label-position="top" label-width="500px" @submit.native.prevent="notSubmitForm">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="colFieldProductCode" style="padding-left: 0px; padding-right: 0px;">
              <template
                v-for="(field) in fieldsList"
              >
                <product-info
                  v-if="field.columnName === 'ProductValue'"
                  id="ProductValue"
                  ref="ProductValue"
                  :key="field.columnName"
                  :metadata="field"
                />
              </template>
            </el-col>
            <el-col :span="isMobile ? 12 : 6" :style="styleTab">
              <business-partner
                id="BusinessPartner"
                :parent-metadata="{
                  name: panelMetadata.name,
                  containerUuid: panelMetadata.containerUuid,
                  uuid: panelMetadata.uuid,
                  panelType: panelMetadata.panelType
                }"
                :is-disabled="isDisabled"
              />
            </el-col>
            <el-col v-if="!isMobile" :span="6">
              <fast-ordes-list style="margin-right: 2%;margin-left: 2%;font-size: 0px;" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="background: white; padding: 0px; height: 100% !important; overflow: auto;z-index: 9">
        <el-container style="background: white; padding: 0px; height: 100% !important;">
          <el-main style="padding-top: 0px; overflow: auto; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
            <el-table
              id="linesOrder"
              ref="linesTable"
              v-shortkey="shortsKey"
              :data="listOrderLine"
              border
              highlight-current-row
              fit
              :class="classOrderLine"
              @current-change="handleCurrentLineChange"
              @shortkey.native="shortcutKeyMethod"
              @cell-click="editCell"
              @click.native.prevent="productFocus()"
            >
              <template v-for="(valueOrder, item, key) in orderLineDefinition">
                <el-table-column
                  v-if="displayLabel(valueOrder)"
                  :key="key"
                  :column-key="valueOrder.columnName"
                  :label="valueOrder.label"
                  :width="sizeTableColumn(valueOrder)"
                  :align="valueOrder.isNumeric ? 'right' : 'left'"
                >
                  <template slot-scope="scope">
                    <template v-if="!isMobile && isEditQtyOrdered && fileColumnNameEdit === 'CurrentPrice' && valueOrder.columnName === 'CurrentPrice' && !isEmptyValue(isEditLine.uuid) && isEditLine.uuid === scope.row.uuid && isValidateDocumentType">
                      <el-input-number
                        ref="editField"
                        v-model="currentPriceTableEdit"
                        v-shortkey="shortKeysInputTable"
                        :autofocus="true"
                        controls-position="right"
                        style="width: 100%;"
                        @shortkey.native="theActionEdit"
                      />
                    </template>
                    <template v-else-if="!isMobile && isEditQtyOrdered && fileColumnNameEdit === 'QtyEntered' && valueOrder.columnName === 'QtyEntered' && !isEmptyValue(isEditLine.uuid) && isEditLine.uuid === scope.row.uuid && isValidateDocumentType">
                      <el-input-number
                        ref="editField"
                        v-model="scope.row.quantityOrdered"
                        v-shortkey="shortKeysInputTable"
                        :autofocus="true"
                        controls-position="right"
                        style="width: 100%;"
                        :precision="isEmptyValue(scope.row.uom) ? 0 : scope.row.uom.uom.starndard_precision"
                        @change="changeEdit(scope.row.quantityOrdered, valueOrder.columnName)"
                        @shortkey.native="theActionEdit"
                      />
                    </template>
                    <template v-else-if="valueOrder.columnName === 'UOM'">
                      <span v-if="isEmptyValue(scope.row.uom.uom)" />
                      <span v-else>
                        {{ isEmptyValue(scope.row.uom.uom.symbol) ? scope.row.uom.uom.name : scope.row.uom.uom.symbol }}
                      </span>
                    </template>
                    <template v-else-if="!isMobile && isEditQtyOrdered && fileColumnNameEdit === 'Discount' && valueOrder.columnName === 'Discount' && !isEmptyValue(isEditLine.uuid) && isEditLine.uuid === scope.row.uuid && isValidateDocumentType">
                      <el-input-number
                        ref="editField"
                        v-model="scope.row.discount"
                        v-shortkey="shortKeysInputTable"
                        :autofocus="true"
                        controls-position="right"
                        style="width: 100%;"
                        @change="changeEdit(scope.row.discount, valueOrder.columnName)"
                        @shortkey.native="theActionEdit"
                      />
                    </template>
                    <span v-else>
                      <el-button
                        v-show="valueOrder.columnName === 'LineDescription'"
                        type="text"
                        icon="el-icon-document-copy"
                        @click="copyCode(scope.row)"
                      />
                      <el-button
                        v-show="isMobile && valueOrder.columnName === 'CurrentPrice'"
                        type="text"
                        icon="el-icon-edit"
                        @click="openEditModeMobile(scope.row)"
                      />
                      <el-button
                        v-show="isMobile && valueOrder.columnName === 'QtyEntered'"
                        type="text"
                        icon="el-icon-edit"
                        @click="openEditModeMobile(scope.row)"
                      />
                      {{ displayValue(scope.row, valueOrder) }}
                    </span>
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                v-if="!isMobile"
                :label="$t('form.pos.tableProduct.options')"
                width="165"
              >
                <template slot-scope="scope">
                  <info-order-line
                    :record-row="scope.row"
                  />
                  <el-popover
                    ref="showFieldLine"
                    placement="right"
                    trigger="click"
                    :title="$t('form.pos.tableProduct.editQuantities')"
                    width="950"
                    @hide="showFieldLine = false"
                  >
                    <field-line
                      :data-line="scope.row"
                      :show-field="showFieldLine"
                      :current-line="currentLineOrder"
                    />
                    <el-button slot="reference" type="success" icon="el-icon-edit" size="mini" style="margin-right: 3%;" :disabled="isDisabled" @click="showEditLine(scope.row)" />
                  </el-popover>
                  <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="isDisabled" @click="deleteOrderLine(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-main>

          <el-footer v-if="!isMobile" :class="classOrderFooter">
            <div class="keypad">
              <el-row :gutter="24">
                <el-button type="info" icon="el-icon-top" :disabled="isDisabled" @click="arrowTop" />
                <el-button type="info" icon="el-icon-bottom" :disabled="isDisabled" @click="arrowBottom" />
                <el-button v-show="isValidForDeleteLine(listOrderLine)" type="danger" icon="el-icon-delete" :disabled="isDisabled" @click="deleteOrderLine(currentOrderLine)" />
                <el-button
                  v-show="isValidToRelease"
                  type="primary"
                  @click="releaseSalesOrder()"
                >
                  <i class="el-icon-document-checked" />
                  {{ $t('form.pos.releaseOrder') }}
                </el-button>
                <el-button
                  v-show="allowsCollectOrder"
                  type="success"
                  icon="el-icon-bank-card"
                  @click="openCollectionPanel"
                >
                  {{ labelButtonCollections }}
                </el-button>
              </el-row>
              <p id="point" style="margin-bottom: 5%;margin-top: 3%;">
                <el-dropdown
                  v-if="!isEmptyValue(currentPointOfSales)"
                  trigger="click"
                  class="info-pos"
                  @command="changePos"
                >
                  <span>
                    <i class="el-icon-mobile-phone" />
                    {{ $t('form.pos.order.pointSale') }}: <b style="cursor: pointer"> {{ currentPointOfSales.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listPointOfSales"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentDocumentType)"
                  trigger="click"
                  class="info-pos"
                  @command="changeDocumentType"
                >
                  <span>
                    <el-icon class="el-icon-document" />
                    {{ $t('pointOfSales.order.documentType') }}:
                    <b style="cursor: pointer"> {{ currentDocumentType.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item, index) in listDocumentTypes"
                      :key="index"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.key }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentWarehouse)"
                  trigger="click"
                  class="info-pos"
                  @command="changeWarehouse"
                >
                  <span>
                    <svg-icon icon-class="tree" />
                    {{ $t('route.warehouse') }}: <b style="cursor: pointer"> {{ currentWarehouse.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listWarehouses"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentPriceList)"
                  trigger="click"
                  class="info-pos"
                  @command="changePriceList"
                >
                  <span>
                    <svg-icon icon-class="tree-table" />
                    {{ $t('form.pos.priceList') }}: <b style="cursor: pointer"> {{ currentPriceList.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in pointPriceList"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>

                <el-dropdown
                  v-if="!isEmptyValue(listCampaign)"
                  trigger="click"
                  class="info-pos"
                  @command="changeCampaign"
                >
                  <span>
                    <i class="el-icon-guide" />
                    {{ $t('form.pos.order.campaign') }}:
                    <b style="cursor: pointer">
                      {{ currentCampaign }}
                    </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listCampaign"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentDiscountList)"
                  trigger="click"
                  class="info-pos"
                  @command="changeDiscountList"
                >
                  <span>
                    <svg-icon icon-class="list" />
                    {{ $t('form.pos.discountList') }}: <b style="cursor: pointer"> {{ currentDiscountList.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in pointDiscountList"
                      :key="item.uuid"
                      :command="item"
                      :disabled="isDisabled"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div>
            <span style="float: right;">
              <div style="padding-left: 10px;padding-right: 10px;">
                <i class="el-icon-s-custom" />
                {{ $t('form.pos.order.seller') }}:
                <b style="cursor: pointer">
                  {{ currentOrder.salesRepresentative.name }}
                </b>

                <p class="total"> {{ $t('form.pos.order.subTotal') }}:<b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">{{ formatPrice(currentOrder.totalLines, currentOrder.priceList.currency.iso_code) }}</b></p>
                <p class="total"> {{ $t('form.pos.tableProduct.displayDiscountAmount') }}:<b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.discountAmount, currentOrder.priceList.currency.iso_code) }}</b> </p>
                <p class="total"> {{ $t('form.pos.order.tax') }}:<b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.taxAmount, currentOrder.priceList.currency.iso_code) }}</b> </p>
              </div>
              <div style="border: 1px solid rgb(54, 163, 247);padding-left: 10px;padding-right: 10px;">
                <p class="total">
                  <b>
                    {{ $t('form.pos.order.total') }}:
                  </b>
                  <b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">
                    {{ formatPrice(currentOrder.grandTotal, currentOrder.priceList.currency.iso_code) }}
                  </b>
                </p>
                <p v-if="!isEmptyValue(currentPointOfSales.displayCurrency)" class="total"> <b> {{ $t('form.pos.collect.convertedAmount') }}: </b> <b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.grandTotal / totalAmountConverted, currentPointOfSales.displayCurrency.iso_code) }}</b> </p>
              </div>
            </span>
            <span style="float: right;padding-right: 3%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p v-if="!isEmptyValue(currentOrder.documentType)" class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ formatQuantityPanel({ value: getItemQuantity }) }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}:
                <b v-if="!isEmptyValue(currentOrder.uuid)" class="order-info">
                  {{ numberOfLines }}
                </b>
              </p>
            </span>
          </el-footer>
          <el-footer v-else :class="classOrderFooter" style="display: flex;width: 100% !important; padding-top: 10px;">
            <el-scrollbar class="scroll-footer-order" style="width: 100% !important;padding-right: 5%;padding-left: 5%;padding-bottom: 20%;">
              <span
                v-show="isValidForDeleteLine(listOrderLine) && isValidateDocumentType"
              >
                <el-button
                  type="info"
                  icon="el-icon-top"
                  :disabled="isDisabled"
                  @click="arrowTop"
                />
                <el-button
                  type="info"
                  icon="el-icon-bottom"
                  :disabled="isDisabled"
                  style="margin-left: 0.5%;"
                  @click="arrowBottom"
                />
              </span>
              <el-button
                v-show="isValidForDeleteLine(listOrderLine) && isValidateDocumentType && !isEmptyValue(currentLineOrder)"
                type="danger"
                icon="el-icon-delete"
                :disabled="isDisabled"
                style="margin-left: 0.5%;"
                @click="deleteOrderLine(currentOrderLine)"
              />
              <el-button
                v-show="isValidToRelease"
                type="primary"
                style="margin-left: 0.5%;"
                @click="releaseSalesOrder()"
              >
                <i class="el-icon-document-checked" />
                {{ $t('form.pos.releaseOrder') }}
              </el-button>
              <el-button
                v-show="allowsCollectOrder"
                type="success"
                icon="el-icon-bank-card"
                style="margin-left: 0.5%;"
                @click="openCollectionPanel"
              >
                {{ labelButtonCollections }}
              </el-button>
              <document-status-tag
                v-if="!isEmptyValue(currentOrder.documentStatus.value)"
                :value="currentOrder.documentStatus.value"
                :displayed-value="currentOrder.documentStatus.name"
                style="font-size: 16px;margin-left: 0.5%;margin-right: 0.5%;"
              />
              <fast-ordes-list style="font-size: 0px;width: 100px!important;margin: 0px;display: inline-block;margin-top:01px;" />
              <span>
                <p style="margin: 0px;">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              </span>
              <span>
                <div style="border: 1px solid rgb(54, 163, 247);">
                  <p style="margin-top: 1%;">
                    <b>
                      {{ $t('form.pos.order.total') }}:
                    </b>
                    <b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">
                      {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                    </b>
                  </p>
                  <p v-if="!isEmptyValue(currentPointOfSales.displayCurrency)"> <b> {{ $t('form.pos.collect.convertedAmount') }}: </b> <b v-if="!isEmptyValue(currentOrder.uuid)" style="float: right;">{{ formatPrice(currentOrder.grandTotal / totalAmountConverted, currentPointOfSales.displayCurrency.iso_code) }}</b> </p>
                </div>
              </span>
            </el-scrollbar>
          </el-footer>
        </el-container>
      </el-main>

      <el-dialog
        ref="dialog"
        :title="$t('form.pos.pinMessage.pin') + infowOverdrawnInvoice.label"
        class="order-dialog-pin"
        width="50%"
        :visible.sync="visible"
        :append-to-body="true"
      >
        <el-form autocomplete="off">
          <el-input
            id="pin"
            ref="pin"
            v-model="pin"
            v-shortkey="visible ? {close: ['esc'], enter: ['enter']} : {}"
            autofocus
            type="password"
            :placeholder="$t('form.pos.tableProduct.pin')"
            :focus="true"
            autocomplete="off"
            @shortkey.native="theAction"
          />
          <span style="float: right;">
            <el-button
              type="danger"
              icon="el-icon-close"
              @click="closePin"
            />
            <el-button
              type="primary"
              icon="el-icon-check"
              @click="openPin(pin)"
            />
          </span>
        </el-form>
      </el-dialog>
    </el-container>
    <div v-if="isMobile && isShowedPOSKeyLayout" :style="classButtomRight">
      <el-button
        v-show="!isEmptyValue(currentPointOfSales.keyLayoutUuid)"
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
    <div v-if="!isMobile && !isEmptyValue(currentPointOfSales.keyLayoutUuid)" :style="classButtomRight">
      <el-button
        id="buttonPanelRightPos"
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
    <el-drawer
      v-if="isMobile"
      :title="$t('pointOfSales.orderLine.edit')"
      :visible.sync="isEditLineMobile"
      direction="btt"
      size="100%"
      :show-close="false"
    >
      <el-button
        v-if="isMobile"
        type="danger"
        icon="el-icon-close"
        style="position: absolute;right: 1%;top: 2%;"
        @click="isEditLineMobile = !isEditLineMobile"
      />
      <edit-line-mobile
        :data-line="lineRow"
        :show-field="isEditLineMobile"
        :current-line="currentLineOrder"
      />
    </el-drawer>
  </div>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
// Constants
import fieldsListOrder from './fieldsListOrder.js'

// Components and Mixins
// import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import orderLineMixin from './orderLineMixin.js'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import BusinessPartner from '@/components/ADempiere/Form/VPOS/BusinessPartner/index.vue'
import fieldLine from '@/components/ADempiere/Form/VPOS/Order/line/index'
import EditLineMobile from '@/components/ADempiere/Form/VPOS/Order/line/editLineMobile'
import InfoOrderLine from '@/components/ADempiere/Form/VPOS/Order/line/infoOrderLine/index.vue'
// src/themes/pos/components/ADempiere/Form/VPOS/Order/ImageProduct/index.vue
import ProductInfo from '@/components/ADempiere/Form/VPOS/ProductInfo'
import FastOrdesList from '@/components/ADempiere/Form/VPOS/OrderList/fastOrder'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Utils and Helper Methods
// Format of values ( Date, Price, Quantity )
import {
  formatDate,
  formatDateToSend,
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatQuantity as formatQuantityPanel } from '@/utils/ADempiere/formatValue/numberFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

// API Request Methods
import { releaseOrder } from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'Order',

  components: {
    BusinessPartner,
    DocumentStatusTag,
    EditLineMobile,
    InfoOrderLine,
    ProductInfo,
    FastOrdesList,
    fieldLine
  },

  mixins: [
    formMixin,
    orderLineMixin,
    posMixin
  ],

  data() {
    return {
      unsubscribe: () => {},
      fieldsList: fieldsListOrder,
      seeConversion: false,
      showFieldLine: false,
      isEditLineMobile: false,
      lineRow: {},
      pin: '',
      attributePin: {},
      visible: false,
      isEditQtyOrdered: false,
      isEditLine: {},
      fileColumnNameEdit: '',
      editPrice: 0,
      listCampaign: this.$store.getters.getListCampaigns
    }
  },

  computed: {
    isValidToRelease() {
      if (!this.isEmptyValue(this.currentOrder) && this.currentOrder.documentStatus.value === 'DR') {
        return true
      }
      return false
    },
    isValidateDocumentType() {
      return this.currentOrder.documentStatus.value !== 'CO'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    currentPriceTableEdit: {
      get() {
        return this.fieldShowValue({ row: this.currentLineOrder, columnName: 'CurrentPrice' })
      },
      set(value) {
        if (value !== this.fieldShowValue({ row: this.currentLineOrder, columnName: 'CurrentPrice' })) {
          this.changeEdit(value, 'PriceEntered')
        }
        return value
      }
    },
    classOrderFooter() {
      if (this.isMobile) {
        return 'footer-mobile'
      }
      return 'footer-table'
    },
    classOrderLine() {
      if (this.isMobile) {
        return 'table-mobile'
      }
      return 'table'
    },
    classButtomRight() {
      if (this.isMobile) {
        if (this.$store.getters.getIsShowPOSOptions) {
          return 'position: fixed'
        }
        return 'position: absolute;top: 34%;z-index: 100;right: 0;'
      }
      return 'position: relative;padding-top: 30vh; z-index: 100;'
    },
    colFieldProductCode() {
      if (this.isMobile) {
        return 12
      }
      if (this.isEmptyValue(this.currentOrder)) {
        return 14
      }
      if (this.isShowedPOSKeyLayout) {
        return 10
      }
      return 12
    },
    shortsKey() {
      return {
        popoverConvet: ['ctrl', 'x']
      }
    },
    shortKeysInputTable() {
      return {
        close: ['esc'],
        enter: ['enter']
      }
    },
    isShowedPOSKeyLayout: {
      get() {
        return this.$store.getters.getShowPOSKeyLayout
      },
      set(val) {
        if (!this.isEmptyValue(this.currentPointOfSales.keyLayoutUuid)) {
          this.$store.commit('setShowPOSKeyLayout', val)
        }
      }
    },
    styleTab() {
      const isShowedPOSOptions = this.$store.getters.getIsShowPOSOptions
      if (this.isShowedPOSKeyLayout || isShowedPOSOptions) {
        return 'padding-left: 0px; padding-left: 0px; padding-right: 0px; padding: 0px; '
      }
      return 'padding-left: 0px; padding-right: 0px; '
    },
    orderDate() {
      if (this.isEmptyValue(this.currentOrder) || this.isEmptyValue(this.currentOrder.dateOrdered)) {
        return this.formatDate(new Date())
      }
      return this.formatDate(this.currentOrder.dateOrdered)
    },
    getItemQuantity() {
      if (this.isEmptyValue(this.currentOrder)) {
        return 0
      }
      const result = this.listOrderLine.map(order => {
        return order.quantityOrdered
      })

      if (!this.isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    },
    numberOfLines() {
      if (this.isEmptyValue(this.currentOrder)) {
        return 0
      }
      return this.listOrderLine.length
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    labelButtonCollections() {
      return this.isDisabled ? this.$t('form.pos.order.collections') : this.$t('form.pos.order.collect')
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Currency Point Of Sales
    pointOfSalesCurrency() {
      // const currency = this.currentPointOfSales
      if (!this.isEmptyValue(this.currentPointOfSales.currentOrder.priceList.currency.iso_code)) {
        return {
          ...this.currentOrder.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1
      }
    },
    listPointOfSales() {
      return this.$store.getters.posAttributes.pointOfSalesList
    },
    currentOrder() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return {
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
    currentLineOrder() {
      const line = this.$store.state['pointOfSales/orderLine/index'].line
      if (!this.isEmptyValue(line)) {
        return line
      }
      return {}
    },
    currentEditLine: {
      get() {
        if (this.isEmptyValue(this.currentLineOrder)) {
          return {}
        }
        if (this.editPrice > 0 && this.editPrice !== this.currentValuePriceLine(this.currentLineOrder)) {
          return this.editPrice
        }
        return this.currentValuePriceLine(this.currentLineOrder)
      },
      set(val) {
        this.editPrice = val
        return val
      }
    },
    currentPriceList() {
      if (!this.isEmptyValue(this.$store.getters.currentPriceList)) {
        return this.$store.getters.currentPriceList
      }
      return {}
    },
    currentDiscountList() {
      if (!this.isEmptyValue(this.$store.getters.currentDiscountList)) {
        return this.$store.getters.currentDiscountList
      }
      return {}
    },
    pointDiscountList() {
      const discount = this.$store.getters.posAttributes.currentPointOfSales.discountList
      if (this.isEmptyValue(discount)) {
        return []
      }
      return discount
    },
    pointPriceList() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    currentWarehouse() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.warehouse)) {
        return this.$store.getters.getCurrentWarehousePos
      }
      return {}
    },
    currentDocumentType() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.documentType)) {
        if (!this.isEmptyValue(this.currentOrder.documentType)) {
          return this.currentOrder.documentType
        }
        return this.$store.getters.getCurrentDocumentTypePos
      }
      if (this.isEmptyValue(this.$store.getters.getCurrentDocumentTypePos)) {
        return {}
      }
      return {}
    },
    listWarehouses() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.warehousesList)) {
        return this.$store.getters.posAttributes.currentPointOfSales.warehousesList
      }
      return []
    },
    listDocumentTypes() {
      const listDocumentTypes = this.$store.getters.posAttributes.currentPointOfSales.documentTypesList
      const templatePosDocumentTypes = this.$store.getters.posAttributes.currentPointOfSales.documentType
      if (!this.isEmptyValue(listDocumentTypes)) {
        const addDocumentType = listDocumentTypes.find(documentType => documentType.uuid === templatePosDocumentTypes.uuid)
        if (this.isEmptyValue(addDocumentType)) {
          listDocumentTypes.push(this.$store.getters.posAttributes.currentPointOfSales.documentType)
        }
        return listDocumentTypes
      }
      return []
    },
    showOverdrawnInvoice() {
      return this.$store.getters.getOverdrawnInvoice.visible
    },
    infowOverdrawnInvoice() {
      if (this.$store.getters.getOverdrawnInvoice.attributePin) {
        return this.$store.getters.getOverdrawnInvoice.attributePin
      }
      return ''
    },
    currentCampaign() {
      if (!this.isEmptyValue(this.currentOrder.campaign)) {
        const { campaign } = this.currentOrder
        if (this.isEmptyValue(campaign)) {
          return this.$t('form.pos.order.noCampaignSelected')
        }
        return campaign.name
      } else if (!this.isEmptyValue(this.currentPointOfSales.defaultCampaign)) {
        const { defaultCampaign } = this.currentPointOfSales
        if (this.isEmptyValue(defaultCampaign)) {
          return this.$t('form.pos.order.noCampaignSelected')
        }
        return defaultCampaign.name
      }
      return this.$t('form.pos.order.noCampaignSelected')
    }
  },

  watch: {
    showOverdrawnInvoice(value) {
      this.visible = value
    },
    numberOfLines(value) {
      if (this.isNewOrder) {
        this.$refs.ProductValue[0].$refs.product.focus()
      }
      if (value > 0) {
        this.convertedAmount()
      }
    },
    visible(value) {
      if (value && !this.isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusPin()
        }, 500)
      } else {
        this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: value })
      }
    },
    orderDate(value) {
      this.$store.state['pointOfSales/point/index'].conversionsList = []
    },
    isEditLine(value) {
      if (!this.isEmptyValue(value.uuid) && this.isEditQtyOrdered && !this.isEmptyValue(this.$refs.editField)) {
        setTimeout(() => {
          this.$refs.editField[0].focus()
          this.$refs.editField[0].select()
        }, 500)
      }
    }
  },

  beforeMount() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },

  mounted() {
    setTimeout(() => {
      if (this.isEmptyValue(this.listCampaign)) {
        this.getListCampaign()
      }
    }, 500)
    if (!this.isEmptyValue(this.$route.query.action) && this.isEmptyValue(this.currentOrder.uuid)) {
      this.$store.dispatch('reloadOrder', { orderUuid: this.$route.query.action })
    }
    // if (this.isEmptyValue(this.$route.query.action) && !this.isEmptyValue(this.currentOrder.uuid)) {
    //   this.$router.push({
    //     params: {
    //       ...this.$route.params
    //     },
    //     query: {
    //       ...this.$route.query,
    //       action: this.currentOrder.uuid
    //     }
    //   })
    // }
    if (this.isNewOrder) {
      this.$refs.ProductValue[0].$refs.product.focus()
    }
    if (!this.isEmptyValue(this.currentLineOrder)) {
      this.$refs.linesTable.setCurrentRow(this.currentLineOrder)
    }

    this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
  },
  methods: {
    formatDate,
    formatDateToSend,
    formatPrice,
    formatQuantity,
    formatQuantityPanel,
    copyToClipboard,
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'addActionPerformed') {
          switch (mutation.payload.columnName) {
            case 'C_DocTypeTarget_ID': {
              const documentTypeUuid = this.$store.getters.getValueOfField({
                containerUuid: mutation.payload.containerUuid,
                columnName: 'C_DocTypeTarget_ID_UUID'
              })
              if (this.isPosRequiredPin && !this.isEmptyValue(documentTypeUuid) && !this.isEmptyValue(this.currentOrder.documentType.uuid)) {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder',
                  requestedAccess: 'IsAllowsChangeListDocumentType'
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              } else if (!this.isEmptyValue(documentTypeUuid) && !this.isEmptyValue(this.currentOrder.documentType.uuid)) {
                this.$store.dispatch('updateOrder', {
                  orderUuid: this.currentOrder.uuid,
                  posUuid: this.currentPointOfSales.uuid,
                  priceListUuid: this.$store.getters.currentPriceList.uuid,
                  warehouseUuid: this.currentPointOfSales.warehouse.uuid,
                  documentTypeUuid
                })
              }
              break
            }
          }
        } else if (mutation.type === 'updateValueOfField') {
          switch (mutation.payload.columnName) {
            // case 'DisplayColumn_TenderType':
            //   this.displayType = mutation.payload.value
            //   break
            case 'C_BPartner_ID_UUID': {
              if (!this.isEmptyValue(this.currentPointOfSales.templateCustomer) && this.$route.meta.uuid === mutation.payload.containerUuid) {
                // Does not send values to server, when empty values are set or
                // if BPartner set equal to BPartner POS template
                const currentOrderUuid = this.currentOrder.uuid
                if (isEmptyValue(currentOrderUuid)) {
                  break
                }
                this.updateOrder(mutation.payload)
              }
              break
            }
          }
        }
      })
    },
    openEditModeMobile(line) {
      this.lineRow = line
      this.isEditLineMobile = !this.isEditLineMobile
    },
    releaseSalesOrder() {
      releaseOrder({
        posUuid: this.currentPointOfSales.uuid,
        salesRepresentativeUuid: this.$store.getters['user/getUserUuid'],
        orderUuid: this.currentOrder.uuid
      })
        .then(response => {
          this.clearOrder()
          this.$message.success(this.$t('form.pos.generalNotifications.orderReleased') + response.documentNo)
          this.$store.commit('setCurrentWarehousePos', this.currentPointOfSales.warehouse)
          this.$store.commit('setCurrentPriceList', this.currentPointOfSales.priceList)
          this.$store.commit('setCurrentDocumentTypePos', this.currentPointOfSales.documentType)
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error Hold Order ${error.message}. Code: ${error.code}.`)
        })
    },
    copyCode(value) {
      copyToClipboard({
        text: value.product.value,
        isShowMessage: true
      })
    },
    getListCampaign() {
      this.$store.dispatch('searchListCampaigns')
        .then(response => {
          this.listCampaign = response
        })
    },
    productFocus(value) {
      this.$refs.ProductValue[0].$refs.product.focus()
    },
    editCell(row, column) {
      switch (column.columnKey) {
        case 'CurrentPrice':
        case 'QtyEntered':
        case 'Discount':
          this.isEditQtyOrdered = true
          this.fileColumnNameEdit = column.columnKey
          this.isEditLine = row
          setTimeout(() => {
            this.$refs.editField[0].focus()
            this.$refs.editField[0].select()
          }, 100)
          break
      }
    },
    changeEdit(value, columnName) {
      const changeLine = { columnName, value }
      if (!this.allowsModifyQuantity && (columnName === 'QtyEntered')) {
        const attributePin = {
          containerUuid: 'line',
          columnName,
          value,
          type: 'updateOrder',
          requestedAccess: 'IsAllowsModifyQuantity',
          label: this.$t('form.pos.pinMessage.qtyEntered')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
        return
      } else if (!this.modifyPrice && columnName === 'PriceEntered') {
        const attributePin = {
          containerUuid: 'line',
          columnName,
          value,
          type: 'updateOrder',
          requestedAccess: 'IsModifyPrice',
          label: columnName === 'PriceEntered' ? this.$t('form.pos.pinMessage.price') : this.$t('form.pos.pinMessage.discount')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
        return
      }
      if (columnName !== 'Discount') {
        this.updateOrderLine(changeLine)
        return
      }
      if (
        (columnName === 'Discount') &&
        this.currentPointOfSales.isAllowsModifyDiscount &&
        (value > this.currentPointOfSales.maximumLineDiscountAllowed && this.currentPointOfSales.maximumLineDiscountAllowed === 0)
      ) {
        this.updateOrderLine(changeLine)
        return
      } else if (
        (columnName === 'Discount') &&
        this.currentPointOfSales.isAllowsModifyDiscount &&
        value <= this.currentPointOfSales.maximumLineDiscountAllowed
      ) {
        this.updateOrderLine(changeLine)
        return
      } else {
        const attributePin = {
          containerUuid: 'line',
          columnName,
          value,
          type: 'updateOrder',
          requestedAccess: 'IsAllowsModifyDiscount',
          label: this.$t('form.pos.pinMessage.discount')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
      }
    },
    theActionEdit(event) {
      switch (event.srcKey) {
        case 'enter':
          this.$refs.editField[0].select()
          this.exitEdit()
          this.productFocus()
          break
        case 'close':
          this.exitEdit()
          break
      }
    },
    exitEdit() {
      this.isEditLine = {}
      this.isEditQtyOrdered = false
    },
    keyActionClosePin(event) {
      this.visible = false
      this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
    },
    focusPin() {
      this.$refs.pin.focus()
    },
    closeConvertion() {
      this.seeConversion = false
    },
    openCollectionPanel() {
      this.$store.commit('setShowPOSCollection', true)
      const orderUuid = this.currentOrder.uuid
      this.$store.dispatch('listPayments', { posUuid: this.currentPointOfSales.uuid, orderUuid })
      this.$store.commit('setShowPOSOptions', false)
      if (!this.isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: this.currentPointOfSales.displayCurrency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
      }
    },
    open() {
      if (!this.seeConversion) {
        this.seeConversion = true
      }
    },
    getOrderTax(currency) {
      return this.formatPrice(this.currentOrder.grandTotal - this.currentOrder.totalLines, currency)
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
      this.clearOrder()
      this.$store.commit('setShowPOSCollection', false)
      this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
      this.$store.dispatch('listPayments', { posUuid: this.currentPointOfSales.uuid, orderUuid: this.currentOrder.uuid })
    },
    changePos(pointOfSales) {
      if (!this.isEmptyValue(this.currentPointOfSales.id) && this.currentPointOfSales.id !== pointOfSales.id) {
        this.$store.dispatch('setCurrentPOS', pointOfSales)
        this.$store.commit('customer', pointOfSales.templateCustomer)
        this.$store.commit('setListProductPrice', {
          productPricesList: []
        })
        this.clearOrder()
      }
    },
    changeCampaign(item) {
      const point = {
        ...this.currentPointOfSales,
        defaultCampaign: item
      }
      this.$store.dispatch('setCurrentPOS', point)
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        documentTypeUuid: this.currentOrder.documentStatus.uuid,
        priceListUuid: this.currentPointOfSales.priceList.uuid,
        warehouseUuid: this.currentPointOfSales.warehouse.uuid,
        campaignUuid: item.uuid
      })
    },
    changeWarehouse(warehouse) {
      if (warehouse.id !== this.currentWarehouse.id) {
        if (warehouse.is_pos_required_pin) {
          const attributePin = {
            ...warehouse,
            action: 'changeWarehouse',
            type: 'actionPos',
            label: this.$t('form.pos.pinMessage.warehouse'),
            requestedAccess: 'IsAllowsChangeListWarehouse'
          }
          const visible = true
          this.visible = visible
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        } else {
          this.$store.dispatch('updateOrder', {
            orderUuid: this.currentOrder.uuid,
            posUuid: this.currentPointOfSales.uuid,
            documentTypeUuid: this.currentOrder.documentStatus.uuid,
            priceListUuid: this.currentPointOfSales.priceList.uuid,
            warehouseUuid: warehouse.uuid
          })
          this.$store.commit('setCurrentWarehousePos', warehouse)
        }
      }
    },
    changeDocumentType(documentType) {
      if (documentType.id !== this.currentDocumentType.id) {
        if (!documentType.is_pos_required_pin) {
          this.$store.dispatch('updateOrder', {
            orderUuid: this.currentOrder.uuid,
            posUuid: this.currentPointOfSales.uuid,
            documentTypeUuid: documentType.uuid,
            priceListUuid: this.currentPointOfSales.priceList.uuid,
            warehouseUuid: this.currentPointOfSales.warehouse.uuid
          })
        } else {
          const attributePin = {
            ...documentType,
            action: 'changeDocumentType',
            type: 'actionPos',
            requestedAccess: 'IsAllowsChangeListDocumentType',
            label: this.$t('form.pos.pinMessage.documentType')
          }
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          this.visible = true
        }
      }
    },
    changePriceList(priceList) {
      // if (priceList.id !== this.currentPriceList.id) {
      if (priceList.is_pos_required_pin) {
        const attributePin = {
          ...priceList,
          action: 'changePriceList',
          type: 'actionPos',
          requestedAccess: 'IsAllowsChangeListPrice',
          label: this.$t('form.pos.pinMessage.priceList')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
      } else {
        if (!this.isEmptyValue(this.currentOrder.uuid)) {
          this.$store.dispatch('updateOrder', {
            orderUuid: this.currentOrder.uuid,
            posUuid: this.currentPointOfSales.uuid,
            documentTypeUuid: this.currentOrder.documentStatus.uuid,
            priceListUuid: priceList.uuid,
            warehouseUuid: this.currentPointOfSales.warehouse.uuid
          })
        }
        this.$store.commit('setCurrentPriceList', priceList)
      }
      // }
    },
    changeDiscountList(discountList) {
      console.log(discountList)
    },
    arrowTop() {
      if (this.currentTable > 0) {
        this.currentTable--
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    showEditLine(line) {
      this.$store.commit('setLine', line)
      this.showFieldLine = !this.showFieldLine
    },
    arrowBottom() {
      const top = this.listOrderLine.length - 1
      if (this.currentTable < top) {
        this.currentTable++
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    }
  }
}
</script>

<style scoped>
  .delete-buttom {
    border: none;
    width: 100%;
    text-align: left;
  }
  .el-col-24 {
    width: 100%;
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .el-col-6 {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .footer-mobile {
    padding: 0px;
    height: auto !important;
    overflow: auto;
    display: contents;
  }
  .footer-table {
    padding-top: 0px;
    padding-right: 9px;
    padding-bottom: 0px;
    padding-left: 9px;
    overflow: auto;
    height: auto !important;
  }
  .keypad {
    float: left;
    height: 20%;
    padding-top: 10px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .info-pos {
    padding-top: 10px;
    color: black;
  }
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  /* Style of Table */
  .table {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #606266;
    overflow: auto;
  }
  .table-mobile {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 12px;
    color: #606266;
    overflow: auto;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding: 0px;
  }
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
    text-align: center;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .order-header {
    padding-left: 10px;
    font-size: 13px;
  }
  .order-info {
    float: right;
    padding-left: 9px;
  }
  .transition-box {
    z-index: 1;
    width: auto;
    position: fixed;
    bottom: 5%;
    right: 5%;
  }
</style>

<style>
  .order-dialog-pin {
    z-index: 99999 !important;
  }
  .el-popper-info {
    margin-left: 12px;
    max-width: 75%;
    min-width: 60%;
  }
  .scroll-footer-order {
    max-height: 350px;
    overflow-x: hidden;
  }
</style>
