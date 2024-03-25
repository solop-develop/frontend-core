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
  <el-row :gutter="24" class="products-footer">
    <el-col :span="14">
      <custom-pagination
        :container-manager="containerManager"
        :total-records="recordCount"
        :row-index="rowIndex"
        :is-showed-selected="false"
        :selection="selectedRecords"
        :page-number="pageNumber"
        :page-size="pageSize"
        :handle-change-page-number="setPageNumber"
        :handle-change-page-size="setPageSize"
      />
    </el-col>

    <el-col :span="10">
      <samp style="float: right; padding-top: 4px;">
        <el-button
          type="info"
          class="button-base-icon"
          plain
          @click="clearCriteriaValues();"
        >
          <svg-icon icon-class="layers-clear" />
        </el-button>

        <el-button
          :loading="isLoadingRecords"
          type="success"
          class="button-base-icon"
          icon="el-icon-refresh-right"
          @click="loadRecordsList({});"
        />

        <el-button
          type="danger"
          class="button-base-icon"
          icon="el-icon-close"
          @click="clearParentValues();"
        />

        <el-button
          type="primary"
          class="button-base-icon"
          icon="el-icon-check"
          @click="changeCurrentRecord()"
        />
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  PRODUCT_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/product.ts'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import useProduct from './useProduct'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'PanelFooter',

  components: {
    CustomPagination
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: PRODUCT_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    },
    showPopover: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props) {
    const {
      currentRow,
      blankValues,
      fieldSearchData,
      isLoadingRecords,
      //
      closeList,
      loadRecordsList,
      setValues
    } = useProduct({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const selectedRecords = computed(() => {
      if (!isEmptyValue(currentRow.value)) {
        return 1
      }
      return 0
    })

    const recordCount = computed(() => {
      return fieldSearchData.value.recordCount
    })

    const pageNumber = computed({
      set(newValue) {
        store.commit('setProductSearchFieldPageNumber', {
          containerUuid: props.uuidForm,
          pageNumber: newValue
        })
      },
      get() {
        return fieldSearchData.value.pageNumber
      }
    })

    const pageSize = computed({
      set(newValue) {
        store.commit('setProductSearchFieldPageSize', {
          containerUuid: props.uuidForm,
          pageSize: newValue
        })
      },
      get() {
        return fieldSearchData.value.pageSize
      }
    })

    const rowIndex = computed(() => {
      const row = currentRow.value
      if (isEmptyValue(row)) {
        return -1
      }
      return row.rowIndex
    })

    function clearCriteriaValues() {
      pageNumber.value = 1
      pageSize.value = ROWS_OF_RECORDS_BY_PAGE
      store.commit('setProductSearchFieldQueryFilters', {
        containerUuid: props.uuidForm,
        queryFilters: {}
      })
    }

    function clearParentValues() {
      setValues(
        blankValues.value
      )
      closeList()
    }

    function changeCurrentRecord() {
      setValues(
        currentRow.value
      )
      closeList()
    }

    function setPageNumber(newPageNumber) {
      loadRecordsList({
        pageNumber: newPageNumber,
        pageSize: pageSize.value
      })
    }
    function setPageSize(newPageSize) {
      loadRecordsList({
        pageSize: newPageSize,
        pageNumber: pageNumber.value
      })
    }

    return {
      currentRow,
      isLoadingRecords,
      pageNumber,
      pageSize,
      recordCount,
      rowIndex,
      selectedRecords,
      //
      changeCurrentRecord,
      clearCriteriaValues,
      clearParentValues,
      loadRecordsList,
      setPageNumber,
      setPageSize
    }
  }
})
</script>
