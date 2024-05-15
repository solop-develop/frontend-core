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

// Const
import { config } from '@/utils/ADempiere/config'
// Utils and Helper Methods
import { getPaymentValues } from '@/utils/ADempiere/dictionary/form/VPOS'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { request } from '@/utils/ADempiere/request'
const onlinePayments = {
  field: {
    value: '',
    cardType: '',
    reference: '',
    accountType: '',
    type: 1
  }
}

export default {
  state: onlinePayments,
  mutations: {
    setAttributeFieldOnlinePayments(state, {
      attribute,
      value
    }) {
      state.field[attribute] = value
    }
  },
  actions: {
    /**
     * Transactional sale
     */
    transactionalSale({
      commit,
      dispatch
    }, params) {
      return new Promise(resolve => {
        return request({
          url: `${config.onlinePayments.url}/${config.onlinePayments.payment.endpoint}`,
          method: 'post',
          data: {
            values: params
          }
        })
          .then((response) => {
            commit('setShowedModalDialogVPOS', {
              isShowed: false
            })
            dispatch('addPayment', getPaymentValues({}))
            resolve(response)
          })
          .catch(error => {
            console.warn(`Add Payment Transactional sale: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }
            commit('setShowedModalDialogVPOS', {
              isShowed: false
            })

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
    getAttributeFieldOnlinePayments: (state) => ({ field, attribute }) => {
      if (isEmptyValue(field) || isEmptyValue(attribute)) return ''
      return state[field][attribute]
    },
    getAllAttributeOnlinePayments(state) {
      return state.field
    }
  }
}
