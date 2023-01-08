/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

import router from '@/router'
import language from '@/lang'

// API Request Methods
import { requestForm } from '@/api/ADempiere/dictionary/form'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const form = {
  state: {
    isShowedTitleForm: false,
    form: []
  },
  mutations: {
    addForm(state, payload) {
      state.form.push(payload)
    },
    dictionaryResetCacheForm(state) {
      state.form = []
    },
    changeFormAttribute(state, payload) {
      let value = payload.attributeValue
      if (payload.attributeNameControl) {
        value = payload.form[payload.attributeNameControl]
      }
      if (isEmptyValue(payload.attributeName)) {
        payload.form[payload.attributeName] = value
      }
    },
    changeShowTitleForm(state, isShowed) {
      state.isShowedTitleForm = isShowed
    }
  },
  actions: {
    addForm({ commit, getters }, metadataForm) {
      if (!getters.getForm(metadataForm.uuid)) {
        commit('addForm', metadataForm)
      }
    },
    getFormFromServer({ commit, dispatch }, {
      id,
      containerUuid,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestForm({
          uuid: containerUuid,
          id
        })
          .then(formResponse => {
            const panelType = 'form'

            // Panel for save on store
            const newForm = {
              ...formResponse,
              containerUuid,
              fieldsList: [],
              panelType
            }

            commit('addForm', newForm)
            // dispatch('addPanel', newForm)

            resolve(newForm)

            // Convert from gRPC process list
            const actions = []

            // Add process menu
            dispatch('setContextMenu', {
              containerUuid,
              actions
            })
          })
          .catch(error => {
            router.push({
              path: '/dashboard'
            }, () => {})
            dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('page.login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary form - Error ${error.code}: ${error.message}.`)
          })
      })
    },
    changeFormAttribute({ commit, getters }, {
      containerUuid,
      form,
      attributeName,
      attributeNameControl,
      attributeValue
    }) {
      if (isEmptyValue(form)) {
        form = getters.getForm(containerUuid)
      }
      commit('changeFormAttribute', {
        form,
        attributeName,
        attributeValue,
        attributeNameControl
      })
    }
  },
  getters: {
    getForm: (state) => (formUuid) => {
      return state.form.find(
        item => item.uuid === formUuid
      )
    },
    getIsShowTitleForm: (state) => {
      return state.isShowedTitleForm
    }
  }
}

export default form
