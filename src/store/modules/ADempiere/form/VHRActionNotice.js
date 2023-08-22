/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
  listPayrollProcess,
  listEmployeeValid,
  listPayrollConcepts,
  listPayrollMovements,
  savePayrollMovement,
  deletePayrollMovement,
  conceptDefinition
} from '@/api/ADempiere/form/payrollActionNotice.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// function
function convertValuesToSend(values) {
  const valuesToSend = {}
  Object.keys(values).forEach(key => {
    const value = values[key]
    if (isEmptyValue(value) || isEmptyValue(value.key) || isEmptyValue(value.value)) {
      return
    }
    valuesToSend[value.key] = value.value
  })

  return valuesToSend
}

const payrollActionNotice = {
  payrollProcess: {
    listOptions: [],
    value: null
  },
  employee: {
    listOptions: [],
    value: null
  },
  payrollConcept: {
    listOptions: [],
    value: null
  },
  listConcepts: [],
  conceptDefinitio: {
    ColumnType: ''
  }
}

export default {
  state: payrollActionNotice,
  mutations: {
    setPayrollProcess(state, { listOptions, value }) {
      state.payrollProcess = { listOptions, value }
    },
    setEmployee(state, { listOptions, value }) {
      state.employee = { listOptions, value }
    },
    setPayrollConcept(state, { listOptions, value }) {
      state.payrollConcept = { listOptions, value }
    },
    setListConcepts(state, list) {
      state.listConcepts = list
    },
    setConceptDefinition(state, attributes) {
      state.conceptDefinitio = attributes
    }
  },
  actions: {
    findPayrollProcess({ commit, state, dispatch }) {
      listPayrollProcess()
        .then(response => {
          const { records } = response
          commit('setPayrollProcess', {
            listOptions: records.map(value => value.values),
            value: state.payrollProcess.value
          })
          dispatch('findListConcepts')
        })
        .catch(error => {
          console.warn(`Error getting listPayrollProcess: ${error.message}. Code: ${error.code}.`)
        })
    },

    findEmployee({ commit, dispatch, state }) {
      listEmployeeValid({
        contextAttributes: [
          {
            key: 'HR_Process_ID',
            value: state.payrollProcess.value
          }
        ]
      })
        .then(response => {
          const { records } = response
          commit('setEmployee', {
            listOptions: records.map(value => value.values),
            value: state.employee.value
          })
          dispatch('findListConcepts')
          dispatch('findPayrollConcepts')
        })
        .catch(error => {
          console.warn(`Error getting listEmployee: ${error.message}. Code: ${error.code}.`)
        })
    },

    findPayrollConcepts({ commit, dispatch, state }) {
      listPayrollConcepts({
        contextAttributes: [
          {
            key: 'HR_Process_ID',
            value: state.payrollProcess.value
          },
          {
            key: 'C_BPartner_ID',
            value: state.employee.value
          }
        ]
      })
        .then(response => {
          const { records } = response
          commit('setPayrollConcept', {
            listOptions: records.map(value => value.values),
            value: state.payrollConcept.value
          })
          dispatch('findListConcepts')
        })
        .catch(error => {
          console.warn(`Error getting listPayrollConcepts: ${error.message}. Code: ${error.code}.`)
        })
    },

    findListConcepts({ commit, state }) {
      if (isEmptyValue(state.payrollProcess.value) || isEmptyValue(state.employee.value)) {
        return
      }
      listPayrollMovements({
        contextAttributes: [
          {
            key: 'HR_Process_ID',
            value: state.payrollProcess.value
          },
          {
            key: 'C_BPartner_ID',
            value: state.employee.value
          },
          {
            key: 'HR_Concept_ID',
            value: state.payrollConcept.value
          }
        ]
      })
        .then(response => {
          const { records } = response
          commit('setListConcepts', records.map(value => {
            return {
              ...convertValuesToSend(value.attributes),
              attributes: value.attributes,
              id: value.id,
              uuid: value.uuid
            }
          }))
        })
        .catch(error => {
          console.warn(`Error getting listPayrollMovements: ${error.message}. Code: ${error.code}.`)
        })
    },

    saveMovement({ state, dispatch }, {
      id = -1,
      uuid,
      attributes
    }) {
      savePayrollMovement({
        contextAttributes: [
          {
            key: 'HR_Process_ID',
            value: state.payrollProcess.value
          },
          {
            key: 'C_BPartner_ID',
            value: state.employee.value
          },
          {
            key: 'HR_Concept_ID',
            value: state.payrollConcept.value
          },
          {
            key: 'HR_Movement_ID',
            value: id
          }
        ],
        id,
        uuid,
        attributes
      })
        .then(response => {
          dispatch('findListConcepts')
        })
        .catch(error => {
          console.warn(`Error getting saveMovement: ${error.message}. Code: ${error.code}.`)
        })
    },

    deleteConcepts({ dispatch }, {
      ids,
      uuids
    }) {
      deletePayrollMovement({
        ids,
        uuids
      })
        .then(response => {
          dispatch('findListConcepts')
        })
        .catch(error => {
          console.warn(`Error deleteConcepts: ${error.message}. Code: ${error.code}.`)
        })
    },

    conceptDefinition({ commit }, {
      id
    }) {
      conceptDefinition({
        id
      })
        .then(response => {
          const { attributes } = response
          const row = {
            ...convertValuesToSend(attributes),
            referenceUuid: attributes[1].value
          }
          commit('setConceptDefinition', row)
        })
        .catch(error => {
          console.warn(`Error conceptDefinition: ${error.message}. Code: ${error.code}.`)
        })
    }

  },

  // listPayrollConcepts
  getters: {
    /**
     * List Options Payroll News
     */
    getListOptionsPayrollProcess: (state) => {
      return state.payrollProcess.listOptions
    },
    getListOptionsEmployee: (state) => {
      return state.employee.listOptions
    },
    getListOptionsPayrollConcept: (state) => {
      return state.payrollConcept.listOptions
    },

    /**
     * value Payroll News
     */

    getValuePayrollProcess: (state) => {
      return state.payrollProcess.value
    },
    getValueEmployee: (state) => {
      return state.employee.value
    },
    getValuePayrollConcept: (state) => {
      return state.payrollConcept.value
    },
    /**
     * Data List
     */
    getDataListConcept: (state) => {
      return state.listConcepts
    },

    getConceptDefinitio: (state) => {
      return state.conceptDefinitio
    }
  }
}
