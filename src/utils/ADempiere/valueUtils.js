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

import language from '@/lang'
import store from '@/store'
import router from '@/router'

// Constants
import { SPECIAL_ZERO_ID_TABLES } from '@/utils/ADempiere//constants/systemColumns'
import { LIST, TABLE, TABLE_DIRECT } from '@/utils/ADempiere/references.js'
import { DISPLAY_COLUMN_PREFIX, IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'
import { OPERATION_PATTERN } from '@/utils/ADempiere/formatValue/numberFormat.js'

// Utils and Helper Methods
import { convertBooleanToString, convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { removeQuotationMark } from '@/utils/ADempiere/formatValue/stringFormat'
import { isIdentifier } from '@/utils/ADempiere/references.js'

/**
 * Checks if value is empty. Deep-checks arrays and objects
 * Note: isEmpty([]) == true, isEmpty({}) == true,
 * isEmpty([{0: false}, "", 0]) == true, isEmpty({0: 1}) == false
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @link https://gist.github.com/EdwinBetanc0urt/3fc02172ada073ded4b52e46543553ce
 * @param {boolean|array|object|number|string|date|map|set|function} value
 * @returns {boolean}
 */
export const isEmptyValue = function(value) {
  // Custom empty value ADempiere to lookup
  if (String(value).trim() === '-1') {
    return true
  }

  let isEmpty = false
  const typeOfValue = getTypeOfValue(value)

  switch (typeOfValue) {
    case 'UNDEFINED':
    case 'ERROR':
    case 'NULL':
      isEmpty = true
      break
    case 'BOOLEAN':
    case 'DATE':
    case 'FUNCTION': // Or class
    case 'PROMISE':
    case 'REGEXP':
      isEmpty = false
      break
    case 'STRING':
      isEmpty = Boolean(!value.trim().length)
      break
    case 'MATH':
    case 'NUMBER':
      if (Number.isNaN(value)) {
        isEmpty = true
        break
      }
      isEmpty = false
      break
    case 'JSON':
      if (value.trim().length) {
        isEmpty = Boolean(value.trim() === '{}')
        break
      }
      isEmpty = true
      break
    case 'OBJECT':
      isEmpty = Boolean(!Object.keys(value).length)
      break
    case 'ARGUMENTS':
    case 'ARRAY':
      isEmpty = Boolean(!value.length)
      break
    case 'MAP':
    case 'SET':
      isEmpty = Boolean(!value.size)
      break
  }

  return isEmpty
}

export const closeTagView = function(currentRoute) {
  if (isEmptyValue(currentRoute)) currentRoute = router.app._route
  const tabViewsVisited = store.getters.visitedViews
  store.dispatch('tagsView/delView', currentRoute)
  const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
  if (!isEmptyValue(oldRouter)) {
    router.push({
      path: oldRouter.path
    }, () => {})
  }
}

/**
 * Is identifier empty value
 * @param {string} columnName
 * @param {mixed} value
 * @returns {boolean}
 */
export function isIdentifierEmpty({
  columnName,
  value
}) {
  if (isEmptyValue(value)) {
    return true
  }
  columnName = columnName.replace(/\$|#/g, '')

  const isSpecialZeroUpdate = SPECIAL_ZERO_ID_TABLES.some(tableName => {
    return columnName.startsWith(tableName)
  })
  if (isSpecialZeroUpdate) {
    return false
  }

  if (!columnName.startsWith(DISPLAY_COLUMN_PREFIX) &&
    (columnName.endsWith(IDENTIFIER_COLUMN_SUFFIX) ||
    columnName.endsWith('_ID_To')) &&
    String(value).trim() === '0') {
    return true
  }

  return false
}

/**
 * It is the same value for both
 * @param {mixed} valueA
 * @param {mixed} valueB
 * @returns {boolean} if valueA equal to valueB
 */
export function isSameValues(valueA, valueB) {
  return valueA === valueB ||
    (isEmptyValue(valueA) && isEmptyValue(valueB))
}

/**
 * Evaluates the type of data sent, useful with 'array' type data as the typeof
 * function returns 'object' in this and other cases.
 * @deprecated change by getTypeOfValue method
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @link https://gist.github.com/EdwinBetanc0urt/3fc02172ada073ded4b52e46543553ce
 * @param {boolean|array|object|number|string|date|map|set|function} value
 * @returns {string} value type in capital letters (STRING, NUMBER, BOOLEAN, ...)
 */
export function typeValue(value) {
  return getTypeOfValue(value)
}
/**
 * Evaluates the type of data sent, useful with 'array' type data as the typeof
 * function returns 'object' in this and other cases.
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @link https://gist.github.com/EdwinBetanc0urt/3fc02172ada073ded4b52e46543553ce
 * @param {boolean|array|object|number|string|date|map|set|function} value
 * @returns {string} value type in capital letters (STRING, NUMBER, BOOLEAN, ...)
 */
export function getTypeOfValue(value) {
  // '[object typeValue]'
  const typeOfValue = Object.prototype
    .toString
    .call(value)
    .match(/^\[object\s(.*)\]$/)[1]
    .toUpperCase()

  return typeOfValue
}

/**
 * Cast value wiht type of value
 * @param {string} value
 * @param {string} type
 * @returns {mixed} castValue
 */
export function castValueWithType({
  value,
  type
}) {
  let castValue
  if (isEmptyValue(value)) {
    return castValue
  }

  switch (type) {
    case 'UNDEFINED':
    case 'ERROR':
    case 'NULL':
      // emtpy value
      break
    case 'BOOLEAN':
      castValue = Boolean(value)
      break
    case 'DATE':
      castValue = new Date(value)
      break
    case 'STRING':
      castValue = String(value)
      break
    case 'MATH':
    case 'NUMBER':
      castValue = Number(value)
      break
  }

  return castValue
}

/**
 * @param {number} number
 */
export function round(number, standardPrecision) {
  if (isEmptyValue(number)) {
    return
  }
  const amount = number.toFixed(standardPrecision)
  return Number(amount)
}
/**
 * zero pad
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {number|string} number
 * @param {number} pad
 * @returns {string}
 */
export function zeroPad(number, pad = 2) {
  const zero = Number(pad) - number.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + number
}

export function convertFieldsListToShareLink(fieldsList) {
  let attributesListLink = ''
  fieldsList.map(fieldItem => {
    // assign values
    let value = fieldItem.value
    let valueTo = fieldItem.valueTo

    if (!isEmptyValue(value)) {
      if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath) || typeof value === 'object') {
        value = value.getTime()
      }
      attributesListLink += `${fieldItem.columnName}=${encodeURIComponent(value)}&`
    }

    if (fieldItem.isRange && !isEmptyValue(valueTo)) {
      if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath) || typeof value === 'object') {
        valueTo = valueTo.getTime()
      }
      attributesListLink += `${fieldItem.columnName}_To=${encodeURIComponent(valueTo)}&`
    }
  })

  return attributesListLink.slice(0, -1)
}

/**
 * Find element in an array recursively
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {object|array} treeData object recursive array
 * @param {string} attributeName, key to get value, default 'id'
 * @param {string} secondAttributeName, key to get value, default 'meta'
 * @param {mixed}  attributeValue, value to compare with search
 * @param {string} attributeChilds, 'childs' list into element
 */
export const recursiveTreeSearch = ({
  treeData,
  attributeValue,
  attributeName = 'id',
  secondAttribute = false,
  attributeChilds = 'childsList',
  isParent = false
}) => {
  if (Array.isArray(treeData)) {
    let index = 0
    const length = treeData.length
    while (index < length) {
      let value = treeData[index]
      if (!isEmptyValue(value) && Object.prototype.hasOwnProperty.call(value, attributeName)) {
        value = value[attributeName]
      }
      if (!isEmptyValue(value) && secondAttribute && Object.prototype.hasOwnProperty.call(value, secondAttribute)) {
        value = value[secondAttribute]
      }

      // compare item to search
      if (value === attributeValue) {
        return treeData[index]
      }

      if (treeData[index] && treeData[index][attributeChilds]) {
        const found = recursiveTreeSearch({
          treeData: treeData[index][attributeChilds],
          attributeValue,
          attributeName,
          secondAttribute,
          attributeChilds,
          isParent
        })
        if (found) {
          return found
        }
      }
      index++
    }
  } else {
    let value = treeData
    if (!isEmptyValue(value) && Object.prototype.hasOwnProperty.call(value, attributeName)) {
      value = value[attributeName]
    }
    if (!isEmptyValue(value) && secondAttribute && Object.prototype.hasOwnProperty.call(value, secondAttribute)) {
      value = value[secondAttribute]
    }

    // compare item to search
    if (value === attributeValue) {
      return treeData
    }

    const found = recursiveTreeSearch({
      treeData: treeData[attributeChilds],
      attributeValue,
      attributeName,
      secondAttribute,
      attributeChilds
    })
    return found
  }
}

/**
 * Preference Value
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {mixed} value, value to parsed
 * @param {string} componentPath
 * @param {number} displayType, reference in ADempiere
 * @param {boolean} isMandatory, field is mandatory
 * @param {boolean} isIdentifier, field is ID
 */
export function parsedValueComponent({
  componentPath,
  value,
  columnName,
  displayType,
  isMandatory = false
}) {
  const isEmpty = isEmptyValue(value)
  if (isEmpty && !isMandatory) {
    if (componentPath === 'FieldYesNo') {
      // Processing, Processed, and any other columnName, return false by default
      return Boolean(value)
    }
    return undefined
  }
  let returnValue

  switch (componentPath) {
    // data type Number
    case 'FieldNumber':
      if (isEmpty) {
        returnValue = undefined
        if (isMandatory) {
          if (isIdentifier(displayType)) {
            returnValue = -1
          } else {
            returnValue = 0
          }
        }
      } else if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      } else {
        if (Array.isArray(value) && value.length) {
          returnValue = value
        } else {
          returnValue = Number(value)
        }
      }
      break

    // data type Boolean
    case 'FieldYesNo':
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      }
      returnValue = convertStringToBoolean(value)
      returnValue = Boolean(returnValue)
      break

    // data type String
    case 'FieldText':
    case 'FieldUrl':
    case 'FieldTextArea':
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      }
      returnValue = value ? String(value) : undefined
      break

    // data type Date
    case 'FieldDate':
    case 'FieldTime ':
      if (isEmpty) {
        value = undefined
      }
      if (!isNaN(value)) {
        value = Number(value)
      }
      if (typeof value === 'number' || typeof value === 'string') {
        value = new Date(value)
      }
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      }
      returnValue = value
      break

    case 'FieldAccount':
    case 'FieldLocationAddress':
    case 'FieldProductAttribute':
    case 'FieldSearch':
    case 'FieldSelect':
      if (isEmpty) {
        value = undefined
      }
      if (typeof value === 'boolean') {
        value = convertBooleanToString(value)
      }
      // Table (18) or Table Direct (19)
      if (TABLE_DIRECT.id === displayType || TABLE.id === displayType &&
        (columnName.endsWith('_ID_To') || columnName.endsWith(IDENTIFIER_COLUMN_SUFFIX))) {
        if (!isEmptyValue(value)) {
          value = Number(value)
        }
      }
      if (LIST.id === displayType) {
        value = removeQuotationMark(value)
      }
      // Search or List
      returnValue = value
      break

    default:
      returnValue = value
      break
  }
  return returnValue
}

/**
 * Returns matching elements of arrays
 * @param {array} arrayA
 * @param {array} arrayB
 * @returns {array}
 */
export function arrayMatches(arrayA = [], arrayB = []) {
  const matches = []

  if (isEmptyValue(arrayA) || isEmptyValue(arrayB)) {
    return matches
  }
  arrayA.forEach(elementA => {
    if (arrayB.includes(elementA)) {
      matches.push(elementA)
    }
  })

  return matches
}

/**
 * Payment method icon element-ui supported
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} paymentMethod, value the payment
 */
export function paymentIcon(paymentMethod) {
  let icon
  switch (paymentMethod) {
    case 'A':
    case 'M':
      icon = 'el-icon-wallet'
      break
    case 'K':
      icon = 'el-icon-postcard'
      break
    case 'X':
      icon = 'el-icon-money'
      break
    case 'Z':
      icon = 'el-icon-coin'
      break
    case 'P':
      icon = 'el-icon-mobile'
      break
    case 'T':
    case 'C':
    case 'D':
      icon = 'el-icon-bank-card'
      break
  }
  return icon
}

/**
 * Insert char in positions text
 * @author Edwin Betancourt <EdwinBetanc0urt@oulook.com>
 * @param {number|string} value
 * @param {number|string} char
 * @param {number} selectionStart
 * @param {number} selectionEnd
 */
export function charInText({ value, char, selectionStart, selectionEnd }) {
  if (OPERATION_PATTERN.test(char)) {
    // separate positions
    const firstText = String(value).slice(0, selectionStart)
    const secondText = String(value).slice(selectionEnd)
    const text = firstText.concat(char).concat(secondText) // insert char clicked
    return text
  }
  return null
}

export function convertValuesToSendListOrders(values) {
  const valuesToSend = {}

  values.forEach(element => {
    const { value, columnName } = element
    if (isEmptyValue(value) || (typeof value === 'boolean' && !value)) {
      return
    }

    switch (columnName) {
      case 'DocumentNo':
        valuesToSend['documentNo'] = value
        break
      case 'C_BPartner_ID_UUID':
        valuesToSend['businessPartnerUuid'] = value
        break
      case 'GrandTotal':
        valuesToSend['grandTotal'] = value
        break
      case 'OpenAmt':
        valuesToSend['openAmount'] = value
        break
      case 'IsPaid':
        valuesToSend['isPaid'] = value
        break
      case 'Processed':
        valuesToSend['isProcessed'] = value
        break
      case 'IsAisleSeller':
        valuesToSend['isAisleSeller'] = value
        break
      case 'IsInvoiced':
        valuesToSend['isInvoiced'] = value
        break
      case 'DateOrderedFrom':
        valuesToSend['dateOrderedFrom'] = value
        break
      case 'DateOrderedTo':
        valuesToSend['dateOrderedTo'] = value
        break
      case 'SalesRep_ID_UUID':
        valuesToSend['salesRepresentativeUuid'] = value
        break
    }
  })
  return valuesToSend
}

export function tableColumnDataType(column, currentOption) {
  if (currentOption === language.t('table.dataTable.showAllColumns')) {
    return true
  }
  if (currentOption === language.t('table.dataTable.showAllColumns')) {
    return true
  }
  if (currentOption === language.t('table.dataTable.showOnlyMandatoryColumns') && (column.isMandatory || column.isMandatoryFromLogic)) {
    return true
  }
  if (currentOption === language.t('table.dataTable.showTableColumnsOnly') && column.isDisplayedGrid) {
    return true
  }
  if (currentOption === language.t('table.dataTable.showMinimalistView') &&
    !['AD_Client_ID', 'AD_Org_ID', 'IsActive'].includes(column.columnName)) {
    return true
  }
  return false
}

/**
 * Search in the currency lists for the current currency
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} currencyCurrent current currency to search
 * @param {array} listCurrency Currency Listing
 * @param {object} currencyCurrent Default Currency
 */
export function currencyFind({
  currencyCurrent,
  listCurrency,
  defaultCurrency
}) {
  if (!isEmptyValue(listCurrency)) {
    const currency = listCurrency.find(item => {
      if (item.currencyUuid === currencyCurrent) {
        return item
      }
    })
    if (currency) {
      return currency
    }
  }
  return defaultCurrency.iSOCode
}

/**
 * Search the Payment List for the Current Payment
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} currentPayment Current Payment
 * @param {array} listTypePayment Payment Type Listings
 */
export function tenderTypeFind({
  currentPayment,
  listTypePayment
}) {
  const payment = listTypePayment.find(item => {
    if (item.id === currentPayment) {
      return item.label
    }
  })
  if (payment) {
    return payment.label
  }
  return currentPayment
}

export function formatConversionCurrenty(params) {
  let exponential, expre
  const number = params.toString()
  if (params > 0) {
    if (number.includes('e')) {
      expre = number.split('-')
      exponential = params.toFixed(expre[1])
      return exponential
    }
  }
  return params
}

/**
 * convert Values To Send
 * @param {string, number, boolean, date} values
 */
export function convertValuesToSend(values) {
  const valuesToSend = {}

  values.forEach(element => {
    const { value, columnName } = element

    if (isEmptyValue(value)) {
      return
    }

    switch (columnName) {
      case 'DocumentNo':
        valuesToSend['documentNo'] = value
        break
      case 'C_BPartner_ID_UUID':
        valuesToSend['businessPartnerUuid'] = value
        break
      case 'GrandTotal':
        valuesToSend['grandTotal'] = value
        break
      case 'OpenAmt':
        valuesToSend['openAmount'] = value
        break
      case 'IsPaid':
        valuesToSend['isPaid'] = value
        break
      case 'Processed':
        valuesToSend['isProcessed'] = value
        break
      case 'IsAisleSeller':
        valuesToSend['isAisleSeller'] = value
        break
      case 'IsInvoiced':
        valuesToSend['isInvoiced'] = value
        break
      case 'DateOrderedFrom':
        valuesToSend['dateOrderedFrom'] = value
        break
      case 'DateOrderedTo':
        valuesToSend['dateOrderedTo'] = value
        break
      case 'SalesRep_ID_UUID':
        valuesToSend['salesRepresentativeUuid'] = value
        break
    }
  })
  return valuesToSend
}

/**
 * Set Icons to (SVG) based on Table Name
 * @param {string} tableName
 * @return {object} { class , type }
 */
export function setIconsTableName({
  tableName
}) {
  let icon = {
    type: 'svg',
    class: 'search'
  }
  switch (tableName) {
    case 'HR_Process':
      icon = {
        type: 'svg',
        class: 'peoples'
      }
      break
    case 'C_Payment':
    case 'I_Payment':
      icon = {
        type: 'svg',
        class: 'payments'
      }
      break
    case 'C_Invoice':
    case 'I_Invoice':
      icon = {
        type: 'i',
        class: 'el-icon-office-building'
      }
      break
    case 'I_BankStatement':
      icon = {
        type: 'svg',
        class: 'account-balance'
      }
      break
    case 'M_InOut':
    case 'I_InOutLineConfirm':
      icon = {
        type: 'svg',
        class: 'local-shipping'
      }
      break
    case 'I_Inventory':
      icon = {
        type: 'svg',
        class: 'inventory'
      }
      break
    case 'C_Order':
    case 'I_Order':
      icon = {
        type: 'svg',
        class: 'clipboard'
      }
      break
    case 'I_Conversion_Rate':
      icon = {
        type: 'svg',
        class: 'conversion'
      }
      break
    case 'I_Product':
      icon = {
        type: 'svg',
        class: 'product'
      }
      break
    case 'M_Product':
      icon = {
        type: 'svg',
        class: 'product'
      }
      break
    case 'C_BPartner':
    case 'I_BPartner':
      icon = {
        type: 'i',
        class: 'el-icon-user-solid'
      }
      break
    case 'I_ElementValue':
      icon = {
        type: 'i',
        class: 'el-icon-wallet'
      }
      break
    case 'I_ReportLine':
      icon = {
        type: 'i',
        class: 'el-icon-notebook-2'
      }
      break
    case 'I_GLJournal':
      icon = {
        type: 'svg',
        class: 'balance'
      }
      break
    case 'I_FAJournal':
      icon = {
        type: 'svg',
        class: 'accounting-note'
      }
      break
    case 'I_Asset':
      icon = {
        type: 'i',
        class: 'el-icon-coin'
      }
      break
    case 'I_Movement':
      icon = {
        type: 'i',
        class: 'el-icon-truck'
      }
      break
    case 'I_ProductPlanning':
      icon = {
        type: 'svg',
        class: 'product'
      }
      break
    case 'I_PriceList':
      icon = {
        type: 'svg',
        class: 'price_list'
      }
      break
    case 'I_HR_Movement':
      icon = {
        type: 'svg',
        class: 'import-movement'
      }
      break
    case 'I_Product_BOM':
      icon = {
        type: 'svg',
        class: 'product'
      }
      break
    case 'I_FixedAsset':
      icon = {
        type: 'i',
        class: 'el-icon-coin'
      }
      break
    case 'I_HR_Attribute':
      icon = {
        type: 'svg',
        class: 'atributo'
      }
      break
    case 'I_Product_ASI':
      icon = {
        type: 'svg',
        class: 'product-attribute'
      }
      break
    case 'I_Workflow':
      icon = {
        type: 'svg',
        class: 'workflow'
      }
      break
    case 'I_SalesHistory':
      icon = {
        type: 'i',
        class: 'el-icon-shopping-cart-full'
      }
      break
    case 'I_Budget':
      icon = {
        type: 'svg',
        class: 'budget'
      }
      break
    case 'I_HR_Employee':
      icon = {
        type: 'svg',
        class: 'employee'
      }
      break
    case 'I_Project':
      icon = {
        type: 'svg',
        class: 'project'
      }
      break
    case 'I_Forecast':
      icon = {
        type: 'svg',
        class: 'forecast'
      }
      break
    case 'I_HR_AttendanceRecord':
      icon = {
        type: 'svg',
        class: 'attendance-record'
      }
      break
    case 'I_FM_Agreement':
      icon = {
        type: 'svg',
        class: 'agreement'
      }
      break
  }
  return icon
}
