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
  <span>
    <b
      v-if="isActiveCurrentTab"
      style="width: 100% !important;color: #1890ff;font-size: 16px;height: 100% !important;margin: 0px;padding: 0px;height: 100% !important;"
    >
      |
    </b>
    <lock-record
      slot="label"
      :is-active-tab="isActiveTab"
      :parent-uuid="parentUuid"
      :container-uuid="tabMetadata.uuid"
      :table-name="tabMetadata.tableName"
      :tab-name="tabMetadata.name"
    />
    <el-tooltip
      v-if="isExistSecuence"
      :content="openSequenceTab.name"
      placement="top"
    >
      <el-button
        type="text"
        style="margin-left: 0px;"
        @click="sequenceTab "
      >
        <i
          :class="openSequenceTab.icon"
          style="font-size: 15px; color: black;"
        />
      </el-button>
    </el-tooltip>
    <!-- <el-tooltip
      :content="$t('window.gridToggle')"
      placement="top"
    >
      <el-button
        v-if="isActiveTab"
        type="text"
        style="margin-left: 0px;"
        @click="changeShowedRecords "
      >
        <i
          class="el-icon-s-fold"
          style="font-size: 15px; color: black;"
        />
      </el-button>
    </el-tooltip>

    <el-tooltip
      :content="$t('window.toggleTabContentVisibility')"
      placement="top"
    >
      <el-button
        v-if="isActiveTab"
        type="text"
        style="margin-left: 0px;"
        @click="changeShowedTab"
      >
        <svg-icon
          icon-class="eye-open"
          style="font-size: 15px; color: black;"
        />
      </el-button>
    </el-tooltip> -->
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import LockRecord from '@/components/ADempiere/ContainerOptions/LockRecord/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'TabLabel',

  components: {
    LockRecord
  },

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    },
    isActiveTab: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const tabMetadata = computed(() => {
      return store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      )
    })

    const windowMetadata = computed(() => {
      return store.getters.getStoredWindow(
        props.parentUuid
      )
    })
    const classActiveTab = computed(() => {
      if (isActiveCurrentTab.value) {
        return 'is-active-current-tab'
      }
      return ''
    })

    const isActiveCurrentTab = computed(() => {
      if (
        !isEmptyValue(tabMetadata.value.name) &&
        !isEmptyValue(store.getters.getContainerInfo) &&
        !isEmptyValue(store.getters.getContainerInfo.currentTab.name) &&
        (store.getters.getContainerInfo.currentTab.name === tabMetadata.value.name)
      ) {
        return true
      }
      return false
    })

    const openSequenceTab = computed(() => {
      const listAction = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      })
      if (isEmptyValue(listAction)) return []
      return listAction.find(list => list.actionName === 'openSequenceTab')
    })

    const isExistSecuence = computed(() => {
      return !isEmptyValue(openSequenceTab.value)
    })

    /**
     * Change if tabsList is collapse
     */
    function changeShowedTab() {
      if (tabMetadata.value.isParentTab) {
        store.commit('changeWindowAttribute', {
          uuid: props.parentUuid,
          attributeName: 'isShowedTabsParent',
          attributeValue: !windowMetadata.value.isShowedTabsParent
        })
        return
      }

      store.commit('changeWindowAttribute', {
        uuid: props.parentUuid,
        attributeName: 'isShowedTabsChildren',
        attributeValue: !windowMetadata.value.isShowedTabsChildren
      })
    }

    function sequenceTab(params) {
      openSequenceTab.value.openSequenceTab({
        uuid: openSequenceTab.value.uuid,
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
    }

    return {
      // Data
      tabMetadata,
      // computed
      isActiveCurrentTab,
      classActiveTab,
      isExistSecuence,
      openSequenceTab,
      // Methods
      changeShowedTab,
      sequenceTab
    }
  }
})
</script>

<style>
.is-active-current-tab {
  display: block;
  border-top-color: blue;
  border-top-style: solid;
  border-top-width: 0px;
  border-right-color: blue;
  border-right-style: solid;
  border-right-width: 0px;
  border-bottom-color: blue;
  border-bottom-style: solid;
  border-bottom-width: 0px;
  border-left-color: #1890ff;
  border-left-style: solid;
  border-left-width: 5px;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
}
</style>
