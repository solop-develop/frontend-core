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
  <el-table-column
    type="index"
    :index="indexTable"
    label="#"
    class-name="number-align"
    min-width="30"
    header-align="center"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Utils and Helper Methods
import { indexRowByPage, ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * This component is custom column to view real index of row on table, considering
 * the page number to calculate the index of the total number of records
 */
export default defineComponent({
  name: 'IndexColumn',

  props: {
    pageNumber: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: ROWS_OF_RECORDS_BY_PAGE
    }
  },

  setup(props) {
    function indexTable(index) {
      return indexRowByPage({
        indexRow: index,
        pageNumber: props.pageNumber,
        pageSize: props.pageSize
      })
    }

    return {
      indexTable
    }
  }
})
</script>

<style>
.number-align {
  text-align-last: end !important;
}
</style>
