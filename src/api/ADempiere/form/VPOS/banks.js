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

import { request } from '@/utils/ADempiere/request'

/**
 * List Banks
 */
export function listBanksRequest({
  posId
}) {
  return request({
    url: `point-of-sales/${posId}/banks`,
    method: 'get',
    params: {
      page_size: 100
    }
  })
}

/**
 * Get Bank
 */
export function getBankRequest({
  posId,
  id
}) {
  return request({
    url: `point-of-sales/${posId}/banks/${id}`,
    method: 'get'
  })
}

/**
 * List Bank Accounts
 */
export function listBankAccountsRequest({
  posId,
  bankId
}) {
  return request({
    url: `point-of-sales/${posId}/banks/${bankId}/bank-accounts`,
    method: 'get',
    params: {
      page_size: 100
    }
  })
}

/**
 * Get Bank Account
 */
export function getBankAccountRequest({
  posId,
  bankId,
  id
}) {
  return request({
    url: `point-of-sales/${posId}/banks/${bankId}/bank-accounts/${id}`,
    method: 'get'
  })
}
