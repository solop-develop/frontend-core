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
            style="float: right;font-weight: bold;"
            @click="exportFile"
          >
            {{ $t('excel.export') }}
            <el-divider
              direction="vertical"
              style="margin-right: 0px;font-weight: bold;"
            />
            <i
              class="el-icon-arrow-down"
              style="font-weight: bold;"
            />
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="dataList"
        row-key="level"
        :border="true"
        style="width: 100%"
        :header-cell-style="{ background: 'gainsboro' }"
        lazy
        :default-expand-all="true"
        :tree-props="{children: 'children'}"
        height="calc(100vh - 190px)"
      >
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
            {{ displayLabel(fieldAttributes.code, scope.row) }}
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
        return {
          ...row,
          children: hasChildren(row.children, index.toString()),
          level: index
        }
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
        return {
          ...child,
          level: parentLevel + indexChild
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

    return {
      dataList,
      recordData,
      currentPageSize,
      currentPageNumber,
      exportFile,
      displayLabel,
      getAlignment,
      handleChangeSizePage,
      handleChangePage
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
