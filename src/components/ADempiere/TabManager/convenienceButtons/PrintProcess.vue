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
  <span v-if="!isEmptyValue(process) && process.is_report">
    <el-dropdown
      v-if="!isEmptyValue(printFormatsList) || currentTableName === FINANCIAL_REPORT_TABLE_NAME"
      split-button
      size="small"
      trigger="click"
      class="print-button"
      style="margin-left: 8px; padding-right: 9px;"
      @click="printProcess"
      @command="handleCommandActions"
    >
      <svg-icon
        v-if="!isLoading"
        style="font-size: 23px;"
        icon-class="print"
      />
      <i
        v-else
        style="font-size: 21px;"
        class="el-icon-loading"
      />

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(process, index) in printFormatsList"
          :key="index"
          :command="process"
        >
          {{ $t(process.name) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button
      v-if="isEmptyValue(printFormatsList)"
      plain
      type="info"
      size="small"
      style="margin-left: 5px;padding-top: 1px;padding-right: 5px;padding-bottom: 8px;padding-left: 5px;"
      :disabled="isLoading"
      :loading="isLoading"
      @click="printProcess()"
    >
      <svg-icon
        v-if="!isLoading"
        style="font-size: 21px;"
        icon-class="print"
      />
      <i
        v-else
        style="font-size: 21px;"
        class="el-icon-loading"
      />
    </el-button>
    <dialog-legacy
      :table-name="currentTableName"
      :process="process"
      :record-id="recordId"
      :container-uuid="containerUuid"
    />
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// Constants
import {
  FINANCIAL_REPORT_TABLE_NAME
} from '@/utils/ADempiere/dictionary/report/financialReport.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showNotification } from '@/utils/ADempiere/notification.js'

import DialogLegacy from '@/components/ADempiere/Report/Data/Dialog.vue'
export default defineComponent({
  name: 'PrintProcess',
  components: {
    DialogLegacy
  },
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
     * Ref
     */
    const isLoading = ref(false)

    /**
     * Const
     */
    const containerUuid = props.tabAttributes.uuid
    const { process } = props.tabAttributes

    /**
     * Computed
     */

    const currentTableName = computed(() => {
      if (isEmptyValue(props.tabAttributes.table) || isEmptyValue(props.tabAttributes.table.table_name)) return props.tabAttributes.table_name
      return props.tabAttributes.table.table_name
    })
    const recordId = computed(() => {
      return store.getters.getIdOfContainer({
        containerUuid,
        tableName: currentTableName.value
      })
    })

    const getReportDefinition = computed(() => {
      if (isEmptyValue(process) || isEmptyValue(process.uuid)) {
        return []
      }
      return store.getters.getStoredReport(process.uuid)
    })

    const printFormatsList = computed(() => {
      if (isEmptyValue(process)) {
        return []
      }
      return store.getters.getPrintFormatsList(process.internal_id)
    })

    /**
     * Methods
     */
    const selectionsList = computed(() => {
      if (props.containerManager.getSelection) {
        return props.containerManager.getSelection({
          containerUuid: containerUuid
        })
      }
      return []
    })
    function printProcess() {
      if (!isEmptyValue(selectionsList) && !isEmptyValue(selectionsList.value) && selectionsList.value.length > 1) {
        store.commit('setViewDialog', true)
      } else {
        if (isEmptyValue(process)) {
          showNotification({
            title: language.t('notifications.whithoutAssociatedReport'),
            message: process.name,
            summary: process.description,
            type: 'info'
          })
          return
        }
        isLoading.value = true
        store.dispatch('runReport', {
          containerUuid: process.uuid,
          recordId: recordId.value,
          reportId: process.internal_id,
          tableName: currentTableName.value
        })
          .finally(() => {
            isLoading.value = false
          })
      }
    }

    function handleCommandActions(command) {
      showNotification({
        title: language.t('notifications.processing'),
        message: process.name,
        summary: process.description,
        type: 'info'
      })
      store.dispatch('generateReportViwer', {
        containerUuid: process.uuid,
        reportUuid: process.uuid,
        reportId: process.internal_id,
        printFormatId: command.id,
        tableName: command.table_name,
        filters: `[{\"name\":\"${command.table_name}_ID\",\"operator\":\"equal\",\"values\":${recordId.value}}]`,
        isView: false
      })
    }

    function loadProcessData() {
      if (isEmptyValue(process)) {
        return
      }
      if (!isEmptyValue(getReportDefinition.value)) {
        return
      }
      const { id } = process
      store.dispatch('getReportDefinitionFromServer', {
        id,
        tableName: currentTableName.value
      })
    }

    loadProcessData()

    return {
      // Ref
      isLoading,
      // Const
      process,
      FINANCIAL_REPORT_TABLE_NAME,
      selectionsList,
      containerUuid,
      // Computed
      recordId,
      printFormatsList,
      currentTableName,
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
