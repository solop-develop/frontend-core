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
  <el-card class="el-current-payments" style="padding: 0px 10px;">
    <div slot="header" class="clearfix" style="text-align: center;">
      <b>
        {{ $t('form.VBankStatementMatch.systemPayments.title') }}
        {{ '(' + $t('form.VBankStatementMatch.systemPayments.table.total') + ': ' + recorsList.length + ')' }}
      </b>
    </div>

    <el-table
      v-loading="isLoading"
      :data="recorsList"
      :border="true"
      max-height="95%"
      :row-class-name="tableRowClassName"
      :cell-class-name="cellRow"
      style="width: 100%;"
    >
      <index-column
        :page-number="1"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.match')"
        min-width="109"
      >
        <p slot-scope="scope" style="text-align: center;margin: 0px;">
          <i
            v-if="displayMatch(scope.row)"
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
        :label="$t('form.VBankStatementMatch.systemPayments.table.date')"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ formatDate({ value: scope.row.transaction_date, isDate: true }) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.receipt')"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ convertBooleanToTranslationLang(scope.row.is_receipt) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.documentNo')"
        prop="document_no"
        min-width="130"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.businessPartner')"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.business_partner.value }}
          {{ isEmptyValue(scope.row.business_partner.value) ? '': ' - ' }}
          {{ scope.row.business_partner.name }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.tenderType')"
        prop="tender_type.name"
        min-width="150"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.currency')"
        prop="currency.iso_code"
        min-width="100"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.amount')"
        min-width="150"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.amount, currency: scope.row.currency.iso_code }) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.systemPayments.table.description')"
        prop="description"
        min-width="120"
      />
    </el-table>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'CurrentPayments',

  components: {
    IndexColumn
  },

  setup() {
    const isLoading = ref(false)

    const recorsList = computed(() => {
      return store.getters.getPayments
    })

    const listMatch = computed(() => {
      const { list } = store.getters.getListMatchingMovements
      return list
    })

    function handleSelectPayment(row) {
      if (isEmptyValue(row)) return
      row.isSelection = !row.isSelection

      store.commit('updateAttributeCriteria', {
        attribute: 'select',
        criteria: 'paymentList',
        value: row
      })
    }

    function refreshSearch() {
      isLoading.value = true
      store.dispatch('getPaymentsListFromServer', {})
        .finally(() => {
          isLoading.value = false
        })
    }

    function tableRowClassName({
      row,
      rowIndex
    }) {
      const { select } = store.getters.getListMatchingMovements
      if (
        !isEmptyValue(select) &&
        !isEmptyValue(row) &&
        row.id === select.payment_id
      ) {
        return 'success-payment'
      }
      return ''
    }

    function displayMatch(row) {
      const { list } = store.getters.getListMatchingMovements
      if (isEmptyValue(list)) return false
      const isMatch = list.find(list => list.payment_id === row.id)
      return !isEmptyValue(isMatch)
    }

    function cellRow({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      return 'cell-column-invoce'
    }

    onMounted(() => {
      if (isEmptyValue(recorsList.value)) {
        refreshSearch()
      }
    })

    return {
      isLoading,
      recorsList,
      listMatch,
      // Methods
      cellRow,
      formatDate,
      formatPrice,
      displayMatch,
      refreshSearch,
      tableRowClassName,
      handleSelectPayment,
      convertBooleanToTranslationLang
    }
  }
})
</script>
<style lang="scss">
.el-table .success-payment {
  background: #d9ecff;
}
.el-table .not-match {
  background: #fadbe9b0;
}
.el-table .cell-column-invoce {
  padding: 0px !important;
}
.el-current-payments {
  height: 100% !important;
  .el-card {
    height: 100% !important;
    .el-card__header {
      padding: 18px 20px;
      border-bottom: 1px solid #e6ebf5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding-bottom: 5px;
    }
  }
}
.el-current-payments .el-card__body {
  height: 90% !important;
  padding: 30px 10px;
  padding-top: 10px;
}
</style>
