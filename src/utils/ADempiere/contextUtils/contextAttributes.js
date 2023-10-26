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
import {
  getTypeOfValue, isEmptyValue, isIdentifierEmpty
} from '@/utils/ADempiere/valueUtils.js'
import { getContext } from '@/utils/ADempiere/contextUtils'

/**
 * Get context attribures list
 * @param {string} containerUuid
 * @param {array<string>} contextColumnNames
 * @param {string} keyName key or column name
 * @param {boolean} isBooleanToString convert true or false to Y or N
 * @param {boolean} isForceBoolean undefined or null to false
 * @returns {array<object>}
 */
export function getContextAttributes({
  parentUuid,
  containerUuid,
  contextColumnNames = [],
  isBooleanToString = false,
  isForceBoolean = false,
  keyName = 'columnName',
  format = 'array'
}) {
  const contextAttributesObject = {}
  const contextAttributesList = []
  if (isEmptyValue(contextColumnNames)) {
    return contextAttributesList
  }

  contextColumnNames.forEach(columnName => {
    let value = getContext({
      parentUuid,
      containerUuid,
      columnName,
      isBooleanToString,
      isForceBoolean
    })

    // if identifier and empty, send value in zero
    if (isIdentifierEmpty({ columnName, value })) {
      value = -1
    }
    contextAttributesObject[columnName] = value
    contextAttributesList.push({
      [keyName]: columnName,
      value
    })
  })
  if (format === 'object') {
    return contextAttributesObject
  }
  return contextAttributesList
}

/**
 * Get context key based on attributes list
 * @param {array} contextAttributes
 * @param {string} keyName, default is 'columnName' or 'key'
 * @returns {string} '_|key|value'
 */
export function generateContextKey(contextAttributes = [], keyName = 'columnName') {
  let contextKey = ''
  if (isEmptyValue(contextAttributes)) {
    return contextKey
  }
  if (getTypeOfValue(contextAttributes) === 'OBJECT') {
    Object.keys(contextAttributes).forEach(key => {
      contextKey += '|' + key + '|' + contextAttributes[key]
    })
    return '_' + contextKey
  }

  contextAttributes.forEach(attribute => {
    contextKey += '|' + attribute[keyName] + '|' + attribute.value
  })
  return '_' + contextKey
}
