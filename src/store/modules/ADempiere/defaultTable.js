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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

import language from '@/lang'

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere'

const defaultTable = {
  oprionsViwer: {}
}

export default {
  state: defaultTable,

  mutations: {
    setTableOption(state, {
      parentUuid,
      containerUuid,
      tableOption = language.t('table.dataTable.showMinimalistView')
    }) {
      const defaultTableOptions = {
        parentUuid,
        containerUuid,
        tableOption
      }
      Vue.set(state.oprionsViwer, containerUuid, defaultTableOptions)
    }
  },

  actions: {
    selectOption({ commit, state }, {
      parentUuid,
      containerUuid,
      tableOption
    }) {
      commit('setTableOption', {
        parentUuid,
        containerUuid,
        tableOption
      })
    }
  },

  getters: {
    getTableOption: (state) => (containerUuid) => {
      if (isEmptyValue(state.oprionsViwer[containerUuid])) {
        return language.t('table.dataTable.showMinimalistView')
      }
      return state.oprionsViwer[containerUuid].tableOption
    }
  }
}
