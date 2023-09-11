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

// A util class for handle format for time, date and others values to beused to display information
// Note that this file use moment library for a easy conversion

// Constants
import {
  DATE, DATE_PLUS_TIME, TIME,
  AMOUNT, COSTS_PLUS_PRICES, NUMBER, QUANTITY,
  CHAR, MEMO, TEXT, TEXT_LONG,
  ACCOUNT_ELEMENT, LOCATION_ADDRESS, // Custom lookups
  LOCATOR_WAREHOUSE, PRODUCT_ATTRIBUTE, // Custom lookups of Producs
  LIST, TABLE, TABLE_DIRECT, SEARCH, // Standard lookups
  IMAGE, // file lookups
  YES_NO
} from '@/utils/ADempiere/references.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertBooleanToTranslationLang } from './formatValue/booleanFormat'
export { convertObjectToKeyValue } from '@/utils/ADempiere/formatValue/iterableFormat'
import { decodeHtmlEntities } from '@/utils/ADempiere/formatValue/stringFormat.js'
// TODO: Duplicated exported method, removed this
import { formatPrice as formatPriceTemp } from '@/utils/ADempiere/formatValue/numberFormat'
import { formatDate as formatDateTemp } from '@/utils/ADempiere/formatValue/dateFormat'

// TODO: Duplicated method remove and use with destructured params
export function formatDate(value, isTime = false, format) {
  return formatDateTemp({
    value,
    isTime,
    format
  })
}

// TODO: Duplicated method remove and use with destructured params
export function formatPrice(number, currency) {
  return formatPriceTemp({
    value: number,
    currency
  })
}

//  Format Quantity
export function formatQuantity(number) {
  if (isEmptyValue(number)) {
    return undefined
  }
  if (!Number.isInteger(number)) {
    return number
  }
  return Number.parseFloat(number).toFixed(2)
  //  Get formatted number
}

// TODO: Duplicated exported method, removed this
export { formatDateToSend } from '@/utils/ADempiere/formatValue/dateFormat'
// Format percentage based on Intl library
export { formatPercent } from '@/utils/ADempiere/formatValue/numberFormat.js'

// Return a format for field depending of reference for him
export function formatField({
  value,
  displayedValue,
  displayType,
  currency,
  optionalFormat
}) {
  if (isEmptyValue(value)) {
    return undefined
  }
  if (isEmptyValue(displayType)) {
    return value
  }
  //  Format
  let formattedValue
  switch (displayType) {
    case ACCOUNT_ELEMENT.id:
    case LIST.id:
    case LOCATION_ADDRESS.id:
    case LOCATOR_WAREHOUSE.id:
    case PRODUCT_ATTRIBUTE.id:
    case SEARCH.id:
    case TABLE.id:
    case TABLE_DIRECT.id:
      formattedValue = displayedValue
      if (isEmptyValue(formattedValue)) {
        // set value
        formattedValue = value
      }
      break

    case DATE.id:
      formattedValue = formatDateTemp({
        value,
        isTime: false,
        format: optionalFormat
      })
      break

    case DATE_PLUS_TIME.id:
      formattedValue = formatDateTemp({
        value,
        isTime: true,
        format: optionalFormat || 'yyyy-MM-dd hh:mm:ss A'
      })
      break
    case TIME.id:
      formattedValue = formatDateTemp({
        value,
        isTime: true,
        format: optionalFormat
      })
      break

    case AMOUNT.id:
    case COSTS_PLUS_PRICES.id:
      formattedValue = formatPriceTemp({
        value,
        currency
      })
      break

    case NUMBER.id:
    case QUANTITY.id:
      formattedValue = formatQuantity(value)
      break

    case YES_NO.id:
      formattedValue = convertBooleanToTranslationLang(value)
      break

    case CHAR.id:
    case MEMO.id:
    case TEXT.id:
    case TEXT_LONG.id:
      formattedValue = decodeHtmlEntities(value)
      break

    case IMAGE.id:
      if (isEmptyValue(displayedValue)) {
        formattedValue = undefined
        break
      }
      formattedValue = displayedValue
      break

    default:
      formattedValue = value
  }
  return formattedValue
}

/**
 * Removes the % of a text string, only from the beginning and end if they exist,
 * this in case you need to use a match or local search to find matches between
 * text strings.
 * @param {string} stringToParsed ej: '%qwerty asd%' | '%zxc 123'
 * @returns {string} ej: 'qwerty asd' | 'zxc 123'
 */
export function trimPercentage(stringToParsed) {
  if (!isEmptyValue(stringToParsed) && String(stringToParsed).includes('%')) {
    let parsedValue = stringToParsed
    if (parsedValue[0] === '%') {
      parsedValue = parsedValue.slice(1)
    }

    const wordSize = parsedValue.length - 1
    if (parsedValue[wordSize] === '%') {
      parsedValue = parsedValue.slice(0, wordSize)
    }
    return parsedValue
  }
  return stringToParsed
}
