/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

const DEFAULT_ATTRIBUTE = {
  KEY_TIME: 'hora',
  KEY_DATE: 'fecha',
  KEY_AMOUNT: 'monto',
  KEY_TAX_ID: 'cedula',
  KEY_DOCUMENT: 'factura',
  KEY_CARD_TYPE: 'tarjeta',
  KEY_REFERENCE: 'documento'
}

export function getAttributesPaymentSales({
  document_no,
  reference,
  typeCard,
  amount,
  value,
  type,
  date,
  time
}) {
  return {
    [DEFAULT_ATTRIBUTE.KEY_DATE]: formatDate(date),
    [DEFAULT_ATTRIBUTE.KEY_TIME]: formatTime(time),
    [DEFAULT_ATTRIBUTE.KEY_TAX_ID]: value,
    [DEFAULT_ATTRIBUTE.KEY_AMOUNT]: amount,
    [DEFAULT_ATTRIBUTE.KEY_ACCOUNT_TYPE]: accountType(type),
    [DEFAULT_ATTRIBUTE.KEY_CARD_TYPE]: cardType(typeCard),
    [DEFAULT_ATTRIBUTE.KEY_REFERENCE]: reference,
    [DEFAULT_ATTRIBUTE.KEY_DOCUMENT]: document_no
  }
}

export function formatTime(date) {
  if (isEmptyValue(date)) date = new Date()
  return date.getHours() + date.getMinutes() + date.getSeconds()
}

export function formatDate(date) {
  if (isEmptyValue(date)) date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return year + month + day
}

function cardType(typeCard) {
  let type
  switch (typeCard) {
    case 'D':
      type = 1
      break
    case 'C':
      type = 2
      break
    default:
      type = 0
      break
  }
  return type
}

function accountType(typeCard) {
  let type
  switch (typeCard) {
    case 'A':
      type = 1
      break
    case 'S':
      type = 2
      break
    default:
      type = 0
      break
  }
  return type
}
