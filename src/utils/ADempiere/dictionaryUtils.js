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

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { decodeHtmlEntities } from '@/utils/ADempiere/formatValue/stringFormat'
import {
  getContextDefaultValue, getEvaluatedFieldLogics, getParentFields
} from '@/utils/ADempiere/contextUtils/contextField'
import REFERENCES, { YES_NO, DEFAULT_SIZE, isHiddenField } from '@/utils/ADempiere/references'
import {
  FIELD_OPERATORS_LIST, OPERATOR_EQUAL,
  OPERATOR_LIKE, OPERATOR_GREATER_EQUAL, OPERATOR_LESS_EQUAL, OPERATOR_BETWEEN
} from '@/utils/ADempiere/dataUtils'
import {
  CURRENCY,
  DOCUMENT_ACTION,
  DOCUMENT_STATUS,
  isDocumentStatus,
  readOnlyColumn
} from '@/utils/ADempiere/constants/systemColumns'

/**
 * Display Column Prefix on Column Name: "DisplayColumn_ColumnName"
 */
export const DISPLAY_COLUMN_PREFIX = `DisplayColumn_`

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
  isSOTrxMenu
}) {
  const { columnName } = fieldToGenerate
  let isGetServerValue = false
  let isColumnReadOnlyForm = false
  let isChangedAllForm = false
  let valueIsReadOnlyForm

  let isColumnDocumentStatus = false

  const componentReference = evalutateTypeField(fieldToGenerate.displayType)

  // evaluate logics (diplayed, mandatory, readOnly)
  let evaluatedLogics = getEvaluatedFieldLogics({
    parentUuid: moreAttributes.parentUuid,
    containerUuid: moreAttributes.containerUuid,
    ...fieldToGenerate
  })

  let parentFieldsList = []
  let parsedDefaultValue = fieldToGenerate.defaultValue
  let parsedDefaultValueTo = fieldToGenerate.defaultValueTo
  let operator
  let isNumericField = componentReference.componentPath === 'FieldNumber'
  let isTranslatedField = fieldToGenerate.isTranslated
  let isComparisonField = false // to list operators comparison
  let operatorsList = []
  if (moreAttributes.isAdvancedQuery) {
    isNumericField = false
    isTranslatedField = false
    parsedDefaultValue = undefined
    parsedDefaultValueTo = undefined

    // mandatory, read only and displayed is changed to FilterFields component
    evaluatedLogics = {
      isDisplayedFromLogic: true,
      isMandatoryFromLogic: false,
      isReadOnlyFromLogic: false
    }
    fieldToGenerate.isDisplayed = true
    fieldToGenerate.isReadOnly = false
    // Is mandatory to showed available filter fields
    fieldToGenerate.isMandatory = false
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
      isSOTrxMenu
    })

    if (String(fieldToGenerate.defaultValue).startsWith('@SQL=')) {
      // isShowedFromUser = true
      isGetServerValue = true
    }

    // VALUE TO
    if (fieldToGenerate.isRange) {
      parsedDefaultValueTo = getContextDefaultValue({
        ...fieldToGenerate,
        isColumnReadOnlyForm,
        parentUuid: moreAttributes.parentUuid,
        containerUuid: moreAttributes.containerUuid,
        componentPath: componentReference.componentPath,
        defaultValue: fieldToGenerate.defaultValueTo,
        columnName: `${columnName}_To`,
        elementName: `${fieldToGenerate.elementName}_To`,
        isSOTrxMenu
      })

      if (String(fieldToGenerate.defaultValueTo).startsWith('@SQL=')) {
        isGetServerValue = true
      }
    }

    parentFieldsList = getParentFields(fieldToGenerate)

    // manage document status and tag document status
    isColumnDocumentStatus = isDocumentStatus({
      columnName,
      elementColumnName: fieldToGenerate.elementColumnName
    })
  }
  // set field operators list
  if (moreAttributes.isAdvancedQuery || fieldToGenerate.isQueryCriteria) {
    operator = OPERATOR_EQUAL.operator
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

  const field = {
    ...fieldToGenerate,
    ...moreAttributes,
    name: decodeHtmlEntities(
      fieldToGenerate.name
    ),
    columnNameTo: undefined,
    elementNameTo: undefined,
    isSameColumnElement: columnName === fieldToGenerate.elementColumnName,
    isSOTrxMenu,
    // displayed attributes
    componentPath: componentReference.componentPath,
    isSupported: componentReference.isSupported,
    size: componentReference.size || DEFAULT_SIZE,
    displayColumnName: DISPLAY_COLUMN_PREFIX + columnName, // key to display column
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
    // dependentFieldsList: [],
    // TODO: Add support on server
    // app attributes
    isShowedFromUser: false,
    isShowedFromUserDefault: false, // set this value when reset panel
    isShowedTableFromUser: false,
    isShowedTableFromUserDefault: false,
    isFixedTableColumn: false,
    valueType: componentReference.valueType, // value type to convert with gGRPC
    isGetServerValue,
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
  if (field.isRange) {
    field.operator = OPERATOR_BETWEEN.operator
    if (field.isNumericField) {
      field.operator = OPERATOR_GREATER_EQUAL.operator
    }

    field.columnNameTo = `${columnName}_To`
    field.elementNameTo = `${field.elementName}_To`
    if (typeRange) {
      field.operator = OPERATOR_LESS_EQUAL.operator
      field.uuid = `${field.uuid}_To`
      field.columnName = field.columnNameTo
      field.elementName = field.elementNameTo
      field.name = `${field.name} To`
      field.value = parsedDefaultValueTo
      field.defaultValue = field.defaultValueTo
      field.parsedDefaultValue = field.parsedDefaultValueTo

      // increment order sequence
      field.sequence = field.sequence > 0 ? field.sequence + 1 : 0
      field.seqNoGrid = field.seqNoGrid > 0 ? field.seqNoGrid + 1 : 0
      field.sortNo = field.sortNo > 0 ? field.sortNo + 1 : 0

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
    field.isDisplayedGrid = false
    field.isDisplayed = false
  }

  return field
}

/**
 * Determinate if field is displayed
 * @param {boolean} isActive
 * @param {boolean} isDisplayed
 * @param {boolean} isDisplayedFromLogic
 * @param {boolean} isQueryCriteria
 * @param {string}  panelType
 * @returns {boolean}
 */
export function fieldIsDisplayed({
  // standard
  panelType,
  isActive,
  isDisplayed,
  displayType,
  // panel
  isQueryCriteria,
  isKey,
  // table
  isDisplayedGrid,
  // other
  isDisplayedFromLogic
}, isTable = false) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  // verify if field is active
  if (!isActive || !isDisplayed) {
    return false
  }

  // window (record navigation and tab childs), browser (table result)
  if (isTable) {
    return fieldIsDisplayedTable({
      // standard
      panelType,
      // table,
      isKey,
      isDisplayedGrid,
      // other
      isDisplayedFromLogic
    })
  }

  // window, process and report, browser (table result)
  return fieldIsDisplayedPanel({
    // standard
    panelType,
    // panel
    isQueryCriteria,
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
  isQueryCriteria,
  // other
  isDisplayedFromLogic
}) {
  // browser query criteria
  if (panelType === 'browser') {
    return isQueryCriteria
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
  isKey,
  isDisplayedGrid,
  // other
  isDisplayedFromLogic
}) {
  // window table
  if (panelType === 'window' && !isDisplayedGrid) {
    return false
  }

  // window , browser (table) result
  return isDisplayedFromLogic &&
    !isKey
}

/**
 * Convert action to action name for route
 * @param {string} action
 * @returns {object}
 */
export function convertAction(action) {
  const actionAttributes = {
    name: '',
    icon: '',
    hidden: false,
    isIndex: false,
    component: () => import('@/views/ADempiere/Unsupported')
  }
  switch (action) {
    case 'B':
      actionAttributes.name = 'workbech'
      actionAttributes.icon = 'peoples'
      break
    case 'F':
      actionAttributes.name = 'workflow'
      actionAttributes.icon = 'example'
      actionAttributes.component = () => import('@/views/ADempiere/Workflow')
      break
    case 'P':
      actionAttributes.name = 'process'
      actionAttributes.icon = 'component'
      actionAttributes.component = () => import('@/views/ADempiere/Process')
      break
    case 'R':
      actionAttributes.name = 'report'
      actionAttributes.icon = 'skill'
      actionAttributes.component = () => import('@/views/ADempiere/Report')
      break
    case 'S':
      actionAttributes.name = 'browser'
      actionAttributes.icon = 'search'
      actionAttributes.component = () => import('@/views/ADempiere/Browser')
      break
    case 'T':
      actionAttributes.name = 'task'
      actionAttributes.icon = 'size'
      break
    case 'W':
      actionAttributes.name = 'window'
      actionAttributes.icon = 'tab'
      actionAttributes.component = () => import('@/views/ADempiere/Window')
      break
    case 'X':
      actionAttributes.name = 'form'
      actionAttributes.icon = 'form'
      actionAttributes.component = () => import('@/views/ADempiere/Form')
      break
    default:
      actionAttributes.name = 'summary'
      actionAttributes.icon = 'nested'
      // actionAttributes.hidden = true
      actionAttributes.isIndex = true
      actionAttributes.component = () => import('@/views/ADempiere/Summary')
      break
  }
  return actionAttributes
}
