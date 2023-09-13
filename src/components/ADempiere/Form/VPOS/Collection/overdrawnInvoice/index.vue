<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <div>
    <el-dialog
      v-shortkey="showDialogo ? {close: ['esc']} : {}"
      :title="caseOrder === 2 ? $t('form.pos.collect.overdrawnInvoice.below') : $t('form.pos.collect.overdrawnInvoice.title')"
      :visible.sync="showDialogo"
      :before-close="close"
      width="85%"
      :append-to-body="true"
      @shortkey.native="actionOverdrawnInvoice"
      @close="close"
    >
      <div v-if="caseOrder === 1">
        <el-form @submit.native.prevent="notSubmitForm">
          <el-form-item>
            <el-radio v-model="option" :label="1"> {{ $t('form.pos.collect.overdrawnInvoice.returned') }} {{ formatPrice(currentOrder.refundAmount, currency.iSOCode) }} </el-radio>
            <el-radio v-model="option" :label="3"> {{ $t('form.pos.collect.overdrawnInvoice.returnMoney') }}</el-radio>
            <el-radio v-model="option" :label="4"> {{ $t('form.pos.collect.overdrawnInvoice.adjustDocument') }}</el-radio>
          </el-form-item>
        </el-form>
        <el-empty v-if="option === 1 && isEmptyValue(paymentTypeListRefund)" :description="$t('form.pos.optionsPoinSales.emptyAvailablePaymentMethods')" />
        <el-card v-else-if="option === 1" class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="isEmptyValue(currentFieldPaymentMethods)">{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <template v-else>
              <span>
                {{ currentPaymentMethods }}
              </span>
              <span style="float: right;text-align: end">
                <b>
                  {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, refundReferenceCurrency) }}
                  {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, refundReferenceCurrency) }}
                </b>
              </span>
            </template>
          </div>
          <div class="text item">
            <el-form
              label-position="top"
              label-width="10px"
              style="display: flex; line-height: 10px;"
              :disabled="isDisabled"
              @submit.native.prevent="notSubmitForm"
            >
              <el-row id="fieldListCollection">
                <el-col
                  :span="8"
                >
                  <field-definition
                    :metadata-field="{
                      ...fieldsList[0],
                      labelCurrency: currentFieldCurrencyRefund
                    }"
                    :container-uuid="'OverdrawnInvoice'"
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
                <el-col :span="8">
                  <el-form-item :label="$t('form.pos.collect.paymentMethods')" class="from-field">
                    <el-select
                      v-model="currentFieldPaymentMethods"
                      style="display: block;"
                    >
                      <el-option
                        v-for="item in paymentTypeListRefund"
                        :key="item.id"
                        :label="item.name"
                        :value="item.uuid"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('form.pos.collect.Currency')" class="from-field">
                    <el-select
                      v-model="currentFieldCurrencyRefund"
                      :disabled="!isEmptyValue(currentAvailablePaymentMethods.reference_currency)"
                      style="display: block;"
                      @change="changeCurrency"
                    >
                      <el-option
                        v-for="item in listCurrency"
                        :key="item.id"
                        :label="item.iso_code + '(' + item.currency_symbol + ')'"
                        :value="item.iso_code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="validateCurrentPayment" :span="8">
                  <el-form-item
                    :label="$t('form.pos.collect.bankAcount')"
                    class="from-field"
                  >
                    <el-select
                      v-model="currentBankAccount"
                      style="display: block;"
                      clearable
                      @change="selectedBanckAccount"
                    >
                      <el-option
                        v-for="item in bankAccountList"
                        :key="item.customer_bank_account_uuid"
                        :label="item.name"
                        :value="item.customer_bank_account_uuid"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="isdisplayLogicBank" :span="8">
                  <div class="field-definition">
                    <el-form-item label="Banco" class="field-standard">
                      <el-select
                        v-model="currentBank"
                        style="display: block;"
                        :loading="loadingBank"
                        filterable
                        clearable
                        remote
                        @visible-change="showListBank"
                      >
                        <el-option
                          v-for="item in listBanks"
                          :key="item.id"
                          :label="item.name"
                          :value="item.uuid"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col
                  v-for="(field, key) in hiddenFieldsList"
                  :key="key"
                  :span="8"
                >
                  <field-definition
                    :metadata-field="field"
                    :container-uuid="'OverdrawnInvoice'"
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
            <el-button
              style="float: right"
              type="success"
              icon="el-icon-plus"
              :disabled="validPay"
              @click="addPayRefund"
            />
            <el-button
              style="float: right;margin-left: 9px;margin-right: 5px;"
              type="info"
              class="custom-button-create-bp"
              icon="el-icon-minus"
              :disabled="isEmptyValue(listPaymentsRefund)"
              @click="undoPatment"
            />
          </div>
        </el-card>
        <type-collection
          v-if="!isEmptyValue(listRefund) && option === 1"
          id="cardCollection"
          :is-add-type-pay="listPaymentsRefund"
          :currency="pointOfSalesCurrency"
          :size="6"
        />
      </div>
      <div>
        <el-card v-if="option === 2" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
          </div>
          <div class="text item">
            <el-form
              label-position="top"
              label-width="10px"
              @submit.native.prevent="notSubmitForm"
            >
              <el-row>
                <el-col
                  v-for="(field, key) in primaryFieldsList"
                  :key="key"
                  :span="8"
                >
                  <field-definition
                    v-if="field.sequence < 3"
                    :key="field.columnName"
                    :metadata-field="field"
                    :container-uuid="'OverdrawnInvoice'"
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
          </div>
        </el-card>
        <el-empty v-if="option === 3 && isEmptyValue(paymentTypeList)" :description="$t('form.pos.optionsPoinSales.emptyAvailablePaymentMethodsRefudn')" />
        <el-card v-else-if="option === 3" class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="isEmptyValue(currentFieldPaymentMethods)">{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <template v-else>
              <span>
                {{ currentPaymentMethods }}
              </span>
              <span style="float: right;text-align: end">
                <b>
                  {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, refundReferenceCurrency) }}
                  {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, refundReferenceCurrency) }}
                </b>
              </span>
            </template>
          </div>
          <div class="text item">
            <el-form
              label-position="top"
              label-width="10px"
              style="display: flex; line-height: 10px;"
              :disabled="isDisabled"
              @submit.native.prevent="notSubmitForm"
            >
              <el-row id="fieldListCollection">
                <el-col
                  :span="8"
                >
                  <field-definition
                    :metadata-field="{
                      ...fieldsList[0],
                      labelCurrency: currentFieldCurrency
                    }"
                    :container-uuid="'OverdrawnInvoice'"
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
                <el-col :span="8">
                  <el-form-item :label="$t('form.pos.collect.paymentMethods')" class="from-field">
                    <el-select
                      v-model="currentFieldPaymentMethods"
                      style="display: block;"
                    >
                      <el-option
                        v-for="item in paymentTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.uuid"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('form.pos.collect.Currency')" class="from-field">
                    <el-select
                      v-model="currentFieldCurrency"
                      :disabled="!isEmptyValue(currentAvailablePaymentMethods.refund_reference_currency)"
                      style="display: block;"
                      @change="changeCurrency"
                    >
                      <el-option
                        v-for="item in listCurrency"
                        :key="item.id"
                        :label="item.iso_code + '(' + item.currency_symbol + ')'"
                        :value="item.iso_code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Cuenta Bancaria" class="from-field">
                    <el-select
                      v-model="currentBankAccount"
                      style="display: block;"
                      clearable
                      @change="selectedBanckAccount"
                    >
                      <el-option
                        v-for="item in bankAccountList"
                        :key="item.customer_bank_account_uuid"
                        :label="item.name"
                        :value="item.customer_bank_account_uuid"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="isdisplayLogicBank" :span="8">
                  <div class="field-definition">
                    <el-form-item label="Banco" class="field-standard">
                      <el-select
                        v-model="currentBank"
                        style="display: block;"
                        :loading="loadingBank"
                        filterable
                        clearable
                        remote
                        @visible-change="showListBank"
                      >
                        <el-option
                          v-for="item in listBanks"
                          :key="item.id"
                          :label="item.name"
                          :value="item.uuid"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col
                  v-for="(field, key) in hiddenFieldsList"
                  :key="key"
                  :span="8"
                >
                  <field-definition
                    :metadata-field="field"
                    :container-uuid="'OverdrawnInvoice'"
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
            <el-button
              style="float: right"
              type="success"
              icon="el-icon-plus"
              :disabled="validPay && (currentOrder.refundAmount === 0)"
              @click="validateSubsequentPayment()"
            />
            <el-button
              style="float: right;margin-left: 9px;margin-right: 5px;"
              type="info"
              class="custom-button-create-bp"
              icon="el-icon-minus"
              :disabled="isEmptyValue(listPaymentsRefund)"
              @click="undoPatment"
            />
          </div>
          <type-collection
            v-if="!isEmptyValue(listRefund)"
            id="cardCollection"
            :currency="pointOfSalesCurrency"
            :size="6"
          />
        </el-card>
      </div>
      <div v-if="caseOrder === 2">
        <el-card>
          <div slot="header" class="clearfix">
            <b>
              <el-radio
                v-model="option"
                :label="4"
              >
                {{ $t('form.pos.collect.overdrawnInvoice.adjustDocument') }}
              </el-radio>
            </b>
            <span style="float: right;text-align: end">
              <b>
                {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(currentPointOfSales.writeOffAmountTolerance, currentPointOfSales.priceList.currency.iSOCode) }}
              </b>
            </span>
          </div>
          <el-form label-width="120px">
            <el-form-item>
              <p>
                <b> {{ $t('form.pos.collect.orderTotal') }} </b> {{ formatPrice(totalOrder, currency.iSOCode) }}
                <el-divider direction="vertical" />
                <b> {{ $t('form.pos.collect.totalInvoiced') }} </b> {{ formatPrice(currentPointOfSales.currentOrder.paymentAmount, currency.iSOCode) }}
                <el-divider direction="vertical" />
                <b> {{ $t('form.pos.collect.pending') }} </b> {{ formatPrice(currentPointOfSales.currentOrder.openAmount, currency.iSOCode) }}
              </p>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <el-dialog ref="dialog" :title="$t('form.pos.pinMessage.pin') + $t('form.pos.collect.overdrawnInvoice.amountLimitOrder')" width="40%" :visible.sync="visiblePin" :append-to-body="true">
        <el-input
          id="pin"
          ref="pinPostPayment"
          v-model="pinPostPayment"
          v-shortkey="visiblePin ? {close: ['esc'], enter: ['enter']} : {}"
          autofocus
          type="password"
          :placeholder="$t('form.pos.tableProduct.pin')"
          :focus="true"
          @shortkey.native="theActionPin"
        />
        <span style="float: right;">
          <el-button
            type="danger"
            icon="el-icon-close"
            @click="closePinPayment()"
          />
          <el-button
            type="primary"
            icon="el-icon-check"
            @click="openPinPayment(pin)"
          />
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="close"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          :disabled="validateOverdrawnInvoice"
          @click="addRefund"
        />
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="showOpenSummary"
      :append-to-body="true"
      :title="summaryProcessOrder.labelModal"
    >
      <el-result
        :icon="summaryProcessOrder.type"
        :title="summaryProcessOrder.title"
      />
      <div style="border: 1px solid rgb(54, 163, 247);padding-left: 10px;padding-right: 10px;">
        <p class="total">
          <b>
            {{ $t('form.pos.collect.orderTotal') }} {{ '(' + currentOrder.documentNo + ')' }}:
          </b>
          <b style="float: right;">
            {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
          </b>
        </p>

        <p v-if="!isEmptyValue(currentPointOfSales.displayCurrency)" class="total">
          <b>{{ $t('form.pos.collect.convertedAmount') }}: </b>
          <b v-if="totalAmountConverted !== 1" style="float: right;">
            {{ formatPrice(currentOrder.grandTotal / totalAmountConverted, currentPointOfSales.displayCurrency.iso_code) }}
          </b>
          <b v-else style="float: right;">
            {{ formatPrice(0.00, currentPointOfSales.displayCurrency.iso_code) }}
          </b>
        </p>
      </div>
      <type-collection
        :is-add-type-pay="$store.getters.getListRefund.filter(payment => !payment.isRefund)"
        :currency="pointOfSalesCurrency"
        :is-read-only-payemnt="true"
        :size="12"
      />
      <span style="float: right;margin-top: 10px;">
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="showOpenSummary = !showOpenSummary"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          :loading="isProcessLoading"
          :disabled="isProcessLoading"
          @click="afterProcess()"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatPrice, formatDateToSend } from '@/utils/ADempiere/valueFormat.js'
import formMixin from '@/components/ADempiere/Form/formMixin'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import fieldsListOverdrawnInvoice from './fieldsListOverdrawnInvoice.js'
import typeCollection from '@/components/ADempiere/Form/VPOS/Collection/typeCollection'
import { processOrder } from '@/api/ADempiere/form/point-of-sales.js'
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'
import {
  getLookupList,
  isDisplayedDefault,
  isDisplayedField,
  isMandatoryField,
  generalInfoSearch,
  searchTableHeader,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@/components/ADempiere/Form/VPOS/containerManagerPos.js'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

export default {
  name: 'OverdrawnInvoice',
  components: {
    // typeRefund,
    typeCollection
  },
  mixins: [
    formMixin,
    posMixin
  ],
  props: {
    change: {
      type: Number,
      default: 0
    },
    pay: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    totalOrder: {
      type: Number,
      default: 0
    },
    currency: {
      type: Object,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'OverdrawnInvoice',
          containerUuid: 'OverdrawnInvoice'
        }
      }
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
      option: 1,
      optionTypePay: 0,
      selectionTypeRefund: {},
      fieldsList: fieldsListOverdrawnInvoice,
      currentFieldCurrency: '',
      currentFieldCurrencyRefund: '',
      currentFieldPaymentMethods: '',
      currentPaymentType: '',
      visiblePin: false,
      pinPostPayment: '',
      emptyConversion: [],
      refundOptionVAlidate: {},
      currentBankAccount: '',
      showOpenSummary: false,
      summaryProcessOrder: {},
      currentBank: '',
      listBanks: this.$store.getters.getListBanks,
      loadingBank: false
    }
  },
  computed: {
    isdisplayLogicBank() {
      let listPaymentMethods
      if (this.option === 1) {
        listPaymentMethods = this.paymentTypeListRefund
      } else if (this.option === 3) {
        listPaymentMethods = this.paymentTypeList
      }

      const isPayment = listPaymentMethods.find(list => list.uuid === this.currentFieldPaymentMethods)
      if (this.isEmptyValue(isPayment)) return false
      return ['D', 'K', 'T', 'A', 'P', 'C'].includes(isPayment.payment_method.tender_type)
      // return false
    },
    validateCurrentPayment() {
      const isPayment = this.paymentTypeListRefund.find(list => list.uuid === this.currentFieldPaymentMethods)
      if (this.isEmptyValue(isPayment)) return false
      return ['D', 'K', 'T', 'A', 'P', 'C'].includes(isPayment.payment_method.tender_type)
    },
    IsAllowsPreviewDocument() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsPreviewDocument
    },
    validateOverdrawnInvoice() {
      if (this.option === 1) {
        return this.isEmptyValue(this.listRefund)
      } else if (this.option === 3) {
        return this.isEmptyValue(this.listRefund)
      }
      return false
    },
    listRefund() {
      const list = this.listRefundsReference.concat(this.listPaymentsRefund)
      return list
    },
    listRefundsReference() {
      return this.$store.getters.getListRefundReference
    },
    listPaymentsRefund() {
      const listServer = this.$store.getters.getListRefund
      if (!this.isEmptyValue(listServer)) {
        return listServer.filter(payment => payment.isRefund)
      }
      return []
    },
    listAllPayments() {
      return this.$store.getters.getListRefund
    },
    hiddenFieldsList() {
      return this.fieldsList.filter(field => {
        if (field.sequence > 1 && field.displayLogicPayment.includes(this.currentAvailablePaymentMethods.payment_method.tender_type)) {
          return field
        }
      })
    },
    currentAvailablePaymentMethods() {
      const payment = this.searchPaymentMethods.find(payment => {
        if (payment.uuid === this.currentFieldPaymentMethods) {
          return payment
        }
      })
      if (!this.isEmptyValue(payment)) {
        return payment
      }
      const defaultPayment = this.searchPaymentMethods.find(payment => {
        if (payment.payment_method.tender_type === 'X') {
          return payment
        }
      })
      if (!this.isEmptyValue(defaultPayment)) {
        return defaultPayment
      }
      return {
        name: ''
      }
    },
    currentPaymentMethods() {
      if (!this.isEmptyValue(this.currentFieldPaymentMethods)) {
        const payment = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
        if (!this.isEmptyValue(payment)) {
          return payment.name
        }
      }
      return ''
    },
    componentRender() {
      let typePay
      switch (this.selectionTypeRefund.tender_type) {
        case 'P':
          typePay = () => import('./paymentTypeChange/MobilePayment/index')
          break
        case 'X':
          typePay = () => import('./paymentTypeChange/Cash/index.vue')
          break
        case 'A':
        case 'D':
          typePay = () => import('./paymentTypeChange/ACH/index')
          break
        case 'M':
          typePay = () => import('./paymentTypeChange/GiftCards/index.vue')
          break
        case 'Z':
          typePay = () => import('./paymentTypeChange/Zelle/index.vue')
          break
      }
      return typePay
    },
    renderComponentContainer() {
      let container
      switch (this.selectionTypeRefund.tender_type) {
        case 'P':
          container = 'MobilePayment'
          break
        case 'A':
        case 'D':
          container = 'ACH'
          break
        case 'X':
          container = 'Cash'
          break
        case 'M':
          container = 'GiftCards'
          break
        case 'Z':
          container = 'Zelle'
          break
      }
      return container
    },
    showDialogo() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.show
    },
    caseOrder() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.type
    },
    maximumRefundAllowed() {
      if (!this.isEmptyValue(this.currentFieldPaymentMethods)) {
        const currency = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
        if (!this.isEmptyValue(currency)) {
          return currency.maximum_refund_allowed
        }
      }
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.maximum_refund_allowed) && this.selectionTypeRefund.maximum_refund_allowed > 0) {
        return this.selectionTypeRefund.maximum_refund_allowed
      }
      return this.$store.getters.posAttributes.currentPointOfSales.maximumRefundAllowed
    },
    searchPaymentMethods() {
      if (this.option === 3) {
        return this.paymentTypeList
      }
      return this.paymentTypeListRefund
    },
    maximumDailyRefundAllowed() {
      if (!this.isEmptyValue(this.currentFieldPaymentMethods)) {
        const currency = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
        if (!this.isEmptyValue(currency)) {
          return currency.maximum_daily_refund_allowed
        }
      }
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.maximum_daily_refund_allowed) && this.selectionTypeRefund.maximum_daily_refund_allowed > 0) {
        return this.selectionTypeRefund.maximum_daily_refund_allowed
      }
      return this.$store.getters.posAttributes.currentPointOfSales.maximumDailyRefundAllowed
    },
    refundReferenceCurrency() {
      if (!this.isEmptyValue(this.currentFieldPaymentMethods)) {
        const currency = this.searchPaymentMethods.find(payment => payment.payment_method.uuid === this.currentFieldPaymentMethods)
        if (!this.isEmptyValue(currency)) {
          return currency.reference_currency.iso_code
        }
      }
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return this.selectionTypeRefund.refund_reference_currency.iso_code
      }

      if (this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency)) {
        return ''
      }
      return this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency.iso_code
    },
    defaultReferenceCurrency() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return this.selectionTypeRefund.refund_reference_currency
      }
      if (this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency)) {
        return {}
      }
      return this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency
    },
    isoCode() {
      return this.$store.getters.posAttributes.currentPointOfSales.displayCurrency.iso_code
    },
    displayeCurrency() {
      const tenderType = this.$store.getters.getValueOfField({
        containerUuid: 'OverdrawnInvoice',
        columnName: 'TenderType'
      })
      if (tenderType === 'D') {
        return true
      }
      return false
    },
    primaryFieldsList() {
      return this.fieldsList.filter(field => field.sequence <= 2)
    },
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    emptyFieldGiftCard() {
      const empty = this.fieldsList.filter(field => {
        if (field.sequence < 3 && this.isEmptyValue(
          this.$store.getters.getValueOfField({
            containerUuid: 'OverdrawnInvoice',
            columnName: field.columnName
          })
        )) {
          return field
        }
      })
      return empty.map(empty => empty.name)
    },
    emptyMandatoryFields() {
      return this.$store.getters.getFieldsListEmptyMandatory({ containerUuid: 'OverdrawnInvoice', formatReturn: 'name' })
    },
    paymentTypeList() {
      return this.$store.getters.getPaymentTypeList.filter(type => type.is_allowed_to_refund_open)
    },
    paymentTypeListRefund() {
      return this.$store.getters.getPaymentTypeList.filter(type => type.is_allowed_to_refund)
    },
    searchRefundCurrency() {
      if (this.isEmptyValue(this.selectionTypeRefund) || this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return {}
      }
      const currency = this.convertionsList.filter(type => {
        if (!this.isEmptyValue(type.currencyTo) && type.currencyTo.id === this.selectionTypeRefund.refund_reference_currency.id || this.selectionTypeRefund.refund_reference_currency.id === this.currentPointOfSales.priceList.currency.id) {
          return type
        }
      })
      if (!this.isEmptyValue(currency)) {
        return currency
      }
      return {}
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    refundLoaded() {
      return this.$store.getters.getRefundLoaded
    },
    dayRate() {
      const selectCurrency = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      const currency = this.listCurrency.find(currency => {
        if (!this.isEmptyValue(selectCurrency) && currency.iso_code === selectCurrency.reference_currency.iso_code) {
          return currency
        }
      })
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
          return convert
        }
      })
      if (!this.isEmptyValue(convert)) {
        return convert
      }
      return {
        currencyTo: this.currentPointOfSales.currentPriceList.currency,
        divideRate: 1,
        iSOCode: this.currentPointOfSales.currentPriceList.currency.iSOCode
      }
    },
    validPay() {
      const containerUuid = this.metadata.containerUuid
      // filter by visible fields
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const fieldLogic = this.hiddenFieldsList.filter(field => field.isDisplayedFromLogic === true)
      if (amount <= 0) {
        return true
      }
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: fieldLogic,
        isValidate: true
      })
      const paymentMethods = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (!this.isEmptyValue(paymentMethods) && paymentMethods.payment_method.tender_type === 'X') {
        return false
      }
      if (this.isEmptyValue(fieldsEmpty)) {
        return false
      }
      return true
    },
    bankAccountList() {
      return this.$store.getters.getListCustomerBankAccount
    },
    refundAmount() {
      return this.currentPointOfSales.currentOrder.refundAmount
    },
    currentBusinessPartner() {
      return this.currentOrder.businessPartner.uuid
    }
  },
  watch: {
    caseOrder(value) {
      if (value === 2) {
        this.option = 4
      }
    },
    searchRefundCurrency(value) {
      const clear = false
      this.clearAccountData(clear)
      this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
      const validateExistingConversion = this.emptyConversion.find(value => value.currency === this.selectionTypeRefund.refund_reference_currency)
      if (this.isEmptyValue(value) && !this.isEmptyValue(this.selectionTypeRefund) && this.showDialogo && !this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        if (!this.isEmptyValue(validateExistingConversion)) {
          this.findRefundCurrencyConversion(this.selectionTypeRefund.refund_reference_currency)
        }
      }
    },
    currentBusinessPartner(customerUuid) {
      this.$store.dispatch('listCustomerBankAccounts', { customerUuid: this.currentOrder.businessPartner.uuid })
    },
    option(value) {
      const clear = false
      this.clearAccountData(clear)
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'DateTrx',
        value: new Date()
      })
      this.loadBankAccount()
      this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
      this.selectionTypeRefund = {}
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'Name',
        value: this.currentPointOfSales.currentOrder.businessPartner.name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'Value',
        value: this.currentPointOfSales.currentOrder.businessPartner.value
      })
      if (value === 1 && !this.isEmptyValue(this.paymentTypeListRefund)) {
        this.selectPayment(this.paymentTypeListRefund[0])
      }
      if (value === 3 && !this.isEmptyValue(this.paymentTypeList)) {
        this.selectPayment(this.paymentTypeList[0])
      }
      if (value === 3) {
        this.currentFieldCurrency = this.currentAvailablePaymentMethods.refund_reference_currency.iso_code
        this.$store.dispatch('listCustomerBankAccounts', { customerUuid: this.currentOrder.businessPartner.uuid })
      }
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'PayAmt',
        value: this.refundAmount / this.dayRate.divideRate
      })
    },
    showDialogo(value) {
      if (value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'OverdrawnInvoice',
          columnName: 'PayAmt',
          value: this.refundAmount / this.dayRate.divideRate
        })
        if (this.option === 1 && !this.isEmptyValue(this.paymentTypeListRefund)) {
          this.selectPayment(this.paymentTypeListRefund[0])
        }
      }
    },
    currentFieldPaymentMethods(value) {
      const paymentCurrency = this.searchPaymentMethods.find(payment => payment.uuid === value)
      if (this.option === 1) {
        this.currentFieldCurrencyRefund = this.isEmptyValue(paymentCurrency.reference_currency.iso_code) ? '' : paymentCurrency.reference_currency.iso_code
      }
      if (this.option === 3) {
        this.currentFieldCurrency = this.isEmptyValue(paymentCurrency.refund_reference_currency.iso_code) ? '' : paymentCurrency.refund_reference_currency.iso_code
      }
      this.$store.commit('updateValueOfField', {
        containerUuid: this.metadata.containerUuid,
        columnName: 'PayAmt',
        value: this.currentPointOfSales.currentOrder.refundAmount / this.dayRate.divideRate
      })
    },
    refundAmount(value) {
      const containerUuid = 'OverdrawnInvoice'
      this.$store.commit('updateValueOfField', {
        containerUuid,
        columnName: 'PayAmt',
        value: value / this.dayRate.divideRate
      })
    },
    refundReferenceCurrency(value) {
      this.currentFieldCurrencyRefund = value
    },
    currentBankAccount(value) {
      if (this.isEmptyValue(value)) {
        const clear = false
        this.clearAccountData(clear)
      }
    }
  },
  mounted() {
    const containerUuid = 'OverdrawnInvoice'
    this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
    this.selectionTypeRefund = this.paymentTypeListRefund[0]
    this.$store.commit('updateValueOfField', {
      containerUuid,
      columnName: 'PayAmt',
      value: this.currentPointOfSales.currentOrder.refundAmount
    })
    if (!this.isEmptyValue(this.currentPointOfSales.currentOrder.businessPartner)) {
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'Name',
        value: this.currentPointOfSales.currentOrder.businessPartner.name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'Value',
        value: this.currentPointOfSales.currentOrder.businessPartner.value
      })
    }
    this.$store.commit('updateValueOfField', {
      containerUuid: 'OverdrawnInvoice',
      columnName: 'DateTrx',
      value: new Date()
    })
    this.loadBankAccount()
  },
  methods: {
    formatPrice,
    formatDateToSend,
    getLookupList,
    isDisplayedDefault,
    generalInfoSearch,
    searchTableHeader,
    isDisplayedField,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    sumRefund(cash) {
      let sum = 0
      if (!this.isEmptyValue(cash)) {
        cash.forEach((pay) => {
          sum += pay.amount
        })
      }
      return sum
    },
    showDayRateAmount(rate) {
      const currency = this.listCurrency.find(currency => !this.isEmptyValue(rate) && currency.uuid === rate)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
          return convert
        }
      })
      if (!this.isEmptyValue(convert)) {
        return convert
      }
      return {
        currencyTo: this.currentPointOfSales.currentPriceList.currency,
        divideRate: 1,
        iSOCode: this.currentPointOfSales.currentPriceList.currency.iSOCode
      }
    },
    addPostPayment(customerBankAccountUuid) {
      // addPostPayment
      const values = this.$store.getters.getValuesView({
        containerUuid: 'OverdrawnInvoice',
        format: 'object'
      })
      const nameAccount = this.$store.getters.getValueOfField({
        containerUuid: 'OverdrawnInvoice',
        columnName: 'Name'
      })
      const value = this.$store.getters.getValueOfField({
        containerUuid: 'OverdrawnInvoice',
        columnName: 'Value'
      })
      const payment = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      const refund = this.convertValuesToSend(values)
      let account = this.isEmptyValue(refund.AccountNo) ? refund.phone : refund.AccountNo
      if (this.isEmptyValue(refund.AccountNo) && payment.tender_type === 'Z') {
        account = refund.email
      } else if (this.isEmptyValue(refund.AccountNo) && payment.tender_type === 'P') {
        account = refund.phone
      }
      let refundCurrencyUuid
      const paymentCurrency = this.paymentTypeList.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (this.isEmptyValue(paymentCurrency.refund_reference_currency)) {
        refundCurrencyUuid = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      } else {
        refundCurrencyUuid = paymentCurrency.refund_reference_currency
      }

      let referencebank = {
        routingNo: ''
      }

      if (this.listBanks) {
        referencebank = this.listBanks.find(a => a.uuid === this.currentBank)
      }

      const label = this.isEmptyValue(nameAccount) ? this.currentOrder.businessPartner.name : nameAccount
      const displayName = label + ' _ ' + values.Phone + ' _ ' + value + ' _ ' + referencebank.routingNo

      const currencyUuid = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrencyRefund)
      if (this.isEmptyValue(this.currentBankAccount)) {
        this.$store.dispatch('customerBankAccount', {
          ...refund,
          customerUuid: refund.customerUuid,
          posUuid: refund.posUuid,
          email: refund.email,
          driverLicense: value,
          socialSecurityNumber: value,
          name: displayName,
          bankAccountType: refund.bankAccountType,
          bankUuid: this.currentBank,
          paymentMethodUuid: payment.uuid,
          isAch: true,
          AccountNo: account
        })
          .then(response => {
            this.$store.dispatch('refundReference', {
              ...refund,
              sourceAmount: (this.currentPointOfSales.currentOrder.priceList.currency.uuid !== refundCurrencyUuid) ? (refund.amount) : refund.amount,
              isReceipt: false,
              customerBankAccountUuid: response.customerBankAccountUuid,
              currencyUuid: this.isEmptyValue(paymentCurrency.refund_reference_currency) ? currencyUuid.uuid : paymentCurrency.refund_reference_currency.uuid,
              tenderTypeCode: payment.payment_method.tender_type,
              customerUuid: refund.customerUuid,
              posUuid: refund.posUuid,
              email: refund.email,
              driverLicense: value,
              socialSecurityNumber: value,
              name: nameAccount,
              bankAccountType: refund.bankAccountType,
              bankUuid: this.currentBank,
              paymentMethodUuid: payment.payment_method.uuid,
              isAch: true,
              AccountNo: account
            })
          })
        this.clearAccountData()
        return
      }
      this.$store.dispatch('refundReference', {
        ...refund,
        sourceAmount: (this.currentPointOfSales.currentOrder.priceList.currency.uuid !== refundCurrencyUuid) ? (refund.amount) : refund.amount,
        isReceipt: false,
        customerBankAccountUuid: this.currentBankAccount,
        currencyUuid: this.isEmptyValue(paymentCurrency.refund_reference_currency) ? currencyUuid.uuid : paymentCurrency.refund_reference_currency.uuid,
        tenderTypeCode: payment.payment_method.tender_type,
        customerUuid: refund.customerUuid,
        posUuid: refund.posUuid,
        email: refund.email,
        driverLicense: value,
        socialSecurityNumber: value,
        name: nameAccount,
        bankAccountType: refund.bankAccountType,
        bankUuid: this.currentBank,
        paymentMethodUuid: payment.payment_method.uuid,
        isAch: true,
        AccountNo: account
      })
      this.clearAccountData()
      return
    },
    showListBank(isShow, searchValue) {
      if (!isShow) return
      this.$store.dispatch('listBanks', {
        searchValue
      })
        .then(responseListBanks => {
          this.listBanks = responseListBanks
          this.loadingBank = false
        })
    },
    remoteMethodBank(query) {
      if (query !== '') {
        this.loadingBank = true
        this.showListBank(true, query)
      } else {
        this.listBanks = []
      }
    },
    validateSubsequentPayment() {
      const values = this.$store.getters.getValuesView({
        containerUuid: 'OverdrawnInvoice',
        format: 'object'
      })
      const payment = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      const refund = this.convertValuesToSend(values)
      const fieldLogic = this.hiddenFieldsList.filter(field => field.isDisplayedFromLogic === true)
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({ containerUuid: 'OverdrawnInvoice', fieldsList: fieldLogic, isValidate: true, formatReturn: 'name' })
      if (!this.isEmptyValue(this.fieldLogic) && !this.isEmptyValue(emptyMandatoryFields) || this.isEmptyValue(this.refundReferenceCurrency)) {
        this.isEmptyValue(this.$store.getters.getCurrencyRedund.uuid) ? emptyMandatoryFields.push(this.$t('form.pos.collect.Currency')) : emptyMandatoryFields
        this.$message({
          type: 'warning',
          message: this.$t('notifications.mandatoryFieldMissing') + emptyMandatoryFields,
          duration: 1500,
          showClose: true
        })
        return
      }
      const filterPayment = this.listRefund.filter(list => {
        if (list.paymentMethodUuid === payment.uuid || list.payment_method_uuid === payment.uuid) {
          return list
        }
      })
      const allPayMaximunRefund = this.sumRefund(filterPayment)
      if (refund.amount > this.maximumRefundAllowed || (this.maximumRefundAllowed - allPayMaximunRefund) < refund.amount) {
        this.visiblePin = true
        setTimeout(() => {
          this.$refs.pinPostPayment.focus()
        }, 500)
        return
      }
      this.addPostPayment()
    },
    theActionPin(event) {
      if (this.visiblePin) {
        switch (event.srcKey) {
          case 'enter':
            this.openPinPayment(this.pinPostPayment)
            break
          case 'close':
            this.closePinPayment()
            break
        }
      }
    },
    openPinPayment(pin) {
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin: this.pinPostPayment,
        orderId: this.currentOrder.id
      })
        .then(response => {
          this.pinPostPayment = ''
          this.visiblePin = false
          this.$message({
            type: 'success',
            message: this.$t('pointOfSales.pin.validateSuccessfully'),
            showClose: true
          })
          if (!this.isEmptyValue(this.refundOptionVAlidate)) {
            this.$store.dispatch('sendCreateCustomerAccount', this.refundOptionVAlidate)
          } else {
            this.addPostPayment()
          }
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pinPostPayment = ''
        })
        .finally(() => {
          this.visiblePin = false
          this.pinPostPayment = ''
          this.refundOptionVAlidate = {}
        })
    },
    closePinPayment() {
      this.visiblePin = false
      this.refundOptionVAlidate = {}
      this.pinPostPayment = ''
    },
    selectedBanckAccount(value) {
      const account = this.bankAccountList.find(banck => banck.customer_bank_account_uuid === value)
      let select = {
        uuid: ''
      }
      if (!this.isEmptyValue(this.$store.getters.getListBanks)) {
        select = this.$store.getters.getListBanks.find(list => list.uuid === account.bank_uuid)
      } else {
        this.showListBank(true)
      }
      this.currentBank = select.uuid
      this.$store.dispatch('listRefunds', {
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid
      })
      account.bank = this.isEmptyValue(this.$store.getters.getListBanks) || this.isEmptyValue(account.bank_uuid) ? { uuid: '', id: 0, labe: '' } : this.$store.getters.getListBanks.find(bank => bank.uuid === account.bank_uuid)
      this.uploadAccountData(account)
    },
    convertValuesToSend(values) {
      const valuesToSend = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (this.isEmptyValue(value)) {
          return
        }
        switch (key) {
          case 'Value':
            valuesToSend['value'] = value
            break
          case 'Name':
            valuesToSend['name'] = value
            break
          case 'BankAccountType':
            valuesToSend['bankAccountType'] = value
            break
          case 'BankAccountType_UUID':
            valuesToSend['bankAccountTypeUuid'] = value
            break
          case 'DisplayColumn_BankAccountType':
            valuesToSend['displayColumnBankAccountType'] = value
            break
          case 'EMail':
            valuesToSend['email'] = value
            break
          case 'Phone':
            valuesToSend['phone'] = value
            break
          case 'C_Bank_ID':
            valuesToSend['bankID'] = value
            break
          case 'C_Bank_ID_UUID':
            valuesToSend['bankUuid'] = this.currentBank
            break
          case 'DisplayColumn_C_Bank_ID':
            valuesToSend['bank'] = value
            break
          case 'AccountNo':
            valuesToSend['AccountNo'] = value
            break
          case 'DateTrx':
            valuesToSend['paymentAccountDate'] = value
            break
          case 'PayAmt':
            valuesToSend['amount'] = value
            break
        }
      })

      valuesToSend['posUuid'] = this.currentPointOfSales.uuid
      valuesToSend['customerUuid'] = this.currentOrder.businessPartner.uuid
      valuesToSend['orderUuid'] = this.currentOrder.uuid
      valuesToSend['name'] = this.currentOrder.businessPartner.name
      valuesToSend['paymentMethodUuid'] = this.currentAvailablePaymentMethods.uuid
      valuesToSend['salesRepresentativeUuid'] = this.currentOrder.salesRepresentative.uuid
      return valuesToSend
    },
    uploadAccountData(value) {
      const containerUuid = 'OverdrawnInvoice'
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [
          {
            columnName: 'Name',
            value: value.name
          },
          {
            columnName: 'Value',
            value: this.isEmptyValue(value.driver_license) ? value.social_security_number : value.driver_license
          },
          {
            columnName: 'AccountNo',
            value: value.account_no
          },
          {
            columnName: 'Phone',
            value: value.account_no
          },
          {
            columnName: 'C_Bank_ID',
            value: value.bank.value
          },
          {
            columnName: 'C_Bank_ID_UUID',
            value: value.bank.uuid
          },
          {
            columnName: 'DisplayColumn_C_Bank_ID',
            value: value.bank.label
          },
          {
            columnName: 'BankAccountType',
            value: value.bank_account_type
          },
          {
            columnName: 'EMail',
            value: this.isEmptyValue(value.email) ? value.name : value.email
          }
        ]
      })
    },
    clearAccountData(clear = true) {
      const containerUuid = 'OverdrawnInvoice'
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [
          {
            columnName: 'AccountNo',
            value: undefined
          },
          {
            columnName: 'C_Bank_ID_UUID',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_C_Bank_ID',
            value: undefined
          },
          {
            columnName: 'BankAccountType',
            value: undefined
          },
          {
            columnName: 'C_Bank_ID',
            value: undefined
          },
          {
            columnName: 'Phone',
            value: undefined
          },
          {
            columnName: 'EMail',
            value: undefined
          }
        ]
      })
      if (clear) {
        this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
      }
    },
    undoPatment() {
      const list = this.listPaymentsRefund[this.listPaymentsRefund.length - 1]
      const orderUuid = list.orderUuid
      const paymentUuid = list.uuid
      this.$store.dispatch('deletetPayments', {
        posUuid: this.currentPointOfSales.uuid,
        orderUuid,
        paymentUuid
      })
      this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
    },
    empty(value, params) {
      if (this.isEmptyValue(value[params])) {
        return ''
      }
      return value
    },
    addPayRefund() {
      let newCustomerBankAccountUuid
      const values = this.$store.getters.getValuesView({
        containerUuid: 'OverdrawnInvoice',
        format: 'object'
      })
      let refundCurrencyUuid
      const refund = this.convertValuesToSend(values)
      if (
        this.validateCurrentPayment &&
        this.isEmptyValue(this.currentBankAccount)
      ) {
        let referencebank = {
          routingNo: ''
        }

        if (this.listBanks) {
          referencebank = this.listBanks.find(a => a.uuid === this.currentBank)
        }

        const label = this.isEmptyValue(nameAccount) ? this.currentOrder.businessPartner.name : nameAccount
        const displayName = label + ' _ ' + values.Phone + ' _ ' + value + ' _ ' + referencebank.routingNo
        const nameAccount = this.$store.getters.getValueOfField({
          containerUuid: 'OverdrawnInvoice',
          columnName: 'Name'
        })
        const value = this.$store.getters.getValueOfField({
          containerUuid: 'OverdrawnInvoice',
          columnName: 'Value'
        })
        const payment = this.searchPaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
        const paymentCurrency = this.paymentTypeList.find(payment => payment.uuid === this.currentFieldPaymentMethods)
        if (!this.isEmptyValue(paymentCurrency) && !this.isEmptyValue(paymentCurrency.refund_reference_currency)) {
          refundCurrencyUuid = paymentCurrency.refund_reference_currency
        } else {
          refundCurrencyUuid = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
        }
        const currencyUuid = this.listCurrency.find(currency => (currency.iso_code === payment.reference_currency.iso_code) || (currency.iso_code === payment.refund_reference_currency.iso_code))

        this.$store.dispatch('customerBankAccount', {
          ...refund,
          customerUuid: refund.customerUuid,
          posUuid: refund.posUuid,
          email: refund.email,
          driverLicense: value,
          socialSecurityNumber: value,
          name: displayName,
          bankAccountType: refund.bankAccountType,
          bankUuid: refund.bankUuid,
          paymentMethodUuid: payment.uuid,
          isAch: true,
          AccountNo: refund.phone
        })
          .then(response => {
            newCustomerBankAccountUuid = response.customerBankAccountUuid
            this.$store.dispatch('sendCreateCustomerAccount', {
              ...refund,
              sourceAmount: (this.currentPointOfSales.currentOrder.priceList.currency.uuid !== refundCurrencyUuid) ? (refund.amount) : refund.amount,
              isReceipt: false,
              customerBankAccountUuid: response.customerBankAccountUuid,
              currencyUuid: this.isEmptyValue(paymentCurrency) ? currencyUuid.uuid : paymentCurrency.refund_reference_currency.uuid,
              tenderTypeCode: payment.payment_method.tender_type,
              customerUuid: refund.customerUuid,
              posUuid: refund.posUuid,
              email: refund.email,
              driverLicense: value,
              socialSecurityNumber: value,
              name: nameAccount,
              isRefund: true,
              bankAccountType: refund.bankAccountType,
              bankUuid: refund.bankID,
              paymentMethodUuid: payment.payment_method.uuid,
              isAch: true,
              AccountNo: refund.phone
            })
          })
        return
      }
      const containerUuid = 'OverdrawnInvoice'
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
      const bankUuid = this.currentBank
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const paymentDate = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'DateTrx'
      })
      const paymentMethodUuid = this.currentAvailablePaymentMethods.uuid
      const referenceNo = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      const filterPayment = this.listRefund.filter(payment => payment.paymentMethodUuid === paymentMethodUuid || payment.payment_method_uuid === paymentMethodUuid)
      const allPayMaximunRefund = this.sumRefund(filterPayment)
      const paymentCurrency = this.paymentTypeListRefund.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      const currencyUuid = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrencyRefund)
      if (this.maximumRefundAllowed < amount || (this.maximumRefundAllowed - allPayMaximunRefund) < amount) {
        this.visiblePin = true
        setTimeout(() => {
          this.$refs.pinPostPayment.focus()
        }, 500)
        this.refundOptionVAlidate = {
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: amount,
          convertedAmount: amount * this.dayRate.divideRate,
          paymentDate,
          tenderTypeCode: paymentCurrency.payment_method.tender_type,
          paymentMethodUuid: paymentCurrency.payment_method.uuid,
          currencyUuid: this.isEmptyValue(paymentCurrency.refund_reference_currency) ? currencyUuid.uuid : paymentCurrency.refund_reference_currency.uuid
        }
        return
      }
      this.$store.dispatch('sendCreateCustomerAccount', {
        posUuid,
        orderUuid,
        bankUuid,
        referenceNo,
        amount: amount,
        convertedAmount: amount * this.dayRate.divideRate,
        paymentDate,
        customerBankAccountUuid: this.isEmptyValue(newCustomerBankAccountUuid) ? this.currentBankAccount : newCustomerBankAccountUuid,
        tenderTypeCode: paymentCurrency.payment_method.tender_type,
        paymentMethodUuid: paymentCurrency.payment_method.uuid,
        currencyUuid: this.isEmptyValue(paymentCurrency.reference_currency) ? currencyUuid.uuid : paymentCurrency.reference_currency.uuid
      })
      this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
    },
    actionOverdrawnInvoice(commands) {
      if (commands.srcKey === 'close') {
        this.close()
      }
    },
    imageCard(typeRefund) {
      let image
      switch (typeRefund) {
        case 'D':
          image = 'MobilePayment.jpg'
          break
        case 'P':
          image = 'Mobile.jpg'
          break
        case 'X':
          image = 'Cash.jpg'
          break
        case 'A':
          image = 'ACH.jpg'
          break
        case 'M':
          image = 'GiftCard.jpg'
          break
        case 'Z':
          image = 'Zelle.jpg'
          break
        default:
          image = 'Default.jpg'
          break
      }
      return require('@/image/ADempiere/pos/typePayment/' + image)
    },
    selectPayment(payment) {
      this.selectionTypeRefund = payment
      this.$store.commit('updateValueOfField', {
        containerUuid: this.renderComponentContainer,
        columnName: 'PayAmt',
        value: this.change
      })
    },
    addRefund() {
      const grandTotal = this.currentOrder.grandTotal
      const paymentAmount = this.currentOrder.paymentAmount
      const chargeAmount = this.currentOrder.chargeAmount
      const abono = this.currentOrder.creditAmount
      const AmountTolerance = this.currentPointOfSales.writeOffAmountTolerance
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.currentOrder.uuid
      const payments = this.currentOrder.listPayments.payments
      let total = grandTotal + chargeAmount - abono - paymentAmount
      if (total < 0) {
        total = Math.abs(total)
      }
      if (
        this.option === 4 &&
        (this.caseOrder === 1 || this.caseOrder === 2) &&
        total <= AmountTolerance
      ) {
        this.completePreparedOrder(posUuid, orderUuid, payments)
      } else {
        const attributePin = {
          posUuid,
          payments,
          orderUuid,
          type: 'actionPos',
          typeRefund: this.option,
          action: 'openBalanceInvoice',
          value: this.currentOrder.openAmount,
          requestedAccess: this.currentPointOfSales.currentOrder.openAmount > 0 ? 'IsAllowsInvoiceOpen' : 'IsAllowsWriteOffAmount',
          label: this.$t('form.pos.pinMessage.invoiceOpen')
        }
        this.visible = true
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        return
      }
      const values = this.$store.getters.getValuesView({
        containerUuid: this.renderComponentContainer,
        format: 'object'
      })
      Object.keys(values).forEach(element => {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.renderComponentContainer,
          columnName: element,
          value: undefined
        })
      })
      // if (this.option === 4) {
      //   if (this.currentPointOfSales.currentOrder.openAmount > this.currentPointOfSales.writeOffAmountTolerance) {
      //     const attributePin = {
      //       posUuid,
      //       orderUuid,
      //       payments,
      //       typeRefund: this.option,
      //       action: 'openBalanceInvoice',
      //       type: 'actionPos',
      //       label: this.$t('form.pos.pinMessage.invoiceOpen'),
      //       requestedAccess: 'IsAllowsInvoiceOpen'
      //     }
      //     this.visible = true
      //     this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
      //     return
      //   }
      //   this.completePreparedOrder(posUuid, orderUuid, payments)
      //   // this.$store.commit('dialogoInvoce', { show: false, success: true })
      //   return
      // }
      this.$store.dispatch('addRefundLoaded', values)
      if (this.caseOrder === 2) {
        this.success()
        return
      }
      this.success()
    },
    success() {
      const customerDetails = []
      this.fieldsList.forEach(element => {
        const value = this.$store.getters.getValueOfField({
          containerUuid: 'OverdrawnInvoice',
          columnName: element.columnName
        })
        customerDetails.push({
          label: element.columnName,
          value
        })
      })
      this.optionSelected({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        customerDetails,
        payments: this.currentOrder.listPayments.payments
      })
    },
    close() {
      this.selectionTypeRefund = {}
      this.currentFieldPaymentMethods = this.isEmptyValue(this.searchPaymentMethods) ? '' : this.searchPaymentMethods[0].uuid
      this.$store.commit('dialogoInvoce', { show: false })
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
      this.currentFieldCurrencyRefund = value
      // this.currentFieldCurrency = value
    },
    changePaymentType(value) {
      this.$store.commit('currentTenderChange', value)
      this.currentPaymentType = value
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'TenderType',
        value: value
      })
    },
    optionSelected({ posUuid, orderUuid, customerDetails, payments }) {
      switch (this.option) {
        case 1:
          if (this.currentOrder.paymentAmount < this.currentOrder.grandTotal && Math.abs(this.currentOrder.openAmount) > this.currentPointOfSales.writeOffAmountTolerance) {
            const attributePin = {
              posUuid: this.currentPointOfSales.uuid,
              orderUuid: this.currentOrder.uuid,
              payments: this.$store.getters.getListRefund,
              typeRefund: this.option,
              action: 'openBalanceInvoice',
              type: 'actionPos',
              label: this.$t('form.pos.pinMessage.invoiceOpen'),
              requestedAccess: this.currentPointOfSales.currentOrder.openAmount > 0 ? 'IsAllowsInvoiceOpen' : 'IsAllowsWriteOffAmount'
            }
            this.visible = true
            this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          } else if (Math.abs(this.currentOrder.refundAmount) > this.currentPointOfSales.writeOffAmountTolerance) {
            const attributePin = {
              posUuid: this.currentPointOfSales.uuid,
              orderUuid: this.currentOrder.uuid,
              payments: this.$store.getters.getListRefund,
              typeRefund: this.option,
              action: 'openBalanceInvoice',
              type: 'actionPos',
              label: this.$t('form.pos.collect.overdrawnInvoice.incompleteChange'),
              requestedAccess: 'IsAllowsIncompleteChange'
            }
            this.visible = true
            this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          } else {
            this.completePreparedOrder(posUuid, orderUuid, payments)
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          }
          break
        case 2:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
          break
        case 3:
          if (!this.isEmptyValue(this.refundLoaded)) {
            const values = this.$store.getters.getValuesView({
              containerUuid: this.renderComponentContainer,
              format: 'object'
            })
            const customer = {
              customerAccount: values,
              currencyUuid: this.$store.getters.getCurrencyRedund.uuid,
              orderUuid: this.currentOrder.uuid,
              posUuid: this.currentPointOfSales.uuid,
              tenderTypeCode: this.selectionTypeRefund.tender_type
            }
            if (this.selectionTypeRefund.is_pos_required_pin) {
              const attributePin = {
                posUuid,
                orderUuid,
                customer,
                payments,
                typeRefund: this.option,
                action: 'openBalanceInvoice',
                type: 'actionPos',
                label: this.$t('form.pos.pinMessage.invoiceOpen'),
                requestedAccess: this.currentPointOfSales.currentOrder.openAmount > 0 ? 'IsAllowsInvoiceOpen' : 'IsAllowsWriteOffAmount'
              }
              this.visible = true
              this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
            } else if (Math.abs(this.currentOrder.refundAmount) > this.currentPointOfSales.writeOffAmountTolerance) {
              const attributePin = {
                posUuid: this.currentPointOfSales.uuid,
                orderUuid: this.currentOrder.uuid,
                payments: this.$store.getters.getListRefund,
                typeRefund: this.option,
                action: 'openBalanceInvoice',
                type: 'actionPos',
                label: this.$t('form.pos.collect.overdrawnInvoice.incompleteChange'),
                requestedAccess: 'IsAllowsIncompleteChange'
              }
              this.visible = true
              this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
            } else {
              this.completePreparedOrder(posUuid, orderUuid, payments)
              this.$message({
                type: 'success',
                message: this.$t('notifications.completed'),
                showClose: true
              })
              this.$store.commit('dialogoInvoce', { show: false, success: true })
            }
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('form.pos.collect.overdrawnInvoice.addPayment'),
              showClose: true
            })
            return
          }
          break
        case 4:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
          break
        default:
          if (this.selectionTypeRefund.is_pos_required_pin || this.maximumRefundAllowed <= (this.change / this.dayRate.divideRate)) {
            const attributePin = {
              posUuid,
              orderUuid,
              payments,
              typeRefund: this.option,
              action: 'openBalanceInvoice',
              type: 'actionPos',
              label: this.$t('form.pos.pinMessage.invoiceOpen'),
              requestedAccess: this.currentPointOfSales.currentOrder.openAmount > 0 ? 'IsAllowsInvoiceOpen' : 'IsAllowsWriteOffAmount'
            }
            this.visible = true
            this.$store.dispatch('sendCreateCustomerAccount', this.$store.getters.getAddRefund)
            this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          } else {
            this.$store.dispatch('sendCreateCustomerAccount', this.$store.getters.getAddRefund)
              .then(response => {
                if (response.type === 'success') {
                  this.completePreparedOrder(posUuid, orderUuid, payments)
                }
              })
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          }
          break
      }
      this.selectionTypeRefund = {}
    },
    completePreparedOrder(posUuid, orderUuid, payments) {
      if (this.isProcessLoading) return
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
        createPayments: !this.isEmptyValue(this.listAllPayments),
        payments: this.listAllPayments
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
          this.$store.dispatch('printTicket', {
            posId: this.currentPointOfSales.id,
            orderId: this.currentOrder.id
          })
          this.summaryProcessOrder = {
            labelModal: this.$t('notifications.succesful'),
            title: this.$t('notifications.completed'),
            type: 'success'
          }
          this.showOpenSummary = true
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.$store.dispatch('listPayments', {
            posUuid: this.currentPointOfSales.uuid,
            orderUuid: this.currentOrder.uuid
          })
          this.summaryProcessOrder = {
            labelModal: this.$t('notifications.error'),
            title: error.message,
            type: 'error'
          }
          this.showOpenSummary = true
        })
        .finally(() => {
          this.$store.commit('setProcessLoading', false)
        })
    },
    afterProcess() {
      if (this.isProcessLoading) return
      if (this.summaryProcessOrder.type === 'error') {
        // this.$store.dispatch('reloadOrder', this.currentOrder.uuid)
        this.completePreparedOrder({
          posUuid: this.currentPointOfSales.uuid,
          orderUuid: this.currentOrder.uuid
        })
        this.showOpenSummary = false
        return
      }
      this.showOpenSummary = false

      this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
      if (this.IsAllowsPreviewDocument) {
        this.printPreview({
          posUuid: this.currentPointOfSales.uuid,
          orderUuid: this.currentOrder.uuid
        })
      }
      this.$store.dispatch('updateOrderPos', false)
      this.$store.dispatch('updatePaymentPos', false)
    },
    loadBankAccount() {
      this.$store.dispatch('listCustomerBankAccounts', { customerUuid: this.currentOrder.businessPartner.uuid })
    },
    printPreview(posUuid, orderUuid) {
      this.$store.dispatch('printTicketPreviwer', { posUuid, orderUuid })
        .then(response => {
          const { processLog } = response
          if (!this.isEmptyValue(processLog) && !this.isEmptyValue(processLog.output)) {
            const link = buildLinkHref({
              fileName: !this.isEmptyValue(processLog.output.file_name) ? processLog.output.file_name : '',
              outputStream: !this.isEmptyValue(processLog.output.file_name) ? processLog.output.file_name : '',
              mimeType: processLog.output.mime_type
            })
            this.$store.commit('setReportOutput', {
              download: link.download,
              format: processLog.output.report_type,
              fileName: !this.isEmptyValue(processLog.output.file_name) ? processLog.output.file_name : '',
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
    findRefundCurrencyConversion(currency) {
      if (!this.isEmptyValue(currency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: currency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
          .then(response => {
            this.emptyConversion.push({
              ...response,
              currency
            })
          })
      }
    }
  }
}
</script>

<style scoped>
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    background: #dae6f32e;
  }
  .el-image {
    display: inline-block;
    overflow: hidden;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  .bottom {
    margin-top: 0px!important;
    line-height: 1px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 9vh;
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
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
</style>
