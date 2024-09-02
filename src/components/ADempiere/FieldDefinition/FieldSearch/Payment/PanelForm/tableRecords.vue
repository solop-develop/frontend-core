<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <div>
    <el-table
      ref="tableRecords"
      v-loading="isLoadingRecords"
      class="payments-table"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
      :max-height="300"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changePayment"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('field.payment.emptyRecords') }}
      </p>

      <index-column />

      <el-table-column
        prop="bank_account"
        :label="$t('field.payment.bankAccount')"
        header-align="center"
        width="200"
      />
      <el-table-column
        prop="business_partner"
        :label="$t('field.payment.businessPartner')"
        header-align="center"
        width="200"
      />
      <el-table-column
        prop="date_payment"
        :label="$t('field.payment.transactionDate')"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-center">
          {{ formatDate({ value: scope.row.date_payment }) }}
        </span>
      </el-table-column>
      <el-table-column
        prop="document_no"
        :label="$t('field.payment.documentNo')"
        header-align="center"
        width="170"
      />

      <el-table-column
        prop="is_receipt"
        :label="$t('field.payment.receivable')"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_receipt) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="currency"
        :label="$t('field.payment.currency')"
        header-align="center"
        width="110"
      />

      <el-table-column
        :label="$t('field.payment.totalPayment')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.pay_amt }) }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('field.payment.converted')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.converted_amount }) }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('field.payment.totalDiscount')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.discount_amt }) }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('field.payment.totalAdjustment')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.writeOff_amt }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="is_allocated"
        :label="$t('field.payment.assigned')"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_allocated) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="document_status"
        :label="$t('field.payment.documentStatus')"
        header-align="center"
        width="220"
      />

    </el-table>
  </div>
</template>

<script>
import {
  defineComponent, computed, nextTick, onMounted, ref, watch
} from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  PAYMENT_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/payment'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import usePayment from './usePayment'

// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: PAYMENT_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  setup(props) {
    const tableRecords = ref(null)

    const {
      currentRow,
      isLoadingRecords,
      closeList,
      setValues
    } = usePayment({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const recordsList = computed(() => {
      return store.getters.getPaymentRecordsList({
        containerUuid: props.uuidForm
      })
    })

    function handleCurrentChange(recordRow) {
      currentRow.value = recordRow
    }

    function changePayment() {
      const recordRow = currentRow.value
      if (!isEmptyValue(recordRow)) {
        setValues(recordRow)
        closeList()
      }
    }

    watch(currentRow, (newValue, oldValue) => {
      if (tableRecords.value) {
        tableRecords.value.setCurrentRow(
          newValue
        )
      }
    })

    onMounted(() => {
      nextTick(() => {
        if (tableRecords.value) {
          tableRecords.value.setCurrentRow(
            currentRow.value
          )
        }
      })
    })

    return {
      tableRecords,
      //
      currentRow,
      isLoadingRecords,
      recordsList,
      //
      handleCurrentChange,
      changePayment,
      formatDate,
      formatQuantity,
      convertBooleanToTranslationLang
    }
  }
})
</script>

<style lang="scss">
.payments-table {
  &.el-table {
    .el-table__body {
      .el-table__row {
        .el-table__cell {
          padding-top: 5px;
          padding-bottom: 3px;
          .cell {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            line-height: 15px;
            padding-left: 10px;
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>
