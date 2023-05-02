/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const VAllocation = {
  title: 'Payment Allocation',
  step: {
    searchCriteria: 'Search Criteria',
    selectionPaymentsInvoice: 'Selection of Payments and Invoice',
    summaryAndAdjustment: 'Summary and Adjustment'
  },
  searchCriteria: {
    businessPartner: 'BusinessPartner',
    organization: 'Organization',
    currency: 'Currency',
    date: 'Date',
    transactionType: 'TransactionType',
    option: {
      assignFromOrder: 'Assign from Order',
      fullAmount: 'Full Amount',
      autoAssign: 'Auto-Assign',
      manual: 'Manual',
      closingBalance: 'ClosingBalance'
    }
  },
  payment: {
    title: 'Payment',
    table: {
      date: 'Date',
      apAr: 'CP - CC',
      organization: 'Organization',
      documentNo: 'No Document',
      description: 'Description',
      converted: 'Converted',
      open: 'Open',
      applied: 'Applied'
    }
  },
  invoice: {
    title: 'Invoce',
    table: {
      date: 'Date',
      apAr: 'CP - CC',
      organization: 'Organization',
      documentNo: 'No Document',
      description: 'Description',
      converted: 'Converted',
      open: 'Open',
      tradeDiscount: 'Discounts',
      writeOff: 'Adjustment',
      applied: 'Applied',
      overUnderPay: 'Payment Over/Under'
    }
  },
  description: {
    recordQuantity: 'RecordQuantity',
    totalInvoice: 'Total Invoice',
    openAmount: 'Open Amount',
    converted: 'Converted',
    paid: 'Paid',
    assigned: 'Assigned'
  }
}

export default VAllocation
