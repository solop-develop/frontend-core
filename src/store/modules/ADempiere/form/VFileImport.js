/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// API Request Methods
import {
  getImportFormats
} from '@/api/ADempiere/form/VFileImport.js'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'

const VFileImport = {
  attribute: {
    charsets: '',
    importFormats: ''
  },
  options: {
    listCharsets: [],
    listImportFormats: []
  }
}

export default {
  state: VFileImport,
  mutations: {
    /**
     * Update Attribute
     * Generic mutation that allows to change the state of the store
     * @param {string} attribute - Attribute and which one to update - Requires it to be an Object
     * @param {string} criteria - Object Criteria
     * @param {string} value - Value to Update
     */
    updateAttributeVFileImport(state, {
      attribute,
      criteria,
      value
    }) {
      state[attribute][criteria] = value
    }
  },
  actions: {
    importFormats({ commit }, {
      id
    }) {
      return new Promise(resolve => {
        getImportFormats({
          id
        })
          .then(response => {
            console.log({ response })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Error getting Import Formats: ${error.message}. Code: ${error.code}.`)
            resolve([])
          })
      })
    }
  },
  getters: {
    getAttribute(state) {
      return state.attribute
    },
    getOptions(state) {
      return state.options
    }
  }
}
