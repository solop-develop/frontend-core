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

// Utils and Helper Methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import evaluator from '@/utils/ADempiere/contextUtils/evaluator'
import { getContext, isSalesTransaction, parseContext } from '@/utils/ADempiere/contextUtils'
import { fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils.js'
import { assignedGroup } from '@/utils/ADempiere/dictionary/panel'
import { isLookup } from '@/utils/ADempiere/references'

const actions = {
  addPanel({ commit, dispatch, getters }, params) {
    const {
      panelType,
      // isParentTab,
      // parentUuid,
      isSetDefaultValues = true,
      uuid: containerUuid
    } = params
    let keyColumn = ''
    let selectionColumn = []
    let identifierColumns = []
    let count = 0

    if (params.fieldsList) {
      params.fieldsList.forEach((itemField, index, listFields) => {
        if (itemField.is_key) {
          keyColumn = itemField.column_name
        }
        if (itemField.is_selection_column) {
          selectionColumn.push(itemField.column_name)
        }
        if (itemField.is_identifier) {
          identifierColumns.push({
            name: itemField.name,
            columnName: itemField.column_name,
            displayColumnName: itemField.displayColumnName,
            identifierSequence: itemField.identifierSequence,
            display_type: itemField.display_type,
            componentPath: itemField.componentPath
          })
        }
        if (panelType === 'table' || params.isAdvancedQuery) {
          itemField.isShowedFromUser = false
          if (count < 2 && itemField.is_selection_column && itemField.sequence >= 10) {
            itemField.isShowedFromUser = true
            count++
          }
        }
        //  For all
        if (['browser', 'process', 'report', 'form', 'table'].includes(panelType) ||
          (panelType === 'window' && params.isParentTab)) {
          // TODO: Verity with updateValueOfField, setContext, setPreferenceContext
          // commit('updateValueOfField', {
          //   parentUuid,
          //   containerUuid,
          //   // isOverWriteParent: Boolean(isParentTab),
          //   columnName: itemField.column_name,
          //   value: itemField.value
          // })
        }
        //  Get dependent fields
        if (!isEmptyValue(itemField.parentFieldsList)) {
          itemField.parentFieldsList.forEach(itemParentColumnName => {
            const parentField = listFields.find(parentFieldItem => {
              return parentFieldItem.column_name === itemParentColumnName &&
                itemParentColumnName !== itemField.column_name
            })
            if (parentField) {
              parentField.dependent_fields.push(itemField.column_name)
            }
          })
        }
      })

      let orderBy = 'sequence'
      if ((panelType === 'window' && !params.isParentTab) || panelType === 'browser') {
        orderBy = 'seq_no_grid'
      }
      params.fieldsList = assignedGroup({
        fieldsList: params.fieldsList,
        orderBy
      })
    }

    params.keyColumn = keyColumn
    if (params.is_sort_tab) {
      const panelParent = getters.getPanel(params.tabAssociatedUuid)
      selectionColumn = selectionColumn.concat(panelParent.selectionColumn)
      identifierColumns = identifierColumns.concat(panelParent.identifierColumns)
      params.fieldLinkColumnName = panelParent.fieldLinkColumnName
      params.keyColumn = panelParent.keyColumn
    }
    params.selectionColumn = selectionColumn
    params.identifierColumns = identifierColumns
      .sort((itemA, itemB) => {
        return itemA.identifierSequence - itemB.identifierSequence
      })

    params.recordUuid = null
    // show/hidden optionals columns to table
    params.isShowedTableOptionalColumns = false

    commit('addPanel', params)

    if (isSetDefaultValues) {
      dispatch('setDefaultValues', {
        parentUuid: params.parentUuid,
        containerUuid,
        // isOverWriteParent: Boolean(isParentTab),
        panelType
      })
    }
    if (params.isCustomForm) {
      dispatch('addForm', params)
    }

    return params
  },

  /**
   * Change some attribute boolean from fields in panel
   * @param {string}  containerUuid
   * @param {string}  fieldsList
   * @param {string}  attribute
   * @param {boolean} valueAttribute
   * @param {array}   fieldsIncludes fields to set valueAttribute
   * @param {array}   fieldsExcludes fields to dont change
   */
  changeFieldAttributesBoolean({ commit, getters }, {
    containerUuid,
    attribute,
    valueAttribute,
    fieldsIncludes = [],
    fieldsExcludes = []
  }) {
    const panel = getters.getPanel(containerUuid)
    if (isEmptyValue(panel)) {
      // panel is with prop, not stored in vuex
      return
    }

    const fieldsList = panel.fieldsList.map(itemField => {
      const { column_name } = itemField

      // not change exlude field
      if (!isEmptyValue(fieldsExcludes) && fieldsExcludes.includes(column_name)) {
        return itemField
      }
      // if it field is included to change value
      if (!isEmptyValue(fieldsIncludes) && fieldsIncludes.includes(column_name)) {
        itemField[attribute] = valueAttribute
        return itemField
      }
      // changed current value by opposite set value
      itemField[attribute] = !valueAttribute
      return itemField
    })

    commit('changePanelAttribute', {
      panel,
      attributeName: 'fieldsList',
      attributeValue: fieldsList
    })
  },
  /**
   * @param {string}  containerUuid
   * @param {array}   fieldsList
   */
  showOnlyMandatoryColumns({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }
    const fieldsIncludes = []
    fieldsList.forEach(fieldItem => {
      const isMandatoryGenerated = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
      if (isMandatoryGenerated) {
        fieldsIncludes.push(fieldItem.column_name)
      }
    })

    dispatch('changeFieldAttributesBoolean', {
      containerUuid,
      fieldsIncludes,
      attribute: 'isShowedTableFromUser',
      valueAttribute: true
    })
  },

  /**
   * Show all columns in table
   * TODO: Add show fields in panel
   * @param {string}  containerUuid
   * @param {array}   fieldsList
   */
  showAllAvailableColumns({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }

    const fieldsIncludes = []
    fieldsList.forEach(fieldItem => {
      if (fieldIsDisplayed(fieldItem, true)) {
        fieldsIncludes.push(fieldItem.column_name)
      }
    })

    dispatch('changeFieldAttributesBoolean', {
      containerUuid,
      fieldsIncludes,
      attribute: 'isShowedTableFromUser',
      valueAttribute: true
    })
  },

  /**
   * Set default values to panel
   * @param {string}  parentUuid
   * @param {string}  containerUuid
   * @param {string}  panelType
   * @param {boolean} isNewRecord
   * @param {array}   fieldsList
   * TODO: Evaluate if it is necessary to parse the default values
   */
  setDefaultValues({ commit, dispatch, getters }, {
    parentUuid,
    containerUuid,
    isOverWriteParent = true,
    isNewRecord = false
  }) {
    return new Promise(resolve => {
      const panel = getters.getPanel(containerUuid)
      if (isEmptyValue(panel)) {
        resolve()
        return
      }

      const isSalesTransactionContext = isSalesTransaction({
        parentUuid,
        containerUuid,
        isRecord: false
      })
      const defaultAttributes = getters.getParsedDefaultValues({
        parentUuid,
        containerUuid,
        isSOTrxDictionary: isSalesTransactionContext,
        fieldsList: panel.fieldsList
      })

      defaultAttributes.forEach(attribute => {
        commit('addChangeToPersistenceQueue', {
          ...attribute,
          containerUuid
        })
      })

      dispatch('updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        isOverWriteParent,
        attributes: defaultAttributes
      })
        .then(() => {
          // const windowPanel = (itemField) => {
          //   if (!itemField.isAdvancedQuery || itemField.isActiveLogics) {
          //     // enable edit fields in panel
          //     commit('changeFieldAttribure', {
          //       attributeName: 'isReadOnlyFromForm',
          //       field: itemField,
          //       attributeValue: false
          //     })
          //   }
          // }

          // const othersPanel = (itemField) => {
          //   if (!itemField.isAdvancedQuery || itemField.isActiveLogics) {
          //     // enable edit fields in panel
          //     commit('changeFieldAttribure', {
          //       attributeName: 'isReadOnlyFromForm',
          //       field: itemField,
          //       attributeValue: false
          //     })

          //     // Change Dependents
          //     dispatch('changeDependentFieldsList', {
          //       field: itemField
          //     })
          //   }
          //   // if (itemField.isShowedFromUserDefault || !isEmptyValue(itemField.value)) {
          //   //   fieldsUser.push(itemField.column_name)
          //   // }
          // }
          // panel.fieldsList.forEach(execute)
        })

      resolve(defaultAttributes)
    })
  },

  // Change all values of panel and dispatch actions for each field
  notifyPanelChange({ dispatch, getters }, {
    parentUuid,
    containerUuid,
    attributes = [],
    isOverWriteParent
  }) {
    if (getTypeOfValue(attributes) === 'OBJECT') {
      attributes = convertObjectToKeyValue({
        object: attributes
      })
    }
    // Update field
    dispatch('updateValuesOfContainer', {
      parentUuid,
      containerUuid,
      attributes,
      isOverWriteParent
    })
      .then(() => {
        // Nothing for now
      })
  },
  /**
   * Handle all trigger for a field:
   * - Display Logic
   * - Mandatory Logic
   * - Read Only Logic
   * - Action for Custom panel from type
  */
  notifyFieldChange({ dispatch, getters }, {
    parentUuid,
    containerUuid,
    containerManager,
    columnName,
    field,
    newValue
  }) {
    return new Promise(resolve => {
      // get field
      let fieldsList = []
      if (isEmptyValue(field)) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
        field = fieldsList.find(fieldItem => fieldItem.column_name === columnName)
      }
      if (containerManager.getFieldsList && !isEmptyValue(field.parentUuid)) {
        fieldsList = containerManager.getFieldsList({
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid
        })
      }

      if (isEmptyValue(field)) {
        field = fieldsList.find(fieldItem => fieldItem.column_name === columnName)
        if (isEmptyValue(field)) {
          console.warn('notifyFieldChange: Field not found ', columnName)
          return
        }
      }

      let value
      if (isEmptyValue(newValue)) {
        value = getters.getValueOfField({
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          columnName: field.column_name
        })
      } else {
        value = newValue
      }
      const tableName = isEmptyValue(field.tableName) ? field.tabTableName : field.tableName
      resolve({
        tableName,
        field,
        value
      })
      if (!(containerManager && containerManager.actionPerformed)) {
        return
      }
      // Run specific action
      // const recordUuid = router.app._route.query.action
      const recordUuid = getters.getUuidOfContainer(field.containerUuid)
      containerManager.actionPerformed({
        containerUuid: field.containerUuid,
        field,
        columnName,
        value,
        recordUuid
      })
        .then(response => {
          if (response) {
            dispatch('notifyPanelChange', {
              containerUuid: field.containerUuid,
              columnName: field.column_name,
              attributes: response.attributes
            })
          }
        })
        .catch(error => {
          console.warn(`${field.name} ActionPerformed error: ${error.message}.`)
        })
        .finally(() => {
          // TODO: Duplicated with actionPerformed
          // Change Dependents
          // dispatch('changeDependentFieldsList', {
          //   field,
          //   fieldsList,
          //   containerManager
          // })
        })
    })
  },

  /**
   * Change dependent fields (default value, logics displayed, mandatory and read only)
   * @param {object} field, definition and attributes
   * @param {array} fieldsList, list of fields
   * @param {object} containerManager, logic implement by panel type
   * TODO: Not working with fields generated on lookupFactory
   */
  changeDependentFieldsList({ commit, getters, dispatch }, {
    field,
    fieldsList,
    isGetDefaultValue = true,
    containerManager
  }) {
    const { parentUuid, dependent_fields } = field
    if (isEmptyValue(dependent_fields)) {
      // breaks if there are no field dependencies
      return
    }

    // Get all fields
    if (isEmptyValue(fieldsList)) {
      if (containerManager && containerManager.getFieldsList) {
        fieldsList = containerManager.getFieldsList({
          parentUuid,
          containerUuid: field.containerUuid
        })
      } else {
        // TODO: Legacy implementation
        // @deprecated replace with container manager
        fieldsList = getters.getFieldsListFromPanel(field.containerUuid)
      }
    }

    // Iterate for change logic
    dependent_fields.map(async fieldDependentDefinition => {
      let containerName, containerUuid, columnName
      let fieldId = -1
      // old implementation (used on forms)
      if (getTypeOfValue(fieldDependentDefinition) === 'String') {
        columnName = fieldDependentDefinition
        containerUuid = field.containerUuid
      } else {
        // new implementation
        fieldId = fieldDependentDefinition.id
        columnName = fieldDependentDefinition.column_name
        containerUuid = fieldDependentDefinition.parent_uuid
        containerName = fieldDependentDefinition.parent_name
      }

      // Get all fields on different container
      let currentFieldsList = fieldsList
      if (!field.isCustomForm && containerManager && containerManager.getFieldsList && containerUuid !== field.containerUuid) {
        // is other tab
        currentFieldsList = containerManager.getFieldsList({
          parentUuid,
          containerUuid
        })
      }
      if (isEmptyValue(currentFieldsList)) {
        console.warn('fieldsList not found in vuex store', {
          parentUuid,
          parent_column_name: field.column_name,
          parentContainerName: field.panelName,
          parentContainerUuid: field.containerUuid,
          dependentColumnName: columnName,
          dependentContainerName: containerName,
          dependentContainerUuid: containerUuid
        })
        return
      }
      // TODO: Improve peformance get field with key-value
      const storedFieldDependentsList = currentFieldsList.filter(fieldItem => {
        if (!isEmptyValue(fieldId)) {
          return fieldId === fieldItem.id
        }
        return columnName === fieldItem.column_name ||
          columnName === fieldItem.element_name
      })

      if (isEmptyValue(storedFieldDependentsList)) {
        console.warn('field not found in vuex store', {
          parentUuid,
          parent_column_name: field.column_name,
          parentContainerName: field.panelName,
          parentContainerUuid: field.containerUuid,
          dependentColumnName: columnName,
          dependentContainerName: containerName,
          dependentContainerUuid: containerUuid
        })
        return
      } else {
        if (storedFieldDependentsList.length > 1) {
          console.warn(
            'multiple same column name field in vuex store',
            field.columnName,
            storedFieldDependentsList.map(i => {
              return {
                id: i.id,
                columnName: i.column_name,
                name: i.name
              }
            })
          )
        }
      }
      // TODO: Each elements
      const storedFieldDependent = storedFieldDependentsList.at(0)

      //  isDisplayed Logic
      let isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic
      if (!isEmptyValue(storedFieldDependent.display_logic)) {
        isDisplayedFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid,
          containerUuid,
          logic: storedFieldDependent.display_logic
        })
      }
      //  Mandatory Logic
      if (!isEmptyValue(storedFieldDependent.mandatory_logic)) {
        isMandatoryFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid,
          containerUuid,
          logic: storedFieldDependent.mandatory_logic
        })
      }
      //  Read Only Logic
      if (!isEmptyValue(storedFieldDependent.read_only_logic)) {
        isReadOnlyFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid,
          containerUuid,
          logic: storedFieldDependent.read_only_logic
        })
      }

      // default value
      const { parsedDefaultValue } = await dispatch('changeDefaultLogic', {
        parentUuid,
        containerUuid,
        containerManager,
        field: storedFieldDependent,
        isGetDefaultValue
      })

      commit('changeFieldLogic', {
        field: storedFieldDependent,
        isDisplayedFromLogic,
        isMandatoryFromLogic,
        isReadOnlyFromLogic,
        parsedDefaultValue: parsedDefaultValue
      })
    })
  },

  changeDefaultLogic({ commit, rootGetters }, {
    parentUuid,
    containerUuid,
    field,
    isGetDefaultValue = true,
    containerManager
  }) {
    return new Promise(resolve => {
      const { column_name } = field
      const resolveValues = {
        value: undefined,
        defaultValue: undefined,
        displayedValue: undefined
      }

      let defaultValue, newValue, displayedValue

      if (isEmptyValue(field.default_value)) {
        resolve(resolveValues)
        return
      }

      // default value without sql
      if (field.default_value.includes('@') && !field.default_value.startsWith('@SQL=')) {
        defaultValue = parseContext({
          parentUuid,
          containerUuid,
          value: field.default_value
        }).value
        resolveValues.defaultValue = defaultValue
        resolve(resolveValues)
        return
      }

      // default value with sql
      if (!isGetDefaultValue || !field.default_value.startsWith('@SQL=')) {
        resolve(resolveValues)
        return
      }

      defaultValue = parseContext({
        parentUuid,
        containerUuid,
        isSQL: true,
        value: field.default_value
      }).query

      newValue = rootGetters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName: column_name
      })
      if (!isEmptyValue(newValue)) {
        displayedValue = rootGetters.getValueOfField({
          containerUuid,
          columnName: field.displayColumnName
        })
      } else {
        const {
          value: valueByServer,
          displayedValue: displayedValueByServer
        } = containerManager.getDefaultValue({
          parentUuid,
          containerUuid,
          contextColumnNames: field.contextColumnNames,
          uuid: field.uuid,
          id: field.id,
          columnName: column_name,
          defaultValue: field.default_value
        })

        displayedValue = displayedValueByServer
        newValue = valueByServer
      }

      // update values for field
      commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: column_name,
        value: newValue
      })
      // update values for field on elememnt name of column
      if (!field.isSameColumnElement) {
        commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          columnName: field.element_name,
          value: newValue
        })
      }
      // update displayed value for field
      if (isLookup(field.display_type)) {
        commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          columnName: field.displayColumnName,
          value: displayedValue
        })
      }

      resolve({
        value: newValue,
        defaultValue,
        displayedValue
      })
    })
  },

  getPanelAndFields({ dispatch }, {
    parentUuid,
    containerUuid,
    panelType,
    panelMetadata,
    routeToDelete,
    isAdvancedQuery = false
  }) {
    let executeAction
    switch (panelType) {
      case 'process':
      case 'report':
        executeAction = 'getProcessFromServer'
        break
      case 'browser':
        executeAction = 'getBrowserFromServer'
        break
      case 'form':
        executeAction = 'getFormFromServer'
        break
      case 'window':
      case 'table':
      default:
        executeAction = 'getFieldsFromTab'
        break
      case 'workflow':
        executeAction = 'getWorkflowFromServer'
        break
    }

    return dispatch(executeAction, {
      parentUuid,
      containerUuid,
      panelType,
      panelMetadata,
      isAdvancedQuery,
      routeToDelete
    })
      .then(panelResponse => {
        return panelResponse
      })
      .catch(error => {
        return {
          ...error,
          moreInfo: `Dictionary getPanelAndFields ${panelType} (State Panel).`
        }
      })
  },
  changePanelAttributesBoolean({ commit, getters }, {
    containerUuid,
    attributeName,
    attributeValue
  }) {
    const panel = getters.getPanel(containerUuid)
    if (isEmptyValue(attributeValue)) {
      attributeValue = !panel[attributeName]
    }

    commit('changePanelAttribute', {
      panel,
      attributeName,
      attributeValue
    })
  },
  /**
   * Change a attribute in field state
   * @param {string} containerUuid
   * @param {string} columnName
   * @param {object} field
   * @param {string} attributeName
   * @param {mixed}  attributeValue
   */
  changeFieldAttribure({ commit, getters }, {
    containerUuid,
    columnName,
    field,
    attributeName,
    attributeValue
  }) {
    if (isEmptyValue(field)) {
      field = getters.getFieldFromColumnName({
        containerUuid,
        columnName
      })
    }
    if (isEmptyValue(field)) {
      console.warn('field is Empty')
      return
    }

    commit('changeFieldAttribure', {
      field,
      attributeName,
      attributeValue
    })
  },
  dictionaryResetCache({ commit }) {
    commit('dictionaryResetCache')
    commit('dictionaryResetCacheContext')
    commit('dictionaryResetCacheContextMenu')
    commit('dictionaryResetCacheWindow')
    commit('dictionaryResetCacheProcess')
    commit('dictionaryResetCacheBrowser')
  }
}

export default actions
