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
  <div>
    <el-card>
      <reportSearchCriteria
        :container-uuid="reportOutput.containerUuid"
        :report-output="reportOutput"
      />
      <el-dialog
        v-shortkey="shortsKey"
        :visible.sync="showDialog"
        :title="$t('report.reportEnginer.optionsImport.title')"
        @shortkey.native="keyAction"
        @close="viewShowDialog"
      >
        <dialogShareReport
          :report-output="reportOutput"
          :container-uuid="containerUuid"
        />
      </el-dialog>
      <el-table
        ref="tableReportEngine"
        v-loading="isLoadingReport"
        :data="dataList"
        row-key="level"
        style="width: 100%"
        lazy
        :row-class-name="tableRowClassName"
        :default-expand-all="false"
        :tree-props="{ children: 'children' }"
        height="calc(100vh - 265px)"
        border
        :cell-style="{ padding: '0', height: '30px', border: 'none' }"
        :cell-class-name="getRowClassName"
        @row-click="handleRowClick"
        @cell-contextmenu="activatePopover"
      >
        <el-table-column
          v-for="(fieldAttributes, key) in columns"
          :key="key"
          :column-key="fieldAttributes.code"
          :align="getAlignment(fieldAttributes.display_type)"
          :width="widthColumn(fieldAttributes.display_type)"
          :fixed="fieldAttributes.is_group_column"
        >
          <template slot="header">
            {{ fieldAttributes.title }}
          </template>
          <template slot-scope="scope">
            <span :style="getCellStyle(fieldAttributes.code, scope.row)">
              {{ displayLabel(fieldAttributes.code, scope.row) }}
              <el-popover
                v-if="selectedRow === scope.row && selectedColumn === fieldAttributes.code"
                v-model="showPopover"
                placement="top"
                class="reportInfo"
              >
                <InfoReport
                  :data="dataModal"
                />
              </el-popover>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total-records="recordData.record_count"
        :page-size="currentPageSize"
        :page-number="currentPageNumber"
        :handle-change-page-size="handleChangeSizePage"
        :handle-change-page-number="handleChangePage"
      />
    </el-card>
  </div>
</template>
<script>
import store from '@/store'
import { defineComponent, computed, ref, watch, nextTick, onMounted } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import { isNumberField, isDateField, isBooleanField, isDecimalField } from '@/utils/ADempiere/references'
import InfoReport from './infoReport'
import dialogShareReport from './dialog'
import reportSearchCriteria from './searchCriteria'
export default defineComponent({
  name: 'reportPanel',
  components: {
    CustomPagination,
    InfoReport,
    dialogShareReport,
    reportSearchCriteria
  },
  props: {
    containerManager: {
      type: Object,
      default: () => []
    },
    instanceUuid: {
      type: Number,
      default: 0
    },
    containerUuid: {
      type: String,
      required: true
    },
    reportOutput: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const dataModal = ref({})
    const showPopover = ref(false)
    const selectedRow = ref(undefined)
    const selectedColumn = ref(undefined)
    const tableReportEngine = ref(undefined)
    const shortsKey = computed(() => {
      return {
        close: ['esc']
      }
    })
    function keyAction(event) {
      switch (event.srcKey) {
        case 'close':
          viewShowDialog()
      }
    }
    const data = computed(() => {
      const { rowCells } = props.reportOutput
      if (isEmptyValue(rowCells)) return []
      return rowCells
    })
    const columns = computed(() => {
      const { columns } = props.reportOutput
      if (isEmptyValue(columns)) return []
      return columns
    })
    function handleRowClick(row) {
      if (row.children && row.children.length > 0) {
        tableReportEngine.value.toggleRowExpansion(row)
        showPopover.value = false
      }
    }
    function activatePopover(row, column) {
      event.preventDefault()
      dataList.value.forEach(data => {
        Object.values(data.cells).forEach(dataCell => {
          if (dataCell && 'sum_value' in dataCell) {
            selectedColumn.value = column.columnKey
            selectedRow.value = row
            dataModal.value = dataCell
            showPopover.value = true
          }
        })
      })
    }
    function displayLabel(prop, row) {
      if (isEmptyValue(row.cells)) {
        return
      }
      const { display_value, value } = row.cells[prop]
      if (!isEmptyValue(display_value)) {
        return display_value
      }
      if (!isEmptyValue(value)) {
        return value
      }
    }
    function getAlignment(displayType) {
      if (isNumberField(displayType)) {
        return 'right'
      }
      return 'left'
    }
    const dataList = computed(() => {
      return data.value.map((row, rowIndex) => {
        const index = rowIndex + 1
        const newRow = {
          ...row,
          children: hasChildren(row.children, index.toString()),
          level: index
        }
        return newRow
      })
    })
    const recordData = computed(() => {
      return store.getters.getReportOutput(props.instanceUuid)
    })
    const currentPageSize = computed(() => {
      return parseInt(recordData.value.record_count, 10)
    })
    const currentPageNumber = computed(() => {
      return parseInt(recordData.value.next_page_token, 10)
    })

    function hasChildren(children, parentLevel) {
      if (children.length < 1) return children
      return children.map((child, indexChild) => {
        const index = parentLevel + indexChild
        return {
          ...child,
          children: hasChildren(child.children, index.toString()),
          level: index
        }
      })
    }
    function viewShowDialog() {
      store.commit('setShowDialog', false)
    }
    const showDialog = computed(() => {
      return store.getters.getReportShowDialog
    })
    const reportDefinition = store.getters.getStoredReport(props.reportOutput.containerUuid)
    function handleChangeSizePage(pageSize) {
      props.containerManager.setPageSize({
        instanceUuid: props.reportOutput.instance_id,
        containerUuid: props.reportOutput.containerUuid,
        pageNumber: currentPageNumber.value,
        pageSize,
        parametersList: reportDefinition,
        reportId: reportDefinition.id,
        printFormatId: props.reportOutput.print_format_id,
        reportViewId: props.reportOutput.report_view_id
      })
      getFields()
    }
    function handleChangePage(pageNumber) {
      props.containerManager.setPageNumber({
        instanceUuid: props.reportOutput.instance_id,
        containerUuid: props.reportOutput.containerUuid,
        pageNumber,
        pageSize: currentPageSize.value,
        parametersList: reportDefinition,
        reportId: reportDefinition.id,
        printFormatId: props.reportOutput.print_format_id,
        reportViewId: props.reportOutput.report_view_id
      })
      getFields()
    }

    function exportFile() {
      store.dispatch('exportReport', {
        reportId: props.reportOutput.id,
        reportName: props.reportOutput.name
      })
    }
    function tableRowClassName({ row, rowIndex }) {
      const { children } = row
      if (!isEmptyValue(children)) {
        return 'success-row'
      }
      return ''
    }
    function getRowClassName({ row, rowIndex }) {
      const parent = this.findParent(row)
      if (parent && parent.children[parent.children.length - 1] === row) {
        return 'last-child-row'
      }
      return ''
    }
    function findParent(row) {
      let parentRow = null
      const stack = [...this.dataList]
      while (stack.length) {
        const current = stack.pop()
        if (current.children && current.children.includes(row)) {
          parentRow = current
          break
        }
        if (current.children) {
          stack.push(...current.children)
        }
      }
      return parentRow
    }
    const expanded = computed(() => {
      return store.getters.getExpandedAll
    })
    function expandedRowAll() {
      function expandRecursively(row) {
        tableReportEngine.value.toggleRowExpansion(row, true)
        if (row.children && row.children.length > 0) {
          row.children.forEach(expandRecursively)
        }
      }
      function collapseRecursively(row) {
        let hideRow = false
        if (row.children && row.children.length > 0) {
          row.children.forEach(child => {
            if (!child.is_parent) {
              hideRow = true
            }
            collapseRecursively(child)
          })
        }
        if (!row.is_parent || hideRow) {
          tableReportEngine.value.toggleRowExpansion(row, false)
        }
      }

      dataList.value.forEach(row => {
        if (expanded.value) {
          expandRecursively(row)
        } else {
          collapseRecursively(row)
        }
      })
    }

    const isLoadingReport = computed(() => {
      return store.getters.getReportIsLoading
    })
    watch(data, () => {
      nextTick(() => {
        expandedRowAll()
      })
    })
    watch(expanded, () => {
      nextTick(() => {
        expandedRowAll()
      })
    })
    onMounted(() => {
      nextTick(() => {
        expandedRowAll()
      })
    })
    function widthColumn(data) {
      if (
        isNumberField(data) ||
        isDateField(data) ||
        isBooleanField(data) ||
        isDecimalField(data)
      ) {
        return '250'
      }
      return '360'
    }
    function getCellStyle(code, row) {
      if (isEmptyValue(row.cells[code])) {
        return {}
      }
      const { value } = row.cells[code]
      if (!isEmptyValue(value) && value.type) {
        if (value.type === 'decimal' && value.value < 0) {
          return { color: 'red' }
        }
      }
    }
    function getFields() {
      store.commit('setReportIsLoading', true)
      setTimeout(() => {
        store.commit('setReportIsLoading', false)
      }, 1000)
    }
    return {
      getFields,
      showDialog,
      tableReportEngine,
      selectedRow,
      selectedColumn,
      showPopover,
      dataModal,
      dataList,
      recordData,
      currentPageSize,
      currentPageNumber,
      expanded,
      isLoadingReport,
      data,
      columns,
      shortsKey,
      reportDefinition,
      keyAction,
      widthColumn,
      exportFile,
      displayLabel,
      getAlignment,
      tableRowClassName,
      handleChangeSizePage,
      handleChangePage,
      handleRowClick,
      getRowClassName,
      findParent,
      expandedRowAll,
      viewShowDialog,
      getCellStyle,
      activatePopover
    }
  }
})
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
  }
  .el-table__body-wrapper {
    position: relative;
    height: 100%;
    overflow-y: 'auto';
  }
  .p {
    margin: 0px;
    .column-right {
      text-align: right;
    }
  }

</style>
<style>
:root {
  --level-offset: 20px;
}
.el-table__row--level-[n] {
  transform: translateX(calc(var(--level-offset) * var(--level, 1)));
}
.expanded {
  border-left: 3px solid #ddd;
  height: 50%;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 5px solid transparent;
  border-top: 5px solid #ddd;
  width: 0;
  height: 0;
  position: absolute;
  left: -5px;
}

.arrow-right {
  position: absolute;
  bottom: -6px;
  left: 100%;
  margin-left: 5px;
  width: 5px;
  height: 5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #ddd;
  content: '';
}
.last-child-row {
    border-bottom: 1px solid #afaeae !important;
}
.el-table .success-row {
  font-weight: 700;
  background: #ecf5ff;
}
.reportInfo .el-popover {
  width: 850px !important;
}
.reportInfo .el-popover .el-descriptions-item__container .el-descriptions-item__content{
  display: flex;
  justify-content: flex-end;
  margin-right:20px;
}
</style>
