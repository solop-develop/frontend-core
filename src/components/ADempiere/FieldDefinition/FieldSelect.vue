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
  <el-select
    :key="componentKey"
    v-model="value"
    v-bind="commonsProperties"
    :filterable="isFiltrable"
    :loading="isLoading"
    value-key="value"
    clearable
    :multiple="isSelectMultiple"
    :allow-create="metadata.isSelectCreated"
    :collapse-tags="!isSelectMultiple"
    remote
    :remote-method="remoteSearch"
    @change="preHandleChange"
    @visible-change="getDataLookupList"
    @clear="clearLookup"
  >
    <el-option
      v-for="(option, key) in optionsList"
      :key="key"
      :value="option.value"
      :label="option.displayedValue"
    />
  </el-select>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'
import selectMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinFieldSelect.js'

// Constants
import { LIST } from '@/utils/ADempiere/references'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * This component is a lookup type field, use as a replacement for fields:
 * - Reference List
 * - Table List
 * - Table Direct
 *
 * TODO: String values add single quotation marks 'value' (see removeQuotationMark)
 * TODO: No includes default value into list on forms or field with dynamic validation (see default value City on location form)
 */
export default {
  name: 'FieldSelect',

  mixins: [
    fieldMixin,
    fieldWithDisplayColumn,
    selectMixin
  ],

  data() {
    return {
      componentKey: 0
    }
  },

  computed: {
    cssClassCustomField() {
      let styleClass = ' custom-field-select '
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple '
      }
      return styleClass
    },

    isFiltrable() {
      if (this.isMobile) {
        if (LIST.id === this.metadata.displayType) {
          return false
        }
      }
      return true
    },

    isWithSearchValue() {
      return Boolean(
        this.$store.getters.getStoredSearchValueLookup({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          contextColumnNames: this.metadata.contextColumnNames,
          uuid: this.metadata.uuid
        })
      )
    },

    value: {
      get() {
        const { columnName, containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            return this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
          }
        }

        return this.$store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(value) {
        const { columnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName,
              value
            })
          }
        }

        const option = this.findOption(value)
        // always update uuid
        this.uuidValue = option.uuid

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName,
          value
        })
        // update element column name
        if (!this.metadata.isSameColumnElement) {
          this.$store.commit('updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName: this.metadata.elementName,
            value
          })
        }
      }
    },
    currentTab() {
      if (isEmptyValue(this.metadata.parentUuid) || !this.containerManager.getPanel) {
        return {}
      }
      return this.containerManager.getPanel({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid
      })
    },
    currentRecord() {
      return this.$store.getters.getTabCurrentRow({
        containerUuid: this.metadata.containerUuid
      })
    }
  },

  watch: {
    isSelectMultiple(isMultiple) {
      let value = this.value
      if (isMultiple) {
        const valueInArray = []
        if (!isEmptyValue(value)) {
          valueInArray.push(value)
        }
        value = valueInArray
      } else {
        if (Array.isArray(value)) {
          if (value.length) {
            // set first value
            value = value.at(0)
          } else {
            value = this.blankOption.value
          }
        }
      }
      this.value = value
    },
    'metadata.displayed': {
      handler(value) {
        if (value || this.isAlwaysDisplayColumn) {
          this.setDisplayedValue()
        }
      },
      deep: true,
      immediate: true
    },
    value(newValue) {
      if (isEmptyValue(newValue)) {
        this.displayedValue = undefined
        this.uuidValue = undefined
        return
      }

      this.setDisplayedValue()
    }
  },

  beforeMount() {
    if (this.metadata.displayed || this.isAlwaysDisplayColumn) {
      this.setDisplayedValue()
    }
  },

  methods: {
    forceRerender() {
      this.componentKey += 1
    },
    preHandleChange(value) {
      const { displayedValue } = this.findOption(value)
      this.displayedValue = displayedValue
      this.handleFieldChange({
        value,
        displayedValue
      })
    },
    findOption(value) {
      // const option = this.optionsList.find(item => item.value === value)
      const option = this.getStoredLookupAll.find(item => item.value === value)
      if (option && option.displayedValue) {
        return option
      }
      return {
        displayedValue: undefined,
        value: undefined,
        uuid: undefined
      }
    },
    setDisplayedValue() {
      const value = this.value
      // if empty clear all values
      if (isEmptyValue(value)) {
        this.displayedValue = undefined
        this.uuidValue = undefined
        return
      }

      this.optionsList = this.getStoredLookupAll
      this.forceRerender()

      // find local list value
      const option = this.findOption(value)
      if (!isEmptyValue(option.uuid)) {
        this.uuidValue = option.uuid
      }
      if (!isEmptyValue(option.displayedValue)) {
        this.displayedValue = option.displayedValue
        return
      }

      // add to list if no exist (with callouts, table record)
      // const displayedValue = this.displayedValue
      // if (!isEmptyValue(displayedValue)) {
      //   // verify if exists to add (in table)
      //   this.optionsList.push({
      //     value,
      //     uuid: option.uuid,
      //     displayedValue
      //   })
      //   return
      // }

      // request displayed value
      this.getValueOfLookup()
    },

    // TODO: With remote and filter is enabled not working displayed value
    // https://github.com/ElemeFE/element/issues/20706
    // https://github.com/ElemeFE/element/issues/21287
    // https://github.com/ElemeFE/element/issues/21465
    getValueOfLookup() {
      if (this.isSelectMultiple) {
        return
      }
      this.isLoading = true

      this.displayedValue = undefined
      this.uuidValue = undefined
      // this.setDefaultValue()
      this.getDefaultValueFromServer()
        .then(responseLookupItem => {
          // with value response update local component list
          if (!isEmptyValue(responseLookupItem) && !isEmptyValue(responseLookupItem.value)) {
            this.value = responseLookupItem.value
            this.displayedValue = responseLookupItem.displayedValue
            this.uuidValue = responseLookupItem.uuid
          }
        })
        .finally(() => {
          this.optionsList = this.getStoredLookupAll
          this.forceRerender()

          this.isLoading = false
        })
    },
    /**
     * @param {boolean} isShowList triggers when the pull-down menu appears or disappears
     */
    getDataLookupList(isShowList) {
      // establish
      this.setContainerInformation()
      // get stored list and refresh local component
      this.optionsList = this.getStoredLookupAll

      if (isShowList) {
        const listLookups = this.getStoredLookupList
        if (isEmptyValue(listLookups) || this.isWithSearchValue) {
          this.loadListFromServer()
        } else if (listLookups.length === 1) {
          const firstOption = listLookups.at(0)
          if (firstOption && this.blankValues.includes(firstOption.value)) {
            this.loadListFromServer()
          }
        }
      }
    },
    remoteSearch(searchQuery = '') {
      const results = this.localSearch(searchQuery)
      if (isEmptyValue(searchQuery) ||
        (!isEmptyValue(searchQuery) && (isEmptyValue(results) || results.length < 3))) {
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() => {
          this.loadListFromServer(searchQuery)
        }, 500)
        return
      }
      // use this, if remote is enabled, local search not working
      this.optionsList = results
    },
    localSearch(searchQuery = '') {
      if (isEmptyValue(searchQuery)) {
        return this.optionsList
      }
      return this.optionsList.filter(option => {
        return option.displayedValue.toLowerCase().includes(searchQuery.toLowerCase())
      })
    },
    loadListFromServer(searchQuery = '') {
      this.isLoading = true

      this.containerManager.getLookupList({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.reference.contextColumnNames,
        uuid: this.metadata.uuid,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName,
        columnUuid: this.metadata.columnUuid,
        searchValue: searchQuery,
        referenceUuid: this.metadata.reference.uuid,
        // app attributes
        isAddBlankValue: !this.metadata.required,
        blankValue: this.blankOption.value
      })
        .then(responseLookupList => {
          if (!isEmptyValue(responseLookupList)) {
            this.optionsList = responseLookupList
          } else {
            this.optionsList = this.getStoredLookupAll
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearLookup() {
      this.$store.dispatch('deleteLookup', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.reference.contextColumnNames,
        contextColumnNamesByDefaultValue: this.metadata.contextColumnNames,
        uuid: this.metadata.uuid,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName,
        value: this.value
      })
        .then(() => {
          // set empty list and empty option
          this.optionsList = [
            this.blankOption
          ]

          // set empty value
          this.value = this.blankOption.value
        })
    },
    setContainerInformation() {
      if (!isEmptyValue(this.currentTab)) {
        this.$store.dispatch('panelInfo', {
          currentTab: this.currentTab,
          currentRecord: this.currentRecord
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .custom-field-select {
    width: 100%;
  }

  .custom-field-select-multiple {
    overflow: auto;
    max-height: 100px;
    .el-select__tags {
      max-height: 100px;
    }
  }
</style>
