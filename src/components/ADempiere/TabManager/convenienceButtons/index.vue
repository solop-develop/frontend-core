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
  <span v-if="!isEditSecuence">
    <div v-if="isDisableOptionsTabChild" class="convenience-buttons-main">
      <new-record-button
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
      />

      <undo-change-button
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
      />

      <refresh-record-button
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
      />

      <delete-record-button
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
      />

      <save-record-button
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
      />

      <document-action
        v-if="tabAttributes.isDocument"
        :parent-uuid="parentUuid"
        :container-manager="containerManager"
        :tab-attributes="tabAttributes"
      />
      <advanced-tab-query
        v-if="!isMobile"
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
        :container-manager="containerManager"
        style="float: right;"
      />

    </div>
  </span>
  <div v-else>
    <options-secuence
      :parent-uuid="parentUuid"
      :container-uuid="tabAttributes.uuid"
      :tab-attributes="tabAttributes"
      :container-manager="containerManager"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import AdvancedTabQuery from '@/components/ADempiere/TabManager/AdvancedTabQuery.vue'
import DocumentAction from '@/components/ADempiere/TabManager/convenienceButtons/documentAction.vue'
import NewRecordButton from '@/components/ADempiere/TabManager/convenienceButtons/NewRecordButton.vue'
import SaveRecordButton from '@/components/ADempiere/TabManager/convenienceButtons/SaveRecordButton.vue'
import UndoChangeButton from '@/components/ADempiere/TabManager/convenienceButtons/UndoChangeButton.vue'
import RefreshRecordButton from '@/components/ADempiere/TabManager/convenienceButtons/RefreshRecordButton.vue'
import DeleteRecordButton from '@/components/ADempiere/TabManager/convenienceButtons/DeleteRecordButton.vue'
import OptionsSecuence from '@/components/ADempiere/TabManager/convenienceButtons/OptionsSecuence.vue'
export default defineComponent({
  name: 'ConvenienceButtons',

  components: {
    AdvancedTabQuery,
    DocumentAction,
    NewRecordButton,
    SaveRecordButton,
    UndoChangeButton,
    RefreshRecordButton,
    DeleteRecordButton,
    OptionsSecuence
  },

  props: {
    parentUuid: {
      type: String,
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
    const containerUuid = props.tabAttributes.uuid

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(containerUuid)
    })

    const isDisableOptionsTabChild = computed(() => {
      if (!getCurrentTab.value.isParentTab) {
        if (store.getters.getUuidOfContainer(getCurrentTab.value.firstTabUuid)) {
          return true
        }
        return false
      }
      return true
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

    const isEditSecuence = computed(() => {
      const tab = store.getters.getStoredTab(
        props.parentUuid,
        containerUuid
      )
      if (tab) {
        return tab.isEditSecuence
      }
      return props.tabAttributes.isEditSecuence
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    function openLog() {
      const list = store.getters.getTabRecordsList({ containerUuid })
      const currentRecord = list.find(row => row.UUID === recordUuid.value)
      store.dispatch('showLogs', {
        tableName: props.tabAttributes.tableName,
        recordUuid: recordUuid.value,
        containerUuid,
        currentRecord,
        show: true
      })
    }

    /**
     * Vuex subscription when record parent change
     * TODO: Add support to restart or delete timer by flushPersistenceQueue
     */
    // const unsubscribeChangeParentRecord = () => {}

    // unsubscribeChangeParentRecord = store.subscribeAction({
    //   before: (action, state) => {
    //     if (action.type === 'addKeyPressed' && action.payload && action.payload.containerUuid === containerUuid) {
    //       // restart timer
    //     }
    //   }
    // })

    // remove susbscriptions
    // onUnmounted(() => {
    //   unsubscribeChangeParentRecord()
    // })

    return {
      // Computeds
      isMobile,
      recordUuid,
      getCurrentTab,
      isEditSecuence,
      isDisableOptionsTabChild,
      // Methodss
      openLog
    }
  }

})
</script>

<style lang="scss">
.convenience-buttons-main {
  display: contents;
  .delete-record-container {
    padding-left: 4px;
    padding-right: 4px;
  }
  .el-button {
    padding-left: 9px;
    padding-right: 9px;
  }
}
</style>
