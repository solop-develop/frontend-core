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
      ref="businessPartnerTable"
      v-loading="isLoadingRecords"
      class="business-partners-table"
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
        {{ $t('field.businessPartner.emptyBusinessPartner') }}
      </p>

      <index-column />

      <el-table-column
        prop="value"
        :label="$t('field.businessPartner.value')"
        header-align="center"
        width="90"
      />
      <el-table-column
        prop="name"
        :label="$t('field.businessPartner.name')"
        header-align="center"
        width="220"
      />
      <el-table-column
        prop="business_partner_group"
        :label="$t('field.businessPartner.group')"
        header-align="center"
        width="170"
      />

      <el-table-column
        prop="open_balance_amount"
        :label="$t('field.businessPartner.openBalance')"
        header-align="center"
        width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.open_balance_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="credit_available_amount"
        :label="$t('field.businessPartner.creditAvailable')"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.credit_available_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="credit_used_amount"
        :label="$t('field.businessPartner.creditUsed')"
        header-align="center"
        width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.credit_used_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="revenue_amount"
        :label="$t('field.businessPartner.revenue')"
        header-align="center"
        width="110"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.revenue_amount }}
        </span>
      </el-table-column>

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
  BUSINESS_PARTNERS_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import useBusinessPartner from './useBusinessPartner'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
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
    } = useBusinessPartner({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const recordsList = computed(() => {
      return store.getters.getBusinessPartnerRecordsList({
        containerUuid: props.uuidForm
      })
    })

    function handleCurrentChange(newCurrentRow, oldCurrentRow) {
      if (newCurrentRow.is_active === false || newCurrentRow.IsActive === false) {
        return
      }
      currentRow.value = newCurrentRow
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
      changeCurrentRecord,
      tableRowClassName
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
