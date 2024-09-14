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

export const TABLE_NAME = 'C_ValidCombination'

export const COLUMN_NAME = 'C_ValidCombination_ID'

export const ACCOUTING_COMBINATIONS_LIST_FORM = 'Accouting-Combinations-List'

/**
 * Generate displayed value from values
 * @param {Object} recordRow
 * @returns {String}
 */
export function generateDisplayedValue(recordRow) {
  const {
    DisplayColumn_C_ValidCombination_ID: display_value
  } = recordRow
  let displayValue = display_value
  if (!isEmptyValue(displayValue)) {
    return displayValue
  }

  // generate with standard columns
  const { Combination } = recordRow
  displayValue = Combination

  return displayValue
}
