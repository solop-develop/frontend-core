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

// Get Instance for connectionimport {
import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

// Bank Statement
export function requestGetBankStatement({
  id,
  uuid
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/bank-statement`,
    method: 'get',
    params: {
      id,
      uuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Bank Accounts
export function requestListBankAccounts({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/bank-accounts`,
    method: 'get',
    params: {
      search_value: searchValue,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Business Partners
export function listBusinessPartners({
  searchValue
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/business-partners`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Search Modes
export function requestSearchModesList({
  searchValue
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/search-modes`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Import Movements
export function requestImportedBankMovements({
  matchMode,
  searchValue,
  bankStatementId,
  bankAccountId,
  paymentAmountFrom,
  paymentAmountTo,
  transactionDateFrom,
  transactionDateTo
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/imported-bank-movements`,
    method: 'get',
    params: {
      match_mode: matchMode,
      search_value: searchValue,
      bank_statement_id: bankStatementId,
      bank_account_id: bankAccountId,
      payment_amount_from: paymentAmountFrom,
      payment_amount_to: paymentAmountTo,
      transaction_date_from: transactionDateFrom,
      transaction_date_to: transactionDateTo
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Payments
export function requestPaymentsList({
  matchMode,
  searchValue,
  bankStatementId,
  bankAccountId,
  paymentAmountTo,
  bankAccountUuid,
  businessPartnerId,
  transactionDateTo,
  paymentAmountFrom,
  transactionDateFrom,
  businessPartnerUuid
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/payments`,
    method: 'get',
    params: {
      match_mode: matchMode,
      search_value: searchValue,
      bank_statement_id: bankStatementId,
      bank_account_id: bankAccountId,
      payment_amount_to: paymentAmountTo,
      bank_account_uuid: bankAccountUuid,
      business_partner_id: businessPartnerId,
      transaction_date_to: transactionDateTo,
      payment_amount_from: paymentAmountFrom,
      transaction_date_from: transactionDateFrom,
      business_partner_uuid: businessPartnerUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Matching Movements
export function requestMatchingMovementsList({
  matchMode,
  searchValue,
  bankStatementId,
  bankAccountId,
  paymentAmountTo,
  bankAccountUuid,
  businessPartnerId,
  transactionDateTo,
  paymentAmountFrom,
  transactionDateFrom,
  businessPartnerUuid
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/matching-movements`,
    method: 'get',
    params: {
      match_mode: matchMode,
      search_value: searchValue,
      bank_statement_id: bankStatementId,
      bank_account_id: bankAccountId,
      payment_amount_to: paymentAmountTo,
      bank_account_uuid: bankAccountUuid,
      business_partner_id: businessPartnerId,
      transaction_date_to: transactionDateTo,
      payment_amount_from: paymentAmountFrom,
      transaction_date_from: transactionDateFrom,
      business_partner_uuid: businessPartnerUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// List Bank Statements
export function requestBankStatemensList({
  bankAccountId,
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/bank-statements`,
    method: 'get',
    params: {
      bank_account_id: bankAccountId,
      search_value: searchValue,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(response => {
      // return camelizeObjectKeys(response)
      return {
        nextPageToken: response.next_page_token,
        recordCount: response.record_count,
        records: response.records.map(row => {
          return camelizeObjectKeys(row)
        })
      }
    })
}

// Process
export function processMovements({
  matchMode,
  searchValue,
  bankAccountId,
  bankAccountUuid,
  paymentAmountTo,
  paymentAmountFrom,
  transactionDateTo,
  businessPartnerId,
  businessPartnerUuid,
  transactionDateFrom,
  macthingSelectionsList
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/process`,
    method: 'post',
    params: {
      match_mode: matchMode,
      search_value: searchValue,
      bank_account_id: bankAccountId,
      payment_amount_to: paymentAmountTo,
      bank_account_uuid: bankAccountUuid,
      business_partner_id: businessPartnerId,
      transaction_date_to: transactionDateTo,
      payment_amount_from: paymentAmountFrom,
      transaction_date_from: transactionDateFrom,
      business_partner_uuid: businessPartnerUuid,
      matching_selections_list: macthingSelectionsList
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestListUnMatch({
  listImportedMovements
}) {
  const listId = listImportedMovements.map(list => list.id)
  return request({
    url: `${config.VBankStatementMatch.endpoint}/unmatch`,
    method: 'put',
    data: {
      imported_movements_ids: listId
    }
  })
}

export function requestResultMovements({
  searchValue,
  bankAccountId,
  paymentAmountFrom,
  paymentAmountTo,
  transactionDateFrom,
  transactionDateTo,
  bankStatementId
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/result-movements`,
    method: 'get',
    params: {
      search_value: searchValue,
      bank_account_id: bankAccountId,
      payment_amount_to: paymentAmountTo,
      bank_statement_id: bankStatementId,
      transaction_date_to: transactionDateTo,
      payment_amount_from: paymentAmountFrom,
      transaction_date_from: transactionDateFrom
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestProcess({
  bankAccountId,
  paymentAmountFrom,
  paymentAmountTo,
  transactionDateFrom,
  transactionDateTo,
  bankStatementId
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/process`,
    method: 'post',
    data: {
      bank_account_id: bankAccountId,
      payment_amount_to: paymentAmountTo,
      bank_statement_id: bankStatementId,
      transaction_date_to: transactionDateTo,
      payment_amount_from: paymentAmountFrom,
      transaction_date_from: transactionDateFrom
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
