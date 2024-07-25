<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.exportFormat') }}</p>
          </template>
          <el-row :gutter="12" style="height: 30px;">
            <el-col style="width: 100%; text-align: center;">
              <el-select
                v-model="printFormatValue"
                @visible-change="optionPrintFormat"
              >
                <el-option
                  v-for="(item, key) in printFormat"
                  :key="key"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.optionsImport.format') }}</p>
          </template>
          <el-row :gutter="12" style="height: 30px;">
            <el-col style="width: 100%; text-align: center;">
              <el-switch
                v-model="checkedItem"
                :active-value="1"
                :inactive-value="0"
                :active-text="$t('report.reportEnginer.optionsImport.fullReport')"
                :inactive-text="$t('report.reportEnginer.optionsImport.actualPage')"
                style="font-size: 18px;"
              />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" style="margin-top: 20px; height: 50px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.optionsImport.sendDownload') }}</p>
          </template>
          <el-row :gutter="12">
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-radio
                v-model="checkedItemGeneral"
                :label="0"
                label-position="left"
                style="font-size: 18px;"
                @change="setCheckedItemGeneral"
              >
                {{ $t('report.reportEnginer.optionsImport.download') }}
                <svg-icon
                  icon-class="cloud_download"
                />
              </el-radio>
            </el-col>
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-radio
                v-model="checkedItemGeneral"
                :label="1"
                label-position="left"
                style="font-size: 18px;"
                @change="setCheckedItemGeneral"
              >
                {{ $t('report.reportEnginer.optionsImport.send') }}
                <i class="el-icon-upload" />
              </el-radio>
            </el-col>
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-radio
                v-model="checkedItemGeneral"
                :label="3"
                label-position="left"
                style="font-size: 18px;"
                @change="setCheckedItemGeneral"
              >
                {{ $t('report.reportEnginer.optionsImport.copyLink') }}
                <i class="el-icon-share" />
              </el-radio>
            </el-col>
          </el-row>
          <el-row v-if="checkedItemGeneral === 1" :gutter="12" style="margin-top: 25px; display: flex; justify-content: center;">
            <el-col :span="18">
              <el-form>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <typeNotify />
                  </el-col>
                  <el-col :span="12">
                    <contactSend />
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
          <el-row v-if="checkedItemGeneral === 3" :gutter="12" style="margin-top: 50px; text-align: center;">
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
            >
              <el-radio :label="3600">1 {{ ' ' + $t('component.attachment.share.time.hour') }}</el-radio>
              <el-radio :label="21600">6 {{ ' ' + $t('component.attachment.share.time.hours') }}</el-radio>
              <el-radio :label="86400">1 {{ ' ' + $t('component.attachment.share.time.day') }}</el-radio>
              <el-radio :label="259200">3 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
              <el-radio :label="604800">7 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
            </el-radio-group>
          </el-row>
        </el-card>
      </el-col>
      <el-col style="margin-top: 1%">
        <el-button
          class="button-base-icon"
          icon="el-icon-check"
          style="float: right;"
          type="primary"
          :disabled="disableButtom"
          @click="sendNotify"
        />
        <el-button
          class="button-base-icon"
          icon="el-icon-close"
          style="float: right; margin-right: 1%;"
          type="danger"
          @click="viewShowDialog"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, computed, ref } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { config } from '@/utils/ADempiere/config'
import { REPORT_EXPORT_TYPES } from '@/utils/ADempiere/constants/report'
import { showNotificationReport } from '@/utils/ADempiere/notification.js'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import contactSend from './contactSend'
import typeNotify from './typeNotify'
export default defineComponent({
  name: 'dialogShareReport',
  components: {
    contactSend,
    typeNotify
  },
  props: {
    containerUuid: {
      type: String,
      required: false
    },
    reportOutput: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const checkedItemGeneral = ref(0)
    const checkedItem = ref(0)
    const printFormat = ref([])
    const printFormatValue = ref('')
    const typeNotification = ref('')
    const linkShare = ref('')
    const isLoading = ref(false)
    const validTime = ref(3600)
    function setCheckedItemGeneral(check) {
      checkedItemGeneral.value = check
    }
    function getOptionFormat() {
      const options = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      }).find(option => option.actionName === 'runReportAs')
      if (isEmptyValue(options)) {
        return []
      }
      return options
    }
    function viewShowDialog() {
      store.commit('setShowDialog', false)
    }
    function sendNotify() {
      validTime.value
      let link = 'https://www.google.com'
      let title = ''
      let message = ''
      if (!isEmptyValue(exportData.value)) {
        link = exportData.value.file_name
      }
      switch (checkedItemGeneral.value) {
        case 1:
          sendLink()
          title = this.$t('report.reportEnginer.sharedReport')
          message = this.$t('report.reportEnginer.mesajeDownload')
          break
        case 3:
          copyValue()
          message = this.$t('report.reportEnginer.mesajeShear')
          link = linkShare.value
          break
        default:
          title = this.$t('report.reportEnginer.download')
          break
      }
      showNotificationReport({
        title,
        message,
        link,
        openLink: this.$t('report.reportEnginer.openLink')
      })
      store.commit('setShowDialog', false)
    }
    function handleDownload() {
      const link = document.createElement('a')
      const imageURL = config.adempiere.resource.url + props.reportOutput.name
      link.href = imageURL
      link.download = props.reportOutput.name
      link.click()
    }
    function optionPrintFormat() {
      const xlsTypes = REPORT_EXPORT_TYPES.filter(type => type.type === 'xls')
      printFormat.value = xlsTypes
    }
    const exportData = computed(() => {
      return store.getters.getExportReport
    })
    const typeNotify = computed(() => {
      return store.getters.getTypeNotify
    })
    const contactSend = computed(() => {
      return store.getters.getContactSend
    })
    const disableButtom = computed(() => {
      return checkedItemGeneral.value === 1 && (isEmptyValue(typeNotify.value) || isEmptyValue(contactSend.value))
    })
    function sendLink() {
      const user_id = store.getters['user/userInfo'].id
      store.dispatch('getSendNotification', {
        user_id,
        title: props.reportOutput.name,
        recipients: contactSend.value,
        notification_type: typeNotify.value,
        attachments: exportData.file_name
      })
    }

    function copyValue() {
      let textToCopy = linkShare.value
      if (isEmptyValue(textToCopy)) {
        textToCopy = ''
      }
      copyToClipboard({
        text: textToCopy,
        isShowMessage: false
      })
    }

    return {
      checkedItemGeneral,
      checkedItem,
      printFormat,
      printFormatValue,
      typeNotification,
      exportData,
      disableButtom,
      typeNotify,
      contactSend,
      linkShare,
      isLoading,
      validTime,
      copyToClipboard,
      handleDownload,
      getOptionFormat,
      viewShowDialog,
      setCheckedItemGeneral,
      optionPrintFormat,
      sendNotify,
      sendLink,
      copyValue
    }
  }
})
</script>

<style>
.el-card__header {
  padding: 0px 20px !important;
}
</style>
