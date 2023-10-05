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
    :label="$t('form.accountingViewer.postingType')"
  >
    <el-select
      v-model="postingTypeValue"
      style="width: 100%;"
      filterable
      @visible-change="getPostingTypesList"
    >
      <el-option
        v-for="item in postingTypesList"
        :key="item.KeyColumn"
        :label="item.DisplayColumn"
        :value="item.KeyColumn"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'PostingTypeFilter',

  setup() {
    const postingTypeValue = computed({
      set(newValue) {
        store.commit('setPostingTypeValue', newValue)
      },
      get() {
        return store.getters.getCurrentStoredPostingTypeValue
      }
    })

    const postingTypesList = computed(() => {
      return store.getters.getStoredPostingTypesList
    })

    function getPostingTypesList() {
      if (!isEmptyValue(postingTypesList.value)) {
        return
      }
      store.dispatch('getPostingTypesFromServer', {
        searchValue: ''
      })
    }

    return {
      // Computeds
      postingTypeValue,
      postingTypesList,
      // Methods
      getPostingTypesList
    }
  }
})
</script>
