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
 validateng with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-container style="height: 100% !important;overflow: hidden;">
    <el-main style="padding:0px; height: 100% !important;overflow: hidden;" class="tab-panel-info">
      <el-tabs
        v-model="nameTab"
        type="border-card"
        class="tab-panel-info"
        @tab-click="handleClick"
      >
        <template
          v-for="(tab, index) in listInfoPanel"
        >
          <el-tab-pane
            v-if="tab.show"
            :key="index"
            :name="tab.name"
            lazy
            style="height: -webkit-fill-available;"
          >
            <span slot="label">
              <svg-icon v-if="tab.svg" :icon-class="tab.iconClass" />
              <i v-else :class="tab.iconClass" />
              {{ tab.title }}
            </span>
            <component
              :is="tab.component"
              :container-uuid="currentTab.containerUuid"
              :table-name="allTabsList[0].tableName"
              :container-manager="containerManager"
              :parent-uuid="currentTab.parentUuid"
              :record-uuid="currentRecordUuid"
              :list="recordsListStoreProduct"
              :record-id="currentRecordId"
              :tab-uuid="currentTab.uuid"
              :is-loading="tab.isLoading"
              style="height: 95%;"
            />
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// Components and Mixins
import AcctViewer from '@/components/ADempiere/Form/AcctViewer'
import AttachmentManager from './Component/AttachmentManager/index.vue'
import RecordLogs from './Component/RecordLogs/index.vue'
import recordIssues from './Component/RecordIssues/index.vue'
import RecordNotes from './Component/RecordNotes/index.vue'
import ReferenceRecords from './Component/ReferenceRecords/index.vue'
import StoreProduct from './Component/storeProduct/index.vue'
import WorkflowLogs from './Component/workflowLogs/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import RecordDashboard from './Component/RecordDashboard/index.vue'

// API Request Methods
import { listProductStorage } from '@/api/ADempiere/form/storeProduct.js'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere'
import { isDisplayedField } from '@/utils/ADempiere/dictionary/window.js'

export default defineComponent({
  name: 'ContainerInfo',

  components: {
    AcctViewer,
    AttachmentManager,
    RecordLogs,
    RecordNotes,
    recordIssues,
    ReferenceRecords,
    StoreProduct,
    WorkflowLogs,
    RecordDashboard,
    LoadingView
  },

  props: {
    allTabsList: {
      type: Array,
      default: () => []
    },
    containerManager: {
      type: Object,
      required: true
    },
    currentRecord: {
      type: Object,
      required: true
    },
    showContainerInfo: {
      type: Boolean,
      default: false
    },
    tabUuid: {
      type: String,
      default: ''
    },
    defaultOpenedTab: {
      type: String,
      default: 'getRecordLogs'
    }
  },

  setup(props, { root }) {
    const currentRecordLogs = ref({ name: '' })
    const currentKey = ref(0)
    const typeAction = ref(0)
    const currentTabLogs = ref('0')
    const tableName = ref('')
    const nameTab = ref('getRecordLogs')
    const recordsListStoreProduct = ref([])
    const isLoadingListReference = ref(false)

    if (!isEmptyValue(props.defaultOpenedTab)) {
      nameTab.value = props.defaultOpenedTab
    }

    // use getter to reactive properties

    // Computed

    const listInfoPanel = computed(() => {
      return [
        {
          name: 'getRecordLogs',
          title: language.t('window.containerInfo.log.changeHistory'),
          show: true,
          svg: true,
          iconClass: 'tree-table',
          isLoading: isLoadingRecordLogsList.value,
          component: () => import('./Component/RecordLogs/index.vue')
        },
        {
          name: 'listReference',
          title: language.t('window.containerInfo.referenceRecords'),
          show: true,
          svg: false,
          isLoading: isLoadingListReference.value,
          iconClass: 'el-icon-zoom-in',
          component: () => import('./Component/ReferenceRecords/index.vue')
        },
        {
          name: 'recordAttachmentTab',
          title: language.t('component.attachment.label'),
          show: true,
          svg: false,
          isLoading: isLoadingListAttachment.value,
          iconClass: 'el-icon-paperclip',
          component: () => import('./Component/AttachmentManager/index.vue')
        },
        {
          name: 'recordNotesTab',
          title: language.t('window.containerInfo.notes'),
          show: true,
          svg: true,
          iconClass: 'message',
          isLoading: isLoadingNotesRecord.value,
          component: () => import('./Component/RecordNotes/index.vue')
        },
        {
          name: 'getListIssues',
          title: language.t('window.containerInfo.issues'),
          show: true,
          svg: true,
          iconClass: 'guide',
          isLoading: isLoadingIssuessRecord.value,
          component: () => import('./Component/RecordIssues/index.vue')
        },
        {
          name: 'searchWorkflowHistory',
          show: isWorkflowLog.value,
          title: language.t('window.containerInfo.workflowLog'),
          svg: true,
          iconClass: 'tree-table',
          isLoading: false,
          component: () => import('./Component/workflowLogs/index.vue')
        },
        {
          name: 'accountingInformation',
          show: isAccountingInfo.value,
          title: language.t('window.containerInfo.accountingInformation.title'),
          svg: true,
          isLoading: false,
          iconClass: 'balance',
          component: AcctViewer // () => import('@/components/ADempiere/Form/AcctViewer')
        },
        {
          name: 'listProductStorage',
          show: !isEmptyValue(storeProduct.value),
          title: language.t('listStoreProduct.title'),
          svg: true,
          isLoading: false,
          iconClass: 'warehouse',
          component: () => import('./Component/storeProduct/index.vue')
        },
        {
          name: 'listDashboard',
          show: !isEmptyValue(showPanelDashboard.value),
          title: language.t('navbar.dashboard'),
          svg: true,
          isLoading: false,
          iconClass: 'dashboard',
          component: () => import('./Component/RecordDashboard/index.vue')
        }
      ]
    })

    /**
     * Computed
     * isLoadLogs
     * isWorkflowLog
     * containerInfo
     * currentTab
     * storeProduct
     * showPanelInfo
     * currentRecordUuid
     * currentRecordId
     */
    const isLoadLogs = computed(() => {
      return store.state.utils.showRecordLogs
    })

    const showPanelDashboard = computed(() => {
      return store.getters.getNumberDashboard
    })

    // Container Info
    const containerInfo = computed(() => {
      const inf = store.getters.getContainerInfo
      if (inf) {
        return inf
      }
      return {}
    })

    // Current Tab
    const currentTab = computed(() => {
      if (containerInfo.value.currentTab) {
        return containerInfo.value.currentTab
      }
      return {}
    })

    // Current Record UUID
    const currentRecordUuid = computed(() => {
      if (!isEmptyValue(currentTab.value)) {
        return store.getters.getUuidOfContainer(currentTab.value.containerUuid)
      }
      return ''
    })

    // Current Record ID
    const currentRecordId = computed(() => {
      if (currentTab.value) {
        return store.getters.getIdOfContainer({
          containerUuid: currentTab.value.containerUuid,
          tableName: currentTab.value.tableName
        })
      }
      return ''
    })

    // Store Product
    const storeProduct = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: currentTab.value.containerUuid,
        columnName: 'M_Product_ID'
      })
    })

    // Current window
    const storedWindow = computed(() => {
      if (currentTab.value && currentTab.value.parentUuid) {
        return store.getters.getStoredWindow(currentTab.value.parentUuid)
      }
      return {}
    })

    const isWorkflowLog = computed(() => {
      if (currentTab.value) {
        return currentTab.value.isDocument
      }
      return false
    })

    // Open Container the Info
    const showPanelInfo = computed(() => {
      return store.getters.getShowLogs
    })

    /**
     * IsLoading Optiones Tabs
     * @param {boolean} isLoadingNotesRecord
     * @param {boolean} isLoadingListAttachment
     * @param {boolean} isLoadingRecordLogsList
     * @param {boolean} isLoadingIssuessRecord
     */

    // Loading Notes Register
    const isLoadingNotesRecord = computed(() => {
      return store.getters.getIsLoadListChat
    })

    // Loading Notes Register
    const isLoadingListAttachment = computed(() => {
      return store.getters.getIsLoadListAttachment
    })

    // Loading Record Logs List
    const isLoadingRecordLogsList = computed(() => {
      return store.getters.getIsLoadListRecordLogs
    })

    const isLoadingIssuessRecord = computed(() => {
      return store.getters.getIsLoadListIssues
    })

    const isAccountingInfo = computed(() => {
      const { currentTab } = store.getters.getContainerInfo
      if (!currentTab.isDocument) {
        return false
      }
      const { fieldsList } = currentTab
      if (isEmptyValue(fieldsList)) {
        return false
      }
      const isPostedField = fieldsList.find(field => field.columnName === 'Posted')
      if (isEmptyValue(isPostedField)) {
        return false
      }
      return isDisplayedField({
        ...isPostedField
      })
    })

    /**
     * Function Infomation Panel
     * findRecordLogs @param {object} tab
     * showkey  @param {number, number} key
     * handleClick @param {object} tab
     * findListStoreProduct @param {object} params
     */

    // Record
    function findRecordLogs(tab) {
      tableName.value = root.$store.getters.getTableName(tab.parentUuid, tab.containerUuid)
      currentRecordLogs.value = root.$store.getters.getValuesView({
        parentUuid: tab.parentUuid,
        containerUuid: tab.containerUuid,
        format: 'object'
      })
    }

    // showkey
    function showkey(key, index) {
      if (key === currentKey.value && index === typeAction.value) {
        currentKey.value = 1000
      } else {
        currentKey.value = key
        typeAction.value = index
      }
    }

    function handleClick(tab, event) {
      let tabOptions = tab.name
      if (tab.name === 'accountingInformation') {
        return
      }
      if (tab.name === 'listProductStorage') {
        findListStoreProduct()
        return
      }
      if (tab.name === 'recordAttachmentTab' || tab.name === language.t('component.attachment.label')) {
        tabOptions = 'getAttachment'
      }
      if (tab.name === language.t('window.containerInfo.notes')) {
        tabOptions = 'recordNotesTab'
      }
      if (tab.name === 'listDashboard') {
        const { currentTab } = store.getters.getContainerInfo
        if (isEmptyValue(storedWindow.value.id) ||
          (isEmptyValue(currentTab))) {
          return
        }
        const dashboardList = store.getters.getPanelDashboard({
          tabId: currentTab.id,
          recordId: currentRecordId.value
        })
        if (isEmptyValue(dashboardList)) {
          store.dispatch('listWindowDashboard', {
            tabId: currentTab.id,
            windowId: storedWindow.value.id,
            recordId: currentRecordId.value,
            tableName: currentTab.tableName
          })
        }
      }
      if (tab.name === 'listReference') {
        tabOptions = 'listReference'
        isLoadingListReference.value = true
        store.dispatch('getReferencesFromServer', {
          tableName: currentTab.value.tableName,
          containerUuid: currentTab.value.containerUuid,
          parentUuid: currentTab.value.parentUuid,
          recordId: currentRecordId.value,
          recordUuid: currentRecordUuid.value
        })
          .then(resp => {
            isLoadingListReference.value = false
          })
      }
      if (isEmptyValue(props.containerManager[tabOptions])) {
        return
      }
      nameTab.value = tab.name
      props.containerManager[tabOptions]({
        tableName: currentTab.value.tableName,
        containerUuid: currentTab.value.containerUuid,
        parentUuid: currentTab.value.parentUuid,
        recordId: currentRecordId.value,
        recordUuid: currentRecordUuid.value
      })
    }

    function findListStoreProduct(params) {
      listProductStorage({
        tableName: currentTab.value.tableName,
        recordId: currentRecordId.value,
        recordUuid: currentRecordUuid.value
      })
        .then(response => {
          recordsListStoreProduct.value = response.recordsList.map(record => {
            const { id, uuid, tableName, attributes } = record
            return {
              ...attributes,
              DateLastInventory: formatDate({ value: attributes.DateLastInventory }),
              id,
              uuid,
              tableName
            }
          })
        })
    }

    /**
     * Watch
     * Information Panel Observers
     */

    watch(isLoadLogs, (newValue, oldValue) => {
      if (newValue) {
        findRecordLogs(props.allTabsList[parseInt(currentTabLogs.value)])
      }
    })

    watch(showPanelInfo, (newValue, oldValue) => {
      if (newValue) {
        handleClick({
          name: props.defaultOpenedTab
        })
      }
    })

    watch(() => props.defaultOpenedTab, (newValue) => {
      nameTab.value = newValue
    })

    if (showPanelInfo.value) {
      handleClick({
        name: props.defaultOpenedTab
      })
    }

    store.dispatch('findListMailTemplates')

    findRecordLogs(props.allTabsList[parseInt(currentTabLogs.value)])

    return {
      // Ref
      currentRecordLogs,
      currentKey,
      typeAction,
      currentTabLogs,
      tableName,
      nameTab,
      recordsListStoreProduct,
      // Computed
      currentTab,
      isLoadLogs,
      storeProduct,
      showPanelInfo,
      containerInfo,
      isWorkflowLog,
      listInfoPanel,
      currentRecordId,
      isAccountingInfo,
      currentRecordUuid,
      showPanelDashboard,
      // IsLoading
      isLoadingNotesRecord,
      isLoadingListAttachment,
      isLoadingListReference,
      isLoadingRecordLogsList,
      isLoadingIssuessRecord,
      // methods
      showkey,
      findRecordLogs,
      handleClick,
      findListStoreProduct
    }
  }

})
</script>

<style lang="scss">
.tab-panel-info {
  height: 100% !important;
  .el-tabs--border-card > .el-tabs__content {
    height: 100% !important;
    padding-left: 5px;
    padding-right: 5px;
  }
}
.scroll-panel-info {
  width: 100%;
  height: 800px;
}
</style>
