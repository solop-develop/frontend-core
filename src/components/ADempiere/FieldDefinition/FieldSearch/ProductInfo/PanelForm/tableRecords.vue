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
      :key="componentKey"
      v-loading="isLoadingRecords"
      class="products-table"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
      :max-height="300"
      size="mini"
      :row-class-name="tableRowClassName"
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
        sortable
        header-align="center"
        width="90"
      />
      <el-table-column
        prop="name"
        :label="$t('field.product.name')"
        sortable
        header-align="center"
        width="220"
      />

      <template v-if="isPriceAmounts">
        <el-table-column
          prop="standard_price"
          :label="$t('field.product.standardPrice')"
          sortable
          header-align="center"
          width="127"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.standard_price }) }}
          </span>
        </el-table-column>

        <!--
        <el-table-column
          prop="list_price"
          :label="$t('field.product.listPrice')"
          sortable
          header-align="center"
          width="122"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.list_price }) }}
          </span>
        </el-table-column>

        <el-table-column
          prop="limit_price"
          :label="$t('field.product.limitPrice')"
          sortable
          header-align="center"
          width="118"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.limit_price }) }}
          </span>
        </el-table-column>
        <el-table-column
          prop="margin"
          :label="$t('field.product.margin')"
          sortable
          header-align="center"
          width="110"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.margin }) }}
          </span>
        </el-table-column>
        -->
      </template>

      <el-table-column
        prop="uom"
        :label="$t('field.product.uom')"
        sortable
        header-align="center"
        width="60"
      />
      <el-table-column
        prop="is_stocked"
        :label="$t('field.product.stocked')"
        sortable
        header-align="center"
        width="120"
      >
        <span slot-scope="scope">
          {{ convertBooleanToTranslationLang(scope.row.is_stocked) }}
        </span>
      </el-table-column>

      <template v-if="isStockQuantities">
        <el-table-column
          prop="available_quantity"
          :label="$t('field.product.available')"
          sortable
          header-align="center"
          width="140"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.available_quantity }) }}
          </span>
        </el-table-column>
        <el-table-column
          prop="on_hand_quantity"
          :label="$t('field.product.onHandQuantity')"
          sortable
          header-align="center"
          width="110"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.on_hand_quantity }) }}
          </span>
        </el-table-column>

        <!--
        <el-table-column
          prop="reserved_quantity"
          :label="$t('field.product.reservedQuantity')"
          sortable
          header-align="center"
          width="110"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.reserved_quantity }) }}
          </span>
        </el-table-column>
        <el-table-column
          prop="ordered_quantity"
          :label="$t('field.product.orderedQuantity')"
          sortable
          header-align="center"
          width="110"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.ordered_quantity }) }}
          </span>
        </el-table-column>
        <el-table-column
          prop="unconfirmed_quantity"
          :label="$t('field.product.unconfirmedQuantity')"
          sortable
          header-align="center"
          width="110"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.unconfirmed_quantity }) }}
          </span>
        </el-table-column>
        <el-table-column
          prop="unconfirmed_move_quantity"
          :label="$t('field.product.unconfirmedMove')"
          sortable
          header-align="center"
          width="110"
        >
          <span slot-scope="scope" class="cell-align-right">
            {{ formatQuantity({ value: scope.row.unconfirmed_move_quantity }) }}
          </span>
        </el-table-column>
      -->
      </template>

      <!--
      <el-table-column
        prop="is_instance_attribute"
        :label="$t('field.product.instanceAttribute')"
        sortable
        header-align="center"
        width="155"
      >
        <span slot-scope="scope">
          {{ convertBooleanToTranslationLang(scope.row.is_instance_attribute) }}
        </span>
      </el-table-column>
      -->

      <el-table-column
        prop="product_category"
        :label="$t('field.product.productCategory')"
        sortable
        header-align="center"
        width="165"
      />
      <el-table-column
        prop="product_group"
        :label="$t('field.product.productGroup')"
        sortable
        header-align="center"
        width="150"
      />
      <el-table-column
        prop="product_class"
        :label="$t('field.product.productClass')"
        sortable
        header-align="center"
        width="150"
      />
      <el-table-column
        prop="vendor"
        :label="$t('field.product.vendor')"
        sortable
        header-align="center"
        width="170"
      />
      <!--
      <el-table-column
        prop="upc"
        :label="$t('field.product.upcEan')"
        sortable
        header-align="center"
        width="170"
      />
      <el-table-column
        prop="sku"
        :label="$t('field.product.sku')"
        sortable
        header-align="center"
        width="170"
      />
    -->

    </el-table>
  </div>
</template>

<script>
import {
  defineComponent, computed, nextTick, onMounted, ref, watch
} from '@vue/composition-api'

import lang from '@/lang'
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
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { showMessage } from '@/utils/ADempiere/notification'
import { tableRowClassName } from '@/utils/ADempiere/dictionary/field/search/index.ts'

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
    const componentKey = ref(0)

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

    const isStockQuantities = computed(() => {
      const warehouseId = store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: props.uuidForm,
        attributeKey: 'warehouse_id'
      })
      return !isEmptyValue(warehouseId) && warehouseId > 0
    })

    const isPriceAmounts = computed(() => {
      const priceListVersionId = store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: props.uuidForm,
        attributeKey: 'price_list_version_id'
      })
      return !isEmptyValue(priceListVersionId) && priceListVersionId > 0
    })

    function handleCurrentChange(newCurrentRow, oldCurrentRow) {
      if (!isEmptyValue(newCurrentRow)) {
        if (newCurrentRow.is_active === false || newCurrentRow.IsActive === false) {
          return
        }
      }
    }

    function changeCurrentRecord(row, column, event) {
      const recordRow = row
      if (recordRow.is_active === false || recordRow.IsActive === false) {
        showMessage({
          type: 'warning',
          message: lang.t('field.inactiveRecordNoSelect')
        })
        return
      }
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

    // to update width table
    watch(isStockQuantities, (newValue, oldValue) => {
      componentKey.value++
    })
    // to update width table
    watch(isPriceAmounts, (newValue, oldValue) => {
      componentKey.value++
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
      componentKey,
      recordsTable,
      //
      currentRow,
      isLoadingRecords,
      isPriceAmounts,
      isStockQuantities,
      pageNumber,
      pageSize,
      recordsList,
      //
      convertBooleanToTranslationLang,
      formatQuantity,
      handleCurrentChange,
      changeCurrentRecord,
      tableRowClassName
    }
  }
})
</script>

<style lang="scss">
.products-table {
  &.el-table {
    .el-table__header {
      th.el-table__cell {
        .cell {
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
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
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      }
    }
  }
}
</style>
