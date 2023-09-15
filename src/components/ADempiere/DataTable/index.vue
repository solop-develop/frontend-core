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
  <component
    :is="renderTableComponent"
    id="renderTableComponent"
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :container-manager="containerManager"
    :panel-metadata="panelMetadata"
    :is-loading-data-table="isLoadingDataTable"
    :header="header"
    :data-table="dataTable"
    :is-table-selection="isTableSelection"
    :is-show-search="isShowSearch"
    :is-navigation="isNavigation"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'DefaultTable',

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
    panelMetadata: {
      type: Object,
      required: true
    },
    isLoadingDataTable: {
      type: Boolean,
      default: false
    },
    // get the table header
    header: {
      type: Array,
      required: true,
      default: () => []
    },
    dataTable: {
      type: Array,
      default: () => []
    },
    // Show check column from selection row
    isTableSelection: {
      type: Boolean,
      default: true
    },
    isShowSearch: {
      type: Boolean,
      default: true
    },
    isNavigation: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const renderTableComponent = computed(() => {
      const { type } = root.$route.meta
      let dataTableCompenent
      switch (type) {
        case 'window':
          dataTableCompenent = () => import('@/components/ADempiere/DataTable/Windows')
          break
        case 'browser':
          dataTableCompenent = () => import('@/components/ADempiere/DataTable/Browser')
          break
      }
      return dataTableCompenent
    })

    return {
      renderTableComponent
    }
  }
})
</script>

<style lang="scss">
.el-table .success-row {
  background: #e8f4ff;
}
</style>
