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
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.value')"
    />
    <el-table-column
      prop="locator"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.locator')"
    />
    <el-table-column
      prop="available_quantity"
      :label="$t('field.product.availableToPromisesTables.availableQuantity')"
    />
    <el-table-column
      prop="on_hand_quantity"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.onHandQuantity')"
    />
    <el-table-column
      prop="expected_change_quantity"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.expectedChangeQuantity')"
      width="220"
    />
    <el-table-column
      prop="business_partner"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.businessPartner')"
    />
    <el-table-column
      prop="reserved_quantity"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.reservedQuantity')"
    />
    <el-table-column
      prop="document_no"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.documentNo')"
    />
    <el-table-column
      prop="attribute_set_instance"
      header-align="center"
      :label="$t('field.product.availableToPromisesTables.attributeSetInstance')"
    />
  </el-table>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'AvailableToPromise',

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
