// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import language from '@/lang'

export default [
  {
    // Organization
    label: language.t('accounting.organization'),
    columnName: 'DisplayColumn_AD_Org_ID',
    align: 'center',
    default: true,
    width: 110
  },
  {
    // Account
    label: language.t('accounting.account'),
    columnName: 'DisplayColumn_Account_ID',
    align: 'center',
    default: true,
    width: 80
  },
  {
    // Posted Debit
    label: language.t('accounting.debitPosted'),
    columnName: 'AmtAcctDr',
    align: 'right',
    default: true,
    width: 165
  },
  {
    // Posted Credit
    label: language.t('accounting.PostedCredit'),
    columnName: 'AmtSourceCr',
    align: 'right',
    default: true,
    width: 168
  },
  {
    // Transaction Date
    label: language.t('accounting.transactionDate'),
    columnName: 'DateTrx',
    align: 'left',
    displaySourceInformation: true,
    width: 180
  },
  {
    // Currency
    label: language.t('accounting.currency'),
    columnName: 'DisplayColumn_C_Currency_ID',
    align: 'left',
    displaySourceInformation: true,
    width: 80
  },
  {
    // Debit Source
    label: language.t('accounting.debitSource'),
    columnName: 'AmtAcctDr',
    align: 'right',
    displaySourceInformation: true,
    width: 165
  },
  {
    // Debit Source
    label: language.t('accounting.creditSource'),
    columnName: 'AmtSourceCr',
    align: 'right',
    displaySourceInformation: true,
    width: 168
  },
  {
    // Rate
    label: language.t('accounting.rate'),
    columnName: 'C_Tax_ID',
    align: 'right',
    displaySourceInformation: true,
    width: 80
  },
  {
    // Product
    label: language.t('accounting.product'),
    columnName: 'DisplayColumn_M_Product_ID',
    align: 'center',
    default: true,
    width: 110
  },
  {
    // Business Partner
    label: language.t('accounting.businessPartner'),
    columnName: 'DisplayColumn_C_BPartner_ID',
    align: 'center',
    default: true,
    width: 142
  },
  {
    // Project
    label: language.t('accounting.Project'),
    columnName: 'DisplayColumn_C_Project_ID',
    align: 'center',
    default: true,
    width: 85
  },
  {
    // Campaing
    label: language.t('accounting.Campaign'),
    columnName: 'DisplayColumn_C_Campaign_ID',
    align: 'center',
    default: true,
    width: 85
  },
  {
    // Accounting date
    label: language.t('accounting.accountingDate'),
    columnName: 'DateAcct',
    align: 'center',
    default: true,
    width: 125
  },
  {
    // Period
    label: language.t('accounting.period'),
    columnName: 'DisplayColumn_C_Period_ID',
    align: 'right',
    default: true,
    width: 80
  },
  {
    label: language.t('accounting.um'),
    columnName: 'DisplayColumn_C_UOM_ID',
    align: 'left',
    displayQuantity: true,
    width: 80
  },
  {
    label: language.t('accounting.quantity'),
    columnName: 'Qty',
    align: 'right',
    displayQuantity: true,
    width: 85
  },
  {
    // Table Name
    label: language.t('accounting.table'),
    columnName: 'DisplayColumn_AD_Table_ID',
    align: 'left',
    displayDocumentInformation: true,
    width: 80
  },
  {
    // Record ID
    label: language.t('accounting.recordId'),
    columnName: 'Record_ID',
    align: 'right',
    displayDocumentInformation: true,
    width: 125
  },
  {
    // Description
    label: language.t('accounting.description'),
    columnName: 'Description',
    align: 'left',
    displayDocumentInformation: true,
    width: 100
  },
  {
    // Type of application
    label: language.t('accounting.typeApplication'),
    columnName: 'DisplayColumn_PostingType',
    align: 'left',
    default: true,
    width: 145
  }
]
