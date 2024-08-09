<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <span>
    <el-dropdown
      v-if="!isEmptyValue(process) && is_document && !isEmptyValue(printFormats)"
      split-button
      size="small"
      trigger="click"
      class="print-button"
      style="margin-left: 8px; padding-right: 9px;"
      @click="printProcess"
      @command="handleCommandActions"
    >
      <svg-icon
        style="font-size: 23px;"
        icon-class="print"
      />

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(process, index) in printFormats"
          :key="index"
          :command="process"
        >
          {{ $t(process.name) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="!isEmptyValue(process) && is_document && isEmptyValue(printFormats)"
      plain
      type="info"
      size="small"
      style="margin-left: 5px;padding-top: 1px;padding-right: 5px;padding-bottom: 8px;padding-left: 5px;"
      @click="printProcess()"
    >
      <svg-icon
        style="font-size: 21px;"
        icon-class="print"
      />
    </el-button>
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import store from '@/store'

export default defineComponent({
  name: 'PrintProcess',

  props: {
    parentUuid: {
      type: [String, Number],
      required: false
    },
    containerManager: {
      type: Object,
      required: true
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    /**
     * Const
     */
    const containerUuid = props.tabAttributes.uuid
    const { process } = props.tabAttributes
    const { is_document, table_name } = props.tabAttributes.table

    /**
     * Computed
     */

    const recordId = computed(() => {
      return store.getters.getIdOfContainer({
        containerUuid,
        tableName: table_name
      })
    })

    const getReportDefinition = computed(() => {
      if (
        isEmptyValue(process) ||
        isEmptyValue(process.uuid)
      ) return []
      return store.getters.getStoredReport(process.uuid)
    })

    const printFormats = computed(() => {
      if (
        isEmptyValue(process)
      ) return []
      return store.getters.getPrintFormatList(process.id)
    })

    /**
     * Methods
     */
    function printProcess() {
      if (isEmptyValue(process)) return
      store.dispatch('runReport', {
        containerUuid: process.uuid,
        recordId: recordId.value,
        reportId: process.id,
        tableName: table_name
      })
    }

    function handleCommandActions(command) {
      store.dispatch('generateReportViwer', {
        containerUuid: process.uuid,
        reportUuid: process.uuid,
        printFormatId: command.id,
        reportId: process.id,
        tableName: command.table_name,
        filters: `[{\"name\":\"${command.table_name}_ID\",\"operator\":\"equal\",\"values\":${recordId.value}}]`,
        isView: false
      })
    }

    function loadProcessData() {
      if (isEmptyValue(process) || isEmptyValue(is_document)) return
      if (!isEmptyValue(getReportDefinition.value)) return
      const { id } = process
      store.dispatch('getReportDefinitionFromServer', {
        id,
        tableName: table_name
      })
    }

    loadProcessData()

    return {
      // Const
      process,
      is_document,
      // Computed
      recordId,
      printFormats,
      getReportDefinition,
      // Methods
      printProcess,
      loadProcessData,
      handleCommandActions
    }
  }
})
</script>

<style lang="scss">
.print-button {
  &.el-dropdown {
    .el-button {
      padding-top: 3px;
      color: #909399;
      padding-bottom: 3px;
      background: #f4f4f5;
      border-color: #d3d4d6;

      &:hover {
        // as button success without plain
        background: #909399;
        border-color: #909399;
        color: #fff;
      }
    }
  }
}
</style>
