<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div style="padding: 5px;">
    <div style="height: 5% !important;">
      <el-steps :active="currentSetp" finish-status="success">
        <el-step
          v-for="(list, key) in stepList"
          :key="key"
          :title="list.name"
        />
      </el-steps>
    </div>

    <div style="height: 90% !important;">
      <transition name="el-fade-in-linear">
        <selectTable
          v-if="currentSetp === 1"
        >
          <template v-slot:footer>
            <el-button
              type="info"
              class="button-base-icon"
              icon="el-icon-arrow-right"
              style="float: right;margin-right: 10px;margin-top: 10px;"
              :disabled="isDisableNextTable"
              @click="nextStep"
            />
            <el-button
              plain
              type="info"
              class="button-base-icon"
              style="float: right;margin-right: 10px;margin-top: 10px;"
              @click="actionClear"
            >
              <svg-icon icon-class="layers-clear" />
            </el-button>
          </template>
        </selectTable>

        <select-file
          v-if="currentSetp === 2"
        >
          <template v-slot:footer>
            <el-button
              type="info"
              class="button-base-icon"
              icon="el-icon-arrow-right"
              style="float: right;margin-right: 10px;margin-top: 10px;"
              :disabled="disabledNextStepSave"
              @click="nextStep"
            />
            <el-button
              type="info"
              class="button-base-icon"
              icon="el-icon-arrow-left"
              style="float: right;margin-right: 10px;margin-top: 10px;"
              @click="prevStep"
            />
            <span v-if="!showNavegationTable">
              <el-button
                type="success"
                plain
                size="small"
                style="float: right;margin-right: 0px;margin-top: 10px;"
                @click="changePrevLine"
              >
                <i class="el-icon-arrow-up" style="font-size: 16px;" />
              </el-button>
              <el-button
                type="success"
                plain
                size="small"
                style="float: right;margin-right: 10px;margin-top: 10px;"
                @click="changeNextLine"
              >
                <i class="el-icon-arrow-down" style="font-size: 16px;" />
              </el-button>
            </span>
          </template>
        </select-file>

        <saveProcess
          v-if="currentSetp === 3"
        >
          <template v-slot:footer>
            <el-button
              type="primary"
              class="button-base-icon"
              icon="el-icon-check"
              style="float: right;margin-right: 10px;margin-top: 10px;"
              :loading="isLoadSave"
              @click="saveImport"
            />
            <el-button
              type="info"
              class="button-base-icon"
              icon="el-icon-arrow-left"
              style="float: right;margin-right: 10px;margin-top: 10px;"
              @click="prevStep"
            />
          </template>
        </saveProcess>
      </transition>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// API Request Methods
import { saveRecordImport } from '@/api/ADempiere/form/VFileImport.js'

// Components and Mixins
import SelectTable from './SelectTable/index.vue'
import SelectFile from './SelectFile'
import SaveProcess from './saveProcess.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'

/**
 * Based on:
 * org.compiere.apps.form.VFileImport
 * org.adempiere.webui.apps.form.WFileImport
 */
export default defineComponent({
  name: 'VFileImport',

  components: {
    SelectTable,
    SelectFile,
    SaveProcess
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup() {
    /**
    * Refs
    */
    const previewRowIndex = computed({
      set(index) {
        store.commit('setIndexRecordPreview', index)
      },
      get() {
        return store.getters.getIndexRecordPreview
      }
    })

    const stepList = ref([
      {
        name: lang.t('form.VFileImport.step.selectTable')
      },
      {
        name: lang.t('form.VFileImport.step.configureToImport')
      },
      {
        name: lang.t('form.VFileImport.step.saveAndProcess')
      }
    ])

    const isLoadSave = ref(false)

    const storedTableName = computed(() => {
      return store.getters.getStoredCurrentTableName
    })

    const currentSetp = computed({
      // getter
      get() {
        const { currentStep } = store.getters.getAttribute
        return currentStep
      },
      // setter
      set(value) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'currentStep',
          value: value
        })
      }
    })

    const isBack = computed(() => {
      return currentSetp.value === 1
    })

    const isNext = computed(() => {
      return currentSetp.value === 3
    })

    const initialSept = computed(() => {
      return currentSetp.value - 1
    })

    const label = computed(() => {
      if (currentSetp.value === 3) {
        return lang.t('VBankStatementMatch.steps.summaryAdjustment')
      }
      return ''
    })

    const validate = computed(() => {
      const { matchMode, bankAccounts } = store.getters.getCriteriaVBankStatement
      return isEmptyValue(bankAccounts.id) || isEmptyValue(matchMode.value)
    })

    const isDisableNextTable = computed(() => {
      const {
        charsets,
        importFormatId
      } = store.getters.getAttribute
      return isEmptyValue(storedTableName.value) ||
        isEmptyValue(charsets) ||
        isEmptyValue(importFormatId)
    })

    const showNavegationTable = computed(() => {
      const {
        data,
        header
      } = store.getters.getFile
      return isEmptyValue(data) && isEmptyValue(header)
    })

    const disabledNextStepSave = computed(() => {
      const { resource } = store.getters.getFile
      return isEmptyValue(resource.id)
    })

    function nextStep(steps) {
      currentSetp.value++
    }

    function prevStep(steps) {
      currentSetp.value--
    }

    function actionClear() {
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'tablaId',
        value: undefined
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'charsets',
        value: ''
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'importFormatId',
        value: ''
      })
    }

    function changeNextLine() {
      const { data } = store.getters.getFile
      if (previewRowIndex.value === 99) {
        // last record
        return
      }
      previewRowIndex.value++
      store.commit('setNavigationLine', data[previewRowIndex.value])
    }

    function changePrevLine() {
      const { data } = store.getters.getFile
      if (previewRowIndex.value === 0) {
        // first record
        return
      }
      previewRowIndex.value--
      store.commit('setNavigationLine', data[previewRowIndex.value])
    }

    function saveImport() {
      const {
        charsets,
        importFormatId
      } = store.getters.getAttribute
      const { resource } = store.getters.getFile
      isLoadSave.value = true
      saveRecordImport({
        id: resource.id,
        charset: charsets,
        importFormatId: importFormatId
      })
        .then(response => {
          const { message } = response
          showMessage({
            message: message,
            type: 'success'
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
        .finally(() => {
          isLoadSave.value = false
        })
    }

    return {
      isLoadSave,
      stepList,
      currentSetp,
      isBack,
      isNext,
      label,
      initialSept,
      isDisableNextTable,
      validate,
      disabledNextStepSave,
      showNavegationTable,
      prevStep,
      nextStep,
      saveImport,
      actionClear,
      changePrevLine,
      changeNextLine
    }
  }
})
</script>

<style scoped>
.carousel-panel {
  height: 100% !important;
  padding: 10px 0px;
}
.el-carousel__item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  z-index: 0;
  height: auto;
}
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
