// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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

/**
 * Order Mutations
 */
export default {
  setOrder(state, order) {
    state.order = order
  },
  setListOrder(state, listOrder) {
    state.listOrder = {
      ...state.listOrder,
      ...listOrder
    }
  },
  showListOrders(state, isShow) {
    state.listOrder.isShowPopover = isShow
  },
  setIsReloadListOrders(state) {
    state.listOrder.isReload = true
  },
  currentOrder(state, currentOrder) {
    state.currentOrder = currentOrder
  },
  findOrder(state, findOrder) {
    state.findOrder = findOrder
  },
  customer(state, newCustomer) {
    state.newCustomer = newCustomer
  }
}
