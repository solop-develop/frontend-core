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
    <el-main id="mainWindow">
      <embedded
        :visible="showRecordAccess"
      >
        <record-access />
      </embedded>
      <tab-manager
        :parent-uuid="windowMetadata.uuid"
        :container-manager="containerManager"
        :tabs-list="windowMetadata.tabsListParent"
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
      <tab-manager-child
        v-if="((isWithChildsTab && isMobile) || getTab.isTableViewFullScreen)"
        :parent-uuid="windowMetadata.uuid"
        :container-manager="containerManager"
        :tabs-list="windowMetadata.tabsListChild"
        :all-tabs-list="allTabsList"
        :references-manager="referencesManager"
        :actions-manager="actionsManager"
      />
    </el-main>
    <el-footer v-if="!isMobile && !getTab.isTableViewFullScreen" :style="getTab.isTableViewFullScreen ? 'height: 20% !important;' : 'height: 50% !important;'">
      <tab-manager-child
        v-if="isWithChildsTab"
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
import { defineComponent, computed, ref } from '@vue/composition-api'

import language from '@/lang'
import router from '@/router'
import store from '@/store'

// components and mixins
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'
import Embedded from '@theme/components/ADempiere/Dialog/embedded'
import RecordAccess from '@theme/components/ADempiere/RecordAccess'
import ModalDialog from '@theme/components/ADempiere/ModalDialog/index.vue'
import TabManager from '@theme/components/ADempiere/TabManager/index.vue'
import TabManagerChild from '@theme/components/ADempiere/TabManager/tabChild.vue'

// utils and helpers methods
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'MultiTabWindow',

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

    const containerManager = {
      ...props.windowManager,

      actionPerformed: ({ field, value }) => {
        return store.dispatch('actionPerformed', {
          field,
          value
        })
          .then(response => {
            if (response.type === 'createEntity') {
              router.push({
                name: root.$route.name,
                query: {
                  ...root.$route.query,
                  action: response.uuid,
                  recordId: response.id
                },
                params: {
                  ...root.$route.params,
                  recordId: response.id
                }
              }, () => {})
            }

            const { parentUuid, containerUuid } = field
            const tab = store.getters.getStoredTab(parentUuid, containerUuid)

            // set response values
            store.dispatch('updateValuesOfContainer', {
              parentUuid,
              containerUuid,
              isOverWriteParent: tab.isParentTab,
              attributes: response.attributes
            })
          })
      },

      seekRecord: ({ row, parentUuid, containerUuid }) => {
        if (isEmptyValue(row)) {
          store.dispatch('setTabDefaultValues', {
            parentUuid,
            containerUuid
          })
          return
        }
        const tabDefinition = store.getters.getStoredTab(parentUuid, containerUuid)
        if (tabDefinition.isParentTab) {
          const { tableName } = tabDefinition
          router.push({
            name: root.$route.name,
            query: {
              ...root.$route.query,
              action: row.UUID,
              tableName,
              recordId: row[`${tableName}_ID`]
            },
            params: {
              ...root.$route.params,
              tableName,
              recordId: row[`${tableName}_ID`]
            }
          }, () => {})
        }

        const fieldsList = store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
        const defaultValues = store.getters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          isSOTrxMenu: root.$route.meta.isSalesTransaction,
          fieldsList,
          formatToReturn: 'object'
        })

        const attributes = convertObjectToKeyValue({
          object: Object.assign(defaultValues, row)
        })

        store.dispatch('notifyPanelChange', {
          parentUuid,
          containerUuid,
          attributes,
          isOverWriteParent: tabDefinition.isParentTab
        })

        // active logics with set records values
        fieldsList.forEach(field => {
          // change Dependents
          store.dispatch('changeDependentFieldsList', {
            field,
            fieldsList,
            containerManager: props.windowManager
          })
        })

        // update records and logics on child tabs
        tabDefinition.childTabs.filter(tabItem => {
          // get loaded tabs with records
          return store.getters.getIsLoadedTabRecord({
            containerUuid: tabItem.uuid
          })
        }).forEach(tabItem => {
          // if loaded data refresh this data
          // TODO: Verify with get one entity, not get all list
          store.dispatch('getEntities', {
            parentUuid,
            containerUuid: tabItem.uuid,
            pageNumber: 1 // reload with first page
          })
        })
      }
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

    const getTab = computed(() => {
      return store.getters.getCurrentTab(props.windowMetadata.uuid)
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

    return {
      currentTabUuid,
      allTabsList,
      referencesManager,
      actionsManager,
      showRecordAccess,
      isWithChildsTab,
      containerManager,
      isMobile,
      getTab
    }
  }

})
</script>

<style>
.el-footer {
  height: 50% !important;
}
.el-main {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
