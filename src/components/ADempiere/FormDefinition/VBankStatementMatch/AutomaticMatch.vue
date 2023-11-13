<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <el-card class="el-current-payments" style="padding: 0px 10px;">
    <div slot="header" class="clearfix" style="text-align: center;">
      <b>
        {{ $t('form.VBankStatementMatch.systemPayments.table.match') }}
        {{ '(' + $t('form.pos.order.total') + ': ' + matchingMovements.list.length + ')' }}
      </b>
    </div>
    <el-table
      v-loading="matchingMovements.isLoading"
      :data="matchingMovements.list"
      :empty-text="$t('form.VBankStatementMatch.automaticMatch.withoutAutomaticMatch')"
      :border="true"
      max-height="95%"
      :element-loading-text="$t('notifications.loading') + '...'"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      highlight-current-row
      :cell-class-name="cellRow"
      style="width: 100%"
      @row-click="selectMatchingMovements"
      @selection-change="selectMatch"
    >
      <p slot="empty" style="width: 100%;">
        <el-empty :description="$t('form.VBankStatementMatch.automaticMatch.withoutAutomaticMatch')" />
      </p>

      <el-table-column
        type="selection"
        width="39"
      />
      <index-column
        :page-number="1"
      />

      <el-table-column
        label="Automatico"
        width="99"
      >
        <p slot-scope="scope" style="text-align: center;margin: 0px;">
          <i
            v-if="scope.row.is_automatic"
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
        v-for="(fieldAttributes, key) in headerTable"
        :key="key"
        :column-key="fieldAttributes.columnName"
        :prop="fieldAttributes.columnName"
        :label="fieldAttributes.label"
        :min-width="fieldAttributes.width"
        :align="fieldAttributes.align"
      >
        <template slot-scope="scope">
          {{ displayDataColumn(scope.row, fieldAttributes.columnName) }}
        </template>
      </el-table-column>
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

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'AutomaticMatch',

  components: {
    IndexColumn
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: true
    }
  },

  setup() {
    /**
    * Refs
    */
    const matchingMovements = computed(() => {
      return store.getters.getListMatchingMovements
    })

    const headerTable = ref([
      {
        label: lang.t('form.VBankStatementMatch.systemPayments.table.date'),
        columnName: 'transactionDate',
        align: 'left',
        width: '110'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.receipt'),
        columnName: 'receipt',
        align: 'left',
        width: '70'
      },
      {
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.documentNo'),
        columnName: 'documentNo',
        align: 'left',
        width: '130'
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
        label: lang.t('form.VBankStatementMatch.automaticMatch.table.currency'),
        columnName: 'currency',
        align: 'left',
        width: '100'
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
        width: '150'
      }
    ])

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
          display = isEmptyValue(data.currency) ? '' : data.currency.iso_code
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
            currency: isEmptyValue(data.currency) ? '' : data.currency.iso_code
          })
          break
        default:
          display = data[column]
          break
      }
      return display
    }

    function selectMatchingMovements(row, column, event) {
      store.commit('updateAttributeCriteria', {
        criteria: 'matchingMovements',
        attribute: 'select',
        value: row
      })
    }

    function selectMatch(selection) {
      store.commit('updateAttributeCriteria', {
        criteria: 'matchingMovements',
        attribute: 'listUnMatch',
        value: selection
      })
    }

    function cellRow({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      return 'cell-column-invoce'
    }

    return {
      headerTable,
      matchingMovements,
      cellRow,
      selectMatch,
      displayDataColumn,
      selectMatchingMovements
    }
  }
})
</script>

<style lang="scss">
.form-item-criteria {
  margin-top: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
  margin-right: 0px;
  padding-bottom: 0px;
  .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin: 0px;
  }
}
.el-table {
  height: 100% !important;
  .el-table--border {
    border-right: none;
    border-bottom: none;
    height: 100% !important;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    height: 100% !important;
  }
  .el-table__body-wrapper {
    height: 85% !important;
  }
}
.el-table .cell-column-invoce {
  padding: 15px !important;
  margin: 5px !important;
}
</style>
