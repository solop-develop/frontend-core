<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/ElsioSanchez
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
    v-if="!shouldHideName(rowData, attributes.code, keyColumn)"
    :style="cellStyle(attributes.code, rowData)"
  >
    <!-- Show cell label -->
    {{ displayLabel(attributes, rowData) }}
    <!-- Show popover only if the row is selected and is parent -->
    <el-popover
      v-if="currentSelectedColumn === attributes.code && rowData.is_parent"
      v-model="show"
      placement="top"
      class="reportInfo"
      style="position: fixed; z-index: 1000; background-color: #fff;"
    >
      <!-- InfoReport component with modal data -->
      <InfoReport
        :data="dataModal"
      />
    </el-popover>
  </span>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'
// Components
import InfoReport from '@/views/ADempiere/ReportViewerEngine/infoReport.vue'
// Utility functions
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isLookup } from '@/utils/ADempiere/references'

export default defineComponent({
  name: 'DataCells',
  components: {
    InfoReport
  },
  props: {
    attributes: {
      type: Object,
      required: true
    },
    rowData: {
      type: Object,
      required: true
    },
    keyColumn: {
      type: Number,
      required: true
    },
    currentSelectedRow: {
      typeof: Object,
      default: null
    },
    currentSelectedColumn: {
      typeof: String,
      default: undefined
    },
    dataModal: {
      type: Object,
      default: null
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // Computed

    const show = computed({
      get() {
        const showValidate = props.currentSelectedRow === props.rowData && props.currentSelectedColumn === props.attributes.code && props.rowData.is_parent
        return props.showDetails && showValidate
      },
      // setter
      set(value) {
        return value
      }
    })

    // Methods

    /**
     * Should Hide Name
     * (Function to determine if cell should be hidden)
     * @param {Object} row
     * @param {String} code
     * @param {Number} columnIndex
     */
    function shouldHideName(row, code, columnIndex) {
      if (columnIndex !== 0) {
        return false
      }
      if (row.level > 1 && row.is_parent) {
        return row.children.some(child => displayLabel(code, child) === displayLabel(code, row))
      }
      return false
    }

    /**
     * Cell Style
     * (Function to obtain the cell style)
     * @param {String} code
     * @param {Object} row
     */
    function cellStyle(code, row) {
      if (isEmptyValue(row.cells[code])) {
        return {}
      }
      const { value } = row.cells[code]
      if (!isEmptyValue(value) && value.type) {
        if (value.type === 'decimal' && value.value < 0) {
          return { color: 'red' }
        }
      }
    }

    /**
     * Display Label
     * (Function to display the cell label)
     * @param {Object} field
     * @param {Object} row
     */
    function displayLabel(field, row) {
      if (isEmptyValue(row.cells)) {
        return
      }
      const rowData = row.cells[field.code]
      if (!isEmptyValue(rowData)) {
        const { display_value, value } = rowData
        if (!isEmptyValue(display_value) || isLookup(field.display_type)) {
          return display_value
        }
        if (!isEmptyValue(value)) {
          return value
        }
      }
    }

    return {
      // Computed
      show,
      // Métodos
      cellStyle,
      displayLabel,
      shouldHideName
    }
  }
})
</script>
