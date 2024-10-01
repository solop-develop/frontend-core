<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Ricardo Fenomeno ricardofenomeno13@gmail.com https://github.com/ricargame
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
  <div style="margin-left: -10px; display: flex; align-items: center;">
    <el-button
      :disabled="isLoadingReport"
      :loading="isLoadingReport"
      type="success"
      size="mini"
      class="button-base-icon"
      icon="el-icon-refresh-right"
      style="font-size:16px"
      @click="runReport"
    >
      {{ $t('report.reportEnginer.refreshRecord') }}
    </el-button>
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, ref } from '@vue/composition-api'
export default defineComponent({
  name: 'refreshButton',
  props: {
    containerUuid: {
      type: String,
      required: false
    },
    reportOutput: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isLoadingReport: {
      type: Boolean,
      required: false
    }
  },
  setup(props, { root }) {
    const timeOutRecords = ref(null)
    function runReport() {
      const reportDefinition = store.getters.getStoredReport(props.containerUuid)
      const reportOutputParams = store.getters.getReportParameters({
        containerUuid: props.containerUuid,
        fieldsList: reportDefinition.fieldsList
      })
      clearTimeout(timeOutRecords.value)
      store.dispatch('buildReport', {
        containerUuid: props.containerUuid || root.$route.params.processUuid,
        isSummary: true,
        parametersList: reportOutputParams,
        printFormatId: props.reportOutput.print_format_id,
        reportId: reportDefinition.internal_id,
        instanceUuid: props.reportOutput.instance_id,
        reportViewId: props.reportOutput.report_view_id,
        pageSize: props.reportOutput.pageSize,
        pageToken: props.reportOutput.pageToken,
        isChangePanel: true
      })
    }
    return {
      runReport
    }
  }
})
</script>

