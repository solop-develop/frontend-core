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

export const TABLE_NAME = 'C_Invoice'

export const COLUMN_NAME = 'C_Invoice_ID'

export const INVOICE_LIST_FORM = 'Accouting-Combination-List'

/**
 * Generate displayed value from values
 * @param {Object} recordRow
 * @returns {String}
 */
export function generateDisplayedValue(recordRow) {
  const { document_no } = recordRow

  let displayedValue = document_no
  if (!isEmptyValue(document_no)) {
    return document_no
  }

  // generate with standard columns
  const { business_partner, date_invoiced } = recordRow

  if (!isEmptyValue(business_partner)) {
    displayedValue = business_partner
  }
  if (!isEmptyValue(date_invoiced)) {
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' - ' + date_invoiced
    } else {
      displayedValue = date_invoiced
    }
  }
  return displayedValue
}
