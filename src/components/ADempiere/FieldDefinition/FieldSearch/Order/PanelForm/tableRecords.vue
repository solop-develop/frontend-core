<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
      ref="businessPartnerTable"
      v-loading="isLoadingRecords"
      class="business-partners-table"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
      :max-height="300"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changeBusinessPartner"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('field.order.emptyRecords') }}
      </p>

      <index-column />

      <el-table-column
        prop="business_partner"
        :label="$t('field.order.businessPartner')"
        header-align="center"
        width="200"
      />
      <el-table-column
        prop="date_ordered"
        :label="$t('field.order.orderDate')"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-center">
          {{ formatDate({ value: scope.row.date_ordered }) }}
        </span>
      </el-table-column>
      <el-table-column
        prop="document_no"
        :label="$t('field.order.documentNo')"
        header-align="center"
        width="170"
      />

      <el-table-column
        prop="currency"
        :label="$t('field.order.currency')"
        header-align="center"
        width="110"
      />

      <el-table-column
        :label="$t('field.order.grandTotal')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.grand_total }) }}
        </span>
      </el-table-column>

      <el-table-column
        :label="$t('field.order.converted')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.converted_amount }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="is_sales_transaction"
        :label="$t('field.order.salesTransaction')"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_sales_transaction) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="description"
        :label="$t('field.order.description')"
        header-align="center"
        width="180"
      />

      <el-table-column
        prop="po_reference"
        :label="$t('field.order.businessPartnerOrderReference')"
        header-align="center"
        width="270"
      />

      <el-table-column
        prop="is_delivered"
        :label="$t('field.order.delivered')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_delivered) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="document_status"
        :label="$t('field.order.documentStatus')"
        header-align="center"
        width="220"
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
  BUSINESS_PARTNERS_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import useOrder from './useOrder'

// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
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
          containerUuid: BUSINESS_PARTNERS_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  setup(props) {
    const businessPartnerTable = ref(null)

    const {
      currentRow,
      isLoadingRecords,
      closeList,
      setValues
    } = useOrder({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const recordsList = computed(() => {
      return store.getters.getOrderRecordsList({
        containerUuid: props.uuidForm
      })
    })

    function handleCurrentChange(recordRow) {
      currentRow.value = recordRow
    }

    function changeBusinessPartner() {
      const recordRow = currentRow.value
      if (!isEmptyValue(recordRow)) {
        setValues(recordRow)
        closeList()
      }
    }

    watch(currentRow, (newValue, oldValue) => {
      if (businessPartnerTable.value) {
        businessPartnerTable.value.setCurrentRow(
          newValue
        )
      }
    })

    onMounted(() => {
      nextTick(() => {
        if (businessPartnerTable.value) {
          businessPartnerTable.value.setCurrentRow(
            currentRow.value
          )
        }
      })
    })

    return {
      businessPartnerTable,
      //
      currentRow,
      isLoadingRecords,
      recordsList,
      //
      handleCurrentChange,
      changeBusinessPartner,
      formatDate,
      formatQuantity,
      convertBooleanToTranslationLang
    }
  }
})
</script>

<style lang="scss">
.business-partners-table {
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
