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
  <span
    v-if="tabAttributes.isDocument"
    class="document-action-main"
  >
    <el-dropdown
      v-if="isEnableRunDocumentAction"
      split-button
      :style="isMobile ? 'margin-left: 1px;margin-right: 4px' : 'margin-left: 10px;'"
      size="small"
      trigger="click"
      class="document-action"
      :disabled="isLoadingActions"
      @click="handleCommandActions(defaultValue);"
      @command="handleCommandActions"
    >
      <i v-if="isLoadingActions" class="el-icon-loading" />
      <span v-else>
        {{ defaultName }}
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(documentAction, key) in documentActionsList"
          :key="key"
          :divided="key > 0"
          :command="documentAction.value"
        >
          <document-status-tag
            key="document-actions"
            size="small"
            :value="documentAction.value"
            :displayed-value="documentAction.name"
          />
          <!-- {{ documentAction.name }} -->
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <document-status-tag
      v-else
      size="medium"
      :style="isMobile ? 'padding-left: 0px;' : 'padding-left: 5px;'"
      :value="currentRecordDocumentAction"
      :displayed-value="currentRecordDocumentActionDisplayValue"
    /> -->

    <el-popover
      ref="popoverDocAction"
      v-model="isVisibleDocAction"
      trigger="click"
      placement="top"
    >
      <!-- TODO: Validate if DocumentActionPanel embedded on this content -->
      <h3> {{ $t('workflow.changeDocumentAction') }} </h3>
      {{ displayDocumentActions(selectDocActions).description }}
      <br><br>

      <el-steps :space="200" simple>
        <el-step icon="el-icon-d-arrow-right">
          <template slot="title">
            <document-status-tag
              key="document-status"
              size="small"
              :value="currentRecordDocumentStatus"
              :displayed-value="currentDocStatusDisplayedValue"
            />
          </template>
        </el-step>
        <el-step icon="el-icon-d-arrow-right">
          <template slot="title">
            <document-status-tag
              key="document-actions"
              size="small"
              :value="displayDocumentActions(selectDocActions).value"
              :displayed-value="displayDocumentActions(selectDocActions).name"
            />
          </template>
        </el-step>
      </el-steps>

      <div style="text-align: right; margin-top: 10px">
        <el-button
          type="danger"
          class="button-base-icon"
          icon="el-icon-close"
          @click="isVisibleDocAction = false"
        />
        <el-button
          type="primary"
          class="button-base-icon"
          icon="el-icon-check"
          @click="sendAction()"
        />
      </div>
    </el-popover>

    <!-- Current Status -->
    <document-status
      :parent-uuid="parentUuid"
      :container-uuid="tabAttributes.uuid"
      :table-name="tabAttributes.tableName"
      :style="isMobile ? 'padding-left: 0px;' : 'padding-left: 5px;'"
    />

  </span>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// Constants
import { DOCUMENT_ACTION, DOCUMENT_STATUS } from '@/utils/ADempiere/constants/systemColumns'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Components and Mixins
import DocumentStatus from '@/components/ADempiere/TabManager/convenienceButtons/documentStatus.vue'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  refreshRecord
} from '@/utils/ADempiere/dictionary/window'
import { isRunableDocumentAction } from '@/utils/ADempiere/dictionary/workflow'

export default defineComponent({
  name: 'DocumentAction',

  components: {
    DocumentStatus,
    DocumentStatusTag
  },

  props: {
    parentUuid: {
      type: [String, Number],
      required: false
    },
    containerManager: {
      type: Object,
      required: true
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    /**
     * Const
     */
    const containerUuid = props.tabAttributes.uuid

    /**
     * Ref
     */
    const isVisibleDocAction = ref(false)
    const selectDocActions = ref('')
    const popoverDocAction = ref(null)
    const emptyDocAction = {
      name: '',
      value: '',
      description: ''
    }
    const isLoadingActions = ref(false)

    /**
     * Computed
     */
    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(containerUuid)
    })
    const recordId = computed(() => {
      return store.getters.getIdOfContainer({
        containerUuid: containerUuid,
        tableName: props.tabAttributes.tableName
      })
    })

    const currentRecordDocumentStatus = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid,
        columnName: DOCUMENT_STATUS
      })
    })

    const currentRecordDocumentAction = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid,
        columnName: DOCUMENT_ACTION
      })
    })

    const currentRecordDocumentActionDisplayValue = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        containerUuid: props.parentUuid, // tab uuid
        // containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + DOCUMENT_ACTION
      })
    })

    const getCurrentTab = computed(() => {
      const tab = store.getters.getStoredTab(
        props.parentUuid,
        containerUuid
      )
      if (tab) {
        return tab
      }
      return props.tabAttributes
    })

    const defaultDocumentAction = computed(() => {
      return store.getters.getStoredDefaultDocumentAction({
        tableName: props.tabAttributes.tableName,
        recordUuid: recordUuid.value,
        documentStatus: currentRecordDocumentStatus.value
      })
    })

    const defaultName = computed(() => {
      if (isEmptyValue(defaultDocumentAction.value)) {
        return ''
      }
      return defaultDocumentAction.value.name
    })

    const defaultValue = computed(() => {
      if (isEmptyValue(defaultDocumentAction.value)) {
        return store.getters.getValueOfFieldOnContainer({
          containerUuid: props.tabAttributes.uuid,
          columnName: DOCUMENT_ACTION
        })
      }
      return defaultDocumentAction.value.value
    })

    const documentStatusesList = computed(() => {
      return store.getters.getStoredDocumentStatusesList({
        tableName: props.tabAttributes.tableName,
        recordUuid: recordUuid.value,
        documentStatus: currentRecordDocumentStatus.value
      })
    })

    const documentActionsList = computed(() => {
      return store.getters.getStoredDocumentActionsList({
        tableName: props.tabAttributes.tableName,
        recordUuid: recordUuid.value,
        documentStatus: currentRecordDocumentStatus.value
      })
    })

    const currentDocStatusDisplayedValue = computed(() => {
      const displayedValue = store.getters.getValueOfFieldOnContainer({
        containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + DOCUMENT_STATUS
      })
      if (!isEmptyValue(displayedValue)) {
        return displayedValue
      }
      const value = currentRecordDocumentStatus.value
      if (!isEmptyValue(documentActionsList.value)) {
        const documentAction = documentActionsList.value.find(docAction => {
          return docAction.value === value
        })
        if (!isEmptyValue(documentAction)) {
          return documentAction.name
        }
      }
      if (!isEmptyValue(documentStatusesList.value)) {
        const docuemntStatus = documentStatusesList.value.find(docStatus => {
          return docStatus.value === value
        })
        if (!isEmptyValue(docuemntStatus)) {
          return docuemntStatus.name
        }
      }
      return ''
    })

    const isEnableRunDocumentAction = computed(() => {
      const isEnabled = isRunableDocumentAction({
        parentUuid: props.parentUuid,
        containerUuid
      })
      if (!isEnabled) {
        return false
      }

      // const docAction = defaultValue.value
      // // is None action
      // if (docAction === '--') {
      //   return true
      // }
      const isEmptyDocAction = isEmptyValue(defaultDocumentAction.value)
      if (isEmptyDocAction) {
        // get list first
        return false
      }
      if (!isEmptyDocAction && isEmptyValue(documentActionsList.value)) {
        // document is closed
        return false
      }
      return true
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    /**
     * Methods
     */

    function displayDocumentActions(nextStatus) {
      if (isEmptyValue(nextStatus)) {
        return emptyDocAction
      }

      const currentStatus = documentActionsList.value.find(docs => {
        return docs.value === nextStatus
      })
      if (!isEmptyValue(currentStatus)) {
        return currentStatus
      }
      return defaultDocumentAction.value
    }

    function handleCommandActions(params) {
      const info = {
        fieldsList: props.containerManager.getFieldsList({
          parentUuid: props.parentUuid,
          containerUuid: containerUuid
        }),
        option: language.t('actionMenu.undo')
      }

      store.dispatch('fieldListInfo', { info })
      selectDocActions.value = params
      isVisibleDocAction.value = true
    }

    function refreshCurrentRecord() {
      refreshRecord.refreshRecord({
        parentUuid: props.parentUuid,
        containerUuid,
        tabId: props.tabAttributes.id,
        recordId: recordId.value,
        isRefreshChilds: true
      })

      const info = {
        fieldsList: props.containerManager.getFieldsList({
          parentUuid: props.parentUuid,
          containerUuid: containerUuid
        }),
        option: language.t('actionMenu.refresh')
      }
      store.dispatch('fieldListInfo', { info })
    }

    function sendAction() {
      isVisibleDocAction.value = false
      isLoadingActions.value = true
      store.dispatch('runDocumentActionOnServer', {
        parentUuid: props.parentUuid,
        containerUuid,
        tableName: props.tabAttributes.tableName,
        recordId: recordId.value,
        recordUuid: recordUuid.value,
        docAction: selectDocActions.value,
        description: message()
      })
        .catch(error => {
          console.warn(`Error Run Doc Action: ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          refreshCurrentRecord()
          isLoadingActions.value = false
        })
    }

    function message() {
      const selectActions = documentActionsList.value.find(action => {
        return action.value === selectDocActions.value
      })
      if (isEmptyValue(selectActions)) {
        return defaultDocumentAction.value
      }
      return selectActions.description
    }

    const timeOut = ref(null)
    function loadDocumentActions() {
      if (isEmptyValue(recordUuid.value) || recordUuid.value === 'create-new') {
        return
      }
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        store.dispatch('getDocumentActionsListFromServer', {
          tableName: props.tabAttributes.tableName,
          recordUuid: recordUuid.value,
          recordId: recordId.value,
          documentStatus: currentRecordDocumentStatus.value
        })
      }, 200)
    }

    watch(recordUuid, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        if (isEmptyValue(defaultDocumentAction.value)) {
          loadDocumentActions()
        }
      }
    })

    // watch(currentRecordDocumentStatus, (newValue, oldValue) => {
    //   if (newValue !== oldValue) {
    //     if (isEmptyValue(defaultDocumentAction.value)) {
    //       loadDocumentActions()
    //     }
    //   }
    // })

    // if (isEmptyValue(defaultDocumentAction.value)) {
    //   loadDocumentActions()
    // }

    return {
      // Ref
      emptyDocAction,
      popoverDocAction,
      selectDocActions,
      isLoadingActions,
      isVisibleDocAction,
      // Computed
      isMobile,
      recordUuid,
      getCurrentTab,
      isEnableRunDocumentAction,
      isRunableDocumentAction,
      currentRecordDocumentStatus,
      currentDocStatusDisplayedValue,
      currentRecordDocumentAction,
      currentRecordDocumentActionDisplayValue,
      documentActionsList,
      defaultDocumentAction,
      defaultName,
      defaultValue,
      // Methods
      displayDocumentActions,
      handleCommandActions,
      sendAction,
      message
    }
  }
})
</script>
