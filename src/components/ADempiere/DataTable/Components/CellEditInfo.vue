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
  <span
    v-if="isRowChangeEdited"
    key="field-component"
  >
    <field-definition
      key="field-definition"
      v-shortkey="shortkey"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :is-data-table="true"
      :is-show-label="false"
      :in-table="true"
      :metadata-field="{
        ...fieldAttributes,
        rowIndex: scope.$index,
        recordUuid: dataRow.UUID
      }"
      size="mini"
      @shortkey="keyboardShortcuts"
    />
  </span>

  <cell-display-info
    v-else
    key="info-value"
    :class="cellCssClass"
    :field-attributes="fieldAttributes"
    :data-row="dataRow"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// Components and Mixins
import CellDisplayInfo from '@/components/ADempiere/DataTable/Components/CellDisplayInfo.vue'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// Constants
import { BINARY_DATA, IMAGE } from '@/utils/ADempiere/references'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'CellEditInfo',

  components: {
    CellDisplayInfo,
    FieldDefinition
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
    fieldAttributes: {
      type: Object,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    scope: {
      type: Object,
      default: () => {}
    },
    dataRow: {
      type: Object,
      default: () => {}
    },
    tableName: {
      type: String,
      default: () => ''
    }
  },

  setup(props) {
    const isReadOnly = computed(() => {
      return props.containerManager.isReadOnlyColumn({
        field: props.fieldAttributes,
        row: props.dataRow
      })
    })

    const shortkey = computed(() => {
      return {
        send: ['ctrl', 'enter'],
        exit: ['esc']
      }
    })

    const isRowChangeEdited = computed(() => {
      if ([BINARY_DATA.id, IMAGE.id].includes(props.fieldAttributes.displayType)) {
        return false
      }
      if (props.dataRow.isEditRow && !isReadOnly.value) {
        return props.dataRow.isEditRow
      }
      if (!isEmptyValue(props.parentUuid)) {
        return false
      }
      if (!props.dataRow.isSelectedRow) {
        return false
      }
      if (props.dataRow.isEditRow && !isReadOnly.value) {
        return true
      }
      return false
    })

    const cellTable = computed(() => {
      return props.dataRow
    })

    /**
     * Css class style
     */
    const cellCssClass = computed(() => {
      let classCss = ' cell-info-edit '
      if (isReadOnly.value) {
        classCss += ' cell-no-edit '
      }
      return classCss
    })

    function isRowCanBeEdited(record) {
      if (!record.isSelectedRow) {
        return false
      }
      if (!isReadOnly.value) {
        return false
      }
      return record.isEditRow
    }

    function exitEdit(record) {
      record.isEditRow = !record.isEditRow
    }

    function enterEdit(record) {
      record.isEditRow = !record.isEditRow
      props.containerManager.exitEditMode({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        tableName: props.tableName,
        recordUuid: record.UUID
      })
    }

    function keyboardShortcuts(event) {
      switch (event.srcKey) {
        case 'exit':
          exitEdit(props.dataRow)
          break

        case 'send':
        default:
          enterEdit(props.dataRow)
          break
      }
    }

    return {
      // computeds
      cellCssClass,
      cellTable,
      isRowChangeEdited,
      // methods
      isRowCanBeEdited,
      exitEdit,
      enterEdit,
      keyboardShortcuts,
      shortkey
    }
  }
})
</script>

<style lang="scss">
.cell-info-edit {
  width: 100%;
  display: inline-block;
}

// style in cursor if cell is no edit
.cell-no-edit {
  cursor: not-allowed !important;
}
</style>
