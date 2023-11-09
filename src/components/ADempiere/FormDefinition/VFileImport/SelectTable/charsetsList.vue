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
  <el-form-item
    style="width: 100%;margin-left: 10px;margin-right: 10px;text-align: center;"
  >
    <template slot="label">
      <span style="color: #f34b4b"> * </span>
      {{ $t('form.VFileImport.selectTable.listOfCharacterSets') }}
    </template>

    <el-select
      v-model="currrentCharset"
      style="width: 100%;"
      filterable
      clearable
      :remote-method="remoteSearchCharsets"
      @visible-change="loadCharsetList"
    >
      <el-option
        v-for="item in storedCharsetsList"
        :key="item.values.ValueColumn"
        :label="item.values.DisplayColumn"
        :value="item.values.ValueColumn"
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
  name: 'CharsetList',

  setup() {
    const storedCharsetsList = computed(() => {
      return store.getters.getStoredCharsetsList
    })

    const currrentCharset = computed({
      // getter
      get() {
        const { charsets } = store.getters.getAttribute
        return charsets
      },
      // setter
      set(value) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'charsets',
          value
        })
      }
    })

    function loadCharsetList(isFind, searchValue) {
      if (!isFind) {
        return
      }
      if (!isEmptyValue(storedCharsetsList.value)) {
        return
      }
      store.dispatch('getCharsetsListFromServer', searchValue)
    }

    function remoteSearchCharsets(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = storedCharsetsList.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          // loadCharsetList(true, query)
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
      currrentCharset,
      storedCharsetsList,
      // Methods
      loadCharsetList,
      remoteSearchCharsets
    }
  }
})
</script>
