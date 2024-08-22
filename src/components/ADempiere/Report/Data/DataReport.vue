<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/ElsioSanchez
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
  <div @click="!showPopover">
    <el-card class="containerReportEnginer">
      <el-table
        ref="tableReportEngine"
        v-loading="isLoadingReport"
        :data="dataList"
        lazy
        :border="true"
        row-key="level"
        :height="height"
        :style="{ fontSize: fontSize + 'px', width: '100%' }"
        :default-expand-all="false"
        :row-class-name="tableRowClassName"
        :tree-props="{ children: 'children' }"
        :cell-style="{ padding: '0', height: '30px', border: 'none' }"
        :cell-class-name="getRowClassName"
        @row-click="handleRowClick"
        @cell-contextmenu="activatePopover"
      >
        <el-table-column
          v-for="(fieldAttributes, key) in columns"
          :key="fieldAttributes.code + key"
          :column-key="fieldAttributes.code"
          :align="getAlignment(fieldAttributes.display_type)"
          :fixed="fieldAttributes.is_group_column"
          width="auto"
        >
          <template slot="header">
            {{ fieldAttributes.title }}
          </template>
          <template slot-scope="scope">
            <!-- Show cell only if it should not be hidden -->
            <data-cells
              :key-column="key"
              :row-data="scope.row"
              :data-modal="dataModal"
              :show-details="showPopover"
              :attributes="fieldAttributes"
              :current-selected-row="selectedRow"
              :current-selected-column="selectedColumn"
            />
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
import {
  defineComponent,
  onMounted,
  computed,
  nextTick,
  watch,
  ref
} from '@vue/composition-api'
import store from '@/store'
// Components
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import InfoReport from '@/views/ADempiere/ReportViewerEngine/infoReport.vue'
import DataCells from '@/components/ADempiere/Report/Data/DataCells.vue'
// Utility functions
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isNumberField } from '@/utils/ADempiere/references'

export default defineComponent({
  name: 'DataReport',
  components: {
    CustomPagination,
    InfoReport,
    DataCells
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
    // Constants
    const reportDefinition = store.getters.getStoredReport(props.reportOutput.containerUuid)

    // Ref
    const dataModal = ref({})
    const showPopover = ref(false)
    const selectedRow = ref(undefined)
    const selectedColumn = ref(undefined)
    const tableReportEngine = ref(undefined)

    // Components
    const fontSize = computed(() => {
      return store.getters.getFontSize
    })
    const data = computed(() => {
      const { rowCells } = props.reportOutput
      if (isEmptyValue(rowCells)) return []
      return rowCells
    })
    const height = computed(() => {
      if (store.getters.device !== 'mobile') {
        return 'calc(100vh - 295px)'
      }
      return 'calc(100vh - 385px)'
    })
    const columns = computed(() => {
      const { columns } = props.reportOutput
      if (isEmptyValue(columns)) return []
      return columns
    })
    const dataList = computed(() => {
      return data.value.map((row, rowIndex) => {
        let isTopLevel = false
        if (row.level < 1) {
          isTopLevel = !isTopLevel
        }
        const index = rowIndex + 1
        const newRow = {
          ...row,
          children: hasChildren(row.children, index.toString()),
          level: index,
          isTopLevel
        }
        return newRow
      })
    })
    const expanded = computed(() => {
      return store.getters.getExpandedAll
    })
    const shortsKey = computed(() => {
      return {
        close: ['esc']
      }
    })
    const recordData = computed(() => {
      return store.getters.getReportOutput(props.instanceUuid)
    })
    const currentPageSize = computed(() => {
      return parseInt(props.reportOutput.pageSize, 10)
    })
    const isLoadingReport = computed(() => {
      return store.getters.getReportIsLoading
    })
    const currentPageNumber = computed(() => {
      return parseInt(props.reportOutput.pageToken, 10)
    })

    // Methods
    function keyAction(event) {
      switch (event.srcKey) {
        case 'close':
          store.commit('setShowDialog', false)
          showPopover.value = false
      }
    }
    function handleRowClick(row) {
      if (row.children && row.children.length > 0) {
        tableReportEngine.value.toggleRowExpansion(row)
        showPopover.value = false
      }
    }
    function activatePopover(row, column) {
      event.preventDefault()
      Object.values(row.cells).forEach(dataCell => {
        if (dataCell && 'sum_value' in dataCell) {
          selectedColumn.value = column.columnKey
          selectedRow.value = row
          dataModal.value = dataCell
          showPopover.value = true
        }
      })
    }
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
    /**
     * Searches for the parent of a row in the data list.
     * @param {Object} row The row for which the parent is searched.
     * @returns {Object|null} The parent of the row or null if not found.
     */
    function findParent(row) {
      const stack = [...this.dataList]

      while (stack.length) {
        const current = stack.pop()
        if (current.children && current.children.includes(row)) {
          return current
        }
        if (current.children) {
          stack.push(...current.children)
        }
      }
      return null
    }
    /**
     * Expands or collapses all table rows
     */
    function expandedRowAll() {
      // Auxiliary function for toggle row expansion.
      const toggleRowExpansion = (row, expand) => {
        tableReportEngine.value.toggleRowExpansion(row, expand)
      }

      // Recursive function to expand all rows.
      const expandRecursively = (row) => {
        toggleRowExpansion(row, true)
        row.children?.forEach(expandRecursively) // Recursion to expand children.
      }

      // Recursive function to collapse all rows.
      const collapseRecursively = (row) => {
        // Check if the row has children and if any of them is not a parent.
        const shouldHide = row.children?.some(child => !child.is_parent)

        // Recursion to collapse children.
        row.children?.forEach(collapseRecursively)

        // Collapses the current row if it is not a parent or if any of its children is not a parent.
        if (!row.is_parent || shouldHide) {
          toggleRowExpansion(row, false)
        }
      }

      // Itera sobre todas las filas y expande o colapsa según el estado de `expanded`.
      dataList.value.forEach(row => {
        expanded.value ? collapseRecursively(row) : expandRecursively(row)
      })
    }
    function widthColumn(attributes) {
      const width = (attributes.title.length + 1) * 15
      if (width > 150) return width + 'px'
      return '150px'
    }
    function getAlignment(displayType) {
      if (isNumberField(displayType)) {
        return 'right'
      }
      return 'left'
    }

    /**
     * Watch - watch works directly on a ref
     * @param newValue - New Assessed Property value
     * @param oldValue - Old Assessed Property value
     */
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
    /**
     * On Mounted
     */
    onMounted(() => {
      nextTick(() => {
        expandedRowAll()
      })
    })
    return {
      // Refs
      dataModal,
      showPopover,
      selectedRow,
      selectedColumn,
      tableReportEngine,
      // Components
      height,
      columns,
      dataList,
      expanded,
      shortsKey,
      recordData,
      isLoadingReport,
      currentPageSize,
      currentPageNumber,
      fontSize,
      // Methods
      keyAction,
      findParent,
      widthColumn,
      hasChildren,
      getAlignment,
      handleRowClick,
      expandedRowAll,
      activatePopover,
      getRowClassName,
      handleChangePage,
      tableRowClassName,
      handleChangeSizePage
    }
  }
})
</script>

<style>
.containerReportEnginer .el-card__body {
  padding: 20px !important
}
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
