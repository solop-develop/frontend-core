<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com https://github.com/elsiosanchez
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
  <div
    v-if="!isChangeOptions"
    id="mainBrowseDataTable"
    class="multipleTableBrowser"
    :onLoad="adjustSize()"
    :onresize="setTableHeight()"
  >
    <el-row>
      <el-col :span="24">
        <filter-fields
          :container-uuid="panelMetadata.uuid"
          :fields-list="containerManager.getFieldsList({ containerUuid: panelMetadata.uuid })"
          :fields-to-hidden="containerManager.getFieldsToHidden"
          :filter-manager="containerManager.changeColumnShowedFromUser"
          :showed-manager="containerManager.isDisplayedColumn"
          :is-filter-records="false"
          :in-table="true"
          :container-manager="containerManager"
        />
      </el-col>
    </el-row>

    <el-table
      id="multipleTable"
      ref="multipleTable"
      v-loading="isLoadingDataTable"
      border
      :row-key="keyColumn"
      reserve-selection
      highlight-current-row
      :data="recordsWithFilter"
      size="small"
      :element-loading-text="$t('notifications.loading')"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :row-class-name="tableRowClassName"
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      @select="handleSelection"
      @select-all="handleSelectionAll"
    >
      <!-- column with the checkbox -->
      <el-table-column
        v-if="isTableSelection"
        type="selection"
        :prop="keyColumn"
        fixed
        min-width="50"
      />

      <el-table-column
        v-for="(fieldAttributes, key) in headerList"
        :key="key"
        :column-key="fieldAttributes.columnName"
        :prop="fieldAttributes.columnName"
        sortable
        min-width="210"
        :fixed="fieldAttributes.isFixedTableColumn"
      >
        <template slot="header">
          <span v-if="containerManager.isMandatoryColumn(fieldAttributes)" style="color: red">
            *
          </span>
          {{ fieldAttributes.name }}
        </template>
        <template slot-scope="scope">
          <!-- formatted displayed value -->
          <cell-edit-info
            :parent-uuid="parentUuid"
            :container-uuid="containerUuid"
            :field-attributes="fieldAttributes"
            :container-manager="containerManager"
            :scope="scope"
            :data-row="scope.row"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination table, set custom or use default change page method -->
    <custom-pagination
      :container-manager="containerManager"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :total="recordsLength"
      :current-page="currentPage"
      :selection="selectionsLength"
      :records-page="recordsWithFilter.length"
      :is-showed-selected="true"
      :handle-change-page="handleChangePage"
      :handle-size-change="handleChangeSizePage"
    />
  </div>

  <loading-view
    v-else
    key="browser-table-loading"
  />
</template>

<script>
import { defineComponent, computed, onMounted, onUpdated, ref, watch } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import CellEditInfo from '@/components/ADempiere/DataTable/Components/CellEditInfo.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import FilterFields from '@/components/ADempiere/FilterFields/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'BrowserTable',

  components: {
    CellEditInfo,
    CustomPagination,
    FilterFields,
    LoadingView
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    panelMetadata: {
      type: Object,
      required: true
    },
    isLoadingDataTable: {
      type: Boolean,
      default: false
    },
    // get the table header
    header: {
      type: Array,
      required: true,
      default: () => []
    },
    dataTable: {
      type: Array,
      default: () => []
    },
    // Show check column from selection row
    isTableSelection: {
      type: Boolean,
      default: true
    }
  },

  setup(props, { root }) {
    const panelMain = document.getElementById('mainBrowseDataTable')
    const multipleTable = ref(null)

    const heightTable = ref()
    const timeOut = ref(null)
    const isChangeOptions = ref(false)
    const heightSize = ref()
    const currentRowSelect = ref({})

    const isLoadingDataTale = computed(() => {
      if (props.containerManager && props.containerManager.isLoadedRecords) {
        return !props.containerManager.isLoadedRecords({
          containerUuid: props.containerUuid
        })
      }
      return !isEmptyValue(props.dataTable)
    })

    const currentOption = computed(() => {
      return store.getters.getTableOption(props.containerUuid)
    })

    const keyColumn = computed(() => {
      if (props.panelMetadata) {
        return props.panelMetadata.keyColumn
      }
      return undefined
    })

    const headerList = computed(() => {
      return props.header.filter(fieldItem => {
        if (props.containerManager.isDisplayedColumn(fieldItem)) {
          const isMandatoryGenerated = props.containerManager.isMandatoryColumn(fieldItem)
          const isDisplayedDefault = props.containerManager.isDisplayedDefaultTable({
            ...fieldItem,
            isMandatory: isMandatoryGenerated
          })
          // madatory, not parent column and without default value to window, mandatory or with default value to others
          if (isDisplayedDefault) {
            return true
          }
          // tableColumnDataType(fieldItem, currentOption.value)
          // showed by user
          return fieldItem.isShowedTableFromUser
        }

        return false
      })
    })

    const selectionsLength = computed(() => {
      return props.containerManager.getSelection({
        containerUuid: props.containerUuid
      }).length
    })

    const currentPage = computed(() => {
      if (props.containerManager.getRecordCount) {
        return parseInt(props.containerManager.getPageNumber({
          containerUuid: props.containerUuid
        }), 10)
      }
      return 1
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const selectionsList = computed(() => {
      if (props.containerManager.getSelection) {
        return props.containerManager.getSelection({
          containerUuid: props.containerUuid
        })
      }
      return []
    })

    const recordsLength = computed(() => {
      if (props.containerManager.getRecordCount) {
        return props.containerManager.getRecordCount({
          containerUuid: props.containerUuid
        })
      }
      return recordsWithFilter.value.length
    })

    const defaultSize = computed(() => {
      // const main = document.getElementById('multipleTable')
      if (!isEmptyValue(multipleTable.value) &&
        !isEmptyValue(multipleTable.value.$el.clientHeight)) {
        return multipleTable.value.$el.clientHeight
      }
      return 500
    })

    const sizeViewTable = computed(() => {
      if (isMobile.value) {
        return 500
      }
      if (!isEmptyValue(panelMain) && !isEmptyValue(heightSize.value)) {
        return heightSize.value - 400
      }
      return defaultSize.value
    })

    /**
     * Select record row
     * @param {object} row
     * @param {string} column
     */
    function handleRowClick(row, column, event) {
      if (column.type === 'selection') {
        return
      }
      if (row.isSelectedRow) {
        // enable edit mode
        row.isEditRow = true
      }
    }

    /**
     * To confirm edit record row
     * @param {object} row
     * @param {string} column
     */
    function handleRowDblClick(row, column, event) {
      // disable edit mode
      if (props.containerManager.confirmRowChanges && row.isSelectedRow && row.isEditRow) {
        row.isEditRow = false
        props.containerManager.confirmRowChanges({
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid,
          row
        })
      }
    }

    /**
     * custom method to handle change page
     */
    function handleChangePage(pageNumber) {
      props.containerManager.setPage({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        pageNumber,
        pageSize: store.getters.getBrowserPageSize({ containerUuid: props.containerUuid })
      })

      router.push({
        name: root.$route.name,
        query: {
          ...root.$route.query,
          page: pageNumber
        }
      }, () => {})
    }

    function handleChangeSizePage(pageSize) {
      props.containerManager.setSizePage({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        pageSize,
        pageNumber: 1
      })
    }

    // get table data
    const recordsWithFilter = computed(() => {
      if (props.containerManager && props.containerManager.getRecordsList) {
        return props.containerManager.getRecordsList({
          containerUuid: props.containerUuid
        })
      }
      return props.dataTable
    })

    function handleSelection(selections, rowSelected) {
      let index = 0
      rowSelected.isSelectedRow = !rowSelected.isSelectedRow
      rowSelected.rowSelectedIndex = index++
      rowSelected.isEditRow = rowSelected.isSelectedRow // edit record if is selected

      handleSelectionAll(selections)
    }

    function handleSelectionAll(selections = []) {
      props.containerManager.setSelection({
        containerUuid: props.containerUuid,
        recordsSelected: selections
      })
    }

    /**
     * Select or unselect rows
     * USE ONLY MOUNTED
     */
    function toggleSelection(rows = []) {
      if (isEmptyValue(multipleTable.value)) {
        return
      }
      multipleTable.value.clearSelection()
      if (!isEmptyValue(rows)) {
        rows.forEach(row => {
          multipleTable.value.toggleRowSelection(row, true)
        })
      }
    }

    /**
     * Handle Cell Click
     * @param {object} row
     * @param {object} column
     * @param {object} cell
     * @param {*} event
     */
    function handleCellClick(row, column, cell, event) {
      if (column.type === 'selection') {
        let currentSelection = selectionsList.value
        row.isSelectedRow = !row.isSelectedRow
        row.isEditRow = row.isSelectedRow
        if (row.isSelectedRow) {
          currentSelection.push(row)
        } else {
          currentSelection = currentSelection.filter(rowSelected => row[keyColumn.value] !== rowSelected[keyColumn.value])
        }
        handleSelectionAll(currentSelection)
        toggleSelection(currentSelection)
        return
      }
    }

    function tableRowClassName(params) {
      const recordUuid = store.getters.getUuidOfContainer(props.containerUuid)
      if (params.row.UUID === recordUuid && !isEmptyValue(props.parentUuid) && isEmptyValue(currentRowSelect.value)) {
        return 'success-row'
      }
      return ''
    }

    function adjustSize() {
      if (!isEmptyValue(panelMain) && !isEmptyValue(panelMain.clientHeight)) {
        const size = parseInt(panelMain.clientHeight) / 2
        if (recordsWithFilter.value.length < 5) {
          heightTable.value = 'auto'
          return
        }
        heightTable.value = size
      }
    }

    function setTableHeight() {
      adjustSize()
    }

    function loadSelection() {
      if (!props.isTableSelection) {
        return
      }
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        toggleSelection(selectionsList.value)
      }, 100)
    }

    watch(currentOption, (newValue, oldValue) => {
      isChangeOptions.value = true
      setTimeout(() => {
        isChangeOptions.value = false
      }, 500)
    })

    onUpdated(() => {
      const main = document.getElementById('mainBrowse')
      if (!isEmptyValue(main) &&
        !isEmptyValue(main.clientHeight)) {
        heightSize.value = main.clientHeight
      }
      // loadSelection()
    })

    onMounted(() => {
      // adjustSize()
      // setTableHeight()
      loadSelection()
    })

    return {
      // Refs
      multipleTable,
      timeOut,
      isChangeOptions,
      heightTable,
      heightSize,
      // Computeds
      headerList,
      isLoadingDataTale,
      recordsWithFilter,
      currentOption,
      keyColumn,
      recordsLength,
      currentPage,
      selectionsLength,
      defaultSize,
      sizeViewTable,
      isMobile,
      currentRowSelect,
      // Methods
      setTableHeight,
      adjustSize,
      tableRowClassName,
      handleChangePage,
      handleRowClick,
      handleRowDblClick,
      handleCellClick,
      handleSelection,
      handleSelectionAll,
      loadSelection,
      handleChangeSizePage
    }
  }
})
</script>

<style lang="scss">
.multipleTableBrowser {
  height: 85%;
  .el-table {
    height: 100% !important;
  }
  .el-table .success-row {
    background: #e8f4ff;
  }
  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 15px;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
