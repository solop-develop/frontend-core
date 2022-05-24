// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

import router from '@/router'
import store from '@/store'

// api request methods
import { requestWindowMetadata } from '@/api/ADempiere/dictionary/window.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import {
  generateWindow,
  createNewRecord,
  deleteRecord,
  runProcessOfWindow,
  generateReportOfWindow,
  openBrowserAssociated,
  refreshRecords
} from '@/utils/ADempiere/dictionary/window.js'
import {
  sharedLink,
  recordAccess
} from '@/utils/ADempiere/constants/actionsMenuList.js'
import evaluator, { getContext } from '@/utils/ADempiere/contextUtils.js'

export default {
  addWindow({ commit, dispatch }, windowResponse) {
    return new Promise(resolve => {
      commit('addWindowToList', windowResponse)

      windowResponse.tabsList.forEach(tab => {
        dispatch('setTabActionsMenu', {
          parentUuid: windowResponse.uuid,
          containerUuid: tab.uuid
        })
      })

      resolve(windowResponse)
    })
  },

  getWindowDefinitionFromServer({ dispatch }, {
    uuid
  }) {
    return new Promise(resolve => {
      requestWindowMetadata({
        uuid
      })
        .then(async windowResponse => {
          const window = generateWindow(windowResponse)
          dispatch('addWindow', window)

          resolve(window)
        })
    })
  },

  setTabActionsMenu({ commit, dispatch, getters }, {
    parentUuid,
    containerUuid
  }) {
    const tabDefinition = getters.getStoredTab(parentUuid, containerUuid)

    const actionsList = []

    actionsList.push(createNewRecord)

    if (!isEmptyValue(tabDefinition.processes)) {
      tabDefinition.processes.forEach(process => {
        let defaultAction = {}
        if (process.isReport) {
          defaultAction = {
            ...generateReportOfWindow
          }
          dispatch('setModalDialog', {
            containerUuid: process.uuid,
            title: process.name,
            doneMethod: () => {
              dispatch('startReport', {
                parentUuid: containerUuid,
                containerUuid: process.uuid
              })
            },
            loadData: () => {
              dispatch('getProcessDefinitionFromServer', {
                uuid: process.uuid
              })
              return dispatch('getReportDefinitionFromServer', {
                uuid: process.uuid
              })
            },
            // TODO: Change to string and import dynamic in component
            componentPath: () => import('@theme/components/ADempiere/PanelDefinition/index.vue'),
            isShowed: false
          })
        } else if (!isEmptyValue(process.browserUuid)) {
          defaultAction = {
            ...openBrowserAssociated
          }
        } else {
          defaultAction = {
            ...runProcessOfWindow
          }
          dispatch('setModalDialog', {
            containerUuid: process.uuid,
            title: process.name,
            doneMethod: () => {
              dispatch('startProcessOfWindows', {
                parentUuid: containerUuid,
                containerUuid: process.uuid
              })
            },
            loadData: () => {
              return dispatch('getProcessDefinitionFromServer', {
                uuid: process.uuid
              })
            },
            // TODO: Change to string and import dynamic in component
            componentPath: () => import('@theme/components/ADempiere/PanelDefinition/index.vue'),
            isShowed: false
          })
        }

        // TODO: Improve performance, evaluate whether it is possible to directly
        // add the field display logic in the process associated with the field.
        const fieldAssociated = store.getters.getStoredFieldFromProcess({
          windowUuid: parentUuid,
          tabUuid: containerUuid,
          processUuid: process.uuid
        })

        let displayed = ({ containerUuid, parentUuid }) => {
          return true
        }
        if (fieldAssociated && !isEmptyValue(fieldAssociated.displayLogic)) {
          displayed = ({ parentUuid, containerUuid }) => {
            // evaluate display logic of field with process associated to hidden/showed
            const isDisplayedFromLogic = evaluator.evaluateLogic({
              parentUuid,
              containerUuid,
              context: getContext,
              logic: fieldAssociated.displayLogic
            })
            return isDisplayedFromLogic
          }
        }

        actionsList.push({
          ...defaultAction,
          ...process,
          containerUuid: process.uuid,
          displayed
        })
      })
    }

    actionsList.push(deleteRecord)
    actionsList.push(refreshRecords)
    actionsList.push(recordAccess)
    actionsList.push(sharedLink)

    commit('setActionMenu', {
      containerUuid: tabDefinition.uuid,
      actionsList
    })
  },

  /**
   * Used by components/fields/filterFields
   */
  changeTabFieldShowedFromUser({ commit, getters }, {
    parentUuid,
    containerUuid,
    groupField,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromTab(parentUuid, containerUuid)
    }

    fieldsList.forEach(itemField => {
      if (groupField === itemField.groupAssigned) {
        let isShowedFromUser = false
        if (fieldsShowed.includes(itemField.columnName)) {
          isShowedFromUser = true
        }

        commit('changeTabFieldAttribute', {
          field: itemField,
          attributeName: 'isShowedFromUser',
          attributeValue: isShowedFromUser
        })
      }
    })
  },

  changeTabAttribute({ commit, getters }, {
    parentUuid,
    containerUuid,
    attributeName,
    attributeNameControl,
    attributeValue
  }) {
    const tab = getters.getStoredTab(parentUuid, containerUuid)

    commit('changeTabAttribute', {
      tab,
      attributeName,
      attributeValue,
      attributeNameControl
    })

    if (tab.isParentTab) {
      // set value into current parent tab
      const currentTab = getters.getCurrentTab(parentUuid)
      if (currentTab.uuid === containerUuid) {
        commit('changeWindowAttribute', {
          uuid: parentUuid,
          attributeName: 'currentTab',
          attributeValue: tab
        })
      }
    } else {
      // set value into current child tab
      const currentTabChild = getters.getCurrentTabChild(parentUuid)
      if (currentTabChild.uuid === containerUuid) {
        commit('changeWindowAttribute', {
          uuid: parentUuid,
          attributeName: 'currentTabChild',
          attributeValue: tab
        })
      }
    }
  },

  /**
   * Set default values to panel
   * @param {string}  parentUuid
   * @param {string}  containerUuid
   * TODO: Evaluate if it is necessary to parse the default values
   */
  setTabDefaultValues({ commit, dispatch, rootGetters }, {
    parentUuid,
    containerUuid,
    isOverWriteParent = true
  }) {
    return new Promise(resolve => {
      const tab = rootGetters.getStoredTab(parentUuid, containerUuid)

      const currentRoute = router.app._route
      delete currentRoute.query.filters

      const query = currentRoute.query
      if (tab.isParentTab) {
        query.action = 'create-new'
      }
      // set action
      router.push({
        name: currentRoute.name,
        params: {
          ...currentRoute.params
        },
        query
      }, () => {})

      let defaultAttributes = rootGetters.getParsedDefaultValues({
        parentUuid,
        containerUuid,
        isSOTrxMenu: currentRoute.meta.isSalesTransaction,
        fieldsList: tab.fieldsList
      })

      // set vales with permant link
      if (!rootGetters['permantLink/isReadFilters'] &&
        containerUuid === rootGetters['permantLink/getLinkContainerUuid']) {
        const parsedFilters = rootGetters['permantLink/getParsedFilters']
        if (!isEmptyValue(parsedFilters)) {
          // merge values
          defaultAttributes = defaultAttributes.map(attribute => {
            const filterValue = parsedFilters[attribute.columnName]
            return {
              ...attribute,
              value: filterValue
            }
          })
        }

        commit('permantLink/setIsReadFilters', null, {
          root: true
        })
      }

      defaultAttributes.forEach(attribute => {
        commit('addChangeToPersistenceQueue', {
          ...attribute,
          containerUuid
        }, {
          root: true
        })

        if (!attribute.columnName.includes('DisplayColumn')) {
          const field = rootGetters.getStoredFieldFromTab({
            windowUuid: parentUuid,
            tabUuid: containerUuid,
            columnName: attribute.columnName
          })
          // activate logics
          dispatch('changeDependentFieldsList', {
            field,
            fieldsList: tab.fieldsList
          })
        }
      })

      dispatch('updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        isOverWriteParent,
        attributes: defaultAttributes
      }, {
        root: true
      })

      resolve(defaultAttributes)
    })
  }

}
