// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2023-Present E.R.P. Consultores y Asociados, C.A.
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

// API Request Methods
import {
  reverseSales
} from '@/api/ADempiere/form/VPOS'
// // Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'

const options = {
  showOptions: false
}

export default {
  state: options,
  mutations: {
    setShowOptions(state, show) {
      state.showOptions = show
    }
  },
  actions: {
    reverseSales({ dispatch, getters }, {
      description
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (isEmptyValue(currentOrder)) resolve({})
        reverseSales({
          posId: currentPos.id,
          orderId: currentOrder.id,
          description
        })
          .then(response => {
            dispatch('overloadOrder', { order: response })
            dispatch('printTicketVPOS', {
              orderId: response.id
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Delete Order: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve({})
          })
      })
    }
  },
  getters: {
    getShowOptions: (state) => {
      return state.showOptions
    }
  }
}
