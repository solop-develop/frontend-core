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
  <div v-if="inTable">
    <!-- TODO: This parent div tag is necessary for the edit in table to work -->
    <component
      :is="componentRender"
      :id="field.panelType !== 'form' ? field.columnName : ''"
      key="is-table-template"
      class="in-table"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :metadata="fieldAttributes"
      :in-table="true"
    />
  </div>

  <el-col
    v-else-if="!inTable && (isDisplayedField || isAlwaysDisplayColumn)"
    v-show="isDisplayedField"
    key="is-panel-template"
    :xs="sizeField.xs"
    :sm="sizeField.sm"
    :md="sizeField.md"
    :lg="sizeField.lg"
    :xl="sizeField.xl"
    :class="classPanelCol"
  >
    <div :class="isMobile ? 'field-definition-mobile' : 'field-definition'" :style="styleDraggable">
      <el-form-item :class="classFrom">
        <template slot="label">
          <field-options
            v-if="!isOnlyField"
            :metadata="fieldAttributes"
            :container-manager="containerManager"
            :record-uuid="recordUuid"
          />
        </template>
        <div
          v-if="isOperatior"
          style="display: flex;"
        >
          <component
            :is="componentRender"
            :id="field.panelType !== 'form' ? field.columnName : ''"
            :ref="field.columnName"
            :parent-uuid="parentUuid"
            :container-uuid="containerUuid"
            :container-manager="containerManager"
            :metadata="fieldAttributes"
          />
          <comparison-operator
            :metadata-field="field"
            :container-manager="containerManager"
            :readonly="fieldAttributes.readonly"
            :style="styleOperator"
          />
        </div>
        <component
          :is="componentRender"
          v-else
          :id="field.panelType !== 'form' ? field.columnName : ''"
          :ref="field.columnName"
          :parent-uuid="parentUuid"
          :container-uuid="containerUuid"
          :container-manager="containerManager"
          :metadata="fieldAttributes"
        />
      </el-form-item>
    </div>
  </el-col>
</template>

<script>
import store from '@/store'

// Components and Mixins
import FieldOptions from '@/components/ADempiere/FieldDefinition/FieldOptions/index.vue'
import ComparisonOperator from '@/components/ADempiere/FieldDefinition/FieldOptions/ComparisonOperator'

// Constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns'
import { BUTTON, TEXT, DEFAULT_SIZE } from '@/utils/ADempiere/references'
import { MULTIPLE_VALUES_OPERATORS_LIST } from '@/utils/ADempiere/dataUtils'
import { LAYOUT_MAX_COLUMNS_PER_ROW, DEFAULT_COLUMNS_PER_ROW } from '@/utils/ADempiere/componentUtils'
import { ALWAYS_DISPLAY_COLUMN } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { evalutateTypeField } from '@/utils/ADempiere/dictionaryUtils'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default {
  name: 'FieldDefinition',

  components: {
    ComparisonOperator,
    FieldOptions
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
    // receives the property that is an object with all the attributes
    metadataField: {
      type: Object,
      default: () => ({})
    },
    // inGroup: {
    //   type: Boolean,
    //   default: false
    // },
    inTable: {
      type: Boolean,
      default: false
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    },
    keyField: {
      type: Number,
      default: undefined
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    sizeCol: {
      type: Number,
      default: undefined
    }
  },

  data() {
    return {
      field: {}
    }
  },

  computed: {
    isMobile() {
      return store.state.app.device === 'mobile'
    },
    classFrom() {
      if (['FieldTextLong', 'FieldImage'].includes(this.field.componentPath)) {
        return 'field-text-long'
      }
      if ([TEXT.id].includes(this.field.displayType)) {
        return 'field-text-area'
      }
      return 'field-standard'
    },
    currentColumnSize() {
      return store.getters.getSizeColumn({
        containerUuid: this.containerUuid
      })
    },
    isAlwaysDisplayColumn() {
      return ALWAYS_DISPLAY_COLUMN.includes(this.field.columnName)
    },
    sizeField() {
      if (!this.isEmptyValue(this.sizeCol)) {
        return {
          // ...this.field.size,
          xs: this.sizeCol,
          sm: this.sizeCol,
          md: this.sizeCol,
          lg: this.sizeCol,
          xl: this.sizeCol
        }
      }
      if (!this.field.isCustomField && DEFAULT_COLUMNS_PER_ROW >= 0 && !this.isMobile) {
        const size = parseInt(LAYOUT_MAX_COLUMNS_PER_ROW / this.currentColumnSize, 10)
        return {
          xs: size,
          sm: size,
          md: size,
          lg: size,
          xl: size
        }
      }

      if (isEmptyValue(this.field.size)) {
        const size = 24
        return {
          xs: size,
          sm: size,
          md: size,
          lg: size,
          xl: size,
          ...DEFAULT_SIZE
        }
      }
      return {
        // ...this.field.size,
        xs: this.field.size.xs,
        sm: this.field.size.sm,
        md: this.field.size.md,
        lg: this.field.size.lg,
        xl: this.field.size.xl
      }
    },
    // load the component that is indicated in the attributes of received property
    componentRender() {
      if (isEmptyValue(this.field.componentPath || !this.field.isSupported)) {
        return () => import('@/components/ADempiere/FieldDefinition/FieldText')
      }
      if (this.isSelectCreated) {
        return () => import('@/components/ADempiere/FieldDefinition/FieldSelectMultiple')
      }
      let field
      switch (this.field.componentPath) {
        case 'FieldText':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldText')
          break
        case 'FieldDate':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldDate')
          break
        case 'FieldSearch':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldSearch')
          break
        case 'FieldNumber':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldNumber')
          break
        case 'FieldButton':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldButton')
          break
        case 'FieldYesNo':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldYesNo')
          break
        case 'FieldBinary':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldBinary')
          break
        case 'FieldAutocomplete':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldAutocomplete')
          break
        case 'FieldWarehouseLocator':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldWarehouseLocator')
          break
        case 'FieldSelect':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldSelect')
          break
        case 'FieldImage':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldImage')
          break
        case 'FieldLocationAddress':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress')
          break
        case 'FieldAccountingCombination':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldAccountingCombination')
          break
        case 'FieldTextLong':
          field = () => import('@/components/ADempiere/FieldDefinition/FieldTextLong')
          break
      }
      return field
    },
    fieldAttributes() {
      return {
        ...this.field,
        inTable: this.inTable,
        isAdvancedQuery: this.field.isAdvancedQuery,
        // DOM properties
        required: this.isMandatoryField,
        readonly: this.isReadOnlyField,
        displayed: this.isDisplayedField,
        disabled: !this.field.isActive,
        isSelectCreated: this.isSelectCreated,
        placeholder: this.field.help ? this.field.help.slice(0, 40) + '...' : ''
      }
    },

    isDisplayedField() {
      // is in Table
      if (this.inTable) {
        return this.inTable
      }
      // validate with container manager
      if (this.containerManager.isDisplayedField(this.field)) {
        const isDisplayedDefault = this.containerManager.isDisplayedDefault({
          ...this.field,
          isMandatory: this.isMandatoryField
        })
        // madatory. not parent column and without default value to window, mandatory or with default value to others
        if (isDisplayedDefault) {
          return true
        }

        // showed by user
        return this.field.isShowedFromUser
      }
      return false
    },

    /**
     * Idicate if field is read only
     */
    isReadOnlyField() {
      if (this.inTable) {
        // table manage with isReadOnlyColumn method
        // if rendered the component is editable
        return false
      }

      // validate with container manager
      return this.containerManager.isReadOnlyField(this.field)
    },
    isMandatoryField() {
      // validate with container manager
      return this.containerManager.isMandatoryField(this.field)
    },

    recordUuid() {
      // is active record
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        columnName: UUID
      })
    },

    isSelectCreated() {
      return (this.field.isAdvancedQuery || this.field.isQueryCriteria) &&
        MULTIPLE_VALUES_OPERATORS_LIST.includes(this.field.operator) &&
        !['FieldBinary', 'FieldDate', 'FieldSelect', 'FieldYesNo'].includes(this.field.componentPath)
    },

    isOnlyField() {
      return this.field.isFieldOnly || [BUTTON.id].includes(this.field.displayType)
    },
    currentTab() {
      if (this.isEmptyValue(this.parentUuid) || !this.containerManager.getPanel) {
        return {}
      }
      return this.containerManager.getPanel({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid
      })
    },
    classPanelCol() {
      if (!isEmptyValue(this.containerManager.getPanel)) {
        const panel = this.containerManager.getPanel({
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid
        })
        if (!this.isDraggable) {
          return 'border: 1px solid #fff;border-radius: 5px;'
        }
        if (!isEmptyValue(panel) && panel.isEditSecuence) {
          return 'dragable-field'
        }
      }
      return ''
    },
    styleDraggable() {
      if (this.field.componentPath === 'FieldButton') {
        return 'text-align: center !important;'
      }
      if (!this.isDraggable) {
        return ''
      }
      if (!isEmptyValue(this.field.isChangeSecuence) && this.field.isChangeSecuence) {
        return 'border: 1px solid #a9a9ec;border-radius: 5px;'
      }
      return 'border: 1px solid #fff;border-radius: 5px;'
    },
    isOperatior() {
      const isBrowser = this.$route.meta.type === 'browser'
      const {
        isAdvancedQuery,
        isQueryCriteria
      } = this.field
      if (
        !this.isEmptyValue(isAdvancedQuery) &&
        isAdvancedQuery ||
        (
          isBrowser &&
          isQueryCriteria
        )
      ) return true
      return false
    },
    styleOperator() {
      // if (this.field.componentPath === 'FieldYesNo') return 'padding-left: 80px'
      return ''
    }
  },

  watch: {
    metadataField(value) {
      this.field = value
    }
  },

  created() {
    // assined field with prop
    this.field = this.metadataField
    if (this.field.isCustomField && !this.field.componentPath) {
      let componentReference = evalutateTypeField(this.field.displayType)
      if (isEmptyValue(componentReference)) {
        componentReference = {
          componentPath: 'FieldText'
        }
      }
      this.field = {
        ...this.metadataField,
        isActive: true,
        isDisplayed: true,
        isDisplayedFromLogic: true,
        isShowedFromUser: true,
        //
        componentPath: componentReference.componentPath
      }
    }
  },

  methods: {
    focusField(columnName) {
      const tabPanel = this.$store.getters.getContainerInfo
      setTimeout(() => {
        if (!this.isMobile && this.field.columnName === columnName && !isEmptyValue(this.$refs)) {
          if (
            this.$refs[columnName] &&
            this.$refs[columnName].$refs &&
            this.$refs[columnName].$refs[columnName] &&
            !this.isEmptyValue(tabPanel) &&
            !this.isEmptyValue(tabPanel.currentTab) &&
            tabPanel.id === this.currentTab.id
          ) {
            this.$refs[columnName].$refs[columnName].focus()
          }
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.field-definition-mobile {
  /**
   * Reduce the spacing between the form element and its label
   */
   .el-form-item__label {
    padding-bottom: 0px !important;
  }
}

.field-definition {
  /**
   * Separation between elements (item) of the form
   */
  .field-text-long {
    max-height: 300px;
    min-height: 250px;
  }

  .el-form-item {
    margin-bottom: 12px !important;
    margin-left: 10px;
    margin-right: 10px;
  }

  /**
   * Maximum height to avoid distorting the field list
   */
  .field-standard {
    &:not(.in-table) {
      max-height: 60px;
    }

    .el-form-item__content {
      max-height: 36px !important;
    }
  }

  /*
  .in-table {
    margin-bottom: 0px !important;
    margin-left: 0px;
    margin-right: 0px;
  }
  */

  /**
   * Min height all text area, not into table
   */
  .el-textarea__inner:not(.in-table) {
    min-height: 36px !important;
    // height: 36px auto !important;
    // max-height: 54.2333px !important;
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form-item__label {
    padding-bottom: 0px;
  }

  /*
  .pre-formatted {
    white-space: pre;
  }
  */

  /**
   * Red border in empty mandatory field
   */
  .field-empty-required {
    .el-input__inner,
    .tui-editor-defaultUI,
    .el-textarea__inner {
      border-color: #f55 !important;
    }
  }
}
.dragable-field:active {
  border-radius: 5px;
  border: 3px solid blue;
}
</style>
