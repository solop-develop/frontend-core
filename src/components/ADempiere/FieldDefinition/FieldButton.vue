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
  <el-button-group>
    <el-button
      v-popover:info-field
      type="primary"
      icon="el-icon-warning"
      style="font-size: 24px;padding-top: 5px;padding-bottom: 5px;padding-left: 6px;padding-right: 6px;"
    />
    <el-popover
      ref="info-field"
      placement="top"
      trigger="click"
      class="popover-field-options"
      style="padding: 0px !important; max-width: 400px"
    >
      <context-info
        :field-attributes="metadata"
      />
    </el-popover>

    <el-button
      v-bind="commonsProperties"
      type="primary"
      plain
      :disabled="isDisabledButton"
      @click="startProcess"
    >
      <!-- eslint-disable-next-line -->
      <component v-bind="iconProps" />
      {{ parsedDisplayedRender }}
    </el-button>
  </el-button-group>
</template>

<script>
// Components and Mixins
import ContextInfo from '@/components/ADempiere/FieldDefinition/FieldOptions/ContextInfo'
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldMixinDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'

// Utils and Helpers Methods
import {
  runProcessOfWindow,
  generateReportOfWindow,
  openBrowserAssociated,
  openDocumentAction,
  openFormAssociated
} from '@/utils/ADempiere/dictionary/window.js'
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils/contextAttributes'

export default {
  name: 'FieldButton',

  components: {
    ContextInfo
  },

  mixins: [
    fieldMixin,
    fieldMixinDisplayColumn
  ],

  computed: {
    isDisabledButton() {
      return (this.metadata.readonly || this.isDisableAction) && !['Posted', 'Record_ID'].includes(this.metadata.columnName)
    },
    isDisableAction() {
      return this.actionAssociated.isEnabled && !this.actionAssociated.isEnabled()
    },
    emptyValue() {
      return isEmptyValue(this.value) || this.value < 0
    },
    parsedDisplayedRender() {
      if (this.emptyValue || this.metadata.columnName === 'Posted') {
        return this.metadata.name
      }
      const displayValue = this.displayedValue
      if (!isEmptyValue(displayValue)) {
        return this.metadata.name + ': ' + displayValue
      }
      return this.metadata.name + ': ' + this.value
    },
    iconProps() {
      return {
        is: this.actionAssociated.is,
        class: this.actionAssociated.class,
        'icon-class': this.actionAssociated['icon-class']
      }
    },
    actionAssociated() {
      // is Post
      if (this.metadata.columnName === 'Posted') {
        return {
          is: 'svg-icon',
          'icon-class': 'balance',
          start: () => {
            this.$store.commit('setDefaultOpenedTab', 'accountingInformation')
            this.$store.dispatch('showLogs', {
              show: true
            })
          },
          isEnabled: () => true
        }
      }
      // button without process associated
      if (isEmptyValue(this.metadata.process)) {
        return {
          is: 'span',
          start: () => {
            return
          },
          isEnabled: () => {
            return true
          }
        }
      }

      if (this.metadata.process.isReport) {
        return {
          is: 'i',
          class: 'el-icon-data-analysis',
          start: () => generateReportOfWindow.generateReportOfWindow({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            uuid: this.metadata.process.uuid
          }),
          isEnabled: () => generateReportOfWindow.enabled({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid
          })
        }
      }

      if (this.metadata.process.browserId) {
        return {
          is: 'svg-icon',
          'icon-class': 'search',
          start: () => openBrowserAssociated.openBrowserAssociated({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            uuid: this.metadata.process.uuid,
            browserUuid: this.metadata.process.browserUuid
          }),
          isEnabled: () => generateReportOfWindow.enabled({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid
          })
        }
      }

      if (this.metadata.process.formId) {
        return {
          is: 'svg-icon',
          'icon-class': 'search',
          start: () => openFormAssociated.openFormAssociated({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            uuid: this.metadata.process.uuid,
            formUuid: this.metadata.process.formUuid
          }),
          isEnabled: () => openFormAssociated.enabled({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid
          })
        }
      }

      if (this.metadata.process.workflowId) {
        return {
          is: 'svg-icon',
          'icon-class': 'example',
          start: () => openDocumentAction.openDocumentAction({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            uuid: this.metadata.process.uuid
          }),
          isEnabled: () => openDocumentAction.enabled({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid
          })
        }
      }

      // is process
      return {
        is: 'i',
        'class': 'el-icon-setting',
        start: () => runProcessOfWindow.runProcessOfWindow({
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          uuid: this.metadata.process.uuid
        }),
        isEnabled: () => generateReportOfWindow.enabled({
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid
        })
      }
    },
    contextAttributes() {
      const contextAttributesList = getContextAttributes({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.contextColumnNames,
        keyName: 'key'
      })
      return generateContextKey(contextAttributesList, 'key')
    }
  },

  watch: {
    contextAttributes(newValue, oldValue) {
      if (this.metadata.columnName === 'Record_ID' && !isSameValues(newValue, oldValue)) {
        if (!isEmptyValue(newValue)) {
          this.setDefaultValue()
        }
      }
    }
  },

  beforeMount() {
    if (this.metadata.displayed && this.metadata.columnName === 'Record_ID') {
      if (!this.emptyValue && typeof this.value === 'number') {
        if (isEmptyValue(this.displayedValue)) {
          // request lookup
          this.getDefaultValueFromServer()
        }
      }
    }
  },

  methods: {
    startProcess() {
      this.actionAssociated.start()
    }
  }
}
</script>
