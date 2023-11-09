<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
    ref="singleTable"
    v-loading="isLoadingTable"
    :data="dataTable"
    border
    highlight-current-row
    style="width: 100%"
    :element-loading-text="$t('notifications.loading')"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    :empty-text="$t('form.VFileImport.configureToImport.emptyDataTable')"
    height="35vh"
    @current-change="changeRow"
  >
    <index-column
      v-if="!isEmptyValue(headerTable)"
    />

    <el-table-column
      v-for="(item, key) in headerTable"
      :key="key"
      :label="key"
      width="180"
    >
      <template slot-scope="scope">
        {{ scope.row[key] }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  setup() {
    const singleTable = ref(null)

    const dataTable = computed(() => {
      const { data } = store.getters.getFile
      return data
    })

    const headerTable = computed(() => {
      const { header } = store.getters.getFile
      return header
    })

    const isLoadingTable = computed(() => {
      const { isLoading } = store.getters.getFile
      return isLoading
    })

    const currentLine = computed({
      set(newRow) {
        store.commit('setNavigationLine', newRow)
        store.commit('setIndexRecordPreview', newRow.rowIndex)
        singleTable.value.setCurrentRow(newRow)
      },
      get() {
        return store.getters.getNavigationLine
      }
    })

    function changeRow(currentRow) {
      currentLine.value = currentRow
    }

    watch(currentLine, (newValue, oldValue) => {
      if (newValue) {
        singleTable.value.setCurrentRow(newValue)
      }
    })

    return {
      singleTable,
      //
      currentLine,
      isLoadingTable,
      dataTable,
      headerTable,
      //
      changeRow
    }
  }
})
</script>
