<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-container style="height: 100%!important;">
    <el-main id="mainWindow" :style="(isMobile || isEmptyValue(windowMetadata.tabsListChild)) ? 'overflow: auto;' : 'overflow: hidden;'">
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
        :additional-options="additionalOptions"
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
    </el-main>
    <el-footer v-if="isWithChildsTab && !isMobile" id="footerWindow" :style="styleFullScreen">
      <tab-manager-child
        class="tab-manager"
        :parent-uuid="windowMetadata.uuid"
        :container-manager="containerManager"
        :tabs-list="windowMetadata.tabsListChild"
        :all-tabs-list="allTabsList"
        :references-manager="referencesManager"
        :actions-manager="actionsManager"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// components and mixins
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import Embedded from '@theme/components/ADempiere/Dialog/embedded'
import RecordAccess from '@theme/components/ADempiere/RecordAccess'
import ModalDialog from '@theme/components/ADempiere/ModalDialog/index.vue'
import TabManager from '@theme/components/ADempiere/TabManager/index.vue'
import TabManagerChild from '@theme/components/ADempiere/TabManager/tabChild.vue'

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'DocumentWindow',

  components: {
    ActionMenu,
    RecordAccess,
    Embedded,
    ModalDialog,
    TabManager,
    TabManagerChild
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

  setup(props, { root }) {
    const isWithChildsTab = computed(() => {
      return !isEmptyValue(props.windowMetadata.tabsListChild)
    })

    const allTabsList = ref([])

    const showRecordAccess = computed(() => {
      return store.getters.getShowPanelRecordAccess
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
          return 'height: 20% !important'
        } else if (props.windowMetadata.isFullScreenTabsChildren) {
          return 'height: 75% !important'
        }
      }

      return 'height: 50% !important'
    })

    const containerManager = {
      ...props.windowManager
    }

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

    const referencesManager = ref({
      getTableName: () => {
        const tabUuid = currentTabUuid.value
        const windowUuid = props.windowMetadata.uuid
        return store.getters.getTableName(windowUuid, tabUuid)
      }
    })

    if (props.windowMetadata.tabsList) {
      allTabsList.value = props.windowMetadata.tabsList
    }

    const recordUuid = computed(() => {
      const record = store.getters.getUuidOfContainer(currentTabUuid.value)
      const action = root.$route.query.action
      if (isEmptyValue(record) && isEmptyValue(action)) {
        return
      }
      return isEmptyValue(record) ? action : record
    })
    const additionalOptions = ref({})

    function loaDocument(params) {
      if (isEmptyValue(recordUuid.value)) {
        return
      }
      store.dispatch('listDocumentActionStatus', {
        tableName: referencesManager.value.getTableName(),
        recordUuid: recordUuid.value
      })
        .then(response => {
          const { documentActionsList, defaultDocumentAction } = response
          additionalOptions.value = {
            currentDocument: defaultDocumentAction,
            options: documentActionsList
          }
        })
    }

    watch(recordUuid, (newValue, oldValue) => {
      if (newValue !== oldValue && !isEmptyValue(newValue)) {
        loaDocument()
        store.dispatch('listDocumentStatus', {
          tableName: referencesManager.value.getTableName(),
          recordUuid: recordUuid.value,
          containerUuid: currentTabUuid.value
        })
          .then(response => {
            const { documentActionsList } = response
            store.commit('setWorkFlowActions', {
              containerUuid: currentTabUuid.value,
              options: documentActionsList
            })
          })
      }
    })

    return {
      recordUuid,
      currentTabUuid,
      allTabsList,
      referencesManager,
      actionsManager,
      showRecordAccess,
      isWithChildsTab,
      containerManager,
      isMobile,
      styleFullScreen,
      loaDocument,
      additionalOptions
    }
  }

})
</script>

<style>
.el-footer {
  height: 50% !important;
  overflow: hidden;
}
.el-main {
  padding-top: 0px;
  padding-bottom: 0px;
}
.tab-manager {
  height: 100%;
}
</style>
