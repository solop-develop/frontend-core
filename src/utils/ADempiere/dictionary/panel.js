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

// Constants
import { IS_ADVANCED_QUERY } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generateField } from '@/utils/ADempiere/dictionaryUtils.js'
import { getFieldTemplate } from '@/utils/ADempiere/lookupFactory.js'
import { isAddRangeField } from '@/utils/ADempiere/references'
import { templateFields } from '@/utils/ADempiere/dictionary/window/templatesWindow.js'
/**
 * Order the fields, then assign the groups to each field, and finally group
 * in an array according to each field group to show in panel (or table).
 * @param {array} fieldsList
 * @param {string} orderBy sequence, sort_no, seq_no_grid
 * @param {string} type asc | desc
 * @returns {array}
 */
export function sortFields({
  fieldsList,
  orderBy = 'sequence',
  type = 'asc'
}) {
  // ascending order
  let orderMethod = (itemA, itemB) => {
    return itemA[orderBy] - itemB[orderBy]
    // return itemA[orderBy] > itemB[orderBy]
  }

  if (type.toLowerCase() === 'desc') {
    // descending order
    orderMethod = (itemA, itemB) => {
      return itemA[orderBy] + itemB[orderBy]
      // return itemA[orderBy] < itemB[orderBy]
    }
  }

  return fieldsList.sort(orderMethod)
}

/**
 * [assignedGroup]
 * @param {array} fieldsList List of fields
 * @param {string} groupToAssigned group assing to fields
 * @param {string} orderBy sequence, sort_no, seq_no_grid
 * @return {array} fieldsList
 */
export function assignedGroup({
  fieldsList,
  groupToAssigned,
  orderBy
}) {
  if (isEmptyValue(fieldsList)) {
    return fieldsList
  }

  fieldsList = sortFields({
    fieldsList,
    orderBy
  })

  let firstChangeGroup = false
  let currentGroup = ''
  let typeGroup = ''

  fieldsList.forEach(fieldElement => {
    if (fieldElement.panelType !== 'window') {
      fieldElement.groupAssigned = ''
      fieldElement.typeGroupAssigned = ''
      return
    }

    // change the first field group, change the band
    if (!firstChangeGroup) {
      if (!isEmptyValue(fieldElement.fieldGroup.name) &&
        currentGroup !== fieldElement.fieldGroup.name &&
        fieldElement.is_displayed) {
        firstChangeGroup = true
      }
    }
    //  if you change the field group for the first time and it is different
    //  from 0, updates the field group, since it is another field group and
    //  assigns the following field items to the current field group whose
    //  field group is '' or null
    if (firstChangeGroup) {
      if (!isEmptyValue(fieldElement.fieldGroup.name)) {
        currentGroup = fieldElement.fieldGroup.name
        typeGroup = fieldElement.fieldGroup.fieldGroupType
      }
    }

    fieldElement.groupAssigned = currentGroup
    fieldElement.typeGroupAssigned = typeGroup

    if (groupToAssigned !== undefined) {
      fieldElement.groupAssigned = groupToAssigned
    }
  })

  return fieldsList
}

/**
 * Generate panel
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {object} panelMetadata
 * @param {boolean} isAddFieldUuid
 * @param {boolean} isAddLinkColumn
 * @param {object} fieldOverwrite
 * @returns
 */
export function generatePanelAndFields({
  parentUuid,
  containerUuid,
  panelMetadata = {},
  isAddFieldUuid = false,
  isAddLinkColumn = false,
  fieldOverwrite = {},
  sortField = 'sequence', // sequence, sort_no, seq_no_grid,
  evaluateDefaultFieldShowed,
  evaluateDefaultColumnShowed
}) {
  const fieldAdditionalAttributes = {
    parentUuid,
    containerUuid,
    // tab attributes
    tabTableName: panelMetadata.table_name,
    panelName: panelMetadata.name,
    // app attributes
    isShowedFromUser: true,
    isReadOnlyFromForm: false,
    isAdvancedQuery: containerUuid.includes(IS_ADVANCED_QUERY),
    ...fieldOverwrite
  }

  const fieldsRangeList = []
  let identifierColumns = []

  let keyColumn

  // convert fields and add app attributes
  let fieldsList = panelMetadata.fields.map((fieldItem, index) => {
    const fieldDefinition = generateField({
      fieldToGenerate: templateFields(fieldItem),
      evaluateDefaultFieldShowed,
      evaluateDefaultColumnShowed,
      moreAttributes: {
        ...fieldAdditionalAttributes,
        fieldsListIndex: index
      }
    })
    const { column_name, componentPath } = fieldDefinition

    if (fieldDefinition.is_key) {
      keyColumn = column_name
    }
    if (fieldDefinition.is_identifier) {
      identifierColumns.push({
        name: fieldDefinition.name,
        columnName: column_name,
        displayColumnName: fieldDefinition.displayColumnName,
        identifierSequence: fieldDefinition.identifierSequence,
        display_type: fieldDefinition.display_type,
        componentPath
      })
    }

    // Add new field if is range number
    if (isAddRangeField(fieldDefinition)) {
      const fieldRange = generateField({
        fieldToGenerate: fieldItem,
        evaluateDefaultFieldShowed,
        evaluateDefaultColumnShowed,
        moreAttributes: fieldAdditionalAttributes,
        typeRange: true
      })

      fieldsRangeList.push(fieldRange)
    }

    return fieldDefinition
  })

  if (!isEmptyValue(fieldsRangeList)) {
    fieldsList = fieldsList.concat(fieldsRangeList)
  }

  // get from server
  // fieldsList = generateDependenFieldsList(fieldsList)

  identifierColumns = sortFields({
    fieldsList: identifierColumns,
    orderBy: 'identifierSequence'
  })

  let fieldLinkColumnName
  if (isAddLinkColumn) {
    // parent link column name
    fieldLinkColumnName = fieldsList.find(fieldItem => {
      return fieldItem.is_parent
    })
    if (fieldLinkColumnName) {
      fieldLinkColumnName = fieldLinkColumnName.column_name
    }
  }

  if (isAddFieldUuid) {
    // indicates it contains the uuid field
    const isWithUuidField = fieldsList.some(fieldItem => {
      return fieldItem.column_name === 'UUID'
    })
    // add field uuid column name
    if (!isWithUuidField) {
      const fieldUuid = getFieldTemplate({
        ...fieldAdditionalAttributes,
        fieldsListIndex: fieldsList.length,
        isShowedFromUser: false,
        name: 'UUID',
        columnName: 'UUID',
        componentPath: 'FieldText'
      })

      fieldsList.push(fieldUuid)
    }
  }

  fieldsList = sortFields({
    fieldsList,
    orderBy: sortField
  })

  // panel for save on store
  const panel = {
    ...panelMetadata,
    parentUuid,
    containerUuid,
    fieldLinkColumnName,
    fieldsList,
    // app attributes
    keyColumn,
    sortOrderColumnName: sortField,
    identifierColumns,
    isLoadedFieldsList: true,
    isShowedTotals: false,
    isEditSecuence: false
  }

  // delete unused and dupicated property with 'fieldsList'
  delete panel.fields

  return panel
}

/**
 * Get dependent fields on all elemnets
 * TODO: Improve performance and reduce array cycles
 * TODO: Add dependents on all tabs to window container
 * @param {array} fieldsList
 * @returns {array}
 */
export function generateDependenFieldsList(fieldsList) {
  fieldsList.forEach((itemField, index, listFields) => {
    if (isEmptyValue(itemField.parentFieldsList)) {
      return
    }

    itemField.parentFieldsList.forEach(itemParentColumnName => {
      const parentField = listFields.find(parentFieldItem => {
        return (itemParentColumnName === parentFieldItem.column_name ||
          itemParentColumnName === parentFieldItem.element_name)
      })

      if (isEmptyValue(parentField)) {
        return
      }

      // set and remove duplicates columnNames
      parentField.dependent_fields = [
        ...new Set([
          itemField.column_name,
          ...parentField.dependent_fields
        ])
      ]
    })
  })

  return fieldsList
}

export function panelAdvanceQuery({
  parentUuid,
  containerUuid,
  tabPanel
}) {
  const tabAdvancedQuery = {
    ...tabPanel,
    parentUuid: parentUuid + IS_ADVANCED_QUERY,
    containerUuid: containerUuid + IS_ADVANCED_QUERY,
    fieldsList: tabPanel.fieldsList.map(field => {
      return generateField({
        fieldToGenerate: {
          ...field,
          parentUuid: field.parentUuid + IS_ADVANCED_QUERY,
          containerUuid: field.containerUuid + IS_ADVANCED_QUERY
        },
        moreAttributes: {
          isAdvancedQuery: true
        },
        evaluateDefaultFieldShowed: ({ is_selection_column }) => {
          return is_selection_column
        }
      })
    }),
    uuid: tabPanel.uuid + IS_ADVANCED_QUERY
  }
  return tabAdvancedQuery
}
