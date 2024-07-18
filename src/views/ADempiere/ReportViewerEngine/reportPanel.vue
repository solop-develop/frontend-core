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
      <el-row :gutter="20">
        <el-col
          :span="24"
          style="text-align: end;"
        >
          <el-button
            plain
            size="mini"
            type="primary"
            style="float: right;font-weight: bold"
            @click="exportFile"
          >
            {{ $t('excel.export') }}
            <el-divider
              direction="vertical"
              style="margin-right: 0px;font-weight: bold"
            />
            <i
              class="el-icon-arrow-down"
              style="font-weight: bold;"
            />
          </el-button>
        </el-col>
      </el-row>
      <el-table
        ref="TableReportEngine"
        :data="dataList"
        row-key="level"
        style="width: 100%"
        lazy
        :row-class-name="tableRowClassName"
        :default-expand-all="false"
        :tree-props="{children: 'children'}"
        height="calc(100vh - 210px)"
        :cell-style="{padding: '0', height: '30px', border: 'none'}"
        :cell-class-name="getRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column
          v-for="(fieldAttributes, key) in columns"
          :key="key"
          :column-key="fieldAttributes.code"
          :align="getAlignment(fieldAttributes.display_type)"
          :min-width="'280'"
        >
          <template slot="header">
            {{ fieldAttributes.title }}
          </template>
          <template slot-scope="scope">
            <span :style="getCellStyle(fieldAttributes.code, scope.row)">
              {{ displayLabel(fieldAttributes.code, scope.row) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        class="reportInfo"
        :visible.sync="showModal"
        title="Información del Reporte"
      >
        <InfoReport :data="dataModal" />
      </el-dialog>
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
import { defineComponent, computed, ref } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import { isNumberField } from '@/utils/ADempiere/references'
import InfoReport from './infoReport'
export default defineComponent({
  name: 'reportPanel',
  components: {
    CustomPagination,
    InfoReport
  },
  props: {
    containerManager: {
      type: Object,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
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
    const showModal = ref(false)
    const dataModal = ref({})
    function handleRowClick(row, column, event) {
      if (row.children && row.children.length > 0) {
        this.$refs.TableReportEngine.toggleRowExpansion(row)
      } else {
        Object.entries(row.cells).forEach(data => {
          data.map(variante => {
            if (variante.sum_value) {
              dataModal.value = variante
              showModal.value = true
            }
          })
        })
      }
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
        return value.value
      }
    }
    function getAlignment(displayType) {
      if (isNumberField(displayType)) {
        return 'right'
      }
      return 'left'
    }
    const dataList = computed(() => {
      return props.data.map((row, rowIndex) => {
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
      return parseInt(store.getters.getPageSize, 10)
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

    function handleChangeSizePage(pageSize) {
      props.containerManager.setPageSize({
        containerUuid: props.containerUuid,
        reportId: props.reportOutput.id,
        pageSize
      })
    }
    function handleChangePage(pageNumber) {
      props.containerManager.setPageNumber({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        pageNumber,
        pageSize: currentPageSize.value
      })
    }

    function exportFile() {
      store.dispatch('exportReport', {
        reportId: props.reportOutput.id,
        reportName: props.reportOutput.name
      })
    }
    function getCellStyle(code, row) {
      if (isEmptyValue(row.cells[code])) {
        return {}
      }
      const { value } = row.cells[code]
      if (!isEmptyValue(value) && value.type) {
        if (value.type === 'decimal' && value.value < 0) {
          return { fontSize: '10px', color: 'red' }
        }
        return { fontSize: '10px' }
      }
      return { fontSize: '14px' }
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
    return {
      dataModal,
      showModal,
      dataList,
      recordData,
      currentPageSize,
      currentPageNumber,
      exportFile,
      displayLabel,
      getAlignment,
      tableRowClassName,
      handleChangeSizePage,
      handleChangePage,
      getCellStyle,
      handleRowClick,
      getRowClassName,
      findParent
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

.el-table__row--level-0 {
  font-weight: 700;
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
    border-bottom: 1px solid #dad8d8 !important;
}
.el-table .success-row {
  background: #ecf5ff;
}
.reportInfo .el-dialog__body .el-row .el-col{
  width: 100% !important;
}
</style>
