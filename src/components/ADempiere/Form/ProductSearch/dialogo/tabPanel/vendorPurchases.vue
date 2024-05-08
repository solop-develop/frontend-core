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
      :label="$t('field.product.vendorPurchasesTables.name')"
    />
    <el-table-column
      prop="is_current_vendor"
      header-align="center"
      :label="$t('field.product.vendorPurchasesTables.isCurrentVendor')"
    />
    <el-table-column
      prop="unit_of_measure"
      header-align="center"
      :label="$t('field.product.vendorPurchasesTables.uom')"
    />
  </el-table>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'VendorPurchases',

  setup() {
    /**
     * Computed
     */
    const vendorPurchases = computed(() => {
      return store.getters.getVendorPurchases
    })
    const recordList = computed(() => {
      return vendorPurchases.value.record
    })

    const isLoadingTable = computed(() => {
      return vendorPurchases.value.isLoading
    })

    return {
      // Computed
      vendorPurchases,
      isLoadingTable,
      recordList
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
