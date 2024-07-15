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
  READ_ONLY_FORM_COLUMNS,
  SALES_TRANSACTION_COLUMNS
} from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import evaluator from '@/utils/ADempiere/contextUtils/evaluator'
import { getContext, parseContext, getPreference, isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { arrayMatches, isEmptyValue, parsedValueComponent } from '@/utils/ADempiere/valueUtils'
import { isNumberField, isIdentifierField } from '@/utils/ADempiere/references'

/**
 * Extracts the associated fields from the logics or default values
 * @param {string} display_logic
 * @param {string} mandatory_logic
 * @param {string} read_only_logic
 * @param {object} reference.context_column_names array
 * @param {string} default_value
 * @param {string} default_value_to
 * @param {array} context_column_names array
 * @returns {array} List column name of parent fields
 */
export function getParentFields({
  display_logic,
  mandatory_logic,
  read_only_logic,
  reference,
  default_value,
  context_column_names = [],
  default_value_to
}) {
  let contextColumnNamesByReference = []
  // validate reference
  if (!isEmptyValue(reference) && !isEmptyValue(reference.context_column_names)) {
    contextColumnNamesByReference = reference.context_column_names
  }

  // remove duplicated elements
  const parentFields = [
    ...new Set([
      // For Validation Code
      ...contextColumnNamesByReference,
      // For Display logic
      ...evaluator.parseDepends(display_logic),
      // For Mandatory Logic
      ...evaluator.parseDepends(mandatory_logic),
      // For Read Only Logic
      ...evaluator.parseDepends(read_only_logic),
      // For Default Value
      ...context_column_names,
      // For Default Value
      ...evaluator.parseDepends(default_value),
      // For Default Value To
      ...evaluator.parseDepends(default_value_to)
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
  display_logic,
  mandatory_logic,
  read_only_logic
}) {
  // evaluate logics
  const commonParameters = {
    parentUuid,
    containerUuid,
    context: getContext
  }

  let isDisplayedFromLogic = isEmptyValue(display_logic)
  if (!isDisplayedFromLogic) {
    isDisplayedFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: display_logic
    })
  }

  let isMandatoryFromLogic = false
  if (!isEmptyValue(mandatory_logic)) {
    isMandatoryFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: mandatory_logic
    })
  }

  let isReadOnlyFromLogic = false
  if (!isEmptyValue(read_only_logic)) {
    isReadOnlyFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: read_only_logic
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
 * @param {boolean} isSOTrxDictionary
 */
export function getContextDefaultValue({
  parentUuid,
  containerUuid,
  isSOTrxDictionary,
  column_name,
  element_name,
  componentPath,
  display_type,
  default_value,
  is_mandatory,
  isColumnReadOnlyForm,
  is_key
}) {
  let parsedDefaultValue = default_value

  const isContextValue = String(parsedDefaultValue).includes('@')

  // search value with context
  if (isContextValue && String(parsedDefaultValue).trim() !== '-1') {
    parsedDefaultValue = parseContext({
      parentUuid,
      containerUuid,
      columnName: column_name,
      value: parsedDefaultValue,
      isSOTrxDictionary
    }).value
  }

  const isSpeciaColumn = !isEmptyValue(arrayMatches(ACCOUNTING_COLUMNS, [column_name, element_name]))
  // search value with context
  if (isSpeciaColumn && String(parsedDefaultValue).trim() !== '-1') {
    parsedDefaultValue = getPreference({
      parentUuid,
      containerUuid,
      columnName: column_name
    })
  }

  // search value preference with column name
  if (isEmptyValue(parsedDefaultValue) && !is_key &&
    String(parsedDefaultValue).trim() !== '-1') {
    parsedDefaultValue = getPreference({
      parentUuid,
      containerUuid,
      columnName: column_name
    })

    // search value preference with element name
    if (!isEmptyValue(element_name) &&
      isEmptyValue(parsedDefaultValue)) {
      parsedDefaultValue = getPreference({
        parentUuid,
        containerUuid,
        columnName: element_name
      })
    }
  }

  // search value with form read only
  if (isColumnReadOnlyForm && isEmptyValue(parsedDefaultValue)) {
    const { defaultValue: defaultValueColumn } = READ_ONLY_FORM_COLUMNS.find(columnItem => {
      return columnItem.columnName === column_name
    })
    parsedDefaultValue = defaultValueColumn
  }

  // set default value
  if (!isContextValue) {
    if (isEmptyValue(parsedDefaultValue)) {
      parsedDefaultValue = default_value
    }
    if (isEmptyValue(parsedDefaultValue)) {
      if (isNumberField(display_type)) {
        if (is_mandatory) {
          parsedDefaultValue = 0
        }
      } else if (isIdentifierField(display_type)) {
        parsedDefaultValue = -1
      }
    }
  }

  if (isEmptyValue(parsedDefaultValue) && SALES_TRANSACTION_COLUMNS.includes(element_name)) {
    parsedDefaultValue = isSalesTransaction({
      parentUuid,
      containerUuid,
      isRecord: true
    })
  }

  // convert to element-ui compatible value
  parsedDefaultValue = parsedValueComponent({
    columnName: column_name,
    componentPath,
    displayType: display_type,
    isMandatory: is_mandatory,
    value: parsedDefaultValue
  })

  return parsedDefaultValue
}
