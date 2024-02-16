<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <el-popover
    v-model="isShowed"
    :title="$t('component.attachment.share.title') + ' ' + resourceName"
    placement="bottom"
    trigger="click"
    width="550"
  >
    <p>
      {{ $t('component.attachment.share.description') }}
    </p>
    <p>
      <b>
        {{ $t('component.attachment.share.timeText') }}
      </b>
    </p>
    <el-radio-group
      v-model="validTime"
      @change="changeTIme"
    >
      <el-radio :label="3600">1 {{ ' ' + $t('component.attachment.share.time.hour') }}</el-radio>
      <el-radio :label="21600">6 {{ ' ' + $t('component.attachment.share.time.hours') }}</el-radio>
      <el-radio :label="86400">1 {{ ' ' + $t('component.attachment.share.time.day') }}</el-radio>
      <el-radio :label="259200">3 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
      <el-radio :label="604800">7 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
    </el-radio-group>
    <el-input
      v-model="linkShare"
      size="small"
      disabled
    >
      <!-- <template slot="prepend"> -->
      <i
        v-if="isLoading"
        slot="prefix"
        class="el-icon-loading"
      />
      <i
        v-else
        slot="prefix"
        class="el-input__icon el-icon-document-copy"
        @click="copyValue"
      />
      <!-- </template> -->
    </el-input>
    <el-button
      slot="reference"
      icon="el-icon-share"
      plain
      @click="loadData()"
    />
  </el-popover>
</template>

<script>
import {
  defineComponent,
  ref
} from '@vue/composition-api'

// API Request Methods
import {
  requestShareResources
} from '@/api/ADempiere/file-management/resource-reference.ts'

// Utils and Helper Methods
import {
  isEmptyValue
} from '@/utils/ADempiere/valueUtils'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
// import { formatFileSize } from '@/utils/ADempiere/resource.js'

export default defineComponent({
  name: 'FileShare',

  props: {
    file: {
      type: Object,
      default: () => {}
    },
    id: {
      type: Number,
      default: -1
    },
    uuid: {
      type: String,
      default: undefined
    },
    resourceName: {
      type: String,
      default: undefined
    },
    imageId: {
      type: Number,
      default: -1
    },
    imageUuid: {
      type: String,
      default: undefined
    },
    archiveId: {
      type: Number,
      default: -1
    },
    archiveUuid: {
      type: String,
      default: undefined
    },
    isEditDescription: {
      type: Boolean,
      default: false
    },
    fileName: {
      type: String,
      default: undefined
    }
  },

  setup(props) {
    const linkShare = ref('')
    const isLoading = ref(false)
    const isShowed = ref(false)
    const validTime = ref(3600)
    function loadData() {
      console.log({
        file: props.file
      })
      isLoading.value = true
      requestShareResources({
        fileName: props.resourceName,
        seconds: validTime.value
      })
        .then(response => {
          console.log({ response })
          linkShare.value = response
        })
        .finally(() => {
          isLoading.value = false
        })
    }

    function copyValue() {
      let textToCopy = linkShare.value
      if (isEmptyValue(textToCopy)) {
        textToCopy = '' // empty string
      }
      copyToClipboard({
        text: textToCopy,
        isShowMessage: true
      })
    }

    function changeTIme(params) {
      console.log({ params })
      loadData()
    }

    // loadData()
    return {
      linkShare,
      validTime,
      isLoading,
      isShowed,
      // Methods
      loadData,
      copyValue,
      changeTIme
    }
  }
})
</script>
