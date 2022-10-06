/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const pointOfSales = {
  customer: {
    listCustomers: 'List Customers',
    listBusinessPartners: 'List Business Partners',
    newCustomer: 'New Customer',
    newBusinessPartner: 'New Business Partner',
    updateCustomer: 'Update Customer',
    updateBusinessPartner: 'Update Business Partner'
  },
  collection: {
    chargeAmount: 'Charge',
    creditAmount: 'Installment',
    others: 'Others'
  },
  conversionRate: {
    withoutConversionRate: 'There is no current exchange rate '
  },
  keyLayout: {
    quantity: 'Quantity'
  },
  order: {
    dateOfOrder: 'Date of Order',
    documentType: 'Document Type'
  },
  orderLine: {
    edit: 'Line Edit',
    updateSuccess: 'Order Line Successfully Updated'
  },
  pin: {
    validatePin: 'Validate PIN',
    validateSuccessfully: 'PIN Validate Successfully'
  },
  print: {
    cloudNotConnectPirnter: 'Could not connect to the printer'
  },
  withoutPOSTerminal: 'Without POS Terminal',
  withoutPriceList: 'Without Price List'
}

export default pointOfSales
