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
    class="custom-field-image"
    @submit.prevent="notSubmitForm"
  >
    <el-col v-if="value" :span="24" :offset="0" class="image-with-file">
      <el-card :body-style="{ padding: '0px' }">
        <el-image
          class="image-file"
          :alt="altImage"
          :src="imageSourceSmall"
          lazy
          fit="contain"
          style="text-align: center ; height: 100px"
          :preview-src-list="[imageSourceLarge]"
        >
          <!-- <div slot="placeholder" class="image-loading">
            {{ $t('notifications.loading') }}<span class="dot">...</span>
          </div> -->
          <el-skeleton
            slot="placeholder"
            :loading="true"
            animated
            :throttle="500"
            class="image-loading"
          >
            <template slot="template">
              <el-skeleton-item
                variant="image"
                style="width: 100%; height: 140px;"
              />
            </template>
          </el-skeleton>
        </el-image>

        <div class="image-footer">
          <!-- <el-button
            slot="reference"
            class="button-manage-file"
            icon="el-icon-chat-line-square"
            plain
            :disabled="isEmptyValue(value) && isEmptyValue(displayedValue)"
          /> -->
          <file-info
            :image-id="value"
            :resource-name="displayedValue"
            class="popover-info"
          />
          <!--
            <el-button
              slot="reference"
              class="button-manage-file"
              icon="el-icon-chat-line-square"
              plain
              :disabled="isEmptyValue(value) && isEmptyValue(displayedValue)"
            />
          </file-info> -->

          <el-button
            class="button-manage-file-svg"
            plain
            :disabled="isDisabled"
            @click="clearValues()"
          >
            <svg-icon
              icon-class="layers-clear"
            />
          </el-button>

          <el-button
            icon="el-icon-delete"
            class="button-manage-file"
            plain
            :disabled="isDisabled || isEmptyValue(value)"
            @click="handleRemove()"
          />

          <el-upload
            ref="replaceFileComponent"
            :action="endPointUploadResource"
            :data="additionalData"
            :headers="additionalHeaders"
            class="upload-button"
            name="file"
            :show-file-list="false"
            :multiple="false"
            :before-upload="isValidUploadHandler"
            :on-success="loadedSucess"
            :on-change="handleChange"
          >
            <el-button
              class="button-manage-file-svg"
              plain
              :disabled="isDisabled"
            >
              <svg-icon
                icon-class="cloud_upload"
              />
            </el-button>
          </el-upload>

          <el-button
            class="button-manage-file-svg"
            plain
            :disabled="!isDownload"
            @click="handleDownload()"
          >
            <svg-icon
              icon-class="cloud_download"
            />
          </el-button>
        </div>
      </el-card>
    </el-col>

    <el-upload
      v-else
      ref="uploadComponent"
      class="image-without-file"
      v-bind="commonsProperties"
      :action="endPointUploadResource"
      :data="additionalData"
      :headers="additionalHeaders"
      drag
      name="file"
      :show-file-list="false"
      :multiple="false"
      :before-upload="isValidUploadHandler"
      :on-success="loadedSucess"
      :on-change="handleChange"
    >
      <!-- <i v-else class="el-icon-plus icon-image-upload" /> -->
      <svg-icon icon-class="cloud_upload" class="icon-image-upload" style="font-size: 45px;" />
    </el-upload>
  </form>
</template>

<script>
import lang from '@/lang'

// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'
import FileInfo from '@/components/ADempiere/PanelInfo/Component/AttachmentManager/fileInfo'

// Constants
import { config } from '@/utils/ADempiere/config'
import { BEARER_TYPE } from '@/utils/auth'
import { UUID_PATTERN } from '@/utils/ADempiere/recordUtil'
import { RESOURCE_TYPE_IMAGE } from '@/utils/ADempiere/resource'

// API Request Methods
import {
  // requestUploadAttachment,
  deleteResourceReference,
  setResourceReference
} from '@/api/ADempiere/user-interface/component/resource'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getToken } from '@/utils/auth'
import { getImagePath } from '@/utils/ADempiere/resource'
import { showMessage } from '@/utils/ADempiere/notification'

export default {
  name: 'FieldImage',

  components: {
    FileInfo
  },

  mixins: [
    fieldMixin,
    fieldWithDisplayColumn
  ],

  props: {
    // receives the property that is an object with all the attributes
    binary: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      endPointUploadResource: config.adempiere.api.url + 'user-interface/component/resource/save-attachment',
      additionalData: {},
      fileResource: {},
      valuesImage: [{
        identifier: 'undefined',
        value: '',
        isLoaded: true
      }]
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-image '
    },
    altImage() {
      const displayedAlt = this.displayedValue
      if (isEmptyValue(displayedAlt)) {
        return this.value
      }
      return displayedAlt.replace(UUID_PATTERN, '')
        .replace(/^-{0,1}/, '')
    },
    isDownload() {
      return !isEmptyValue(this.displayedValue)
    },
    imageSourceSmall() {
      const displayedAlt = this.displayedValue
      if (isEmptyValue(displayedAlt)) {
        return undefined
      }
      const { uri } = getImagePath({
        file: displayedAlt,
        width: 200,
        height: 200,
        operation: 'resize'
      })
      return uri
    },
    imageSourceLarge() {
      const displayedAlt = this.displayedValue
      if (isEmptyValue(displayedAlt)) {
        return undefined
      }
      const { uri } = getImagePath({
        file: displayedAlt,
        width: 1024,
        height: 1024,
        operation: 'resize'
      })
      return uri
    },
    additionalHeaders() {
      const token = getToken()
      let bearerToken = token
      // Json Web Token
      if (!isEmptyValue(bearerToken) && !bearerToken.startsWith(BEARER_TYPE)) {
        bearerToken = `${BEARER_TYPE} ${token}`
      }
      return {
        Authorization: bearerToken
      }
    }
  },

  methods: {
    isValidUploadHandler(file) {
      return new Promise((resolve, reject) => {
        if (this.isDisabled) {
          reject(false)
          return
        }
        setResourceReference({
          resourceType: RESOURCE_TYPE_IMAGE,
          resourceId: this.value,
          fileName: file.name,
          fileSize: file.size
        }).then(response => {
          if (response.code >= 400) {
            reject(response)
            return
          }

          this.fileResource = response
          this.additionalData = {
            resource_uuid: response.uuid,
            file_name: response.file_name
          }

          this.value = response.resource_id
          this.displayedValue = response.file_name
          this.preHandleChange(this.value)
          resolve(true)
        }).catch(error => {
          showMessage({
            message: error.message || error.result || lang.t('component.attachment.error'),
            type: 'error'
          })
          reject(error)
        })
      })
    },
    handleChange(file, fileList) {
    },
    handleError(error, file, fileList) {
      return showMessage({
        type: 'error',
        message: error.message || error.result || lang.t('component.attachment.error')
      })
    },
    loadedSucess(response, file, fileList) {
      if (response.code >= 400) {
        setTimeout(() => {
          fileList.pop()
        }, 500)
        return this.handleError(
          new Error(response.result),
          file,
          fileList
        )
      }
      // const { result } = response
      // this.value = result.resource_id
      // this.displayedValue = result.file_name
      // this.preHandleChange(this.value)
    },

    clearValues() {
      if (this.isDisabled) {
        return
      }
      this.value = undefined
      this.preHandleChange(this.value)
      // this.displayedValue = undefined
    },

    /**
     * Handle Download image
     */
    async handleDownload() {
      if (!this.isDownload) {
        return
      }
      const imagen = await fetch(this.imageSourceLarge)
      const imagenblob = await imagen.blob()
      const imageURL = URL.createObjectURL(imagenblob)
      const link = document.createElement('a')
      link.href = imageURL
      link.download = this.altImage
      link.click()
    },

    /**
     * Handle Removeya esta actualizado solop
     */
    handleRemove() {
      if (this.isDisabled) {
        return
      }
      const resourceName = this.displayedValue
      if (isEmptyValue(resourceName)) {
        return
      }
      deleteResourceReference({
        resourceName
      }).then(() => {
        this.clearValues()
      })
    }
  }
}
</script>

<style lang="scss">
.custom-field-image {
  .image-with-file {
    // width: 178px;
    // height: 178px;
    .image-file {
      // align center alt text
      // display: flex;
      // display: block;
      align-items: center;
      justify-content: center;

      // width: 178px;
      // height: 178px;

      display: block;
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 5px;
      border: 1px solid rgba(184, 186, 188, 0.64);
      width: 100%;
      height: 100%;

      .image-loading {
        width: 100%;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .image-footer {
      text-align: center;
      // margin-top: 0px;
      // margin-bottom: 0px;
      padding-top: 7px;
      padding-bottom: 5px;
      padding-left: 10px;
      padding-right: 10px;

      .popover-info {
        margin-right: 10px;
        .el-button {
          font-size: 20px;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 10px;
          padding-right: 10px;
        }
      }

      .button-manage-file {
        font-size: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
      }

      .button-manage-file-svg {
        font-size: 24px;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 8px;
        padding-right: 8px;
      }

      .upload-button {
        display: initial;
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }

  .image-without-file {
    .icon-image-upload {
        height: 178px;
        text-align: center;
        color: #8c939d;
      }
      svg.icon-image-upload {
        font-size: 45px;
      }
      i.icon-image-upload {
        font-size: 28px;
        width: 178px;
      }
  }
}
</style>
