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
  <el-empty v-if="isEmptyValue(listCashSummary.records)" :description="$t('form.pos.optionsPoinSales.emptyListCashSummary')" />
  <el-container v-else style="background: white; height: 100% !important;">
    <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <el-table
          :data="listCashSummary.records"
          border
          height="250"
          style="width: 100%"
        >
          <el-table-column
            v-if="isShowCashSummaryMovements"
            prop="document_no"
            :label="$t('form.expressMovement.field.documentNo')"
          />
          <el-table-column
            v-if="isShowCashSummaryMovements"
            prop="invoice_document_no"
            :label="$t('form.pos.collect.invoceNr')"
          />
          <el-table-column
            v-if="isShowCashSummaryMovements"
            prop="order_document_no"
            :label="$t('form.pos.collect.orderNr')"
          />
          <el-table-column
            v-if="isShowCashSummaryMovements"
            prop="customer.name"
            :label="$t('form.pos.collect.customer')"
          />
          <el-table-column
            v-if="isShowCashSummaryMovements"
            prop="charge.name"
            width="150"
            :label="$t('pointOfSales.collection.chargeAmount')"
          />
          <el-table-column
            v-if="isShowCashSummaryMovements"
            prop="collecting_agent.name"
            :label="$t('form.pos.collect.seller')"
          />
          <el-table-column
            prop="payment_method_name"
            width="150"
            :label="$t('form.pos.collect.paymentMethod')"
          />
          <el-table-column
            prop="currency.iso_code"
            :label="$t('form.pos.collect.Currency')"
          />
          <el-table-column
            label="Monto"
            align="right"
          >
            <template slot-scope="scope">
              {{ formatPrice(scope.row.amount, scope.row.currency.iso_code) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
    <el-footer style="height: auto; padding: 0px">
      <el-button
        style="float: right;margin-left: 10px;"
        type="primary"
        icon="el-icon-check"
        :loading="isLoadingCashClosing"
        :disabled="isLoadingCashClosing"
        @click="cashClose()"
      />
      <el-button
        style="float: right;"
        type="danger"
        icon="el-icon-close"
        @click="close()"
      />
      <el-button
        style="float: right;margin-left: 10px;"
        type="success"
        icon="el-icon-download"
        @click="cashDownload()"
      />
    </el-footer>
  </el-container>
</template>

<script>
import {
  formatPrice
} from '@/utils/ADempiere/valueFormat.js'
import formMixin from '@/components/ADempiere/Form/formMixin'
import fieldsListCashOpen from './fieldsList.js'
import {
  cashClosing
} from '@/api/ADempiere/form/point-of-sales.js'
import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'CashSummaryMovements',
  mixins: [
    formMixin
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
    shortkeyAction: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Cash-Withdrawal',
          containerUuid: 'Cash-Withdrawal'
        }
      }
    },
    labelPanel: {
      type: String,
      default: ''
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
      fieldsList: fieldsListCashOpen,
      sendToServer: false,
      visible: false,
      infoClose: {},
      value: ''
    }
  },
  computed: {
    showCashClose: {
      get() {
        return this.$store.getters.getShowSummaryCashClose
      },
      set(value) {
        this.$store.commit('setShowSummaryCashClose', value)
      }
    },
    summaryCashClose: {
      get() {
        return this.$store.getters.getSummaryCashClose
      },
      set(value) {
        this.$store.commit('setSummaryCashClose', value)
      }
    },
    showCashSummaryMovements() {
      return this.$store.getters.getShowCashSummaryMovements
    },
    listCashSummary() {
      if (this.isShowCashSummaryMovements) return this.$store.getters.getListCashSummaryMovements
      return this.$store.getters.getListCashSummary
    },
    isLoadingCashClosing() {
      return this.$store.getters.getLoadingCashClosing
    },
    isShowCashSummaryMovements() {
      return this.$store.getters.getIsShowCashSummaryMovements
    }
  },
  methods: {
    formatPrice,
    close() {
      if (this.isShowCashSummaryMovements) {
        this.$store.commit('setIsShowCashSummaryMovements', false)
        return
      }
      this.$store.commit('setShowCashSummaryMovements', false)
    },
    cashDownload() {
      let headerList
      if (this.isShowCashSummaryMovements) {
        headerList = [
          this.$t('form.expressMovement.field.documentNo'),
          this.$t('form.pos.collect.invoceNr'),
          this.$t('form.pos.collect.orderNr'),
          this.$t('form.pos.collect.customer'),
          this.$t('pointOfSales.collection.chargeAmount'),
          this.$t('form.pos.collect.seller'),
          this.$t('form.pos.collect.paymentMethod'),
          this.$t('form.pos.collect.Currency'),
          'Monto'
        ]
      } else {
        headerList = [
          this.$t('form.pos.collect.paymentMethod'),
          this.$t('form.pos.collect.Currency'),
          'Monto'
        ]
      }

      const data = this.listCashSummary.records.map(list => {
        const {
          document_no,
          invoice_document_no,
          payment_method_name,
          order_document_no,
          collecting_agent,
          currency,
          customer,
          charge
        } = list
        if (this.isShowCashSummaryMovements) {
          return {
            document_no,
            invoice_document_no,
            order_document_no,
            customer: isEmptyValue(customer) ? '' : customer.name,
            charge: isEmptyValue(charge) ? '' : charge.name,
            collecting_agent: collecting_agent.name,
            payment_method_name: payment_method_name,
            currency: currency.iso_code,
            amount: formatPrice(list.amount, list.currency.iso_code)
          }
        }
        return {
          payment_method_name: payment_method_name,
          currency: currency.iso_code,
          amount: formatPrice(list.amount, list.currency.iso_code)
        }
      })
      exportFileFromJson({
        header: headerList,
        data,
        fileName: this.isShowCashSummaryMovements ? this.$t('form.pos.optionsPoinSales.cashManagement.detailedCloseBox') : this.$t('form.pos.optionsPoinSales.cashManagement.closeBox'),
        exportType: 'xls'
      })
    },
    cashClose() {
      // this.$store.commit('setShowCashSummaryMovements', false)
      const posUuid = this.$store.getters.posAttributes.currentPointOfSales.uuid
      this.close
      this.$store.commit('setLoadingCashClosing', true)
      cashClosing({
        posUuid,
        id: this.listCashSummary.id,
        uuid: this.listCashSummary.uuid
      })
        .then(response => {
          this.showCashClose = true
          this.$message({
            message: response.document_type.name + ' Realizado ' + response.document_no,
            isShowClose: true,
            type: 'success'
          })
          this.summaryCashClose = {
            type: 'success',
            listCashSummary: this.listCashSummary.records,
            label: response.document_type.name + ' Realizado ' + response.document_no,
            title: this.labelPanel
          }
          this.close()
        })
        .catch(error => {
          this.showCashClose = true
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          this.summaryCashClose = {
            type: 'error',
            listCashSummary: this.listCashSummary.records,
            title: this.labelPanel,
            label: error.message
          }
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
          this.close()
        })
        .finally(() => {
          this.$store.dispatch('listCashMovementsSummary', { posUuid })
          this.$store.dispatch('listCashSummary', posUuid)
          this.$store.commit('setLoadingCashClosing', false)
        })
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
