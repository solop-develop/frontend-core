<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
    multiple
    filterable
    allow-create
    @change="preHandleChange"
  >
    <el-option
      v-for="(option, key) in value"
      :key="key"
      :value="option"
    />
  </el-select>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'

/**
 * This component is a list type field, for IN and NOT IN search with advanced query
 */
export default {
  name: 'FieldSelectMultiple',

  mixins: [
    fieldMixin
  ],

  computed: {
    cssClassCustomField() {
      return ' custom-field-select custom-field-select-multiple '
    }
  }
}
</script>
