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

import language from '@/lang'
import router from '@/router'
import store from '@/store'

// constants
import {
  ACTIVE, CLIENT, PROCESSING, PROCESSED, UUID,
  READ_ONLY_FORM_COLUMNS
} from '@/utils/ADempiere/constants/systemColumns'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'

// utils and helpers methods
import evaluator from '@/utils/ADempiere/evaluator'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { BUTTON, isHiddenField } from '@/utils/ADempiere/references.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils'
import { getEntity } from '@/api/ADempiere/user-interface/persistence'

export function isReadOnlyTab({ parentUuid, containerUuid }) {
  const { windowType } = store.getters.getStoredWindow(parentUuid)
  // window is "Only Query" type
  if (windowType === 'Q') {
    return true
  }
  const { isReadOnly, readOnlyLogic } = store.getters.getStoredTab(parentUuid, containerUuid)
  // if tab is read only, all fields are read only
  if (isReadOnly) {
    return true
  }

  if (!isEmptyValue(readOnlyLogic)) {
    const isReadOnlyFromLogic = evaluator.evaluateLogic({
      context: getContext,
      parentUuid,
      containerUuid,
      logic: readOnlyLogic,
      defaultReturned: false
    })
    if (isReadOnlyFromLogic) {
      return true
    }
  }

  return false
}

/**
 * Is displayed field in panel single record
 */
export function isDisplayedField({ isDisplayed, displayLogic, isDisplayedFromLogic, isActive, displayType }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  // verify if field is active and displayed
  return isActive && isDisplayed && (isEmptyValue(displayLogic) || isDisplayedFromLogic)
}

/**
 * Default showed field from user
 */
export function evaluateDefaultFieldShowed({ defaultValue, isMandatory, isShowedFromUser, isParent }) {
  if (String(defaultValue).startsWith('@SQL=')) {
    return true
  }

  if (isEmptyValue(defaultValue) && isMandatory && !isParent) {
    return true
  }

  if (isShowedFromUser) {
    return true
  }
  return false
}

/**
 * Tab manager mandatory logic
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isMandatory, mandatoryLogic, isMandatoryFromLogic }) {
  return isMandatory || (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic)
}

/**
 * Is read only field in panel single record
 * @param {boolean} isReadOnly
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ isReadOnly, readOnlyLogic, isReadOnlyFromLogic }) {
  return isReadOnly || (!isEmptyValue(readOnlyLogic) && isReadOnlyFromLogic)
}

/**
 * Is displayed column in table multi record
 */
export function isDisplayedColumn({ isDisplayed, isDisplayedGrid, isDisplayedFromLogic, isActive, isKey, displayType, displayLogic }) {
  // key or button field not showed
  if (isKey || isHiddenField(displayType)) {
    return false
  }

  // window (table) result
  return isActive && isDisplayed && isDisplayedGrid &&
    (isEmptyValue(displayLogic) || isDisplayedFromLogic)
}

export function isMandatoryColumn({ isMandatory, mandatoryLogic, isMandatoryFromLogic }) {
  return isMandatory || (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic)
}

export function isReadOnlyColumn({ isReadOnly }) {
  return isReadOnly
}

/**
 * Create new record
 */
export const createNewRecord = {
  sequence: 0,
  name: language.t('actionMenu.createNewRecord'),
  type: 'setDefaultValues',
  enabled: ({ parentUuid, containerUuid }) => {
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return false
    }

    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
    // TODO: Verify index Parent Tab
    if (tab.isParentTab && tab.index > 0) {
      return false
    }

    if (tab.isInsertRecord) {
      const recordUuid = store.getters.getUuidOfContainer(containerUuid)
      return !isEmptyValue(recordUuid)
    }

    return false
  },
  svg: false,
  icon: 'el-icon-circle-plus-outline',
  actionName: 'createNewRecord',
  createNewRecord: ({ parentUuid, containerUuid }) => {
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return false
    }

    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
    if (!tab.isInsertRecord) {
      return false
    }
    // TODO: Verify index Parent Tab
    if (tab.isParentTab && tab.index > 0) {
      return false
    }
    // const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    // if (isEmptyValue(recordUuid)) {
    //   return false
    // }

    // // set old record
    // store.commit('setRecordUuidOnPanel', {
    //   containerUuid,
    //   recordUuid
    // })

    store.dispatch('setTabDefaultValues', {
      parentUuid,
      containerUuid
    })
  }
}

export const undoChange = {
  sequence: 0,
  name: language.t('actionMenu.undo'),
  type: 'undoModifyData',
  enabled: ({ parentUuid, containerUuid }) => {
    return isEmptyValue(
      store.getters.getUuidOfContainer(containerUuid)
    )
  },
  svg: false,
  icon: 'el-icon-circle-plus-outline',
  actionName: 'undoChange',
  undoChange: ({ parentUuid, containerUuid }) => {
    const oldRecordUuid = store.getters.getCurrentRecordOnPanel(containerUuid)
    if (isEmptyValue(oldRecordUuid)) {
      // clear values
      store.dispatch('setTabDefaultValues', {
        parentUuid,
        containerUuid
      })
      return false
    }

    // clear only changes into current record
    const currentRecordUuid = store.getters.getUuidOfContainer(containerUuid)
    if (!isEmptyValue(currentRecordUuid)) {
      const currentChanges = store.getters.getPersistenceAttributes({
        containerUuid,
        recordUuid: currentRecordUuid
      })
      if (!isEmptyValue(currentChanges)) {
        store.dispatch('setOldPersistenceValues', {
          parentUuid,
          containerUuid,
          recordUuid: currentRecordUuid
        })

        const tab = store.getters.getStoredTab(parentUuid, containerUuid)
        tab.fieldsList.forEach(field => {
          store.dispatch('changeDependentFieldsList', {
            field,
            containerManager
          })
        })
        return
      }
    }

    // set old record as current record
    const row = store.getters.getTabRowData({
      containerUuid,
      recordUuid: oldRecordUuid
    })

    const attributes = convertObjectToKeyValue({
      object: row
    })

    store.dispatch('notifyPanelChange', {
      parentUuid,
      containerUuid,
      attributes
    })

    // clear old values
    store.dispatch('clearPersistenceQueue', {
      containerUuid,
      recordUuid: row[UUID]
    }, {
      root: true
    })

    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
    tab.fieldsList.forEach(field => {
      store.dispatch('changeDependentFieldsList', {
        field,
        containerManager
      })
    })

    // update records and logics on child tabs
    tab.childTabs.filter(tabItem => {
      // get loaded tabs with records
      return store.getters.getIsLoadedTabRecord({
        containerUuid: tabItem.uuid
      })
    }).forEach(tabItem => {
      store.dispatch('setOldAsCurrentTabData', {
        parentUuid,
        containerUuid: tabItem.uuid
      })

      const oldRecordUuid = store.getters.getCurrentRecordOnPanel(tabItem.uuid)
      if (isEmptyValue(oldRecordUuid)) {
        return false
      }

      const row = store.getters.getTabRowData({
        containerUuid: tabItem.uuid,
        recordUuid: oldRecordUuid
      })
      const attributes = convertObjectToKeyValue({
        object: row
      })
      store.dispatch('notifyPanelChange', {
        parentUuid,
        containerUuid: tabItem.uuid,
        attributes
      })

      tabItem.fieldsList.forEach(field => {
        store.dispatch('changeDependentFieldsList', {
          field,
          containerManager
        })
      })

      // clear old values
      store.dispatch('clearPersistenceQueue', {
        containerUuid,
        recordUuid: row[UUID]
      }, {
        root: true
      })
    })
  }
}

/**
 * Delete record (entity)
 */
export const deleteRecord = {
  name: language.t('actionMenu.deleteRecord'),
  enabled: ({ parentUuid, containerUuid }) => {
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return false
    }

    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
    // TODO: Verify index Parent Tab
    if (tab.isParentTab && tab.index > 0) {
      return false
    }
    if (tab.isDeleteable) {
      const preferenceClientId = store.getters.getSessionContextClientId
      if (tab.isShowedTableRecords) {
        const selectionsRecords = store.getters.getTabSelectionsList({
          containerUuid
        })
        if (isEmptyValue(selectionsRecords)) {
          return false
        }
        const isOtherClient = selectionsRecords.some(record => record[CLIENT] !== preferenceClientId)
        return !isOtherClient
      } else {
        const recordUuid = store.getters.getUuidOfContainer(containerUuid)
        if (!isEmptyValue(recordUuid) && recordUuid !== 'create-new') {
          // client id value of record
          const clientIdRecord = store.getters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: CLIENT
          })
          // evaluate client id context with record
          return clientIdRecord === preferenceClientId
        }
      }
    }

    return false
  },
  svg: false,
  icon: 'el-icon-delete',
  type: 'deleteEntity',
  actionName: 'deleteRecord',
  deleteRecord: ({ parentUuid, containerUuid, recordId, recordUuid }) => {
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return false
    }

    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
    if (!tab.isDeleteable) {
      return false
    }

    // delete selection of records on table
    if (tab.isShowedTableRecords) {
      const selectionsRecords = store.getters.getTabSelectionsList({
        containerUuid
      })
      if (isEmptyValue(selectionsRecords)) {
        return false
      }
      store.dispatch('deleteSelectedRecordsFromWindow', {
        parentUuid,
        containerUuid
      })
      return
    }

    // delete record on panel
    store.dispatch('deleteEntity', {
      parentUuid,
      containerUuid,
      recordId,
      recordUuid
    })
      .then(() => {
        showMessage({
          message: language.t('recordManager.deleteRecordSuccessful'),
          type: 'success'
        })
      })
      .catch(error => {
        showMessage({
          message: language.t('recordManager.deleteRecordError'),
          type: 'error'
        })
        console.warn(`Delete Entity - Error ${error.message}, Code: ${error.code}.`)
      })
  }
}

/**
 * Run process associated on table or button field
 */
export const runProcessOfWindow = {
  name: language.t('actionMenu.runProcess'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  svg: false,
  icon: 'el-icon-setting',
  actionName: 'runProcessOfWindow',
  runProcessOfWindow: ({ parentUuid, containerUuid, uuid }) => {
    store.commit('setSelectProcessWindows', uuid)

    store.commit('setShowedModalDialog', {
      parentUuid: containerUuid,
      containerUuid: uuid,
      isShowed: true
    })
  }
}

/**
 * Generate report associated on table or button field
 */
export const generateReportOfWindow = {
  name: language.t('actionMenu.generateReport'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  isSvgIcon: true,
  icon: 'skill',
  actionName: 'generateReportOfWindow',
  generateReportOfWindow: ({ parentUuid, containerUuid, uuid }) => {
    store.commit('setSelectProcessWindows', uuid)

    store.commit('setShowedModalDialog', {
      parentUuid: containerUuid,
      containerUuid: uuid,
      isShowed: true
    })
  }
}

/**
 * Open Smart Browser Associated in Process
 */
export const openBrowserAssociated = {
  name: language.t('actionMenu.openSmartBrowser'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  isSvgIcon: true,
  icon: 'search',
  actionName: 'openBrowserAssociated',
  openBrowserAssociated: function({ parentUuid, containerUuid, uuid, browserUuid }) {
    if (isEmptyValue(browserUuid)) {
      const process = store.getters.getStoredProcessFromTab({
        windowUuid: parentUuid,
        tabUuid: containerUuid,
        processUuid: uuid
      })
      browserUuid = process.browserUuid
    }

    const inMenu = zoomIn({
      uuid: browserUuid,
      params: {
        browserId: 0,
        browserUuid
      },
      query: {
        parentUuid
      },
      isShowMessage: false
    })

    if (!inMenu) {
      router.push({
        name: 'Smart Browser',
        params: {
          browserId: 0,
          browserUuid
        },
        query: {
          parentUuid
        }
      }, () => {})
    }
  }
}

export const refreshRecord = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: ({ containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid) && recordUuid !== 'create-new'
  },
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecord: ({ parentUuid, containerUuid, recordId, recordUuid }) => {
    if (isEmptyValue(recordUuid)) {
      recordUuid = store.getters.getUuidOfContainer(containerUuid)
    }

    getEntity({
      tabUuid: containerUuid,
      recordId,
      recordUuid
    })
      .then(response => {
        const currentRow = store.getters.getTabRowData({
          recordUuid
        })

        // add new row on table
        store.commit('setTabRowWithRecord', {
          containerUuid,
          recordUuid,
          row: {
            ...ROW_ATTRIBUTES,
            ...currentRow,
            ...response.attributes
          }
        })

        // update fields values
        store.dispatch('updateValuesOfContainer', {
          parentUuid,
          containerUuid,
          attributes: response.attributes
        }, {
          root: true
        })
      })
  }
}

export const refreshRecords = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: () => {
    return true
  },
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecords: ({ parentUuid, containerUuid }) => {
    // refresh records on current tab
    store.dispatch('getEntities', {
      parentUuid,
      containerUuid
    })

    // get tabs with same table to refresh without current tab
    const tableName = store.getters.getTableName(parentUuid, containerUuid)
    const tabsWithSameTable = store.getters.getStoredTabsFromTableName({
      parentUuid,
      containerUuid,
      tableName
    })
    // update records on tabs with same table
    if (!isEmptyValue(tabsWithSameTable)) {
      tabsWithSameTable.forEach(tab => {
        const isLoaded = store.getters.getIsLoadedTabRecord({
          containerUuid: tab.uuid
        })
        // if loaded data refresh this data
        // TODO: Verify with one entity, not all list
        if (isLoaded) {
          store.dispatch('getEntities', {
            parentUuid,
            containerUuid: tab.uuid
          })
        }
      })
    }
  }
}

export const lockRecord = {
  name: language.t('actionMenu.refreshRecords'),
  type: 'lockRecord',
  enabled: ({ parentUuid, containerUuid }) => {
    return !isEmptyValue(
      store.getters.getUuidOfContainer(containerUuid)
    )
  },
  svg: false,
  icon: 'el-icon-lock',
  actionName: 'lockRecord',
  lockRecord: ({ parentUuid, containerUuid, tableName }) => {
  }
}

export const unlockRecord = {
  name: language.t('actionMenu.refreshRecords'),
  type: 'unlockRecord',
  enabled: ({ parentUuid, containerUuid }) => {
    return !isEmptyValue(
      store.getters.getUuidOfContainer(containerUuid)
    )
  },
  svg: false,
  icon: 'el-icon-unlock',
  actionName: 'unlockRecord',
  unlockRecord: ({ parentUuid, containerUuid, tableName }) => {
  }
}

export const recordAccess = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: ({ parentUuid, containerUuid }) => {
    return !isEmptyValue(
      store.getters.getUuidOfContainer(containerUuid)
    )
  },
  svg: false,
  icon: 'el-icon-c-scale-to-original',
  actionName: 'recordAccess',
  recordAccess: ({ parentUuid, containerUuid, tableName }) => {
  }
}

/**
 * Generate window
 * @param {object} responseWindow
 * @returns {object}
 */
export function generateWindow(responseWindow) {
  const {
    tabsList, tabsListParent, tabsListChild,
    firstTab, firstTabUuid
  } = generateTabs({
    tabs: responseWindow.tabs,
    parentUuid: responseWindow.uuid
  })

  let currentTabChild = {}
  if (!isEmptyValue(tabsListChild)) {
    currentTabChild = tabsListChild[0]
  }

  const newWindow = {
    ...responseWindow,
    tabsList,
    currentTab: tabsListParent[0],
    currentTabChild,
    tabsListChild,
    tabsListParent,
    currentTabUuid: tabsListParent[0].uuid,
    firstTab,
    firstTabUuid,
    // App properties
    isShowedTabsParent: true,
    isShowedTabsChildren: true,
    isShowedRecordNavigation: undefined, // TODO: @deprecated
    isShowedAdvancedQuery: false,
    isFullScreenTabsParent: false,
    isFullScreenTabsChildren: false
  }

  // delete unused property
  delete newWindow.tabs

  return newWindow
}

export function generateTabs({
  tabs,
  parentUuid
}) {
  const firstTabTableName = tabs[0].tableName
  const firstTabUuid = tabs[0].uuid

  // indexes related to visualization
  const tabsList = tabs.filter((itemTab) => {
    return !(
      itemTab.isTranslationTab || itemTab.isSortTab ||
      itemTab.isAdvancedTab || itemTab.isHasTree
    )
  }).map((currentTab, index, listTabs) => {
    const isParentTab = Boolean(firstTabTableName === currentTab.tableName)

    const convertRelationTabs = (itemTab) => {
      return {
        name: itemTab.name,
        id: itemTab.id,
        uuid: itemTab.uuid,
        tableName: itemTab.tableName,
        sequence: itemTab.sequence,
        tabLevel: itemTab.tabLevel
      }
    }

    const parentTabs = listTabs
      .filter(itemTab => {
        return itemTab.uuid !== currentTab.uuid &&
          itemTab.sequence < currentTab.sequence &&
          itemTab.tabLevel < currentTab.tabLevel
      })
      .map(convertRelationTabs)

    const childTabs = listTabs
      .filter(itemTab => {
        return itemTab.uuid !== currentTab.uuid &&
          itemTab.sequence > currentTab.sequence &&
          itemTab.tabLevel > currentTab.tabLevel
      })
      .map(convertRelationTabs)

    let parentFieldsList = []
    if (!isEmptyValue(currentTab.displayLogic)) {
      parentFieldsList = evaluator.parseDepends(currentTab.displayLogic)
    }
    // let tab = tabItem
    const tab = {
      ...currentTab,
      parentUuid,
      containerUuid: currentTab.uuid,
      tabGroup: currentTab.fieldGroup,
      firstTabUuid,
      // relations
      childTabs,
      isParentTab,
      parentTabs,
      parentFieldsList,
      // evaluate display logic
      isShowedTab: () => {
        if (!isEmptyValue(currentTab.displayLogic)) {
          const isDisplayedFromLogic = evaluator.evaluateLogic({
            context: getContext,
            parentUuid,
            containerUuid: currentTab.uuid,
            logic: currentTab.displayLogic,
            defaultReturned: true
          })
          return isDisplayedFromLogic
        }
        return true
      },
      // app properties
      isShowedRecordNavigation: !(currentTab.isSingleRow || isParentTab), // TODO: @deprecated
      isShowedTableRecords: !(currentTab.isSingleRow || isParentTab),
      index, // this index is not related to the index in which the tabs are displayed
      isSelected: false
    }

    return generatePanelAndFields({
      parentUuid,
      containerUuid: currentTab.uuid,
      panelMetadata: tab,
      isAddFieldUuid: true,
      isAddLinkColumn: true,
      fieldOverwrite: {
        isReadOnlyFromForm: true,
        isShowedFromUser: false,
        firstTabUuid
      },
      evaluateDefaultFieldShowed
    })
  })

  const tabsListParent = tabsList.filter(tabItem => {
    return tabItem.isParentTab
  }).map((itemTab, tabParentIndex) => {
    return {
      ...itemTab,
      tabParentIndex
    }
  })

  // generate tabs childs
  const tabsListChild = tabsList.filter(tabItem => {
    return !tabItem.isParentTab
  }).map((itemTab, tabChildIndex) => {
    return {
      ...itemTab,
      tabChildIndex
    }
  })

  return {
    firstTabUuid,
    firstTab: tabsList[0],
    tabsListParent,
    tabsListChild,
    tabsList
  }
}

/**
 * Manage the window tab panel
 */
export const containerManager = {
  getPanel({ parentUuid, containerUuid }) {
    return store.getters.getStoredTab(parentUuid, containerUuid)
  },
  getFieldsList: ({ parentUuid, containerUuid }) => {
    return store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
  },
  getFieldsToHidden: ({ parentUuid, containerUuid, fieldsList, showedMethod, isEvaluateDefaultValue, isTable }) => {
    return store.getters.getTabFieldsListToHidden({
      parentUuid,
      containerUuid,
      fieldsList,
      showedMethod,
      isEvaluateDefaultValue,
      isTable
    })
  },

  actionPerformed: ({ field, columnName, value }) => {
    return store.dispatch('actionPerformed', {
      field,
      columnName,
      value
    })
      .then(response => {
        if (isEmptyValue(response)) {
          // change Dependents
          store.dispatch('changeDependentFieldsList', {
            field,
            containerManager: containerManager
          })
          return
        }

        if (response.type === 'createEntity') {
          const currentRoute = router.app._route
          router.push({
            name: currentRoute.name,
            query: {
              ...currentRoute.query,
              action: response.uuid,
              recordId: response.id
            },
            params: {
              ...currentRoute.params,
              recordId: response.id
            }
          }, () => {})
        }

        const { parentUuid, containerUuid } = field
        const tab = store.getters.getStoredTab(parentUuid, containerUuid)

        // set response values
        store.dispatch('updateValuesOfContainer', {
          parentUuid,
          containerUuid,
          isOverWriteParent: tab.isParentTab,
          attributes: response.attributes
        })
      })
  },

  setDefaultValues: ({ parentUuid, containerUuid }) => {
    store.dispatch('setTabDefaultValues', {
      parentUuid,
      containerUuid
    })
  },

  seekRecord: ({ row, parentUuid, containerUuid }) => {
    if (isEmptyValue(row)) {
      store.dispatch('setTabDefaultValues', {
        parentUuid,
        containerUuid
      })
      return
    }
    const tabDefinition = store.getters.getStoredTab(parentUuid, containerUuid)
    const currentRoute = router.app._route
    if (tabDefinition.isParentTab) {
      const { tableName } = tabDefinition
      router.push({
        name: currentRoute.name,
        query: {
          ...currentRoute.query,
          action: row.UUID,
          tableName,
          recordId: row[`${tableName}_ID`]
        },
        params: {
          ...currentRoute.params,
          tableName,
          recordId: row[`${tableName}_ID`]
        }
      }, () => {})
    }

    const fieldsList = store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
    const defaultValues = store.getters.getParsedDefaultValues({
      parentUuid,
      containerUuid,
      isSOTrxMenu: currentRoute.meta.isSalesTransaction,
      fieldsList,
      formatToReturn: 'object'
    })

    const attributes = convertObjectToKeyValue({
      object: Object.assign(defaultValues, row)
    })

    store.dispatch('notifyPanelChange', {
      parentUuid,
      containerUuid,
      attributes,
      isOverWriteParent: tabDefinition.isParentTab
    })

    // clear old values
    store.dispatch('clearPersistenceQueue', {
      containerUuid,
      recordUuid: row[UUID]
    }, {
      root: true
    })

    // active logics with set records values
    fieldsList.forEach(field => {
      // change Dependents
      store.dispatch('changeDependentFieldsList', {
        field,
        fieldsList,
        containerManager: containerManager
      })
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
  },

  seekTab: function(eventInfo) {
    console.log('seekTab: ', eventInfo)
    return new Promise()
  },

  panelMain() {
    return 'mainWindow'
  },

  isDisplayedField,
  isDisplayedDefault: ({ isMandatory, isParent, defaultValue, parsedDefaultValue }) => {
    if (isMandatory && !isParent && isEmptyValue(defaultValue)) {
      return true
    }
    return false
  },
  isDisplayedColumn,

  isReadOnlyField(field) {
    const { parentUuid, containerUuid } = field

    // if tab is read only, all fields are read only
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return true
    }

    const { isParentTab } = store.getters.getStoredTab(parentUuid, containerUuid)

    if (!isParentTab) {
      // if parent record is new lock childs field to read only
      const recordParentTab = store.getters.getUuidOfContainer(field.firstTabUuid)
      if (isEmptyValue(recordParentTab) || recordParentTab === 'create-new') {
        return true
      }
    }

    // record uuid
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    // edit mode is diferent to create new
    const isWithRecord = recordUuid !== 'create-new' &&
      !isEmptyValue(recordUuid)

    if (!isWithRecord) {
      if (field.displayType === BUTTON.id) {
        return true
      }
    } else {
      // client id value of record
      const clientIdRecord = store.getters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName: CLIENT
      })
      // evaluate client id context with record
      const preferenceClientId = store.getters.getSessionContextClientId
      if (clientIdRecord !== preferenceClientId) {
        return true
      }

      // not updateable and record saved
      if (!field.isUpdateable) {
        return true
      }

      // record is inactive isReadOnlyFromForm
      if (field.columnName !== ACTIVE) {
        // is active value of record
        const isActiveRecord = store.getters.getValueOfField({
          parentUuid,
          containerUuid,
          columnName: ACTIVE
        })
        if (!isActiveRecord) {
          return true
        }
      }

      if (field.displayType !== BUTTON.id) {
        // is processed value of record
        const isProcessed = store.getters.getValueOfField({
          parentUuid,
          containerUuid,
          columnName: PROCESSED
        })
        if (convertStringToBoolean(isProcessed)) {
          return true
        }

        // is processing value of record
        const isProcessing = store.getters.getValueOfField({
          parentUuid,
          containerUuid,
          columnName: PROCESSING
        })
        if (convertStringToBoolean(isProcessing)) {
          return true
        }
      }
    }

    if (field.isAlwaysUpdateable) {
      return false
    }

    return isReadOnlyField(field) || field.isReadOnlyFromForm
  },

  isReadOnlyColumn({
    field,
    // records values
    row
  }) {
    // if tab is read only, all columns are read only
    const { isReadOnly } = store.getters.getStoredTab(field.parentUuid, field.containerUuid)
    if (isReadOnly) {
      return true
    }

    // read only with metadata
    if (isReadOnlyColumn(field)) {
      true
    }

    // not updateable and record saved
    const isWithRecord = !isEmptyValue(row.UUID)
    if (!field.isUpdateable && isWithRecord) {
      return true
    }

    // evaluate client id context with record
    const preferenceClientId = store.getters.getSessionContextClientId
    if (preferenceClientId !== parseInt(row.AD_Client_ID, 10) && isWithRecord) {
      return true
    }

    // columnName: IsActive
    const fieldReadOnlyForm = READ_ONLY_FORM_COLUMNS.find(item => {
      return !item.isChangedAllForm &&
        // columnName: IsActive, Processed, Processing
        Object.prototype.hasOwnProperty.call(row, item.columnName)
    })

    if (fieldReadOnlyForm) {
      const { columnName, valueIsReadOnlyForm } = fieldReadOnlyForm
      // compare if is same key
      return field.columnName !== columnName &&
        // compare if is same value
        row[columnName] === valueIsReadOnlyForm
    }

    return false
  },

  isMandatoryField,
  isMandatoryColumn,

  getStoredData({ containerUuid }) {
    return store.getters.getTabData({
      containerUuid
    })
  },

  isLoadedRecords: ({ containerUuid }) => {
    return store.getters.getIsLoadedTabRecord({
      containerUuid
    })
  },

  getRecordCount({ containerUuid }) {
    return store.getters.getTabRecordCount({
      containerUuid
    })
  },

  getRecordsList: ({ containerUuid }) => {
    return store.getters.getTabRecordsList({
      containerUuid: containerUuid
    })
  },

  getRow: ({ containerUuid, rowIndex, recordUuid }) => {
    return store.getters.getTabRowData({
      containerUuid,
      rowIndex,
      recordUuid
    })
  },

  getCell: ({ containerUuid, rowIndex, recordUuid, columnName }) => {
    return store.getters.getTabCellData({
      containerUuid,
      rowIndex,
      recordUuid,
      columnName
    })
  },

  setSelection: ({
    containerUuid,
    recordsSelected
  }) => {
    store.commit('setTabSelectionsList', {
      containerUuid,
      selectionsList: recordsSelected
    })
  },
  getSelection: ({
    containerUuid
  }) => {
    return store.getters.getTabSelectionsList({
      containerUuid
    })
  },

  // To Default Table
  setPage: ({
    parentUuid,
    containerUuid,
    pageNumber = 1
  }) => {
    store.dispatch('getEntities', {
      parentUuid,
      containerUuid,
      pageNumber
    })
  },
  getPageNumber({ containerUuid }) {
    return store.getters.getTabPageNumber({
      containerUuid
    })
  },

  changeFieldShowedFromUser({ parentUuid, containerUuid, fieldsShowed }) {
    store.dispatch('changeTabFieldShowedFromUser', {
      parentUuid,
      containerUuid,
      fieldsShowed
    })
  },

  /**
   * @returns Promisse with value and displayedValue
   */
  getDefaultValue({ parentUuid, containerUuid, uuid, id, contextColumnNames, columnName, value }) {
    return store.dispatch('getDefaultValueFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      fieldUuid: uuid,
      id,
      //
      columnName,
      value
    })
  },
  getLookupList({ parentUuid, containerUuid, uuid, id, contextColumnNames, columnName, searchValue, isAddBlankValue, blankValue }) {
    return store.dispatch('getLookupListFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      fieldUuid: uuid,
      id,
      columnName,
      searchValue,
      // app attributes
      isAddBlankValue,
      blankValue
    })
  },

  getRecordLogs({ tableName, recordId, recordUuid }) {
    return store.dispatch('listRecordLogs', {
      tableName,
      recordId,
      recordUuid
    })
  },

  getAttachment({ tableName, recordId, recordUuid }) {
    return store.dispatch('findAttachment', {
      tableName,
      recordId,
      recordUuid
    })
  },

  listChats({ tableName, recordId, recordUuid }) {
    return store.dispatch('listChatEntries', {
      tableName,
      recordId,
      recordUuid
    })
  },
  generalInfoSearch({
    containerUuid,
    contextColumnNames,
    filters,
    uuid,
    searchValue,
    tableName,
    columnName,
    pageNumber
  }) {
    return store.dispatch('findGeneralInfo', {
      containerUuid,
      contextColumnNames,
      filters,
      fieldUuid: uuid,
      searchValue,
      tableName,
      columnName,
      pageNumber
    })
  },
  searchTableHeader({
    containerUuid,
    tableName
  }) {
    return store.dispatch('searchTableHeader', {
      containerUuid,
      tableName
    })
  }
}
