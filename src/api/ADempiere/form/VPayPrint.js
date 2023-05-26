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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Set Payment Selection
 * @param {Number} id, Current Payment Selection ID
 * @param {String} uuid, Current Payment Selection UUID
 */
export function paymentSelection({
  id,
  uuid
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/payment-selection`,
    method: 'get',
    params: {
      id,
      uuid
    }
  })
    .then(response => {
      return response
    })
}

/**
 * List Payment Selection
 */
export function paymentSelections() {
  return request({
    url: `${config.vPayPrint.endpoint}/list-payment-selections`,
    method: 'post'
  })
    .then(response => {
      return response
    })
}

/**
 * list Payment Rules
 * @param {String} searchValue, Search value optional
 * @param {Number} paymentSelectionId, Current Payment Selection ID
 * @param {Number} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */
export function paymentRules({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  //  Page Data
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/list-payment-rules`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}

/**
 * list Payment Rules
 * @param {String} searchValue, Search value optional
 * @param {Number} paymentSelectionId, Current Payment Selection ID
 * @param {Number} paymentRuleId, Current Payment Rule ID
 * @param {Number} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */
export function listPaymentTable({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentRuleId,
  //  Page Data
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/list-payments`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Document Sequence Number
 * @param {Number} paymentSelectionId, Current Payment Selection ID
 * @param {Number} paymentRuleId, Payment Rules ID
 * @param {Number} banckAccountId, Bank Account ID
 */
export function documentSequence({
  //  DSL Query
  paymentSelectionId,
  paymentRuleId,
  banckAccountId
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/document-no`,
    method: 'get',
    params: {
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      bank_account_id: banckAccountId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * process
 * @param {String} searchValue, Search value optional
 * @param {Number} paymentSelectionId, Current Payment Selection ID
 * @param {Number} paymentRuleId, Payment Rules ID
 * @param {Number} documentNo, Start Document Sequence
 * @param {Number} bankAccountId, Bank Account ID
 * @param {Number} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */
export function process({
  //  DSL Query
  paymentSelectionId,
  paymentRuleId,
  documentNo,
  bankAccountId
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/process`,
    method: 'post',
    data: {
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      document_no: documentNo,
      bank_account_id: bankAccountId
    }
  })
    .then(response => {
      return response
    })
}

export function exportPayment({
  //  DSL Query
  paymentSelectionId,
  paymentRuleId,
  documentNo,
  bankAccountId
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/export`,
    method: 'post',
    data: {
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      document_no: documentNo,
      bank_account_id: bankAccountId
    }
  })
    .then(response => {
      return response
    })
}

export function print({
  //  DSL Query
  paymentSelectionId,
  paymentRuleId,
  documentNo
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/print`,
    method: 'post',
    data: {
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      document_no: documentNo
    }
  })
    .then(response => {
      return response
    })
}

export function confirmPrint({
  //  DSL Query
  paymentSelectionId,
  paymentRuleId,
  documentNo,
  bankAccountId
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/confirm-print`,
    method: 'post',
    data: {
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      document_no: documentNo,
      bank_account_id: bankAccountId
    }
  })
    .then(response => {
      return response
    })
}

export function printRemittance({
  //  DSL Query
  paymentSelectionId,
  paymentRuleId,
  documentNo
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/print-remittance`,
    method: 'post',
    data: {
      payment_selection_id: paymentSelectionId,
      payment_rule_id: paymentRuleId,
      document_no: documentNo
    }
  })
    .then(response => {
      return response
    })
}
