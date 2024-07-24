<template>
  <div>
    <p style="width: 630px; margin: 0 auto; font-size: 14px; text-align: center;">
      {{ $t('component.attachment.share.description') }}
    </p>
    <p style="text-align: center;">
      <b>
        {{ $t('component.attachment.share.timeText') }}
      </b>
    </p>
    <el-radio-group
      v-model="validTime"
      style="display: flex; justify-content: center;"
      @change="loadData"
    >
      <el-radio :label="3600">1 {{ ' ' + $t('component.attachment.share.time.hour') }}</el-radio>
      <el-radio :label="21600">6 {{ ' ' + $t('component.attachment.share.time.hours') }}</el-radio>
      <el-radio :label="86400">1 {{ ' ' + $t('component.attachment.share.time.day') }}</el-radio>
      <el-radio :label="259200">3 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
      <el-radio :label="604800">7 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
    </el-radio-group>
    <el-input
      v-model="linkShare"
      disabled
      style="margin-top: 10px"
    >
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
    </el-input>
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import {
  requestShareResources
} from '@/api/ADempiere/file-management/resource-reference.ts'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
export default defineComponent({
  name: 'copyLink',
  props: {
    reportOutput: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const isLoading = ref(false)
    const linkShare = ref('')
    const validTime = ref(3600)
    function loadData() {
      isLoading.value = true
      requestShareResources({
        fileName: props.reportOutput.name,
        seconds: validTime.value
      })
        .then(response => {
          linkShare.value = response
        })
        .finally(() => {
          isLoading.value = false
        })
    }
    function copyValue() {
      let textToCopy = linkShare.value
      if (isEmptyValue(textToCopy)) {
        textToCopy = ''
      }
      copyToClipboard({
        text: textToCopy,
        isShowMessage: true
      })
    }
    loadData()
    return {
      isLoading,
      linkShare,
      validTime,
      copyValue,
      loadData
    }
  }
})
</script>
