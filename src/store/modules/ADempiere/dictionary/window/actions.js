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
import { requestWindowMetadata } from '@/api/ADempiere/dictionary/window.ts'
import { listPrintFormatsTableRequest } from '@/api/ADempiere/reportManagement/printFormat.ts'

// Constants
import { CLIENT, DOCUMENT_ACTION, DOCUMENT_STATUS } from '@/utils/ADempiere/constants/systemColumns'
import { DISPLAY_COLUMN_PREFIX, IS_ADVANCED_QUERY } from '@/utils/ADempiere/dictionaryUtils'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { ACTION_None } from '@/utils/ADempiere/dictionary/workflow'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertArrayKeyValueToObject } from '@/utils/ADempiere/formatValue/iterableFormat'
import {
  containerManager,
  isDisplayedField,
  generateWindow,
  createNewRecord,
  deleteRecord,
  exportCurrentRecord,
  runProcessOfWindow,
  generateReportOfWindow,
  openDocumentAction,
  openFormAssociated,
  refreshRecord,
  refreshRecords,
  recordAccess,
  undoChange
} from '@/utils/ADempiere/dictionary/window'
import {
  openBrowserAssociated,
  openSequenceTab
} from '@/utils/ADempiere/dictionary/window/actionsMenu'
import { panelAdvanceQuery } from '@/utils/ADempiere/dictionary/panel.js'
import {
  exportRecordsSelected,
  sharedLink
} from '@/utils/ADempiere/constants/actionsMenuList.js'
import evaluator from '@/utils/ADempiere/contextUtils/evaluator'
import { getContext, isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { showMessage } from '@/utils/ADempiere/notification'
import { containerManager as containerManagerReport } from '@/utils/ADempiere/dictionary/report'
import {
  getDocumentStatusValue, getCurrentDocumentDisplayedValue, isRunableDocumentAction, isEndDocumentAction
} from '@/utils/ADempiere/dictionary/workflow'

export default {
  addWindow({ commit, dispatch }, windowResponse) {
    return new Promise(resolve => {
      commit('addWindowToList', windowResponse)

      windowResponse.tabsList.forEach(tab => {
        dispatch('setTabActionsMenu', {
          parentUuid: windowResponse.uuid,
          containerUuid: tab.uuid
        })

        commit('setTableNameByTab', {
          uuid: tab.uuid,
          tableName: tab.table_name
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
    id
  }) {
    const language = rootGetters['getCurrentLanguage']
    const dictionaryCode = rootGetters['user/getDictionaryCode']

    return new Promise(resolve => {
      requestWindowMetadata({
        id,
        language,
        dictionaryCode
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
    parentUuid: windowUuid,
    containerUuid: tabUuid
  }) {
    const tabDefinition = getters.getStoredTab(windowUuid, tabUuid)

    const actionsList = []

    actionsList.push(createNewRecord)
    actionsList.push(undoChange)

    if (!isEmptyValue(tabDefinition.processes)) {
      let relatedColumns = []
      const parentColumns = tabDefinition.fieldsList
        .filter(fieldItem => {
          return fieldItem.is_parent || fieldItem.is_key || fieldItem.is_mandatory
        })
        .map(fieldItem => {
          return fieldItem.columnName
        })

      if (!isEmptyValue(tabDefinition.parent_column_name)) {
        relatedColumns = relatedColumns.push(tabDefinition.parent_column_name)
      }
      relatedColumns = relatedColumns.concat(parentColumns).sort()

      tabDefinition.processes.forEach(process => {
        let defaultAction = {}
        if (process.is_report) {
          defaultAction = {
            ...generateReportOfWindow
          }

          const doneMethodByReport = ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
            const emptyMandatory = rootGetters.getFieldsListEmptyMandatory({
              containerUuid: process.uuid
            })
            if (!isEmptyValue(emptyMandatory)) {
              showMessage({
                message: language.t('notifications.mandatoryFieldMissing') + emptyMandatory,
                type: 'info'
              })
              return
            }

            const recordUuid = rootGetters.getUuidOfContainer(tabAssociatedUuid)

            const storedTab = rootGetters.getStoredTab(windowUuid, tabAssociatedUuid)
            const { table_name } = storedTab
            dispatch('startReport', {
              parentUuid: tabUuid,
              containerUuid: process.uuid,
              recordUuid,
              tableName: table_name
            })
          }

          dispatch('setModalDialog', {
            containerUuid: process.uuid,
            title: process.name,
            containerManager: containerManagerReport,
            doneMethod: doneMethodByReport,
            beforeOpen: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              // set context values
              const parentValues = getContextAttributes({
                parentUuid: windowUuid,
                containerUuid: tabAssociatedUuid,
                contextColumnNames: relatedColumns
              })

              dispatch('updateValuesOfContainer', {
                containerUuid: process.uuid,
                attributes: parentValues
              })
            },
            loadData: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              const reportDefinition = rootGetters.getStoredReport(process.uuid)
              const storedTab = rootGetters.getStoredTab(windowUuid, tabAssociatedUuid)
              const { table_name } = storedTab
              if (!isEmptyValue(reportDefinition)) {
                // auto run report if without parameters
                if (!reportDefinition.hasParameters || isEmptyValue(reportDefinition.fieldsList)) {
                  // close modal dialog
                  store.commit('setShowedModalDialog', {
                    containerUuid: reportDefinition.uuid,
                    isShowed: false
                  })
                  doneMethodByReport({
                    parentUuid: tabAssociatedUuid,
                    containerUuid
                  })
                }
                return Promise.resolve(reportDefinition)
              }

              return dispatch('getReportDefinitionFromServer', {
                id: process.id,
                tableName: table_name
              }).then(reportDefinitionResponse => {
                // auto run report if without parameters
                if (isEmptyValue(reportDefinitionResponse.fieldsList)) {
                  // close modal dialog
                  store.commit('setShowedModalDialog', {
                    containerUuid: process.uuid,
                    isShowed: false
                  })
                  doneMethodByReport({
                    parentUuid: tabAssociatedUuid,
                    containerUuid
                  })
                }
              })
            },
            // TODO: Change to string and import dynamic in component
            componentPath: () => import('@/components/ADempiere/PanelDefinition/index.vue'),
            isShowed: false
          })
        } else if (!isEmptyValue(process.browser_id) && process.browser_id > 0) {
          defaultAction = {
            ...openBrowserAssociated
          }
        } else if ((!isEmptyValue(process.form_id) && process.form_id > 0) || (!isEmptyValue(process.form) && !isEmptyValue(process.form.id))) {
          defaultAction = {
            ...openFormAssociated
          }
        } else if (!isEmptyValue(process.workflow_id) && process.workflow_id > 0) {
          // Add workflow icon
          defaultAction = {
            ...openDocumentAction
          }

          dispatch('setModalDialog', {
            containerUuid: process.uuid,
            title: process.name,
            containerManager: containerManager,
            isDisabledDone() {
              // validate document status and Processing flag
              return !isRunableDocumentAction({
                parentUuid: windowUuid,
                containerUuid: tabDefinition.uuid
              })
            },
            doneMethod: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              const recordUuid = rootGetters.getUuidOfContainer(tabAssociatedUuid)

              const storedTab = rootGetters.getStoredTab(windowUuid, tabAssociatedUuid)
              const { table_name } = storedTab

              const recordId = rootGetters.getIdOfContainer({
                containerUuid: storedTab.containerUuid,
                tableName: table_name
              })

              const documentAction = getters.getValueOfField({
                containerUuid: process.uuid,
                columnName: DOCUMENT_ACTION
              })
              const parametersList = {}
              parametersList[DOCUMENT_ACTION] = documentAction
              dispatch('startProcessOfWindows', {
                parentUuid: tabAssociatedUuid,
                containerUuid: process.uuid,
                tableName: table_name,
                recordId,
                recordUuid,
                parametersList
              }).then(async processResponse => {
                // if (processResponse.is_error) {
                //   return
                // }

                // update current record
                await refreshRecord.refreshRecord({
                  parentUuid: windowUuid,
                  tabId: storedTab.id,
                  recordUuid,
                  recordId
                })
              }).finally(() => {
                const documentStatus = rootGetters.getValueOfFieldOnContainer({
                  // parentUuid: parentUuid,
                  containerUuid: containerUuid,
                  columnName: DOCUMENT_STATUS
                })

                if (!isEmptyValue(documentStatus)) {
                  dispatch('getDocumentStatusesListFromServer', {
                    tableName: table_name,
                    recordId,
                    recordUuid,
                    documentStatus
                  })
                  dispatch('getDocumentActionsListFromServer', {
                    tableName: table_name,
                    recordId,
                    recordUuid,
                    documentStatus
                  })
                }
              })
            },
            beforeOpen: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              // set context values
              const parentValues = getContextAttributes({
                parentUuid: windowUuid,
                containerUuid: tabAssociatedUuid,
                contextColumnNames: relatedColumns
              })
              let documentAction = getContext({
                parentUuid: windowUuid,
                containerUuid: tabAssociatedUuid,
                columnName: DOCUMENT_ACTION
              })

              if (!isEmptyValue(documentAction)) {
                const documentStatus = store.getters.getValueOfFieldOnContainer({
                  containerUuid: tabAssociatedUuid,
                  columnName: DOCUMENT_STATUS
                })
                // If None, suggest closing
                if (!isEndDocumentAction(documentStatus) && documentAction === ACTION_None) {
                  documentAction = 'CL'
                  parentValues.push({
                    columnName: DOCUMENT_ACTION,
                    value: documentAction
                  })
                }
              }

              dispatch('updateValuesOfContainer', {
                containerUuid: process.uuid,
                attributes: parentValues
              })
            },
            loadData: () => {
              const processDefinition = rootGetters.getStoredProcess(process.uuid)
              if (!isEmptyValue(processDefinition)) {
                return Promise.resolve(processDefinition)
              }

              return dispatch('getProcessDefinitionFromServer', {
                id: process.id.toString()
              })
            },
            // TODO: Change to string and import dynamic in component
            componentPath: () => import('@/components/ADempiere/PanelDefinition/DocumentActionPanel.vue'),
            isShowed: false
          })
        } else {
          defaultAction = {
            ...runProcessOfWindow
          }
          dispatch('setModalDialog', {
            containerUuid: process.uuid,
            title: process.name,
            doneMethod: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              // TODO: Get container uuid with multiple tabs and same process
              const recordUuid = rootGetters.getUuidOfContainer(tabAssociatedUuid)

              const storedTab = rootGetters.getStoredTab(windowUuid, tabAssociatedUuid)
              const { table_name } = storedTab

              const recordId = rootGetters.getIdOfContainer({
                containerUuid: storedTab.containerUuid,
                tableName: table_name
              })

              dispatch('startProcessOfWindows', {
                parentUuid: tabAssociatedUuid,
                containerUuid: process.uuid,
                tableName: table_name,
                recordId,
                recordUuid
              }).then(async processResponse => {
                // if (processResponse.is_error) {
                //   return
                // }
                await refreshRecord.refreshRecord({
                  parentUuid: windowUuid,
                  containerUuid: tabAssociatedUuid,
                  tabId: storedTab.internal_id,
                  recordId,
                  recordUuid
                })
                // update records and logics on child tabs
                tabDefinition.childTabs.filter(tabItem => {
                  const { hasBeenRendered } = rootGetters.getStoredTab(windowUuid, tabItem.uuid)
                  if (hasBeenRendered) {
                    return true
                  }
                  // get loaded tabs with records
                  return store.getters.getIsLoadedTabRecord({
                    containerUuid: tabItem.uuid
                  })
                }).forEach(tabItem => {
                  // if loaded data refresh this data
                  // TODO: Verify with get one entity, not get all list
                  store.dispatch('getEntities', {
                    parentUuid: windowUuid,
                    containerUuid: tabItem.uuid,
                    pageNumber: 1 // reload with first page
                  })
                })
              })
            },
            beforeOpen: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              // set context values
              const parentValues = getContextAttributes({
                parentUuid: windowUuid,
                containerUuid: tabAssociatedUuid,
                contextColumnNames: relatedColumns
              })

              dispatch('updateValuesOfContainer', {
                containerUuid: process.uuid,
                attributes: parentValues
              })
            },
            loadData: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
              const processDefinition = rootGetters.getStoredProcess(process.uuid)
              if (!isEmptyValue(processDefinition)) {
                return Promise.resolve(processDefinition)
              }

              return dispatch('getProcessDefinitionFromServer', {
                id: process.id.toString()
              })
            },
            // TODO: Change to string and import dynamic in component
            componentPath: () => import('@/components/ADempiere/PanelDefinition/index.vue'),
            isShowed: false
          })
        }

        // TODO: Improve performance, evaluate whether it is possible to directly
        // add the field display logic in the process associated with the field.
        const fieldAssociated = store.getters.getStoredFieldFromProcess({
          windowUuid,
          tabUuid,
          processUuid: process.uuid
        })

        let displayed = ({ containerUuid, parentUuid }) => {
          return true
        }
        if (fieldAssociated && !isEmptyValue(fieldAssociated.display_logic)) {
          displayed = ({ parentUuid, containerUuid }) => {
            // evaluate display logic of field with process associated to hidden/showed
            const isDisplayedFromLogic = evaluator.evaluateLogic({
              parentUuid,
              containerUuid,
              context: getContext,
              logic: fieldAssociated.display_logic
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
    const { sequenceTabsList } = tabDefinition

    if (!isEmptyValue(sequenceTabsList)) {
      sequenceTabsList.forEach(sequenceTab => {
        actionsList.push({
          ...openSequenceTab,
          id: sequenceTab.id,
          uuid: sequenceTab.uuid,
          name: sequenceTab.name,
          description: sequenceTab.description
        })

        const relatedColumns = sequenceTab.context_column_names
        dispatch('setModalDialog', {
          containerUuid: sequenceTab.uuid,
          title: sequenceTab.name,
          containerManager: {
            ...containerManager,
            getPanel: ({ parentUuid }) => {
              // TODO: Data Redundancy (call the tabDefinition defined above).
              // const tab = store.getters.getStoredTab(
              //   tabDefinition.parentUuid,
              //   tabDefinition.uuid
              // )
              return tabDefinition.sequenceTabsList.find(itemTab => {
                return itemTab.uuid === sequenceTab.uuid
              })
            }
          },
          // TODO: Change to string and import dynamic in component
          componentPath: () => import('@/components/ADempiere/PanelDefinition/SortPanel.vue'),
          isShowed: false,
          beforeOpen: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
            // set context values
            const parentValues = getContextAttributes({
              parentUuid: windowUuid,
              containerUuid: tabAssociatedUuid,
              contextColumnNames: relatedColumns
            })

            dispatch('updateValuesOfContainer', {
              containerUuid: sequenceTab.uuid,
              attributes: parentValues
            })
          },
          loadData: () => {
            return new Promise(resolve => {
              const recordsListSortTab = rootGetters.getTabSequenceRecordsList({
                parentUuid: windowUuid,
                containerUuid: tabUuid,
                tabUuid: sequenceTab.uuid,
                contextColumnNames: sequenceTab.context_column_names
              })
              if (!isEmptyValue(recordsListSortTab)) {
                resolve(recordsListSortTab)
                return
              }
              dispatch('listTabSequences', {
                parentUuid: windowUuid,
                containerUuid: tabUuid,
                contextColumnNames: sequenceTab.context_column_names,
                tabUuid: sequenceTab.uuid,
                tabId: sequenceTab.id
              })
              resolve([])
            })
          },
          doneMethod: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
            dispatch('saveTabSequence', {
              parentUuid: windowUuid,
              containerUuid: tabAssociatedUuid,
              tabUuid: sequenceTab.uuid,
              contextColumnNames: sequenceTab.context_column_names,
              tabId: sequenceTab.id
            })
          },
          isDisabledDone: ({ parentUuid: tabAssociatedUuid, containerUuid }) => {
            // client id value of record
            const clientIdRecord = rootGetters.getValueOfField({
              parentUuid: windowUuid,
              containerUuid: tabAssociatedUuid,
              columnName: CLIENT
            })
            // evaluate client id context with record
            const sessionClientId = rootGetters.getSessionContextClientId
            if (clientIdRecord !== sessionClientId) {
              return true
            }
            return !rootGetters.getTabSequenceIsChanged({
              parentUuid: windowUuid,
              containerUuid: tabAssociatedUuid,
              contextColumnNames: sequenceTab.context_column_names,
              tabUuid: sequenceTab.uuid
            })
          },
          cancelMethod: () => {
            dispatch('discardTabSequenceChanges', {
              parentUuid: windowUuid,
              containerUuid: tabUuid,
              contextColumnNames: sequenceTab.context_column_names,
              tabUuid: sequenceTab.uuid
            })
          }
        })
      })
    }

    actionsList.push(recordAccess)
    actionsList.push(exportCurrentRecord)
    actionsList.push({
      ...exportRecordsSelected,
      // overwrite displayed method
      displayed: ({ parentUuid, containerUuid }) => {
        const currentTab = store.getters.getStoredTab(parentUuid, containerUuid)

        // only multi record
        return currentTab.isShowedTableRecords
      }
    })
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
        const { column_name } = itemField

        const isShowedFromUser = fieldsShowed.includes(column_name)
        if (itemField.isShowedFromUser === isShowedFromUser) {
          // no to mutate the state unnecessarily
          return
        }
        if (!isDisplayedField(itemField)) {
          // is hidden by logic not change showed from user
          return
        }

        commit('changeTabFieldAttribute', {
          field: itemField,
          attributeName: 'isShowedFromUser',
          attributeValue: isShowedFromUser
        })
      }
    })
  },

  /**
   * Used by components/fields/filterFields
   */
  changeTabColumnShowedFromUser({ commit, getters }, {
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
        const isShowedTableFromUser = fieldsShowed.includes(itemField.column_name)

        commit('changeTabFieldAttribute', {
          field: itemField,
          attributeName: 'isShowedTableFromUser',
          attributeValue: isShowedTableFromUser
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
    overwriteValues = {},
    isOverWriteParent = true
  }) {
    return new Promise(resolve => {
      const storedTab = rootGetters.getStoredTab(parentUuid, containerUuid)

      const currentRoute = router.app._route
      delete currentRoute.query.filters

      const query = currentRoute.query
      if (storedTab.isParentTab) {
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

      const isSalesTransactionContext = isSalesTransaction({
        parentUuid,
        containerUuid,
        isRecord: false
      })
      let defaultAttributes = rootGetters.getTabParsedDefaultValue({
        parentUuid,
        containerUuid,
        isSOTrxDictionary: isSalesTransactionContext,
        fieldsList: storedTab.fieldsList
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

      // with copy values
      if (!isEmptyValue(overwriteValues)) {
        defaultAttributes = defaultAttributes.map(attribute => {
          const filterValue = overwriteValues[attribute.columnName]
          if (isEmptyValue(filterValue)) {
            return attribute
          }
          return {
            ...attribute,
            value: filterValue
          }
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

      if (storedTab.table.is_document) {
        // get displayed value on status
        const fieldDocumentStatus = storedTab.fieldsList.find(field => {
          return field.column_name === DOCUMENT_STATUS
        })
        if (!isEmptyValue(fieldDocumentStatus)) {
          const value = getDocumentStatusValue({
            parentUuid,
            containerUuid
          })
          const storedDisplayedValue = getCurrentDocumentDisplayedValue({
            parentUuid,
            containerUuid,
            uuid: fieldDocumentStatus.uuid,
            value
          })
          const displayedValue = storedDisplayedValue
          if (isEmptyValue(displayedValue)) {
            containerManager.getDefaultValue({
              parentUuid: fieldDocumentStatus.parentUuid,
              containerUuid: fieldDocumentStatus.containerUuid,
              contextColumnNames: fieldDocumentStatus.context_column_names,
              //
              uuid: fieldDocumentStatus.uuid,
              id: fieldDocumentStatus.internal_id,
              columnName: fieldDocumentStatus.column_name,
              defaultValue: fieldDocumentStatus.default_value,
              value: value
            })
          }
        }
      }

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
            fieldsList: storedTab.fieldsList,
            containerManager
          })
        }
      })

      // return values
      resolve(defaultAttributes)

      // add new row on table
      const defaultRowAttributes = convertArrayKeyValueToObject({
        array: defaultAttributes
      })

      const rowDefaultValues = {
        ...defaultRowAttributes,
        ...ROW_ATTRIBUTES,
        isNewRow: true,
        isEditRow: true,
        isSelectedRow: true
      }
      commit('setTabRow', {
        containerUuid,
        row: rowDefaultValues
      }, {
        root: true
      })
      commit('setTabSelectionsList', {
        containerUuid,
        selectionsList: [rowDefaultValues]
      })

      // update records and logics on child tabs
      storedTab.childTabs
        .filter(tabItem => {
          const { hasBeenRendered } = rootGetters.getStoredTab(parentUuid, tabItem.uuid)
          if (hasBeenRendered) {
            return true
          }
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
  },

  setTabAdvancedQuery({ commit, rootGetters }, {
    parentUuid,
    containerUuid
  }) {
    const tabPanel = rootGetters.getStoredTab(parentUuid, containerUuid)

    const tabAdvanceQuery = panelAdvanceQuery({
      parentUuid,
      containerUuid,
      tabPanel
    })

    commit('setTabAdvancedQuery', {
      parentUuid: parentUuid + IS_ADVANCED_QUERY,
      tabAdvanceQuery
    })
  },
  setPrintFormatWindow({ commit }, {
    tableName,
    reportId
  }) {
    return new Promise(resolve => {
      listPrintFormatsTableRequest({
        tableName
      })
        .then(response => {
          const { print_formats } = response
          commit('setPrintFormatsList', {
            reportId,
            printFormatList: print_formats
          })
          resolve(print_formats)
        })
    })
  }
}
