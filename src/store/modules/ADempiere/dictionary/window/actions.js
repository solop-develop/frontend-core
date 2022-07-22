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

import language from '@/lang'
import router from '@/router'
import store from '@/store'

// api request methods
import { requestWindowMetadata } from '@/api/ADempiere/dictionary/window.js'

// constants
import { containerManager } from '@/utils/ADempiere/dictionary/window'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import {
  generateWindow,
  createNewRecord,
  deleteRecord,
  runProcessOfWindow,
  generateReportOfWindow,
  openBrowserAssociated,
  refreshRecords,
  undoChange
} from '@/utils/ADempiere/dictionary/window.js'
import {
  sharedLink,
  recordAccess
} from '@/utils/ADempiere/constants/actionsMenuList.js'
import evaluator from '@/utils/ADempiere/evaluator'
import { getContext, getContextAttributes } from '@/utils/ADempiere/contextUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { containerManager as containerManagerReport } from '@/utils/ADempiere/dictionary/report'

export default {
  addWindow({ commit, dispatch }, windowResponse) {
    return new Promise(resolve => {
      commit('addWindowToList', windowResponse)

      windowResponse.tabsList.forEach(tab => {
        dispatch('setTabActionsMenu', {
          parentUuid: windowResponse.uuid,
          containerUuid: tab.uuid
        })

        // dispatch('setTabDefaultValues', {
        //   parentUuid: windowResponse.uuid,
        //   containerUuid: tab.uuid
        // })
      })

      resolve(windowResponse)
    })
  },

  getWindowDefinitionFromServer({ dispatch, rootGetters }, {
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
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message
          })

          // close current page
          const currentRoute = router.app._route
          const tabViewsVisited = rootGetters.visitedViews
          dispatch('tagsView/delView', currentRoute)
          // go to back page
          const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
          if (!isEmptyValue(oldRouter)) {
            router.push({
              path: oldRouter.path
            }, () => {})
          }
        })
    })
  },

  setTabActionsMenu({ commit, dispatch, getters, rootGetters }, {
    parentUuid,
    containerUuid
  }) {
    const tabDefinition = getters.getStoredTab(parentUuid, containerUuid)

    const actionsList = []

    actionsList.push(createNewRecord)
    actionsList.push(undoChange)

    if (!isEmptyValue(tabDefinition.processes)) {
      let relatedColumns = []
      const parentColumns = tabDefinition.fieldsList
        .filter(fieldItem => {
          return fieldItem.isParent || fieldItem.isKey || fieldItem.isMandatory
        })
        .map(fieldItem => {
          return fieldItem.columnName
        })

      if (!isEmptyValue(tabDefinition.parentColumn)) {
        relatedColumns = relatedColumns.push(tabDefinition.parentColumn)
      }
      relatedColumns = relatedColumns.concat(parentColumns)

      tabDefinition.processes.forEach(process => {
        let defaultAction = {}
        if (process.isReport) {
          defaultAction = {
            ...generateReportOfWindow
          }

          dispatch('setModalDialog', {
            containerUuid: process.uuid,
            title: process.name,
            containerManager: containerManagerReport,
            doneMethod: () => {
              const fieldsList = rootGetters.getReportParameters({
                containerUuid: process.uuid
              })
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

              const recordUuid = rootGetters.getUuidOfContainer(containerUuid)
              const { tableName } = tabDefinition

              dispatch('startReport', {
                parentUuid: containerUuid,
                containerUuid: process.uuid,
                recordUuid,
                tableName
              })
            },
            beforeOpen: () => {
              // set context values
              const parentValues = getContextAttributes({
                parentUuid,
                containerUuid,
                contextColumnNames: relatedColumns
              })

              dispatch('updateValuesOfContainer', {
                containerUuid: process.uuid,
                attributes: parentValues
              })
            },
            loadData: () => {
              const reportDefinition = rootGetters.getStoredReport(process.uuid)
              if (!isEmptyValue(reportDefinition)) {
                return Promise.resolve(reportDefinition)
              }

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
              // TODO: Get container uuid with multiple tabs and same process
              const recordUuid = rootGetters.getUuidOfContainer(containerUuid)
              const { tableName } = tabDefinition

              dispatch('startProcessOfWindows', {
                parentUuid: containerUuid,
                containerUuid: process.uuid,
                tableName,
                recordUuid
              }).then(async processResponse => {
                if (processResponse.isError) {
                  return
                }

                // update records
                await dispatch('getEntities', {
                  parentUuid,
                  containerUuid
                })
                // update records and logics on child tabs
                tabDefinition.childTabs.filter(tabItem => {
                  // get loaded tabs with records
                  return store.getters.getIsLoadedTabRecord({
                    containerUuid: tabItem.uuid
                  })
                }).forEach(tabItem => {
                  // if loaded data refresh this data
                  // TODO: Verify with get one entity, not get all list
                  store.dispatch('getEntities', {
                    parentUuid,
                    containerUuid: tabItem.uuid,
                    pageNumber: 1 // reload with first page
                  })
                })
              })
            },
            beforeOpen: () => {
              // set context values
              const parentValues = getContextAttributes({
                parentUuid,
                containerUuid,
                contextColumnNames: relatedColumns
              })

              dispatch('updateValuesOfContainer', {
                containerUuid: process.uuid,
                attributes: parentValues
              })
            },
            loadData: () => {
              const reportDefinition = rootGetters.getStoredProcess(process.uuid)
              if (!isEmptyValue(reportDefinition)) {
                return Promise.resolve(reportDefinition)
              }

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
  setTabDefaultValues({ commit, dispatch, getters, rootGetters }, {
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

      let defaultAttributes = rootGetters.getTabParsedDefaultValue({
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

      const recordUuid = store.getters.getUuidOfContainer(containerUuid)
      // set old record
      if (!isEmptyValue(recordUuid)) {
        store.commit('setRecordUuidOnPanel', {
          containerUuid,
          recordUuid
        })
      }

      // update fields values
      dispatch('updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        isOverWriteParent,
        attributes: defaultAttributes
      }, {
        root: true
      })

      // clear old values
      dispatch('clearPersistenceQueue', {
        containerUuid,
        recordUuid
      }, {
        root: true
      })

      defaultAttributes.forEach(attribute => {
        if (!isEmptyValue(attribute.value)) {
          commit('addChangeToPersistenceQueue', {
            ...attribute,
            containerUuid
          }, {
            root: true
          })
        }

        if (!attribute.columnName.startsWith(DISPLAY_COLUMN_PREFIX)) {
          const field = rootGetters.getStoredFieldFromTab({
            windowUuid: parentUuid,
            tabUuid: containerUuid,
            columnName: attribute.columnName
          })
          // activate logics
          dispatch('changeDependentFieldsList', {
            field,
            fieldsList: tab.fieldsList,
            containerManager
          })
        }
      })

      // return values
      resolve(defaultAttributes)

      // update records and logics on child tabs
      tab.childTabs
        .filter(tabItem => {
          // get loaded tabs with records
          return getters.getIsLoadedTabRecord({
            containerUuid: tabItem.uuid
          }) || getters.getIsLoadedTabOldRecord({
            containerUuid: tabItem.uuid
          })
        })
        .forEach(tabItem => {
          // if loaded data refresh this data
          dispatch('setTabDefaultValues', {
            parentUuid,
            containerUuid: tabItem.uuid
          })
          commit('setNewTabData', {
            parentUuid,
            containerUuid: tabItem.uuid
          })
        })
    })
  }

}
