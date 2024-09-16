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
import store from '@/store'

// Components and Mixins
import ContextInfo from '@/components/ADempiere/FieldDefinition/FieldOptions/ContextInfo'
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldMixinDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'

// Constants
import {
  TRUE_STRING, FALSE_STRING
} from '@/utils/ADempiere/formatValue/booleanFormat'
import { RECORD_ID } from '@/utils/ADempiere/constants/systemColumns'
import { IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helpers Methods
import {
  runProcessOfWindow,
  generateReportOfWindow,
  openDocumentAction,
  openFormAssociated
} from '@/utils/ADempiere/dictionary/window'
import {
  openBrowserAssociated
} from '@/utils/ADempiere/dictionary/window/actionsMenu'
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils/contextAttributes'
import {
  convertBooleanToString, convertBooleanToTranslationLang
} from '@/utils/ADempiere/formatValue/booleanFormat'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

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
      return (this.metadata.readonly || this.isDisableAction) && !['Posted', RECORD_ID].includes(this.metadata.columnName)
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
        // is a list/table value
        return this.metadata.name + ': ' + displayValue
      }
      let value = convertBooleanToString(this.value, false)
      if ([TRUE_STRING, FALSE_STRING].includes(value)) {
        // is a boolean value
        value = convertBooleanToTranslationLang(value)
      }
      // is possible big decimal value
      return this.metadata.name + ': ' + value
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

            const recordUuid = store.getters.getUuidOfContainer(this.metadata.containerUuid)
            store.dispatch('getAccoutingFactsFromServer', {
              searchValue: '',
              tableName: this.metadata.tabTableName,
              recordId: this.currentRecord[this.metadata.tabTableName + '_ID'],
              recordUuid: recordUuid
            })
          },
          isEnabled: () => true
        }
      } else if (this.metadata.columnName === RECORD_ID) {
        return {
          // is: 'svg-icon',
          // 'icon-class': 'zoom-in',
          is: 'i',
          class: 'el-icon-zoom-in',
          start: () => {
            const storedZoomWindowsList = store.getters.getZoomWindowsList({
              tableId: this.currentTableId
            })
            if (isEmptyValue(storedZoomWindowsList)) {
              this.getZoomWindowsList()
              return
            }
            let windowToOpen = storedZoomWindowsList.at()
            if (storedZoomWindowsList.length > 0) {
              const isSalesTransactionContext = isSalesTransaction({
                parentUuid: this.metadata.parentUuid,
                containerUuid: this.metadata.containerUuid
              })
              windowToOpen = storedZoomWindowsList.find(windowToZoom => {
                return windowToZoom.is_sales_transaction === isSalesTransactionContext
              })
            }
            const tableName = store.getters.getTableNameById({
              tableId: this.currentTableId
            })
            zoomIn({
              attributeValue: `window_${windowToOpen.id}`,
              attributeName: 'containerKey',
              query: {
                recordId: this.value,
                [tableName + IDENTIFIER_COLUMN_SUFFIX]: this.value
              },
              params: {
                recordId: this.value,
                [tableName + IDENTIFIER_COLUMN_SUFFIX]: this.value
              }
            })
          },
          isEnabled: () => {
            if (isEmptyValue(this.value)) {
              return false
            }
            if (isEmptyValue(this.currentTableId)) {
              return false
            }
            return true
          }
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

      if (this.metadata.process.browser_id > 0) {
        return {
          is: 'svg-icon',
          'icon-class': 'search',
          start: () => openBrowserAssociated.openBrowserAssociated({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            uuid: this.metadata.process.uuid,
            browserUuid: this.metadata.process.browser.uuid,
            browserId: this.metadata.process.browser.internal_id
          }),
          isEnabled: () => generateReportOfWindow.enabled({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid
          })
        }
      }

      if (this.metadata.process.form_id > 0) {
        return {
          is: 'svg-icon',
          'icon-class': 'search',
          start: () => openFormAssociated.openFormAssociated({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            uuid: this.metadata.process.uuid,
            formId: this.metadata.process.form.internal_id,
            formUuid: this.metadata.process.form.uuid
          }),
          isEnabled: () => openFormAssociated.enabled({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid
          })
        }
      }

      if (this.metadata.process.workflow_id > 0) {
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
    },

    currentTableId() {
      if (this.metadata.displayed && this.metadata.columnName === RECORD_ID) {
        const { containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          const value = this.containerManager.getCell({
            containerUuid,
            rowIndex: this.metadata.rowIndex,
            rowUid: this.metadata.rowUid,
            columnName: 'AD_Table_ID'
          })
          return value
        } else {
          const value = store.getters.getValueOfFieldOnContainer({
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName: 'AD_Table_ID'
          })
          return value
        }
      }
      return -1
    }
  },

  watch: {
    contextAttributes(newValue, oldValue) {
      if (this.metadata.columnName === RECORD_ID && !isSameValues(newValue, oldValue)) {
        if (!isEmptyValue(newValue)) {
          this.setDefaultValue()
        }
      }
    },
    currentTableId(newValue, oldValue) {
      if (!isSameValues(newValue, oldValue)) {
        if (!isEmptyValue(newValue)) {
          this.getZoomWindowsList()
        }
      }
    }
  },

  beforeMount() {
    if (this.metadata.displayed && this.metadata.columnName === RECORD_ID) {
      if (!this.emptyValue && typeof this.value === 'number') {
        if (isEmptyValue(this.displayedValue)) {
          // request lookup
          this.loadDefaultValueFromServer()
        }
        this.getZoomWindowsList()
      }
    }
  },

  methods: {
    startProcess() {
      this.actionAssociated.start()
    },
    getZoomWindowsList() {
      const storedZoomWindowsList = store.getters.getZoomWindowsList({
        tableId: this.currentTableId
      })
      if (!isEmptyValue(storedZoomWindowsList)) {
        return
      }
      store.dispatch('getZoomWindowsListFromServer', {
        tableId: this.currentTableId
      })
    }
  }
}
</script>
