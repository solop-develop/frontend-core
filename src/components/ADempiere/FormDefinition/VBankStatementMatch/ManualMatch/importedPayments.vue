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
        {{ $t('form.VBankStatementMatch.bankMovements.title') }}
        {{ '(' + $t('form.VBankStatementMatch.bankMovements.table.total') + ': ' + recorsList.length + ')' }}
      </b>
    </div>

    <el-table
      v-loading="isLoading"
      :data="recorsList"
      class="table-import"
      max-height="95%"
      :border="true"
      :row-class-name="tableRowClassName"
      :cell-class-name="cellRow"
      style="width: 100%;"
    >
      <index-column
        :page-number="1"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.match')"
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
          <!-- {{ displayMatch(scope.row) }} -->
        </p>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.date')"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.transactionDate }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.receipt')"
        min-width="110"
      >
        <template slot-scope="scope">
          {{ convertBooleanToTranslationLang(scope.row.is_receipt) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.referenceNo')"
        prop="reference_no"
        min-width="140"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.businessPartner')"
        min-width="145"
      >
        <template slot-scope="scope">
          {{ scope.row.business_partner.value }}
          {{ isEmptyValue(scope.row.business_partner.value) ? '': ' - ' }}
          {{ scope.row.business_partner.name }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.currency')"
        prop="currency.iso_code"
        min-width="80"
      />

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.amount')"
        min-width="110"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.amount, currency: scope.row.currency.iso_code }) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.VBankStatementMatch.bankMovements.table.memo')"
        prop="memo"
        width="100"
      />
    </el-table>
  </el-card>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'ImportedPayments',

  components: {
    IndexColumn
  },

  setup() {
    const isLoading = ref(false)

    const recorsList = computed(() => {
      return store.getters.getImportedPayments
    })

    function refreshSearch() {
      isLoading.value = true
      store.dispatch('getImportedBankMovementsListFromServer', {})
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
        row.id === select.id
      ) {
        return 'success-row'
      }
      return ''
    }

    function displayMatch(row) {
      const { list } = store.getters.getListMatchingMovements
      if (isEmptyValue(list)) return false
      const isMatch = list.find(list => list.id === row.id)
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
      //
      recorsList,
      //
      cellRow,
      formatDate,
      formatPrice,
      displayMatch,
      refreshSearch,
      tableRowClassName,
      convertBooleanToTranslationLang
    }
  }
})
</script>

<style lang="scss">
.el-table .success-row {
  background: #d9ecff;
}
.el-table .not-match {
  background: #f8cee1;
}
.el-table .cell-column-invoce {
  padding: 0px !important;
}
</style>
