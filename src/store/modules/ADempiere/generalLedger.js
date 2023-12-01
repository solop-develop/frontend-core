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

// Api
import { listAccoutingElements } from '@/api/ADempiere/generalLedger'

// utils and helpers methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'
// CONST
const accoutingElement = {
  fileList: []
}

export default {
  state: accoutingElement,
  mutations: {
    setFieldsListAccount(state, fieldsListAccount) {
      state.fileList = fieldsListAccount
    }
  },
  actions: {
    listAccoutingElementsRequest({ commit, getters }) {
      return new Promise(resolve => {
        const {
          is_allow_info_account
        } = getters['user/getRole']
        const sessionContext = getters.getAllSessionContext
        if (!is_allow_info_account || isEmptyValue(sessionContext)) return resolve()
        if (isEmptyValue(sessionContext['$C_AcctSchema_ID'])) return resolve()
        listAccoutingElements({
          accoutingSchemaId: sessionContext['$C_AcctSchema_ID']
        })
          .then(response => {
            const { accouting_elements } = response
            if (!isEmptyValue(accouting_elements)) {
              const fieldsListAccount = accouting_elements.map(list => {
                return {
                  ...camelizeObjectKeys(list),
                  value: ''
                }
              })
              commit('setFieldsListAccount', fieldsListAccount)
            }
            resolve(accouting_elements)
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
