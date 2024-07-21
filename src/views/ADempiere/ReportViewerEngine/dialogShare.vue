<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.optionsImport.format') }}</p>
          </template>
          <el-row :gutter="12">
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
    <el-row :gutter="12" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <p>{{ $t('report.reportEnginer.optionsImport.sendDownload') }}</p>
          </template>
          <el-row :gutter="12">
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-checkbox
                :value="checkedItemGeneral === 0"
                :label="$t('report.reportEnginer.optionsImport.download')"
                label-position="left"
                style="font-size: 18px;"
                @change="setCheckedItemGeneral(0)"
              />
            </el-col>
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-checkbox
                :value="checkedItemGeneral === 1"
                :label="$t('report.reportEnginer.optionsImport.send')"
                label-position="left"
                style="font-size: 18px;"
                @change="setCheckedItemGeneral(1)"
              />
            </el-col>
            <el-col :span="6" style="width: 30%; text-align: center;">
              <el-checkbox
                :label="$t('report.reportEnginer.optionsImport.copyLink')"
                :value="checkedItemGeneral === 3"
                label-position="left"
                style="font-size: 18px;"
                @change="setCheckedItemGeneral(3)"
              />
            </el-col>
          </el-row>
          <el-row v-if="checkedItemGeneral === 1" :gutter="12" style="margin-top: 25px; display: flex; justify-content: center;">
            <el-col :span="6" style="width: 60%;">
              <p>{{ $t('report.reportEnginer.optionsImport.typeNotify') }}</p>
              <el-select
                @visible-change="getOptionFormat"
              >
                <el-option
                  v-for="(item, key) in optionTypeFormat.childs"
                  :key="key"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-col>
            <el-col :span="6" style="width: 30%;">
              <p>{{ $t('report.reportEnginer.optionsImport.contactsSend') }}</p>
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
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" style="margin-top: 20px;">
      <el-button
        class="button-base-icon"
        icon="el-icon-check"
        style="float: right; "
        type="primary"
        @click="viewShowDialog"
      />
      <el-button
        class="button-base-icon"
        icon="el-icon-close"
        style="float: right;margin-right: 1%;"
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

export default defineComponent({
  name: 'dialogShareReport',
  props: {
    containerUuid: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const checkedItemGeneral = ref(0)
    const checkedItem = ref(0)
    const optionTypeFormat = ref([])
    function setCheckedItemGeneral(check) {
      checkedItemGeneral.value = check
    }
    function setCheckedItem(check) {
      checkedItem.value = check
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
    return {
      optionTypeFormat,
      checkedItemGeneral,
      checkedItem,
      getOptionFormat,
      viewShowDialog,
      setCheckedItemGeneral,
      setCheckedItem
    }
  }
})
</script>
<style>
.el-card__header{
  padding: 0px 20px !important;
}
</style>
