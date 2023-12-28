<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-row :gutter="20">
    <el-col v-for="(file, key) in attachmentList" :key="key" :span="24">
      <el-card shadow="hover" :class="{ 'image-attachment': true, 'is-current': isCurrent(file) }">
        <div style="float: left;width: 40%; height: 100px;">
          <el-image
            class="image-card-attachment"
            :src="file.src"
            fit="contain"
            :preview-src-list="previewList"
            style="padding-left: 0px;padding-right: 0px;border: 1px solid rgba(184, 186, 188, 0.64);width: 150px;height: 100px;float: left;margin-top: 5%;"
          />
        </div>
        <div style="float: left;padding-top: 2%;width: 60%;">
          <el-radio
            v-if="isSelectable"
            v-model="resourceReference.id"
            :label="file.id"
            @click="resourceReference = file"
          >
            {{ file.name }}
          </el-radio>
          <p
            v-else
            style="font-size: 14px;box-sizing: border-box;overflow: hidden;text-overflow: ellipsis;white-space: normal;word-break: break-all;text-align: end;padding-right: 10px;"
          >
            {{ file.name }}
            <br>
            {{ formatFileSize(file.file_size) }}
          </p>
          <!-- <b>{{ file.name }}</b> -->
          <br>
          <!-- <span>{{ formatFileSize(file.file_size) }}</span> -->
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  formatFileSize,
  getImagePath,
  getImageFromContentType
} from '@/utils/ADempiere/resource.js'

export default defineComponent({
  name: 'ListView',

  props: {
    isSelectable: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const attachmentList = computed({
      set(value) {
        store.commit('setListAttachment', value)
      },
      get() {
        const storedResourcesList = store.getters.getListAttachment
        if (isEmptyValue(storedResourcesList)) {
          return []
        }
        return storedResourcesList.map(element => {
          return {
            ...element,
            src: getSurceFile(element),
            isShowMessage: false
          }
        })
      }
    })

    const previewList = computed(() => {
      return attachmentList.value.map(file => file.src)
    })

    const resourceReference = computed({
      set(value) {
        store.commit('setResourceReference', value)
      },
      get() {
        return store.getters.getResourceReference
      }
    })

    /**
     * Current Filed
     * @param {Object} file
     */
    function isCurrent(file) {
      if (!props.isSelectable) {
        return false
      }
      if (isEmptyValue(resourceReference.value)) {
        return false
      }
      return resourceReference.value.id === file.id
    }

    /**
     * Image From Source
     * @param {Object} file
     */
    const getImageFromSource = (file) => {
      const image = getImagePath({
        file: file.file_name,
        width: 900,
        height: 500
      })
      return image
    }

    /**
     * Get Surce File
     * @param {Object} file
     */
    function getSurceFile(file) {
      if (file.content_type.includes('image')) {
        return getImageFromSource(file).uri
      }
      return getImageFromContentType({
        contentType: file.content_type,
        fileName: file.file_name
      })
    }

    return {
      // computeds
      attachmentList,
      previewList,
      // methods
      formatFileSize,
      isCurrent
    }
  }
})
</script>
