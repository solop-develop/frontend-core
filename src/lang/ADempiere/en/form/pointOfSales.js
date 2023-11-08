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
    updateBusinessPartner: 'Update Business Partner',
    fieldCutomer: {
      code: 'Cédula',
      identificationNumber: 'Identification Number',
      typePerson: 'Type of Person',
      taxPayer: 'Taxpayer',
      taxpayerType: 'Type of Taxpayer',
      name: 'Name',
      name2: 'Name 2',
      email: 'Email',
      phone: 'Phone'
    }
  },
  collection: {
    field: {
      fullPayment: 'Total Payment',
      paymentMethods: 'Payment Methods',
      currency: 'Currency',
      bank: 'Bank',
      accountNo: 'Account No',
      receivingBank: 'Receiving Bank',
      customerAccount: 'Customer Account',
      issuingBank: 'Issuing Bank',
      bankAccountType: {
        label: 'Bank Account Type',
        currentAccount: 'Current Account',
        checking: 'Savings'
      },
      code: 'Cedula',
      date: 'Date',
      phone: 'Telephone',
      referenceNo: 'Reference No.',
      nameHolder: 'Name of Holder',
      creditMemo: 'Credit Memo',
      description: 'Description',
      creditCard: 'Credit Card',
      cardNumber: 'Card Number',
      email: 'Mail'
    },
    chargeAmount: 'Charge',
    creditAmount: 'Installment',
    others: 'Others',
    customerAccount: 'Customer Account',
    recipientBank: 'Recipient Bank',
    issuingBank: 'Issuing Bank',
    bank: 'Bank',
    creditMemo: 'Credit Note',
    addPayment: 'Payment Added Successfully'
  },
  conversionRate: {
    withoutConversionRate: 'There is no current exchange rate '
  },
  keyLayout: {
    quantity: 'Quantity'
  },
  order: {
    dateOfOrder: 'Date of Order',
    documentType: 'Document Type',
    showHistoryOrdersList: 'Show Orders History'
  },
  orderLine: {
    edit: 'Line Edit',
    updateSuccess: 'Order Line Successfully Updated'
  },
  permissions: {
    previewDocumentNotAllowed: '"Document Preview" is not allowed for your user'
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
