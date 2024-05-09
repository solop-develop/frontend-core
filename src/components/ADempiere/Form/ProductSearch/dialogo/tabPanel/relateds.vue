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
      prop="value"
      header-align="center"
      min-width="130"
      :label="$t('field.product.relatedsTables.value')"
    />
    <el-table-column
      prop="name"
      header-align="center"
      min-width="130"
      :label="$t('field.product.relatedsTables.name')"
    />
    <el-table-column
      prop="warehouse"
      header-align="center"
      min-width="130"
      :label="$t('field.product.relatedsTables.warehouse')"
    />
    <el-table-column
      prop="available_quantity"
      header-align="center"
      min-width="160"
      :label="$t('field.product.relatedsTables.availableQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.available_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="reserved_quantity"
      header-align="center"
      min-width="160"
      :label="$t('field.product.relatedsTables.reservedQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.reserved_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="on_hand_quantity"
      header-align="center"
      min-width="160"
      :label="$t('field.product.relatedsTables.onHandQuantity')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.on_hand_quantity }) }}
      </span>
    </el-table-column>
    <el-table-column
      prop="standard_price"
      header-align="center"
      min-width="160"
      :label="$t('field.product.relatedsTables.standardPrice')"
    >
      <span slot-scope="scope" class="cell-align-right">
        {{ formatQuantity({ value: scope.row.standard_price }) }}
      </span>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import store from '@/store'

export default defineComponent({
  name: 'Relateds',

  setup() {
    /**
     * Computed
     */
    const relateds = computed(() => {
      return store.getters.getRelateds
    })
    const recordList = computed(() => {
      return relateds.value.record
    })

    const isLoadingTable = computed(() => {
      return relateds.value.isLoading
    })

    return {
      // Computed
      relateds,
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
