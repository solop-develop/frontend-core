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
import { isEmptyValue } from '@/utils/ADempiere'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'

/**
 * Show the correct display format
 * @param {object} row record
 * @param {object} orderLine or field definition
 */

export function displayValue({
  row,
  columnName
}) {
  const {
    uom,
    price,
    charge,
    product,
    taxRate,
    totalAmount,
    description,
    priceWithTax,
    quantityOrdered,
    totalAmountWithTax,
    resourceAssignment
  } = row
  const {
    isDisplayDiscount,
    isDisplayTaxAmount
  } = store.getters.getVPOS
  const isMobile = store.getters.device === 'mobile'
  const { priceList } = store.getters.getCurrentOrder
  const {
    currency,
    is_tax_included
  } = priceList
  if (columnName === 'LineDescription') {
    if (isMobile) return product.name
    if (!isEmptyValue(resourceAssignment)) return product.name + ' - (' + resourceAssignment.name + ')'
    if (!isEmptyValue(product.name)) return description
    if (!isEmptyValue(product.value)) return charge.columnName
    return product.value + ' - ' + product.name
  }
  if (columnName === 'CurrentPrice') {
    let currentPrice = price
    if (!isDisplayTaxAmount && !isDisplayDiscount) currentPrice = priceWithTax
    if (isMobile) return formatPrice(currentPrice)
    return formatPrice(currentPrice, currency.iso_code)
  }
  if (columnName === 'QtyEntered') {
    if (isEmptyValue(uom.uom)) return formatQuantity({ value: quantityOrdered, isInteger: false, precision: 1 })
    let precision = 0
    if (!isEmptyValue(row.uom.uom.starndard_precision)) precision = row.uom.uom.starndard_precision
    return formatQuantity({
      value: row.quantityOrdered,
      precision
    })
  }
  if (columnName === 'UOM') return isEmptyValue(uom.uom.symbol) ? uom.uom.name : uom.uom.symbol
  if (columnName === 'Discount') return formatQuantity({ value: row.discount }) + ' %'
  if (columnName === 'taxIndicator') {
    const {
      rate,
      name
    } = taxRate
    let taxIndicator = Number.parseFloat(rate).toFixed(2) + ' %'
    if (rate <= 0) {
      taxIndicator = name
    }
    return taxIndicator
  }
  if (columnName === 'GrandTotal') {
    let price = totalAmountWithTax
    if (is_tax_included) {
      price = totalAmount
    }
    if (isMobile) {
      return formatPrice(price)
    }
    return formatPrice(price, currency)
  }
}
/**
 * Show Table Label
 * @param {object} row record
 */
export function displayLabel({
  row
}) {
  const {
    displayCurrency,
    isDisplayDiscount,
    isDisplayTaxAmount
  } = store.getters.getVPOS
  const isMobile = store.getters.device === 'mobile'
  const { columnName } = row
  let display = false
  if (isMobile) {
    switch (columnName) {
      case 'LineDescription':
        display = true
        break
      case 'CurrentPrice':
        display = true
        break
      case 'QtyEntered':
        display = true
        break
      case 'GrandTotal':
        display = true
        break
      default:
        display = false
        break
    }
    return display
  }
  switch (columnName) {
    case 'ConvertedAmount':
      display = displayCurrency
      break
    case 'Discount':
      display = isDisplayDiscount
      break
    case 'DiscountTotal':
      display = isDisplayDiscount
      break
    case 'taxIndicator':
      display = isDisplayTaxAmount
      break
    case 'DisplayTaxAmount':
      display = isDisplayTaxAmount
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
 * Get standard presicion
 * @returns {number}
 */
function formatQuantity({ value, isInteger = false, precision = store.getters.getStandardPrecision }) {
  if (isEmptyValue(value)) {
    value = 0
  }
  // without decimals
  // if (Number.isInteger(value)) {
  if (isInteger) {
    precision = 0
  }

  // get formatted decimal number
  return new Intl.NumberFormat(undefined, {
    useGrouping: true, // thousands separator
    minimumIntegerDigits: 1,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }).format(value)
}
