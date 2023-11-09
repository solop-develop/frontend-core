<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-row class="custom-pagination-content" :gutter="20">
    <el-col :span="24" style="float: right;">
      <el-pagination
        small
        layout="slot, sizes, prev, pager, next"
        :current-page="currentPage"
        :total="recordCount"
        :page-sizes="NUMBER_RECORDS_PER_PAGE"
        :page-size="currentPageSize"
        style="float: right;padding-left: 0px;padding-right: 0px;"
        @size-change="handleSizeChange"
        @current-change="handleChangePage"
      >
        <span class="selections-number">
          <span style="padding-top: 3px;">
            {{ currentIndex + ' / ' + recordCount }}
          </span>
          <span :class="isMobile ? 'is-pagination-content-panel-mobile' : 'is-pagination-content-panel'">
            <span v-show="isShowedTableRecords">
              {{ $t('table.dataTable.selected') }}: {{ selection }}
            </span>
          </span>
        </span>
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
// constants
import { ROWS_OF_RECORDS_BY_PAGE, NUMBER_RECORDS_PER_PAGE, totalRowByPage, indexRowByPage } from '@/utils/ADempiere/tableUtils'

// utils and helper methods
import { isEmptyValue, getValidInteger } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'CustomPagination',

  props: {
    parentUuid: {
      type: [Number, String],
      default: ''
    },
    containerUuid: {
      type: [Number, String],
      default: ''
    },
    containerManager: {
      type: Object,
      required: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    selection: {
      type: Number,
      default: undefined
    },
    pageSize: {
      type: Number,
      default: ROWS_OF_RECORDS_BY_PAGE
    },
    recordsPage: {
      type: Number,
      default: 1
    },
    total: {
      type: [Number, String],
      default: 0
    },
    isChangeRecord: {
      type: Boolean,
      required: false
    },
    handleSizeChange: {
      type: Function,
      default: (pageSizeNumber) => {
        console.info('implement change size page number method', pageSizeNumber)
      }
    },
    handleChangePage: {
      type: Function,
      default: (pageNumber) => {
        console.info('implement change page number method', pageNumber)
      }
    },
    changeNextRecord: {
      type: Function,
      default: (recordNext) => {
        console.info('implement method Change to Next Record', recordNext)
      }
    },
    changePreviousRecord: {
      type: Function,
      default: (recordPrevious) => {
        console.info('implement method Change to Previous Record ', recordPrevious)
      }
    },
    isShowedSelected: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const containerUuid = props.containerUuid
    const parentUuid = props.parentUuid
    const selection = props.selection

    const recordCount = computed(() => {
      return getValidInteger(props.total)
    })

    const isSelection = computed(() => {
      if (isEmptyValue(selection)) {
        return false
      }
      return true
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const rowPage = computed(() => {
      return totalRowByPage({
        pageSize: props.pageSize,
        pageNumber: props.currentPage
      })
    })

    const currentPageSize = computed(() => {
      return store.getters.getTabPageSize({ containerUuid })
    })

    const isShowedTableRecords = computed(() => {
      if (props.isShowedSelected) return props.isShowedSelected
      return store.getters.getStoredTab(
        parentUuid,
        containerUuid
      ).isShowedTableRecords
    })

    const disableNextRecord = computed(() => {
      const recordUuid = store.getters.getUuidOfContainer(containerUuid)
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid)
      if (posicionIndex > 0) return false
      return true
    })

    const disablePreviousRecord = computed(() => {
      const recordUuid = store.getters.getUuidOfContainer(containerUuid)
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid)
      const maxRecord = recordsWithFilter.value.length - 1
      if (posicionIndex < maxRecord) return false
      return true
    })

    const recordsWithFilter = computed(() => {
      if (props.containerManager && props.containerManager.getRecordsList) {
        return props.containerManager.getRecordsList({ containerUuid })
      }
      return []
    })

    const currentIndex = computed(() => {
      const records = recordsWithFilter.value
      if (isEmptyValue(records)) {
        return selection
      }
      const index = records.findIndex(row => row.UUID === store.getters.getUuidOfContainer(containerUuid))
      return indexRowByPage({
        indexRow: index,
        pageNumber: props.currentPage,
        pageSize: props.pageSize
      })
    })

    return {
      // Computed
      isSelection,
      rowPage,
      recordCount,
      currentPageSize,
      isMobile,
      isShowedTableRecords,
      disableNextRecord,
      recordsWithFilter,
      disablePreviousRecord,
      currentIndex,
      // Import
      NUMBER_RECORDS_PER_PAGE
    }
  }

})
</script>

<style lang="scss">
.custom-pagination-content {
  margin-left: 0px !important;
  margin-right: 0px !important;
  // margin-top: 1% !important;
  .selections-number {
    margin-right: 10px;
    font-weight: normal;
    color: #606266;
  }
}
</style>
<style scoped>
.is-pagination-content-panel {
  position: absolute !important;
  left: 1px !important;
}
.is-pagination-content-panel-mobile {
  position: absolute !important;
  top: 100% !important;
  left: 1px !important;
}
</style>
