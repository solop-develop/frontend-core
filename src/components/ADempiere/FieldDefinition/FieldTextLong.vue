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
  <div
    v-if="isDisabled"
    key="text-long-readonly"
    v-markdown="value"
    class="custom-field-text-long-disable"
  />
  <v-md-editor
    v-else
    key="text-long-writable"
    v-model="value"
    left-toolbar="clear h bold italic strikethrough quote ul ol table hr link image | emoji listMailTemplates"
    height="250px"
  />
</template>

<script>
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/FieldDefinition/mixin/mixinFieldText.js'

export default {
  name: 'FieldTextLong',

  mixins: [
    fieldMixin,
    fieldMixinText
  ],

  data() {
    return {
      mode: 'markdown', // 'markdown' or 'wysiwyg'
      height: '200px',
      editor: null
    }
  },

  computed: {
    cssClassCustomField() {
      let styleClass = ' custom-field-text-long '
      if (this.isDisabled) {
        styleClass += ' custom-field-text-long-disable '
      }
      return styleClass
    },
    value: {
      get() {
        const { columnName, containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            const value = this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
            if (!isEmptyValue(value)) {
              return value
            }
          }
        }

        const valueEditor = store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })

        if (this.isEmptyValue(valueEditor)) return ''
        return valueEditor
      },
      set(newValue) {
        const { columnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName,
              value: newValue
            })
          }
        }

        store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName,
          value: newValue
        })
        // update element column name
        if (!this.metadata.isSameColumnElement) {
          store.commit('updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName: this.metadata.elementName,
            value: newValue
          })
        }
        this.preHandleChange(newValue)
      }
    }
  }
}
</script>

<style scoped>
.custom-field-text-long-disable {
  background: #F5F7FA;
}
</style>
