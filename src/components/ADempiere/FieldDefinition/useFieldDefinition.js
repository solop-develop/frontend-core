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

import { computed, onMounted } from '@vue/composition-api'

import store from '@/store'

// Utils and Helpers Methods
import { getTypeOfValue, isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default function useFieldDefinition({ fieldMetadata, containerManager }) {
  const isMobile = computed(() => {
    return store.state.app.device === 'mobile'
  })

  /**
   * If is auto save after change value
   */
  const autoSave = computed(() => {
    return store.state.settings.autoSave
  })

  /**
   * Is read only field
   */
  const isDisabled = computed(() => {
    return Boolean(fieldMetadata.readonly || fieldMetadata.disabled)
  })

  const isEmptyRequired = computed(() => {
    return isEmptyValue(value.value) && fieldMetadata.required
  })

  const cssClassCustomField = computed(() => {
    return ' '
  })

  const cssClassStyle = computed(() => {
    let styleClass = ''
    if (isEmptyRequired.value) {
      styleClass += ' field-empty-required '
    }

    if (!isEmptyValue(fieldMetadata.cssClassName)) {
      styleClass = fieldMetadata.cssClassName
    }

    styleClass += cssClassCustomField.value

    // return {
    //   [this.cssClassCustomField]: !isEmptyValue(this.cssClassCustomField)
    //   'field-empty-required': isEmptyRequired.value,
    //   [fieldMetadata.cssClassName]: fieldMetadata.cssClassName
    // }
    return styleClass
  })

  /**
   * Commons properties in components fields
   */
  const commonsProperties = computed(() => {
    return {
      class: cssClassStyle.value,
      disabled: isDisabled.value,
      placeholder: fieldMetadata.placeholder,
      readonly: Boolean(fieldMetadata.readonly),
      ref: fieldMetadata.columnName
    }
  })

  const value = computed({
    get() {
      const { columnName, containerUuid, inTable } = fieldMetadata

      // table records values
      if (inTable) {
        // implement container manager row
        if (containerManager && containerManager.getCell) {
          const value = containerManager.getCell({
            containerUuid,
            rowIndex: fieldMetadata.rowIndex,
            columnName
          })
          // types `decimal` and `date` is a object struct
          if ((getTypeOfValue(value) === 'OBJECT') && !isEmptyValue(value.type)) {
            return value.value
          }
          return value
        }
      }

      // main panel values
      const value = store.getters.getValueOfFieldOnContainer({
        parentUuid: fieldMetadata.parentUuid,
        containerUuid,
        columnName
      })
      // types `decimal` and `date` is a object struct
      if ((getTypeOfValue(value) === 'OBJECT') && !isEmptyValue(value.type)) {
        return value.value
      }
      return value
    },
    set(newValue) {
      const { columnName, containerUuid, inTable } = fieldMetadata

      // table records values
      if (inTable) {
        // implement container manager row
        if (containerManager && containerManager.setCell) {
          return containerManager.setCell({
            containerUuid,
            rowIndex: fieldMetadata.rowIndex,
            columnName,
            value: newValue
          })
        }
      }

      store.commit('updateValueOfField', {
        parentUuid: fieldMetadata.parentUuid,
        containerUuid,
        columnName,
        value: newValue
      })
      if (!fieldMetadata.isSameColumnElement) {
        store.commit('updateValueOfField', {
          parentUuid: fieldMetadata.parentUuid,
          containerUuid,
          columnName: fieldMetadata.elementName,
          value: newValue
        })
      }
    }
  })

  const storedDefaultValue = computed(() => {
    return store.getters.getStoredDefaultValue({
      parentUuid: fieldMetadata.parentUuid,
      containerUuid: fieldMetadata.containerUuid,
      contextColumnNames: fieldMetadata.contextColumnNames,
      //
      uuid: fieldMetadata.uuid,
      id: fieldMetadata.id,
      value: value.value
    })
  })

  const displayedValue = computed({
    get() {
    },
    set(newValue) {
    }
  })
  const uuidValue = computed({
    get() {
    },
    set(newValue) {
    }
  })

  /**
   * Parse the value to a new value if required for element-ui component
   * compatibility where this method is overwritten
   * @param {mixed} valueToParsed
   */
  function parseValue(valueToParsed) {
    return valueToParsed
  }

  /**
   * Get default value from server
   * @returns promisse with object = { value, defaultValue, uuid, id }
   */
  function getDefaultValueFromServer() {
    if (containerManager && containerManager.getDefaultValue) {
      return containerManager.getDefaultValue({
        parentUuid: fieldMetadata.parentUuid,
        containerUuid: fieldMetadata.containerUuid,
        contextColumnNames: fieldMetadata.contextColumnNames,
        //
        uuid: fieldMetadata.uuid,
        id: fieldMetadata.id,
        columnName: fieldMetadata.columnName,
        value: value.value
      })
    }

    // return default parsed value
    return Promise.resolve({
      value: parseValue(value.value),
      displayedValue: undefined,
      uuid: undefined
    })
  }

  /**
   * Set focus if handle focus attribute is true
   * TODO: Add support with composition api
   */
  function requestFocus() {
    // if (this.$refs[fieldMetadata.columnName]) {
    //   this.$refs[fieldMetadata.columnName].focus()
    // }
  }

  function focusGained(event) {
    if (fieldMetadata.handleContentSelection) {
      // select all the content inside the text box
      if (!isEmptyValue(event.target.selectionStart) &&
        !isEmptyValue(event.target.selectionStart)) {
        event.target.selectionStart = 0
        event.target.selectionEnd = event.target.value.length
      }
    }
    if (fieldMetadata.handleFocusGained) {
      store.dispatch('notifyFocusGained', {
        containerUuid: fieldMetadata.containerUuid,
        columnName: fieldMetadata.columnName,
        value: event.value
      })
    }
  }

  function focusLost(event) {
    if (fieldMetadata.handleFocusLost) {
      store.dispatch('notifyFocusLost', {
        containerUuid: fieldMetadata.containerUuid,
        columnName: fieldMetadata.columnName,
        value: event.value
      })
    }
  }

  function keyPressed(event) {
    if (fieldMetadata.handleKeyPressed) {
      store.dispatch('notifyKeyPressed', {
        containerUuid: fieldMetadata.containerUuid,
        columnName: fieldMetadata.columnName,
        value: event.key,
        keyCode: event.keyCode
      })
    }
  }

  /**
   * Keyup enter event on DOM element, call this method
   * @param {object} event html
   */
  function actionKeyPerformed(event) {
    if (fieldMetadata.handleActionKeyPerformed) {
      store.dispatch('notifyActionKeyPerformed', {
        containerUuid: fieldMetadata.containerUuid,
        columnName: fieldMetadata.columnName,
        value: event.target.value,
        keyCode: event.keyCode
      })
    }
    // enter key sends the values
    // preHandleChange(event.target.value)
  }

  function keyReleased(event) {
    if (fieldMetadata.handleKeyReleased) {
      store.dispatch('notifyKeyReleased', {
        containerUuid: fieldMetadata.containerUuid,
        columnName: fieldMetadata.columnName,
        value: event.key,
        keyCode: event.keyCode
      })
    }
  }

  /**
   * Active or calling change logics on depends fields
   */
  function activeLogics() {
    let fieldsList = []
    if (containerManager.getFieldsList) {
      fieldsList = containerManager.getFieldsList({
        parentUuid: fieldMetadata.parentUuid,
        containerUuid: fieldMetadata.containerUuid
      })
    }

    store.dispatch('changeDependentFieldsList', {
      field: fieldMetadata,
      fieldsList,
      containerManager
    })
  }

  /**
   * Overwrite component method if necessary
   * validate values before send values to store or server
   * @param {mixed} value
   */
  function preHandleChange(value) {
    handleFieldChange({ value })
  }

  /**
   * @param {mixed} value, main value in component
   * @param {mixed} valueTo, used in end value in range
   * @param {string} displayedValue, or displayColumnName to show in select
   */
  function handleFieldChange({
    value,
    valueTo,
    displayedValue
  }) {
    // Global Action performed
    if (fieldMetadata.handleActionPerformed && autoSave.value) {
      store.dispatch('notifyActionPerformed', {
        containerUuid: fieldMetadata.containerUuid,
        columnName: fieldMetadata.columnName,
        value
      })
      if (!fieldMetadata.isSameColumnElement) {
        store.dispatch('notifyActionPerformed', {
          containerUuid: fieldMetadata.containerUuid,
          columnName: fieldMetadata.elementName,
          value
        })
      }
    }

    // if is custom field, set custom handle change value
    if (fieldMetadata.isCustomField) {
      if (fieldMetadata.isActiveLogics) {
        activeLogics()
      }
      return
    }

    store.dispatch('notifyFieldChange', {
      containerUuid: fieldMetadata.containerUuid,
      containerManager,
      field: fieldMetadata,
      columnName: fieldMetadata.columnName
    })
  }

  async function setDefaultValue() {
    const storedValues = storedDefaultValue.value

    if (!isEmptyValue(storedValues)) {
      // get from server
      const {
        uuid: uuidOfStore,
        value: valueOfStore,
        displayedValue: displayedValueOfStore
      } = storedValues

      // set value into component and fieldValue store
      uuidValue.value = uuidOfStore
      displayedValue.value = displayedValueOfStore
      value.value = parseValue(valueOfStore)
    } else {
      // get from server
      const {
        uuid: uuidOfSserver,
        value: valueOfServer,
        displayedValue: displayedValueOfServer
      } = await this.getDefaultValueFromServer()

      // set value into component and fieldValue store
      uuidValue.value = uuidOfSserver
      displayedValue.value = displayedValueOfServer
      value.value = parseValue(valueOfServer)
    }
  }

  // created hook
  if (fieldMetadata.isGetServerValue && isEmptyValue(value.value)) {
    setDefaultValue()

    // change depends fields
    // preHandleChange(value)
    activeLogics()
  }

  onMounted(() => {
    if (fieldMetadata.handleRequestFocus) {
      requestFocus()
    }
  })

  return {
    // computeds
    commonsProperties,
    value,
    displayedValue,
    storedDefaultValue,
    cssClassStyle,
    isDisabled,
    isEmptyRequired,
    isMobile,
    // methods
    actionKeyPerformed,
    activeLogics,
    focusGained,
    focusLost,
    requestFocus,
    parseValue,
    getDefaultValueFromServer,
    keyPressed,
    keyReleased,
    preHandleChange,
    handleFieldChange
  }
}
