<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-row :gutter="24">
    <el-col :span="24">
      <el-table
        v-loading="isLoadingRecords"
        :data="tableData"
        stripe
        height="530"
        highlight-current-row
        border
        @row-click="handleRowClick"
      >
        <index-column
          :page-number="1"
        />

        <el-table-column
          v-for="(head, key) in heardList"
          :key="key"
          :label="head.label"
          :align="head.align"
          :width="isMobile ? '180px' : head.size"
          header-align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isEditRow && (head.columnName === 'name')">
              <el-input ref="namePanelEdit" v-model="scope.row[head.columnName]" :autofocus="true" type="text" />
            </span>
            <span v-else-if="scope.row.isEditRow && (head.columnName === 'description')">
              <el-input v-model="scope.row[head.columnName]" :autofocus="true" type="text" />
            </span>
            <span v-else>
              {{ scope.row[head.columnName] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-col :span="24">
      <el-row :gutter="0" class="list-footer">
        <el-col :span="23">
          <custom-pagination
            :total="recordCount"
            :records-page="tableData.length"
            :handle-change-page="setPage"
          />
        </el-col>

        <el-col :span="1">
          <samp style="float: right; padding-top: 4px;">
            <el-button
              :loading="isLoadingRecords"
              type="success"
              class="button-base-icon"
              icon="el-icon-refresh-right"
              size="small"
              @click="listResource();"
            />
          </samp>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import store from '@/store'

// Componets and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// API Request Methods
import {
  requestListTimeRecord
} from '@/api/ADempiere/form/timeRecord.js'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import heardList from './headerTable'

// Utils and Helper Methods
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'TimeRecord',

  components: {
    CustomPagination,
    IndexColumn
  },

  setup() {
    /**
     * Ref
     * @param {array} tableData - Records to be shown in the Template table
     */
    const tableData = ref([])

    const isLoadingRecords = ref(false)
    // Pagination
    const recordCount = ref(0)
    const pageNumber = ref(0)
    const currentResource = ref({})

    /**
     * Computed
     * isMobile - Detect a mobile device
     */
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    function listResource(pageNumber) {
      const pageToken = generatePageToken({
        pageNumber
      })

      isLoadingRecords.value = true
      requestListTimeRecord({
        pageToken
      })
        .then(response => {
          recordCount.value = response.recordCount
          const { records } = response
          const recordsList = records.map(row => {
            return {
              ...row,
              resourceNameType: row.resource.resource_type.name,
              dateFrom: dateTimeFormats(row.assign_date_from, 'YYYY-MM-DD'),
              isConfirmed: row.is_confirmed,
              ...ROW_ATTRIBUTES
            }
          })
          tableData.value = recordsList
          isLoadingRecords.value = false
        }).catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          isLoadingRecords.value = false
          console.warn(`requestListTimeRecord: List Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }

    function handleRowClick(row) {
      currentResource.value = row
    }

    // Get Record Control Table
    function setPage(pageNumber) {
      listResource(pageNumber)
    }

    listResource()

    return {
      // Ref
      tableData,
      isLoadingRecords,
      recordCount,
      pageNumber,
      currentResource,
      // Computeds
      isMobile,
      // Css - Computeds
      // import
      heardList,
      // Methods
      listResource,
      setPage,
      handleRowClick
    }
  }
})
</script>

<style lang="scss">
.el-card__body {
  padding-right: 20px !important;
  padding-left: 20px !important;
}

.form-time-control {
  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
