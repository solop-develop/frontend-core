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

// Utils and Helper Methods
import { removeQuotationMark } from '@/utils/ADempiere/formatValue/stringFormat'

/**
 * true value stored on data base as string `Y`
 */
export const TRUE_STRING = 'Y'

/**
 * false value stored on data base as string `N`
 */
export const FALSE_STRING = 'N'

/**
 * Convert boolean value to current translation language
 * @param {boolean} booleanValue
 * @returns {string} true => 'Yes' or 'Si', false => 'Not' or 'No'
 */
export const convertBooleanToTranslationLang = (booleanValue) => {
  if (booleanValue === true || booleanValue === 'true' || booleanValue === 'Yes' || booleanValue === TRUE_STRING) {
    return language.t('components.switchActiveText')
  }

  return language.t('components.switchInactiveText')
}

/**
 * Convert boolean value to string value
 * @param {boolean|string} booleanValue
 * @param {boolean} isForce
 * @returns {string} 'Y'/'N'
 */
export const convertBooleanToString = (valueToEvaluate, isForce = true) => {
  // remove single/double quotation mark 'N' -> N, "Y" -> Y
  const booleanValue = removeQuotationMark(valueToEvaluate)
  if (booleanValue === true ||
    booleanValue === 'true' ||
    booleanValue === 'Yes' ||
    booleanValue === TRUE_STRING) {
    return TRUE_STRING
  } else if (booleanValue === false ||
    booleanValue === 'false' ||
    booleanValue === 'Not' ||
    booleanValue === 'No' ||
    booleanValue === FALSE_STRING) {
    return FALSE_STRING
  }
  if (isForce) {
    return FALSE_STRING
  }

  // return original value
  return valueToEvaluate
}

/**
 * Convert string values ('Y' or 'N') to component compatible Boolean values
 * @param {mixed} valueToParsed
 * @returns {boolean}
 */
export const convertStringToBoolean = (valueToParsed) => {
  let valReturn = valueToParsed

  // remove single/double quotation mark 'N' -> N, "Y" -> Y
  const evaluatedValue = removeQuotationMark(valueToParsed)
  switch (evaluatedValue) {
    case FALSE_STRING:
    case 'No':
    case 'Not':
    case 'false':
    case false:
    case language.t('components.switchInactiveText'):
      valReturn = false
      break

    case TRUE_STRING:
    case 'Yes':
    case 'true':
    case true:
    case language.t('components.switchActiveText'):
      valReturn = true
      break

    default:
      valReturn = valueToParsed
      break
  }

  return valReturn
}
