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
  <span>
    <!-- <input id="selector" type="file" multiple>
    <button @click="upload()">Upload</button>
    <div id="status">No uploads</div>' -->
    <el-upload
      ref="uploadComponent"
      :action="action"
      class="upload-demo"
      :multiple="false"
      :before-upload="isValidUploadHandler"
      :on-success="loadedSucess"
    >
      <el-button slot="trigger" size="small" type="primary" style="font-size: 13px;">
        <i class="el-icon-upload" />
        {{ $t('component.attachment.uploadFile') }}
      </el-button>
    </el-upload>
  </span>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Constants
// import { config } from '@/utils/ADempiere/config'
// import { BEARER_TYPE } from '@/utils/auth'
import { RESOURCE_TYPE_ATTACHMENT } from '@/utils/ADempiere/resource'

// API Request Methods
// import {
//   // requestUploadAttachment
// } from '@/api/ADempiere/user-interface/component/resource'
import {
  requestPresignedUrl,
  // requestDeleteResources,
  requestSetResourceReference
  // requestDeleteResourceReference
} from '@/api/ADempiere/file-management/resource-reference.ts'

// // Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
// import { getToken } from '@/utils/auth'
// import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

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
    containerManager: {
      type: Object,
      default: () => {}
    },
    containerUuid: {
      type: String,
      default: ''
    },
    parentUuid: {
      type: String,
      default: ''
    },
    loadData: Function
  },

  setup(props) {
    const uploadComponent = ref(null)
    const action = ref('')
    const filesList = ref([])
    const additionalData = ref({})
    const fileResource = ref(({}))
    function upload() {
      // // Get selected files from the input element.
      // var files = document.querySelector('#selector').files
      // for (var i = 0; i < files.length; i++) {
      //   var file = files[i]
      //   // Retrieve a URL from our server.
      //   retrieveNewURL(file, (file, url) => {
      //     // Upload the file to the server.
      //     uploadFile(file, url)
      //   })
      // }
    }

    function isValidUploadHandler(file) {
      resourceReference(file)
    }

    function resourceReference(file) {
      return new Promise((resolve, reject) => {
        requestSetResourceReference({
          resourceType: RESOURCE_TYPE_ATTACHMENT,
          tableName: props.tableName,
          recordId: props.recordId,
          fileName: file.name,
          fileSize: file.size
        })
          .then(responseReferences => {
            if (responseReferences.code >= 400) {
              reject(responseReferences)
              return
            }
            fileResource.value = responseReferences
            additionalData.value = {
              id: responseReferences.id
            }

            const url = presignedUrl({ file, reference: responseReferences })
            resolve(url)
          })
          .catch(error => {
            showMessage({
              message: error.message || error.result || lang.t('component.attachment.error'),
              type: 'error'
            })
            reject(error)
          })
          .finally(() => {
            uploadComponent.value.uploadFiles = filesList.value
            resolve(true)
          })
      })
    }

    /**
     * Get URL
     */
    function presignedUrl({ file, reference }) {
      return new Promise((resolve, reject) => {
        requestPresignedUrl({
          fileName: reference.file_name
        })
          .then(responseUrl => {
            uploadFile({
              file,
              url: responseUrl
            })
            resolve(file, responseUrl)
          })
      })
    }

    // ``uploadFile` accepts the current filename and the pre-signed URL. It then uses `Fetch API`
    // to upload this file to S3 at `play.min.io:9000` using the URL:
    function uploadFile({ file, url }) {
      fetch(url, {
        method: 'PUT',
        body: file
      }).then(() => {
        props.containerManager.getAttachment({
          containerUuid: props.containerUuid,
          recordUuid: props.recordUuid,
          parentUuid: props.parentUuid,
          tableName: props.tableName,
          recordId: props.recordId
        })
        store.dispatch('')
        return true
      }).catch((error) => {
        showMessage({
          message: error.message || error.result || lang.t('component.attachment.error'),
          type: 'error'
        })
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

      store.dispatch('getAttachmentFromServer', {
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid
      })
    }

    function handleError(error, file, fileList) {
      return showMessage({
        type: 'error',
        message: error.message || error.result || lang.t('component.attachment.error')
      })
    }

    return {
      // Refs
      uploadComponent,
      additionalData,
      fileResource,
      filesList,
      action,
      // Methods
      upload,
      handleError,
      loadedSucess,
      isValidUploadHandler
    }
  }
})
</script>
