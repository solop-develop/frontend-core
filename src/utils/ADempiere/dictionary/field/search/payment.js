/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/ElsioSanchez
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

export const TABLE_NAME = 'C_Payment'

export const COLUMN_NAME = 'C_Payment_ID'

export const PAYMENT_LIST_FORM = 'payment-field-search-list'

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
  const {
    account_name, document_no, document_type, date_payment, info_to, pay_amt
  } = recordRow

  if (!isEmptyValue(document_type)) {
    displayedValue = document_type
  }

  if (!isEmptyValue(document_no)) {
    if (!isEmptyValue(displayedValue)) {
      displayedValue = document_no
    } else {
      displayedValue += ' _ ' + document_no
    }
  }

  if (!isEmptyValue(info_to)) {
    if (!isEmptyValue(displayedValue)) {
      displayedValue = info_to
    } else {
      displayedValue += ' _ ' + info_to
    }
  } else if (!isEmptyValue(date_payment)) {
    const paymentDate = formatDate({
      value: date_payment,
      isDate: true
    })
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' _ ' + paymentDate
    } else {
      displayedValue = paymentDate
    }
  }

  if (!isEmptyValue(pay_amt)) {
    const paymentAmount = formatQuantity({
      value: pay_amt,
      precision: 2
    })
    if (!isEmptyValue(displayedValue)) {
      displayedValue += ' _ ' + paymentAmount
    } else {
      displayedValue = paymentAmount
    }
  }

  if (!isEmptyValue(account_name)) {
    if (!isEmptyValue(displayedValue)) {
      displayedValue = account_name
    } else {
      displayedValue += ' _ ' + account_name
    }
  }

  return displayedValue
}
