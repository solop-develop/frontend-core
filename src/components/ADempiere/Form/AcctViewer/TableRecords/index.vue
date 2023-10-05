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
    <filter-columns />

    <el-table
      v-loading="isLoadingDataTable"
      :data="tableData"
      :element-loading-text="$t('notifications.loading')"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      border
      style="height: 70%;"
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
        :min-width="140"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.AmtAcctDr }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.accountedCredit')"
        :min-width="140"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.AmtSourceCr }}
        </span>
      </el-table-column>

      <!-- <source-columns v-if="isShowSourceColumns" /> -->
      <template v-if="isShowSourceColumns">
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
          :min-width="130"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ scope.row.AmtSourceDr }}
          </span>
        </el-table-column>
        <el-table-column
          :label="$t('form.accountingViewer.sourceCredit')"
          :min-width="130"
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
      </template>

      <!-- <accouting-element-columns /> -->
      <el-table-column
        v-for="(acctElement, key) in avaliableAccountingElements"
        :key="key"
        :label="acctElement.name || acctElement.elementType"
        :min-width="140"
        header-align="center"
      >
        <template slot-scope="scope">
          {{ scope.row[DISPLAY_COLUMN_PREFIX + acctElement.columnName] }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.accountDate')"
        :min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.DateAcct }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('form.accountingViewer.period')"
        :min-width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.DisplayColumn_C_Period_ID }}
        </template>
      </el-table-column>

      <!-- <quantity-columns v-if="isShowQuantityColumns" /> -->
      <template v-if="isShowQuantityColumns">
        <el-table-column
          :label="$t('form.accountingViewer.uom')"
          :min-width="80"
        >
          <span slot-scope="scope">
            {{ scope.row.DisplayColumn_C_UOM_ID }}
          </span>
        </el-table-column>
        <el-table-column
          :label="$t('form.accountingViewer.quantity')"
          :min-width="85"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ scope.row.Qty }}
          </span>
        </el-table-column>
      </template>

      <template v-if="isShowDocumentColumns">
        <el-table-column
          :label="$t('form.accountingViewer.tableRecord')"
          :min-width="210"
        >
          <span slot-scope="scope">
            {{ scope.row.DisplayColumn_AD_Table_ID }}
          </span>
        </el-table-column>
        <el-table-column
          :label="$t('form.accountingViewer.recordId')"
          :min-width="90"
        >
          <span slot-scope="scope">
            {{ scope.row.Record_ID }}
          </span>
        </el-table-column>
        <el-table-column
          :label="$t('form.accountingViewer.description')"
          :min-width="310"
        >
          <span slot-scope="scope">
            {{ scope.row.Description }}
          </span>
        </el-table-column>
      </template>

      <el-table-column
        :label="$t('form.accountingViewer.postingType')"
        :min-width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.DisplayColumn_PostingType }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Components and Mixins
// import AccountElementColumns from './accountElementColumns.vue'
import FilterColumns from './filterColumns.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
// import SourceColumns from './sourceColumns.vue'
// import QuantityColumns from './quantityColumns.vue'

// Utils and Helper Methods
import { getAvaliableAccountingElements } from '@/utils/ADempiere/accoutingUtils'

export default defineComponent({
  name: 'TableRecords',

  components: {
    // AccountElementColumns,
    FilterColumns,
    IndexColumn
    // SourceColumns,
    // QuantityColumns
  },

  setup() {
    const isShowDocumentColumns = computed(() => {
      return store.getters.getIsDisplayDocumentInfo
    })

    const isShowSourceColumns = computed(() => {
      return store.getters.getIsDisplaySourceInfo
    })

    const isShowQuantityColumns = computed(() => {
      return store.getters.getIsDisplayQuantity
    })

    const isLoadingDataTable = computed(() => {
      return store.getters.getIsLoadingAccoutingRecords
    })

    const tableData = computed(() => {
      return store.getters.getAccoutingRecordsList
    })

    const avaliableAccountingElements = getAvaliableAccountingElements()

    return {
      avaliableAccountingElements,
      DISPLAY_COLUMN_PREFIX,
      // Refs
      isShowDocumentColumns,
      isShowSourceColumns,
      isShowQuantityColumns,
      // Computeds
      isLoadingDataTable,
      tableData
    }
  }
})
</script>
