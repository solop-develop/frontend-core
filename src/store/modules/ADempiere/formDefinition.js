/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

import Vue from 'vue'

import router from '@/router'
import language from '@/lang'

// Constants
import { CONTAINER_FORM_PREFIX } from '@/utils/ADempiere/dictionary/form/index.js'

// API Request Methods
import { requestForm } from '@/api/ADempiere/dictionary/index.ts'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const form = {
  state: {
    isShowedTitleForm: false,
    storedForms: {}
  },
  mutations: {
    addForm(state, formDefinition) {
      // state.form.push(payload)
      Vue.set(state.storedForms, formDefinition.uuid, formDefinition)
    },
    dictionaryResetCacheForm(state) {
      state.form = {}
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
      if (!getters.getStoredForm(metadataForm.uuid)) {
        commit('addForm', metadataForm)
      }
    },
    getFormFromServer({ commit, dispatch }, {
      id,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestForm({
          id
        })
          .then(formResponse => {
            // Panel for save on store
            const newForm = {
              ...formResponse,
              containerUuid: formResponse.uuid,
              containerKey: CONTAINER_FORM_PREFIX + formResponse.id
            }

            commit('addForm', newForm)

            resolve(newForm)
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
        form = getters.getStoredForm(containerUuid)
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
    getStoredForm: (state) => (formUuid) => {
      return state.storedForms[formUuid]
    },
    getIsShowTitleForm: (state) => {
      return state.isShowedTitleForm
    }
  }
}

export default form
