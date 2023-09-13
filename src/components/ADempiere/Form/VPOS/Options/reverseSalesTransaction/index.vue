<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-row>
    <el-col :span="24" class="container-reverse">
      <p class="container-popover">
        <b class="container-popover">
          {{ $t('data.addDescription') }}
        </b>
      </p>
    </el-col>
    <el-col :span="24">
      <el-input
        v-model="messageReverseSales"
        type="textarea"
        :rows="2"
        :placeholder="$t('data.addDescription')"
        style=""
      />
      <br>
      <br>
    </el-col>
    <el-col :span="24">
      <samp class="spam-button" style="float: right;">
        <el-button
          type="danger"
          icon="el-icon-close"
          style="background: #ff6d6d;border-color: #ff6d6d;background-color: #ff6d6d;"
          @click="close"
        />
        <el-button
          type="primary"
          style="background: #46a6ff;border-color: #46a6ff;background-color: #46a6ff;"
          icon="el-icon-check"
          @click="cancelSaleTransaction()"
        />
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import store from '@/store'
import router from '@/router'
import lang from '@/lang'
import { defineComponent, ref } from '@vue/composition-api'
// API Request Methods
import {
  reverseSales
} from '@/api/ADempiere/form/point-of-sales.js'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'
import { buildLinkHref } from '@/utils/ADempiere/resource.js'
// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
export default defineComponent({
  name: 'reverseSalesTransaction',
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    /**
     * Ref
     */
    const messageReverseSales = ref('')
    /**
     * Methods
     */
    function cancelSaleTransaction() {
      const {
        currentOrder,
        uuid,
        id
      } = store.getters.posAttributes.currentPointOfSales
      reverseSales({
        posUuid: uuid,
        orderUuid: currentOrder.uuid,
        description: messageReverseSales.value
      })
        .then(response => {
          store.dispatch('printTicket', {
            posId: id,
            orderId: currentOrder.id
          })
          store.dispatch('reloadOrder', response.uuid)
            .then(() => {
              if (store.getters.posAttributes.currentPointOfSales.IsAllowsPreviewDocument) {
                printPreview({
                  posUuid: uuid,
                  orderUuid: currentOrder.uuid
                })
              }
            })
          showMessage({
            type: 'success',
            message: lang.t('notifications.completed'),
            showClose: true
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          close()
        })
    }

    function printPreview({
      posUuid,
      orderUuid
    }) {
      store.dispatch('printTicketPreviwer', {
        posUuid,
        orderUuid
      })
        .then(response => {
          const { processLog } = response
          if (!isEmptyValue(processLog)) {
            const link = buildLinkHref({
              fileName: processLog.output.file_name,
              outputStream: processLog.output.output_stream,
              mimeType: processLog.output.mime_type
            })
            store.commit('setReportOutput', {
              download: link.download,
              format: processLog.output.report_type,
              fileName: processLog.output.file_name,
              link,
              content: processLog.output.output,
              mimeType: processLog.output.mime_type,
              name: processLog.output.name,
              output: processLog.output,
              outputStream: processLog.output.output_stream,
              outputStream_asB64: processLog.output.output_stream_asB64,
              outputStream_asU8: processLog.output.output_stream_asU8,
              reportType: processLog.output.report_type,
              reportUuid: processLog.uuid,
              reportViewUuid: processLog.uuid,
              tableName: 'C_Order',
              url: link.href,
              uuid: processLog.uuid,
              instanceUuid: processLog.instance_uuid
            })
            router.push({
              name: REPORT_VIEWER_NAME,
              params: {
                processId: 110,
                reportUuid: processLog.uuid,
                tableName: 'C_Order',
                menuParentUuid: '',
                instanceUuid: processLog.instance_uuid,
                fileName: processLog.output.name,
                name: processLog.output.name,
                mimeType: processLog.output.mime_type
              }
            }, () => {})
          }
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }

    function close() {
      store.commit('setDialogoComponent', false)
    }

    return {
      // Ref
      messageReverseSales,
      // Methods
      cancelSaleTransaction,
      printPreview,
      close
    }
  }
})
</script>

<style lang="scss">
.dialogo-component{
  .el-dialog__body {
    max-height: 100%;
  }
}
</style>
