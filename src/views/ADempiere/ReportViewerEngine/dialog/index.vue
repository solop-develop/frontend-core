<template>
  <el-dialog
    v-shortkey="shortsKey"
    :visible.sync="showDialog"
    :title="$t('report.reportEnginer.optionsImport.title')"
    top="2vh"
    @shortkey.native="keyAction"
    @close="viewShowDialog"
  >
    <el-row :gutter="12">
      <el-col v-if="!isLegacy" :span="!isPanel ? 24 : 12">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.exportFormat') }}</p>
          </template>
          <el-row :gutter="12" style="height: 30px;">
            <el-col style="width: 100%; text-align: center;">
              <el-select
                v-model="printFormatValue"
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
      <el-col v-if="isPanel" :span="12">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.optionsImport.format') }}</p>
          </template>
          <el-row :gutter="12" style="height: 30px;">
            <el-col style="width: 100%; text-align: center;">
              <el-switch
                v-model="allReport"
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
    <el-row :gutter="12" style="margin-top: 20px;">
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
                style="font-size: 18px; padding-right: 1%; padding-bottom: 2%"
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
                style="font-size: 18px; padding-right: 1%; padding-bottom: 2%"
              >
                {{ $t('report.reportEnginer.optionsImport.send') }}
                <i class="el-icon-upload" />
              </el-radio>
            </el-col>
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-radio
                v-model="checkedItemGeneral"
                :label="2"
                label-position="left"
                style="font-size: 18px; padding-bottom: 2%"
              >
                {{ $t('report.reportEnginer.optionsImport.copyLink') }}
                <i class="el-icon-share" />
              </el-radio>
            </el-col>
          </el-row>
          <el-row v-if="checkedItemGeneral === 1" :gutter="12" style="margin-top: 25px; display: flex; justify-content: center;">
            <el-col :span="24">
              <el-form>
                <el-row :gutter="24">
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
          <el-row v-if="checkedItemGeneral === 2" :gutter="12" style="margin-top: 50px; text-align: center;">
            <p style="width: 630px; margin: 0 auto; font-size: 14px; text-align: center;">
              {{ $t('component.attachment.share.description') }}
            </p>
            <p style="text-align: center; padding-bottom: 1%">
              <b>
                {{ $t('component.attachment.share.timeText') }}
              </b>
            </p>
            <el-radio-group
              v-model="validTime"
              style="display: flex; justify-content: center; padding-bottom: 1%;"
            >
              <el-radio class="radio-padding" :label="3600">1 {{ ' ' + $t('component.attachment.share.time.hour') }}</el-radio>
              <el-radio class="radio-padding" :label="21600">6 {{ ' ' + $t('component.attachment.share.time.hours') }}</el-radio>
              <el-radio class="radio-padding" :label="86400">1 {{ ' ' + $t('component.attachment.share.time.day') }}</el-radio>
              <el-radio class="radio-padding" :label="259200">3 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
              <el-radio class="radio-padding" :label="604800">7 {{ ' ' + $t('component.attachment.share.time.days') }}</el-radio>
            </el-radio-group>
          </el-row>
          <el-col v-if="checkedItemGeneral === 1" :span="24" style="margin-top: 2%">
            <div style="margin-bottom: 3%;">
              <label>{{ $t('report.reportEnginer.subject') }}</label>
              <el-input
                v-model="titleDocument"
              />
            </div>
            <markdown
              :text="markdownContent"
              :max-height="'250px'"
              :change-value-text="updateContent"
              :left-options="'undo redo clear | h bold italic strikethrough quote ul ol table hr link image code | emoji | listMailTemplates'"
              :is-toolbars="true"
              :additional-toolbars="editorToolbarList"
              :action-success="sendNotify"
              :action-error="viewShowDialog"
            />
          </el-col>
        </el-card>
      </el-col>
      <el-col style="margin-top: 1%">
        <el-button
          class="button-base-icon"
          icon="el-icon-check"
          style="float: right;"
          type="primary"
          :disabled="disableButtom()"
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
  </el-dialog>
</template>

<script>
import store from '@/store'
import language from '@/lang'
import marked from 'marked'
import { defineComponent, computed, ref, nextTick, watch } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { config } from '@/utils/ADempiere/config'
import { REPORT_EXPORT_TYPES } from '@/utils/ADempiere/constants/report'
import { showNotificationReport } from '@/utils/ADempiere/notification.js'
import { showNotification } from '@/utils/ADempiere/notification'
import {
  requestShareResources
} from '@/api/ADempiere/file-management/resource-reference.ts'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import contactSend from './contactSend'
import typeNotify from './typeNotify'
import markdown from '@/components/ADempiere/MarkDown'

export default defineComponent({
  name: 'dialogShareReport',
  components: {
    contactSend,
    typeNotify,
    markdown
  },
  props: {
    containerUuid: {
      type: String,
      required: false
    },
    reportOutput: {
      type: Object,
      required: false
    },
    reportMetadata: {
      type: Object,
      required: false
    },
    isPanel: {
      type: Boolean,
      required: false,
      default: true
    },
    isLegacy: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const shortsKey = computed(() => {
      return {
        close: ['esc']
      }
    })
    const showDialog = computed(() => {
      return store.getters.getReportShowDialog
    })
    const storedMailTemplatesList = computed(() => {
      return store.getters.getListMailTemplates
    })
    const editorToolbarList = computed(() => {
      return {
        listMailTemplates: storedMailTemplatesList.value
      }
    })

    const isCollapseComments = ref(false)
    const isShowVIwer = ref(false)
    const checkedItemGeneral = ref(0)
    const checkedItem = ref(0)
    const printFormat = computed(() => {
      return REPORT_EXPORT_TYPES.filter(type => type.type === 'xlsx')
    })
    const printFormatValue = ref('xlsx')
    const linkShare = ref('')
    const isLoading = ref(false)
    const validTime = ref(3600)
    const titleDocument = ref(
      isEmptyValue(props.reportOutput) ? props.reportMetadata.name : props.reportOutput.name
    )
    const isTemplateSelected = ref(false)
    const markdownContent = ref(store.getters.getDefaultBody)
    const oldContent = ref(markdownContent.value)
    const allReport = ref(false)
    const pageSize = computed(() => {
      if (isEmptyValue(props.reportOutput)) {
        return 25
      }
      if (!allReport.value) {
        return props.reportOutput.pageSize
      }
      return props.reportOutput.record_count
    })
    const pageToken = computed(() => {
      if (isEmptyValue(props.reportOutput)) {
        return 1
      }
      return props.reportOutput.pageToken
    })
    function isToolbar() {
      isTemplateSelected.value = true
      nextTick(() => {
        updateMardown(markdownContent.value)
      })
    }
    function updateMardown(newValue) {
      const newContent = newValue.trim()
      const value = newContent.replace(oldContent.value.trim(), '').trim()
      const link = language.t('report.reportEnginer.urlPublic')
      oldContent.value = newContent
      if (isTemplateSelected.value) {
        storedMailTemplatesList.value.menus.forEach((data) => {
          const mailText = data.mail_text ? data.mail_text.trim() : ''
          if (mailText.includes(value)) {
            const padding = '\n'.repeat(10)
            markdownContent.value = `${mailText}${padding}[${link}](http://www.123892138.com)`
          }
        })
      }
      isTemplateSelected.value = false
      store.commit('setDefaultBody', markdownContent.value)
    }
    const getStoreReport = computed(() => {
      let containerUuid = ''
      if (!isEmptyValue(props.reportMetadata)) {
        containerUuid = props.reportMetadata.containerUuid
      }
      if (isEmptyValue(containerUuid)) {
        containerUuid = props.reportOutput.containerUuid
      }
      return store.getters.getStoredReport(containerUuid)
    })
    function loadData() {
      isLoading.value = true
      requestShareResources({
        fileName: titleDocument.value,
        seconds: validTime.value
      })
        .then(response => {
          linkShare.value = response
        })
        .finally(() => {
          isLoading.value = false
        })
    }
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
      if (checkedItemGeneral.value === 0) {
        downloadFile()
      } else if (checkedItemGeneral.value === 1) {
        sendLink()
      } else if (checkedItemGeneral.value === 2) {
        shareUrl()
      }
      showNotification({
        title: this.$t('notifications.processing'),
        message: titleDocument.value,
        type: 'info'
      })
      store.commit('setShowDialog', false)
    }
    const isSummary = computed(() => {
      return store.getters.getIsSummary
    })
    function downloadFile() {
      store.dispatch('exportReport', {
        reportId: getStoreReport.value.internal_id,
        reportName: titleDocument.value,
        printFormatId: getStoreReport.value.print_format_id,
        reportViewId: getStoreReport.value.report_view_id,
        containerUuid: getStoreReport.value.containerUuid,
        pageSize: pageSize.value,
        pageToken: pageToken.value,
        isSummary: isSummary.value,
        isLegacy: props.isLegacy
      })
      blankValue()
    }
    function shareUrl() {
      store.dispatch('exportReport', {
        reportId: getStoreReport.value.internal_id,
        reportName: titleDocument.value,
        printFormatId: getStoreReport.value.print_format_id,
        reportViewId: getStoreReport.value.report_view_id,
        seconds: validTime.value,
        isDownload: false,
        containerUuid: getStoreReport.value.containerUuid,
        pageSize: pageSize.value,
        pageToken: pageToken.value,
        isSummary: isSummary.value,
        isLegacy: props.isLegacy
      })
        .then(fileNameResource => {
          if (isEmptyValue(fileNameResource)) {
            showNotification({
              title: 'Error',
              message: `Error exporting report: URL Found.`,
              type: 'error'
            })
            return
          }
          requestShareResources({
            fileName: fileNameResource,
            seconds: validTime.value
          })
            .then(response => {
              let link = ''
              if (!isEmptyValue(response)) {
                link = response
                markdownContent.value = markdownContent.value.replace('www.123892138.com', link)
              }
              linkShare.value = link
              copyValue()
              showNotificationReport({
                title: 'Reporte Compartido',
                message: 'Su Enlace a Sido Copiado Exitosamente al Portapapeles',
                link: response,
                openLink: 'Abrir Enlace'
              })
            })
            .catch(error => {
              showNotification({
                title: 'Error',
                message: `Error exporting report: ${error.message}.`,
                type: 'error'
              })
            })
            .finally(() => {
              blankValue()
            })
        })
    }

    function handleDownload() {
      const link = document.createElement('a')
      const imageURL = config.adempiere.api.url + 'resources/' + titleDocument.value
      link.href = imageURL
      link.download = titleDocument.value
      link.click()
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
    watch(contactSend, () => {
      disableButtom()
    })
    watch(typeNotify, () => {
      disableButtom()
    })
    function disableButtom() {
      return checkedItemGeneral.value === 1 && (isEmptyValue(typeNotify.value) || isEmptyValue(contactSend.value))
    }
    function sendLink() {
      const user_id = store.getters['user/userInfo'].id
      store.dispatch('exportReport', {
        reportId: getStoreReport.value.internal_id,
        reportName: titleDocument.value,
        printFormatId: getStoreReport.value.print_format_id,
        reportViewId: getStoreReport.value.report_view_id,
        seconds: validTime.value,
        isDownload: false,
        containerUuid: getStoreReport.value.containerUuid,
        pageSize: pageSize.value,
        pageToken: pageToken.value,
        isSummary: isSummary.value,
        isLegacy: props.isLegacy
      })
        .then(fileNameResource => {
          if (isEmptyValue(fileNameResource)) {
            showNotification({
              title: 'Error',
              message: `Error exporting report: URL Found.`,
              type: 'error'
            })
            return
          }
          requestShareResources({
            fileName: fileNameResource,
            seconds: validTime.value
          })
            .then(response => {
              let link = ''
              if (!isEmptyValue(response)) {
                link = response
                markdownContent.value = markdownContent.value.replace('www.123892138.com', link)
              }
              linkShare.value = link
              const htmlContent = marked(markdownContent.value)
              store.dispatch('sendNotification', {
                user_id,
                title: titleDocument.value,
                recipients: contactSend.value,
                notification_type: typeNotify.value,
                attachments: fileNameResource,
                subject: htmlContent
              })
            })
            .finally(() => {
              blankValue()
            })
        })
    }
    function blankValue() {
      store.commit('setContactSend', '')
      store.commit('setTypeNotify', '')
      titleDocument.value = isEmptyValue(props.reportOutput) ? props.reportMetadata.name : props.reportOutput.name
      let menuDefault = ''
      if (!isEmptyValue(storedMailTemplatesList.value) && !isEmptyValue(storedMailTemplatesList.value.menus)) {
        menuDefault = storedMailTemplatesList.value.menus[0].mail_text
      }
      const link = language.t('report.reportEnginer.urlPublic')
      const padding = '\n'.repeat(10)
      markdownContent.value = menuDefault + `${padding}[${link}](www.123892138.com)`
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

    function previwerBody() {
      isShowVIwer.value = !isShowVIwer.value
    }

    function updateContent(content) {
      markdownContent.value = content
    }
    blankValue()
    return {
      isCollapseComments,
      editorToolbarList,
      checkedItemGeneral,
      checkedItem,
      isShowVIwer,
      printFormat,
      printFormatValue,
      exportData,
      disableButtom,
      typeNotify,
      contactSend,
      linkShare,
      isLoading,
      validTime,
      titleDocument,
      oldContent,
      isSummary,
      showDialog,
      shortsKey,
      pageToken,
      updateContent,
      updateMardown,
      copyToClipboard,
      handleDownload,
      getOptionFormat,
      viewShowDialog,
      setCheckedItemGeneral,
      sendNotify,
      sendLink,
      copyValue,
      loadData,
      previwerBody,
      downloadFile,
      isToolbar,
      blankValue,
      markdownContent,
      isTemplateSelected,
      allReport,
      pageSize
    }
  }
})
</script>

<style>
.el-card__header {
  padding: 0px 20px !important;
}
.radio-padding {
  padding-left: 5%;
}
</style>
