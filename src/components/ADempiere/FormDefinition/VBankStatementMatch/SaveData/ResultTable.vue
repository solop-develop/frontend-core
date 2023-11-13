<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <el-card style="height: 100% !important;padding: 0px 10px;">
    <div slot="header" class="clearfix" style="text-align: center;">
      <b>
        {{ $t('form.VBankStatementMatch.result') }}
        {{ '(' + $t('form.VBankStatementMatch.bankMovements.table.total') + ': ' + recordResult.length + ')' }}
      </b>
    </div>
    <el-table
      :data="recordResult"
      :border="true"
      highlight-current-row
      :cell-class-name="cellRow"
    >
      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.match')"
        min-width="109"
      >
        <p slot-scope="scope" style="text-align: center;margin: 0px;">
          <i
            v-if="!isEmptyValue(scope.row.payment_id) && scope.row.payment_id !== 0"
            class="el-icon-check"
            style="
              font-size: 22px;
              font-weight: 900;
              color: green;
            "
          />
          <i
            v-else
            class="el-icon-close"
            style="
              font-size: 22px;
              font-weight: 900;
              color: red;
            "
          />
        </p>
      </el-table-column>
      <el-table-column
        :label="$t('form.VBankStatementMatch.automaticMatch.table.currency')"
        :align="'left'"
        min-width="100"
      >
        <template slot-scope="scope">
          {{ displayDataColumn(scope.row, 'currency') }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.VBankStatementMatch.automaticMatch.table.transactionDate')"
        :align="'left'"
        prop="transactionDate"
        min-width="190"
      />
      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.title')"
        :align="'center'"
      >
        <el-table-column
          :label="$t('form.VBankStatementMatch.automaticMatch.table.referenceNo')"
          min-width="140"
        >
          <template slot-scope="scope">
            {{ displayDataColumn(scope.row, 'referenceNo') }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('form.VBankStatementMatch.automaticMatch.table.amount')"
          prop="amount"
          :align="'right'"
          min-width="120"
        >
          <template slot-scope="scope">
            {{ displayDataColumn(scope.row, 'amount') }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.title')"
        :align="'center'"
      >
        <el-table-column
          :label="$t('form.VBankStatementMatch.automaticMatch.table.documentNo')"
          min-width="140"
        >
          <template slot-scope="scope">
            {{ displayDataColumn(scope.row, 'documentNo') }}
          </template>
        </el-table-column>
        <el-table-column
          label="Monto del Pago"
          :align="'right'"
          min-width="150"
        >
          <template slot-scope="scope">
            {{ displayDataColumn(scope.row, 'payment_amount') }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('form.VBankStatementMatch.automaticMatch.table.businessPartner')"
          min-width="180"
        >
          <template slot-scope="scope">
            {{ displayDataColumn(scope.row, 'businessPartner') }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('form.VBankStatementMatch.automaticMatch.table.tenderType')"
          min-width="150"
        >
          <template slot-scope="scope">
            {{ displayDataColumn(scope.row, 'tenderType') }}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- </el-table-column> -->
    </el-table>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'ResultTable',

  setup() {
    const headerTable = ref([
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.currency'),
        columnName: 'currency',
        align: 'left',
        width: '100'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.transactionDate'),
        columnName: 'transactionDate',
        align: 'left',
        width: '180'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.receipt'),
        columnName: 'receipt',
        align: 'left',
        width: '100'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.documentNo'),
        columnName: 'documentNo',
        align: 'left',
        width: '150'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.businessPartner'),
        columnName: 'businessPartner',
        align: 'left',
        width: '180'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.tenderType'),
        columnName: 'tenderType',
        align: 'left',
        width: '150'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.amount'),
        columnName: 'amount',
        align: 'right',
        width: '120'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.description'),
        columnName: 'description',
        align: 'left',
        width: '120'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.referenceNo'),
        columnName: 'referenceNo',
        align: 'left',
        width: '150'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.memo'),
        columnName: 'memo',
        align: 'left',
        width: '100'
      }
    ])

    const recordResult = computed(() => {
      const { list } = store.getters.getResult
      return list
    })

    function cellRow({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      return 'cell-column-invoce'
    }

    function displayDataColumn(data, column) {
      let display
      switch (column) {
        case 'businessPartner':
          display = data.business_partner.name
          break
        case 'tenderType':
          display = isEmptyValue(data.tender_type) ? '' : data.tender_type.name
          break
        case 'currency':
          display = data.currency.iso_code
          break
        case 'receipt':
          display = convertBooleanToTranslationLang(data.is_receipt)
          break
        case 'documentNo':
          display = data.document_no
          break
        case 'referenceNo':
          display = data.reference_no
          break
        case 'amount':
          display = formatPrice({
            value: data.amount,
            currency: data.currency.iso_code
          })
          break
        case 'payment_amount':
          display = formatPrice({
            value: data.payment_amount,
            currency: data.currency.iso_code
          })
          break
        default:
          display = data[column]
          break
      }
      return display
    }

    return {
      // Ref
      headerTable,
      // Computed
      recordResult,
      // Methods
      displayDataColumn,
      cellRow
    }
  }
})
</script>

<style lang="scss">
.el-table .cell-column-invoce {
  padding: 0px !important;
}
.el-table thead.is-group th.el-table__cell {
  padding: 3px 0px;
}
</style>
