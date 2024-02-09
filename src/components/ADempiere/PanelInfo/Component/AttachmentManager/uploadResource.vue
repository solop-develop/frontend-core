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
      :before-upload="isValidUploadHandler"
      :multiple="false"
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

// import lang from '@/lang'
// import store from '@/store'

// Constants
// import { config } from '@/utils/ADempiere/config'
// import { BEARER_TYPE } from '@/utils/auth'
// import { RESOURCE_TYPE_ATTACHMENT } from '@/utils/ADempiere/resource'

// API Request Methods
// import {
//   // requestUploadAttachment
// } from '@/api/ADempiere/user-interface/component/resource'
import {
  requestPresignedUrl
} from '@/api/ADempiere/file-management/resource-reference.ts'

// // Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// import { showMessage } from '@/utils/ADempiere/notification'
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
    loadData: Function
  },

  setup(props) {
    const action = ref('')
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
      retrieveNewURL(file)
    }

    function retrieveNewURL(file, cb) {
      return new Promise(resolve => {
        requestPresignedUrl({
          fileName: file.name.replaceAll(' ', '_')
        })
          .then(response => {
            action.value = response
            uploadFile(file, response)
            resolve(file, response)
          })
      })
      // fetch(`/presignedUrl?name=${file.name}`).then((response) => {
      //   response.text().then((url) => {
      //     cb(file, url)
      //   })
      // }).catch((e) => {
      //   console.error(e)
      // })
    }

    // ``uploadFile` accepts the current filename and the pre-signed URL. It then uses `Fetch API`
    // to upload this file to S3 at `play.min.io:9000` using the URL:
    function uploadFile(file, url) {
      fetch(url, {
        method: 'PUT',
        body: file
      }).then(() => {
        // If multiple files are uploaded, append upload status on the next line.
      }).catch((e) => {
        console.error(e)
      })
    }

    return {
      upload,
      isValidUploadHandler,
      action
    }
  }
})
</script>
