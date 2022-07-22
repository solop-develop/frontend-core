// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { isDisplayedField, isMandatoryField } from '@/utils/ADempiere/dictionary/window.js'
import { DISPLAY_COLUMN_PREFIX, getDefaultValue } from '@/utils/ADempiere/dictionaryUtils.js'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { isLookup } from '@/utils/ADempiere/references'

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
    return state.storedWindows[windowUuid].tabsList.find(tab => {
      return tab.uuid === tabUuid
    })
  },

  getTableName: (state, getters) => (windowUuid, tabUuid) => {
    const tab = getters.getStoredTab(windowUuid, tabUuid)
    if (!isEmptyValue(tab)) {
      return tab.tableName
    }
    return undefined
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

    const { linkColumnName, parentColumnName } = storedTab

    const attributesDisplayColumn = []
    const attributesObject = {}
    let attributesList = fieldsList
      .map(fieldItem => {
        const { uuid, columnName, defaultValue, contextColumnNames } = fieldItem
        const isSQL = String(defaultValue).startsWith('@SQL=') && isGetServer
        const isLinkColumn = !isEmptyValue(linkColumnName) && columnName === linkColumnName
        const isParentColumn = fieldItem.isParent || (!isEmptyValue(parentColumnName) && columnName === parentColumnName)

        let parsedDefaultValue
        if (!isSQL) {
          parsedDefaultValue = getDefaultValue({
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
        attributesObject[columnName] = parsedDefaultValue

        // add display column to default
        if (isAddDisplayColumn && isLookup(fieldItem.displayType)) {
          const { displayColumnName } = fieldItem
          let displayedValue
          if (!isEmptyValue(parsedDefaultValue)) {
            // get displayed value of link column
            if (isLinkColumn) {
              displayedValue = getContext({
                parentUuid,
                columnName: DISPLAY_COLUMN_PREFIX + linkColumnName
              })
            }

            // get displayed value of parent column
            if (isParentColumn) {
              displayedValue = getContext({
                parentUuid,
                columnName: DISPLAY_COLUMN_PREFIX + columnName
              })
            }

            // get displayed value of stored default value
            if (isEmptyValue(displayedValue)) {
              const storedDefaultValue = rootGetters.getStoredDefaultValue({
                parentUuid,
                containerUuid,
                contextColumnNames: contextColumnNames,
                uuid
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
                uuid
              })
              if (!isEmptyValue(storedLookupList)) {
                const option = storedLookupList.find(item => item.value === parsedDefaultValue)
                if (!isEmptyValue(option)) {
                  displayedValue = option.displayedValue
                }
              }
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
    showedMethod = isDisplayedField,
    isEvaluateDefaultValue = false,
    isEvaluateShowed = true
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromTab(parentUuid, containerUuid)
    }

    // all optionals (not mandatory) fields
    return fieldsList
      .filter(fieldItem => {
        const { defaultValue } = fieldItem
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic

        // parent column
        if (fieldItem.isParent) {
          return true
        }
        if (isMandatory && isEmptyValue(defaultValue) && !isTable) {
          return false
        }

        if (isEvaluateDefaultValue && isEvaluateShowed) {
          return showedMethod(fieldItem) &&
            !isEmptyValue(defaultValue)
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
