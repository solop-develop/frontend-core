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
  <el-row :gutter="10">
    <el-form
      ref="form-express-receipt"
      label-position="top"
      class="form-min-label"
      inline
    >
      <el-col
        v-for="(field, key) in formatFields"
        :key="field.sequence"
        :span="6"
      >
        <el-form-item
          :label="field.name"
          style="margin-bottom: 0px !important;width: 100%;"
        >
          <el-input
            v-if="field.dataType === 'S'"
            :value="displayValue(field, key)"
            disabled
            style="width: 100%;"
          />
          <el-input-number
            v-else-if="field.dataType === 'N'"
            :value="displayValue(field, key)"
            controls-position="right"
            disabled
            style="width: 100%;"
          />
          <el-date-picker
            v-else-if="field.dataType === 'D'"
            v-model="field.defaultValue"
            type="date"
            disabled
            style="width: 100%;"
          />
          <el-input
            v-else-if="field.dataType === 'C'"
            :value="displayValue(field, key)"
            disabled
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'ImportFormatFields',

  setup() {
    const listField = ref([])

    const formatFields = computed({
      // getter
      get() {
        const { formatFields } = store.getters.getAttribute
        return formatFields
      },
      // setter
      set(value) {
        store.commit('setInfoFormat', value)
      }
    })

    const currentLine = computed(() => {
      return store.getters.getNavigationLine
    })

    function displayValue(field, index) {
      const { header } = store.getters.getFile
      if (isEmptyValue(header)) return
      return currentLine.value[field.columnName]
    }

    return {
      // Ref
      listField,
      // Computed
      formatFields,
      // Methos
      displayValue
    }
  }
})
</script>
