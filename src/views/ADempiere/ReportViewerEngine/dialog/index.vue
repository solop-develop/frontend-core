<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="24">
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
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item>
                      <template slot="label">
                        {{ $t('report.reportEnginer.optionsImport.typeNotify') }}
                      </template>
                      <el-select @visible-change="getOptionFormat">
                        <el-option
                          v-for="(item, key) in optionTypeFormat.childs"
                          :key="key"
                          :label="item.name"
                          :value="item.type"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <template slot="label">
                        {{ $t('report.reportEnginer.optionsImport.contactsSend') }}
                      </template>
                      <el-select
                        placeholder="Select an option"
                        @visible-change="getOptionFormat"
                      >
                        <el-option
                          v-for="(item, key) in optionTypeFormat.childs"
                          :key="key"
                          :label="item.name"
                          :value="item.type"
                        />
                      </el-select>
                    </el-form-item>
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
            <el-button
              slot="reference"
              icon="el-icon-share"
              plain
              @click="loadData()"
            />
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" style="margin-top: 70px;">
      <el-button
        class="button-base-icon"
        icon="el-icon-check"
        style="float: right;"
        type="primary"
        @click="checkedItemGeneral === 0 ? handleDownload() : viewShowDialog()"
      />
      <el-button
        class="button-base-icon"
        icon="el-icon-close"
        style="float: right; margin-right: 1%;"
        type="danger"
        @click="viewShowDialog"
      />
    </el-row>
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, ref } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  requestShareResources
} from '@/api/ADempiere/file-management/resource-reference.ts'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { config } from '@/utils/ADempiere/config'
export default defineComponent({
  name: 'dialogShareReport',
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
    const optionTypeFormat = ref([])
    const validTime = ref(3600)
    const linkShare = ref('')
    const isLoading = ref(false)
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
    function handleDownload() {
      const link = document.createElement('a')
      const imageURL = config.adempiere.resource.url + props.reportOutput.name
      link.href = imageURL
      link.download = props.reportOutput.name
      link.click()
    }
    loadData()
    return {
      optionTypeFormat,
      checkedItemGeneral,
      checkedItem,
      validTime,
      linkShare,
      isLoading,
      handleDownload,
      getOptionFormat,
      viewShowDialog,
      setCheckedItemGeneral,
      loadData,
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
