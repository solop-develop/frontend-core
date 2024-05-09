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
  <el-table
    v-loading="isLoadingTable"
    :data="recordList"
    border
    height="300"
    class="products-table-avalaible"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      header-align="center"
      min-width="120"
      :label="$t('field.product.availableToPromisesTables.warehouse')"
    />
    <el-table-column
      prop="locator"
      header-align="center"
      min-width="120"
      :label="$t('field.product.availableToPromisesTables.locator')"
    />
    <el-table-column
      prop="document_no"
      :label="$t('field.product.availableToPromisesTables.documentNo')"
      min-width="170"
    />
    <el-table-column
      v-if="showDetails"
      prop="date"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.date')"
      min-width="120"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatDate({ value: scope.row.date }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="on_hand_quantity"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.quantityStock')"
      min-width="175"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.on_hand_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="reserved_quantity"
      header-align="center"
      min-width="160"
      :label="$t('field.product.availableToPromisesTables.onHandQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.reserved_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="available_quantity"
      header-align="center"
      min-width="160"
      :label="$t('field.product.availableToPromisesTables.availableQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.available_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="ordered_quantity"
      header-align="center"
      min-width="150"
      :label="$t('field.product.availableToPromisesTables.quantityOrdered')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.ordered_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="available_to_promise_quantity"
      header-align="center"
      min-width="190"
      :label="$t('field.product.availableToPromisesTables.availablePromise')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.available_to_promise_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="business_partner"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.businessPartner')"
      min-width="150"
    />
    <el-table-column
      v-if="showDetails"
      prop="attribute_set_instance"
      header-align="center"
      min-width="180"
      :label="$t('field.product.availableToPromisesTables.instanceAttributeSet')"
    />
  </el-table>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import store from '@/store'

export default defineComponent({
  name: 'AvailableToPromise',

  props: {
    showDetails: {
      typeof: 'boolean',
      default: false
    }
  },

  setup() {
    /**
     * Computed
     */
    const availableToPromises = computed(() => {
      return store.getters.getAvailableToPromise
    })
    const recordList = computed(() => {
      return availableToPromises.value.record
    })

    const isLoadingTable = computed(() => {
      return availableToPromises.value.isLoading
    })

    return {
      // Computed
      availableToPromises,
      isLoadingTable,
      recordList,
      // Methods
      formatQuantity,
      formatDate
    }
  }
})
</script>

<style lang="scss" scoped>
.class-empty-value {
  color: transparent;
}
.label-value{
  text-align: end;
}
</style>
<style lang="scss">
.products-table-avalaible {
  &.el-table {
    .el-table__header {
      th.el-table__cell {
        padding: 0px;
        padding-top: 2px;
        padding-bottom: 2px;
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

