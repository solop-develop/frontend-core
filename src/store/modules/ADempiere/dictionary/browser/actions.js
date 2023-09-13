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

import language from '@/lang'
import router from '@/router'
import store from '@/store'

// API Request Methods
import { requestBrowserMetadata } from '@/api/ADempiere/dictionary/smart-browser.js'

// Constants
import {
  exportRecordsSelected,
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'
import {
  containerManager,
  isDisplayedField, isMandatoryField,
  evaluateDefaultFieldShowed,
  evaluateDefaultColumnShowed,
  clearQueryCriteria,
  refreshBrowserSearh, runProcessOfBrowser,
  zoomWindow, runDeleteable
} from '@/utils/ADempiere/dictionary/browser.js'
import { showMessage, showNotification } from '@/utils/ADempiere/notification.js'
import { isLookup } from '@/utils/ADempiere/references'

export default {
  getBrowserDefinitionFromServer({ commit, dispatch, rootGetters }, {
    uuid,
    parentUuid = '' // context of associated
  }) {
    return new Promise(resolve => {
      requestBrowserMetadata({
        uuid
      })
        .then(browserResponse => {
          const browserDefinition = generatePanelAndFields({
            containerUuid: uuid,
            panelMetadata: {
              ...browserResponse,
              isShowedCriteria: true
            },
            fieldOverwrite: {
              isShowedFromUser: false
            },
            sortField: 'seqNoGrid',
            evaluateDefaultFieldShowed,
            evaluateDefaultColumnShowed
          })

          browserDefinition.elementsList = {}
          browserDefinition.columnsList = {}
          browserDefinition.fieldsList.forEach(fieldItem => {
            browserDefinition.elementsList[fieldItem.columnName] = fieldItem.elementName
            browserDefinition.columnsList[fieldItem.elementName] = fieldItem.columnName
            if (isLookup(fieldItem.displayType)) {
              browserDefinition.elementsList[DISPLAY_COLUMN_PREFIX + fieldItem.columnName] = DISPLAY_COLUMN_PREFIX + fieldItem.elementName
              browserDefinition.columnsList[DISPLAY_COLUMN_PREFIX + fieldItem.elementName] = DISPLAY_COLUMN_PREFIX + fieldItem.columnName
            }

            if (fieldItem.isRange) {
              browserDefinition.elementsList[fieldItem.columnNameTo] = fieldItem.elementNameTo
              browserDefinition.columnsList[fieldItem.elementNameTo] = fieldItem.columnNameTo
            }
          })

          commit('addBrowserToList', browserDefinition)

          dispatch('setBrowserActionsMenu', {
            parentUuid,
            containerUuid: browserDefinition.uuid
          })

          // set default values into fields
          dispatch('setBrowserDefaultValues', {
            containerUuid: browserDefinition.uuid,
            fieldsList: browserDefinition.fieldsList
          })
          // set parent context
          if (!isEmptyValue(parentUuid)) {
            const parentContext = rootGetters.getValuesView({
              parentUuid
            })
            dispatch('updateValuesOfContainer', {
              containerUuid: uuid,
              attributes: parentContext
            })

            browserDefinition.fieldsList.forEach(itemField => {
              if (!itemField.isSameColumnElement) {
                const currentValueElement = parentContext.find(itemAttribute => {
                  return itemAttribute.columnName === itemField.elementName
                })
                if (!isEmptyValue(currentValueElement) && !isEmptyValue(currentValueElement.value)) {
                  commit('updateValueOfField', {
                    containerUuid: uuid,
                    columnName: itemField.elementName,
                    value: currentValueElement.value
                  })
                  commit('updateValueOfField', {
                    containerUuid: uuid,
                    columnName: itemField.columnName,
                    value: currentValueElement.value
                  })
                }
                // change Dependents
                dispatch('changeDependentFieldsList', {
                  field: itemField,
                  containerManager
                })
              }
            })
          }

          resolve(browserDefinition)

          const { process } = browserDefinition
          if (!isEmptyValue(process)) {
            // get browser definition

            dispatch('setModalDialog', {
              containerUuid: process.uuid,
              title: process.name,
              doneMethod: () => {
                const fieldsList = rootGetters.getStoredFieldsFromProcess(process.uuid)
                const emptyMandatory = rootGetters.getFieldsListEmptyMandatory({
                  containerUuid: process.uuid,
                  fieldsList
                })
                if (!isEmptyValue(emptyMandatory)) {
                  showMessage({
                    message: language.t('notifications.mandatoryFieldMissing') + emptyMandatory,
                    type: 'info'
                  })
                  return
                }

                store.dispatch('startProcessOfBrowser', {
                  parentUuid: browserDefinition.uuid,
                  containerUuid: process.uuid
                }).then(processOutputResponse => {
                  // close current page
                  const currentRoute = router.app._route
                  const tabViewsVisited = rootGetters.visitedViews
                  dispatch('tagsView/delView', currentRoute)
                  // go to back page
                  const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
                  router.push({
                    path: oldRouter.path
                  }, () => {})
                })
              },
              beforeOpen: ({ parentUuid: browserUuid, containerUuid }) => {
                // set context values
                const parentValues = store.getters.getBrowserQueryCriteriaElement({
                  containerUuid: browserUuid
                })

                dispatch('updateValuesOfContainer', {
                  containerUuid: process.uuid,
                  attributes: parentValues
                })
              },
              loadData: ({ containerUuid }) => {
                const processDefinition = rootGetters.getStoredFieldsFromProcess(containerUuid)
                if (!isEmptyValue(processDefinition)) {
                  return Promise.resolve(processDefinition)
                }
                return dispatch('getProcessDefinitionFromServer', {
                  uuid: process.uuid
                })
              },
              ...process,
              // TODO: Change to string and import dynamic in component
              componentPath: () => import('@/components/ADempiere/PanelDefinition/index.vue'),
              isShowed: false
            })
          }
        })
        .catch(error => {
          showNotification({
            title: language.t('notifications.error'),
            message: language.t('smartBrowser.dictionaryError'),
            type: 'error'
          })
          console.warn(`Error getting Smart Browser definition: ${error.message}. Code: ${error.code}.`)

          // close current page
          const currentRoute = router.app._route
          const tabViewsVisited = rootGetters.visitedViews
          dispatch('tagsView/delView', currentRoute)
          // go to back page
          const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
          router.push({
            path: oldRouter.path
          }, () => {})
        })
    })
  },

  /**
   * Set actions menu to browser
   * @param {string} parentUuid tab or process associated
   * @param {string} containerUuid
   */
  setBrowserActionsMenu({ commit, dispatch, getters }, {
    parentUuid,
    containerUuid
  }) {
    const browserDefinition = getters.getStoredBrowser(containerUuid)

    const actionsList = []

    // process associated
    if (!isEmptyValue(browserDefinition.process)) {
      const { process } = browserDefinition
      const { uuid, name, description } = process
      const actionProcess = {
        ...runProcessOfBrowser,
        uuid,
        name,
        description
      }
      actionsList.push(actionProcess)
    }
    actionsList.push(runDeleteable)

    // export selected records
    actionsList.push(exportRecordsSelected)

    actionsList.push(clearQueryCriteria)
    // action refresh browser search
    actionsList.push(refreshBrowserSearh)

    // destruct to avoid deleting the reference to the original variable and to avoid mutating
    let actionZoomWindow = { ...zoomWindow }
    if (!isEmptyValue(browserDefinition.window)) {
      const { uuid, name, description } = browserDefinition.window
      actionZoomWindow = {
        ...actionZoomWindow,
        uuid,
        name: `${zoomWindow.name}: ${name}`,
        description
      }
    }
    // add action zoom window
    actionsList.push(actionZoomWindow)

    // action shared link
    actionsList.push(sharedLink)

    commit('setActionMenu', {
      containerUuid: browserDefinition.uuid,
      actionsList
    })
  },

  /**
   * Set default values to panel
   * @param {string}  containerUuid
   * @param {array} fieldsList
   */
  setBrowserDefaultValues({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    return new Promise(resolve => {
      const browserDefinition = getters.getStoredBrowser(containerUuid)

      if (isEmptyValue(fieldsList) && !isEmptyValue(browserDefinition)) {
        fieldsList = browserDefinition.fieldsList
      }

      const currentRoute = router.app._route
      const defaultAttributesWithColumn = getters.getParsedDefaultValues({
        containerUuid,
        isSOTrxMenu: currentRoute.meta.isSalesTransaction,
        fieldsList
      })

      // elements of colums
      const defaultAttributesWithElement = defaultAttributesWithColumn.map(attribute => {
        return {
          ...attribute,
          columnName: browserDefinition.elementsList[attribute.columnName]
        }
      })

      const defaultAttributesList = defaultAttributesWithColumn.concat(defaultAttributesWithElement)

      dispatch('updateValuesOfContainer', {
        containerUuid,
        isOverWriteParent: true,
        attributes: defaultAttributesList
      })

      resolve(defaultAttributesList)

      if (!isEmptyValue(browserDefinition.process)) {
        // clear values to process associated
        dispatch('setProcessDefaultValues', {
          containerUuid: browserDefinition.process.uuid
        })
      }
    })
  },

  /**
   * Used by components/fields/filterFields
   * @param {string} containerUuid
   * @param {array} fieldsShowed fields to displayed
   * @param {array} fieldsList all fields list in container
   */
  changeBrowserFieldShowedFromUser({ commit, dispatch, getters, rootGetters }, {
    containerUuid,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    let fieldChangedDisplayedWithValue = false

    fieldsList.forEach(itemField => {
      const { columnName } = itemField

      const isShowedFromUser = fieldsShowed.includes(columnName)
      if (itemField.isShowedFromUser === isShowedFromUser) {
        // no to mutate the state unnecessarily
        return
      }

      // not query criteria or mandatory (user display is not affected)
      if (!isDisplayedField(itemField) || isMandatoryField(itemField)) {
        return
      }

      commit('changeBrowserFieldAttribute', {
        field: itemField,
        attributeName: 'isShowedFromUser',
        attributeValue: isShowedFromUser
      })

      if (!fieldChangedDisplayedWithValue) {
        const value = rootGetters.getValueOfField({
          containerUuid,
          columnName
        })
        // if isShowedFromUser was changed with value, the SmartBrowser
        // must send the parameters to update the search result
        if (!isEmptyValue(value)) {
          fieldChangedDisplayedWithValue = itemField
        }
      }
    })

    if (fieldChangedDisplayedWithValue) {
      // dispatch('getBrowserSearch', {
      dispatch('browserActionPerformed', {
        containerUuid,
        field: fieldChangedDisplayedWithValue
      })
    }
  },

  /**
   * Used by components/fields/filterFields
   */
  changeBrowseColumnShowedFromUser({ commit, getters }, {
    containerUuid,
    groupField,
    fieldsShowed,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)
    }

    fieldsList.forEach(itemField => {
      const isShowedTableFromUser = fieldsShowed.includes(itemField.columnName)
      if (itemField.isShowedTableFromUser === isShowedTableFromUser) {
        // no to mutate the state unnecessarily
        return
      }

      commit('changeBrowserFieldAttribute', {
        field: itemField,
        attributeName: 'isShowedTableFromUser',
        attributeValue: isShowedTableFromUser
      })
    })
  }

}
