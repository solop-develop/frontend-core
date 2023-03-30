/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

const VBankStatementMatch = {
  steps: {
    searchCriteria: 'Search Criteria',
    automaticMatch: 'Automatic Matching',
    pendingMatch: 'Pending Matching',
    summaryAdjustment: 'Resume and Adjust'
  },
  field: {
    bankAccount: 'Bank Account',
    businessPartner: 'Business Partner',
    searchMode: 'Search Mode',
    totalPayment: 'Total Payment',
    transactionDate: 'Transaction Date',
    selectNotMatched: 'No Match',
    selectMatched: 'Matches'
  },
  AutomaticMatch: {
    title: 'Automatic Matching',
    headerTable: {
      transactionDate: 'Transaction Date',
      receipt: 'Receipts',
      documentNo: 'Document No.',
      businessPartner: 'Business Partner',
      tenderType: 'Payment Type',
      currency: 'Currency',
      quantity: 'Quantity',
      description: 'Description',
      referenceNo: 'Reference No.',
      memo: 'Memo'
    }
  },
  importedMovements: {
    title: 'Imported Movements',
    headerTable: {
      transactionDate: 'Transaction Date',
      receipt: 'Receipts',
      referenceNo: 'Reference No.',
      businessPartner: 'Business Partner',
      currency: 'Currency',
      quantity: 'Quantity',
      memo: 'Memo'
    }
  },
  systemPayments: {
    title: 'System Payments',
    headerTable: {
      transactionDate: 'Transaction Date',
      receipt: 'Receipts',
      documentNo: 'Document No.',
      businessPartner: 'Business Partner',
      tenderType: 'Payment Type',
      currency: 'Currency',
      quantity: 'Quantity',
      description: 'Description'
    }
  }
}

export default VBankStatementMatch
