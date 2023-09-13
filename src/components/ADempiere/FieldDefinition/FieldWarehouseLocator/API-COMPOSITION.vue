<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-autocomplete
    ref="autocompleteWarehouseLocator"
    v-model="displayedValue"
    v-bind="commonsProperties"
    value-key="value"
    clearable
    :loading="isLoading"
    style="width: 100%;"
    popper-class="custom-field-warehouse-locator"
    :trigger-on-focus="false"
    :fetch-suggestions="localSearch"
    highlight-first-item
    @clear="clearValues"
    @select="setValues"
    @focus="setNewDisplayedValue"
    @blur="setOldDisplayedValue"
  >
    <template slot-scope="recordRow">
      <div class="header">
        <b> {{ recordRow.item.value }} </b>
      </div>
      <span class="info">
        {{ recordRow.item.warehouse.name }}:
        {{ recordRow.item.aisle }} - {{ recordRow.item.bin }} - {{ recordRow.item.level }}
      </span>
    </template>

    <button-popover
      slot="append"
      :parent-metadata="metadata"
      :container-manager="containerManager"
      :is-disabled="isDisabled"
    />
  </el-autocomplete>
</template>

<script>
import {
  defineComponent, ref, computed, onBeforeMount
} from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import ButtonPopover from './button.vue'
import useFieldDefinition from '@/components/ADempiere/FieldDefinition/useFieldDefinition.js'
import useDisplayedColumn from '@/components/ADempiere/FieldDefinition/useDisplayedColumn.js'
import useLocatorWarehouse from './useLocatorWarehouse.js'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

/**
 * TODO: Read only prop (as isDisabled computed) not refresh
 */
export default defineComponent({
  name: 'FieldWarehouseLocator',

  components: {
    ButtonPopover
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const searchValue = ref('')
    const controlDisplayed = ref('')
    const isLoading = ref(false)
    const timeOutSearch = ref(null)

    const {
      commonsProperties,
      isEmptyRequired,
      value,
      storedDefaultValue,
      getDefaultValueFromServer,
      isDisabled
    } = useFieldDefinition({
      containerManager: props.containerManager,
      fieldMetadata: props.metadata
    })

    const {
      uuidValue,
      displayedValue
    } = useDisplayedColumn({
      containerManager: props.containerManager,
      fieldMetadata: props.metadata
    })

    const {
      uuidForm,
      contextAttributesList,
      warehouseId,
      setValues
    } = useLocatorWarehouse({
      parentUuid: props.parentUuid,
      containerUuid: props.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const cssClassStyle = computed(() => {
      let styleClass = ' custom-field-warehouse-locator '
      if (isEmptyRequired.value) {
        styleClass += ' field-empty-required '
      }

      if (!isEmptyValue(props.metadata.cssClassName)) {
        styleClass += props.metadata.cssClassName
      }

      return styleClass
    })

    function clearValues() {
      // TODO: Clear values into form
      value.value = undefined
      displayedValue.value = undefined
      controlDisplayed.value = undefined

      store.dispatch('clearValuesOnContainer', {
        containerUuid: uuidForm.value
      })
    }

    function setNewDisplayedValue() {
      const displayValue = displayedValue.value
      if (!isSameValues(controlDisplayed.value, displayValue)) {
        controlDisplayed.value = displayValue
      }
    }
    function setOldDisplayedValue() {
      if (!isSameValues(controlDisplayed.value, displayedValue.value)) {
        displayedValue.value = controlDisplayed.value
      }
    }

    function localSearch(stringToMatch, callBack) {
      clearTimeout(timeOutSearch.value)
      timeOutSearch.value = setTimeout(() => {
        remoteSearch(stringToMatch)
          .then(remoteResponse => {
            callBack(remoteResponse)
          })
      }, 1000)
    }

    function remoteSearch(searchValue) {
      return new Promise(resolve => {
        const message = {
          message: lang.t('notifications.searchWithOutRecords'),
          type: 'info'
        }

        // store.dispatch('listWarehouseLocators', {
        props.containerManager.warehouseLocatorSearch({
          containerUuid: props.containerUuid,
          contextAttributesList: contextAttributesList.value,
          warehouseId: warehouseId.value,
          uuid: props.metadata.uuid,
          searchValue,
          pageNumber: 1
        })
          .then((response) => {
            // const recordsList = this.metadata.loadAll
            if (isEmptyValue(response)) {
              showMessage(message)
            }
            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'warn',
              message: error.message
            })
            resolve([])
          })
      })
    }

    /**
     * Set displayed value from lookup list or default value
     * @returns
     */
    function setDisplayedValue() {
      // if empty clear all values
      if (isEmptyValue(value.value)) {
        displayedValue.value = undefined
        uuidValue.value = undefined
        return
      }

      // find default value
      const currentStoredDefaultValue = storedDefaultValue.value
      if (!isEmptyValue(currentStoredDefaultValue)) {
        if (!isEmptyValue(currentStoredDefaultValue.uuid)) {
          uuidValue.value = currentStoredDefaultValue.uuid
        }
        if (!isEmptyValue(currentStoredDefaultValue.displayedValue)) {
          displayedValue.value = currentStoredDefaultValue.displayedValue
        }
      }

      // with displayed value
      if (!isEmptyValue(displayedValue.value)) {
        return
      }

      // request lookup
      getValueOfLookup()
    }

    function getValueOfLookup() {
      isLoading.value = true
      getDefaultValueFromServer()
        .then(responseLookupItem => {
          // with value response update local component list
          if (!isEmptyValue(responseLookupItem)) {
            value.value = responseLookupItem.value
            displayedValue.value = responseLookupItem.displayedValue
            uuidValue.value = responseLookupItem.uuid
          }
        })
        .finally(() => {
          isLoading.value = false
        })
    }

    onBeforeMount(() => {
      if (props.metadata.displayed) {
        setDisplayedValue()
      }
    })

    return {
      // Refs
      searchValue,
      controlDisplayed,
      isLoading,
      timeOutSearch,
      // Computeds
      value,
      displayedValue,
      isDisabled,
      // Methods
      commonsProperties,
      cssClassStyle,
      clearValues,
      setValues,
      setNewDisplayedValue,
      setOldDisplayedValue,
      localSearch,
      remoteSearch
    }
  }
})
</script>

<style lang="scss">
.product-attribute-popover {
  margin: 0px;
  padding: 0px;
}

.custom-field-warehouse-locator {
  // items of lust
  li {
    line-height: normal;
    // padding: 15px;
    padding-bottom: 5px;
    padding-top: 5px;

    .header {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .info {
      color: #7e7e7e;
      float: left;
      font-size: 12px;
    }
  }
}
</style>
