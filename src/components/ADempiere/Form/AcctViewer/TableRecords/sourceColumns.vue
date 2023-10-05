<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <span style="display: contents">
    <el-table-column
      :label="$t('form.accountingViewer.transactionDate')"
      :min-width="110"
    >
      <template slot-scope="scope">
        {{ scope.row.DateTrx }}
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('form.accountingViewer.currency')"
      :min-width="110"
    >
      <template slot-scope="scope">
        {{ scope.row.DisplayColumn_C_Currency_ID }}
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('form.accountingViewer.sourceDebit')"
      :min-width="110"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ scope.row.AmtSourceDr }}
      </span>
    </el-table-column>
    <el-table-column
      :label="$t('form.accountingViewer.sourceCredit')"
      :min-width="110"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ scope.row.AmtSourceCr }}
      </span>
    </el-table-column>
    <el-table-column
      :label="$t('form.accountingViewer.rate')"
      :min-width="110"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ scope.row.Rate }}
      </span>
    </el-table-column>
  </span>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'sourceColumns'
})
</script>
