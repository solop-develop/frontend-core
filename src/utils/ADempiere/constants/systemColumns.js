/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

export const CLIENT = 'AD_Client_ID'

export const ORGANIZATION = 'AD_Org_ID'

export const ACTIVE = 'IsActive'

export const PROCESSING = 'Processing'

export const PROCESSED = 'Processed'

export const UUID = 'UUID'

export const ID = 'ID'

export const RECORD_ID = 'Record_ID'

export const COUNTRY = 'C_Country_ID'

export const CURRENCY = 'C_Currency_ID'

export const WAREHOUSE = 'M_Warehouse_ID'

export const IS_SALES_TRANSACTION = 'IsSalesTransaction'

export const IS_SO_TRX = 'IsSOTrx'

export const VALUE = 'Value'

export const DOCUMENT_NO = 'DocumentNo'

export const DOCUMENT_STATUS = 'DocStatus'

export const DOCUMENT_ACTION = 'DocAction'

/**
 * Is sales transaction (IsSOTrx, IsSalesTransaction)
 */
export const SALES_TRANSACTION_COLUMNS = [
  IS_SALES_TRANSACTION,
  IS_SO_TRX
]

/**
 * Log columns list into table
 * Manages with user session
 */
export const LOG_COLUMNS_NAME_LIST = [
  'Created',
  'CreatedBy',
  'Updated',
  'UpdatedBy'
]

/**
 * Columns list into standard table
 */
export const STANDARD_COLUMNS_NAME_LIST = [
  ...LOG_COLUMNS_NAME_LIST,
  // Table Name '_ID'
  CLIENT,
  ORGANIZATION,
  ACTIVE,
  UUID
]

/**
 * Columns list into document table
 */
export const DOCUMENT_COLUMNS_NAME_LIST = [
  ...STANDARD_COLUMNS_NAME_LIST,
  'C_DocType_ID',
  'DateDoc',
  'Description',
  DOCUMENT_ACTION,
  DOCUMENT_STATUS,
  DOCUMENT_NO,
  'IsApproved',
  PROCESSED,
  PROCESSING
]

export const ACCOUNTING_COLUMNS = [
  'C_AcctSchema_ID',
  CURRENCY,
  'C_Convertion_Type_ID'
]

/**
 * Documents status columns list
 */
export const DOCUMENT_STATUS_COLUMNS_LIST = [
  DOCUMENT_STATUS,
  'O_DocStatus'
]

export function isDocumentStatus({ columnName, elementColumnName }) {
  return DOCUMENT_STATUS_COLUMNS_LIST.includes(columnName) ||
    DOCUMENT_STATUS_COLUMNS_LIST.includes(elementColumnName)
}

export const COLUMN_IS_ACTIVE = {
  columnName: ACTIVE, // column name of field
  defaultValue: true, // default value when loading
  valueIsReadOnlyForm: false, // value that activates read-only form
  isChangedAllForm: false // change the entire form to read only including this field
}

export const COLUMN_PROCESSING = {
  columnName: PROCESSING,
  defaultValue: false,
  valueIsReadOnlyForm: false,
  isChangedAllForm: true
}

export const COLUMN_PROCESSED = {
  columnName: PROCESSED,
  defaultValue: false,
  valueIsReadOnlyForm: true,
  isChangedAllForm: true
}

export const READ_ONLY_COLUMNS_LIST = [
  ACTIVE,
  PROCESSING,
  PROCESSED
]

/**
 * Fields with this column name, changed all fields is read only
 */
export const READ_ONLY_FORM_COLUMNS = [
  COLUMN_IS_ACTIVE,
  COLUMN_PROCESSED,
  COLUMN_PROCESSING
]

export function readOnlyColumn(columnName) {
  return READ_ONLY_FORM_COLUMNS.find(item => {
    return item.columnName === columnName
  })
}

/**
 * Validate if column name is reserved
 * @return {Boolean}
 */
export function isReservedColumn(columnName) {
  //	its must be change for dynamic dictionary query
  return columnName === 'AD_Client_ID' ||
    //
    columnName.startsWith('Created') ||
    columnName.startsWith('Updated') ||
    columnName === 'EntityType' ||
    columnName === 'DocumentNo' ||
    columnName === 'Processed' ||
    columnName === 'IsSelfService' ||
    columnName === 'DocAction' ||
    columnName === 'DocStatus' ||
    columnName === 'Posted' ||
    columnName === 'IsReconciled' ||
    columnName === 'IsApproved' || // BF [ 1943682 ]
    columnName === 'IsGenerated' || // BF [ 1943682 ]
    columnName.startsWith('Ref_') ||
    //	Order/Invoice
    columnName === 'GrandTotal' ||
    columnName === 'TotalLines' ||
    columnName === 'C_CashLine_ID' ||
    columnName === 'C_Payment_ID' ||
    columnName === 'IsPaid' ||
    columnName === 'IsAllocated' ||
    // Bug [ 1807947 ]
    columnName === 'C_DocType_ID' ||
    columnName === 'Line' ||
    columnName === 'UUID' ||
    columnName === 'Reversal_ID' ||
    columnName === 'ReversalLine_ID' ||
    columnName === 'ProcessedOn' ||
    columnName === 'Processing' ||
    columnName === 'Related_ID' ||
    columnName === 'SeqNo' ||
    columnName === 'IsActive' ||
    columnName === 'RelatedPayment_ID' ||
    columnName === 'RelatedProduct_ID' ||
    columnName === 'Ref_BPartner_ID' ||
    columnName === 'Ref_DefinitionPeriod_ID' ||
    columnName === 'Ref_InOut_ID' ||
    columnName === 'Ref_InOutLine_ID' ||
    columnName === 'Ref_Invoice_ID' ||
    columnName === 'Ref_InvoiceLine_ID' ||
    columnName === 'Ref_Order_ID' ||
    columnName === 'Ref_OrderLine_ID' ||
    columnName === 'Ref_Payment_ID' ||
    columnName === 'Ref_RMA_ID' ||
    columnName === 'Ref_RMALine_ID' ||
    columnName === 'IsReversal' ||
    columnName === 'DatePrinted' ||
    columnName === 'IsPrinted' ||
    columnName === 'IsOverUnderPayment' ||
    (columnName.startsWith('Ref_') && columnName.endsWith('_ID'))
}

export const SPECIAL_ZERO_ID_TABLES = [
  'AD_Client',
  'AD_Org',
  'AD_Warehouse',
  'AD_ReportView',
  'AD_Role',
  'AD_System',
  'AD_User',
  'C_DocType',
  'GL_Category',
  'M_AttributeSet',
  'M_AttributeSetInstance'
]
