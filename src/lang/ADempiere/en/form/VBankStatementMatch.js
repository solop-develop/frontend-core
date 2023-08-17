/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

const VBankStatementMatch = {
  steps: {
    searchCriteria: 'Search Criteria',
    automaticMatch: 'Automatic Matching',
    pendingMatch: 'Pending Matching',
    confirmImport: 'Confirm / Import'
  },
  searchMode: {
    title: 'Search Mode',
    matched: 'Matched',
    notMatched: 'Not Matched'
  },
  field: {
    bankAccount: 'Bank Account',
    bankStatement: 'Bank Statement',
    businessPartner: 'Business Partner',
    searchMode: 'Search Mode',
    matchesPayment: 'Matches Payment',
    totalPayment: 'Total Payment',
    transactionDate: 'Transaction Date',
    selectNotMatched: 'No Match',
    selectMatched: 'Matches',
    simulateMatch: 'Simulate Match',
    assignedMatch: 'Assigned Match',
    unassignedMatch: 'Unassigned Match'
  },
  bankStatement: {
    name: 'Name',
    documentNo: 'Document No.',
    bankStatementDate: 'Bank Statement Date',
    bank: 'Bank',
    bankAccount: 'Bank Account',
    currentBalance: 'Current Balance',
    beginningBalance: 'Beginning Balance',
    statementDifference: 'Statement Difference',
    endingBalance: 'Ending Balance'
  },
  automaticMatch: {
    title: 'Automatic Matching',
    table: {
      date: 'Date',
      transactionDate: 'Transaction Date',
      receipt: 'Receipts',
      documentNo: 'Document No.',
      businessPartner: 'Business Partner',
      tenderType: 'Payment Type',
      currency: 'Currency',
      amount: 'Amount',
      description: 'Description',
      referenceNo: 'Reference No.',
      memo: 'Memo',
      match: 'Match',
      total: 'Total'
    },
    withoutAutomaticMatch: 'Without Automatic Matching'
  },
  bankMovements: {
    title: 'Bank Movements',
    table: {
      date: 'Date',
      transactionDate: 'Transaction Date',
      receipt: 'Receipts',
      referenceNo: 'Reference No.',
      businessPartner: 'Business Partner',
      currency: 'Currency',
      amount: 'Amount',
      memo: 'Memo',
      match: 'Match',
      total: 'Total'
    }
  },
  systemPayments: {
    title: 'System Payments',
    table: {
      date: 'Date',
      transactionDate: 'Transaction Date',
      paymentDate: 'Payment Date',
      receipt: 'Receipts',
      documentNo: 'Document No.',
      businessPartner: 'Business Partner',
      tenderType: 'Payment Type',
      currency: 'Currency',
      amount: 'Amount',
      description: 'Description',
      match: 'Match',
      total: 'Total'
    }
  },
  result: 'Result'
}

export default VBankStatementMatch
