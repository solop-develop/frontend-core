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
  <el-dropdown
    size="small"
    plain
    :split-button="true"
    type="primary"
    :class="{ 'comparison-operator-container': true, 'without-defualt-action': true, 'disabled-operators': readonly }"
    trigger="click"
    :disabled="readonly"
    @command="handleOperator"
  >
    {{ $t('operators.' + currentOperatorValue) }}
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(operator, index) in operatorList"
        :key="index"
        :command="operator"
        :class="{ 'is-current': operator === currentOperatorValue}"
        :disabled="isDisableOperator(operator)"
      >
        {{ $t('operators.' + operator) }} a
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import store from '@/store'

import {
  defineComponent,
  computed
} from '@vue/composition-api'

// Constants
import {
  FIELD_OPERATORS_LIST, IGNORE_VALUE_OPERATORS_LIST
} from '@/utils/ADempiere/dataUtils'

export default defineComponent({
  name: 'ComparisonOperator',

  props: {
    metadataField: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    containerManager: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    /**
     * Computed
     */
    const currentOperatorValue = computed(() => {
      return props.metadataField.operator
    })
    const operatorList = computed(() => {
      const isComparisonField = !['FieldBinary', 'FieldButton', 'FieldImage'].includes(props.metadataField.componentPath)
      if (isComparisonField) {
        const operatorsField = FIELD_OPERATORS_LIST.find(item => {
          return item.componentPath === props.metadataField.componentPath
        })
        if (operatorsField) {
          return operatorsField.operatorsList
        }
      }

      return props.metadataField.operatorsList
    })

    /**
     * Methods
     */
    function handleOperator(operator) {
      const {
        columnName,
        containerUuid,
        parentUuid
      } = props.metadataField
      store.commit('updateValueOfField', {
        containerUuid,
        columnName,
        value: null
      })
      store.dispatch('changeFieldAttribure', {
        containerUuid,
        columnName,
        attributeName: 'operator',
        attributeValue: operator,
        field: props.metadataField
      })

      store.dispatch('notifyFieldChange', {
        parentUuid,
        containerUuid,
        containerManager: props.containerManager,
        field: props.metadataField,
        columnName,
        newValue: undefined
      })
    }

    function isDisableOperator(operator) {
      if (props.metadataField.isMandatory) {
        return IGNORE_VALUE_OPERATORS_LIST.includes(operator)
      }
      return false
    }

    return {
      // Computed
      currentOperatorValue,
      operatorList,
      // Methods
      handleOperator,
      isDisableOperator
    }
  }
})
</script>

<style lang="scss">
.comparison-operator-container {
  &.without-defualt-action {
    .el-button {
      padding-left: 5px;
      padding-right: 8px;
    }
  }

  .el-dropdown-menu__item {
    &.is-current {
      font-weight: bold;
      color: #1890ff;
    }
  }

  .el-button-group {
    // light blue style of the first section of the menu button
    // >.el-button::first-child {
    >.el-button:not(:last-child) {
      :not(.without-defualt-action) {
        min-width: 105px;
      }
      font-weight: bold;
      // margin-right: -1px;
      color: #0080ff;
      border-color: #0080ff;
      background: #F5F7FA;

      &.is-disabled {
        font-weight: bold;
        color: #868889;
        border-color: #929699;
        &:hover {
          font-weight: bold;
          color: #868889;
          border-color: #929699;
          background: #F5F7FA;
        }
      }
    }

    // light blue style of the drop down menu section
    .el-button--primary:last-child {
      // margin-right: 2px;
      color: #0080ff;
      border-color: #0080ff;
      background: #e6f1fd;
      border-left-color: #000000 !important;

      &.is-disabled {
        font-weight: bold;
        color: #868889;
        border-color: #929699;
        background: #F5F7FA;
      }
    }

    // dark blue style when pointing to the menu
    .el-button--primary:hover {
      background: #1890ff;
      border-color: #1890ff;
      color: #FFFFFF;
      background: #F5F7FA;

      &.is-disabled {
        font-weight: bold;
        color: #868889;
        border-color: #929699;
        background: #F5F7FA;
      }
    }
  }
}
</style>
