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
import store from '@/store'

// API Request Methods
import { requestProcessMetadata as requestReportMetadata } from '@/api/ADempiere/dictionary/process.js'

// Constants
import {
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList.js'

// Utils and Helper Methods
import {
  runReport,
  runReportAs,
  changeParameters,
  clearParameters,
  runReportAsPrintFormat,
  runReportAsView
} from '@/utils/ADempiere/dictionary/report.js'
import { generateProcess as generateReport } from '@/utils/ADempiere/dictionary/process.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default {
  addReportToList({ commit }, reportResponse) {
    return new Promise(resolve => {
      commit('addReportToList', reportResponse)

      resolve(reportResponse)
    })
  },

  /**
   * Get report dictionary definition
   * @param {string} uuid of dictionary
   */
  getReportDefinitionFromServer({ dispatch, getters }, {
    uuid
  }) {
    return new Promise((resolve, reject) => {
      requestReportMetadata({
        uuid
      })
        .then(async reportResponse => {
          const { processDefinition: reportDefinition } = generateReport({
            processToGenerate: reportResponse
          })

          dispatch('setReportDefaultValues', {
            containerUuid: reportDefinition.uuid,
            fieldsList: reportDefinition.fieldsList
          })

          dispatch('addReportToList', reportDefinition)

          await dispatch('getListPrintFormats', {
            uuid,
            id: reportDefinition.id
          })

          dispatch('setReportActionsMenu', {
            containerUuid: uuid
          })

          resolve(reportDefinition)

          // exist dialog if is process associated
          const storedModalDialog = getters.getModalDialogManager({ containerUuid: uuid })
          if (isEmptyValue(storedModalDialog)) {
            dispatch('setModalDialog', {
              containerUuid: uuid,
              title: reportDefinition.name,
              doneMethod: () => {
                dispatch('startReport', {
                  containerUuid: uuid
                })
              },
              loadData: () => {
                return dispatch('getReportDefinitionFromServer', {
                  uuid: uuid
                })
              },
              // TODO: Change to string and import dynamic in component
              componentPath: () => import('@theme/components/ADempiere/PanelDefinition/index.vue'),
              isShowed: false
            })
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * Set actions menu to report
   * @param {string} containerUuid
   */
  setReportActionsMenu({ commit, getters, rootGetters }, {
    containerUuid
  }) {
    const reportDefinition = getters.getStoredReport(containerUuid)

    const actionsList = []
    actionsList.push(runReport)

    // destruct to avoid deleting the reference to the original variable and to avoid mutating
    const actionExportType = { ...runReportAs }
    const runTypeChilds = []
    if (!isEmptyValue(reportDefinition.reportExportTypes)) {
      reportDefinition.reportExportTypes.forEach(reportType => {
        // push values
        runTypeChilds.push({
          ...reportType,
          icon: 'el-icon-document',
          enabled: true,
          svg: false,
          actionName: 'runReportAs',
          uuid: null,
          runReportAs: ({ root, containerUuid }) => {
            store.dispatch('buildReport', {
              containerUuid,
              reportType: reportType.type
            })
          }
        })
      })

      actionExportType.childs = runTypeChilds
    }
    actionsList.push(actionExportType)

    // change parameters to report viewer
    actionsList.push(changeParameters)
    actionsList.push(clearParameters)

    // destruct to avoid deleting the reference to the original variable and to avoid mutating
    const actionPrintFormat = { ...runReportAsPrintFormat }
    const printFormats = rootGetters.getPrintFormatList(containerUuid)
    if (!isEmptyValue(printFormats)) {
      const printFormatChilds = []
      printFormats.forEach(printFormat => {
        printFormatChilds.push({
          ...printFormat,
          icon: 'el-icon-document',
          enabled: true,
          svg: false,
          actionName: 'runReportAsPrintFormat',
          uuid: null,
          runReportAsPrintFormat: ({
            instanceUuid,
            root,
            containerUuid
          }) => {
            store.dispatch('buildReport', {
              containerUuid,
              instanceUuid,
              action: printFormat,
              printFormatUuid: printFormat.printFormatUuid
            })
          }
        })
      })

      actionPrintFormat.childs = printFormatChilds
    }
    actionsList.push(actionPrintFormat)

    // destruct to avoid deleting the reference to the original variable and to avoid mutating
    const actionView = { ...runReportAsView }
    const reportsView = rootGetters.getReportViewList(containerUuid)
    if (!isEmptyValue(reportsView)) {
      const printFormatChilds = []
      reportsView.forEach(reportView => {
        printFormatChilds.push({
          ...reportView,
          icon: 'el-icon-document',
          enabled: true,
          svg: false,
          actionName: 'runReportView',
          uuid: null,
          runReportView: ({ root, containerUuid }) => {
            const currentRoute = router.app._route
            let instanceUuid = 'not-empty'
            if (currentRoute.params && currentRoute.params.instanceUuid) {
              instanceUuid = currentRoute.params.instanceUuid
            }

            store.dispatch('buildReport', {
              containerUuid,
              action: reportView,
              instanceUuid,
              reportViewUuid: reportView.reportViewUuid
            })
          }
        })
      })

      actionView.childs = printFormatChilds
    }
    actionsList.push(actionView)

    // action shared link
    actionsList.push(sharedLink)

    commit('setActionMenu', {
      containerUuid: reportDefinition.uuid,
      actionsList
    })
  },

  /**
   * Used by components/fields/filterFields
   * @param {string} containerUuid
   * @param {string} groupField
   * @param {array} fieldsShowed
   * @param {array} fieldsList
   */
  changeReportFieldShowedFromUser({ commit, getters }, {
    containerUuid,
    fieldsShowed = [],
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getStoredFieldsFromReport(containerUuid)
    }

    fieldsList.forEach(itemField => {
      let isShowedFromUser = false
      if (fieldsShowed.includes(itemField.columnName)) {
        isShowedFromUser = true
      }

      commit('changeReportFieldAttribute', {
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
  setReportDefaultValues({ commit, dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    return new Promise(resolve => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = getters.getStoredFieldsFromReport(containerUuid)
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

      // clear last parameters with report generated
      commit('setReportGenerated', {
        containerUuid
      })

      resolve(defaultAttributes)
    })
  }

}
