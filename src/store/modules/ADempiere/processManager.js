// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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

import Vue from 'vue'
import router from '@/router'
import language from '@/lang'

// api request methods
import {
  requestRunProcess
} from '@/api/ADempiere/process'

// utils and helper methods
import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage, showNotification } from '@/utils/ADempiere/notification'

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
            message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
          return
        }

        const parametersList = rootGetters.getProcessParameters({
          containerUuid,
          fieldsList
        })

        const isSession = !isEmptyValue(getToken())
        let procesingNotification = {
          close: () => false
        }
        if (isSession) {
          procesingNotification = showNotification({
            title: language.t('notifications.processing'),
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

        requestRunProcess({
          uuid: containerUuid,
          parametersList
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
            title: language.t('notifications.processing'),
            message: processDefinition.name,
            summary: processDefinition.description,
            type: 'info'
          })
        }

        let isProcessedError = false
        let summary = ''
        /*
        // close current page
        const currentRoute = router.app._route
        const tabViewsVisited = rootGetters.visitedViews
        dispatch('tagsView/delView', currentRoute)
        // go to back page
        const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
        router.push({
          path: oldRouter.path
        }, () => {})
        */
        requestRunProcess({
          uuid: containerUuid,
          parametersList,
          // TODO: Add support to tableSelectedId
          tableSelectedId: null,
          selectionsList
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
            commit('clearBrowserData', {
              containerUuid: parentUuid
            })
            dispatch('setBrowserDefaultValues', {
              containerUuid: parentUuid
            })

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
      containerUuid
    }) {
      return new Promise(resolve => {
        const recordId = router.app._route.query.recordId
        const recordUuid = router.app._route.query.action
        const windowsUuid = router.app._route.meta.uuid
        const browserDefinition = getters.getStoredTab(windowsUuid, parentUuid)
        const processModal = getters.getModalDialogManager({
          containerUuid: containerUuid
        })
        const currentProcess = browserDefinition.processes.find(process => process.name === processModal.title)

        // })
        const fieldsList = getters.getStoredFieldsFromProcess(containerUuid)
        const parametersList = rootGetters.getProcessParameters({
          containerUuid,
          fieldsList
        })

        const isSession = !isEmptyValue(getToken())
        let procesingNotification = {
          close: () => false
        }
        if (isSession) {
          procesingNotification = showNotification({
            title: language.t('notifications.processing'),
            message: currentProcess.name,
            summary: currentProcess.description,
            type: 'info'
          })
        }

        let isProcessedError = false
        let summary = ''
        requestRunProcess({
          uuid: containerUuid,
          parametersList,
          recordUuid,
          recordId
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
        title: language.t('notifications.succesful'),
        message: language.t('notifications.processExecuted'),
        type: 'success',
        summary
      }

      if (isError) {
        const errorMessage = !isEmptyValue(summary)
          ? summary
          : language.t('notifications.error')

        processMessage = {
          name,
          title: language.t('notifications.error'),
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
