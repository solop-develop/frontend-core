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

import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

/**
 * Set Payment Selection
 * @param {String} id, Current Payment Selection ID
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
 * @param {String} paymentSelectionId, Current Payment Selection ID
 * @param {String} paymentSelectionUuid, Payment Selection Uuid
 * @param {String} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */
export function paymentRules({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentSelectionUuid,
  //  Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/list-payment-rules`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_selection_uuid: paymentSelectionUuid,
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
 * @param {String} paymentSelectionId, Current Payment Selection ID
 * @param {String} paymentSelectionUuid, Payment Selection Uuid
 * @param {String} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */
export function listPaymentTable({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentSelectionUuid,
  paymentRuleId,
  paymentRuleUuid,
  //  Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/list-payments`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_selection_uuid: paymentSelectionUuid,
      payment_rule_id: paymentRuleId,
      payment_rule_uuid: paymentRuleUuid,
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
 * @param {String} searchValue, Search value optional
 * @param {String} paymentSelectionId, Current Payment Selection ID
 * @param {String} paymentSelectionUuid, Payment Selection Uuid
 * @param {String} paymentRuleId, Payment Rules ID
 * @param {String} paymentRuleUuid, Payment Rule Uuid
 * @param {String} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */

export function documentSequence({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentSelectionUuid,
  paymentRuleId,
  paymentRuleUuid,
  banckAccountId,
  //  Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/document-no`,
    method: 'get',
    params: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_selection_uuid: paymentSelectionUuid,
      payment_rule_id: paymentRuleId,
      payment_rule_uuid: paymentRuleUuid,
      bank_account_id: banckAccountId,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}

/**
 * process
 * @param {String} searchValue, Search value optional
 * @param {String} paymentSelectionId, Current Payment Selection ID
 * @param {String} paymentSelectionUuid, Payment Selection Uuid
 * @param {String} paymentRuleId, Payment Rules ID
 * @param {String} paymentRuleUuid, Payment Rule Uuid
 * @param {String} pageSize, Page Size
 * @param {String} pageToken, Page Token
 */

export function process({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentSelectionUuid,
  paymentRuleId,
  paymentRuleUuid,
  documentNo,
  //  Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/process`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_selection_uuid: paymentSelectionUuid,
      payment_rule_id: paymentRuleId,
      payment_rule_uuid: paymentRuleUuid,
      document_no: documentNo,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}
export function exportPayment({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentSelectionUuid,
  paymentRuleId,
  paymentRuleUuid,
  documentNo,
  //  Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/export`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_selection_uuid: paymentSelectionUuid,
      payment_rule_id: paymentRuleId,
      payment_rule_uuid: paymentRuleUuid,
      document_no: documentNo,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}
export function print({
  //  DSL Query
  searchValue,
  paymentSelectionId,
  paymentSelectionUuid,
  paymentRuleId,
  paymentRuleUuid,
  documentNo,
  //  Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `${config.vPayPrint.endpoint}/print`,
    method: 'post',
    data: {
      search_value: searchValue,
      payment_selection_id: paymentSelectionId,
      payment_selection_uuid: paymentSelectionUuid,
      payment_rule_id: paymentRuleId,
      payment_rule_uuid: paymentRuleUuid,
      document_no: documentNo,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}
