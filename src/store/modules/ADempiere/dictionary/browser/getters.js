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
import {
  IGNORE_VALUE_OPERATORS_LIST, MULTIPLE_VALUES_OPERATORS_LIST, RANGE_VALUE_OPERATORS_LIST
} from '@/utils/ADempiere/dataUtils'
import { FIELDS_DATE } from '@/utils/ADempiere/references'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  isDisplayedColumn, isDisplayedField, isMandatoryColumn, isMandatoryField
} from '@/utils/ADempiere/dictionary/browser/index.js'
import { isNumberField } from '@/utils/ADempiere/references'

/**
 * Dictionary Browser Getters
 */
export default {
  getStoredBrowser: (state) => (browserUuid) => {
    return state.storedBrowsers[browserUuid]
  },

  getStoredBrowserUuidById: (state) => (browserId) => {
    return state.storedBrowsersUuid[browserId]
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
        columnsList.push(field.column_name)
        columnsList.push(field.element_name)
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
      const { column_name, element_name } = fieldItem
      const isMandatoryGenerated = isMandatoryField(fieldItem)
      // evaluate displayed fields
      const isDisplayed = isDisplayedField(fieldItem) &&
        (fieldItem.isShowedFromUser || isMandatoryGenerated)

      if (!isDisplayed) {
        return
      }

      const value = rootGetters.getValueOfField({
        containerUuid,
        columnName: column_name
      })

      if (fieldItem.is_range && !isNumberField(fieldItem.display_type)) {
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
          columnName: element_name,
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
      // default operator
      const { is_info_only, column_name, columnNameTo, operator, display_type } = fieldItem
      if (is_info_only) {
        return false
      }
      const isMandatoryGenerated = isMandatoryField(fieldItem)
      // evaluate displayed fields
      const isDisplayed = isDisplayedField(fieldItem) &&
        (fieldItem.isShowedFromUser || isMandatoryGenerated)

      if (!isDisplayed) {
        return
      }

      const contextValue = rootGetters.getValueOfField({
        containerUuid: containerUuid,
        columnName: column_name
      })

      const isNullOperator = IGNORE_VALUE_OPERATORS_LIST.includes(operator)

      let value, valueTo, values
      if (!isNullOperator) {
        if (isEmptyValue(contextValue)) {
          return
        }
        // TODO: Improve conditions
        if (FIELDS_DATE.includes(display_type)) {
          if (MULTIPLE_VALUES_OPERATORS_LIST.includes(operator)) {
            values = contextValue
          } else if (RANGE_VALUE_OPERATORS_LIST.includes(operator)) {
            if (Array.isArray(contextValue)) {
              value = contextValue.at(0)
              valueTo = contextValue.at(1)
            } else {
              value = contextValue
              valueTo = rootGetters.getValueOfField({
                containerUuid: containerUuid,
                columnName: columnNameTo
              })
            }
          } else {
            value = contextValue
          }
        } else {
          if (Array.isArray(contextValue)) {
            values = contextValue
          } else {
            value = contextValue
          }
        }
      }

      // if ((!isEmptyValue(value) || !isEmptyValue(valueTo) || !isEmptyValue(values)) || isNullOperator) {
      queryParams.push({
        columnName: column_name,
        operator,
        value,
        valueTo,
        values
      })
      // }
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
      if (isEmptyValue(fieldsList)) return []
    }

    const fieldsEmpty = fieldsList.filter(fieldItem => {
      if (fieldItem.is_info_only) {
        return false
      }
      const isMandatoryGenerated = isMandatoryField(fieldItem)
      const isDisplayedGenerated = isDisplayedField(fieldItem)

      if (!(isDisplayedGenerated && isMandatoryGenerated)) {
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
        const isMandatoryGenerated = mandatoryMethod(fieldItem)

        if (isMandatoryGenerated) {
          return false
        }

        const { default_value } = fieldItem
        if (isEvaluateDefaultValue && isEvaluateShowed) {
          return showedMethod(fieldItem) &&
            !isEmptyValue(default_value)
        }

        if (isEvaluateDefaultValue) {
          return !isEmptyValue(default_value)
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
      return itemField.column_name === columnName
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
      return itemField.element_name === columnName
    })
  }

}
