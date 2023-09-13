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
  <div class="field-definition">
    <component
      :is="componentRender"
      v-if="inTable"
      :id="id"
      key="is-table-template"
      class="in-table"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :metadata="fieldAttributes"
      :in-table="true"
    />

    <el-col
      v-else-if="!inTable && isDisplayedField"
      key="is-panel-template"
      :xs="sizeField.xs"
      :sm="sizeField.sm"
      :md="sizeField.md"
      :lg="sizeField.lg"
      :xl="sizeField.xl"
    >
      <el-form-item :class="classFrom">
        <template slot="label">
          <field-options
            v-if="!isOnlyField"
            :metadata="fieldAttributes"
            :container-manager="containerManager"
            :record-uuid="recordUuid"
          />
        </template>

        <component
          :is="componentRender"
          :id="id"
          :ref="fieldAttributes.columnName"
          :parent-uuid="parentUuid"
          :container-uuid="containerUuid"
          :container-manager="containerManager"
          :metadata="fieldAttributes"
        />
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import FieldOptions from '@/components/ADempiere/FieldDefinition/FieldOptions/index.vue'

// Constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns'
import { TEXT, DEFAULT_SIZE } from '@/utils/ADempiere/references'
import { MULTIPLE_VALUES_OPERATORS_LIST } from '@/utils/ADempiere/dataUtils'
import { LAYOUT_MAX_COLUMNS_PER_ROW, DEFAULT_COLUMNS_PER_ROW } from '@/utils/ADempiere/componentUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { evalutateTypeField } from '@/utils/ADempiere/dictionaryUtils'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default defineComponent({
  name: 'FieldDefinition',

  components: {
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
    inTable: {
      type: Boolean,
      default: false
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const field = ref(props.metadataField)

    const id = computed(() => {
      if (fieldAttributes.panelType !== 'form') {
        return fieldAttributes.columnName
      }
      return ''
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const classFrom = computed(() => {
      if (['FieldTextLong', 'FieldImage'].includes(field.value.componentPath)) {
        return 'field-text-long'
      }
      if ([TEXT.id].includes(field.value.displayType)) {
        return 'field-text-area'
      }
      return 'field-standard'
    })

    const currentColumnSize = computed(() => {
      return store.getters.getSizeColumn({
        containerUuid: props.containerUuid
      })
    })

    const sizeField = computed(() => {
      if (isEmptyValue(field.value.size)) {
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
      if (DEFAULT_COLUMNS_PER_ROW >= 0 && !isMobile.value) {
        const size = parseInt(LAYOUT_MAX_COLUMNS_PER_ROW / currentColumnSize.value, 10)
        return {
          xs: size,
          sm: size,
          md: size,
          lg: size,
          xl: size
        }
      }
      return {
        // ...field.value.size,
        xs: field.value.size.xs,
        sm: field.value.size.sm,
        md: field.value.size.md,
        lg: field.value.size.lg,
        xl: field.value.size.xl
      }
    })

    // load the component that is indicated in the attributes of received property
    const componentRender = computed(() => {
      if (isEmptyValue(field.value) || isEmptyValue(field.value.componentPath) || !field.value.isSupported) {
        return () => import('@/components/ADempiere/FieldDefinition/FieldText')
      }
      if (isSelectCreated.value) {
        return () => import('@/components/ADempiere/FieldDefinition/FieldSelectMultiple')
      }

      return () => import(`@/components/ADempiere/FieldDefinition/${this.field.componentPath}`)
    })

    const fieldAttributes = computed(() => {
      return {
        ...field.value,
        inTable: props.inTable,
        isAdvancedQuery: props.isAdvancedQuery,
        // DOM properties
        required: isMandatoryField.value,
        readonly: isReadOnlyField.value,
        displayed: isDisplayedField.value,
        disabled: !field.value.isActive,
        isSelectCreated: isSelectCreated.value,
        placeholder: field.value.help ? field.value.help.slice(0, 40) + '...' : ''
      }
    })

    const isDisplayedField = computed(() => {
      if (props.inTable) {
        return true
      }
      // validate with container manager
      if (props.containerManager.isDisplayedField(field.value)) {
        const isDisplayedDefault = props.containerManager.isDisplayedDefault({
          ...field.value,
          isMandatory: isMandatoryField.value
        })
        // madatory. not parent column and without default value to window, mandatory or with default value to others
        if (isDisplayedDefault) {
          return true
        }

        // showed by user
        return field.value.isShowedFromUser
      }
      return false
    })

    /**
     * Idicate if field is read only
     */
    const isReadOnlyField = computed(() => {
      if (props.inTable) {
        // table manage with isReadOnlyColumn method
        // if rendered the component is editable
        return false
      }

      // validate with container manager
      return props.containerManager.isReadOnlyField(field.value)
    })

    const isMandatoryField = computed(() => {
      // validate with container manager
      return props.containerManager.isMandatoryField(field.value)
    })

    const recordUuid = computed(() => {
      // is active record
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        columnName: UUID
      })
    })

    const isSelectCreated = computed(() => {
      return props.isAdvancedQuery &&
        MULTIPLE_VALUES_OPERATORS_LIST.includes(field.value.operator) &&
        !['FieldBinary', 'FieldDate', 'FieldSelect', 'FieldYesNo'].includes(field.value.componentPath)
    })

    const isOnlyField = computed(() => {
      return field.value.isFieldOnly ||
        field.value.componentPath === 'FieldButton'
    })

    function focusField(columnName) {
      // setTimeout(() => {
      //   if (!isMobile.value && field.value.columnName === columnName && !isEmptyValue(this.$refs)) {
      //     if (this.$refs[columnName] && this.$refs[columnName].$refs && this.$refs[columnName].$refs[columnName]) {
      //       this.$refs[columnName].$refs[columnName].focus()
      //     }
      //   }
      // }, 1000)
    }

    // assined field with prop
    if (field.value.isCustomField && !field.value.componentPath) {
      let componentReference = evalutateTypeField(field.value.displayType)
      if (isEmptyValue(componentReference)) {
        componentReference = {
          componentPath: 'FieldText'
        }
      }
      field.value = {
        ...props.metadataField,
        isActive: true,
        isDisplayed: true,
        isDisplayedFromLogic: true,
        isShowedFromUser: true,
        //
        componentPath: componentReference.componentPath
      }
    }

    watch(props.metadataField, (newMetadata) => {
      field.value = newMetadata
    })

    return {
      id,
      isDisplayedField,
      focusField,
      isOnlyField,
      classFrom,
      componentRender,
      field,
      fieldAttributes,
      recordUuid,
      sizeField
    }
  }
})
</script>

<style lang="scss">
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
      max-height: 79px;
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
</style>
