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
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils'

/**
 * Capitalize value
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  // str is the argument passed to the helper when called
  str = str || ''
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * Decode HTML Entities
 * - `&aacute;`  =  `á`
 * - `&oacute;`  =  `ó`
 * - `&ntilde;`  =  `ñ`
 * @param {string} str string value
 * @returns {string}
 */
export function decodeHtmlEntities(str) {
  const titleField = new DOMParser().parseFromString(str, 'text/html')

  return titleField.documentElement.textContent
}

/**
 * Remove double/single quotation mark:
 * 'N' -> N, "Y" -> Y
 * 'DR' -> DR, "CO" -> CO
 * @param {string} stringValue
 * @returns {string}
 */
export function removeQuotationMark(stringValue) {
  if (isEmptyValue(stringValue)) {
    return stringValue
  }
  if (getTypeOfValue(stringValue) !== 'STRING') {
    return stringValue
  }

  const withoutQuotationMark = String(stringValue)
    .trim()
    // (') (text) (') or (") (text) (")
    .replace(/(^\'|^\")(\w+)(\1)/g, '$2')

  return withoutQuotationMark
}
