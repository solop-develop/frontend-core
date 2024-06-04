<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-container
    class="process-view"
  >
    <el-main>
      <el-row>
        <el-col :span="24">
          <title-and-help
            :name="$t('page.exportDictionaryDefinition.title')"
            :help="$t('page.exportDictionaryDefinition.help')"
          />
        </el-col>
      </el-row>
      <p style="text-align: end;">
        <el-dropdown
          :split-button="true"
          type="primary"
          size="mini"
          trigger="click"
          :class="{ 'action-container': true }"
        >
          {{ $t('actionMenu.runProcess') }}
        </el-dropdown>
      </p>
      <el-card
        shadow="hover"
        class="box-card"
      >
        <el-form
          label-position="top"
          label-width="10px"
          class="form-base"
          :inline="true"
          size="mini"
          @submit.native.prevent="notSubmitForm"
        >
          <el-row :gutter="10">
            <el-col :span="spanColumn">
              <el-form-item
                :label="$t('page.exportDictionaryDefinition.menus')"
              >
                <el-switch
                  v-model="isMenu"
                  :active-text="$t('components.switchActiveText')"
                  :inactive-text="$t('components.switchInactiveText')"
                  active-color="#1890ff"
                  inactive-color="#DCDFE6"
                />
              </el-form-item>
            </el-col>
            <el-col :span="spanColumn">
              <el-form-item
                :label="$t('page.exportDictionaryDefinition.windows')"
              >
                <el-switch
                  v-model="isWindows"
                  :active-text="$t('components.switchActiveText')"
                  :inactive-text="$t('components.switchInactiveText')"
                  active-color="#1890ff"
                  inactive-color="#DCDFE6"
                />
              </el-form-item>
            </el-col>
            <el-col :span="spanColumn">
              <el-form-item
                :label="$t('page.exportDictionaryDefinition.process')"
              >
                <el-switch
                  v-model="isProcess"
                  :active-text="$t('components.switchActiveText')"
                  :inactive-text="$t('components.switchInactiveText')"
                  active-color="#1890ff"
                  inactive-color="#DCDFE6"
                />
              </el-form-item>
            </el-col>
            <el-col :span="spanColumn">
              <el-form-item
                :label="$t('page.exportDictionaryDefinition.browsers')"
              >
                <el-switch
                  v-model="isBrowsers"
                  :active-text="$t('components.switchActiveText')"
                  :inactive-text="$t('components.switchInactiveText')"
                  active-color="#1890ff"
                  inactive-color="#DCDFE6"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
    <el-footer>
      <panel-footer
        :container-uuid="UUID"
        :is-button-run="true"
        :is-button-clear="true"
        :is-button-close="true"
        :action-run="runProcess"
        :action-clear="clearParameters"
      />
    </el-footer>
  </el-container>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'
import router from '@/router'

// Component and Mixins
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'
import PanelFooter from '@/components/ADempiere/PanelFooter/index.vue'

// API Request Methods
import {
  requestRunBusinessProcess
} from '@/api/ADempiere/businessData/runBusinessProcess.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ExportDictionaryDefinition',

  components: {
    TitleAndHelp,
    PanelFooter
  },

  setup() {
    /**
     * Constants
     */
    const UUID = 'EXPORT_DICTIONARY_DEFINITION'

    /**
     * Ref
     */
    const isMenu = ref(true)
    const isWindows = ref(true)
    const isProcess = ref(true)
    const isBrowsers = ref(true)

    /**
     * Computed
     */
    const isMobile = computed(() => {
      return store.getters.device === 'mobile'
    })
    const spanColumn = computed(() => {
      return isMobile.value ? 12 : 6
    })

    /**
     * Methods
     */
    function runProcess() {
      const currentRoute = router.app._route
      const tabViewsVisited = store.getters.visitedViews
      store.dispatch('tagsView/delView', currentRoute)
      // go to back page
      const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
      router.push({
        path: oldRouter.path
      }, () => {})
      let isProcessedError = false
      let summary = ''
      const procesingNotification = {
        close: () => false
      }
      requestRunBusinessProcess({
        id: 54692,
        parameters: {
          ECA56_ExportMenu: isMenu.value,
          ECA56_ExportWindows: isWindows.value,
          ECA56_ExportProcess: isProcess.value,
          ECA56_ExportBrowsers: isBrowsers.value
        }
      })
        .then(runProcessRepsonse => {
          isProcessedError = runProcessRepsonse.is_error
          summary = runProcessRepsonse.summary
        })
        .catch(error => {
          isProcessedError = true
          summary = `Error Process: ${error.message}. Code: ${error.code}.`
          console.warn(summary)
        })
        .finally(() => {
          store.dispatch('finishProcess', {
            summary,
            name: lang.t('page.exportDictionaryDefinition.title'),
            isError: isProcessedError
          })
            .then(() => {
              // close runing process notification
              if (!isEmptyValue(procesingNotification)) {
                setTimeout(() => {
                  procesingNotification.close()
                }, 1000)
              }
            })
        })
    }

    function clearParameters() {
      isMenu.value = true
      isWindows.value = true
      isProcess.value = true
      isBrowsers.value = true
    }

    return {
      // Constants
      UUID,
      // Ref
      isMenu,
      isWindows,
      isProcess,
      isBrowsers,
      // Computed
      spanColumn,
      // Methods
      runProcess,
      clearParameters
    }
  }
})
</script>

<style lang="scss" scoped>
.v-pos {
  height: 90% !important;
  .buttons-and-options {
    text-align: left;
  }
  .order-info {
    text-align: right;
  }
}
.buttons-options {
  position: absolute;
  top: 45%;
}
.panel-options {
  padding: 0px;
}
.panel-main {
  padding-left: 0px;
}
</style>
