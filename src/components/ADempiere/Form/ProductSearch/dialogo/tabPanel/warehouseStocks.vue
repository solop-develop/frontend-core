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
    class="products-table-avalaible"
    border
    height="300"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      header-align="center"
      :label="$t('field.product.wrehouseTables.name')"
    />
    <el-table-column
      prop="available_quantity"
      header-align="center"
      :label="$t('field.product.wrehouseTables.availableQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.available_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="on_hand_quantity"
      header-align="center"
      :label="$t('field.product.wrehouseTables.reservedQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.on_hand_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="reserved_quantity"
      header-align="center"
      :label="$t('field.product.wrehouseTables.orderedQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.reserved_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="ordered_quantity"
      header-align="center"
      :label="$t('field.product.wrehouseTables.onHandQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.ordered_quantity }) }}
      </span>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'WarehouseStocks',

  setup() {
    /**
     * Computed
     */
    const warehouseStocks = computed(() => {
      return store.getters.getWarehouseStocks
    })
    const recordList = computed(() => {
      return warehouseStocks.value.record
    })

    const isLoadingTable = computed(() => {
      return warehouseStocks.value.isLoading
    })

    return {
      // Computed
      warehouseStocks,
      isLoadingTable,
      recordList,
      formatQuantity
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
