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

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'
import { isHiddenField } from '@/utils/ADempiere/references.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils'

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
 * Tab manager mandatory logic
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
}

/**
 * Is read only field in panel single record
 * @param {boolean} isReadOnly
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ isReadOnly, isReadOnlyFromLogic }) {
  return isReadOnly || isReadOnlyFromLogic
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

export function isMandatoryColumn({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
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
    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
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
    store.dispatch('setTabDefaultValues', {
      parentUuid,
      containerUuid
    })
  }
}

export const undoChange = {
  sequence: 0,
  name: language.t('actionMenu.createNewRecord'),
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
  }
}

/**
 * Delete record (entity)
 */
export const deleteRecord = {
  name: language.t('actionMenu.deleteRecord'),
  enabled: ({ parentUuid, containerUuid }) => {
    const tab = store.getters.getStoredTab(parentUuid, containerUuid)
    if (tab.isInsertRecord && tab.isDeleteable) {
      const recordUuid = store.getters.getUuidOfContainer(containerUuid)
      return !isEmptyValue(recordUuid)
    }

    return false
  },
  svg: false,
  icon: 'el-icon-delete',
  type: 'deleteEntity',
  actionName: 'deleteRecord',
  deleteRecord: ({ parentUuid, containerUuid, recordId, recordUuid }) => {
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

export const refreshRecords = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: () => {
    return true
  },
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecords: ({ parentUuid, containerUuid }) => {
    // used to window
    store.dispatch('getEntities', {
      parentUuid,
      containerUuid
    })
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
    isShowedAdvancedQuery: false
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
      // app properties
      isShowedRecordNavigation: !(currentTab.isSingleRow || isParentTab), // TODO: @deprecated
      isShowedTableRecords: !(currentTab.isSingleRow || isParentTab),
      index // this index is not related to the index in which the tabs are displayed
    }

    return generatePanelAndFields({
      parentUuid,
      containerUuid: currentTab.uuid,
      panelMetadata: tab,
      isAddFieldUuid: true,
      isAddLinkColumn: true,
      fieldOverwrite: {
        isReadOnlyFromForm: true,
        firstTabUuid
      }
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

  actionPerformed: function(eventInfo) {
    console.log('actionPerformed: ', eventInfo)
    return new Promise()
  },

  setDefaultValues: ({ parentUuid, containerUuid }) => {
    store.dispatch('setTabDefaultValues', {
      parentUuid,
      containerUuid
    })
  },

  seekRecord: function(eventInfo) {
    console.log('seekRecord: ', eventInfo)
    // return new Promise()
  },

  seekTab: function(eventInfo) {
    console.log('seekTab: ', eventInfo)
    return new Promise()
  },

  isDisplayedField,
  isDisplayedColumn,

  isReadOnlyField(field) {
    const { parentUuid, containerUuid } = field

    const { isParentTab, isReadOnly } = store.getters.getStoredTab(parentUuid, containerUuid)
    // if tab is read only, all fields are read only
    if (isReadOnly) {
      return true
    }
    if (!isParentTab) {
      // if parent record is new lock childs field to read only
      const recordParentTab = store.getters.getUuidOfContainer(field.firstTabUuid)
      if (isEmptyValue(recordParentTab) || recordParentTab === 'create-new') {
        return true
      }
    }

    // record uuid
    const recordUuid = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: UUID
    })
    // edit mode is diferent to create new
    const isWithRecord = recordUuid !== 'create-new' &&
      !isEmptyValue(recordUuid)

    if (!isWithRecord) {
      if (field.componentPath === 'FieldButton') {
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

      // is active value of record
      const isActiveRecord = store.getters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName: ACTIVE
      })
      // record is inactive isReadOnlyFromForm
      if (!isActiveRecord && field.columnName !== 'IsActive') {
        return true
      }

      // is processed value of record
      const isProcessed = store.getters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName: PROCESSED
      })
      if (isProcessed && field.componentPath !== 'FieldButton') {
        return true
      }

      // is processing value of record
      const isProcessing = store.getters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName: PROCESSING
      })
      if (isProcessing && field.componentPath !== 'FieldButton') {
        return true
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

  getRow: ({ containerUuid, rowIndex, rowUuid }) => {
    return store.getters.getTabRowData({
      containerUuid,
      rowIndex,
      rowUuid
    })
  },

  getCell: ({ containerUuid, rowIndex, rowUuid, columnName }) => {
    return store.getters.getTabCellData({
      containerUuid,
      rowIndex,
      rowUuid,
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
    pageNumber = 0
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
  }
}
