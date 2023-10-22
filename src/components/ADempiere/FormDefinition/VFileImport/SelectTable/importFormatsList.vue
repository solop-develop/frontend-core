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
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-form-item
    style="width: 100%;margin-left: 10px;margin-right: 10px;text-align: center;"
  >
    <template slot="label">
      <span style="color: #f34b4b"> * </span>
      {{ $t('form.VFileImport.selectTable.importFormat') }}
    </template>

    <el-select
      v-model="currrentImportFormat"
      style="width: 100%;"
      filterable
      clearable
      :remote-method="remoteSearchImportFormats"
      @visible-change="loadImportFormatsList"
    >
      <el-option
        v-for="item in storedImportFormatsList"
        :key="item.values.KeyColumn"
        :label="item.values.DisplayColumn"
        :value="item.values.KeyColumn"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import {
  isEmptyValue
} from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ImportFormatsList',

  setup() {
    const storedTableName = computed(() => {
      return store.getters.getStoredCurrentTableName
    })

    const storedImportFormatsList = computed(() => {
      return store.getters.getStoredImportFormatsList
    })

    const currrentImportFormat = computed({
      // getter
      get() {
        const { importFormatId } = store.getters.getAttribute
        return importFormatId
      },
      // setter
      set(value) {
        store.dispatch('getImportFormatFromServer', {
          id: value
        })
      }
    })

    function loadImportFormatsList(isFind, searchValue) {
      if (!isFind) {
        return
      }
      if (!isEmptyValue(storedImportFormatsList.value)) {
        return
      }
      store.dispatch('getImportFormatsListFromServer', {
        searchValue,
        tableName: storedTableName.value
      })
    }

    function remoteSearchImportFormats(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = storedImportFormatsList.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          // findCharsets(true, query)
        }
      }
    }

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
      }
    }

    return {
      currrentImportFormat,
      storedImportFormatsList,
      // Methids
      loadImportFormatsList,
      remoteSearchImportFormats
    }
  }
})
</script>
