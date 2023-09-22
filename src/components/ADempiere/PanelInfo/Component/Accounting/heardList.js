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
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import language from '@/lang'

export default [
  {
    // Organization
    label: language.t('form.accountingViewer.organization'),
    columnName: 'DisplayColumn_AD_Org_ID',
    align: 'center',
    default: true,
    width: 110
  },
  {
    // Account
    label: language.t('form.accountingViewer.account'),
    columnName: 'DisplayColumn_Account_ID',
    align: 'center',
    default: true,
    width: 80
  },
  {
    // Posted Debit
    label: language.t('form.accountingViewer.accountedDebit'),
    columnName: 'AmtAcctDr',
    align: 'right',
    default: true,
    width: 165
  },
  {
    // Posted Credit
    label: language.t('form.accountingViewer.postedCredit'),
    columnName: 'AmtAcctCr',
    align: 'right',
    default: true,
    width: 168
  },
  {
    // Transaction Date
    label: language.t('form.accountingViewer.transactionDate'),
    columnName: 'DateTrx',
    align: 'left',
    displaySourceInformation: true,
    width: 180
  },
  {
    // Currency
    label: language.t('form.accountingViewer.currency'),
    columnName: 'DisplayColumn_C_Currency_ID',
    align: 'left',
    displaySourceInformation: true,
    width: 80
  },
  {
    // Debit Source
    label: language.t('form.accountingViewer.sourceDebit'),
    columnName: 'AmtAcctDr',
    align: 'right',
    displaySourceInformation: true,
    width: 165
  },
  {
    // Debit Source
    label: language.t('form.accountingViewer.sourceCredit'),
    columnName: 'AmtSourceCr',
    align: 'right',
    displaySourceInformation: true,
    width: 168
  },
  {
    // Rate
    label: language.t('form.accountingViewer.rate'),
    columnName: 'C_Tax_ID',
    align: 'right',
    displaySourceInformation: true,
    width: 80
  },
  {
    // Product
    label: language.t('form.accountingViewer.product'),
    columnName: 'DisplayColumn_M_Product_ID',
    align: 'center',
    default: true,
    width: 110
  },
  {
    // Business Partner
    label: language.t('form.accountingViewer.businessPartner'),
    columnName: 'DisplayColumn_C_BPartner_ID',
    align: 'center',
    default: true,
    width: 142
  },
  {
    // Project
    label: language.t('form.accountingViewer.project'),
    columnName: 'DisplayColumn_C_Project_ID',
    align: 'center',
    default: true,
    width: 85
  },
  {
    // Campaing
    label: language.t('form.accountingViewer.campaign'),
    columnName: 'DisplayColumn_C_Campaign_ID',
    align: 'center',
    default: true,
    width: 85
  },
  {
    // Accounting date
    label: language.t('form.accountingViewer.accountDate'),
    columnName: 'DateAcct',
    align: 'center',
    default: true,
    width: 125
  },
  {
    // Period
    label: language.t('form.accountingViewer.period'),
    columnName: 'DisplayColumn_C_Period_ID',
    align: 'right',
    default: true,
    width: 80
  },
  {
    label: language.t('form.accountingViewer.uom'),
    columnName: 'DisplayColumn_C_UOM_ID',
    align: 'left',
    displayQuantity: true,
    width: 80
  },
  {
    label: language.t('form.accountingViewer.quantity'),
    columnName: 'Qty',
    align: 'right',
    displayQuantity: true,
    width: 85
  },
  {
    // Table Name
    label: language.t('form.accountingViewer.table'),
    columnName: 'DisplayColumn_AD_Table_ID',
    align: 'left',
    displayDocumentInformation: true,
    width: 80
  },
  {
    // Record ID
    label: language.t('form.accountingViewer.recordId'),
    columnName: 'Record_ID',
    align: 'right',
    displayDocumentInformation: true,
    width: 125
  },
  {
    // Description
    label: language.t('form.accountingViewer.description'),
    columnName: 'Description',
    align: 'left',
    displayDocumentInformation: true,
    width: 100
  },
  {
    // Type of application
    label: language.t('form.accountingViewer.postingType'),
    columnName: 'DisplayColumn_PostingType',
    align: 'left',
    default: true,
    width: 145
  }
]
