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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export const TABLE_NAME = 'C_BPartner'

export const COLUMN_NAME = 'C_BPartner_ID'

export const BUSINESS_PARTNERS_LIST_FORM = 'Business-Partner-List'

/**
 * Generate displayed value from values
 * @param {Object} recordRow
 * @returns {String}
 */
export function generateDisplayedValue(recordRow) {
  const { display_value } = recordRow

  let displayedValue = display_value
  if (!isEmptyValue(display_value)) {
    return display_value
  }

  // generate with standard columns
  const { value, name } = recordRow

  if (!isEmptyValue(value)) {
    displayedValue = value
  }
  if (!isEmptyValue(name)) {
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' - ' + name
    } else {
      displayedValue = name
    }
  }
  return displayedValue
}
