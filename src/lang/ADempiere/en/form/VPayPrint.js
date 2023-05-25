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

const VPayPrint = {
  paymentSelection: 'Payment Selection',
  bankAccount: 'Bank Account',
  currentBalance: 'Current Balance',
  paymentRule: 'Payment Rule',
  currency: 'Currency',
  documentNo: 'Document Number',
  numberPayments: 'Number of Payments',
  nextSequence: 'Next Sequence',
  buttons: {
    labelPanel: 'What do you want to do?',
    print: 'Print',
    toExport: 'Export',
    processOnLine: 'Transfer'
  },
  headerTable: {
    title: 'Batch Detail',
    provider: 'Supplier',
    invoice: 'OV/Invoice',
    grandTotal: 'Grand Total',
    subscriber: 'Subscriber',
    payable: 'Amount Payable',
    pending: 'Pending'
  },
  message: {
    paymentRule: {
      onCredit: 'To Credit',
      check: 'Check',
      directDeposit: 'Direct Deposit',
      directDebit: 'Direct Debit',
      creditCard: 'Credit Card'
    },
    processMessage: 'Do you want to Process All Payments type ',
    printMessage: 'Do you want to Print All Payments type ',
    ExportMessage: 'Do you want to Export All Payments type ',
    printRemittanceMessage: '¿ Desea Print Remittance ?',
    confirmPrintMessage: '¿ Desea Confirm Print ?'
  }
}

export default VPayPrint
