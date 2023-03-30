// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

// Get Instance for connectionimport {
import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

// systemPayments

export function listSystemPayments({
  bankAccountId,
  bankAccountUuid,
  dateFrom,
  dateTo,
  businessPartnerId,
  businessPartnerUuid,
  paymentAmountFrom,
  paymentAmountTo,
  matchMode
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/list-payments`,
    method: 'get',
    params: {
      bank_account_id: bankAccountId,
      bank_account_uuid: bankAccountUuid,
      transaction_date_from: dateFrom,
      transaction_date_to: dateTo,
      business_partner_id: businessPartnerId,
      business_partner_uuid: businessPartnerUuid,
      payment_amount_from: paymentAmountFrom,
      payment_amount_to: paymentAmountTo,
      match_mode: matchMode
    }
  })
    .then(receiptsListResponse => {
      return receiptsListResponse
    })
}

// import Movements

export function listImportMovements({
  bankAccountId,
  bankAccountUuid,
  dateFrom,
  dateTo,
  businessPartnerId,
  businessPartnerUuid,
  paymentAmountFrom,
  paymentAmountTo,
  matchMode
}) {
  return request({
    url: `${config.VBankStatementMatch.endpoint}/list-imported-bank-movements`,
    method: 'get',
    params: {
      bank_account_id: bankAccountId,
      bank_account_uuid: bankAccountUuid,
      transaction_date_from: dateFrom,
      transaction_date_to: dateTo,
      business_partner_id: businessPartnerId,
      business_partner_uuid: businessPartnerUuid,
      payment_amount_from: paymentAmountFrom,
      payment_amount_to: paymentAmountTo,
      match_mode: matchMode
    }
  })
    .then(receiptsListResponse => {
      return receiptsListResponse
    })
}
