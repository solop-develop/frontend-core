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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Convert lookups items proto to options select html
 * @param {Array} recordsList records of service on LookupItem proto message
 * @param {Boolean} isAddBlankValue add blanck value option in fist element on list
 * @param {String|Number} blankValue value to add in empty option ("", -1, null, undefined)
 * @returns {Array}
 */
export function getOptionsList({
  recordsList = [],
  isAddBlankValue = true,
  blankValue
}) {
  const optionsList = []

  recordsList.forEach(itemLookup => {
    const {
      KeyColumn: value,
      DisplayColumn: displayedValue
    } = itemLookup.values

    if (!isEmptyValue(value)) {
      optionsList.push({
        displayedValue,
        value,
        uuid: itemLookup.uuid
      })
    }
  })

  // add blanck value option in fist element on list
  if (isAddBlankValue) {
    optionsList.unshift({
      displayedValue: ' ',
      value: blankValue,
      uuid: undefined
    })
  }

  return optionsList
}
