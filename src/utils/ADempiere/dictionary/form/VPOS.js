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
// const isMobile = store.getters.device === 'mobile'

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
  const { display_currency } = store.getters.getVPOS
  let currency = {
    iso_code: ''
  }
  if (!isEmptyValue(price_list)) currency = price_list.currency
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
    case 'ConvertedAmount':
      value = formatPrice(row.total_amount_converted.value, display_currency.iso_code)
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
  const isMobile = store.getters.device === 'mobile'
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
  const isMobile = store.getters.device === 'mobile'
  if (isMobile) return product.name
  if (!isEmptyValue(resource_assignment) && resource_assignment.id > 0) return product.name + ' - (' + resource_assignment.name + ')'
  if (charge.id > 0) return charge.name
  return product.value + ' - ' + product.name
}

/**
 * Show Price according to the Product line
 */
export function displayLinePrice({
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
  let currency = {
    iso_code: ''
  }
  if (!isEmptyValue(price_list)) currency = price_list.currency
  if (!is_display_discount && is_display_tax_amount) return formatPrice(price_with_tax.value, currency.iso_code)
  return formatPrice(price.value, currency.iso_code)
}

/**
 * Show the Product Price Value
 */
export function displayLineProductPriceValue({
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

  if (!is_display_discount && is_display_tax_amount) return Number(price_with_tax.value)
  return Number(price.value)
}

/**
 * Show Qty Entered according to the Product line
 */
export function displayLineQtyEntered({
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
  let currency = {
    iso_code: ''
  }
  if (!isEmptyValue(price_list)) currency = price_list.currency
  const {
    total_amount_with_tax,
    total_amount
  } = row
  if (is_tax_included) return formatPrice(total_amount.value, currency.iso_code)
  return formatPrice(total_amount_with_tax.value, currency.iso_code)
}

/**
 * Generate a Warehouse Array by Adding the Stocks
 * @param {*} listWarehouse
 * @param {*} uniqueStocks
 * @returns uniqueStocks
 */
export function sumStocksByWarehouse(listWarehouse, uniqueStocks = []) {
  for (let i = 0; i < listWarehouse.length; i++) {
    const currentWharehouse = listWarehouse[i]
    const isExiste = uniqueStocks.find(warehouse => warehouse.warehouse_id === currentWharehouse.warehouse_id)
    const index = uniqueStocks.findIndex(warehouse => warehouse.warehouse_id === currentWharehouse.warehouse_id)
    if (!isExiste) {
      uniqueStocks.push(currentWharehouse)
    } else {
      uniqueStocks[index].quantity = currentWharehouse.quantity + isExiste.quantity
    }
  }
  return uniqueStocks
}

/**
 * Get the required payment method from the list
 * @param {array} listPaymentMethods
 * @param {object} paymentMethods
 * @returns paymentMethods
 */
export function getMainPaymentMethods({
  listPaymentMethods,
  tender_type = 'X'
}) {
  if (isEmptyValue(listPaymentMethods)) return {}
  return listPaymentMethods.find(list => list.payment_method.tender_type === tender_type)
}

/**
 * Currency Payment
 */
export function getCurrencyPayment({
  isRefund = false,
  paymentMethods
}) {
  const currency = {
    iso_code: '',
    id: null
  }
  const { price_list } = store.getters.getCurrentOrder
  if (isEmptyValue(price_list)) return currency
  if (isEmptyValue(paymentMethods)) {
    return price_list.currency
  }
  const {
    reference_currency,
    refund_reference_currency
  } = paymentMethods
  if (isRefund) {
    if (!isEmptyValue(refund_reference_currency)) return refund_reference_currency
    return price_list.currency
  }
  if (!isEmptyValue(reference_currency)) return reference_currency
  return price_list.currency
}

/**
 * Get Payment Values Ready to Send
 */
export function getPaymentValues({
  invoice_id,
  bank_id,
  description,
  payment_date,
  payment_account_date,
  is_refund = false,
  charge_id,
  collecting_agent_id,
  reference_bank_account_id,
  customer_bank_account_id,
  invoice_reference_id
}) {
  const { payment_method } = store.getters.getPaymentMethods
  let amount = store.getters.getPayAmount
  if (isEmptyValue(amount)) amount = store.getters.getCurrentOrder.open_amount.value
  // Set Currency
  const currency = store.getters.getAvailableCurrencies.currencie
  // Set Value referenceNo
  const referenceNo = store.getters.getAttributeField({
    field: 'field',
    attribute: 'referenceNo'
  })
  const currentAccount = store.getters.getAttributeField({
    field: 'bankAccounts',
    attribute: 'currentAccount'
  })

  // Set bank Accounts ID
  if (!isEmptyValue(currentAccount) && isEmptyValue(customer_bank_account_id)) {
    bank_id = currentAccount.bank_id
    customer_bank_account_id = currentAccount.customer_id
  }

  return {
    invoice_id,
    bank_id,
    reference_no: referenceNo,
    description,
    amount,
    payment_date,
    tender_type_code: payment_method.tender_type,
    currency_id: currency.id,
    payment_method_id: payment_method.id,
    payment_account_date,
    is_refund,
    charge_id,
    collecting_agent_id,
    reference_bank_account_id,
    customer_bank_account_id,
    invoice_reference_id
  }
}

export function defaultValueCollections() {
  const listPayments = store.getters.getListPaymentMethods
  const { open_amount } = store.getters.getCurrentOrder
  store.commit('setPaymentMethods', getMainPaymentMethods({ listPaymentMethods: listPayments }))
  const currentPaymentMethods = store.getters.getPaymentMethods
  store.commit('setAvailableCurrencies', getCurrencyPayment({
    paymentMethods: currentPaymentMethods
  }))
  store.commit('setPayAmount', open_amount.value)
}

/**
 * Show fields based on the selected payment method
 * @param {object} fieldColumnanme
 */
export function isDisplayFieldPayment(
  fieldColumnanme,
  paymentMethods
) {
  if (isEmptyValue(paymentMethods)) paymentMethods = store.getters.getPaymentMethods
  const { payment_method } = paymentMethods
  if (isEmptyValue(payment_method)) return false
  let isShow
  switch (fieldColumnanme) {
    case 'Value':
      isShow = ['D', 'K', 'T', 'A', 'P', 'C'].includes(payment_method.tender_type)
      break
    case 'recipientBank':
    case 'issuingBank':
    case 'banksAccounts':
      isShow = ['P'].includes(payment_method.tender_type)
      break
    case 'Date':
      isShow = ['M', 'Z', 'D', 'K', 'T', 'A', 'P'].includes(payment_method.tender_type)
      break
    case 'EMail':
      isShow = ['Z'].includes(payment_method.tender_type)
      break
    case 'Bank':
      isShow = ['T', 'A'].includes(payment_method.tender_type)
      break
    case 'Phone':
      isShow = ['K', 'T', 'A', 'P', 'C'].includes(payment_method.tender_type)
      break
    case 'ReferenceNo':
      isShow = ['M', 'Z', 'D', 'K', 'T', 'A', 'P'].includes(payment_method.tender_type)
      break
    case 'AccountNo':
      isShow = ['A'].includes(payment_method.tender_type)
      break
    case 'creditMemo':
    case 'Description':
      isShow = ['M'].includes(payment_method.tender_type)
      break
    default:
      isShow = false
      break
  }
  return isShow
}

export function clearFieldsCollections() {
  const value = undefined
  store.commit('setAttributeField', {
    field: 'bankAccounts',
    attribute: 'currentAccount',
    value
  })
  store.commit('setAttributeField', {
    field: 'customerCredits',
    attribute: 'currentCustomerCredist',
    value
  })
  store.commit('setAttributeField', {
    field: 'field',
    attribute: 'value',
    value
  })
  store.commit('setAttributeField', {
    field: 'field',
    attribute: 'date',
    value
  })
  store.commit('setAttributeField', {
    field: 'field',
    attribute: 'phone',
    value
  })
  store.commit('setAttributeField', {
    field: 'field',
    attribute: 'referenceNo',
    value
  })
  store.commit('setAttributeField', {
    field: 'field',
    attribute: 'bank',
    value
  })
  store.commit('setAttributeField', {
    field: 'banks',
    attribute: 'issuingBank',
    value
  })
  store.commit('setAttributeField', {
    field: 'banks',
    attribute: 'recipientBank',
    value
  })
}
