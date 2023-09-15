<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-row style="padding-top: 25px;padding-left: 10px;padding-right: 10px;">
    <div v-if="!isMobile">
      <div style="display: flex">
        <!-- Left Pane Search Filter -->
        <div class="panel-left-search-filter" style="width: 50%;">
          <el-card shadow="always" style="padding: 10px !important;height: 100%;">
            <el-form
              :inline="true"
              label-position="top"
            >
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.paymentSelection')"
                >
                  <el-select
                    v-model="currentPaymentSelection"
                    filterable
                    @visible-change="findListPaymentSelection"
                    @change="setPaymentSelection"
                  >
                    <el-option
                      v-for="item in listPayment"
                      :key="item.KeyColumn"
                      :label="item.DisplayColumn"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.paymentRule')"
                >
                  <el-select
                    v-show="!isEmptyValue(currentPaymentSelection)"
                    v-model="paymentRule"
                    filterable
                    clare
                    @visible-change="findListPaymentRueles"
                  >
                    <el-option
                      v-for="item in listPaymentRules"
                      :key="item.id"
                      :label="item.displayColumn"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.nextSequence')"
                >
                  <el-input-number
                    v-show="!isEmptyValue(paymentRule)"
                    v-model="documentNumberSequence"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-card>
        </div>
        <!-- Right panel -->
        <div class="right-panel-top-panel-labels" style="width: 50%;">
          <el-card shadow="always" style="padding: 10px !important;">
            <!-- Top Panel Labels / E Payment Selection Information -->
            <el-row>
              <el-form
                :inline="true"
                label-position="top"
              >
                <el-col :span="24">
                  <el-form-item
                    label="Banco"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBank }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.bankAccount')"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBankAccount }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.currentBalance')"
                    style="margin-bottom: 0px;"
                  >
                    <b v-show="!isEmptyValue(currentBankAccount)" style="font-size: 18px;"> {{ formatPrice({ value: currentBalance, currency}) }} </b>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <!-- Bottom Panel Button Panel / Form Options -->
            <el-row>
              <el-col :span="24">
                <el-card shadow="never" style="padding: 10px !important;">
                  <div slot="header" class="clearfix" style="text-align: center;">
                    <b> {{ $t('VPayPrint.buttons.labelPanel') }} </b>
                  </div>
                  <div style="text-align: center;padding-top: 20px;">
                    <!-- Process Print Payment -->
                    <el-popover
                      ref="printProcess"
                      :title="'¿' + $t('VPayPrint.message.printMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('printProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('printProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="info"
                        :loading="isLoadPrint"
                        :disabled="(isLoadPrint || isEmptyValue(dataLot) || isEmptyValue(paymentRule))"
                        style="margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadPrint">
                          <i class="el-icon-printer" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.print') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process Export Payment -->
                    <el-popover
                      ref="exportProcess"
                      :title="'¿' + $t('VPayPrint.message.ExportMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('exportProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('exportProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="primary"
                        :loading="isLoadExport"
                        :disabled="(isLoadPrint || isEmptyValue(dataLot) || isEmptyValue(paymentRule))"
                        style="margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadExport">
                          <i class="el-icon-download" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.toExport') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process on Line -->
                    <el-popover
                      ref="processOnLine"
                      :title="'¿' + $t('VPayPrint.message.processMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('processOnLine')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('processOnLine')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="success"
                        :loading="isLoadProcess"
                        :disabled="(isLoadPrint || isEmptyValue(dataLot) || isEmptyValue(paymentRule))"
                        style="margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadProcess">
                          <i class="el-icon-s-tools" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.processOnLine') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
      <!-- Payment List Table -->
      <div>
        <el-table
          :data="dataLot"
          style="width: 100%"
        >
          <el-table-column :label="$t('VPayPrint.headerTable.title')">
            <index-column
              :page-number="dataLot.length"
            />
            <el-table-column
              v-for="(head, key) in headerTable"
              :key="key"
              :prop="head.columnName"
              :label="head.label"
              :align="head.align"
            >
              <template slot-scope="scope">
                <span v-if="head.align === 'right'">
                  {{ formatQuantity({ value: scope.row[head.columnName] }) }}
                </span>
                <span v-else>
                  {{ scope.row[head.columnName] }}
                </span>
                <!-- {{ scope.row[head.columnName] }} -->
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Mode Mobile -->
    <div v-else :style="styleMobile">
      <div style="overflow: auto;">
        <!-- Left Pane Search Filter -->
        <div>
          <el-card shadow="always" style="padding: 10px !important;height: 100%;">
            <el-form
              :inline="true"
              label-position="top"
              class="demo-form-inline"
            >
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.paymentSelection')"
                >
                  <el-select
                    v-model="currentPaymentSelection"
                    filterable
                    @visible-change="findListPaymentSelection"
                    @change="setPaymentSelection"
                  >
                    <el-option
                      v-for="item in listPayment"
                      :key="item.KeyColumn"
                      :label="item.DisplayColumn"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.paymentRule')"
                >
                  <el-select
                    v-show="!isEmptyValue(currentPaymentSelection)"
                    v-model="paymentRule"
                    filterable
                    @visible-change="findListPaymentRueles"
                  >
                    <el-option
                      v-for="(item, key) in listPaymentRules"
                      :key="key"
                      :label="item.displayColumn"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.nextSequence')"
                >
                  <el-input
                    v-show="!isEmptyValue(currentBalance)"
                    v-model="documentNumberSequence"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-card>
        </div>
        <!-- Right panel -->
        <div>
          <el-card shadow="always" style="padding: 10px !important;">
            <!-- Top Panel Labels / E Payment Selection Information -->
            <el-row>
              <el-form
                :inline="true"
                label-position="top"
                class="demo-form-inline"
              >
                <el-col :span="24">
                  <el-form-item
                    label="Banco"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBank }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.bankAccount')"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBankAccount }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.currentBalance')"
                    style="margin-bottom: 0px;"
                  >
                    <b v-show="!isEmptyValue(currentBankAccount)" style="font-size: 18px;"> {{ formatPrice({ value: currentBalance, currency}) }} </b>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <!-- Bottom Panel Button Panel / Form Options -->
            <el-row>
              <el-col :span="24">
                <el-card shadow="never" style="padding: 10px !important;">
                  <div slot="header" class="clearfix" style="text-align: center;">
                    <b> {{ $t('VPayPrint.buttons.labelPanel') }} </b>
                  </div>
                  <div style="padding-top: 20px;text-align: center;float: right;width: 100%;">
                    <!-- Process Print Payment -->
                    <el-popover
                      ref="printProcess"
                      :title="'¿' + $t('VPayPrint.message.printMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('printProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('printProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="info"
                        :loading="isLoadPrint"
                        :disabled="(isLoadPrint || isEmptyValue(dataLot))"
                        style="padding: 10px; margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadPrint">
                          <i class="el-icon-printer" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.print') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process Export Payment -->
                    <el-popover
                      ref="exportProcess"
                      :title="'¿' + $t('VPayPrint.message.ExportMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('exportProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('exportProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="primary"
                        :loading="isLoadExport"
                        :disabled="(isLoadExport || isEmptyValue(dataLot))"
                        style="padding: 10px; margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadExport">
                          <i class="el-icon-download" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.toExport') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process on Line -->
                    <el-popover
                      ref="processOnLine"
                      :title="'¿' + $t('VPayPrint.message.processMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('processOnLine')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('processOnLine')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="success"
                        :loading="isLoadProcess"
                        :disabled="(isLoadProcess || isEmptyValue(dataLot))"
                        style="padding: 10px; margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadProcess">
                          <i class="el-icon-s-tools" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.processOnLine') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
      <!-- Payment List Table -->
      <div>
        <el-table
          :data="dataLot"
          style="width: 100%"
        >
          <el-table-column :label="$t('VPayPrint.headerTable.title')">
            <index-column
              :page-number="dataLot.length"
            />
            <el-table-column
              v-for="(head, key) in headerTable"
              :key="key"
              :prop="head.columnName"
              :label="head.label"
              :align="head.align"
              min-width="120px"
            >
              <template slot-scope="scope">
                <span v-if="head.align === 'right'">
                  {{ formatQuantity({ value: scope.row[head.columnName] }) }}
                </span>
                <span v-else>
                  {{ scope.row[head.columnName] }}
                </span>
                <!-- {{ scope.row[head.columnName] }} -->
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-drawer
      :visible.sync="isShowExportPayment"
      :with-header="true"
      :before-close="handleClose"
      :size="'80%'"
      :show-close="true"
      :title="dataExportPayment.name"
    >
      <file-render
        :format="dataExportPayment.format"
        :content="dataExportPayment.content"
        :name="dataExportPayment.name"
        :mime-type="dataExportPayment.mimeType"
        :stream="dataExportPayment.stream"
        :src="dataExportPayment.src"
        style="height: 90% !important;"
      />

      <el-popover
        ref="confirmToPrint"
        :title="dataExportPayment.message"
        placement="top"
        trigger="click"
      >
        <el-button
          style="float:right;margin-left: 10px;"
          type="primary"
          icon="el-icon-check"
          @click="runFieldRender(dataExportPayment.mimeType)"
        />
        <el-button
          style="float: right;"
          type="danger"
          icon="el-icon-close"
          @click="closeProcess('confirmToPrint')"
        />
        <el-button
          slot="reference"
          type="primary"
          style="float: right;margin-right: 10px;margin-top: 10px;"
          icon="el-icon-check"
        />
      </el-popover>
      <el-button
        type="danger"
        icon="el-icon-close"
        style="float: right;margin-right: 10px;margin-top: 10px;"
        @click="isShowExportPayment = false"
      />
    </el-drawer>
  </el-row>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import FileRender from '@/components/ADempiere/FileRender/index.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import {
  formatQuantity,
  formatPrice
} from '@/utils/ADempiere/formatValue/numberFormat'

// API Request Methods
import {
  // Set
  paymentSelection,
  // List
  paymentSelections,
  paymentRules,
  // Table
  listPaymentTable,
  // Documemnt No Sequence
  documentSequence,
  // Button Panel Processes
  print,
  process,
  confirmPrint,
  exportPayment,
  printRemittance
} from '@/api/ADempiere/form/VPayPrint.js'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'

export default defineComponent({
  name: 'VPayPrint',

  components: {
    IndexColumn,
    FileRender
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props, { root, refs }) {
    /**
     * Const
     *  # headerTable
     *        └──> @param {array} headerTable - Header of the table
     */
    const headerTable = [
      {
        columnName: 'vendor_name',
        label: lang.t('VPayPrint.headerTable.provider'),
        align: 'left'
      },
      {
        columnName: 'document_no',
        label: lang.t('VPayPrint.headerTable.invoice'),
        align: 'left'
      },
      {
        columnName: 'grand_total',
        label: lang.t('VPayPrint.headerTable.grandTotal'),
        align: 'right'
      },
      {
        columnName: 'over_under_amount',
        label: lang.t('VPayPrint.headerTable.subscriber'),
        align: 'right'
      },
      {
        columnName: 'open_amount',
        label: lang.t('VPayPrint.headerTable.pending'),
        align: 'right'
      },
      {
        columnName: 'payment_amount',
        label: lang.t('VPayPrint.headerTable.payable'),
        align: 'right'
      },
      {
        columnName: 'final_balance',
        label: 'Saldo Final',
        align: 'right'
      }
    ]
    /**
     * Refs
     *  # Values Left Pane Search Filter
     *     - Values(currentPaymentSelection, paymentRule, documentNumberSequence)
     *     └──> @param {string} currentPaymentSelection - Selection of Current Payment
     *     └──> @param {string} documentNumberSequence - Document Number Sequence Value
     *     └──> @param {string} paymentRule - Current Payment Rule of the Current Payment Selection
     *     - List Option Select
     *     └──> @param {array} listPaymentRules - List of Payment Rule of the Current Payment Selection
     *     └──> @param {array} listPayment - List of Available Payment Selection
     *  # Values Right Panel
     *     - Top Panel Labels / E Payment Selection Information
     *     └──> @param {string} currentBankAccount - Current Payment Selection Bank Account
     *     └──> @param {string} currentBalance - Current Balance of Current Payment Selection
     *     └──> @param {string} currentBank - Current Bank of Current Payment Selection
     *     └──> @param {string} currency - Current currency of Current Payment Selection
     *     └──> @param {string} currentBankAccountId - Current Bank ID of Current Payment Selection
     *  # Bottom Panel Button Panel / Form Options
     *      - Component Loading Flags Button
     *      └──> @param {boolean} isLoadPrint - Loading the Print Line Process Execution
     *      └──> @param {boolean} isLoadExport - Loading Line Export Process Execution
     *      └──> @param {boolean} isLoadProcess - Loading the Process Execution of the Process Process Process to Process in Line
     *  # Payment List Table
     *      └──> @param {array} dataLot - List Record Lot
     */

    // Values Left Pane Search Filter
    const currentPaymentSelection = ref('')
    const paymentRule = ref('')
    const currentPaymentRule = computed(() => {
      if (isEmptyValue(paymentRule.value)) return ''
      if (isEmptyValue(listPaymentRules.value)) return ''
      const { valueColumn } = listPaymentRules.value.find(value => value.id === paymentRule.value)
      return valueColumn
    })
    const documentNumberSequence = ref(null)

    // List Option Select -> (Left Pane Search Filter)
    const listPaymentRules = ref([])
    const listPayment = ref([])

    // Values Right Panel Info
    const currentBankAccount = ref('')
    const currentBalance = ref('')
    const currentBank = ref('')
    const currency = ref('')
    const currentBankAccountId = ref(0)

    // isLoand Bottom
    const isLoadPrint = ref(false)
    const isLoadExport = ref(false)
    const isLoadProcess = ref(false)

    // Table
    const dataLot = ref([])

    // isModal
    const wantProcessTransfer = ref(false)

    // Refs Popover
    const processOnLine = ref()
    const confirmToPrint = ref()
    const printProcess = ref()
    const exportProcess = ref()

    // Drawer

    const isShowExportPayment = ref(false)
    const dataExportPayment = ref({})

    /**
     * Computed
     *  @param {boolean} isMobile - Detect a mobile device
     *  @param {string} styleMobile - Change the style depending on a device
     */
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })
    const styleMobile = computed(() => {
      if (isMobile.value) return 'overflow: auto;height: 83%;'
      return ''
    })

    const actionMessageProcessOnLine = computed(() => {
      if (isEmptyValue(paymentRule.value)) return ''
      const typeRule = listPaymentRules.value.find(rule => rule.id === paymentRule.value)
      return paymentRuleTranslation(typeRule)
    })

    /**
     * Methods
     */

    // Set Values  (Payment Select and Document No)
    function setPaymentSelection(payment) {
      if (isEmptyValue(payment)) {
        return
      }
      paymentSelection({
        id: payment
      })
        .then(response => {
          listPaymentRules.value = []
          const bankAccount = response.bank_account
          if (isEmptyValue(bankAccount)) {
            showMessage({
              message: 'error',
              type: 'error'
            })
            return
          }
          currentBankAccount.value = bankAccount.account_no
          currentBalance.value = bankAccount.current_balance
          currentBank.value = bankAccount.bank_name
          currentBankAccountId.value = bankAccount.id
          currency.value = response.currency.iso_code
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function setDocument({
      paymentSelectionId,
      paymentRuleId,
      banckAccountId
    }) {
      documentSequence({
        paymentSelectionId,
        paymentRuleId,
        banckAccountId
      })
        .then(response => {
          documentNumberSequence.value = response.document_no
        })
    }

    // List Option Select (List Payment Selection and List Payment Rules)
    function findListPaymentRueles(isfindRules) {
      if (!isfindRules) return
      paymentRules({
        paymentSelectionId: currentPaymentSelection.value
      })
        .then(response => {
          const { records } = response
          listPaymentRules.value = records.map(rulesPay => {
            return {
              ...rulesPay,
              displayColumn: rulesPay.values.DisplayColumn,
              keyColumn: rulesPay.values.KeyColumn,
              valueColumn: rulesPay.values.ValueColumn
            }
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function findListPaymentSelection(isFind) {
      if (!isFind) {
        return
      }
      paymentSelections()
        .then(response => {
          const { records } = response
          listPayment.value = records.map(selectionPay => {
            return {
              ...selectionPay.values,
              id: selectionPay.values.KeyColumn,
              uuid: selectionPay.values.UUID
            }
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    // Find List Record in Table
    function listTable({
      paymentSelectionId,
      paymentRuleId
    }) {
      listPaymentTable({
        paymentSelectionId,
        paymentRuleId
      })
        .then(responseTable => {
          dataLot.value = responseTable.records
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    // Bottom Panel Button Panel / Form Options (Process Payment Selecction And PrintPayment And toExport)
    function processPayment() {
      isLoadProcess.value = true
      process({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: currentPaymentRule.value,
        documentNo: documentNumberSequence.value,
        bankAccountId: currentBankAccountId.value
      })
        .then(response => {
          isLoadProcess.value = false
          wantProcessTransfer.value = false
          showMessage({
            message: 'OK',
            type: 'success'
          })
          listTable({
            paymentSelectionId: currentPaymentSelection.value,
            paymentRuleId: currentPaymentRule.value,
            banckAccountId: currentBankAccountId.value
          })
        })
        .catch(error => {
          isLoadProcess.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function printPayment() {
      isLoadPrint.value = true
      print({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: currentPaymentRule.value,
        documentNo: documentNumberSequence.value,
        bankAccountId: currentBankAccountId.value
      })
        .then(response => {
          const {
            output,
            mime_type,
            output_stream
          } = response.report_output
          let link = {
            href: undefined,
            download: undefined
          }
          link = buildLinkHref({
            name: lang.t('VPayPrint.buttons.print'),
            outputStream: output_stream,
            mimeType: mime_type
          })
          dataExportPayment.value = {
            content: output,
            format: 'pdf',
            mimeType: mime_type,
            name: lang.t('VPayPrint.buttons.print'),
            stream: output_stream,
            src: link.href,
            message: lang.t('VPayPrint.message.printRemittanceMessage')
          }
          isLoadPrint.value = false
          isShowExportPayment.value = true
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          isLoadPrint.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function toExport() {
      isLoadExport.value = true
      exportPayment({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: currentPaymentRule.value,
        documentNo: documentNumberSequence.value,
        bankAccountId: currentBankAccountId.value
      })
        .then(response => {
          const {
            output,
            output_stream
          } = response.report_output
          let link = {
            href: undefined,
            download: undefined
          }
          link = buildLinkHref({
            fileName: lang.t('VPayPrint.buttons.toExport'),
            outputStream: output_stream,
            mimeType: 'text/plain'
          })
          dataExportPayment.value = {
            content: output,
            format: 'txt',
            mimeType: 'text/plain',
            name: lang.t('VPayPrint.buttons.toExport'),
            stream: output_stream,
            src: link.href,
            message: lang.t('VPayPrint.message.confirmPrintMessage')
          }
          isLoadExport.value = false
          isShowExportPayment.value = true
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          isLoadExport.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    // Get Payment Rule Translation

    function paymentRuleTranslation(payment) {
      const { values } = payment
      let message
      switch (values.ValueColumn) {
        case 'P':
          message = lang.t('VPayPrint.message.paymentRule.onCredit')
          break
        case 'S':
          message = lang.t('VPayPrint.message.paymentRule.check')
          break
        case 'T':
          message = lang.t('VPayPrint.message.paymentRule.directDeposit')
          break
        case 'D':
          message = lang.t('VPayPrint.message.paymentRule.directDebit')
          break
        case 'K':
          message = lang.t('VPayPrint.message.paymentRule.creditCard')
          break
      }
      return message
    }

    function checkProcess(namePopover) {
      if (namePopover === 'processOnLine') {
        processPayment()
      } else if (namePopover === 'printProcess') {
        printPayment()
      } else if (namePopover === 'exportProcess') {
        toExport()
      }
      closeProcess(namePopover)
    }

    function closeProcess(namePopover) {
      refs[namePopover].showPopper = false
    }

    function handleClose() {
      isShowExportPayment.value = false
    }

    function sendPrint() {
      confirmPrint({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: currentPaymentRule.value,
        documentNo: documentNumberSequence.value,
        bankAccountId: currentBankAccountId.value
      })
        .then(response => {
          showMessage({
            message: 'OK',
            type: 'success'
          })
          listTable({
            paymentSelectionId: currentPaymentSelection.value,
            paymentRuleId: currentPaymentRule.value,
            banckAccountId: currentBankAccountId.value
          })
        })
        .catch(error => {
          isLoadExport.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function sendPrintRemittance() {
      printRemittance({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: currentPaymentRule.value,
        documentNo: documentNumberSequence.value,
        bankAccountId: currentBankAccountId.value
      })
        .then(response => {
          showMessage({
            message: 'OK',
            type: 'success'
          })
          listTable({
            paymentSelectionId: currentPaymentSelection.value,
            paymentRuleId: currentPaymentRule.value,
            banckAccountId: currentBankAccountId.value
          })
        })
        .catch(error => {
          isLoadExport.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function runFieldRender(mimeType) {
      if (mimeType === 'pdf') return sendPrintRemittance()
      return sendPrint()
    }

    /**
     * Watch
     */
    watch(currentPaymentSelection, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        paymentRule.value = ''
        dataLot.value = []
      }
    })

    watch(paymentRule, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        listTable({
          paymentSelectionId: currentPaymentSelection.value,
          paymentRuleId: currentPaymentRule.value,
          banckAccountId: currentBankAccountId.value
        })
        setDocument({
          paymentSelectionId: currentPaymentSelection.value,
          paymentRuleId: currentPaymentRule.value,
          banckAccountId: currentBankAccountId.value
        })
      }
    })

    watch(isShowExportPayment, (newValue, oldValue) => {
      if (!newValue) {
        dataExportPayment.value = {}
      }
    })

    return {
      // Const
      headerTable,
      // Refs
      currentPaymentSelection,
      listPayment,
      currentBankAccount,
      currentBalance,
      currentBank,
      paymentRule,
      listPaymentRules,
      currentBankAccountId,
      documentNumberSequence,
      currency,
      dataLot,
      // Refs --> flag that will indicate if you are loading the process button. (isLoadPrint, isLoadExport, isLoadProcess)
      isLoadPrint,
      isLoadExport,
      isLoadProcess,
      // Refs --> related to message dialog and behavior. (actionMessageProcessOnLine, processOnLine, printProcess, exportProcess)
      actionMessageProcessOnLine,
      processOnLine,
      confirmToPrint,
      printProcess,
      exportProcess,
      // Drawer
      isShowExportPayment,
      dataExportPayment,
      // Computed
      isMobile,
      styleMobile,
      currentPaymentRule,
      // Methods
      findListPaymentSelection,
      paymentRuleTranslation,
      findListPaymentRueles,
      setPaymentSelection,
      sendPrintRemittance,
      processPayment,
      formatQuantity,
      runFieldRender,
      printPayment,
      checkProcess,
      closeProcess,
      setDocument,
      formatPrice,
      handleClose,
      listTable,
      sendPrint,
      toExport
    }
  }
})
</script>

<style lang="scss">
.panel-left-search-filter {
  .el-form--label-top .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0px;
  }
}
.right-panel-top-panel-labels {
  .el-form--label-top .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0px;
  }
}
.el-input-number {
  .el-input {
    .el-input__inner {
      text-align-last: end !important;
    }
  }
}
</style>
