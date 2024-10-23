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

import lang from '@/lang'

// Constants
import REFERENCES, { BUTTON, DEFAULT_SIZE, LIST, YES_NO } from '@/utils/ADempiere/references'
import {
  FIELD_OPERATORS_LIST, OPERATOR_EQUAL,
  OPERATOR_LIKE, OPERATOR_GREATER_EQUAL, OPERATOR_LESS_EQUAL, OPERATOR_BETWEEN
} from '@/utils/ADempiere/dataUtils'
import {
  CURRENCY, DOCUMENT_ACTION, DOCUMENT_STATUS
} from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getTableNameFromReference, isSupportLookup } from '@/utils/ADempiere/references'
import { decodeHtmlEntities } from '@/utils/ADempiere/formatValue/stringFormat'
import {
  getContextDefaultValue, getEvaluatedFieldLogics, getParentFields
} from '@/utils/ADempiere/contextUtils/contextField'
import { isHiddenField, isLookup } from '@/utils/ADempiere/references'
import {
  isDocumentStatus, readOnlyColumn
} from '@/utils/ADempiere/constants/systemColumns'

/**
 * Display Column Prefix on Column Name: "DisplayColumn_ColumnName"
 */
export const DISPLAY_COLUMN_PREFIX = `DisplayColumn_`

/**
 * Sort Column Prefix on Column Name: "SortColumn_ColumnName"
 */
export const SORT_COLUMN_PREFIX = `SortColumn_`

/**
 * Identifier Column Suffix on Column Name: "_ID"
 */
export const IDENTIFIER_COLUMN_SUFFIX = `_ID`

/**
 * Universally Unique Identifier Column Suffix on Column Name: "_UUID"
 */
export const UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX = `_UUID`

/**
 * Suffix Field is Advanced Query
 */
export const IS_ADVANCED_QUERY = '-IS_ADVANCED_QUERY'

/**
 * Always get display column
 */
export const ALWAYS_DISPLAY_COLUMN = [
  CURRENCY,
  DOCUMENT_ACTION,
  DOCUMENT_STATUS
]

/**
 * Evaluate by the ID and name of the reference to call the component type
 * @param {integer} displayTypeId, received from data
 * @param {boolean} isAllInfo
 * @return string type, assigned value to folder after evaluating the parameter
 */
export function evalutateTypeField(displayTypeId, isAllInfo = true) {
  const component = REFERENCES.find(reference => displayTypeId === reference.id)
  if (isAllInfo) {
    return component
  }
  return component.componentPath
}

/**
 * Generate field to app
 * @param {object}  fieldToGenerate
 * @param {object}  moreAttributes, additional attributes
 * @param {boolean} typeRange, indicate if this field is a range used as _To
 */
export function generateField({
  fieldToGenerate,
  moreAttributes,
  typeRange = false,
  evaluateDefaultFieldShowed = ({ isShowedFromUser }) => {
    return isShowedFromUser
  },
  evaluateDefaultColumnShowed = ({ isShowedTableFromUser = true }) => {
    return isShowedTableFromUser
  },
  isSOTrxDictionary
}) {
  const { column_name: columnName } = fieldToGenerate
  let isGetServerValue = false
  let isColumnReadOnlyForm = false
  let isChangedAllForm = false
  let valueIsReadOnlyForm

  let isColumnDocumentStatus = false
  let componentReference = evalutateTypeField(fieldToGenerate.display_type)

  // overwrite `Button` to `List` or `Table` display type.
  if (fieldToGenerate.display_type === BUTTON.id) {
    if ((moreAttributes.isAdvancedQuery || fieldToGenerate.is_query_criteria) &&
      fieldToGenerate.reference && fieldToGenerate.reference.reference_id > 0 && fieldToGenerate.reference.reference_value_id > 0) {
      // overwrite if is with reference
      componentReference = evalutateTypeField(fieldToGenerate.reference.reference_id)
      fieldToGenerate.display_type = fieldToGenerate.reference.reference_id
      fieldToGenerate.reference = {
        table_name: fieldToGenerate.reference.table_name,
        context_column_names: []
      }
    } else if ([columnName, fieldToGenerate.element_name].includes('PaymentRule')) {
      componentReference = LIST
      fieldToGenerate.display_type = LIST.id
      fieldToGenerate.reference = {
        table_name: 'AD_Ref_List',
        reference_id: LIST.id,
        context_column_names: []
      }
    }
  }

  // evaluate logics (diplayed, mandatory, readOnly)
  let evaluatedLogics = getEvaluatedFieldLogics({
    parentUuid: moreAttributes.parentUuid,
    containerUuid: moreAttributes.containerUuid,
    ...fieldToGenerate
  })

  let parentFieldsList = []
  let parsedDefaultValue = fieldToGenerate.default_value
  let parsedDefaultValueTo = fieldToGenerate.default_value_to
  const isNumericField = componentReference.componentPath === 'FieldNumber'
  let isTranslatedField = fieldToGenerate.is_translated
  let isComparisonField = false // to list operators comparison
  if (moreAttributes.isAdvancedQuery) {
    // isNumericField = false // disable calculator popover
    isTranslatedField = false
    parsedDefaultValue = undefined
    parsedDefaultValueTo = undefined

    // mandatory, read only and displayed is changed to FilterFields component
    evaluatedLogics = {
      isDisplayedFromLogic: true,
      isMandatoryFromLogic: false,
      isReadOnlyFromLogic: false
    }
    fieldToGenerate.is_displayed = true
    fieldToGenerate.is_read_only = false
    // Is mandatory to showed available filter fields
    fieldToGenerate.is_mandatory = false
  } else {
    // Yes No value, and form manage
    if (moreAttributes.isReadOnlyFromForm && YES_NO.id === fieldToGenerate.displayType) {
      const columnReadOnly = readOnlyColumn(columnName)
      if (!isEmptyValue(columnReadOnly)) {
        isColumnReadOnlyForm = true
        isChangedAllForm = columnReadOnly.isChangedAllForm
        valueIsReadOnlyForm = columnReadOnly.valueIsReadOnlyForm
      }
    }

    parsedDefaultValue = getContextDefaultValue({
      ...fieldToGenerate,
      isColumnReadOnlyForm,
      parentUuid: moreAttributes.parentUuid,
      containerUuid: moreAttributes.containerUuid,
      componentPath: componentReference.componentPath,
      isSOTrxDictionary
    })

    if (String(fieldToGenerate.default_value).startsWith('@SQL=')) {
      // isShowedFromUser = true
      isGetServerValue = true
    }

    // VALUE TO
    if (fieldToGenerate.is_range) {
      parsedDefaultValueTo = getContextDefaultValue({
        ...fieldToGenerate,
        isColumnReadOnlyForm,
        parentUuid: moreAttributes.parentUuid,
        containerUuid: moreAttributes.containerUuid,
        componentPath: componentReference.componentPath,
        default_value: fieldToGenerate.default_value_to,
        column_name: `${columnName}_To`,
        element_name: `${fieldToGenerate.element_name}_To`,
        isSOTrxDictionary
      })

      if (String(fieldToGenerate.default_value_to).startsWith('@SQL=')) {
        isGetServerValue = true
      }
    }

    parentFieldsList = getParentFields(fieldToGenerate)

    // manage document status and tag document status
    isColumnDocumentStatus = isDocumentStatus({
      columnName,
      elementColumnName: fieldToGenerate.element_name
    })
  }

  // set field operators list
  let operator = OPERATOR_EQUAL.operator // by default equal
  let operatorsList = []
  if (moreAttributes.isAdvancedQuery || fieldToGenerate.is_query_criteria || moreAttributes.isLegacyReport === false) {
    isComparisonField = !['FieldBinary', 'FieldButton', 'FieldImage'].includes(componentReference.componentPath)
    if (isComparisonField) {
      const operatorsField = FIELD_OPERATORS_LIST.find(item => {
        return item.componentPath === componentReference.componentPath
      })
      if (operatorsField) {
        operatorsList = operatorsField.operatorsList
      }
    }

    if (['FieldText', 'FieldTextLong', 'FieldUrl'].includes(componentReference.componentPath)) {
      operator = OPERATOR_LIKE.operator
    }
    if (['FieldDate', 'FieldTime'].includes(componentReference.componentPath)) {
      operator = OPERATOR_BETWEEN.operator
    }
  }

  let elementColumnName
  let isSameColumnElement = false
  if (isEmptyValue(fieldToGenerate.element_name)) {
    elementColumnName = fieldToGenerate.column_name
    isSameColumnElement = true
  } else {
    elementColumnName = fieldToGenerate.element_name
  }
  let referenceTableName = null
  if (isLookup(fieldToGenerate.display_type)) {
    referenceTableName = getTableNameFromReference(elementColumnName, fieldToGenerate.display_type)
  }

  const field = {
    ...fieldToGenerate,
    ...moreAttributes,
    name: decodeHtmlEntities(
      fieldToGenerate.name
    ),
    columnName: columnName,
    columnNameTo: `${columnName}_To`,
    elementColumnName,
    elementNameTo: `${elementColumnName}_To`,
    isSameColumnElement: isSameColumnElement,
    isSOTrxDictionary,
    referenceTableName,
    // displayed attributes
    displayTypeName: componentReference.name,
    componentPath: componentReference.componentPath,
    isSupported: componentReference.isSupported,
    size: componentReference.size || DEFAULT_SIZE,
    displayColumnName: DISPLAY_COLUMN_PREFIX + columnName, // key to display column
    sortByProperty: !isSupportLookup(fieldToGenerate.display_type) ? columnName : SORT_COLUMN_PREFIX + DISPLAY_COLUMN_PREFIX + columnName,
    // value attributes
    parsedDefaultValue,
    parsedDefaultValueTo,
    // logics to app (isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic)
    isReadOnlyFromForm: false,
    isColumnReadOnlyForm,
    isChangedAllForm,
    valueIsReadOnlyForm,
    ...evaluatedLogics,
    //
    parentFieldsList,
    // dependent_fields: [],
    // TODO: Add support on server
    // app attributes
    isShowedFromUser: false,
    isShowedFromUserDefault: false, // set this value when reset panel
    isShowedTableFromUser: false,
    isShowedTableFromUserDefault: false,
    isFixedTableColumn: false,
    valueType: componentReference.valueType, // value type to convert with gGRPC
    isGetServerValue,
    isGeneratedRange: typeRange,
    // Advanced query
    operator, // current operator
    oldOperator: undefined, // old operator
    defaultOperator: operator,
    operatorsList,
    // popover's
    isEnabledOptionsFields: false,
    isColumnDocumentStatus,
    isComparisonField,
    isNumericField,
    isTranslatedField
  }

  // Overwrite some values
  if (field.is_range) {
    field.operator = OPERATOR_BETWEEN.operator
    if (field.isNumericField) {
      field.operator = OPERATOR_GREATER_EQUAL.operator
    }
    if (typeRange) {
      field.operator = OPERATOR_LESS_EQUAL.operator
      field.uuid = `${field.uuid}_To`
      field.columnName = field.columnNameTo
      field.column_name = field.columnNameTo
      field.elementName = field.elementNameTo
      field.element_name = field.elementNameTo
      field.name = `${field.name} ${lang.t('field.to')}`
      field.value = parsedDefaultValueTo
      field.default_value = field.default_value_to
      field.parsedDefaultValue = field.parsedDefaultValueTo

      // increment order sequence
      field.sequence = field.sequence > 0 ? field.sequence + 1 : 0
      field.seq_no_grid = field.seq_no_grid > 0 ? field.seq_no_grid + 1 : 0
      field.sort_no = field.sort_no > 0 ? field.sort_no + 1 : 0

      // if field with value displayed in main panel
      field.isShowedFromUser = evaluateDefaultFieldShowed({
        ...field,
        parsedDefaultValue: parsedDefaultValueTo
      })
      field.isShowedTableFromUser = evaluateDefaultColumnShowed({
        ...field,
        parsedDefaultValue: parsedDefaultValueTo
      })
    }
  }

  // if field with value displayed in main panel
  if (!typeRange) {
    field.isShowedFromUser = evaluateDefaultFieldShowed({
      ...field,
      parsedDefaultValue
    })
    field.isShowedTableFromUser = evaluateDefaultColumnShowed({
      ...field,
      parsedDefaultValue
    })
  }
  field.isShowedFromUserDefault = field.isShowedFromUser
  field.isShowedTableFromUserDefault = field.isShowedTableFromUser

  // hidden field type button
  if (isHiddenField(field.displayType)) {
    field.isDisplayedFromLogic = false
    field.is_displayed_grid = false
    field.is_displayed = false
  }

  return field
}

/**
 * Determinate if field is displayed
 * @param {boolean} is_displayed
 * @param {boolean} isDisplayedFromLogic
 * @param {boolean} is_query_criteria
 * @param {string}  panelType
 * @returns {boolean}
 */
export function fieldIsDisplayed({
  // standard
  panelType,
  is_displayed,
  displayType,
  // panel
  is_query_criteria,
  is_key,
  // table
  is_displayed_grid,
  // other
  isDisplayedFromLogic
}, isTable = false) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  // verify if field is active
  if (!is_displayed) {
    return false
  }

  // window (record navigation and tab childs), browser (table result)
  if (isTable) {
    return fieldIsDisplayedTable({
      // standard
      panelType,
      // table,
      is_key,
      is_displayed_grid,
      // other
      isDisplayedFromLogic
    })
  }

  // window, process and report, browser (table result)
  return fieldIsDisplayedPanel({
    // standard
    panelType,
    // panel
    is_query_criteria,
    // other
    isDisplayedFromLogic
  })
}

/**
 * Determinate if field is displayed in panel
 * @returns {boolean}
 */
export function fieldIsDisplayedPanel({
  // standard
  panelType,
  // panel
  is_query_criteria,
  // other
  isDisplayedFromLogic
}) {
  // browser query criteria
  if (panelType === 'browser') {
    return is_query_criteria
  }

  // window, process and report
  return isDisplayedFromLogic
}

/**
 * Determinate if field/column is displayed in table
 * @returns {boolean}
 */
export function fieldIsDisplayedTable({
  // standard
  panelType,
  // table,
  is_key,
  is_displayed_grid,
  // other
  isDisplayedFromLogic
}) {
  // window table
  if (panelType === 'window' && !is_displayed_grid) {
    return false
  }

  // window , browser (table) result
  return isDisplayedFromLogic &&
    !is_key
}
