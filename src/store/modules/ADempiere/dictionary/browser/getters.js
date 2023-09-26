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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  isDisplayedColumn, isDisplayedField, isMandatoryColumn, isMandatoryField
} from '@/utils/ADempiere/dictionary/browser.js'
import { isNumberField } from '@/utils/ADempiere/references'

/**
 * Dictionary Browser Getters
 */
export default {
  getStoredBrowser: (state) => (browserUuid) => {
    return state.storedBrowsers[browserUuid]
  },

  getStoredFieldsFromBrowser: (state, getters) => (browserUuid) => {
    const browser = getters.getStoredBrowser(browserUuid)
    if (!isEmptyValue(browser)) {
      return browser.fieldsList
    }
    return undefined
  },

  getStoredColumnsFromBrowser: (state, getters) => (browserUuid) => {
    const browser = getters.getStoredBrowser(browserUuid)
    const columnsList = []
    if (!isEmptyValue(browser)) {
      browser.fieldsList.forEach(field => {
        columnsList.push(field.columnName)
        columnsList.push(field.elementName)
      })
      return columnsList
    }
    return columnsList
  },

  getProcessOfBrowser: (state, getters, rootState, rootGetters) => (browserUuid) => {
    const { process } = getters.getStoredBrowser(browserUuid)

    return process
  },

  /**
   * Getter converter selection params with value format
   * @param {String} containerUuid
   * @param {Array<Object>} fieldsList
   * @returns {Array<Object>} [{ columnName: name key, value: value to send }]
   */
  getBrowserQueryCriteriaElement: (state, getters, rootState, rootGetters) => ({
    containerUuid,
    fieldsList = []
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    const queryParams = []
    fieldsList.forEach(fieldItem => {
      const { columnName, elementName } = fieldItem
      const isMandatory = isMandatoryField(fieldItem)
      // evaluate displayed fields
      const isDisplayed = isDisplayedField(fieldItem) &&
        (fieldItem.isShowedFromUser || isMandatory)

      if (!isDisplayed) {
        return
      }

      const value = rootGetters.getValueOfField({
        containerUuid,
        columnName
      })

      if (fieldItem.isRange && !isNumberField(fieldItem.displayType)) {
        const valueTo = rootGetters.getValueOfField({
          containerUuid,
          columnName: fieldItem.columnNameTo
        })
        if (!isEmptyValue(valueTo)) {
          queryParams.push({
            columnName: fieldItem.elementNameTo,
            value: valueTo
          })
        }
      }

      if (!isEmptyValue(value)) {
        queryParams.push({
          columnName: elementName,
          value
        })
      }
    })

    return queryParams
  },

  /**
   * Getter converter selection params with value format
   * @param {String} containerUuid
   * @param {Array<Object>} fieldsList
   * @returns {Array<Object>} [{ columnName: name key, value: value to send }]
   */
  getBrowserQueryCriteria: (state, getters, rootState, rootGetters) => ({
    containerUuid,
    fieldsList = []
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    const queryParams = []

    fieldsList.forEach(fieldItem => {
      if (fieldItem.isInfoOnly) {
        return false
      }
      const { columnName, operator } = fieldItem
      const isMandatory = isMandatoryField(fieldItem)
      // evaluate displayed fields
      const isDisplayed = isDisplayedField(fieldItem) &&
        (fieldItem.isShowedFromUser || isMandatory)

      if (!isDisplayed) {
        return
      }

      const value = rootGetters.getValueOfField({
        containerUuid,
        columnName
      })

      let valueTo
      if (fieldItem.isRange && !isNumberField(fieldItem.displayType)) {
        valueTo = rootGetters.getValueOfField({
          containerUuid,
          columnName: fieldItem.columnNameTo
        })
        // if (!isEmptyValue(valueTo)) {
        //   queryParams.push({
        //     columnName: fieldItem.columnNameTo,
        //     value: valueTo
        //   })
        // }
      }

      if (!isEmptyValue(value)) {
        queryParams.push({
          columnName,
          value,
          valueTo,
          operator
        })
      }
    })

    return queryParams
  },

  /**
   * Determinate if panel is ready to send, all fields mandatory and displayed with values
   * @param {string}  containerUuid
   * @param {object}  row, data to compare if is table
   * @returns {object}
   */
  getBrowserFieldsEmptyMandatory: (state, getters, rootState, rootGetters) => ({
    containerUuid,
    fieldsList,
    formatReturn = 'name'
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    const fieldsEmpty = fieldsList.filter(fieldItem => {
      if (fieldItem.isInfoOnly) {
        return false
      }
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

  /**
   * Available fields to showed/hidden
   * to show, used in components FilterFields
   * @param {string} containerUuid
   * @param {array} fieldsList
   * @param {function} showedMethod
   * @param {boolean} isEvaluateShowed
   * @param {boolean} isEvaluateDefaultValue
   */
  getBrowserFieldsListToHidden: (state, getters) => ({
    containerUuid,
    isTable = false,
    fieldsList = [],
    showedMethod = isTable ? isDisplayedColumn : isDisplayedField,
    isEvaluateDefaultValue = false,
    isEvaluateShowed = true
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
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

        if (isMandatory) {
          return false
        }

        const { defaultValue } = fieldItem
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
  },

  getStoredBrowserFieldFromUuid: (state, getters) => ({
    containerUuid,
    uuid,
    fieldsList = []
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
      if (isEmptyValue(fieldsList)) {
        return undefined
      }
    }

    return fieldsList.find(itemField => {
      return itemField.uuid === uuid
    })
  },

  getStoredBrowserFieldFromColumnName: (state, getters) => ({
    containerUuid,
    columnName,
    fieldsList = []
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
      if (isEmptyValue(fieldsList)) {
        return undefined
      }
    }

    return fieldsList.find(itemField => {
      return itemField.columnName === columnName
    })
  },

  getStoredBrowserFieldFromElementName: (state, getters) => ({
    containerUuid,
    columnName,
    fieldsList = []
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
      if (isEmptyValue(fieldsList)) {
        return undefined
      }
    }

    return fieldsList.find(itemField => {
      return itemField.elementName === columnName
    })
  }

}
