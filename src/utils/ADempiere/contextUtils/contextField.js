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
  ACCOUNTING_COLUMNS,
  READ_ONLY_FORM_COLUMNS
} from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import evaluator from '@/utils/ADempiere/contextUtils/evaluator'
import { getContext, parseContext, getPreference } from '@/utils/ADempiere/contextUtils'
import { arrayMatches, isEmptyValue, parsedValueComponent } from '@/utils/ADempiere/valueUtils'
import { isNumberField, isIdentifier } from '@/utils/ADempiere/references'

/**
 * Extracts the associated fields from the logics or default values
 * @param {string} displayLogic
 * @param {string} mandatoryLogic
 * @param {string} readOnlyLogic
 * @param {object} reference.contextColumnNames array
 * @param {string} defaultValue
 * @param {string} defaultValueTo
 * @returns {array} List column name of parent fields
 */
export function getParentFields({
  displayLogic,
  mandatoryLogic,
  readOnlyLogic,
  reference,
  defaultValue,
  contextColumnNames = [],
  defaultValueTo
}) {
  let contextColumnNamesByReference = []
  // validate reference
  if (!isEmptyValue(reference) && !isEmptyValue(reference.contextColumnNames)) {
    contextColumnNamesByReference = reference.contextColumnNames
  }

  // remove duplicated elements
  const parentFields = [
    ...new Set([
      // For Validation Code
      ...contextColumnNamesByReference,
      // For Display logic
      ...evaluator.parseDepends(displayLogic),
      // For Mandatory Logic
      ...evaluator.parseDepends(mandatoryLogic),
      // For Read Only Logic
      ...evaluator.parseDepends(readOnlyLogic),
      // For Default Value
      ...contextColumnNames,
      // For Default Value
      ...evaluator.parseDepends(defaultValue),
      // For Default Value To
      ...evaluator.parseDepends(defaultValueTo)
    ])
  ]

  return parentFields
}

/**
 * Evaluate logics to definition field
 * @param {object}
 */
export function getEvaluatedFieldLogics({
  parentUuid,
  containerUuid,
  displayLogic,
  mandatoryLogic,
  readOnlyLogic
}) {
  // evaluate logics
  const commonParameters = {
    parentUuid,
    containerUuid,
    context: getContext
  }

  let isDisplayedFromLogic = isEmptyValue(displayLogic)
  if (!isDisplayedFromLogic) {
    isDisplayedFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: displayLogic
    })
  }

  let isMandatoryFromLogic = false
  if (!isEmptyValue(mandatoryLogic)) {
    isMandatoryFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: mandatoryLogic
    })
  }

  let isReadOnlyFromLogic = false
  if (!isEmptyValue(readOnlyLogic)) {
    isReadOnlyFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: readOnlyLogic
    })
  }

  return {
    isDisplayedFromLogic,
    isMandatoryFromLogic,
    isReadOnlyFromLogic
  }
}

/**
 * Get parsed default value to set into field
 * @param {object}  field
 * @param {boolean} isSOTrxMenu
 */
export function getContextDefaultValue({
  parentUuid,
  containerUuid,
  isSOTrxMenu,
  columnName,
  elementName,
  componentPath,
  displayType,
  defaultValue,
  isMandatory,
  isColumnReadOnlyForm,
  isKey
}) {
  let parsedDefaultValue = defaultValue

  const isContextValue = String(parsedDefaultValue).includes('@')

  // search value with context
  if (isContextValue && String(parsedDefaultValue).trim() !== '-1') {
    parsedDefaultValue = parseContext({
      parentUuid,
      containerUuid,
      columnName,
      value: parsedDefaultValue,
      isSOTrxMenu
    }).value
  }

  const isSpeciaColumn = !isEmptyValue(arrayMatches(ACCOUNTING_COLUMNS, [columnName, elementName]))
  // search value with context
  if (isSpeciaColumn && String(parsedDefaultValue).trim() !== '-1') {
    parsedDefaultValue = getPreference({
      parentUuid,
      containerUuid,
      columnName
    })
  }

  // search value preference with column name
  if (isEmptyValue(parsedDefaultValue) && !isKey &&
    String(parsedDefaultValue).trim() !== '-1') {
    parsedDefaultValue = getPreference({
      parentUuid,
      containerUuid,
      columnName
    })

    // search value preference with element name
    if (!isEmptyValue(elementName) &&
      isEmptyValue(parsedDefaultValue)) {
      parsedDefaultValue = getPreference({
        parentUuid,
        containerUuid,
        columnName: elementName
      })
    }
  }

  // search value with form read only
  if (isColumnReadOnlyForm && isEmptyValue(parsedDefaultValue)) {
    const { defaultValue: defaultValueColumn } = READ_ONLY_FORM_COLUMNS.find(columnItem => {
      return columnItem.columnName === columnName
    })
    parsedDefaultValue = defaultValueColumn
  }

  // set default value
  if (!isContextValue) {
    if (isEmptyValue(parsedDefaultValue)) {
      parsedDefaultValue = defaultValue
    }
    if (isEmptyValue(parsedDefaultValue)) {
      if (isNumberField(displayType)) {
        if (isMandatory) {
          parsedDefaultValue = 0
        }
      } else if (isIdentifier(displayType)) {
        parsedDefaultValue = -1
      }
    }
  }

  // convert to element-ui compatible value
  parsedDefaultValue = parsedValueComponent({
    columnName,
    componentPath,
    displayType,
    isMandatory,
    value: parsedDefaultValue
  })

  return parsedDefaultValue
}
