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
  <el-select
    v-model="value"
    v-bind="commonsProperties"
    :filterable="true"
    value-key="value"
    clearable
    @change="preHandleChange"
    @clear="handleClearValue"
  >
    <el-option
      v-for="(option, key) in optionsList"
      :key="key"
      :value="option.value"
      :label="option.displayedValue"
    />
  </el-select>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'

// Utils and Helper Methods
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'

export default {
  name: 'FieldYesNoSelect',

  mixins: [
    fieldMixin
  ],

  data() {
    return {
      optionsList: [
        {
          // Empty
          displayedValue: ' ',
          value: undefined
        },
        {
          // Yes
          displayedValue: this.$t('components.switchActiveText'),
          value: true
        },
        {
          // No
          displayedValue: this.$t('components.switchInactiveText'),
          value: false
        }
      ]
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-yes-no-select '
    }
  },

  methods: {
    parseValue(value) {
      return convertStringToBoolean(value)
    }
  }

}
</script>

<style scoped>
  .custom-field-yes-no-select {
    max-height: 34px;
    width: 100%;
  }
</style>
