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
        </el-card>
      </el-col>
      <el-col v-if="checkedItemGeneral === 1" :span="24" style="margin-top: 1%">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.sendDetails') }}</p>
          </template>
          <div style="margin-bottom: 3%;">
            <label>{{ $t('report.reportEnginer.subject') }}</label>
            <el-input
              v-model="titleDocument"
            />
          </div>
          <v-md-editor
            v-if="!isShowVIwer"
            v-model="markdownContent"
            left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code | emoji listMailTemplates"
            right-toolbar="sync-scroll fullscreen"
            mode="edit"
            height="150px"
            :placeholder="$t('window.containerInfo.logWorkflow.addNote')"
            :toolbar="editorToolbarList"
          />
          <v-md-preview
            v-else
            :text="markdownContent"
            class="previwer-disable"
            style="padding: 0px"
            height="150px"
          />
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
        <el-checkbox
          v-model="isShowVIwer"
          :label="$t('issues.preview')"
          :border="true"
          style="float: right; margin-right: 1%;"
          class="button-base-icon"
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
import { showNotification } from '@/utils/ADempiere/notification'
import {
  requestShareResources
} from '@/api/ADempiere/file-management/resource-reference.ts'
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
    const storedMailTemplatesList = computed(() => {
      return store.getters.getListMailTemplates
    })
    const editorToolbarList = computed(() => {
      return {
        listMailTemplates: storedMailTemplatesList.value,
        isCollapseUp: {
          icon: 'el-icon-arrow-up',
          title: 'Collapse',
          action(editor) {
            isCollapseComments.value = !isCollapseComments.value
          }
        },
        isCollapseDown: {
          icon: 'el-icon-arrow-down',
          title: 'Collapse',
          action(editor) {
            isCollapseComments.value = !isCollapseComments.value
          }
        }
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
    const titleDocument = ref(props.reportOutput.name)
    const markdownContent = computed({
      // getter
      get() {
        return store.getters.getDefaultBody
      },
      // setter
      set(newValue) {
        store.commit('setDefaultBody', newValue)
      }
    })
    const toUser = computed(() => {
      return contactSend.value ? contactSend.value.map(item => item.label).join(', ') : ''
    })
    const getStoreReport = computed(() => {
      return store.getters.getStoredReport(props.reportOutput.containerUuid)
    })
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
        message: props.reportOutput.name,
        type: 'info'
      })
      store.commit('setShowDialog', false)
    }

    function downloadFile() {
      store.dispatch('exportReport', {
        reportId: getStoreReport.value.id,
        reportName: props.reportOutput.name,
        printFormatId: props.reportOutput.print_format_id,
        reportViewId: props.reportOutput.report_view_id
      })
    }

    function shareUrl() {
      store.dispatch('exportReport', {
        reportId: getStoreReport.value.id,
        reportName: props.reportOutput.name,
        printFormatId: props.reportOutput.print_format_id,
        reportViewId: props.reportOutput.report_view_id,
        seconds: validTime.value,
        isDownload: false
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
                markdownContent.replace('www.123892138.com', link)
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
        })
    }

    function handleDownload() {
      const link = document.createElement('a')
      const imageURL = config.adempiere.resource.url + props.reportOutput.name
      link.href = imageURL
      link.download = props.reportOutput.name
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
    const disableButtom = computed(() => {
      return checkedItemGeneral.value === 1 && (isEmptyValue(typeNotify.value) || isEmptyValue(contactSend.value))
    })
    function sendLink() {
      const user_id = store.getters['user/userInfo'].id
      store.dispatch('exportReport', {
        reportId: getStoreReport.value.id,
        reportName: props.reportOutput.name,
        printFormatId: props.reportOutput.print_format_id,
        reportViewId: props.reportOutput.report_view_id,
        seconds: validTime.value,
        isDownload: false
      })
        .then(fileNameResource => {
          store.dispatch('sendNotification', {
            user_id,
            title: props.reportOutput.name,
            recipients: contactSend.value,
            notification_type: typeNotify.value,
            attachments: fileNameResource,
            subject: markdownContent.value
          })
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

    function previwerBody() {
      isShowVIwer.value = !isShowVIwer.value
    }

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
      markdownContent,
      toUser
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
