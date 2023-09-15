<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-dropdown trigger="click" class="columns-display-options" @command="handleCommand">
    <span class="el-dropdown-link">
      <svg-icon icon-class="list" />
    </span>

    <el-dropdown-menu slot="dropdown" style="max-width: 300px;">
      <el-dropdown-item
        :command="{
          command: 'showMinimalistView',
          dispatch: 'selectOption',
          value: $t('table.dataTable.showMinimalistView')
        }"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showMinimalistView'))" />
        {{ $t('table.dataTable.showMinimalistView') }}
      </el-dropdown-item>
      <el-dropdown-item
        :command="{
          dispatch: 'selectOption',
          command: 'showAllColumns',
          value: $t('table.dataTable.showAllColumns')
        }"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showAllColumns'))" />
        {{ $t('table.dataTable.showAllColumns') }}
      </el-dropdown-item>
      <el-dropdown-item
        :command="{
          dispatch: 'selectOption',
          command: 'showOnlyMandatoryColumns',
          value: $t('table.dataTable.showOnlyMandatoryColumns')
        }"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showOnlyMandatoryColumns'))" />
        {{ $t('table.dataTable.showOnlyMandatoryColumns') }}
      </el-dropdown-item>
      <el-dropdown-item
        :command="{
          dispatch: 'selectOption',
          command: 'showTableColumnsOnly',
          value: $t('table.dataTable.showTableColumnsOnly')
        }"
      >
        <svg-icon :icon-class="optionIcon($t('table.dataTable.showTableColumnsOnly'))" />
        {{ $t('table.dataTable.showTableColumnsOnly') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'ColumnsDisplayOption',

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: false
    },
    availableFields: {
      type: Array,
      required: true
    },
    availableFieldsWithValue: {
      type: Array,
      required: true
    },
    filterManager: {
      type: Function,
      default: ({ filterList }) => {}
    },
    fieldsToHidden: {
      type: Function,
      default: ({ filterList }) => { return [] }
    },
    allFieldsList: {
      type: Array,
      required: true
    }
  },

  setup(props) {
    const currentOption = computed(() => {
      return store.getters.getTableOption(props.containerUuid)
    })

    const optionIcon = (icon) => {
      if (icon === currentOption.value) {
        return 'eye-open'
      }
      return 'eye'
    }

    const handleCommand = (options) => {
      const { command, dispatch, value } = options

      // Change Name of Selected Option
      store.dispatch(dispatch, {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        tableOption: value
      })

      // set columns to show/hidden in vuex store
      const fieldsShowed = listDisplay(command)
      // if (isEmptyValue(fieldsShowed)) return

      props.filterManager({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        fieldsShowed,
        fieldsList: props.availableFields
      })
    }

    /**
     * List to Show According to the Selected Option
     * @param {String} option - selected option
     * @param {Array} listShowed - List Show
     * @returns {Array} List of Columns to Show
     */

    function listDisplay(option, listShowed = []) {
      switch (option) {
        case 'showAllColumns':
          listShowed = props.allFieldsList.map(list => {
            return list.columnName
          })
          break
        case 'showOnlyMandatoryColumns':
          listShowed = props.allFieldsList
            .filter(list => list.isMandatory)
            .map(list => list.columnName)
          break
        case 'showTableColumnsOnly':
          listShowed = props.allFieldsList
            .filter(list => list.isDisplayedGrid)
            .map(list => list.columnName)
          break
        case 'showMinimalistView':
          listShowed = props.allFieldsList
            .filter(field => field.isDisplayed && field.isShowedFromUser)
            .map(field => field.columnName)
          break
      }
      return listShowed
    }

    return {
      // Computed
      currentOption,
      // Methods
      handleCommand,
      optionIcon
    }
  }
})
</script>

<style scoped lang="scss">
.columns-display-options {
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 16px;
  /* float: right; */
  padding-left: 5px;
}
</style>
