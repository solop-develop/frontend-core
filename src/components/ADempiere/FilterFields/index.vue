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
  <el-row
    v-if="!isMobile && isFilterRecords"
    id="panelOptionsBar"
    class="panel-options-bar"
  >

    <span
      id="RightPanelFieldOptions"
      :class="isClassOptions"
    >
      <el-select
        v-model="fieldsListShowed"
        :filterable="!isMobile"
        :placeholder="$t('components.filterableItems')"
        multiple
        collapse-tags
        value-key="key"
        :size="size"
        :popper-append-to-body="true"
        style="min-width: 295px;max-width: 300px;"
      >
        <el-option
          v-for="(item, key) in fieldsListAvailable"
          :key="key"
          :label="item.name"
          :value="item.columnName"
        />
      </el-select>

      <columns-display-option
        v-if="inTable"
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
        :filter-manager="filterManager"
        :showed-fields="fieldsListShowed"
        :available-fields="fieldsListAvailable"
        :all-fields-list="fieldsList"
        :fields-to-hidden="fieldsToHidden"
        :available-fields-with-value="fieldsListAvailableWithValue"
      />
      <fields-display-option
        v-else
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
        :available-fields="fieldsListAvailable"
        :available-fields-with-value="fieldsListAvailableWithValue"
        :showed-fields="fieldsListShowed"
        :filter-manager="filterManager"
        :container-manager="containerManager"
        :new-fields-list-secuence="newFieldsListSecuence"
        :fields-customization="fieldsCustomization"
      />
    </span>
  </el-row>
  <el-row
    v-else-if="!isMobile"
    id="panelOptionsBar"
    class="panel-options-bar"
  >

    <span
      id="RightPanelFieldOptions"
      :class="isClassOptions"
    >
      <el-select
        v-model="fieldsListShowed"
        :filterable="!isMobile"
        :placeholder="$t('components.filterableItems')"
        multiple
        collapse-tags
        value-key="key"
        :size="size"
        :popper-append-to-body="true"
        style="min-width: 295px;max-width: 300px;"
      >
        <el-option
          v-for="(item, key) in fieldsListAvailable"
          :key="key"
          :label="item.name"
          :value="item.columnName"
        />
      </el-select>

      <columns-display-option
        v-if="inTable"
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
        :filter-manager="filterManager"
        :showed-fields="fieldsListShowed"
        :available-fields="fieldsListAvailable"
        :all-fields-list="fieldsList"
        :fields-to-hidden="fieldsToHidden"
        :available-fields-with-value="fieldsListAvailableWithValue"
      />
      <fields-display-option
        v-else
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
        :available-fields="fieldsListAvailable"
        :available-fields-with-value="fieldsListAvailableWithValue"
        :showed-fields="fieldsListShowed"
        :filter-manager="filterManager"
        :container-manager="containerManager"
        :new-fields-list-secuence="newFieldsListSecuence"
        :fields-customization="fieldsCustomization"
      />
    </span>
  </el-row>

  <el-row v-else :gutter="20">
    <span
      id="RightPanelFieldOptionsMobile"
      :class="isClassOptions"
    >
      <el-select
        v-model="fieldsListShowed"
        :filterable="!isMobile"
        :placeholder="$t('components.filterableItems')"
        multiple
        collapse-tags
        value-key="key"
        :size="size"
        :popper-append-to-body="true"
        :style="panelType ? 'width: 91%;' : 'min-width: 295px;max-width: 300px;'"
      >
        <el-option
          v-for="(item, key) in fieldsListAvailable"
          :key="key"
          :label="item.name"
          :value="item.columnName"
        />
      </el-select>

      <columns-display-option
        v-if="inTable"
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
      />
      <fields-display-option
        v-else
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
        :available-fields="fieldsListAvailable"
        :available-fields-with-value="fieldsListAvailableWithValue"
        :showed-fields="fieldsListShowed"
        :filter-manager="filterManager"
        :container-manager="containerManager"
        :new-fields-list-secuence="newFieldsListSecuence"
        :fields-customization="fieldsCustomization"
      />
    </span>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Components and Mixins
import AdvancedTabQuery from '@/components/ADempiere/TabManager/AdvancedTabQuery.vue'
import ColumnsDisplayOption from '@/components/ADempiere/DataTable/Components/ColumnsDisplayOption.vue'
import FieldsDisplayOption from './fieldsDisplayOptions.vue'

export default defineComponent({
  name: 'FilterFields',

  components: {
    AdvancedTabQuery,
    ColumnsDisplayOption,
    FieldsDisplayOption
  },

  props: {
    parentUuid: {
      type: [String, Number],
      default: undefined
    },
    containerUuid: {
      type: [String, Number],
      required: true
    },
    groupField: {
      type: String,
      default: ''
    },
    fieldsList: {
      type: Array,
      default: () => []
    },
    fieldsCustomization: {
      type: Array,
      default: () => []
    },
    filterManager: {
      type: Function,
      default: ({ filterList }) => { return true }
    },
    fieldsToHidden: {
      type: Function,
      default: ({ filterList }) => { return [] }
    },
    // isDisplayedField or isDisplayedColumn
    showedManager: {
      type: Function,
      default: (field) => {}
    },
    /**
     * If is used in table, by default false
     */
    inTable: {
      type: Boolean,
      default: false
    },
    isFilterRecords: {
      type: Boolean,
      default: false
    },
    containerManager: {
      type: Object,
      required: false
    },
    newFieldsListSecuence: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    const size = 'small'
    const cssClass = computed(() => {
      if (props.inTable) {
        return 'form-filter-columns'
      }
      return 'form-filter-fields'
    })

    const panelType = computed(() => {
      const currentRoute = router.app.$route
      return currentRoute.meta.type === 'window'
    })

    const isClassOptions = computed(() => {
      const { isShowedTableRecords } = store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      )
      if (!panelType) return 'float: right;'
      if (isShowedTableRecords) {
        if (isDocumentTab.value) {
          return 'right-panel-field-options-table-mobile'
        }
        return 'right-panel-field-options-table-mobile'
      }
      if (isDocumentTab.value) {
        return 'right-panel-field-options-mobile'
      }
      if (isMobile.value) {
        return 'right-panel-field-options-mobile'
      }
      return 'right-panel-field-options'
    })

    const showedAttibute = computed(() => {
      if (props.inTable) {
        return 'isShowedTableFromUser'
      }
      return 'isShowedFromUser'
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const isDocumentTab = computed(() => {
      const { isDocument, isParentTab } = store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      )
      return isDocument && isParentTab
    })

    const fieldsListAvailable = computed(() => {
      /*
      if (!props.inTable && props.panelType === 'window' && !isEmptyValue(props.groupField)) {
        // compare group fields to window
        return store.getters.getFieldsListNotMandatory({
          containerUuid: props.containerUuid,
          fieldsList: props.fieldsList
        })
          .filter(fieldItem => {
            return fieldItem.groupAssigned === props.groupField
          })
      }
      */
      // get fields not mandatory
      return props.fieldsToHidden({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        fieldsList: props.fieldsList,
        showedMethod: props.showedManager,
        isTable: props.inTable
      }) || []
    })

    const fieldsListAvailableWithValue = computed(() => {
      if (props.inTable) {
        return []
      }
      // get fields not mandatory with default value
      return props.fieldsToHidden({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        fieldsList: fieldsListAvailable.value,
        isEvaluateDefaultValue: true,
        showedMethod: props.showedManager,
        isTable: props.inTable
      }) || []
    })

    // fields showed
    const fieldsListShowed = computed({
      get() {
        return fieldsListAvailable.value.filter(itemField => {
          return itemField[showedAttibute.value]
        }).map(itemField => {
          return itemField.columnName
        })
      },
      set(selecteds) {
        // set columns to show/hidden in vuex store
        changeShowed(selecteds)
      }
    })

    /**
     * Set fields/columns to hidden/showed in panel/table
     * if is advanced query or browser panel with values or null/not null
     * operator, dispatch search
     * @param {array} selectedValues
     */
    const changeShowed = (selectedValues) => {
      props.filterManager({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        fieldsShowed: selectedValues,
        fieldsList: fieldsListAvailable.value
      })
    }

    return {
      // Computeds
      cssClass,
      isMobile,
      size,
      fieldsListShowed,
      fieldsListAvailable,
      fieldsListAvailableWithValue,
      showedAttibute,
      isClassOptions,
      isDocumentTab,
      panelType,
      // methods
      changeShowed
    }
  }
})
</script>

<style lang="scss" scoped>
// Filter Fields
.form-filter-fields {
  .el-form-item {
    display: flex;
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;

    >.el-form-item__content {
      display: contents !important;
    }
  }
}

.form-filter-columns {
  margin: 0px;
}
</style>
<style lang="scss">
// Filter Fields
.form-filter-fields {
  .el-form-item {
    >.el-form-item__content {
      display: contents !important;
    }
  }
}
/*
.form-filter-fields {
  .el-tag--small {
    max-width: 132px !important;
  }

  // text tag
  .el-tag {
    &.el-tag--info {
      &.el-tag--small {
        &.el-tag--light  {
          // max-width: calc(100% - 10px);
          &:first-child {
            .el-select__tags-text {
              max-width: calc(100% - 15px);
            }
          }
        }
      }
    }
  }
  .el-select__tags-text {
    width: 100%;
    overflow: hidden !important;
    white-space: nowrap;
    text-overflow: ellipsis !important; // ... end text
    display: inline-block;
  }

  // icon X close tag
  .el-select i.el-tag__close {
    &.el-tag__close {
      // left: 58%;
      // margin-top: 0px !important;
      // top: 0 !important;
      color: #FFF !important;
      // position: absolute !important;
      position: relative !important;
      top: -7 !important;
    }
  }
}
*/
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/**
- Style Bar Option
└──> Left Panel Search Options
└──> Right Panel Field Options
*/
.panel-options-bar {
  width: 100% !important;
  // display: flex;
  text-align: right;
}
.left-panel-search-options {
  width: inherit;
}
.right-panel-field-options-table {
  position: absolute;
  right: 8px;
  margin-top: 5px;
  display: block;
}
.right-panel-field-options-table-mobile {
  display: block;
  margin-left: 10px;
  padding: 0px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.right-panel-field-options {
  display: block;
  margin-bottom: 10px;
}
.right-panel-field-options-mobile {
  display: block;
  margin-left: 10px;
  padding: 0px;
  margin-bottom: 10px;
}
</style>
