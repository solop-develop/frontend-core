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
  <el-switch
    v-model="value"
    v-bind="commonsProperties"
    :active-text="$t('components.switchActiveText')"
    :inactive-text="$t('components.switchInactiveText')"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
  />
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'

// Utils and Helper Methods
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { ACTIVE } from '@/utils/ADempiere/constants/systemColumns'

export default {
  name: 'FieldYesNoSwitch',

  mixins: [
    fieldMixin
  ],

  computed: {
    cssClassCustomField() {
      return ' custom-field-yes-no-switch '
    },
    activeColor() {
      if (ACTIVE === this.metadata.columnName) {
        return '#13ce66'
      }
      return undefined
    },
    inactiveColor() {
      if (ACTIVE === this.metadata.columnName) {
        return '#ff4949'
      }
      return undefined
    }
  },

  mounted() {
    this.isReadOnlyForm(this.value)
  },

  methods: {
    parseValue(value) {
      return convertStringToBoolean(value)
    },
    preHandleChange(value) {
      this.handleFieldChange({ value })

      this.isReadOnlyForm(this.value)
    },

    /**
     * Set is read only form
     * IsActive, Processed, Processing
     * @param {boolean|string} value
     */
    isReadOnlyForm(value) {
      if (this.metadata.inTable ||
        !this.metadata.isColumnReadOnlyForm ||
        !this.metadata.displayed) {
        return
      }

      const fieldsExcludes = []
      // if isChangedAllForm it does not exclude anything, otherwise it excludes this columnName
      if (!this.metadata.isChangedAllForm) {
        fieldsExcludes.push(this.metadata.columnName)
      }

      this.$store.dispatch('changeFieldAttributesBoolean', {
        containerUuid: this.metadata.containerUuid,
        fieldsIncludes: [],
        attribute: 'isReadOnlyFromForm',
        valueAttribute: Boolean(this.metadata.valueIsReadOnlyForm !== value),
        fieldsExcludes,
        currenValue: value
      })
    }
  }

}
</script>

<style scoped>
  .custom-field-yes-no-switch {
    max-height: 34px;
  }
</style>
