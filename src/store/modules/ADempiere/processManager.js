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

import lang from '@/lang'
import router from '@/router'

// API Request Methods
import {
  requestRunBusinessProcess,
  requestRunBusinessProcessAsBrowser,
  requestRunBusinessProcessAsWindow
} from '@/api/ADempiere/businessData/runBusinessProcess.ts'

// Constants
import { RECORD_ID } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage, showNotification } from '@/utils/ADempiere/notification'
import {
  containerManager
} from '@/utils/ADempiere/dictionary/process.js'

const initState = {
  printFormatList: {}
}

const processManager = {
  state: initState,

  mutations: {
    setPrintFormatsList(state, { containerUuid, printFormatList }) {
      Vue.set(state.printFormatList, containerUuid, printFormatList)
    },
    resetStateProcessManager(state) {
      state = initState
    }
  },

  actions: {
    processActionPerformed({ dispatch, getters }, {
      containerUuid,
      field,
      value,
      valueTo
    }) {
      return new Promise(resolve => {
        const fieldsList = getters.getStoredFieldsFromProcess(containerUuid)

        // change Dependents
        dispatch('changeDependentFieldsList', {
          field,
          fieldsList,
          containerManager
        })
      })
    },

    startProcess({ dispatch, rootGetters }, {
      containerUuid
    }) {
      return new Promise(resolve => {
        const processDefinition = rootGetters.getStoredProcess(containerUuid)
        const { fieldsList } = processDefinition

        const fieldsEmpty = rootGetters.getProcessParametersEmptyMandatory({
          containerUuid,
          fieldsList
        })
        if (!isEmptyValue(fieldsEmpty)) {
          showMessage({
            message: lang.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
          return
        }

        const parameters = rootGetters.getProcessParameters({
          containerUuid,
          fieldsList
        })

        const isSession = !isEmptyValue(getToken())
        let procesingNotification = {
          close: () => false
        }
        if (isSession) {
          procesingNotification = showNotification({
            title: lang.t('notifications.processing'),
            message: processDefinition.name,
            summary: processDefinition.description,
            type: 'info'
          })
        }

        let isProcessedError = false
        let summary = ''

        // close current page
        const currentRoute = router.app._route
        const tabViewsVisited = rootGetters.visitedViews
        dispatch('tagsView/delView', currentRoute)
        // go to back page
        const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
        router.push({
          path: oldRouter.path
        }, () => {})

        requestRunBusinessProcess({
          id: processDefinition.id,
          parameters
        })
          .then(runProcessRepsonse => {
            isProcessedError = runProcessRepsonse.isError
            summary = runProcessRepsonse.summary

            resolve(runProcessRepsonse)
          })
          .catch(error => {
            isProcessedError = true
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            dispatch('finishProcess', {
              summary,
              name: processDefinition.name,
              isError: isProcessedError
            })
              .then(() => {
                // close runing process notification
                if (!isEmptyValue(procesingNotification)) {
                  setTimeout(() => {
                    procesingNotification.close()
                  }, 1000)
                }
              })
          })
      })
    },

    /**
     * Start run process of browser
     * @param {string} parentUuid, browser calling this process
     * @param {string} containerUuid, process associated of browser
     * @returns
     */
    startProcessOfBrowser({ commit, dispatch, rootGetters }, {
      parentUuid,
      containerUuid
    }) {
      return new Promise(resolve => {
        const browserDefinition = rootGetters.getStoredBrowser(parentUuid)
        const { process: processDefinition } = browserDefinition

        const parametersList = rootGetters.getProcessParameters({
          containerUuid
        })

        const selectionsList = rootGetters.getBrowserSelectionToServer({
          containerUuid: parentUuid
        })

        const isSession = !isEmptyValue(getToken())
        let procesingNotification = {
          close: () => false
        }
        if (isSession) {
          procesingNotification = showNotification({
            title: lang.t('notifications.processing'),
            message: processDefinition.name,
            summary: processDefinition.description,
            type: 'info'
          })
        }

        let isProcessedError = false
        let summary = ''

        const recordId = rootGetters.getValueOfField({
          parentUuid,
          containerUuid,
          columnName: RECORD_ID
        })

        requestRunBusinessProcessAsBrowser({
          uuid: containerUuid,
          parametersList,
          // in browser
          id: browserDefinition.process.id,
          browserId: browserDefinition.id,
          // in window
          recordId,
          selectionsList
        })
          .then(runProcessRepsonse => {
            isProcessedError = runProcessRepsonse.isError
            summary = runProcessRepsonse.summary

            // window refresh data
            const windowsUuid = router.app._route.query.parentUuid
            if (!isEmptyValue(recordId) && !isEmptyValue(windowsUuid)) {
              const storedWindow = rootGetters.getStoredWindow(windowsUuid)
              if (!isEmptyValue(storedWindow)) {
                const { tabsList, tabsListParent, tabsListChild } = storedWindow
                // update records and logics on child tabs
                tabsList.filter(tabItem => {
                  // always laoded first tab parent
                  if (tabItem.uuid === tabsListParent.at().uuid) {
                    return true
                  }
                  // always laoded first tab child
                  if (!isEmptyValue(tabsListChild) && tabsListChild.at().uuid === tabItem.uuid) {
                    return true
                  }
                  if (tabItem.hasBeenRendered) {
                    return true
                  }
                  // reloaded tabs with records
                  return rootGetters.getIsLoadedTabRecord({
                    containerUuid: tabItem.uuid
                  })
                }).forEach(tabItem => {
                  // if loaded data refresh this data
                  dispatch('getEntities', {
                    parentUuid: windowsUuid,
                    containerUuid: tabItem.uuid
                  })
                })
              }
            }

            resolve(runProcessRepsonse)

            commit('clearBrowserData', {
              containerUuid: parentUuid
            })
            dispatch('setBrowserDefaultValues', {
              containerUuid: parentUuid
            })
          })
          .catch(error => {
            isProcessedError = true
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            dispatch('finishProcess', {
              summary,
              name: processDefinition.name,
              isError: isProcessedError
            })
              .then(() => {
                // close runing process notification
                if (!isEmptyValue(procesingNotification)) {
                  setTimeout(() => {
                    procesingNotification.close()
                  }, 1000)
                }
              })
          })
      })
    },

    startProcessOfWindows({ commit, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      recordUuid,
      parametersList = []
    }) {
      return new Promise(resolve => {
        const windowsUuid = router.app._route.meta.uuid
        const storedTab = getters.getStoredTab(windowsUuid, parentUuid)
        const processModal = getters.getModalDialogManager({
          containerUuid: containerUuid
        })
        const currentProcess = storedTab.processes.find(process => process.name === processModal.title)
        if (isEmptyValue(parametersList)) {
          const fieldsList = getters.getStoredFieldsFromProcess(containerUuid)
          parametersList = rootGetters.getProcessParameters({
            containerUuid,
            fieldsList
          })
        }

        const isSession = !isEmptyValue(getToken())
        let procesingNotification = {
          close: () => false
        }
        if (isSession) {
          procesingNotification = showNotification({
            title: lang.t('notifications.processing'),
            message: currentProcess.name,
            summary: currentProcess.description,
            type: 'info'
          })
        }

        let isProcessedError = false
        let summary = ''

        const recordId = rootGetters.getIdOfContainer({
          containerUuid,
          tableName
        })

        requestRunBusinessProcessAsWindow({
          id: currentProcess.id,
          parametersList,
          tableName,
          recordId: recordId
        })
          .then(runProcessRepsonse => {
            isProcessedError = runProcessRepsonse.isError
            summary = runProcessRepsonse.summary

            // TODO: Update record on window
            resolve(runProcessRepsonse)
          })
          .catch(error => {
            isProcessedError = true
            console.warn(`Error executing process: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            // commit('resetStateWindowManager', {
            //   containerUuid: parentUuid
            // })
            // dispatch('setTabDefaultValues', {
            //   containerUuid: parentUuid
            // })

            dispatch('finishProcess', {
              summary,
              name: currentProcess.name,
              isError: isProcessedError
            })
              .then(() => {
                // close runing process notification
                if (!isEmptyValue(procesingNotification)) {
                  setTimeout(() => {
                    procesingNotification.close()
                  }, 1000)
                }
              })
          })
      })
    },

    finishProcess({ commit }, {
      name,
      summary,
      isError
    }) {
      let processMessage = {
        name,
        title: lang.t('notifications.succesful'),
        message: lang.t('notifications.processExecuted'),
        type: 'success',
        summary
      }

      if (isError) {
        const errorMessage = !isEmptyValue(summary)
          ? summary
          : lang.t('notifications.error')

        processMessage = {
          name,
          title: lang.t('notifications.error'),
          message: errorMessage,
          type: 'error'
        }
      }

      const isSession = !isEmptyValue(getToken())
      if (isSession) {
        showNotification(processMessage)
      }
    }
  },

  getters: {
  }
}

export default processManager
