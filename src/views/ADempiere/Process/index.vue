<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div
    v-if="isLoadedMetadata"
    id="process-loaded"
  >
    <el-card class="content-collapse card-report" style="overflow: auto;position: absolute;">
      <title-and-help
        :name="processMetadata.name"
        :help="processMetadata.help"
      />

      <div id="process-loaded">
        <p style="text-align: end;">
          <action-menu
            id="action-menu"
            :container-uuid="processUuid"
            :container-manager="containerManager"
            :actions-manager="actionsManager"
          />
        </p>
        <!-- <br> -->
        <!-- style="float: right;padding-left: 1%;z-index: 99;" -->
        <panel-definition
          id="panel-definition"
          :container-uuid="processUuid"
          :container-manager="containerManager"
          :is-tab-panel="true"
        />
        <br>
      </div>

      <panel-footer
        :container-uuid="processUuid"
        :is-button-run="true"
        :is-button-clear="true"
        :is-button-close="true"
        :action-run="runProcess"
        :action-clear="clearParameters"
      />
    </el-card>
  </div>

  <loading-view
    v-else
    key="process-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinProcess from '@/views/ADempiere/Process/mixinProcess.js'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'
import PanelFooter from '@/components/ADempiere/PanelFooter/index.vue'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
// import { convertProcess } from '@/utils/ADempiere/apiConverts/dictionary.js'
// import { generateProcess } from '@/utils/ADempiere/dictionary/process.js'

export default defineComponent({
  name: 'ProcessView',

  components: {
    ActionMenu,
    LoadingView,
    PanelDefinition,
    TitleAndHelp,
    PanelFooter
  },

  setup() {
    const isLoadedMetadata = ref(false)
    const processMetadata = ref({})

    const currentRoute = router.app._route
    const processId = currentRoute.meta.id
    const processUuid = currentRoute.meta.uuid

    const {
      actionsManager, containerManager, storedProcessDefinition
    } = mixinProcess({
      processId,
      processUuid
    })

    const showContextMenu = computed(() => {
      return store.state.settings.showContextMenu
    })

    store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    // get process/report from vuex store or request from server
    const getProcess = async() => {
      const process = storedProcessDefinition.value
      if (process) {
        processMetadata.value = process
        isLoadedMetadata.value = true
        return
      }

      // // metadata props use for test
      // if (!isEmptyValue(props.metadata)) {
      //   // from server response
      //   process = convertProcess(props.metadata)
      //   // add apps properties
      //   process = generateProcess(process)
      //   // add into store
      //   return store.dispatch('addProcess', process)
      //     .then(processResponse => {
      //       // to obtain the load effect
      //       setTimeout(() => {
      //         processMetadata.value = processResponse
      //         isLoadedMetadata.value = true
      //       }, 1000)
      //     })
      // }

      store.dispatch('getProcessDefinitionFromServer', {
        id: processId
      })
        .then(processResponse => {
          processMetadata.value = processResponse
        }).catch(error => {
          console.warn(error)
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    function runProcess() {
      store.dispatch('startProcess', {
        containerUuid: processUuid
      })
    }

    function clearParameters() {
      store.dispatch('setProcessDefaultValues', {
        containerUuid: processUuid
      })
    }

    getProcess()

    return {
      processId,
      processUuid,
      isLoadedMetadata,
      processMetadata,
      // Computeds
      showContextMenu,
      // Methods
      runProcess,
      getProcess,
      clearParameters,
      // Common Mixin
      actionsManager,
      containerManager
    }
  }
})
</script>

<style lang="scss">
.process-view {
  .card-process {
    >.el-card__body {
      padding-top: 0px;
      padding-right: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      height: 100%;
    }
  }
}
</style>
<style scoped>
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
  .scroll-tab-process {
    width: 100% !important;
    height: 95%!important;
    max-height: 120%!important;
  }
</style>
