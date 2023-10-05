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
  <el-dropdown
    trigger="click"
    class="fields-display-accounting"
    @command="handleDisplayColumn"
  >
    <span class="el-dropdown-link">
      <svg-icon icon-class="list" />
    </span>

    <el-dropdown-menu slot="dropdown" style="max-width: 300px;">
      <el-dropdown-item
        command="showMinimalistView"
      >
        <svg-icon :icon-class="isShowMinialist ? 'eye-open' : 'eye'" />
        {{ $t('table.dataTable.showMinimalistView') }}
      </el-dropdown-item>
      <el-dropdown-item
        command="displayDocumentInformation"
      >
        <svg-icon :icon-class="isShowDocumentColumns ? 'eye-open' : 'eye'" />
        {{ $t('form.accountingViewer.table.displayDocumentInfo') }}
      </el-dropdown-item>
      <el-dropdown-item
        command="displaySourceInformation"
      >
        <svg-icon :icon-class="isShowSourceColumns ? 'eye-open' : 'eye'" />
        {{ $t('form.accountingViewer.table.displaySourceInfo') }}
      </el-dropdown-item>
      <el-dropdown-item
        command="displayQuantity"
      >
        <svg-icon :icon-class="isShowQuantityColumns ? 'eye-open' : 'eye'" />
        {{ $t('form.accountingViewer.table.displayQuantity') }}
      </el-dropdown-item>
      <el-dropdown-item
        command="displayAll"
      >
        <svg-icon :icon-class="isShowAllColumns ? 'eye-open' : 'eye'" />
        {{ $t('table.dataTable.showAllColumns') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'FilterColumns',
  setup() {
    const isShowDocumentColumns = computed({
      set(newValue) {
        store.commit('setIsDisplayDocumentInfo', newValue)
      },
      get() {
        return store.getters.getIsDisplayDocumentInfo
      }
    })

    const isShowSourceColumns = computed({
      set(newValue) {
        store.commit('setIsDisplaySourceInfo', newValue)
      },
      get() {
        return store.getters.getIsDisplaySourceInfo
      }
    })

    const isShowQuantityColumns = computed({
      set(newValue) {
        store.commit('setIsDisplayQuantity', newValue)
      },
      get() {
        return store.getters.getIsDisplayQuantity
      }
    })

    const isShowMinialist = computed(() => {
      return !(isShowDocumentColumns.value || isShowSourceColumns.value || isShowQuantityColumns.value)
    })
    const isShowAllColumns = computed(() => {
      return isShowDocumentColumns.value && isShowSourceColumns.value && isShowQuantityColumns.value
    })

    const isLoadingDataTable = computed({
      set(newValue) {
        store.commit('setIsLoadingAccoutingRecords', newValue)
      },
      get() {
        return store.getters.getIsLoadingAccoutingRecords
      }
    })

    function handleDisplayColumn(displayColumn) {
      isLoadingDataTable.value = true
      setTimeout(() => {
        isLoadingDataTable.value = false
      }, 500)

      switch (displayColumn) {
        case 'displayAll':
          isShowDocumentColumns.value = true
          isShowSourceColumns.value = true
          isShowQuantityColumns.value = true
          break
        case 'displayDocumentInformation':
          isShowDocumentColumns.value = !isShowDocumentColumns.value
          break
        case 'displaySourceInformation':
          isShowSourceColumns.value = !isShowSourceColumns.value
          break
        case 'displayQuantity':
          isShowQuantityColumns.value = !isShowQuantityColumns.value
          break
        case 'showMinimalistView':
          isShowDocumentColumns.value = false
          isShowSourceColumns.value = false
          isShowQuantityColumns.value = false
          break
      }
    }

    return {
      isShowMinialist,
      isShowAllColumns,
      isShowDocumentColumns,
      isShowSourceColumns,
      isShowQuantityColumns,
      //
      handleDisplayColumn
    }
  }
})
</script>

<style scoped lang="scss">
.fields-display-accounting {
  float: right  ;
  position: relative;
  color: #606266;
  font-size: 16px;
  /* float: right; */
  padding-left: 5px;
}
</style>
