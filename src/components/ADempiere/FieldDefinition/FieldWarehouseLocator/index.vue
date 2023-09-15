<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
    :trigger-on-focus="true"
    :fetch-suggestions="localSearch"
    highlight-first-item
    @clear="clearValues"
    @select="handleSelect"
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
import store from '@/store'

// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'
import ButtonPopover from './button.vue'

// Constants
import { WAREHOUSE } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

export default {
  name: 'FieldWarehouseLocator',

  components: {
    ButtonPopover
  },

  mixins: [
    fieldMixin,
    fieldWithDisplayColumn
  ],

  data() {
    return {
      searchValue: '',
      controlDisplayed: '',
      isLoading: false,
      timeOutSearch: null
    }
  },

  computed: {
    cssClassCustomField() {
      return 'custom-field-warehouse-locator'
    },
    warehouseId() {
      return store.getters.getValueOfField({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        columnName: WAREHOUSE
      })
    }
  },

  beforeMount() {
    if (this.metadata.displayed) {
      this.setDisplayedValue()
    }
  },

  methods: {
    handleSelect(row) {
      this.value = row.id
      this.displayedValue = row.value
      this.uuidValue = row.uuid
    },
    clearValues() {
      // TODO: Clear values into form
      this.value = undefined
      this.displayedValue = undefined
      this.controlDisplayed = undefined

      store.dispatch('clearValuesOnContainer', {
        containerUuid: this.uuidForm
      })
    },
    localSearch(stringToMatch, callBack) {
      clearTimeout(this.timeOutSearch)
      this.timeOutSearch = setTimeout(() => {
        this.remoteSearch(stringToMatch)
          .then(remoteResponse => {
            callBack(remoteResponse)
          })
      }, 1000)
    },
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        const message = {
          message: this.$t('notifications.searchWithOutRecords'),
          type: 'info',
          showClose: true
        }

        let contextAttributesList = []
        if (!isEmptyValue(this.metadata.reference) && !isEmptyValue(this.metadata.reference.contextColumnNames)) {
          contextAttributesList = getContextAttributes({
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            contextColumnNames: this.metadata.reference.contextColumnNames,
            keyName: 'key'
          })
        }

        this.containerManager.warehouseLocatorSearch({
          containerUuid: this.containerUuid,
          contextAttributesList,
          warehouseId: this.warehouseId,
          uuid: this.metadata.uuid,
          searchValue,
          pageNumber: 1
        })
          .then((response) => {
            if (isEmptyValue(response)) {
              this.$message(message)
            }
            resolve(response)
          })
          .catch(error => {
            console.warn(error.message)

            this.$message(message)
            resolve([])
          })
      })
    },

    /**
     * Set displayed value from lookup list or default value
     * @returns
     */
    setDisplayedValue() {
      const value = this.value
      // if empty clear all values
      if (isEmptyValue(value)) {
        this.displayedValue = undefined
        this.uuidValue = undefined
        return
      }

      // find default value
      const storedDefaultValue = this.storedDefaultValue
      if (!isEmptyValue(storedDefaultValue)) {
        if (!isEmptyValue(storedDefaultValue.uuid)) {
          this.uuidValue = storedDefaultValue.uuid
        }
        if (!isEmptyValue(storedDefaultValue.displayedValue)) {
          this.displayedValue = storedDefaultValue.displayedValue
        }
      }

      // with displayed value
      if (!isEmptyValue(this.displayedValue)) {
        return
      }

      // request lookup
      this.getValueOfLookup()
    },
    getValueOfLookup() {
      this.isLoading = true
      this.getDefaultValueFromServer()
        .then(responseLookupItem => {
          // with value response update local component list
          if (!this.isEmptyValue(responseLookupItem)) {
            this.value = responseLookupItem.value
            this.displayedValue = responseLookupItem.displayedValue
            this.uuidValue = responseLookupItem.uuid
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
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
