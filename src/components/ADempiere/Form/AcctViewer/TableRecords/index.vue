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
  <div style="padding: 10px;height: -webkit-fill-available;">

    <el-table
      v-loading="isLoadingDataTable"
      :data="tableData"
      :element-loading-text="$t('notifications.loading')"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      border
      style="height: 98%;"
    >
      <index-column
        :page-number="1"
      />

      <el-table-column
        :label="$t('form.accountingViewer.organization')"
        :min-width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.DisplayColumn_AD_Org_ID }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.account')"
        :min-width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.DisplayColumn_Account_ID }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.accountedDebit')"
        :min-width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.AmtAcctDr }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.accountedCredit')"
        :min-width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.AmtSourceCr }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.accountDate')"
        :min-width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.DateAcct }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.period')"
        :min-width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.DisplayColumn_C_Period_ID }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.postingType')"
        :min-width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.DisplayColumn_PostingType }}
        </template>
      </el-table-column>

      <!-- <el-table-column
        v-for="(head, key) in headerAccounting"
        :key="key"
        :label="head.label"
        :align="head.align"
        :min-width="head.width"
        header-align="center"
      >
        <template slot-scope="scope">
          {{ scope.row[head.columnName] }}
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  setup() {
    const isLoadingDataTable = computed(() => {
      return store.getters.getIsLoadingAccoutingRecords
    })

    const tableData = computed(() => {
      return store.getters.getAccoutingRecordsList
    })

    return {
      isLoadingDataTable,
      tableData
    }
  }
})
</script>

<style lang="scss">
// used in cell type number
.cell-align-right {
  text-align: right !important;
  width: 100%;
  display: inline-block;
}
</style>
