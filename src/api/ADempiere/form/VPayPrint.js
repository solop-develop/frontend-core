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

// import { request } from '@/utils/ADempiere/request'
// import { config } from '@/utils/ADempiere/config'

// List Payment Selection
export function listPaymentSelection() {
  // return request({
  //   url: `${config.payrollActionNotice.endpoint}/list-payment-selecction`,
  //   method: 'get'
  // })
  //   .then(response => {
  //     return response
  //   })
  console.info(`Implement Service to List Payment Selection`)
}

export function paymentSelection({
  id,
  uuid
}) {
  console.info(`Implement Service to obtain Payment Selection Data ID ${id} UUID ${uuid}`)
}
