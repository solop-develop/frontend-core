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
import nprogress from 'nprogress'

// Constants
import {
  IDENTIFIER_COLUMN_SUFFIX, DISPLAY_COLUMN_PREFIX
} from '@/utils/ADempiere/dictionaryUtils'
import {
  ACTIVE, CLIENT, DOCUMENT_ACTION,
  DOCUMENT_NO, DOCUMENT_STATUS, CURRENCY,
  PROCESSING, PROCESSED, UUID, VALUE, // READ_ONLY_FORM_COLUMNS
  RECORD_ID,
  LOG_COLUMNS_NAME_LIST
} from '@/utils/ADempiere/constants/systemColumns'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { BUTTON, ID, LOCATION_ADDRESS, YES_NO } from '@/utils/ADempiere/references'
import { containerManager as CONTAINER_MANAGER_BROWSER } from '@/utils/ADempiere/dictionary/browser'

// API Request Methods
import { getEntity } from '@/api/ADempiere/userInterface/entities.ts'
import { requestSaveWindowCustomization } from '@/api/ADempiere/user-customization/window.js'

// Utils and Helpers Methods
import evaluator from '@/utils/ADempiere/contextUtils/evaluator'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { convertObjectToKeyValue } from '@/utils/ADempiere/formatValue/iterableFormat'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { isDecimalField, isHiddenField } from '@/utils/ADempiere/references'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils'
import { exportRecords, supportedTypes } from '@/utils/ADempiere/exportUtil.js'
import { isRunableDocumentAction } from '@/utils/ADempiere/dictionary/workflow'

/**
 * Evaluate if tab is displayed
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {string} displayLogic
 * @returns {boolean}
 */
export function isDisplayedTab({ parentUuid, containerUuid, displayLogic }) {
  // evaluate display logic
  if (!isEmptyValue(displayLogic)) {
    const isDisplayedFromLogic = evaluator.evaluateLogic({
      context: getContext,
      parentUuid,
      containerUuid,
      logic: displayLogic,
      defaultReturned: true
    })
    return isDisplayedFromLogic
  }

  return true
}

export function isReadOnlyTab({ parentUuid, containerUuid }) {
  const window = store.getters.getStoredWindow(parentUuid)
  if (isEmptyValue(window)) return true
  const { windowType } = window
  // window is "Only Query" type
  if (!isEmptyValue(windowType) && windowType === 'Q') {
    return true
  }
  const storeTab = store.getters.getStoredTab(parentUuid, containerUuid)
  if (isEmptyValue(storeTab)) return true
  const { isReadOnly, readOnlyLogic } = storeTab
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

export function isEditableRecord({ parentUuid, containerUuid }) {
  const preferenceClientId = store.getters.getSessionContextClientId
  // client id value of record
  const clientIdRecord = store.getters.getValueOfField({
    parentUuid,
    containerUuid,
    columnName: CLIENT
  })
  if (preferenceClientId !== clientIdRecord) {
    return false
  }

  // is active value of record
  const isActiveRecord = store.getters.getValueOfField({
    parentUuid,
    containerUuid,
    columnName: ACTIVE
  })
  if (!convertStringToBoolean(isActiveRecord)) {
    return false
  }

  // is processed value of record
  const isProcessedRecord = store.getters.getValueOfField({
    parentUuid,
    containerUuid,
    columnName: PROCESSED
  })
  if (convertStringToBoolean(isProcessedRecord)) {
    return false
  }

  // is processing value of record
  const isProcessingRecord = store.getters.getValueOfField({
    parentUuid,
    containerUuid,
    columnName: PROCESSING
  })
  if (convertStringToBoolean(isProcessingRecord)) {
    return false
  }

  return true
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
 * @param {string} columnName
 * @param {string} defaultValue
 * @param {boolean} isMandatory
 * @param {boolean} isShowedFromUser
 * @param {boolean} isParent
 */
export function evaluateDefaultFieldShowed({
  parentUuid, containerUuid,
  isKey, isParent, columnName,
  defaultValue, parsedDefaultValue,
  isShowedFromUser, isDisplayedAsPanel,
  displayType, displayLogic,
  isMandatory, mandatoryLogic, isMandatoryFromLogic
}) {
  if (!isEmptyValue(isDisplayedAsPanel)) {
    return convertStringToBoolean(isDisplayedAsPanel)
  }
  if (String(defaultValue).startsWith('@SQL=')) {
    return true
  }
  if (!isEmptyValue(displayLogic)) {
    return true
  }

  if (isParent) {
    return true
  }

  const { isParentTab, linkColumnName, parentColumnName } = store.getters.getStoredTab(parentUuid, containerUuid)
  if (!isParentTab && (linkColumnName === columnName || parentColumnName === columnName)) {
    return true
  }

  const isMandatoryGenerated = isMandatoryField({
    isKey, columnName, displayType, isMandatory, mandatoryLogic, isMandatoryFromLogic
  })
  const isEmpty = isEmptyValue(parsedDefaultValue) || (isDecimalField(displayType) && parsedDefaultValue === 0)
  if (isEmpty && isMandatoryGenerated && !isParent) {
    // Yes/No field always boolean value (as default value)
    if (displayType === YES_NO.id) {
      // Business Partner Window
      if (parentUuid === 'a520de12-fb40-11e8-a479-7a0060f0aa01') {
        // Customer Tab
        if (containerUuid === 'a49fb436-fb40-11e8-a479-7a0060f0aa01') {
          if (['IsCustomer'].includes(columnName)) {
            return true
          }
        }
        // Vendor Tab
        if (containerUuid === 'a49fb4e0-fb40-11e8-a479-7a0060f0aa01') {
          if (['IsVendor'].includes(columnName)) {
            return true
          }
        }
        // Emproyee Tab
        if (containerUuid === 'a4a07ccc-fb40-11e8-a479-7a0060f0aa01') {
          if (['IsEmployee'].includes(columnName)) {
            return true
          }
        }
      }
      return false
    }
    return true
  }

  if (isShowedFromUser) {
    return true
  }

  // TODO: Evaluated window type
  const permissedDisplayedDefault = [
    ACTIVE, 'Name',
    VALUE, DOCUMENT_NO, CURRENCY,
    'DateInvoiced', 'DateOrdered', 'DatePromised',
    'DateTrx', 'MovementDate', 'M_Product_ID', 'QtyEntered',
    'ValidTo',
    // TODO: Remove this columns with fixes default value
    'UserLevel'
  ]
  if (permissedDisplayedDefault.includes(columnName)) {
    return true
  }

  return false
}

/**
 * Default showed field from user
 * @param {string} columnName
 * @param {string} defaultValue
 * @param {boolean} isMandatory
 * @param {boolean} isShowedTableFromUser
 * @param {boolean} isParent
 */
export function evaluateDefaultColumnShowed({
  parentUuid, containerUuid,
  isKey, isParent, columnName,
  defaultValue, parsedDefaultValue,
  displayType, isShowedTableFromUser, isDisplayedAsTable,
  isMandatory, mandatoryLogic, isMandatoryFromLogic
}) {
  if (!isEmptyValue(isDisplayedAsTable)) {
    return convertStringToBoolean(isDisplayedAsTable)
  }
  if (String(defaultValue).startsWith('@SQL=')) {
    return true
  }

  if (isParent) {
    return true
  }

  const { isParentTab, linkColumnName, parentColumnName } = store.getters.getStoredTab(parentUuid, containerUuid)
  if (!isParentTab && (linkColumnName === columnName || parentColumnName === columnName)) {
    return true
  }

  const isMandatoryGenerated = isMandatoryColumn({
    isKey, columnName, displayType, isMandatory, mandatoryLogic, isMandatoryFromLogic
  })
  const isEmpty = isEmptyValue(parsedDefaultValue) || (isDecimalField(displayType) && parsedDefaultValue === 0)
  if (isEmpty && isMandatoryGenerated && !isParent) {
    // Yes/No field always boolean value (as default value)
    if (displayType === YES_NO.id) {
      return false
    }
    return true
  }

  if (isShowedTableFromUser) {
    return true
  }

  // TODO: Evaluated window type
  const permissedDisplayedDefault = [
    'Name',
    VALUE, DOCUMENT_NO, DOCUMENT_STATUS, CURRENCY,
    'DateInvoiced', 'DateOrdered', 'DatePromised',
    'DateTrx', 'M_Product_ID', 'QtyEntered',
    'TaskStatus'
  ]

  if (permissedDisplayedDefault.includes(columnName)) {
    return true
  }

  return false
}

/**
 * Tab manager mandatory logic
 * @see https://github.com/adempiere/adempiere/blob/develop/base/src/org/compiere/model/GridField.java#L401
 * @param {boolean} isKey
 * @param {string} columnName
 * @param {boolean} isMandatory
 * @param {string} mandatoryLogic
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isKey, columnName, displayType, isMandatory, mandatoryLogic, isMandatoryFromLogic }) {
  if (displayType === BUTTON.id) {
    return false
  }

  // mandatory rule
  if ((!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic)) {
    return true
  }
  // // is virtual column
  // if (!isEmptyValue(columnSql) && !isColumnSqlReference) {
  //   return false
  // }

  // Numeric Keys and Created/Updated as well as
  // DocumentNo/Value/ASI ars not mandatory (persistency layer manages them)
  const notMandatoryRender = [
    VALUE, DOCUMENT_NO, 'M_AttributeSetInstance_ID'
  ]
  if (
    (isKey && columnName.endsWith(IDENTIFIER_COLUMN_SUFFIX)) ||
    columnName.startsWith('Created') || columnName.startsWith('Updated') ||
    notMandatoryRender.includes(columnName)
  ) {
    return false
  }

  // is mandatory
  if (isMandatory) {
    // TODO: Evaluate displayed
    return true
  }
  // return isMandatory || (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic)
  return false
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

export function isMandatoryColumn({ isKey, columnName, displayType, isMandatory, mandatoryLogic, isMandatoryFromLogic }) {
  const notMandatoryRender = [
    VALUE, DOCUMENT_NO, 'M_AttributeSetInstance_ID'
  ]
  if (
    (isKey && columnName.endsWith(IDENTIFIER_COLUMN_SUFFIX)) ||
    columnName.startsWith('Created') || columnName.startsWith('Updated') ||
    notMandatoryRender.includes(columnName)
  ) {
    return false
  }

  if (displayType === BUTTON.id) {
    return false
  }
  return isMandatory || (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic)
}

export function isReadOnlyColumn({ isReadOnly }) {
  return isReadOnly
}

export function clearFilter(currentRoute) {
  router.replace({
    name: currentRoute.name,
    query: {
      ...currentRoute.query,
      filters: []
    },
    params: {
      ...currentRoute.params
    }
  }, () => {})
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

    if (!tab.isInsertRecord) {
      return false
    }
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    if (isEmptyValue(recordUuid)) {
      return false
    }

    if (!tab.isParentTab) {
      const isEditable = isEditableRecord({
        parentUuid
      })
      if (!isEditable) {
        return false
      }
    }

    return true
  },
  svg: false,
  icon: 'el-icon-circle-plus-outline',
  actionName: 'createNewRecord',
  createNewRecord: ({ parentUuid, containerUuid, isCopyValues = false }) => {
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

    // if (tab.value.isShowedTableRecords) {
    //   store.dispatch('changeTabAttribute', {
    //     attributeName: 'isShowedTableRecords',
    //     attributeNameControl: undefined,
    //     attributeValue: false,
    //     parentUuid: props.parentUuid,
    //     containerUuid
    //   })
    // }
    const currentValues = {}
    if (isCopyValues) {
      const copyableFields = tab.fieldsList.filter(field => {
        if (field.isVirtualColumn || field.isKey) {
          return false
        }
        if ([ID.id, LOCATION_ADDRESS.id].includes(field.displayType)) {
          return false
        }
        // Ignore Standard Values
        const { columnName } = field
        if (LOG_COLUMNS_NAME_LIST.includes(columnName)) {
          return false
        }
        if ([CLIENT, ACTIVE, PROCESSING, PROCESSED, UUID].includes(columnName)) {
          return false
        }
        return field.isAllowCopy
      })
      const tabContext = store.getters.getValuesView({
        containerUuid,
        format: 'object'
      })
      copyableFields.forEach(field => {
        const { columnName } = field
        const value = tabContext[columnName]

        if (!isEmptyValue(value)) {
          currentValues[columnName] = value
        }
      })
    }

    store.dispatch('setTabDefaultValues', {
      parentUuid,
      containerUuid,
      overwriteValues: currentValues
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

    // remove row on table
    store.commit('removeTabRow', {
      containerUuid,
      index: 0
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

      const fieldsList = store.getters.getStoredFieldsFromTab(parentUuid, tabItem.uuid)

      fieldsList.forEach(field => {
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
    if (!tab.isDeleteable) {
      return false
    }

    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    if (isEmptyValue(recordUuid) || recordUuid === 'create-new') {
      return false
    }

    const preferenceClientId = store.getters.getSessionContextClientId
    if (tab.isShowedTableRecords) {
      const selectionsRecords = store.getters.getTabSelectionsList({
        containerUuid
      })
      if (isEmptyValue(selectionsRecords)) {
        return false
      }
      // TODO: Improve creating method to define if record is enabled
      if (!tab.isParentTab) {
        const isEditable = isEditableRecord({
          parentUuid
        })
        if (!isEditable) {
          return false
        }
      }
      const isNotEditableAnyRecord = selectionsRecords.some(record => {
        return record[CLIENT] !== preferenceClientId ||
          !record[ACTIVE] || record[PROCESSED] || record[PROCESSING]
      })
      if (isNotEditableAnyRecord) {
        return false
      }
    } else {
      const isEditable = isEditableRecord({
        parentUuid,
        containerUuid
      })
      if (!isEditable) {
        return false
      }
    }

    return true
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
          message: language.t('recordManager.deleteRecordError') + ' ' + error.message,
          type: 'error'
        })
        console.warn(`Delete Entity - Error ${error.message}, Code: ${error.code}.`)
      })
  }
}

/**
 * Export current record
 */
export const exportCurrentRecord = {
  name: language.t('actionMenu.exportRecord'),
  displayed: ({ parentUuid, containerUuid }) => {
    const currentTab = store.getters.getStoredTab(parentUuid, containerUuid)

    // only single record
    return !currentTab.isShowedTableRecords
  },
  enabled: ({ containerUuid, containerManager }) => {
    const currentRecord = store.getters.getUuidOfContainer(containerUuid)

    return !isEmptyValue(currentRecord)
  },
  svg: false,
  icon: 'el-icon-download',
  actionName: 'exportCurrentRecord',
  exportCurrentRecord: ({ root, parentUuid, containerUuid, containerManager }) => {
    const currrentRecord = store.getters.getTabCurrentRow({ containerUuid })
    exportRecords({ parentUuid, containerUuid, containerManager, currrentRecord })
  },
  // generate export formats
  childs: Object.keys(supportedTypes).map(format => {
    return {
      name: supportedTypes[format],
      enabled: ({ containerUuid, containerManager }) => {
        return true
      },
      svg: false,
      icon: 'el-icon-download',
      actionName: 'exportCurrentRecord',
      exportCurrentRecord: ({ root, parentUuid, containerUuid, containerManager }) => {
        // change default format to current format
        const currrentRecord = store.getters.getTabCurrentRow({ containerUuid })
        exportRecords({ root, parentUuid, containerUuid, containerManager, formatToExport: format, currrentRecord })
      }
    }
  })
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

    const storedBrowser = store.getters.getStoredBrowser(browserUuid)
    if (!isEmptyValue(storedBrowser)) {
      // overwrite values
      store.dispatch('setBrowserDefaultValues', {
        containerUuid: browserUuid
      })
      const tabContext = store.getters.getValuesView({
        containerUuid
      })

      store.dispatch('updateValuesOfContainer', {
        containerUuid: browserUuid,
        attributes: tabContext
      })

      storedBrowser.fieldsList.forEach(itemField => {
        if (!itemField.isSameColumnElement) {
          const currentValueElement = tabContext.find(itemAttribute => {
            return itemAttribute.columnName === itemField.elementName
          })
          if (!isEmptyValue(currentValueElement) && !isEmptyValue(currentValueElement.value)) {
            store.commit('updateValueOfField', {
              containerUuid: browserUuid,
              columnName: itemField.elementName,
              value: currentValueElement.value
            })
            store.commit('updateValueOfField', {
              containerUuid: browserUuid,
              columnName: itemField.columnName,
              value: currentValueElement.value
            })
          }
          // change Dependents
          store.dispatch('changeDependentFieldsList', {
            field: itemField,
            containerManager: CONTAINER_MANAGER_BROWSER
          })
        }
      })

      store.dispatch('clearBrowserData', {
        containerUuid: browserUuid
      })
    }

    // set record id from window
    const storedTab = store.getters.getStoredTab(parentUuid, containerUuid)
    const { keyColumn } = storedTab

    const recordId = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: keyColumn
    })

    if (!isEmptyValue(recordId)) {
      store.commit('updateValueOfField', {
        containerUuid: browserUuid,
        columnName: RECORD_ID,
        value: recordId
      })
    }

    const inMenu = zoomIn({
      uuid: browserUuid,
      params: {
        browserId: 0,
        browserUuid
      },
      query: {
        parentUuid,
        containerUuid,
        recordId
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
          parentUuid,
          containerUuid,
          recordId
        }
      }, () => {})
    }
  }
}

/**
 * Open Form Associated in Process
 */
export const openFormAssociated = {
  name: language.t('actionMenu.openSpecialForm'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  isSvgIcon: true,
  icon: 'form',
  actionName: 'openFormAssociated',
  openFormAssociated: function({ parentUuid, containerUuid, uuid, formUuid }) {
    if (isEmptyValue(formUuid)) {
      const process = store.getters.getStoredProcessFromTab({
        windowUuid: parentUuid,
        tabUuid: containerUuid,
        processUuid: uuid
      })
      formUuid = process.formUuid
    }

    // set record id from window
    const storedTab = store.getters.getStoredTab(parentUuid, containerUuid)
    const { keyColumn } = storedTab

    const recordId = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: keyColumn
    })

    if (!isEmptyValue(recordId)) {
      store.commit('updateValueOfField', {
        containerUuid: formUuid,
        columnName: RECORD_ID,
        value: recordId
      })
    }

    const inMenu = zoomIn({
      uuid: formUuid,
      params: {
        formId: 0,
        formUuid
      },
      query: {
        [RECORD_ID]: recordId,
        recordId
      },
      isShowMessage: false
    })

    if (!inMenu) {
      router.push({
        name: 'Form',
        params: {
          formId: 0,
          formUuid
        },
        query: {
          [RECORD_ID]: recordId,
          recordId
        }
      }, () => {})
    }
  }
}

/**
 * Open Document Action to process workflow
 */
export const openDocumentAction = {
  name: language.t('actionMenu.startDocumentAction'),
  enabled: ({ parentUuid, containerUuid }) => {
    return isRunableDocumentAction({
      parentUuid,
      containerUuid
    })
  },
  isSvgIcon: true,
  icon: 'example',
  actionName: 'openDocumentAction',
  openDocumentAction: ({ parentUuid, containerUuid, uuid }) => {
    store.commit('setSelectProcessWindows', uuid)

    store.commit('setShowedModalDialog', {
      parentUuid: containerUuid,
      containerUuid: uuid,
      isShowed: true
    })
  }
}

/**
 * Run process associated on table or button field
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {number} recordId
 * @param {string} recordUuid
 */
export const openSequenceTab = {
  name: language.t('window.tab.sequenceTab'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  svg: false,
  icon: 'el-icon-sort',
  actionName: 'openSequenceTab',
  openSequenceTab: ({ parentUuid, containerUuid, uuid, contextColumnNames }) => {
    const currentTab = store.getters.getStoredTab(parentUuid, containerUuid)
    const { sequenceTabsList } = currentTab
    const sequenceTab = sequenceTabsList.find(itemTab => {
      return itemTab.uuid === uuid
    })

    store.commit('setSelectProcessWindows', sequenceTab.uuid)

    store.commit('setShowedModalDialog', {
      parentUuid,
      containerUuid: sequenceTab.uuid,
      isShowed: true
    })
  }
}

/**
 * Get current record and refresh values on panel and table
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {boolean} isRefreshChilds refresh records of childs tabs
 */
export const refreshRecord = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: ({ containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid) && recordUuid !== 'create-new'
  },
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecord: ({ parentUuid, containerUuid, recordId, recordUuid, isRefreshChilds = false }) => {
    if (isEmptyValue(recordUuid)) {
      recordUuid = store.getters.getUuidOfContainer(containerUuid)
    }
    const tabDefinition = store.getters.getStoredTab(parentUuid, containerUuid)
    if (isEmptyValue(recordId)) {
      recordId = store.getters.getIdOfContainer({
        containerUuid: containerUuid,
        tableName: tabDefinition.tableName
      })
    }

    store.dispatch('reloadTableData', {
      isLoaded: false,
      containerUuid
    })
    nprogress.start()
    return getEntity({
      tabId: tabDefinition.id,
      id: recordId
    })
      .then(response => {
        const currentRow = store.getters.getTabRowData({
          containerUuid,
          recordUuid
        })

        const newRow = {
          ...ROW_ATTRIBUTES,
          ...currentRow,
          ...response.values
        }

        // add new row on table
        store.commit('setTabRowWithRecord', {
          containerUuid,
          recordUuid,
          row: newRow
        })

        // update fields values
        store.dispatch('updateValuesOfContainer', {
          parentUuid,
          containerUuid,
          attributes: response.values,
          isOverWriteParent: tabDefinition.isParentTab
        }, {
          root: true
        })

        if (isRefreshChilds) {
          // update records and logics on child tabs
          tabDefinition.childTabs.filter(tabItem => {
            const { hasBeenRendered } = store.getters.getStoredTab(parentUuid, tabItem.uuid)
            if (hasBeenRendered) {
              return true
            }
            // get loaded tabs with records
            return store.getters.getIsLoadedTabRecord({
              containerUuid: tabItem.uuid
            })
          }).forEach(tabItem => {
            // if loaded data refresh this data
            store.dispatch('getEntities', {
              parentUuid,
              containerUuid: tabItem.uuid,
              pageNumber: 1 // reload with first page
            })
          })
        }
      })
      .finally(() => {
        store.dispatch('reloadTableData', {
          isLoaded: true,
          containerUuid
        })
        nprogress.done()
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
    nprogress.start()
    // refresh records on current tab
    store.dispatch('getEntities', {
      parentUuid,
      containerUuid,
      filters: []
    })
      .finally(() => {
        nprogress.done()
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
    clearFilter(router.app._route)
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

/**
 * Record access
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 */
export const recordAccess = {
  name: language.t('data.recordAccess.actions'),
  description: language.t('data.noDescription'),
  enabled: ({ parentUuid, containerUuid }) => {
    return !isEmptyValue(
      store.getters.getUuidOfContainer(containerUuid)
    )
  },
  svg: false,
  icon: 'el-icon-set-up',
  actionName: 'recordAccess',
  recordAccess: ({ tableName, recordId, recordUuid }) => {
    store.dispatch('listRecordAccess', {
      tableName,
      recordId,
      recordUuid
    })
    store.commit('setShowRecordAccess', true)
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

  const sequenceTabsListOnWindow = []

  // indexes related to visualization
  const tabsList = tabs.filter((itemTab, index) => {
    if (itemTab.isSortTab) {
      sequenceTabsListOnWindow.push({
        ...itemTab,
        firstTabUuid,
        parentUuid,
        containerUuid: itemTab.uuid
      })
      return false
    }
    return !(
      itemTab.isTranslationTab
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
        tabLevel: itemTab.tabLevel,
        contextColumnNames: itemTab.contextColumnNames
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

    const sequenceTabsList = sequenceTabsListOnWindow
      .filter(itemTab => {
        return itemTab.isSortTab &&
          itemTab.tableName === currentTab.tableName
      })
      .map(itemTab => {
        return {
          ...itemTab,
          parentUuid,
          parentTabs: [
            ...parentTabs,
            convertRelationTabs(currentTab)
          ]
        }
      })

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
      sequenceTabsList,
      // app properties
      isShowedTableRecords: !currentTab.isSingleRow, // !isParentTab,
      index, // this index is not related to the index in which the tabs are displayed
      isSelected: false,
      hasBeenRendered: false
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
      evaluateDefaultFieldShowed,
      evaluateDefaultColumnShowed
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
  changePanelAttribute({
    parentUuid,
    containerUuid,
    attributeName,
    attributeValue
  }) {
    return store.dispatch('changeTabAttribute', {
      parentUuid,
      containerUuid,
      attributeName,
      attributeValue
    })
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

  seekRecord: ({ recordUuid, row = {}, parentUuid, containerUuid }) => {
    if (isEmptyValue(row) && isEmptyValue(recordUuid)) {
      store.dispatch('setTabDefaultValues', {
        parentUuid,
        containerUuid
      })
      return
    }
    if (isEmptyValue(row)) {
      row = store.getters.getTabRowData({
        containerUuid,
        recordUuid
      })
      if (isEmptyValue(row)) {
        store.dispatch('setTabDefaultValues', {
          parentUuid,
          containerUuid
        })
        return
      }
    }

    const tabDefinition = store.getters.getStoredTab(parentUuid, containerUuid)
    const currentRoute = router.app._route
    if (tabDefinition.isParentTab) {
      // const { tableName } = tabDefinition
      // router.push({
      //   name: currentRoute.name,
      //   query: {
      //     ...currentRoute.query,
      //     action: row.UUID,
      //     tableName,
      //     recordId: row[`${tableName}_ID`]
      //   },
      //   params: {
      //     ...currentRoute.params,
      //     tableName,
      //     recordId: row[`${tableName}_ID`]
      //   }
      // }, () => {})
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

    // no clear values is new record
    if (!isEmptyValue(row[UUID])) {
      // clear old values
      store.dispatch('clearPersistenceQueue', {
        containerUuid,
        recordUuid: row[UUID]
      }, {
        root: true
      })
    }

    // active logics with set records values
    fieldsList.forEach(field => {
      // change Dependents
      store.dispatch('changeDependentFieldsList', {
        field,
        fieldsList,
        containerManager: containerManager,
        isGetDefaultValue: false
      })
    })

    // update records and logics on child tabs
    tabDefinition.childTabs.filter(tabItem => {
      const { hasBeenRendered } = store.getters.getStoredTab(parentUuid, tabItem.uuid)
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

  isDisplayedField,
  isDisplayedDefault: ({ isMandatory, isParent, defaultValue, displayType, parsedDefaultValue }) => {
    if (isMandatory && !isParent && isEmptyValue(defaultValue)) {
      // Yes/No field always boolean value (as default value)
      if (displayType === YES_NO.id) {
        return false
      }
      return true
    }
    return false
  },
  isDisplayedColumn,
  isDisplayedDefaultTable: ({ isMandatory, isParent, defaultValue, displayType, parsedDefaultValue }) => {
    if (isMandatory && !isParent && isEmptyValue(defaultValue)) {
      // Yes/No field always boolean value (as default value)
      if (displayType === YES_NO.id) {
        return false
      }
      return true
    }
    return false
  },

  isReadOnlyField(field) {
    const { parentUuid, containerUuid, columnName } = field

    // if tab is read only, all fields are read only
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return true
    }

    // tab properties
    const { isParentTab, linkColumnName } = store.getters.getStoredTab(parentUuid, containerUuid)

    // fill value with context
    if (linkColumnName === columnName) {
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
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    // edit mode is diferent to create new
    const isWithRecord = !isEmptyValue(recordUuid) && recordUuid !== 'create-new'
    if (isWithRecord) {
      // not updateable and record saved
      if (!field.isUpdateable) {
        return true
      }

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
    } else {
      // button not invoke (browser/process/report/workflow) without record
      if (field.displayType === BUTTON.id) {
        return true
      }
    }

    // validate parent record and current record
    // record is inactive isReadOnlyFromForm
    if (columnName !== ACTIVE) {
      // is active value of record
      const isActiveRecord = store.getters.getValueOfField({
        parentUuid: isParentTab ? undefined : parentUuid,
        containerUuid,
        columnName: ACTIVE
      })
      if (!convertStringToBoolean(isActiveRecord)) {
        return true
      }
    }

    // always updateable field
    if (field.isAlwaysUpdateable) {
      return false
    }

    // Button to process document
    if (columnName === DOCUMENT_ACTION) {
      return false
    }

    // is processed value of record
    const isProcessedRecord = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: PROCESSED
    })
    if (convertStringToBoolean(isProcessedRecord)) {
      return true
    }

    // is processing value of record
    const isProcessingRecord = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: PROCESSING
    })
    if (convertStringToBoolean(isProcessingRecord)) {
      return true
    }

    return isReadOnlyField(field) || field.isReadOnlyFromForm
  },

  isReadOnlyColumn({
    field,
    // records values
    row
  }) {
    const { parentUuid, containerUuid, columnName } = field

    // if tab is read only, all fields are read only
    if (isReadOnlyTab({ parentUuid, containerUuid })) {
      return true
    }

    const { isParentTab, linkColumnName, parentColumnName } = store.getters.getStoredTab(parentUuid, containerUuid)

    // fill value with context
    if (field.isParent || linkColumnName === columnName || parentColumnName === columnName) {
      return true
    }

    if (!isParentTab) {
      // if parent record is new lock childs field to read only
      const recordParentTab = store.getters.getUuidOfContainer(field.firstTabUuid)
      if (isEmptyValue(recordParentTab) || recordParentTab === 'create-new') {
        return true
      }
    }

    // client id value of record
    const clientIdRecord = parseInt(row[CLIENT], 10)
    // evaluate client id context with record
    const preferenceClientId = store.getters.getSessionContextClientId
    if (clientIdRecord !== preferenceClientId) {
      return true
    }

    // record uuid
    const recordUuid = row[UUID]
    // edit mode is diferent to create new
    const isWithRecord = !isEmptyValue(recordUuid) && recordUuid !== 'create-new'
    if (isWithRecord) {
      // not updateable and record saved
      if (!field.isUpdateable) {
        return true
      }
    } else {
      // button not invoke (browser/process/report/workflow) without record
      if (field.displayType === BUTTON.id) {
        return true
      }
    }

    // validate parent record and current record
    // record is inactive isReadOnlyFromForm
    if (columnName !== ACTIVE) {
      // is active value of record
      const isActiveRecord = row[ACTIVE]
      if (!convertStringToBoolean(isActiveRecord)) {
        return true
      }
    }
    // Button to process document
    if (columnName === DOCUMENT_ACTION) {
      return false
    }

    // is processed value of record
    const isProcessedRecord = row[PROCESSED]
    if (convertStringToBoolean(isProcessedRecord)) {
      return true
    }

    // is processing value of record
    const isProcessingRecord = row[PROCESSING]
    if (convertStringToBoolean(isProcessingRecord)) {
      return true
    }

    if (field.isAlwaysUpdateable) {
      return false
    }

    /*
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
    */

    // read only with metadata
    return isReadOnlyColumn(field)
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
  setCell: ({ containerUuid, rowIndex, columnName, value }) => {
    return store.commit('setTabCell', {
      containerUuid,
      rowIndex,
      columnName,
      value
    })
  },

  exitEditMode: ({ parentUuid, containerUuid, tableName, recordUuid }) => {
    return store.dispatch('updateRowTableWindows', {
      parentUuid,
      containerUuid,
      tableName,
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
    pageSize,
    pageNumber = 1
  }) => {
    const filters = store.getters.getTabDataFilters({
      parentUuid,
      containerUuid
    })
    store.dispatch('getEntities', {
      parentUuid,
      containerUuid,
      filters,
      pageSize,
      pageNumber
    })
  },
  setSizePage: ({
    parentUuid,
    containerUuid,
    pageNumber = 1,
    pageSize = 15
  }) => {
    const filters = store.getters.getTabDataFilters({
      parentUuid,
      containerUuid
    })
    store.dispatch('getEntities', {
      parentUuid,
      containerUuid,
      filters,
      pageSize,
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

  changeColumnShowedFromUser({ parentUuid, containerUuid, fieldsShowed }) {
    store.dispatch('changeTabColumnShowedFromUser', {
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
    }).then(response => {
      const recordUuid = store.getters.getUuidOfContainer(containerUuid)
      if (isEmptyValue(recordUuid)) {
        // set values on table
        const rowIndex = store.getters.getTabRowIndex({
          containerUuid,
          recordUuid
        })

        if (!isEmptyValue(response.value)) {
          store.commit('setTabCell', {
            parentUuid,
            containerUuid,
            rowIndex,
            columnName,
            value: response.value
          })
        }
        if (!isEmptyValue(response.displayedValue)) {
          store.commit('setTabCell', {
            parentUuid,
            containerUuid,
            rowIndex,
            columnName: DISPLAY_COLUMN_PREFIX + columnName,
            value: response.displayedValue
          })
        }
      }
      return response
    })
  },
  getLookupList({ parentUuid, containerUuid, uuid, id, tableName, contextColumnNames, columnName, searchValue, isAddBlankValue, blankValue }) {
    return store.dispatch('getLookupListFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      fieldUuid: uuid,
      fieldId: id,
      columnName,
      searchValue,
      tableName,
      // app attributes
      isAddBlankValue,
      blankValue
    })
  },
  getSearchInfoList({ parentUuid, containerUuid, contextColumnNames, tableName, columnName, pageNumber, uuid, filters, searchValue, pageSize }) {
    return store.dispatch('searchInfoList', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      fieldUuid: uuid,
      tableName,
      columnName,
      filters,
      searchValue,
      pageNumber,
      pageSize
    })
  },

  getRecordLogs({ tableName, recordId, recordUuid }) {
    return store.dispatch('listRecordLogs', {
      tableName,
      recordId,
      recordUuid
    })
  },

  getListIssues({ tableName, recordId, recordUuid }) {
    return store.dispatch('listRequest', {
      tableName,
      recordId,
      recordUuid
    })
  },

  getAttachment({ tableName, recordId, recordUuid }) {
    return store.dispatch('getAttachmentFromServer', {
      tableName,
      recordId,
      recordUuid
    })
  },
  searchWorkflowHistory({ tableName, recordId, recordUuid, containerUuid }) {
    return store.dispatch('getWorkflowLogsListFromServer', {
      tableName,
      containerUuid,
      recordId,
      recordUuid
    })
  },

  recordNotesTab({ tableName, recordId, recordUuid }) {
    return store.dispatch('listChatEntries', {
      tableName,
      recordId,
      recordUuid
    })
  },
  generalInfoSearch({
    containerUuid,
    parentUuid,
    contextColumnNames,
    filters,
    uuid,
    searchValue,
    tableName,
    columnName,
    pageNumber,
    pageSize
  }) {
    return store.dispatch('findGeneralInfo', {
      containerUuid,
      parentUuid,
      contextColumnNames,
      filters,
      fieldUuid: uuid,
      searchValue,
      tableName,
      columnName,
      pageNumber,
      pageSize
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
  },
  warehouseLocatorSearch({
    containerUuid,
    parentUuid,
    warehouseId,
    contextColumnNames,
    contextAttributesList,
    uuid,
    searchValue,
    // tableName,
    // columnName,
    pageNumber,
    pageSize
  }) {
    return store.dispatch('listWarehouseLocators', {
      containerUuid,
      parentUuid,
      warehouseId,
      contextColumnNames,
      contextAttributesList,
      fieldUuid: uuid,
      searchValue,
      // tableName,
      // columnName,
      pageNumber,
      pageSize
    })
  },

  applyCustomization({
    containerUuid,
    levelType,
    levelId,
    levelUuid,
    fieldAttributes
  }) {
    return requestSaveWindowCustomization({
      tabUuid: containerUuid,
      levelType,
      levelId,
      levelUuid,
      fieldAttributes
    })
  }
}
