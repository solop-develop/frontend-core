<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Yamel Senih ysenih@erpya.com
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
  <el-container style="background: white; height: 100% !important;">
    <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
      <el-container style="background: white; padding: 0px; height: 100% !important;">
        <!-- Invoice Overdrawn at time of collection -->
        <overdrawn-invoice
          :change="change"
          :pay="pay"
          :pending="pending"
          :total-order="currentOrder.grandTotal"
          :currency="pointOfSalesCurrency"
        />
        <!-- Collection container top panel -->
        <el-header style="height: auto; padding-bottom: 10px; padding-right: 0px; padding-left: 0px">
          <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
            <div
              v-if="isLoaded"
              class="text item"
            >
              <el-form
                label-position="top"
                label-width="10px"
                class="form-min-label"
                style="float: right; display: contents; line-height: 10px;"
                :disabled="validateOpenAmount"
                @submit.native.prevent="notSubmitForm"
              >
                <el-row id="fieldListCollection">
                  <el-col
                    v-for="field in primaryFieldsList"
                    :key="field.sequence"
                    :span="size"
                  >
                    <field-definition
                      :metadata-field="field.columnName === 'PayAmt' ? {
                        ...field,
                        isDisabledFieldPos: isDisabledLogiPos(field),
                        labelCurrency: currentFieldCurrency
                      } : field"
                      :container-uuid="'Collection'"
                      :container-manager="{
                        ...containerManager,
                        getLookupList,
                        isDisplayedField,
                        isDisplayedDefault,
                        isMandatoryField,
                        generalInfoSearch,
                        searchTableHeader,
                        isReadOnlyField,
                        changeFieldShowedFromUser
                      }"
                    />
                  </el-col>
                  <el-col :span="size">
                    <div class="field-definition">
                      <el-form-item :label="$t('form.pos.collect.paymentMethods')" class="field-standard">
                        <el-select
                          v-model="currentFieldPaymentMethods"
                          :filterable="!isMobile"
                          style="width: 100%;"
                          @change="changePaymentMethods"
                        >
                          <el-option
                            v-for="item in availablePaymentMethods"
                            :key="item.id"
                            :label="item.name"
                            :value="item.uuid"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="size">
                    <div class="field-definition">
                      <el-form-item :label="$t('form.pos.collect.Currency')" class="field-standard" style="margin-left: 10px;margin-right: 10px;">
                        <el-select
                          v-model="currentFieldCurrency"
                          :disabled="!isEmptyValue(currentAvailablePaymentMethods.reference_currency)"
                          style="width: 100%;"
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
                    </div>
                  </el-col>
                  <el-col v-if="isdisplayLogicBank && isShowBankAccount" :span="size">
                    <div class="field-definition">
                      <el-form-item
                        :label="$t('pointOfSales.collection.recipientBank')"
                        class="field-standard"
                      >
                        <el-select
                          v-model="recipientBank"
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
                  <el-col v-if="isShowBankAccount" :span="size">
                    <div class="field-definition">
                      <el-form-item
                        :label="$t('pointOfSales.collection.customerAccount')"
                        class="field-standard"
                      >
                        <el-select
                          v-model="currentBankAccount"
                          clearable
                          remote
                          style="width: 100%;"
                          @change="changeBankAccount"
                          @visible-change="showBankAccount"
                        >
                          <el-option
                            v-for="item in bankAccountList"
                            :key="item.customer_bank_account_uuid"
                            :label="item.name"
                            :value="item.customer_bank_account_uuid"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col v-if="isdisplayLogicBank && isShowBankAccount" :span="size">
                    <div class="field-definition">
                      <el-form-item
                        :label="$t('pointOfSales.collection.issuingBank')"
                        class="field-standard"
                      >
                        <el-select
                          v-model="currentBank"
                          style="display: block;"
                          :loading="loadingBank"
                          filterable
                          clearable
                          remote
                          :disabled="!isEmptyValue(currentBankAccount)"
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
                  <el-col v-if="isdisplayLogicBank && !isShowBankAccount" :span="size">
                    <div class="field-definition">
                      <el-form-item
                        :label="$t('pointOfSales.collection.bank')"
                        class="field-standard"
                      >
                        <el-select
                          v-model="currentBank"
                          style="display: block;"
                          :loading="loadingBank"
                          filterable
                          clearable
                          remote
                          :disabled="!isEmptyValue(currentBankAccount)"
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
                  <!-- isdisplayLogicCreditMemo -->
                  <el-col v-if="isdisplayLogicCreditMemo" :span="size">
                    <div class="field-definition">
                      <el-form-item
                        :label="$t('pointOfSales.collection.creditMemo')"
                        class="field-standard"
                      >
                        <el-select
                          v-model="currentCreditMemo"
                          style="display: block;"
                          filterable
                          clearable
                          @visible-change="showListCreditMemo"
                          @change="selectCreditMemo"
                        >
                          <el-option
                            v-for="item in listCreditMemo"
                            :key="item.id"
                            :label="item.display"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col
                    v-for="field in hiddenFieldsList"
                    :key="field.sequence"
                    :span="size"
                  >
                    <field-definition
                      :metadata-field="{
                        ...field,
                        isDisabledFieldPos: isDisabledLogiPos(field)
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
            </div>
          </el-card>
          <samp id="buttonCollection" style="float: right;padding-right: 10px;">
            <el-button type="danger" icon="el-icon-close" @click="exit" />
            <el-button type="info" icon="el-icon-minus" :disabled="isDisabled || isUndoPayLoading" :loading="isUndoPayLoading" @click="undoPatment" />
            <el-button type="success" icon="el-icon-plus" :disabled="fieldAmount <= 0" :loading="isPayemntLoading" @click="addCollectToList(paymentBox)" />
            <el-button type="primary" icon="el-icon-shopping-cart-full" :disabled="isProcessLoading" :loading="isProcessLoading" @click="validateOrder(listPayments)" />
          </samp>
        </el-header>

        <!-- Panel where they show the payments registered from the collection container -->
        <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
          <type-collection
            v-if="!updateOrderPaymentPos"
            id="cardCollection"
            :is-add-type-pay="listPayments"
            :currency="pointOfSalesCurrency"
            :list-types-payment="fieldsList[2]"
            :is-loaded="isLoadedPayments"
            :list-payment-type="fieldsPaymentType"
          />
          <div
            v-else
            key="form-loading"
            v-loading="updateOrderPaymentPos"
            :element-loading-text="$t('notifications.loading')"
            :element-loading-spinner="'el-icon-loading'"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="view-loading"
          />
        </el-main>

        <!-- Collection container bottom panel -->
        <el-footer id="infoInvoce" height="auto" style="padding-left: 0px; padding-right: 0px;">
          <el-row :gutter="24">
            <el-col :span="24" style="padding-left:  15px !important;padding-right: 15px !important;">
              <span>
                <div style="border: 1px solid rgb(54, 163, 247);padding-left: 10px;padding-right: 10px;">
                  <p class="total">
                    <b>
                      {{ $t('form.pos.collect.orderTotal') }} {{ '(' + currentOrder.documentNo + ')' }}:
                    </b>
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.grandTotal, currentOrder.priceList.currency.iso_code) }}
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
                <div style="padding-left: 10px;padding-right: 10px;">
                  <p class="total">
                    {{ $t('pointOfSales.collection.creditAmount') }}:
                    <b style="float: right;">
                      {{ formatPrice2({ value: currentOrder.creditAmount, currency: currentOrder.priceList.currency.iso_code }) }}
                    </b>
                  </p>
                  <p class="total">
                    {{ $t('pointOfSales.collection.chargeAmount') }}:
                    <b style="float: right;">
                      {{ formatPrice2({ value: currentOrder.chargeAmount, currency: currentOrder.priceList.currency.iso_code }) }}
                    </b>
                  </p>

                  <p class="total">
                    {{ $t('form.pos.collect.payment') }}:
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.paymentAmount, currentOrder.priceList.currency.iso_code) }}
                    </b>
                  </p>

                  <p class="total">
                    {{ $t('form.pos.collect.pending') }}:
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.openAmount, currentOrder.priceList.currency.iso_code) }}
                    </b>
                  </p>

                  <p class="total">
                    {{ $t('form.pos.collect.change') }}:
                    <b style="float: right;">
                      {{ formatPrice(currentOrder.refundAmount, currentOrder.priceList.currency.iso_code) }}
                    </b>
                  </p>

                  <p v-if="!isEmptyValue(dayRate)" class="total">
                    {{ $t('form.pos.collect.dayRate') }}:
                    <!-- Conversion rate to date -->
                    <b style="float: right;">
                      {{ showDayRate(dayRate) }}
                    </b>
                  </p>
                </div>
              </span>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-main>
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
            {{ formatPrice(currentOrder.grandTotal, currentOrder.priceList.currency.iso_code) }}
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
  </el-container>
</template>

<script>
// constants
import fieldsListCollection from './fieldsListCollection.js'
import { FIELDS_DECIMALS } from '@/utils/ADempiere/references'

// components and mixins
import formMixin from '@/components/ADempiere/Form/formMixin'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import typeCollection from '@/components/ADempiere/Form/VPOS/Collection/typeCollection'
import overdrawnInvoice from './overdrawnInvoice'

// utils and helper methods
import { isSameValues } from '@/utils/ADempiere/valueUtils'
import { formatPrice as formatPrice2 } from '@/utils/ADempiere/formatValue/numberFormat'
import { formatPrice, formatDateToSend } from '@/utils/ADempiere/valueFormat.js'
import { clientDateTime } from '@/utils/ADempiere/formatValue/dateFormat'
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

// api request methods
import { processOrder } from '@/api/ADempiere/form/point-of-sales.js'
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
export default {
  name: 'Collection',

  components: {
    typeCollection,
    overdrawnInvoice
  },

  mixins: [
    formMixin,
    posMixin
  ],

  props: {
    isLoadedPanel: {
      type: Boolean,
      required: false
    },
    amount: {
      type: Object,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Collection',
          containerUuid: 'Collection'
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
      isCustomForm: true,
      checked: false,
      currencyConversion: 1,
      convertAllPayment: 1,
      allPayCurrency: 0,
      labelTenderType: '',
      defaultLabel: '',
      fieldsList: fieldsListCollection,
      sendToServer: false,
      isLoadProcessOrder: false,
      value: '',
      amontSend: 0,
      currentFieldCurrency: '',
      currentFieldPaymentMethods: '',
      currentBankAccount: '',
      showOpenSummary: false,
      currentBank: '',
      recipientBank: '',
      listCreditMemo: [],
      currentCreditMemo: '',
      listBanks: this.$store.getters.getListBanks,
      loadingBank: false,
      summaryProcessOrder: {},
      isPayemntLoading: false,
      isUndoPayLoading: false
    }
  },

  computed: {
    isDisabledFieldPos() {
      if (this.isdisplayLogicBank) {
        return !this.isEmptyValue(this.currentBankAccount)
      } else if (this.isdisplayLogicCreditMemo) {
        return !this.isEmptyValue(this.currentCreditMemo)
      }
      return false
    },
    isdisplayLogicBank() {
      if (this.isEmptyValue(this.currentAvailablePaymentMethods)) return false
      if (this.isEmptyValue(this.currentAvailablePaymentMethods.payment_method)) return false
      return ['D', 'K', 'T', 'A', 'P', 'C'].includes(this.currentAvailablePaymentMethods.payment_method.tender_type)
    },
    isdisplayLogicCreditMemo() {
      if (this.isEmptyValue(this.currentAvailablePaymentMethods)) return false
      if (this.isEmptyValue(this.currentAvailablePaymentMethods.payment_method)) return false
      return ['M'].includes(this.currentAvailablePaymentMethods.payment_method.tender_type)
    },
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    convertionList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    validateCompleteCollection() {
      let collection
      if (this.pay === this.currentOrder.grandTotal) {
        collection = false
      } else {
        if (this.pay >= this.currentOrder.grandTotal && (this.isCashAmt >= this.change) || this.checked) {
          collection = false
        } else {
          collection = true
        }
      }
      return collection
    },
    fullCopper() {
      if ((this.change > this.isCashAmt) && this.pay > this.currentOrder.grandTotal) {
        return true
      }
      return false
    },
    isPaymentBox() {
      return this.$store.getters.getPaymentBox
    },
    addPay() {
      const amount = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      if (amount <= 0) {
        return true
      }
      return false
    },
    listPayments() {
      const listLocal = this.$store.getters.getPaymentBox
      const listServer = this.$store.getters.getListRefund
      if (!this.sendToServer && !this.isEmptyValue(listServer)) {
        return listServer.filter(payment => !payment.isRefund)
      }
      return listLocal.paymentBox
    },
    isLoadedPayments() {
      if (this.isEmptyValue(this.currentOrder.listPayments)) {
        return false
      }
      return this.currentOrder.listPayments.isLoaded
    },
    paymentBox() {
      if (this.isEmptyValue(this.listPayments)) {
        return []
      }
      const payment = this.listPayments.filter(pay => {
        return pay.isVisible
      })
      if (this.isEmptyValue(payment)) {
        return []
      }
      return payment
    },
    validatePaymentBeforeProcessing() {
      return this.currentOrder.isProcessed
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
      return this.listPayments.filter(payment => payment.documentStatus.value === 'DR')
    },
    cashPayment() {
      const cash = this.listPayments.filter(pay => {
        return pay.tenderTypeCode === 'X'
      })
      return this.sumCash(cash)
    },
    isValidForPay() {
      const containerUuid = this.containerUuid
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const allChange = Number.parseFloat(amount + this.change).toFixed(2) - this.cashPayment
      if (typePay !== 'X' && !this.isMandatory) {
        if (this.cashPayment === this.change && this.pending === 0 || (allChange > 0 && this.pending === 0)) {
          return true
        }
        return false
      }
      const cash = this.isMandatory
      return cash
    },
    turned() {
      const containerUuid = this.containerUuid
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const allPay = this.cashPayment + amount
      if (typePay !== 'X') {
        if (allPay <= this.currentOrder.grandTotal) {
          return false
        }
        return true
      }
      return false
    },
    isCashAmt() {
      const cashAmt = this.listPayments.map(item => {
        if (item.tenderTypeCode === 'X') {
          return item.amount
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    isOtherPayAmt() {
      const cashAmt = this.listPayments.map(item => {
        if (item.tenderTypeCode !== 'X') {
          return item.payAmt
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    pay() {
      return this.sumCash(this.listPayments)
    },
    pending() {
      const missing = this.currentOrder.grandTotal - this.pay
      if (this.pay > 0 && this.pay < this.currentOrder.grandTotal) {
        return missing
      }
      const pending = this.currentOrder.grandTotal <= this.pay ? 0 : this.currentOrder.grandTotal
      return pending
    },
    convertion() {
      return this.$store.getters.getDivideRateCollection
    },
    isMandatory() {
      const containerUuid = this.containerUuid
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: this.fieldsList
      })
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      if (this.isEmptyValue(fieldsEmpty) && amount > 0) {
        return false
      }
      return true
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin)) {
        return pos.isPosRequiredPin
      }
      return false
    },
    validPay() {
      const containerUuid = this.containerUuid
      // filter by visible fields
      const fieldLogic = this.hiddenFieldsList.filter(field => field.isDisplayedFromLogic === true)
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: fieldLogic,
        isValidate: true
      })
      if (this.$t('form.pos.collect.emptyRate') === this.showDayRate(this.dayRate) && this.isEmptyValue(this.currentFieldCurrency) && this.currentFieldCurrency !== this.currentPointOfSales.currentPriceList.currency.iSOCode) {
        return true
      }
      const paymentMethods = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (paymentMethods.tender_type === 'X') {
        return false
      }
      if (this.isEmptyValue(fieldsEmpty)) {
        return false
      }
      return true
    },
    change() {
      const missing = this.pay - this.currentOrder.grandTotal
      if (this.pay > 0 && this.pay > this.currentOrder.grandTotal) {
        return missing
      }
      return 0
    },
    typeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    multiplyRateCollection() {
      return this.$store.getters.getMultiplyRateCollection
    },
    divideRate() {
      return this.$store.getters.getDivideRate
    },
    fieldAmount() {
      const amount = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      return amount * this.divideRate
    },
    validateConvertion() {
      if (this.fieldAmount <= this.pending) {
        return false
      }
      return true
    },
    displayCurrency() {
      return this.$store.getters.getListCurrency
    },
    convert() {
      return this.$store.getters.getConvertionPayment
    },
    updateOrderPaymentPos() {
      return this.$store.getters.getUpdatePaymentPos
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    currentConvertion() {
      if (this.isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        return {}
      }
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(convert.currencyTo) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency) && convert.currencyTo.id === this.currentPointOfSales.displayCurrency.id) {
          return convert
        }
      })
      if (convert) {
        return convert
      }
      return {}
    },
    dayRate() {
      if (!this.isEmptyValue(this.currentFieldCurrency)) {
        const currency = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
        const convert = this.convertionsList.find(convert => {
          if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
            return convert
          }
        })
        if (!this.isEmptyValue(convert)) {
          return convert
        }
      }
      return {
        currencyTo: this.currentPointOfSales.priceList.currency,
        divideRate: 1,
        multiplyRate: 1,
        iSOCode: this.currentPointOfSales.priceList.currency.iSOCode
      }
    },
    fieldsPaymentType() {
      return this.fieldsList[1]
    },
    primaryFieldsList() {
      return this.fieldsList.filter(field => field.sequence < 1)
    },
    hiddenFieldsList() {
      return this.fieldsList.filter(field => {
        if (field.sequence > 1 && field.displayLogicPayment.includes(this.currentAvailablePaymentMethods.payment_method.tender_type)) {
          return field
        }
      })
    },
    overUnderPayment() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.success
    },
    totalAmountConverted() {
      const conversionsList = this.$store.state['pointOfSales/point/index'].conversionsList
      if (this.isEmptyValue(conversionsList) && !this.isEmptyValue(this.currentPointOfSales.conversionTypeUuid)) {
        return 1
      }
      const converted = conversionsList.find(converted => {
        if (converted.conversionTypeUuid === this.currentPointOfSales.conversionTypeUuid) {
          return converted
        }
      })
      if (!this.isEmptyValue(converted)) {
        return converted.divideRate
      }
      return 1
    },
    standardPrecision() {
      const precision = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      if (precision) {
        return precision.standard_precision
      }
      return this.pointOfSalesCurrency.standardPrecision
    },
    availablePaymentMethods() {
      return this.$store.getters.getPaymentTypeList
    },
    currentAvailablePaymentMethods() {
      if (this.isEmptyValue(this.availablePaymentMethods)) {
        return {
          name: ''
        }
      }
      const payment = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (!this.isEmptyValue(payment)) {
        return payment
      }
      const defaultPayment = this.availablePaymentMethods.find(payment => payment.tender_type === 'X')
      if (!this.isEmptyValue(defaultPayment)) {
        return defaultPayment
      }
      return {
        name: ''
      }
    },
    defaulValuePaymentMethods() {
      const defaultPayment = this.availablePaymentMethods.find(payment => payment.payment_method.tender_type === 'X')
      if (!this.isEmptyValue(defaultPayment)) {
        return defaultPayment
      }
      return {}
    },
    validateReturn() {
      const refund = this.$store.getters.getListRefund
      if (this.isEmptyValue(refund)) {
        return this.change
      }
      const allRefund = refund.filter(refund => refund.isRefund)
      if (!this.isEmptyValue(allRefund)) {
        return allRefund[0].amount
      }
      return this.change
    },
    dateConvertions() {
      const date = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'DateTrx'
      })
      if (this.isEmptyValue(date) && !this.isEmptyValue(this.currentPointOfSales.currentOrder.dateOrdered)) {
        const emptyDate = new Date()
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'DateTrx',
          value: emptyDate.getFullYear() + '-' + String(emptyDate.getMonth() + 1).padStart(2, '0') + '-' + String(emptyDate.getDate()).padStart(2, '0')
        })
        return this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      }
      return date
    },
    selectCurrentFieldCurrency() {
      return this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
    },
    size() {
      const size = this.$store.getters.getWidthRight
      if (this.primaryFieldsList.length <= 1 && this.hiddenFieldsList.length <= 1) {
        return 12
      }
      return 24 / size
    },
    amountForTheRate() {
      const amount = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(amount) &&
          !this.isEmptyValue(convert.currencyTo) &&
          amount.id === convert.currencyTo.id
        ) {
          return convert
        }
      })
      if (!this.isEmptyValue(convert)) {
        return convert.divideRate
      }
      return 1
    },
    showCollection() {
      return this.$store.getters.getShowCollectionPos
    },
    bankAccountList() {
      return this.$store.getters.getListCustomerBankAccount
    },
    isShowBankAccount() {
      const payment = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      if (!this.isEmptyValue(payment) && !this.isEmptyValue(payment.payment_method) && payment.payment_method.tender_type === 'P') return true
      return false
    }
  },

  watch: {
    dateConvertions(value) {
      const currencyFromUuid = this.currentPointOfSales.priceList.currency.uuid
      const currencyToUuid = this.isEmptyValue(this.selectCurrentFieldCurrency) ? '' : this.selectCurrentFieldCurrency.uuid
      if (!this.isEmptyValue(this.currentPointOfSales.conversionTypeUuid) &&
        !this.isEmptyValue(currencyFromUuid) && !this.isEmptyValue(currencyToUuid) &&
        !isSameValues(currencyFromUuid, currencyToUuid) &&
        !this.isEmptyValue(currencyToUuid) &&
        !this.isEmptyValue(value) && this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered) !== value) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid,
          currencyToUuid,
          conversionDate: clientDateTime(value, 'd')
        })
      }
    },
    showCollection(value) {
      this.defaultValueCurrency()
      this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
      this.cancel()
      if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      } else {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: 0.00
        })
      }
    },
    pending(value) {
      if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      } else {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: 0.00
        })
      }
    },
    convertAllPayment(value) {
      if (!this.isEmptyValue(value)) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
    },
    isLoaded(value) {
      if (value) {
        if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: this.currentOrder.openAmount / this.amountForTheRate
          })
        } else {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: 0.00
          })
        }
      }
    },
    dayRate(value) {
      if (!this.isEmptyValue(value.divideRate)) {
        if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: this.currentOrder.openAmount / this.amountForTheRate
          })
        } else {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: 0.00
          })
        }
      } else {
        if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: this.currentOrder.openAmount / this.amountForTheRate
          })
        } else {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: 0.00
          })
        }
      }
    },
    fieldsPaymentType(value) {
      const displayPaymentType = this.$store.getters.getValueOfField({
        containerUuid: 'Collection',
        columnName: 'DisplayColumn_PaymentType'
      })
      if (!this.isEmptyValue(value.reference) && this.isEmptyValue(displayPaymentType)) {
        this.$store.dispatch('getLookupListFromServer', {
          tableName: value.reference.tableName,
          query: value.reference.query
        })
      }
    },
    listPayments(payment) {
      if (!this.isEmptyValue(this.convertionsList)) {
        let rate
        payment.forEach((pay) => {
          rate = this.convertionsList.find(currency => !this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === pay.currencyUuid)
          if (!rate) {
            if (this.currentPointOfSales.priceList.currency.uuid !== pay.currencyUuid) {
              this.searchConversion(pay.currencyUuid)
            }
          }
        })
      }
    },
    currentFieldPaymentMethods(value) {
      const payment = this.availablePaymentMethods.find(payment => payment.uuid === value)
      if (!this.isEmptyValue(payment.payment_method) && payment.payment_method.tender_type === 'P') this.loadBankAccount()
      if (!this.isEmptyValue(payment.reference_currency)) {
        this.changeCurrency(payment.reference_currency.iso_code)
      } else {
        this.changeCurrency(this.pointOfSalesCurrency.iSOCode)
      }
      if (!this.isEmptyValue(this.dayRate)) {
        this.showDayRate(this.dayRate)
      }
    },
    precision() {
      return this.$store.getters.getCurrency.standardPrecision
    },
    totalAmountConverted(value) {
      if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      } else {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: 0.00
        })
      }
    }
  },

  created() {
    this.currentFieldCurrency = this.pointOfSalesCurrency.iSOCode
    this.$store.dispatch('addRateConvertion', this.pointOfSalesCurrency)
    this.unsubscribe = this.subscribeChanges()
    this.defaultValueCurrency()
    setTimeout(() => {
      if (!this.isEmptyValue(this.dayRate.divideRate)) {
        this.showDayRate(this.dayRate, this.dayRate.divideRate)
        if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: this.currentOrder.openAmount / this.amountForTheRate
          })
        } else {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: 0.00
          })
        }
      }
    }, 1500)
    this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
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
    formatDateToSend,
    formatPrice2,
    formatQuantity,
    showDayRate(rate) {
      const amount = rate.divideRate > rate.multiplyRate ? rate.divideRate : rate.multiplyRate
      const currency = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)
      if (this.isEmptyValue(currency)) {
        return this.formatPrice(0.00, this.currentFieldCurrency)
      }
      if (!this.isEmptyValue(currency) && !this.isEmptyValue(rate.currencyTo.iSOCode) && rate.currencyTo.iSOCode !== currency.iso_code) {
        return this.formatPrice(0.00, currency.iso_code)
      }
      if (!this.isEmptyValue(rate.currencyTo.iSOCode) && rate.currencyTo.iSOCode === this.currentPointOfSales.priceList.currency.iSOCode) {
        const convert = this.convertionsList.find(convert => {
          if (!this.isEmptyValue(convert.currencyTo) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency) && this.currentPointOfSales.displayCurrency.iso_code === convert.currencyTo.iSOCode) {
            return convert
          }
        })
        const convertAmount = !this.isEmptyValue(convert) ? (convert.divideRate > convert.multiplyRate ? convert.divideRate : convert.multiplyRate) : ''
        const displayCurrency = this.isEmptyValue(this.currentPointOfSales.displayCurrency) ? '' : this.currentPointOfSales.displayCurrency.iso_code
        if (this.isEmptyValue(convertAmount)) {
          return this.formatPrice(0.00, this.currentFieldCurrency)
        }
        return this.formatPrice(1, displayCurrency) + ' ~ ' + this.formatPrice(convertAmount, this.currentPointOfSales.priceList.currency.iSOCode)
      }
      return this.formatPrice(1, rate.currencyTo.iSOCode) + ' ~ ' + this.formatPrice(amount, this.currentPointOfSales.priceList.currency.iSOCode)
    },
    amountConvert(currency) {
      this.$store.dispatch('searchConversion', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
        currencyToUuid: currency.uuid,
        conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      })
    },
    formatNumber({ displayType, number }) {
      let fixed = 0
      // Amount, Costs+Prices, Number
      if (FIELDS_DECIMALS.includes(displayType)) {
        fixed = 2
      }
      return new Intl.NumberFormat().format(number.toFixed(fixed))
    },
    formatPrice,
    sumCash(cash) {
      let sum = 0
      if (!this.isEmptyValue(cash)) {
        cash.forEach((pay) => {
          const searchConversion = this.$store.state['pointOfSales/point/index'].conversionsList.find(currency => !this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === pay.currencyUuid)
          if (!this.isEmptyValue(pay.divideRate) && !this.isEmptyValue(searchConversion)) {
            sum += pay.amount * searchConversion.divideRate
          } else {
            sum += pay.amount
          }
        })
      }
      return sum
    },
    convertAmount(currencyUuid) {
      const currencyPay = this.convertionsList.find(currency => {
        if (!this.isEmptyValue(currency.currencyTo) && currency.currencyTo.uuid === currencyUuid) {
          return currency
        }
      })
      if (!currencyPay) {
        return 0
      }
      const rate = (currencyPay.divideRate > currencyPay.multiplyRate) ? currencyPay.divideRate : currencyPay.multiplyRate
      return rate
    },
    addCollectToList() {
      this.isPayemntLoading = true
      const containerUuid = this.containerUuid
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid
      const bankUuid = this.recipientBank
      this.amontSend = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      // const tenderTypeCode = this.currentAvailablePaymentMethods.tender_type
      const referenceNo = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      const values = this.$store.getters.getValuesView({
        containerUuid,
        format: 'object'
      })
      const params = {
        // referenceNo: values.DocumentNo,
        referenceNo,
        description: values.Description,
        paymentDate: values.DateTrx
      }
      const nameAccount = this.currentPointOfSales.currentOrder.businessPartner.name

      const value = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'Value'
      })

      const customerBankAccountUuid = this.currentBankAccount
      const paymentCurrency = this.availablePaymentMethods.find(payment => payment.uuid === this.currentFieldPaymentMethods)
      const currencyUuid = this.listCurrency.find(currency => currency.iso_code === this.currentFieldCurrency)

      if (
        this.isEmptyValue(customerBankAccountUuid) &&
        paymentCurrency.payment_method.tender_type === 'P'
      ) {
        let referencebank = {
          routingNo: ''
        }

        if (this.listBanks) {
          referencebank = this.listBanks.find(a => a.uuid === this.currentBank)
        }
        const label = this.isEmptyValue(nameAccount) ? this.currentOrder.businessPartner.name : nameAccount
        const displayName = label + ' _ ' + values.Phone + ' _ ' + referencebank.routingNo + ' _ ' + value
        this.$store.dispatch('customerBankAccount', {
          customerUuid: this.currentOrder.customer.uuid,
          posUuid,
          driverLicense: value,
          socialSecurityNumber: value,
          name: displayName,
          bankUuid: this.currentBank,
          paymentMethodUuid: paymentCurrency.uuid,
          isAch: true,
          AccountNo: values.Phone
        })
          .then(response => {
            this.$store.dispatch('createPayments', {
              ...params,
              posUuid,
              orderUuid,
              bankUuid,
              invoiceReferenceId: this.currentCreditMemo,
              customerBankAccountUuid: response.customerBankAccountUuid,
              amount: this.round(this.amontSend, this.standardPrecision),
              convertedAmount: this.amontSend * this.dayRate.divideRate,
              paymentMethodUuid: paymentCurrency.payment_method.uuid,
              tenderTypeCode: this.currentAvailablePaymentMethods.payment_method.tender_type,
              currencyUuid: this.isEmptyValue(paymentCurrency.reference_currency) ? currencyUuid.uuid : paymentCurrency.reference_currency.uuid
            })
              .then((response) => {
                if (response.type !== 'error') {
                  this.addCollect()
                }
              })
              .finally(() => {
                this.isPayemntLoading = false
              })
          })
        this.isPayemntLoading = false
        return
      }

      // const currentBankAccountUuid = this.currentBankAccount
      if (this.currentAvailablePaymentMethods.is_payment_reference) {
        this.$store.dispatch('refundReference', {
          ...params,
          posUuid,
          orderUuid,
          customerBankAccountUuid: customerBankAccountUuid,
          isReceipt: true,
          bankUuid,
          amount: this.round(this.amontSend, this.standardPrecision),
          sourceAmount: this.amontSend * this.dayRate.divideRate,
          paymentMethodUuid: paymentCurrency.payment_method.uuid,
          tenderTypeCode: this.currentAvailablePaymentMethods.payment_method.tender_type,
          customerUuid: this.currentOrder.customer.uuid,
          salesRepresentativeUuid: this.currentOrder.salesRepresentative.uuid,
          currencyUuid: this.isEmptyValue(paymentCurrency.refund_reference_currency) ? currencyUuid.uuid : paymentCurrency.refund_reference_currency.uuid
        })
        this.addCollect()
        this.isPayemntLoading = false
        return
      }
      if (this.sendToServer) {
        this.$store.dispatch('setPaymentBox', {
          ...params,
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.round(this.amontSend, this.standardPrecision),
          convertedAmount: this.amontSend * this.dayRate.divideRate,
          paymentMethodUuid: paymentCurrency.payment_method.uuid,
          tenderTypeCode: this.currentAvailablePaymentMethods.payment_method.tender_type,
          currencyUuid: this.isEmptyValue(paymentCurrency.reference_currency) ? currencyUuid.uuid : paymentCurrency.reference_currency.uuid
        })
      } else {
        this.$store.dispatch('createPayments', {
          ...params,
          posUuid,
          orderUuid,
          bankUuid,
          invoiceReferenceId: this.currentCreditMemo,
          customerBankAccountUuid: customerBankAccountUuid,
          amount: this.round(this.amontSend, this.standardPrecision),
          convertedAmount: this.amontSend * this.dayRate.divideRate,
          paymentMethodUuid: paymentCurrency.payment_method.uuid,
          tenderTypeCode: this.currentAvailablePaymentMethods.payment_method.tender_type,
          currencyUuid: this.isEmptyValue(paymentCurrency.reference_currency) ? currencyUuid.uuid : paymentCurrency.reference_currency.uuid
        })
          .then((response) => {
            if (response.type !== 'error') {
              this.isPayemntLoading = false
              this.addCollect()
            }
          })
          .finally(() => {
            this.isPayemntLoading = false
          })
      }
    },
    updateServer(listPaymentsLocal) {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.currentOrder.uuid
      this.$store.dispatch('uploadOrdersToServer', { listPaymentsLocal, posUuid, orderUuid })
    },
    addCollect() {
      this.fieldsList.forEach(element => {
        if (element.columnName !== 'PayAmt') {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.defaultValue
          })

          // set default logics
          this.$store.dispatch('changeDependentFieldsList', {
            field: element
          })
        }
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'C_Currency_ID',
          value: this.pointOfSalesCurrency.id
        })
        this.$store.commit('updateValueOfField', {
          parentUuid: '',
          containerUuid: 'Collection',
          columnName: 'DisplayColumn_TenderType',
          value: this.defaultLabel
        })
        if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: this.currentOrder.openAmount / this.amountForTheRate
          })
        } else {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: 0.00
          })
        }
      })
      this.defaultValueCurrency()
      this.$store.commit('currencyDivideRateCollection', 1)
      this.$store.commit('currencyMultiplyRate', 1)
      this.currentFieldPaymentMethods = this.defaulValuePaymentMethods.uuid
      this.cancel()
    },
    cancel() {
      this.fieldsList.forEach(element => {
        if (element.columnName !== 'PayAmt' || element.columnName !== 'C_Currency_ID') {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.defaultValue
          })
        }
        this.$store.dispatch('changeDependentFieldsList', {
          field: element
        })
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      if (this.amountForTheRate !== 1 || this.currentFieldCurrency === this.pointOfSalesCurrency.iSOCode) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.currentOrder.openAmount / this.amountForTheRate
        })
      } else {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: 0.00
        })
      }
      this.defaultValueCurrency()
      this.$store.commit('currencyDivideRateCollection', 1)
      this.$store.commit('currencyMultiplyRate', 1)
    },
    exit() {
      this.cancel()
      this.$store.commit('setShowPOSCollection', false)
    },
    getPriceApplyingDiscount(price, discount) {
      if (this.isEmptyValue(price)) {
        price = 0
      }
      if (this.isEmptyValue(discount)) {
        discount = 0
      }
      return price - discount * price / 100
    },
    getDiscountByPriceEntered(unitPrice, priceEntereded) {
      if (this.isEmptyValue(unitPrice)) {
        unitPrice = 0
      }
      if (this.isEmptyValue(priceEntereded)) {
        priceEntereded = 0
      }
      const discount = 100 - priceEntereded * 100 / unitPrice
      if (this.isEmptyValue(discount) || discount === -Infinity) {
        return 0
      }
      return discount
    },
    defaultValueCurrency() {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID',
        value: this.pointOfSalesCurrency.iSOCode
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID',
        value: this.pointOfSalesCurrency.uuid
      })
    },
    defaulTenderType() {
      this.$store.commit('updateValueOfField', {
        parentUuid: '',
        containerUuid: 'Collection',
        columnName: 'DisplayColumn_TenderType',
        value: this.$t('form.pos.collect.TenderType.cash')
      })
    },
    currencyDisplay(currency) {
      const display = this.displayCurrency.find(item => {
        if (item.currencyUuid === currency || (item.currencyId === currency)) {
          return item
        }
      })
      if (display) {
        return display
      }
      if (currency === this.pointOfSalesCurrency.id) {
        return this.pointOfSalesCurrency.uuid
      }
      return currency
    },
    undoPatment() {
      const list = this.listPayments[this.listPayments.length - 1]
      const orderUuid = list.orderUuid
      const paymentUuid = list.uuid
      this.isUndoPayLoading = true
      this.$store.dispatch('deletetPayments', {
        posUuid: this.currentPointOfSales.uuid,
        orderUuid,
        paymentUuid
      })
        .finally(() => {
          this.isUndoPayLoading = false
        })
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
    showListCreditMemo(isShow) {
      if (!isShow) return
      const payment_method = this.availablePaymentMethods.find(list => list.uuid === this.currentFieldPaymentMethods)
      // let documentTypeId
      // if (!this.isEmptyValue(payment_method.document_type)) {
      //   documentTypeId = payment_method.document_type.id
      // }
      this.$store.dispatch('searchListCreditMemo', {
        documentTypeId: payment_method.document_type_id
      })
        .then(response => {
          this.listCreditMemo = response.map(list => {
            return {
              ...list,
              display: list.documentNo + ' - ' + list.documentDate + ' - ' + formatPrice(list.openAmount, list.currency.iso_code)
            }
          })
        })
    },
    selectCreditMemo(id) {
      const current = this.listCreditMemo.find(list => id === list.id)
      // this.$store.commit('setCurrenciesList', addListCurrency)
      // const addListCurrency = this.listCurrency.push(current.currency)
      if (this.isEmptyValue(current)) {
        this.clearCollection()
        return
      }
      let payAmt = current.openAmount
      if (current.currency.iso_code === this.currentOrder.priceList.currency.iso_code) {
        if (current.openAmount > this.currentOrder.grandTotal) {
          payAmt = this.currentOrder.grandTotal
        }
      }
      this.currentFieldCurrency = current.currency.iso_code
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Collection',
        attributes: [
          {
            columnName: 'PayAmt',
            value: payAmt
            // value: current.openAmount
          },
          {
            columnName: 'Description',
            value: current.description
          },
          {
            columnName: 'ReferenceNo',
            value: current.documentNo
          },
          {
            columnName: 'DateTrx',
            value: current.documentDate
          }
        ]
      })
    },
    /**
     * Disable Field According to the type of payment
     * @param {Object} field
     */
    isDisabledLogiPos(field) {
      const { columnName } = field
      if (this.isdisplayLogicBank) {
        if (columnName === 'ReferenceNo' || columnName === 'DateTrx' || columnName === 'PayAmt') return false
        return !this.isEmptyValue(this.currentBankAccount)
      } else if (this.isdisplayLogicCreditMemo) {
        if (columnName === 'PayAmt') {
          return false
        }
        return !this.isEmptyValue(this.currentCreditMemo)
      }
      return false
    },
    remoteMethodBank(query) {
      if (query !== '') {
        this.loadingBank = true
        this.showListBank(true, query)
      } else {
        this.listBanks = []
      }
    },
    validateOrder(payment) {
      const grandTotal = this.currentOrder.grandTotal
      const paymentAmount = this.currentOrder.paymentAmount
      const chargeAmount = this.currentOrder.chargeAmount
      const abono = this.currentOrder.creditAmount
      const total = grandTotal + chargeAmount - abono - paymentAmount
      const precision = this.currentOrder.priceList.currency.standard_precision
      if (Number((this.numberPrecision(total, precision))) === Number(0.00)) {
        this.completePreparedOrder(payment)
        return
      }
      if (this.currentOrder.refundAmount > 0) {
        this.$store.commit('dialogoInvoce', { show: true, type: 1 })
      } else if (this.currentOrder.openAmount > 0 || this.currentOrder.refundAmount > 0) {
        if (this.isPosRequiredPin) {
          const attributePin = {
            payment: payment,
            typeRefund: 0,
            action: 'openBalanceInvoice',
            type: 'actionPos',
            label: this.$t('form.pos.pinMessage.invoiceOpen'),
            requestedAccess: 'IsAllowsInvoiceOpen'
          }
          this.visible = true
          this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          return
        }
        this.$store.commit('dialogoInvoce', { show: true, type: 2 })
      } else {
        this.completePreparedOrder(payment)
      }
    },
    completePreparedOrder(payment) {
      this.isLoadProcessOrder = true
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.currentOrder.uuid
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      // this.$store.commit('setShowPOSCollection', false)
      this.$store.commit('setProcessLoading', true)
      processOrder({
        posUuid,
        orderUuid,
        isOpenRefund: !this.isEmptyValue(this.$store.getters.getListRefundReference),
        createPayments: !this.isEmptyValue(payment),
        payments: payment
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
          this.summaryProcessOrder = {
            labelModal: this.$t('notifications.succesful'),
            title: this.$t('notifications.completed'),
            type: 'success'
          }
          this.$store.dispatch('printTicket', { posId: this.currentPointOfSales.id, orderId: this.currentOrder.id })
            .then(() => {})
            .catch((error) => {
              this.$message({
                type: 'info',
                message: error.message,
                showClose: true
              })
            })
          this.showOpenSummary = true
        })
        .catch(error => {
          this.loadProcess()
          this.isLoadProcessOrder = false
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
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.loadProcess()
          this.$store.dispatch('updateOrderPos', false)
          this.$store.dispatch('updatePaymentPos', false)
          this.$store.commit('setProcessLoading', false)
        })
    },
    afterProcess() {
      if (this.isProcessLoading) return
      if (this.summaryProcessOrder.type === 'error') {
        // this.$store.dispatch('reloadOrder', this.currentOrder.uuid)
        this.completePreparedOrder(this.listPayments)
        this.showOpenSummary = false
        return
      }
      this.showOpenSummary = false
      this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
      this.$store.dispatch('listOrdersFromServer', {
        posUuid: this.currentPointOfSales.uuid
      })
      // this.loadProcess()
      this.$store.dispatch('updateOrderPos', false)
      this.$store.dispatch('updatePaymentPos', false)
    },
    printPreview(posUuid, orderUuid) {
      this.$store.dispatch('printTicketPreviwer', { posUuid, orderUuid })
        .then(response => {
          const { processLog } = response
          if (!this.isEmptyValue(processLog) && !this.isEmptyValue(processLog.output)) {
            const link = buildLinkHref({
              fileName: !this.isEmptyValue(processLog.output.file_name) ? processLog.output.file_name : '',
              outputStream: processLog.output.output_stream,
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
    formatDate(date) {
      let month = '' + (date.getMonth() + 1)
      let day = '' + date.getDate()
      const year = date.getFullYear()
      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    newOrderAfterPrintTicket() {
      this.clearOrder()
      this.$store.commit('setShowPOSCollection', false)
      this.createOrder({ withLine: false, newOrder: true, customer: this.currentPointOfSales.templateCustomer.uuid })
      this.$store.dispatch('listPayments', { posUuid: this.currentPointOfSales.uuid, orderUuid: this.currentOrder.uuid })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          if (mutation.payload.columnName === 'DisplayColumn_TenderType') {
            this.labelTenderType = mutation.payload.value
          }
        }
      })
    },
    changePaymentMethods(value) {
      this.currentFieldPaymentMethods = value
      this.clearCollection()
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
      const currency = this.listCurrency.find(currency => currency.iso_code === value)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
          return convert
        }
      })
      if (!this.isEmptyValue(currency) && this.isEmptyValue(convert) && currency.uuid !== this.currentPointOfSales.currentPriceList.currency.uuid) {
        this.amountConvert(currency)
      }
    },
    searchConversion(value) {
      this.$store.dispatch('searchConversion', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
        currencyToUuid: value,
        conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
      })
    },
    clearCollection() {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Collection',
        attributes: [
          {
            columnName: 'Description',
            value: undefined
          },
          {
            columnName: 'EMail',
            value: undefined
          },
          {
            columnName: 'ReferenceNo',
            value: undefined
          },
          {
            columnName: 'DocumentNo',
            value: undefined
          },
          {
            columnName: 'AccountNo',
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
            columnName: 'Name',
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
            columnName: 'CreditCardNumber',
            value: undefined
          },
          {
            columnName: 'CreditCardType',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_CreditCardType',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_TenderType',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_WH_Type_ID',
            value: undefined
          },
          {
            columnName: 'WH_Type_ID',
            value: undefined
          }
        ]
      })
      this.currentCreditMemo = ''
      this.currentBank = ''
    },
    loadProcess() {
      if (this.$store.getters.getShowCollectionPos) this.$store.commit('setShowPOSCollection', !this.$store.getters.getShowCollectionPos)
    },
    showBankAccount(value) {
      if (this.isEmptyValue(this.listBanks)) {
        this.showListBank(true)
      }
    },
    changeBankAccount(value) {
      if (this.isEmptyValue(value)) {
        this.$store.commit('updateValuesOfContainer', {
          containerUuid: 'Collection',
          attributes: [
            {
              columnName: 'Phone',
              value: ''
            },
            {
              columnName: 'C_Bank_ID_UUID',
              value: undefined
            }
          ]
        })
        this.currentBank = ''
        return
      }
      const currentBanckAccount = this.bankAccountList.find(banck => banck.customer_bank_account_uuid === value)
      this.currentBank = currentBanckAccount.bank_uuid
      this.$store.commit('updateValuesOfContainer', {
        containerUuid: 'Collection',
        attributes: [
          {
            columnName: 'Phone',
            value: currentBanckAccount.account_no
          },
          {
            columnName: 'Value',
            value: currentBanckAccount.driver_license
          },
          {
            columnName: 'C_Bank_ID_UUID',
            value: currentBanckAccount.bank_uuid
          }
        ]
      })
    },
    loadBankAccount() {
      this.$store.dispatch('listCustomerBankAccounts', { customerUuid: this.currentOrder.businessPartner.uuid })
    },
    numberPrecision(amount, precision) {
      const num = Number((Math.round(amount * 100) / 100).toFixed(precision))
      if (Math.sign(num) === 1) {
        return num
      }
      return Number(Number.parseFloat(Math.abs(num)).toFixed(2))
    }
  }
}
</script>

<style scoped>
  .stylefullPayment {
    font-size: 15px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
  }
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
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
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
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
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
  }
  .el-col {
    border-radius: 4px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
