<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
    <el-button
      icon="el-icon-paperclip"
      size="mini"
      style="font-size: 18px; padding: 3px 5px; margin-left: 10px;"
      :disabled="isDisabledManageFile"
      @click="openAttachments(); isShowedFiles = true;"
    >
      {{ $t('component.attachment.selectFile') }}
    </el-button>

    <el-drawer
      :visible.sync="isShowedFiles"
      size="70%"
      class="drawer-attachmen-file-import"
    >
      <span slot="title" style="font-size: 20px;" @click="openAttachments()">
        <i class="el-icon-paperclip" style="margin-right: 10px;" />
        <span style="color: #606266; font-weight: bold;">
          {{ $t('component.attachment.label') }}
        </span>
      </span>

      <attachment-manager
        table-name="AD_ImpFormat"
        :record-id="importFormatId"
        :is-selectable="true"
      />
      <br>
    </el-drawer>
  </span>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import AttachmentManager from '@/components/ADempiere/PanelInfo/Component/AttachmentManager/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'SelectResource',

  components: {
    AttachmentManager,
    LoadingView
  },

  props: {
    importFormatId: {
      type: Number,
      default: -1
    }
  },

  setup(props) {
    const isShowedFiles = ref(false)

    const isDisabledManageFile = computed(() => {
      return isEmptyValue(props.importFormatId) || props.importFormatId <= 0
    })

    function openAttachments() {
      // isShowedFiles.value = false
      if (isDisabledManageFile.value) {
        return
      }
      store.dispatch('getAttachmentFromServer', {
        tableName: 'AD_ImpFormat',
        recordId: props.importFormatId
      })
        .then(response => {
          // isShowedFiles.value = true // Boolean(response)
        })
        .catch(error => {
          console.warn(`Error getting Count Attachment: ${error.message}. Code: ${error.code}.`)
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    return {
      isShowedFiles,
      isDisabledManageFile,
      openAttachments
    }
  }
})
</script>

<style lang="scss">
.drawer-attachmen-file-import {
  header.el-drawer__header {
    margin-bottom: 10px !important;
    padding-top: 10px !important;
  }
}
</style>
