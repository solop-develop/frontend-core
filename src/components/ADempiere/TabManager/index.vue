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
  <div class="tab-manager-container">
    <el-tabs
      ref="el-tabs-container"
      v-model="currentTab"
      class="el-tabs-container"
      type="border-card"
      style="width:100%;height: 100%;"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(tabAttributes, key) in tabsList"
        :key="key"
        :label="tabAttributes.name"
        :name="String(key)"
        :tabuuid="tabAttributes.uuid"
        :tabindex="String(key)"
        lazy
        :disabled="isDisabledTab(key)"
        :style="tabStyle"
      >
        <tab-label
          slot="label"
          :is-active-tab="tabAttributes.uuid === tabUuid"
          :parent-uuid="parentUuid"
          :container-uuid="tabAttributes.uuid"
          :container-manager="containerManager"
        />
        <!-- Close table when clicking on group of fields -->
        <!-- <div
          v-if="isShowedTabs"
          @click="selectTab(tabsList[parseInt(currentTab)])"
        > -->
        <div
          style="display: contents;"
          @click="selectTab(tabsList[parseInt(currentTab)])"
        >
          <tab-panel
            id="tab-panel"
            :parent-uuid="parentUuid"
            :container-manager="containerManager"
            :tabs-list="tabsList"
            :all-tabs-list="allTabsList"
            :tab-uuid="tabUuid"
            :tab-attributes="tabAttributes"
            :actions-manager="actionsManager"
            :style="'height: 100% !important;'"
          />
        </div>
        <!-- </div> -->
      </el-tab-pane>
    </el-tabs>

    <div :style="sizeBadgeRight">
      <el-button
        v-if="isMobile"
        plain
        size="medium"
        type="primary"
        circle
        @click="openRecordLogs('getRecordLogs')"
      >
        <i
          class="el-icon-arrow-left"
        />
      </el-button>
      <el-button
        v-else
        type="primary"
        size="mini"
        circle
        @click="openRecordLogs('getRecordLogs')"
      >
        <svg-icon icon-class="tree-table" />
      </el-button>

      <el-button
        v-show="showAttachmentAvailable && !isMobile"
        type="primary"
        size="mini"
        circle
        style="margin: 0px"
        @click="openRecordLogs('recordAttachmentTab')"
      >
        <i class="el-icon-paperclip" />
      </el-button>
      <el-badge v-show="showReference && !isMobile" :value="countReference" class="item" type="primary">
        <el-button
          v-show="showReference"
          type="primary"
          size="mini"
          circle
          style="margin: 0px"
          @click="openRecordLogs('listReference')"
        >
          <i class="el-icon-zoom-in" />
        </el-button>
      </el-badge>
      <el-badge v-show="showDashboard && !isMobile" :value="countDashboard" class="item" type="primary">
        <el-button
          v-show="showDashboard"
          type="primary"
          size="mini"
          circle
          style="margin: 0px"
          @click="openRecordLogs('listDashboard')"
        >
          <svg-icon icon-class="dashboard" style="font-size: 18px;" />
        </el-button>
      </el-badge>
      <el-badge v-show="showIssues && !isMobile" :value="countIssues" class="item" type="primary">
        <el-button
          v-show="showIssues"
          type="primary"
          size="mini"
          circle
          style="margin: 0px"
          @click="openRecordLogs('getListIssues')"
        >
          <i class="el-icon-s-promotion" />
        </el-button>
      </el-badge>
      <el-badge v-show="showChatAvailable && !isMobile" :value="countIsNote" class="item" type="primary">
        <el-button
          type="primary"
          size="mini"
          circle
          style="margin: 0px"
          @click="openRecordLogs('recordNotesTab')"
        >
          <svg-icon icon-class="message" />
        </el-button>
      </el-badge>
    </div>

    <el-drawer
      :visible.sync="showContainerInfo"
      :with-header="true"
      :before-close="openRecordLogs"
      :size="isDrawerWidth"
      class="drawer-panel-info"
    >
      <span slot="title">
        <svg-icon icon-class="tab" style="margin-right: 10px;" />
        {{ $t('window.containerInfo.log.tab') }}
        <span style="color: #606266; font-weight: bold;">
          {{ currentTabPanelInfo.name }}
        </span>
      </span>

      <panel-info
        v-if="showContainerInfo"
        :all-tabs-list="allTabsList"
        :show-container-info="showContainerInfo"
        :container-manager="containerManager"
        :current-record="currentRecordLogs"
        :tab-uuid="tabUuid"
        :is-accounting-info="isAccountingInfo"
        :default-opened-tab="defaultNameTab"
      />
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import DefaultTable from '@/components/ADempiere/DataTable/index.vue'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TabLabel from '@/components/ADempiere/TabManager/TabLabel.vue'
import PanelInfo from '../PanelInfo/index.vue'
import TabPanel from '@/components/ADempiere/TabManager/TabPanel/index.vue'
import TabOptions from './TabOptions.vue'

// Constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns.js'

// API Request Methods
import { requestListEntityChats, existsChatsEntries, requestExistsReferences } from '@/api/ADempiere/window'
import { requestExistsAttachment } from '@/api/ADempiere/user-interface/component/resource'
import { requestExistsIssues } from '@/api/ADempiere/user-interface/component/issue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'TabManager',

  components: {
    DefaultTable,
    PanelDefinition,
    TabPanel,
    PanelInfo,
    TabLabel,
    TabOptions
  },

  props: {
    parentUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    allTabsList: {
      type: Array,
      required: false
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    actionsManager: {
      type: Object,
      default: () => ({})
    },
    // used only window
    isAccountingInfo: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const queryProperty = 'tab'
    // if tabParent is present in path set this
    const tabNo = root.$route.query[queryProperty] || '0'
    const currentTab = ref(tabNo)

    const tabUuid = ref(props.tabsList[tabNo].uuid)

    const openPanelInfo = ref('')

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const isDrawerWidth = computed(() => {
      if (isMobile.value) {
        return '100%'
      }
      return '65%'
    })

    const sizeBadgeRight = computed(() => {
      if (isMobile.value) {
        return 'width: 0%;height: 100%;position: fixed;right: 8.5%;top: 50%;z-index: 9;'
      }
      return 'width: 0%;height: 100%;position: absolute;right: 2%;top: 45%;z-index: 9;'
    })

    const tabStyle = computed(() => {
      if (store.state.app.device === 'mobile') {
        return {
          height: '100% !important'
        }
      }
      return {
        height: '100% !important',
        overflow: 'auto'
      }
    })

    // Panel Info

    const currentRecordLogs = ref({})

    const drawer = ref(false)

    const showChatAvailable = ref(false)

    const showAttachmentAvailable = ref(false)

    const showReference = ref(false)

    const showIssues = ref(false)

    const showDashboard = ref(false)

    const countIssues = ref(0)

    const countDashboard = ref(0)

    const showIsNote = ref(false)

    const countIsNote = ref(0)

    const countReference = ref(0)

    // use getter to reactive properties
    const currentTabMetadata = computed(() => {
      return store.getters.getStoredTab(props.parentUuid, tabUuid.value)
    })

    const showContainerInfo = computed(() => {
      return store.getters.getShowLogs
    })

    const isShowedTabs = computed(() => {
      const storedWindow = store.getters.getStoredWindow(props.parentUuid)
      return storedWindow.isShowedTabsParent
    })

    // Container Info
    const containerInfo = computed(() => {
      const inf = store.getters.getContainerInfo
      if (inf) {
        return inf
      }
      return {}
    })

    // Current Tab the Panel Info
    const currentTabPanelInfo = computed(() => {
      if (containerInfo.value.currentTab) {
        return containerInfo.value.currentTab
      }
      return {}
    })

    const isShowedTableRecords = computed(() => {
      return currentTabMetadata.value.isShowedTableRecords
    })

    const isCreateNew = computed(() => {
      return Boolean(root.$route.query.action === 'create-new')
    })

    const isWithChildsTab = computed(() => {
      return store.getters.getStoredWindow(props.parentUuid).tabsListChild
    })

    const defaultNameTab = computed(() => {
      return store.getters.getDefaultOpenedTab
    })

    function isDisabledTab(key) {
      return (key > 0) &&
        (isCreateNew.value || isEmptyValue(recordUuidTabParent.value))
    }

    function setCurrentTab() {
      store.commit('setCurrentTab', {
        parentUuid: props.parentUuid,
        tab: props.tabsList[currentTab.value]
      })
    }

    // create the table header
    const tableHeaders = computed(() => {
      const panel = props.tabsList[currentTab.value]
      if (panel && panel.fieldsList) {
        return panel.fieldsList
      }
      return []
    })

    // Current Record UUID
    const currentRecordUuid = computed(() => {
      if (currentTabMetadata.value) {
        return store.getters.getUuidOfContainer(currentTabMetadata.value.uuid)
      }
      return ''
    })
    // Current Record ID
    const currentRecordId = computed(() => {
      if (currentTabMetadata.value) {
        return store.getters.getIdOfContainer({
          containerUuid: currentTabMetadata.value.containerUuid,
          tableName: currentTabTableName.value
        })
      }
      return 0
    })

    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    const handleClick = (tabHTML) => {
      const { tabuuid, tabindex } = tabHTML.$attrs
      findRecordLogs(props.allTabsList[0])
      setTabNumber(tabindex)
      // chatAvailable()
      // attachmentAvailable()
      // getReferences()

      // set metadata tab
      if (tabUuid.value !== tabuuid) {
        tabUuid.value = tabuuid
        setCurrentTab()
      }

      const containerInfo = store.getters.getContainerInfo
      if (!isEmptyValue(containerInfo)) {
        const currentTabDefinition = props.tabsList.find(row => row.uuid === tabuuid)
        if (!isEmptyValue(currentTabDefinition)) {
          if (!isEmptyValue(containerInfo.currentTab)) {
            store.dispatch('changeTabAttribute', {
              parentUuid: containerInfo.currentTab.parentUuid,
              containerUuid: containerInfo.currentTab.containerUuid,
              attributeName: 'isSelected',
              attributeValue: false
            })
          }
          const currentTabData = store.getters.getTabData({
            containerUuid: tabuuid
          })

          const recordsListTab = currentTabData.recordsList

          let currentRecord = {}
          if (isEmptyValue(recordsListTab)) {
            if (!currentTabData.isLoaded && !currentTabData.isLoading) {
              // load records
              getData()
            }
          } else {
            currentRecord = recordsListTab.find(row => row.UUID === store.getters.getUuidOfContainer(currentTabDefinition.containerUuid))
            store.dispatch('panelInfo', {
              currentTab: currentTabDefinition,
              currentRecord
            })
          }
          store.dispatch('changeTabAttribute', {
            parentUuid: currentTabDefinition.parentUuid,
            containerUuid: currentTabDefinition.containerUuid,
            attributeName: 'isSelected',
            attributeValue: true
          })
        }
      }
    }

    const setTabNumber = (tabNumber = '0') => {
      if (isEmptyValue(tabNumber)) {
        tabNumber = '0'
      }
      if (tabNumber !== currentTab.value) {
        currentTab.value = tabNumber
      }
      router.push({
        query: {
          ...root.$route.query,
          [queryProperty]: currentTab.value
        },
        params: {
          ...root.$route.params
        }
      }, () => {})

      return tabNumber
    }

    const tabData = computed(() => {
      return store.getters.getTabData({
        containerUuid: currentTabMetadata.value.uuid
      })
    })

    const query = root.$route.query

    const routerParams = root.$route.params

    // get records list
    const recordsList = computed(() => {
      return tabData.value.recordsList
    })

    const isReadyFromGetData = computed(() => {
      return !tabData.value.isLoaded
    })

    const recordUuidTabParent = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: currentTabMetadata.value.firstTabUuid,
        columnName: UUID
      })
    })

    const currentTabTableName = computed(() => {
      return store.getters.getTableName(
        props.parentUuid,
        currentTabMetadata.value.firstTabUuid
      )
    })

    const getData = () => {
      const containerUuid = tabUuid.value
      let filters, filtersRecord
      const pageNumber = query.page
      if (query.filters) {
        filters = query.filters
      }
      if (!isEmptyValue(query.action)) {
        filtersRecord = {
          columnName: UUID,
          value: query.action
        }
      }
      if (!isEmptyValue(query.recordId)) {
        const storedTab = store.getters.getStoredTab(props.parentUuid, containerUuid)
        filtersRecord = {
          columnName: storedTab.keyColumn,
          value: Number(query.recordId)
        }
      }
      if (!isEmptyValue(routerParams.filters)) {
        filters = routerParams.filters
      }

      store.dispatch('getEntities', {
        parentUuid: props.parentUuid,
        tabUuid: routerParams.containerUuid,
        containerUuid,
        filters,
        referenceUuid: query.referenceUuid,
        filtersRecord,
        pageNumber
      }).then(responseData => {
        if (isCreateNew.value || isEmptyValue(responseData)) {
          // set values in panel
          props.containerManager.seekRecord({
            parentUuid: props.parentUuid,
            containerUuid,
            row: {}
          })
          return
        }

        let row = {}
        const { action } = query
        // uuid into action query
        if (!isEmptyValue(action) && action !== 'create-new') {
          if (action === 'zoomIn') {
            const { columnName, value } = root.$route.query
            row = responseData.find(rowData => {
              return rowData[columnName] === value
            })
          } else {
            row = responseData.find(rowData => {
              return rowData.UUID === action
            })
          }
        }

        // set first record
        if (isEmptyValue(row)) {
          row = responseData[0]
        }

        // set values in panel
        props.containerManager.seekRecord({
          parentUuid: props.parentUuid,
          containerUuid,
          row
        })
        const recordId = currentRecordId.value
        router.push({
          name: root.$route.name,
          query: {
            ...root.$route.query,
            recordId
          },
          params: {
            ...root.$route.params,
            filter: {},
            recordId
          }
        }, () => {})
      })
    }
    if (isReadyFromGetData.value || (!isReadyFromGetData.value &&
      (!isEmptyValue(root.$route.params.filters) || !isEmptyValue(root.$route.query.referenceUuid)))) {
      getData()
    }
    watch(currentRecordLogs, (newValue, oldValue) => {
      const recordId = newValue[currentTabTableName.value + '_ID']
      router.push({
        name: root.$route.name,
        query: {
          ...root.$route.query,
          action: newValue.UUID,
          recordId
        },
        params: {
          ...root.$route.params,
          recordId
        }
      }, () => {})
    })
    // if changed tab and not records in stored, get records from server
    watch(tabUuid, (newValue, oldValue) => {
      if (newValue !== oldValue && !isEmptyValue(recordUuidTabParent.value) && !tabData.value.isLoaded) {
        getData()
      }
    })

    watch(currentRecordUuid, (newValue, oldValue) => {
      if (newValue !== oldValue && !isEmptyValue(newValue)) {
        chatAvailable()
        attachmentAvailable()
        getReferences()
        getIssues()
        getIsNotes()
        getDashboard()
      }
    })

    watch(containerInfo, (newValue, oldValue) => {
      if (newValue !== oldValue && !isEmptyValue(newValue)) {
        getDashboard()
      }
    })

    /**
     * List Change History
     */
    const openRecordLogs = (options) => {
      if (!isEmptyValue(options) && typeof options === 'string') {
        store.commit('setDefaultOpenedTab', options)
      }
      store.dispatch('showLogs', {
        show: !showContainerInfo.value
      })
    }

    /**
     * Reference
     */

    const getReferences = () => {
      showReference.value = false
      if (isEmptyValue(currentTabTableName.value) ||
        (isEmptyValue(currentRecordUuid.value) &&
        (isEmptyValue(currentRecordId.value) || currentRecordId.value <= 0))) {
        return
      }
      requestExistsReferences({
        tabId: currentTabMetadata.value.id,
        tabUuid: currentTabMetadata.value.uuid,
        recordUuid: currentRecordUuid.value,
        recordId: currentRecordId.value
      })
        .then(responseReferences => {
          if (responseReferences > 0) {
            showReference.value = true
            countReference.value = responseReferences
            return
          }
          showReference.value = false
          return
          // const { referencesList } = responseReferences
          // showReference.value = !isEmptyValue(referencesList)
        })
        .catch(() => {})
    }

    /**
     * Issuess
     */

    const getIssues = () => {
      showIssues.value = false
      if (isEmptyValue(currentTabTableName.value) ||
        (isEmptyValue(currentRecordUuid.value) &&
        (isEmptyValue(currentRecordId.value) || currentRecordId.value <= 0))) {
        return
      }
      requestExistsIssues({
        tableName: currentTabTableName.value,
        recordUuid: currentRecordUuid.value,
        recordId: currentRecordId.value
      })
        .then(responseReferences => {
          if (responseReferences > 0) {
            showIssues.value = true
            countIssues.value = responseReferences
            return
          }
          showIssues.value = false
          return
          // const { referencesList } = responseReferences
          // showReference.value = !isEmptyValue(referencesList)
        })
        .catch(() => {})
    }

    /**
     * Notes
     */

    const getIsNotes = () => {
      showIsNote.value = false
      // if (isEmptyValue(currentTabTableName.value) ||
      //   (isEmptyValue(currentRecordUuid.value) &&
      //   (isEmptyValue(currentRecordId.value) || currentRecordId.value <= 0))) {
      //   return
      // }
      existsChatsEntries({
        tableName: currentTabTableName.value,
        recordUuid: currentRecordUuid.value,
        recordId: currentRecordId.value
      })
        .then(responseReferences => {
          if (responseReferences > 0) {
            showIsNote.value = true
            countIsNote.value = responseReferences
            return
          }
          showIsNote.value = false
          return
        })
        .catch(() => {})
    }

    /**
     * Chat Available
     */
    const chatAvailable = () => {
      requestListEntityChats({
        tableName: currentTabTableName.value,
        recordId: currentRecordId.value,
        recordUuid: currentRecordUuid.value
      })
        .then(responseList => {
          const { entityChatsList } = responseList
          showChatAvailable.value = !isEmptyValue(entityChatsList)
        })
        .catch(error => {
          console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
        })
    }

    /**
     * Attachment Available
     */
    const attachmentAvailable = () => {
      showAttachmentAvailable.value = false
      if (isEmptyValue(currentTabTableName.value) ||
        (isEmptyValue(currentRecordUuid.value) &&
        (isEmptyValue(currentRecordId.value) || currentRecordId.value <= 0))) {
        return
      }
      requestExistsAttachment({
        tableName: currentTabTableName.value,
        recordId: currentRecordId.value,
        recordUuid: currentRecordUuid.value
      })
        .then(response => {
          showAttachmentAvailable.value = Boolean(response)
        })
        .catch(error => {
          console.warn(`Error getting Count Attachment: ${error.message}. Code: ${error.code}.`)
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    /**
     * Current Record
     */
    const findRecordLogs = (tab) => {
      currentRecordLogs.value = store.getters.getValuesView({
        parentUuid: tab.parentUuid,
        containerUuid: tab.containerUuid,
        format: 'object'
      })
    }

    /**
     * Exists Charts
     */
    const getDashboard = (tab) => {
      const storedWindow = store.getters.getStoredWindow(props.parentUuid)
      const { currentTab } = store.getters.getContainerInfo
      showDashboard.value = false
      if (isEmptyValue(storedWindow.id) ||
        (isEmptyValue(currentTab))) {
        return
      }
      store.dispatch('isDashboard', {
        tabId: currentTab.id,
        windowId: storedWindow.id
      })
        .then(responseDashboard => {
          if (responseDashboard > 0) {
            showDashboard.value = true
            countDashboard.value = responseDashboard
            return
          }
          showDashboard.value = false
          return
        })
        .catch(() => {})
    }

    const tabMetadata = computed(() => {
      return store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      )
    })

    function changeShowedRecords() {
      store.dispatch('changeTabAttribute', {
        parentUuid: props.parentUuid,
        containerUuid: currentTabMetadata.value.uuid,
        attributeName: 'isShowedTableRecords',
        attributeValue: !currentTabMetadata.value.isShowedTableRecords
      })
      store.dispatch('changeTabAttribute', {
        parentUuid: props.parentUuid,
        containerUuid: currentTabMetadata.value.uuid,
        attributeName: 'isSelected',
        attributeValue: !currentTabMetadata.value.isSelected
      })
    }

    function selectTab(params) {
      store.dispatch('panelInfo', {
        currentTab: params
      })
    }

    findRecordLogs(props.allTabsList[0])

    setTabNumber(currentTab.value)
    chatAvailable()
    attachmentAvailable()
    getReferences()
    getIssues()
    getIsNotes()
    getDashboard()

    return {
      tabUuid,
      currentTab,
      tableHeaders,
      recordsList,
      drawer,
      currentRecordLogs,
      openPanelInfo,
      showChatAvailable,
      showAttachmentAvailable,
      showReference,
      showIssues,
      showIsNote,
      showDashboard,
      countIssues,
      countDashboard,
      countReference,
      countIsNote,
      defaultNameTab,
      // computed
      isMobile,
      isDrawerWidth,
      sizeBadgeRight,
      isShowedTabs,
      isShowedTableRecords,
      currentTabTableName,
      currentTabMetadata,
      tabStyle,
      tabMetadata,
      showContainerInfo,
      currentRecordUuid,
      currentRecordId,
      isWithChildsTab,
      containerInfo,
      currentTabPanelInfo,
      // methods
      handleClick,
      changeShowedRecords,
      findRecordLogs,
      openRecordLogs,
      isDisabledTab,
      selectTab,
      chatAvailable,
      attachmentAvailable,
      getReferences,
      getIssues,
      getIsNotes,
      getDashboard
    }
  }

})
</script>

<style lang="scss">
// Tab Manager
.tab-manager-container {
  .el-badge__content.is-fixed {
    right: 150% !important;
  }
}

.drawer-panel-info {
  header.el-drawer__header {
    margin-bottom: 10px !important;
    padding-top: 10px !important;
  }
}
</style>
