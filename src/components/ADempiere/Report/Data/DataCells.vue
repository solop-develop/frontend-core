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
    :style="cellStyle(attributes.code, rowData)"
  >
    <!-- Show cell label -->
    <el-dropdown
      v-if="!isEmptyValue(attributes.column_name)"
      :style="styleFont(attributes)"
      trigger="click"
      @visible-change="loadZoom"
      @command="zoomInWindow"
    >
      <span class="el-dropdown-link">
        {{ displayLabel(attributes, rowData) }}
      </span>
      <el-dropdown-menu
        v-if="isLoaded"
        slot="dropdown"
      >
        <el-dropdown-item>
          <i class="el-icon-loading" />
        </el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu v-else slot="dropdown">
        <el-dropdown-item
          v-for="(zoom, key) in rowData.zoom_windows"
          :key="key"
          :command="zoom"
        >
          <i class="el-icon-zoom-in" style="font-weight: bolder;" />
          <b>
            {{ $t('page.processActivity.zoomIn') }} {{ ' - ' + zoom.name + ' ( ' + displayLabel(attributes, rowData) + ' )' }}
          </b>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span v-else>
      {{ displayLabel(attributes, rowData) }}
    </span>
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
  computed,
  ref
} from '@vue/composition-api'
// Components
import InfoReport from '@/views/ADempiere/ReportViewerEngine/infoReport.vue'
// Utility functions
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isLookup } from '@/utils/ADempiere/references'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
// Api
import { listZoomWindowsRequest } from '@//api/ADempiere/fields/zoom.js'

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
    },
    tableName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // Ref
    const isLoaded = ref(false)
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
     */
    function shouldHideName(row) {
      if (row.is_parent && row.isTopLevel) {
        return true
      }
      if (!row.is_parent) {
        return true
      }
      return false
    }
    function styleFont(font) {
      let fontStyle = ''
      if (!isEmptyValue(font.color)) {
        fontStyle += `color: ${font.color} !important;`
      }
      if (isEmptyValue(font.font_code)) {
        fontStyle += 'font-size: 10px !important'
      }
      if (!isEmptyValue(font.font_code)) {
        const lastIndex = font.font_code.lastIndexOf('-')
        const fontFamily = font.font_code.substr(0, lastIndex)
        const fontSize = font.font_code.substr(lastIndex + 1)
        fontStyle += `font-family: ${fontFamily} !important; font-size: ${fontSize}px !important;`
      }
      return fontStyle
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
        const { display_value, value: currentValue } = rowData
        if (!isEmptyValue(display_value) || isLookup(field.display_type)) {
          return display_value
        }
        if (!isEmptyValue(currentValue)) {
          if (!isEmptyValue(currentValue.value)) {
            return currentValue.value
          }
          return currentValue
        }
      }
    }

    function loadZoom(show) {
      if (
        !show ||
        isEmptyValue(props.tableName) ||
        isEmptyValue(props.attributes.column_name)
      ) {
        isLoaded.value = false
        return
      }
      // props.rowData.isLoadingZoom = true
      isLoaded.value = true
      listZoomWindowsRequest({
        column_name: props.attributes.column_name,
        table_name: props.tableName
      })
        .then(response => {
          props.rowData.zoom_windows = response.zoom_windows.map(listZoom => {
            return {
              ...listZoom,
              columnName: props.attributes.column_name,
              currentValue: props.rowData.cells[props.attributes.code]
            }
          })
          isLoaded.value = false
        })
        .catch(() => {
          isLoaded.value = false
        })
        .finally(() => {
          isLoaded.value = false
        })
    }

    function zoomInWindow(report) {
      const { columnName, id, currentValue } = report
      zoomIn({
        attributeValue: `window_${id}`,
        attributeName: 'containerKey',
        query: {
          [columnName]: currentValue.value
        },
        params: {
          [columnName]: currentValue.value
        }
      })
    }

    return {
      // Ref
      isLoaded,
      // Computed
      show,
      // Métodos
      loadZoom,
      cellStyle,
      displayLabel,
      zoomInWindow,
      shouldHideName,
      styleFont
    }
  }
})
</script>
