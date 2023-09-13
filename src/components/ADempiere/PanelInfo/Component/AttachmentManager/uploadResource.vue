<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <form
    enctype="multipart/form-data"
    @submit.prevent="notSubmitForm"
  >
    <el-upload
      ref="uploadComponent"
      :action="endPointUploadResource"
      class="upload-demo"
      name="file"
      :file-list="filesList"
      :data="additionalData"
      :headers="additionalHeaders"
      :multiple="false"
      :before-upload="isValidUploadHandler"
      :on-success="loadedSucess"
      :on-error="handleError"
    >
      <el-button slot="trigger" size="small" type="primary" style="font-size: 13px;">
        <i class="el-icon-upload" />
        {{ $t('component.attachment.uploadFile') }}
      </el-button>
    </el-upload>
  </form>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Constants
import { config } from '@/utils/ADempiere/config'
import { BEARER_TYPE } from '@/utils/auth'
import { RESOURCE_TYPE_ATTACHMENT } from '@/utils/ADempiere/resource'

// API Request Methods
import {
  // requestUploadAttachment,
  setResourceReference
} from '@/api/ADempiere/user-interface/component/resource'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { getToken } from '@/utils/auth'

export default defineComponent({
  name: 'UploadResource',

  props: {
    tableName: {
      type: String,
      required: true
    },
    recordId: {
      type: Number,
      default: 0
    },
    recordUuid: {
      type: String,
      default: ''
    },
    loadData: Function
  },

  setup(props) {
    const endPointUploadResource = config.adempiere.api.url + 'user-interface/component/resource/save-attachment'

    const uploadComponent = ref(null)
    const filesList = ref([])
    const additionalData = ref({})
    const fileResource = ref(({}))

    const additionalHeaders = computed(() => {
      const token = getToken()
      let bearerToken = token
      // Json Web Token
      if (!isEmptyValue(bearerToken) && !bearerToken.startsWith(BEARER_TYPE)) {
        bearerToken = `${BEARER_TYPE} ${token}`
      }
      return {
        Authorization: bearerToken
      }
    })

    function isValidUploadHandler(file) {
      return new Promise((resolve, reject) => {
        setResourceReference({
          resourceType: RESOURCE_TYPE_ATTACHMENT,
          tableName: props.tableName,
          recordId: props.recordId,
          recordUuid: props.recordUuid,
          fileName: file.name,
          fileSize: file.size
        }).then(response => {
          if (response.code >= 400) {
            reject(response)
          }

          fileResource.value = response
          additionalData.value = {
            resource_uuid: response.uuid,
            file_name: response.file_name
          }
          resolve(true)
        }).catch(error => {
          showMessage({
            message: error.message || error.result || lang.t('component.attachment.error'),
            type: 'error'
          })
          reject(error)
        }).finally(() => {
          // uploadComponent.value.uploadFiles = filesList.value
          // resolve(true)
        })
      })
    }

    function handleError(error, file, fileList) {
      return showMessage({
        type: 'error',
        message: error.message || error.result || lang.t('component.attachment.error')
      })
    }

    function loadedSucess(response, file, fileList) {
      if (response.code >= 400) {
        setTimeout(() => {
          fileList.pop()
        }, 500)
        return handleError(
          new Error(response.result),
          file,
          fileList
        )
      }

      if (props.loadData) {
        props.loadData({
          resource: fileResource.value,
          file
        })
      }
      additionalData.value = {}

      store.dispatch('findAttachment', {
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid
      })
    }

    return {
      endPointUploadResource,
      // Refs
      uploadComponent,
      additionalData,
      fileResource,
      filesList,
      // Computeds
      additionalHeaders,
      // Methods
      isValidUploadHandler,
      loadedSucess,
      handleError
    }
  }
})
</script>
