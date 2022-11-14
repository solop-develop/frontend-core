import language from '@/lang'
import { isEmptyValue } from '@/utils/ADempiere'
import Vue from 'vue'

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
      if (isEmptyValue(state.oprionsViwer[containerUuid])) return language.t('table.dataTable.showMinimalistView')
      return state.oprionsViwer[containerUuid].tableOption
    }
  }
}
