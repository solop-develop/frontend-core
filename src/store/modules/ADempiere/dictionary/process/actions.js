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

import router from '@/router'

// API Request Methods
import { requestProcessMetadata } from '@/api/ADempiere/dictionary/process.js'

// Constants
import {
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList.js'

// Utils and Helper Methods
import {
  containerManager, generateProcess, clearParameters, runProcess, isDisplayedField
} from '@/utils/ADempiere/dictionary/process.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  addProcessToList({ commit, dispatch }, processResponse) {
    return new Promise(resolve => {
      commit('addProcessToList', processResponse)

      dispatch('setProcessDefaultValues', {
        containerUuid: processResponse.uuid,
        fieldsList: processResponse.fieldsList
      })

      dispatch('seProcessActionsMenu', {
        containerUuid: processResponse.uuid
      })

      resolve(processResponse)
    })
  },

  /**
   * Get process dictionary definition
   * @param {string} uuid of dictionary
   */
  getProcessDefinitionFromServer({ dispatch }, {
    uuid
  }) {
    return new Promise((resolve, reject) => {
      requestProcessMetadata({
        uuid
      })
        .then(processResponse => {
          const { processDefinition } = generateProcess({
            processToGenerate: processResponse
          })

          dispatch('addProcessToList', processDefinition)
          resolve(processDefinition)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * Set actions menu to process
   * @param {string} containerUuid
   */
  seProcessActionsMenu({ commit, getters }, {
    containerUuid
  }) {
    const processDefinition = getters.getStoredProcess(containerUuid)

    const actionsList = []

    // execute process action
    const actionExecute = {
      ...runProcess,
      description: processDefinition.description
    }
    actionsList.push(actionExecute)
    actionsList.push(clearParameters)

    // action shared link
    actionsList.push(sharedLink)

    commit('setActionMenu', {
      containerUuid,
      actionsList
    })
  },

  /**
   * Used by components/fields/filterFields
   */
  changeProcessFieldShowedFromUser({ commit, getters }, {
    containerUuid,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromProcess(containerUuid)
    }

    fieldsList.forEach(itemField => {
      const { columnName } = itemField

      const isShowedFromUser = fieldsShowed.includes(columnName)
      if (itemField.isShowedFromUser === isShowedFromUser) {
        // no to mutate the state unnecessarily
        return
      }

      if (!isDisplayedField(itemField)) {
        // is hidden by logic not change showed from user
        return
      }

      commit('changeProcessFieldAttribute', {
        field: itemField,
        attributeName: 'isShowedFromUser',
        attributeValue: isShowedFromUser
      })
    })
  },

  /**
   * Set default values to panel
   * @param {string}  containerUuid
   * @param {array}  fieldsList
   */
  setProcessDefaultValues({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    return new Promise(resolve => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = getters.getStoredFieldsFromProcess(containerUuid)
      }

      const currentRoute = router.app._route
      const defaultAttributes = getters.getParsedDefaultValues({
        containerUuid,
        isSOTrxMenu: currentRoute.meta.isSalesTransaction,
        fieldsList
      })

      dispatch('updateValuesOfContainer', {
        containerUuid,
        isOverWriteParent: true,
        attributes: defaultAttributes
      })
      if (isEmptyValue(fieldsList)) {
        resolve(defaultAttributes)
        return
      }

      fieldsList.forEach(field => {
        // activate logics
        dispatch('changeDependentFieldsList', {
          field,
          fieldsList,
          containerManager
        })
      })

      resolve(defaultAttributes)
    })
  }

}
