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
import store from '@/store'

// Constants
import { LIST } from '@/utils/ADempiere/references.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

/**
 * For lookup fields with context info
 */
export const infoOptionItem = {
  name: language.t('field.info'),
  enabled: true,
  svg: false,
  icon: 'el-icon-info',
  index: 5,
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/ContextInfo'),
  executeMethod: ({ containerManager, fieldAttributes }) => {}
}

/**
 * For zoom window of the field
 */
export const zoomInOptionItem = {
  name: language.t('page.processActivity.zoomIn'),
  enabled: true,
  svg: false,
  // icon: 'el-icon-files',
  icon: 'el-icon-zoom-in',
  index: 0,
  isRender: false,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/EmptyOption'),
  executeMethod: ({ containerManager, window, fieldAttributes, value, zoom }) => {
    const { parentUuid, containerUuid, reference } = fieldAttributes
    let children
    let zoom_windows = reference.zoom_windows
    if (isEmptyValue(zoom_windows)) {
      zoom_windows = zoom.zoom_windows
    }
    let windowToZoom = window
    if (isEmptyValue(windowToZoom)) {
      const isSOTrx = isSalesTransaction({
        parentUuid,
        containerUuid
      })
      windowToZoom = zoom_windows.find(zoomWindow => {
        // Is Sales Transaction Window or Is Purchase Transaction Window
        return zoomWindow.is_sales_transaction === isSOTrx
      })
      if (isEmptyValue(windowToZoom)) {
        windowToZoom = zoom_windows.at(0)
      }
    }

    let currentValue = value
    let columnName = reference.key_column_name
    if (isEmptyValue(columnName)) {
      columnName = zoom.key_column_name
    }
    columnName = columnName
      .match(/(\.)(\b\w*)/ig)
      .toString()
      .replace('.', '')
    if (isEmptyValue(columnName)) {
      columnName = fieldAttributes.column_name
      // to Smart Browser
      if (isEmptyValue(parentUuid)) {
        columnName = fieldAttributes.element_name
      }
    }

    // TODO: Evaluate reference.key_column_name: AD_Ref_List.Value
    if (fieldAttributes.display_type === LIST.id) {
      columnName = 'AD_Reference_ID'
      // TODO: Direct query is deprecated
      // const valueQuery = reference.directQuery
      //   .match(/AD_Reference_ID=\d+/i)
      //   .toString()
      // value = Number(valueQuery.replace(/[^\d]/g, ''))
      currentValue = reference.id
    }

    if (!isEmptyValue(windowToZoom) && !windowToZoom.is_parent_tab) {
      columnName = zoom.parentTab.key_column
      currentValue = zoom.parentTab.record_id
      children = windowToZoom
    }

    zoomIn({
      attributeValue: `window_${windowToZoom.id}`,
      attributeName: 'containerKey',
      query: {
        [columnName]: currentValue
      },
      params: {
        [columnName]: currentValue,
        children
      }
    })
  }
}

/**
 * For operators in advanced query
 */
export const operatorOptionItem = {
  name: language.t('operators.operator'),
  enabled: true,
  svg: false,
  icon: 'el-icon-rank',
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/ComparisonOperator/'),
  executeMethod: ({ containerManager, fieldAttributes }) => {}
}

/**
 * Only when is translate option
 */
export const translateOptionItem = {
  name: language.t('fieldOptions.translation'),
  enabled: true,
  svg: true,
  icon: 'language',
  index: 4,
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/TranslatedField'),
  executeMethod: ({ containerManager, fieldAttributes }) => {}
}

/**
 * Displayed calculator option in numeric field
 */
export const calculatorOptionItem = {
  name: language.t('field.calculator'),
  enabled: true,
  svg: false,
  icon: 'el-icon-s-operation',
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/CalculatorField'),
  executeMethod: ({ containerManager, fieldAttributes }) => {}
}

export const preferenceValueOptionItem = {
  name: language.t('field.preference'),
  enabled: true,
  svg: false,
  icon: 'el-icon-notebook-2',
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/PreferenceValue'),
  executeMethod: ({ containerManager, fieldAttributes }) => {}
}

export const logsOptionItem = {
  name: language.t('field.logsField'),
  enabled: true,
  svg: true,
  icon: 'tree-table',
  index: 2,
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/ChangeLogs'),
  executeMethod: ({ containerManager, fieldAttributes }) => {
    const { containerUuid, tabTableName, column_name } = fieldAttributes

    const currrentRecord = store.getters.getTabCurrentRow({
      containerUuid
    })
    store.dispatch('findFieldLogs', {
      tableName: tabTableName,
      recordId: currrentRecord[tabTableName + '_ID'],
      recordUuid: currrentRecord.UUID,
      columnName: column_name
    })
  }
}

/**
 * For document status field to workflow
 */
export const documentStatusOptionItem = {
  name: language.t('window.documentStatus'),
  enabled: true,
  svg: false,
  icon: 'el-icon-set-up',
  isRender: true,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/DocumentStatus'),
  executeMethod: ({ containerManager, fieldAttributes }) => {}
}

/**
 * Hide only this field
 */
export const hideThisField = {
  name: language.t('fieldOptions.hideThisField'),
  enabled: true,
  svg: true,
  icon: 'eye',
  index: 3,
  isRender: false,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/EmptyOption'),
  executeMethod: ({ containerManager, fieldAttributes }) => {
    const { parentUuid, containerUuid } = fieldAttributes

    const fieldsList = containerManager.getFieldsList({
      parentUuid,
      containerUuid
    })

    const fieldsListShowed = store.getters.getFieldsListNotMandatory({
      containerUuid,
      fieldsList,
      showedMethod: containerManager.isDisplayedField,
      isTable: fieldAttributes.inTable
    })
      .filter(itemField => {
        return itemField.isShowedFromUser &&
          itemField.column_name !== fieldAttributes.column_name
      }).map(itemField => {
        return itemField.column_name
      })

    containerManager.changeFieldShowedFromUser({
      parentUuid,
      containerUuid,
      fieldsShowed: fieldsListShowed
    })
  }
}

/**
 * Refresh records list of the field
 */
export const refreshLookup = {
  name: language.t('fieldOptions.refresh'),
  enabled: true,
  svg: false,
  icon: 'el-icon-refresh',
  isRender: false,
  index: 1,
  componentRender: () => import('@/components/ADempiere/FieldDefinition/FieldOptions/EmptyOption'),
  executeMethod: ({ containerManager, fieldAttributes, value }) => {
    store.dispatch('deleteLookup', {
      parentUuid: fieldAttributes.parentUuid,
      containerUuid: fieldAttributes.containerUuid,
      contextColumnNames: fieldAttributes.reference.context_column_names,
      contextColumnNamesByDefaultValue: fieldAttributes.context_column_names,
      uuid: fieldAttributes.uuid,
      //
      value
    })
  }
}

export const optionsListStandad = [
  infoOptionItem
  // preferenceValueOptionItem,
  // logsOptionItem
]

export const optionsListAdvancedQuery = [
  infoOptionItem,
  operatorOptionItem
]
