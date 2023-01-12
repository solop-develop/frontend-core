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
  <div style="height: 99% !important;width: 100% !important;">
    <div id="tab-manager" :style="sizeTab">
      <embedded
        :visible="showRecordAccess"
      >
        <record-access />
      </embedded>

      <tab-manager
        ref="tab-manager"
        class="tab-manager"
        :parent-uuid="windowMetadata.uuid"
        :container-manager="containerManager"
        :tabs-list="windowMetadata.tabsListParent"
        :all-tabs-list="allTabsList"
        :references-manager="referencesManager"
        :actions-manager="actionsManager"
      />
      <tab-manager-child
        v-if="isWithChildsTab && isMobile"
        class="tab-manager"
        :parent-uuid="windowMetadata.uuid"
        :container-manager="containerManager"
        :tabs-list="windowMetadata.tabsListChild"
        :all-tabs-list="allTabsList"
        :references-manager="referencesManager"
        :actions-manager="actionsManager"
      />
      <modal-dialog
        v-if="!isEmptyValue(processUuid)"
        :container-manager="containerManagerProcess"
        :parent-uuid="currentTabUuid"
        :container-uuid="processUuid"
      />
    </div>

    <div v-if="isWithChildsTab" id="tab-manager-child" :style="sizeTabChild">
      <tab-manager-child
        class="tab-manager"
        :parent-uuid="windowMetadata.uuid"
        :container-manager="containerManager"
        :tabs-list="windowMetadata.tabsListChild"
        :all-tabs-list="allTabsList"
        :references-manager="referencesManager"
        :actions-manager="actionsManager"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// Components and Mixins
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@theme/components/ADempiere/LoadingView/index.vue'
import Embedded from '@theme/components/ADempiere/Dialog/embedded'
import RecordAccess from '@theme/components/ADempiere/RecordAccess'
import ModalDialog from '@theme/components/ADempiere/ModalDialog/index.vue'
import TabManager from '@theme/components/ADempiere/TabManager/index.vue'
import TabManagerChild from '@theme/components/ADempiere/TabManager/tabChild.vue'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import useFullScreenContainer from '@theme/components/ADempiere/ContainerOptions/FullScreenContainer/useFullScreenContainer'

export default defineComponent({
  name: 'MultiTabWindow',

  components: {
    ActionMenu,
    RecordAccess,
    Embedded,
    ModalDialog,
    TabManager,
    TabManagerChild,
    LoadingView
  },

  props: {
    windowMetadata: {
      type: Object,
      required: true
    },
    windowManager: {
      type: Object,
      required: true
    },
    processUuid: {
      type: String,
      required: true
    },
    containerManagerProcess: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    /**
     * Const
     */
    const containerManager = {
      ...props.windowManager
    }

    /**
     * Ref
     */
    const allTabsList = ref([])

    const isLoadWindows = ref(false)

    const index = ref(0)

    const referencesManager = ref({
      getTableName: () => {
        const tabUuid = currentTabUuid.value
        const windowUuid = props.windowMetadata.uuid
        return store.getters.getTableName(windowUuid, tabUuid)
      }
    })

    /**
     * Computed
     */
    const isWithChildsTab = computed(() => {
      if (store.getters['settings/getFullGridMode'] && props.windowMetadata.currentTab.isShowedTableRecords) return false
      return !isEmptyValue(props.windowMetadata.tabsListChild)
    })

    const showRecordAccess = computed(() => {
      return store.getters.getShowPanelRecordAccess
    })

    const settingsFullGridMode = computed(() => {
      return store.state.settings.fullGridMode
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const currentTabUuid = computed(() => {
      return store.getters.getCurrentTab(props.windowMetadata.uuid).uuid
    })

    const styleFullScreen = computed(() => {
      if (!isWithChildsTab.value) {
        return 'height: 0% !important'
      } else {
        if (props.windowMetadata.isFullScreenTabsParent) {
          return 'height: 550px !important'
        // } else if (!isEmptyVAlue(props.windowMetadata.isFullScreenTabsChildren) && props.windowMetadata.isFullScreenTabsChildren) {
        //   return 'height: 550px !important'
        }
      }

      return 'height: 50% !important'
    })

    const isViewFullScreenChild = computed(() => {
      const { isViewFullScreenChild } = useFullScreenContainer({
        parentUuid: props.windowMetadata.currentTabChild.parentUuid,
        containerUuid: props.windowMetadata.currentTabChild.containerUuid
      })
      return isViewFullScreenChild.value
    })

    const isViewFullScreenParent = computed(() => {
      const { isViewFullScreenParent } = useFullScreenContainer({
        parentUuid: props.windowMetadata.currentTab.parentUuid,
        containerUuid: props.windowMetadata.currentTab.containerUuid
      })
      return isViewFullScreenParent.value
    })

    const sizeTab = computed(() => {
      if (!isWithChildsTab.value) {
        return 'height: 100% !important'
      }
      if (isViewFullScreenParent.value) {
        return 'height: 80% !important'
      }
      return 'height: 50% !important'
    })

    const sizeTabChild = computed(() => {
      if (isViewFullScreenChild.value) {
        return 'height: 80% !important'
      }
      return 'height: 50% !important'
    })

    const actionsManager = computed(() => {
      return {
        parentUuid: props.windowMetadata.uuid,
        containerUuid: currentTabUuid.value,
        defaultActionName: language.t('actionMenu.createNewRecord'),
        tableName: store.getters.getTableName(props.windowMetadata.uuid, currentTabUuid.value),
        getActionList: () => {
          return store.getters.getStoredActionsMenu({
            containerUuid: currentTabUuid.value
          })
        }
      }
    })

    const isFullGrid = computed(() => {
      return props.windowMetadata.currentTab.isParentTab && props.windowMetadata.currentTab.isShowedTableRecords
    })

    /**
     * Watch
     */

    watch(isFullGrid, (newValue, oldValue) => {
      if (settingsFullGridMode.value && !newValue && isWithChildsTab.value && index.value === 0) {
        index.value = 1
        isLoadWindows.value = true
        setTimeout(() => {
          isLoadWindows.value = false
        }, 500)
      }
    })

    if (props.windowMetadata.tabsList) {
      allTabsList.value = props.windowMetadata.tabsList
    }

    return {
      // Const
      containerManager,
      // Ref
      allTabsList,
      isLoadWindows,
      index,
      referencesManager,
      // Computed
      isWithChildsTab,
      showRecordAccess,
      settingsFullGridMode,
      isMobile,
      currentTabUuid,
      styleFullScreen,
      isViewFullScreenChild,
      isViewFullScreenParent,
      sizeTab,
      sizeTabChild,
      actionsManager,
      isFullGrid
    }
  }

})
</script>

<style>
.el-main {
  padding-top: 0px;
  padding-bottom: 0px;
}
.tab-manager {
  height: 100%;
}
</style>
