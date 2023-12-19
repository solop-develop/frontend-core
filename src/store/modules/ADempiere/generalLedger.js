/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/ElsioSanchez
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

// API Request Methods
import { requestListAccoutingElements } from '@/api/ADempiere/generalLedger'

// Utils and Helpers Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

const initStateGeneralLedger = {
  fileList: []
}

export default {
  state: initStateGeneralLedger,

  mutations: {
    setFieldsListAccount(state, fieldsListAccount) {
      state.fileList = fieldsListAccount
    }
  },

  actions: {
    listAccoutingElementsFromServer({ commit, getters }) {
      return new Promise(resolve => {
        const sessionContext = getters.getAllSessionContext
        if (!isEmptyValue(sessionContext)) {
          return resolve()
        }
        const isShowAcct = sessionContext['#ShowAcct']
        if (!isShowAcct) {
          return resolve()
        }
        const accoutingSchemaId = sessionContext['$C_AcctSchema_ID']
        if (isEmptyValue(accoutingSchemaId)) {
          return resolve()
        }
        requestListAccoutingElements({
          accoutingSchemaId: accoutingSchemaId
        })
          .then(response => {
            const { accouting_elements } = response
            let fieldsListAccount = []
            if (!isEmptyValue(accouting_elements)) {
              fieldsListAccount = accouting_elements.map(list => {
                return {
                  ...camelizeObjectKeys(list),
                  value: ''
                }
              })
            }

            commit('setFieldsListAccount', fieldsListAccount)
            resolve(fieldsListAccount)
          })
          .catch(error => {
            console.warn(`List Accouting Elements: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
          })
          .finally(() => {
            resolve()
          })
      })
    }
  },

  getters: {
    getFieldsListAccount: (state) => {
      return state.fileList
    }
  }
}
