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
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

export const TABLE_NAME = 'C_Order'

export const COLUMN_NAME = 'C_Order_ID'

export const ORDER_LIST_FORM = 'order-field-search-list'

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
  const { document_no, date_ordered, grand_total } = recordRow

  if (!isEmptyValue(document_no)) {
    displayedValue = document_no
  }

  if (!isEmptyValue(date_ordered)) {
    const dateOrder = formatDate({
      value: date_ordered,
      isDate: true
    })
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' _ ' + dateOrder
    } else {
      displayedValue = dateOrder
    }
  }

  if (!isEmptyValue(grand_total)) {
    const grandTotal = formatQuantity({
      value: grand_total,
      precision: 2
    })
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' _ ' + grandTotal
    } else {
      displayedValue = grandTotal
    }
  }

  const { business_partner } = recordRow
  if (!isEmptyValue(business_partner)) {
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' _ ' + business_partner
    } else {
      displayedValue = business_partner
    }
  }

  return displayedValue
}
