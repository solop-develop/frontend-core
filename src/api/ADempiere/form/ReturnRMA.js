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
import { config } from '@/utils/ADempiere/config'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

/**
 * CopyOrder
 * Request for Copy a Order from Source Order
 * req.query.source_order_id - Source Order ID
 * req.query.pos_id - Pos ID
 */
export function copyOrder({
  sourceOrderId,
  posId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/copy-order`,
    method: 'get',
    params: {
      source_order_id: sourceOrderId,
      pos_id: posId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Create RMA
 * Request for create a Return from Order
 * req.query.pos_id - Pos ID
 * req.query.source_order_id - Source Order ID
 * req.query.sales_representative_id - Sales Representative ID
 * req.query.is_create_lines_from_order - Create Lines From Order
 */
export function createRMA({
  isCreateLinesFromOrder,
  salesRepresentativeId,
  sourceOrderId,
  posId,
  rmaId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material`,
    method: 'post',
    data: {
      is_create_lines_from_order: isCreateLinesFromOrder,
      sales_representative_id: salesRepresentativeId,
      source_order_id: sourceOrderId,
      pos_id: posId,
      rma_id: rmaId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Delete RMA
 * Request for create a Return from Order
 * req.query.pos_id - Pos ID
 * req.query.source_order_id - Source Order ID
 * req.query.sales_representative_id - Sales Representative ID
 * req.query.is_create_lines_from_order - Create Lines From Order
 */
export function deleteRMA({
  rmaId,
  posId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/delete-RMA`,
    method: 'get',
    params: {
      rma_id: rmaId,
      pos_id: posId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Create Return Line
 */
export function createRMALine({
  sourceOrderLineId,
  description,
  quantity,
  rmaId,
  posId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material/line`,
    method: 'post',
    data: {
      source_order_line_id: sourceOrderLineId,
      rma_id: rmaId,
      pos_id: posId,
      description,
      quantity
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Delete Return Line
 */
export function deleteRMALine({
  id,
  posId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material/line`,
    method: 'DELETE',
    params: {
      id,
      pos_id: posId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Update RMA Line
 */
export function updateRMALine({
  description,
  quantity,
  posId,
  id
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material/line`,
    method: 'put',
    data: {
      pos_id: posId,
      description,
      quantity,
      id
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Get a Open Return
 */
export function getOpenRMA({
  sourceOrderId,
  posId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/get-open-RMA`,
    method: 'get',
    params: {
      source_order_id: sourceOrderId,
      pos_id: posId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * List Return Line
 */
export function listRMALines({
  posId,
  rmaId,
  sourceOrderId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material/line/list`,
    method: 'get',
    params: {
      pos_id: posId,
      rma_id: rmaId,
      source_order_id: sourceOrderId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Process Return
 */
export function processRMA({
  documentAction = 'CO',
  posId,
  id
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material/process-rma`,
    method: 'post',
    data: {
      id,
      pos_id: posId,
      document_action: documentAction
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Create Order from RMA
 * @param {number} posId
 * @param {number} sourceRmaId
 * @param {number} salesRepresentativeId
 * @returns {Order}
 */
export function newOrderFromRMA({
  posId,
  sourceRmaId,
  salesRepresentativeId
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/return-material/new-order-rma`,
    method: 'post',
    data: {
      pos_id: posId,
      source_rma_id: sourceRmaId,
      sales_representative_id: salesRepresentativeId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
