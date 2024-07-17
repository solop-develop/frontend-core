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
        ref="elTable"
        :data="dataList"
        row-key="level"
        :border="false"
        style="width: 100%; border-top: 2px solid black"
        lazy
        :default-expand-all="false"
        :tree-props="{children: 'children'}"
        height="calc(100vh - 210px)"
        @row-click="handleRowClick"
      >
        <!-- <el-table-column
          align="center"
        >
          <template slot-scope="scope">
            <div
              :style="{
                'border-left': '3px solid #ddd',
                'height': '50%',
                'position': 'absolute',
                'left': '0',
                'top': '0'
              }"
              :class="{'expanded': scope.row.expanded}"
            >
              <div
                :style="{
                  'border-bottom': '3px solid #ddd',
                  'position': 'absolute',
                  'bottom': '-5px',
                  'width': '40px',
                  'height': '10px',
                  'padding-right': '10px',
                  'overflow': 'visible'
                }"
              >
                <div class="arrow-right" />
              </div>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          v-for="(fieldAttributes, key) in columns"
          :key="key"
          :column-key="fieldAttributes.code"
          :min-width="'280'"
          :align="getAlignment(fieldAttributes.display_type)"
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
import { defineComponent, computed } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import { isNumberField } from '@/utils/ADempiere/references'

export default defineComponent({
  name: 'reportPanel',
  components: {
    CustomPagination
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
  methods: {
    handleRowClick(row, column, event) {
      if (row.children && row.children.length > 0) {
        this.$refs.elTable.toggleRowExpansion(row)
      }
    }
  },
  setup(props) {
    function displayLabel(prop, row) {
      if (isEmptyValue(row.cells)) {
        return
      }
      const { display_value, value } = row.cells[prop]
      if (
        isEmptyValue(display_value) &&
        !isEmptyValue(value) &&
        typeof value === 'string'
      ) {
        return value
      }
      return display_value
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
      const childData = children.map((child, indexChild) => {
        return {
          ...child,
          level: parentLevel + indexChild
        }
      })
      childData.push({
        level: parentLevel + children.length,
        expanded: false,
        cells: {}
      })
      return childData
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
      const { value } = row.cells[code]
      if (typeof value === 'string') {
        const parsedValue = parseFloat(value)
        if (!isNaN(parsedValue)) {
          return { fontSize: '11px' }
        } else {
          return { fontSize: '14px' }
        }
      } else {
        return { fontSize: '11px' }
      }
    }
    return {
      dataList,
      recordData,
      currentPageSize,
      currentPageNumber,
      exportFile,
      displayLabel,
      getAlignment,
      handleChangeSizePage,
      handleChangePage,
      getCellStyle
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
.el-table__row--level-[n] {
  transform: translateX(calc(20px * [n]));
}

.el-table__row--level-0 {
  font-weight: 700;
}
/*
.el-table__expand-icon {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px
} */

/* .el-table__expand-icon i::before {
  content: '\e7a0';
  font-family: 'element-icons';
  display: inline-block;
  transform: rotate(0deg)
}
.el-table__expand-icon--expanded i::before {
  content: '\e7a2';
  font-family: 'element-icons';
  display: inline-block;
  transform: rotate(90deg);
} */
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

</style>
