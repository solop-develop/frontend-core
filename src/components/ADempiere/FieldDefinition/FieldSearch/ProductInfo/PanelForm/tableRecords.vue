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
    <el-table
      ref="recordsTable"
      v-loading="isLoadingRecords"
      class="products-table"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
      :max-height="300"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changeCurrentRecord"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('field.product.emptyRecords') }}
      </p>

      <index-column
        :page-number="pageNumber"
        :page-size="pageSize"
      />

      <el-table-column
        prop="value"
        :label="$t('field.product.value')"
        header-align="center"
        width="90"
      />
      <el-table-column
        prop="name"
        :label="$t('field.product.name')"
        header-align="center"
        width="220"
      />
      <el-table-column
        prop="product_category"
        :label="$t('field.product.productCategory')"
        header-align="center"
        width="150"
      />
      <el-table-column
        prop="product_group"
        :label="$t('field.product.productGroup')"
        header-align="center"
        width="150"
      />
      <el-table-column
        prop="upc"
        :label="$t('field.product.productClass')"
        header-align="center"
        width="150"
      />
      <el-table-column
        prop="sku"
        :label="$t('field.product.upcEan')"
        header-align="center"
        width="170"
      />
      <el-table-column
        prop="sku"
        :label="$t('field.product.sku')"
        header-align="center"
        width="170"
      />
      <el-table-column
        prop="uom"
        :label="$t('field.product.uom')"
        header-align="center"
        width="70"
      />

      <!-- <el-table-column
        prop="open_balance_amount"
        :label="$t('field.product.openBalance')"
        header-align="center"
        width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.open_balance_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="credit_available_amount"
        :label="$t('field.product.creditAvailable')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.credit_available_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="credit_used_amount"
        :label="$t('field.product.creditUsed')"
        header-align="center"
        width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.credit_used_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="revenue_amount"
        :label="$t('field.product.revenue')"
        header-align="center"
        width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.revenue_amount }}
        </span>
      </el-table-column> -->

      <el-table-column
        prop="vendor"
        :label="$t('field.product.vendor')"
        header-align="center"
        width="170"
      />
      <el-table-column
        prop="is_attribute_instance"
        :label="$t('field.product.instanceAttribute')"
        header-align="center"
        width="140"
      />

    </el-table>
  </div>
</template>

<script>
import {
  defineComponent, computed, nextTick, onMounted, ref, watch
} from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  PRODUCT_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/product.ts'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import useProduct from './useProduct'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
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
    }
  },

  setup(props) {
    const recordsTable = ref(null)

    const {
      currentRow,
      isLoadingRecords,
      pageNumber,
      pageSize,
      closeList,
      setValues
    } = useProduct({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const recordsList = computed(() => {
      return store.getters.getProductSearchFieldRecordsList({
        containerUuid: props.uuidForm
      })
    })

    function handleCurrentChange(recordRow) {
      currentRow.value = recordRow
    }

    function changeCurrentRecord() {
      const recordRow = currentRow.value
      if (!isEmptyValue(recordRow)) {
        setValues(recordRow)
        closeList()
      }
    }

    watch(currentRow, (newValue, oldValue) => {
      if (recordsTable.value) {
        recordsTable.value.setCurrentRow(
          newValue
        )
      }
    })

    onMounted(() => {
      nextTick(() => {
        if (recordsTable.value) {
          recordsTable.value.setCurrentRow(
            currentRow.value
          )
        }
      })
    })

    return {
      recordsTable,
      //
      currentRow,
      isLoadingRecords,
      pageNumber,
      pageSize,
      recordsList,
      //
      handleCurrentChange,
      changeCurrentRecord
    }
  }
})
</script>

<style lang="scss">
.products-table {
  &.el-table {
    .el-table__body {
      .el-table__row {
        .el-table__cell {
          padding-top: 5px;
          padding-bottom: 3px;
          .cell {
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
      }
    }
  }
}
</style>
