<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div v-if="isLoaded" key="window-loaded" class="view-base" style="height: 100% !important;width: 100% !important;/* display: contents; */overflow: auto;">
    <el-container style="height: 100% !important;display: block;overflow: auto;">
      <el-aside :style="styleContainer">
        <component
          :is="renderWindowComponent"
          :window-manager="containerManagerWindow"
          :window-metadata="windowMetadata"
          :process-uuid="processWindowsUuid"
          :container-manager-process="containerManagerProcess"
        />
      </el-aside>
    </el-container>
  </div>

  <loading-view
    v-else
    key="window-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinProcess from '@/views/ADempiere/Process/mixinProcess.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertWindow } from '@/utils/ADempiere/apiConverts/dictionary.js'
import {
  containerManager
} from '@/utils/ADempiere/dictionary/window.js'

export default defineComponent({
  name: 'Window',

  components: {
    LoadingView
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    },
    metadata: {
      type: Object,
      default: () => {}
    },
    containerManager: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const containerManagerProcess = ref({})

    let containerManagerWindow = {
      ...containerManager
    }
    if (!isEmptyValue(props.containerManager)) {
      containerManagerWindow = {
        ...containerManagerWindow,
        // overwirte methods
        ...props.containerManager
      }
    }

    const isLoaded = ref(false)
    const windowMetadata = ref({})

    let windowUuid = root.$route.meta.uuid
    // set uuid from test
    if (!isEmptyValue(props.uuid)) {
      windowUuid = props.uuid
    }

    const storedWindow = computed(() => {
      return store.getters.getStoredWindow(windowUuid)
    })

    const styleContainer = computed(() => {
      const getFullGridMode = store.getters['settings/getFullGridMode']
      if (currentTab.value.isShowedTableRecords && getFullGridMode) {
        return 'width: 100%; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; padding-left: 3px;overflow: auto;display: contents'
      }
      if (isEmptyValue(currentTab.value.childTabs)) {
        return 'width: 100%; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; padding-left: 3px;overflow: auto;display: contents'
      }
      return 'width: 100%; margin-bottom: 0px; padding-top: 0px; padding-bottom: 10px; padding-right: 0px; padding-left: 3px;overflow: auto;'
      // if (storedWindow.value.isFullScreenTabsParent || storedWindow.value.isFullScreenTabsChildren) {
      //   return 'width: 100%; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px; padding-right: 10px; padding-left: 3px;overflow: auto;'
      // }
      // return 'width: 100%; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px; padding-right: 10px; padding-left: 3px;overflow: auto;height: 100%;'
    })

    const currentTab = computed(() => {
      return store.getters.getStoredWindow(windowUuid).currentTab
    })

    function setLoadWindow(window) {
      windowMetadata.value = window
      isLoaded.value = true
    }

    // get window from vuex store or request from server
    function getWindow() {
      let window = storedWindow.value
      if (!isEmptyValue(window)) {
        generateWindow()
        setLoadWindow(window)
        return
      }
      // metadata props use for test
      if (!isEmptyValue(props.metadata)) {
        // from server response
        window = convertWindow(props.metadata)
        // add apps properties
        window = generateWindow(window)
        // add into store
        return store.dispatch('addWindow', window)
          .then(windowResponse => {
            // to obtain the load effect
            setTimeout(() => {
              setLoadWindow(windowResponse)
            }, 1000)
          })
      }
      store.dispatch('getWindowDefinitionFromServer', {
        uuid: windowUuid
      })
        .then(windowResponse => {
          // add apps properties
          setLoadWindow(windowResponse)
          generateWindow()
        })
    }

    const renderWindowComponent = computed(() => {
      let windowComponent
      switch (windowMetadata.value.windowType) {
        case 'SO':
        case 'PO':
        case 'T':
        case 'M':
          windowComponent = () => import('@/views/ADempiere/Window/DocumentWindow.vue')
          break
        case 'MM':
          windowComponent = () => import('@/views/ADempiere/Window/MaterialsManagement.vue')
          break
        case 'FI':
          windowComponent = () => import('@/views/ADempiere/Window/Finances.vue')
          break
        case 'GL':
          windowComponent = () => import('@/views/ADempiere/Window/GeneralLedger.vue')
          break
        default:
          windowComponent = () => import('@/views/ADempiere/Window/MultiTabWindow.vue')
          break
      }
      // const windowComponent = () => import('@/views/ADempiere/Window/MultiTabWindow.vue')

      return windowComponent
    })

    const processWindowsUuid = computed(() => {
      const storeWindows = store.getters.getProcessWindowsSelect
      if (isEmptyValue(storeWindows)) {
        return ''
      }
      return storeWindows
    })
    function generateWindow() {
      const { containerManager: containerManagerByProcess } = mixinProcess(processWindowsUuid)
      containerManagerProcess.value = containerManagerByProcess
    }
    // load metadata and generate window
    getWindow()

    return {
      windowUuid,
      containerManagerWindow,
      windowMetadata,
      containerManagerProcess,
      // computed
      processWindowsUuid,
      renderWindowComponent,
      isLoaded,
      styleContainer,
      currentTab
    }
  }
})
</script>
