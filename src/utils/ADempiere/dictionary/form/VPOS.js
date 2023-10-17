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
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

// Const
const isMobile = store.getters.device === 'mobile'

/**
 * Show the correct display format
 * @param {object} row record
 * @param {object} orderLine or field definition
 */

export function displayValue({
  row,
  columnName
}) {
  const { price_list } = store.getters.getCurrentOrder
  const {
    currency
  } = price_list
  let value = ''
  switch (columnName) {
    case 'LineDescription':
      value = displayLineDescription({ row })
      break
    case 'CurrentPrice':
      value = displayLinePrice({ row })
      break
    case 'QtyEntered':
      value = displayLineQtyEntered({ row })
      break
    case 'DiscountTotal':
      value = formatQuantity({ value: row.discount_amount.value })
      break
    case 'UOM':
      value = row.uom.uom.symbol
      break
    case 'Discount':
      value = formatQuantity({ value: row.discount_rate.value }) + ' %'
      break
    case 'taxIndicator':
      value = row.tax_rate.tax_indicator
      break
    case 'DisplayTaxAmount':
      value = formatPrice(row.total_tax_amount.value, currency.iso_code)
      break
    case 'GrandTotal':
      value = displayLineGranTotal({ row })
      break
  }
  return value
}
/**
 * Show Table Label
 * @param {object} row record
 */
export function displayLabel({
  row
}) {
  const {
    display_currency,
    is_display_discount,
    is_display_tax_amount
  } = store.getters.getVPOS
  // const isMobile = store.getters.device === 'mobile'
  const { columnName } = row
  let display = false
  if (isMobile) return ['LineDescription', 'CurrentPrice', 'QtyEntered', 'GrandTotal'].includes(columnName)
  switch (columnName) {
    case 'ConvertedAmount':
      display = display_currency
      break
    case 'Discount':
      display = is_display_discount
      break
    case 'DiscountTotal':
      display = is_display_discount
      break
    case 'taxIndicator':
      display = is_display_tax_amount
      break
    case 'DisplayTaxAmount':
      display = is_display_tax_amount
      break
    case 'GrandTotal':
      display = true
      break
    default:
      display = true
      break
  }
  return display
}

/**
 * Show description according to the Product line
 */
function displayLineDescription({
  row
}) {
  const {
    charge,
    product,
    resource_assignment
  } = row
  if (isMobile) return product.name
  if (resource_assignment.id > 0) return product.name + ' - (' + resource_assignment.name + ')'
  if (charge.id > 0) return charge.name
  return product.value + ' - ' + product.name
}

/**
 * Show Price according to the Product line
 */
function displayLinePrice({
  row
}) {
  const {
    is_display_discount,
    is_display_tax_amount
  } = store.getters.getVPOS

  const {
    price,
    price_with_tax
  } = row
  const { price_list } = store.getters.getCurrentOrder
  const {
    currency
  } = price_list
  if (!is_display_discount && is_display_tax_amount) return formatPrice(price_with_tax.value, currency.iso_code)
  return formatPrice(price.value, currency.iso_code)
}

/**
 * Show Qty Entered according to the Product line
 */
function displayLineQtyEntered({
  row
}) {
  const {
    uom,
    quantity_ordered
  } = row
  let precision = 0
  if (isEmptyValue(uom.uom)) return formatQuantity({ value: quantity_ordered.value })
  if (!isEmptyValue(row.uom.uom.standard_precision)) {
    precision = row.uom.uom.standard_precision
  }
  return formatQuantity({
    value: quantity_ordered.value,
    precision
  })
}

/**
 * Show Qty Entered according to the Product line
 */
function displayLineGranTotal({
  row
}) {
  const {
    is_tax_included,
    price_list
  } = store.getters.getCurrentOrder
  const { currency } = price_list
  const {
    total_amount_with_tax,
    total_amount
  } = row
  if (is_tax_included) return formatPrice(total_amount.value, currency.iso_code)
  return formatPrice(total_amount_with_tax.value, currency.iso_code)
}
