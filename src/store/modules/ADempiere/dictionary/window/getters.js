/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Constants
import { ACTIVE, PROCESSED, PROCESSING } from '@/utils/ADempiere/constants/systemColumns'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils.js'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  isDisplayedColumn, isDisplayedField, isMandatoryColumn, isMandatoryField
} from '@/utils/ADempiere/dictionary/window.js'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { getContextDefaultValue } from '@/utils/ADempiere/contextUtils/contextField'
import { isSupportLookup, ID, YES_NO } from '@/utils/ADempiere/references'

/**
 * Dictionary Window Getters
 */
export default {
  getStoredWindows: (state) => {
    return state.storedWindows
  },

  getStoredWindow: (state) => (windowUuid) => {
    return state.storedWindows[windowUuid]
  },

  getParentTabUuid: (state) => (windowUuid) => {
    return state.storedWindows[windowUuid].firstTabUuid
  },

  getStoredTabs: (state) => (windowUuid) => {
    return state.storedWindows[windowUuid].tabsList
  },

  /**
   * Get tabs list form table name
   * @param {string} parentUuid window uuid
   * @param {string} tableName table name to get tabs on window
   * @param {string} containerUuid optional, if exists exclude this tab
   * @returns
   */
  getStoredTabsFromTableName: (state) => ({ parentUuid, tableName, containerUuid = '' }) => {
    return state.storedWindows[parentUuid].tabsList.filter(tab => {
      return tab.tableName === tableName &&
        tab.uuid !== containerUuid
    })
  },

  getStoredTab: (state) => (windowUuid, tabUuid) => {
    if (!isEmptyValue(state.storedWindows[windowUuid])) {
      const tabStored = state.storedWindows[windowUuid].tabsList.find(tab => tab.uuid === tabUuid)
      if (tabStored) {
        return tabStored
      }
    }
    return {}
  },

  getTableName: (state, getters) => (windowUuid, tabUuid) => {
    const tab = getters.getStoredTab(windowUuid, tabUuid)
    if (!isEmptyValue(tab)) {
      return tab.tableName
    }
    return undefined
  },

  getStoredTableNameByTab: (state) => (tabUuid) => {
    return state.storedTableNames[tabUuid]
  },

  getStoredFieldsFromTab: (state, getters) => (windowUuid, tabUuid) => {
    const tab = getters.getStoredTab(windowUuid, tabUuid)
    if (!isEmptyValue(tab)) {
      return tab.fieldsList
    }
    return undefined
  },

  getCurrentTab: (state, getters) => (windowUuid) => {
    const window = getters.getStoredWindow(windowUuid)

    return window.currentTab
  },

  getCurrentTabChild: (state, getters) => (windowUuid) => {
    const window = getters.getStoredWindow(windowUuid)

    return window.currentTabChild
  },

  getCurrentTabUuid: (state, getters) => (windowUuid) => {
    const window = getters.getStoredWindow(windowUuid)

    return window.currentTabUuid
  },

  getStoredFieldFromTab: (state, getters) => ({ windowUuid, tabUuid, columnName, fieldUuid }) => {
    return getters.getStoredFieldsFromTab(windowUuid, tabUuid)
      .find(field => {
        return field.columnName === columnName ||
          field.uuid === fieldUuid
      })
  },

  /**
   * Process associated on tab
   * @param {string} windowUuid or parentUuid
   * @param {string} tabUuid or containerUuid
   * @param {string} processUuid process associated
   * @returns {object}
   */
  getStoredProcessFromTab: (state, getters) => ({ windowUuid, tabUuid, processUuid }) => {
    const storedTab = getters.getStoredTab(windowUuid, tabUuid)

    return storedTab
      .processes
      .find(process => {
        return process.uuid === processUuid
      })
  },

  /**
   * Field with process associated
   * @param {string} windowUuid or parentUuid
   * @param {string} tabUuid or containerUuid
   * @param {string} processUuid process associated
   * @returns {object}
   */
  getStoredFieldFromProcess: (state, getters) => ({ windowUuid, tabUuid, processUuid }) => {
    return getters.getStoredFieldsFromTab(windowUuid, tabUuid)
      .find(field => {
        return field.process && field.process.uuid === processUuid
      })
  },

  /**
   * Determinate if panel is ready to send, all fields mandatory and displayed with values
   * @param {string}  containerUuid
   * @param {object}  row, data to compare if is table
   * @returns {object}
   */
  getTabFieldsEmptyMandatory: (state, getters, rootState, rootGetters) => ({
    parentUuid,
    containerUuid,
    fieldsList,
    formatReturn = 'name'
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromTab(parentUuid, containerUuid)
    }

    const fieldsEmpty = fieldsList.filter(fieldItem => {
      const isMandatory = isMandatoryField(fieldItem)
      const isDisplayed = isDisplayedField(fieldItem)

      if (!(isDisplayed && isMandatory)) {
        return false
      }

      const value = rootGetters.getValueOfField({
        containerUuid,
        columnName: fieldItem.columnName
      })

      if (!isEmptyValue(value)) {
        return false
      }

      // displayed or madatory and empty
      return true
    })

    if (formatReturn) {
      return fieldsEmpty.map(fieldItem => {
        // fieldItem.name by default
        return fieldItem[formatReturn]
      })
    }

    return fieldsEmpty
  },

  getProcessWindowsSelect: (state) => {
    return state.selectProcessUuid
  },

  getTabParsedDefaultValue: (state, getters, rootState, rootGetters) => ({
    parentUuid,
    containerUuid,
    isGetServer = true,
    isAddDisplayColumn = true,
    isSOTrxMenu,
    fieldsList = [],
    formatToReturn = 'array'
  }) => {
    const storedTab = getters.getStoredTab(parentUuid, containerUuid)
    if (isEmptyValue(fieldsList)) {
      fieldsList = storedTab.fieldsList
    }

    const { isParentTab, linkColumnName, parentColumnName } = storedTab

    const attributesDisplayColumn = []
    const attributesObject = {}
    let attributesList = fieldsList
      .map(fieldItem => {
        const { uuid, id, columnName, defaultValue, contextColumnNames } = fieldItem
        const isSQL = String(defaultValue).startsWith('@SQL=') && isGetServer
        const isLinkColumn = !isEmptyValue(linkColumnName) && columnName === linkColumnName
        const isParentColumn = fieldItem.isParent || (!isEmptyValue(parentColumnName) && columnName === parentColumnName)

        let parsedDefaultValue
        if (!isSQL) {
          parsedDefaultValue = getContextDefaultValue({
            ...fieldItem,
            parentUuid,
            contextColumnNames,
            isSOTrxMenu
          })
        }
        // get value of link column
        if (isLinkColumn) {
          parsedDefaultValue = getContext({
            parentUuid,
            columnName
          })
        }
        // get value of parent column
        if (isParentColumn) {
          parsedDefaultValue = getContext({
            parentUuid,
            columnName,
            isForceSession: true
          })
        }
        // get value on parent tab
        if (!isParentTab && [ACTIVE, PROCESSED, PROCESSING].includes(columnName)) {
          parsedDefaultValue = rootGetters.getValueOfField({
            parentUuid,
            columnName
          })
        }

        attributesObject[columnName] = parsedDefaultValue

        // add display column to default
        if (isAddDisplayColumn && isSupportLookup(fieldItem.displayType) || fieldItem.displayType === ID.id) {
          const { displayColumnName } = fieldItem
          let displayedValue
          if (!isEmptyValue(parsedDefaultValue)) {
            // get displayed value of link column or parent column
            if (isLinkColumn || isParentColumn) {
              // TODO: Improve with request default value on server
              if (!Number.isNaN(parsedDefaultValue) && Number(parsedDefaultValue) > 0) {
                displayedValue = getContext({
                  parentUuid,
                  columnName: DISPLAY_COLUMN_PREFIX + columnName
                })
              }
            } else {
              // get displayed value of stored default value
              if (isEmptyValue(displayedValue)) {
                const storedDefaultValue = rootGetters.getStoredDefaultValue({
                  parentUuid,
                  containerUuid,
                  contextColumnNames: contextColumnNames,
                  uuid,
                  value: parsedDefaultValue
                })
                if (!isEmptyValue(storedDefaultValue)) {
                  displayedValue = storedDefaultValue.displayedValue
                }
              }

              // get displayed value of stored lookup
              if (isEmptyValue(displayedValue)) {
                const storedLookupList = rootGetters.getStoredLookupList({
                  parentUuid,
                  containerUuid,
                  contextColumnNames: fieldItem.reference.contextColumnNames,
                  uuid,
                  id
                })
                if (!isEmptyValue(storedLookupList)) {
                  const option = storedLookupList.find(item => item.value === parsedDefaultValue)
                  if (!isEmptyValue(option)) {
                    displayedValue = option.displayedValue
                  }
                }
              }
            }
            if (isEmptyValue(displayedValue) && !fieldItem.isKey && String(defaultValue).includes('@')) {
              displayedValue = getContext({
                parentUuid,
                containerUuid,
                columnName: DISPLAY_COLUMN_PREFIX + columnName
              })
            }
          }

          attributesObject[displayColumnName] = displayedValue
          attributesDisplayColumn.push({
            columnName: displayColumnName,
            value: displayedValue,
            isSQL
          })
        }

        return {
          columnName,
          value: parsedDefaultValue,
          // valueType: fieldItem.valueType,
          isSQL
        }
      })

    if (formatToReturn === 'array') {
      attributesList = attributesList.concat(attributesDisplayColumn)
      return attributesList
    }
    return attributesObject
  },

  /**
   * Available fields to showed/hidden
   * to show, used in components FilterFields
   * @param {string} containerUuid
   * @param {array} fieldsList
   * @param {function} showedMethod
   * @param {boolean} isEvaluateShowed
   * @param {boolean} isEvaluateDefaultValue
   */
  getTabFieldsListToHidden: (state, getters) => ({
    parentUuid,
    containerUuid,
    isTable = false,
    fieldsList = [],
    showedMethod = isTable ? isDisplayedColumn : isDisplayedField,
    isEvaluateDefaultValue = false,
    isEvaluateShowed = true
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromTab(parentUuid, containerUuid)
      if (isEmptyValue(fieldsList)) {
        return []
      }
    }

    // set mandatory method
    const mandatoryMethod = isTable ? isMandatoryColumn : isMandatoryField

    // all optionals (not mandatory) fields
    return fieldsList
      .filter(fieldItem => {
        if (!fieldItem.isActive) {
          return
        }
        const isMandatory = mandatoryMethod(fieldItem)

        // parent column
        if (fieldItem.isParent) {
          return true
        }
        // Yes/No field always boolean value
        const { defaultValue } = fieldItem
        const isYesNo = fieldItem.displayType === YES_NO.id
        if (isMandatory && (isEmptyValue(defaultValue) && !isYesNo)) {
          if (isTable) {
            return true
          }
          return false
        }

        if (isEvaluateDefaultValue && isEvaluateShowed) {
          return showedMethod(fieldItem) &&
          !isEmptyValue(defaultValue) &&
          !isYesNo
        }

        if (isEvaluateDefaultValue) {
          return !isEmptyValue(defaultValue)
        }

        if (isEvaluateShowed) {
          return showedMethod(fieldItem)
        }

        return true
      })
  }

}
