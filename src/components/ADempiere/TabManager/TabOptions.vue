<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com https://github.com/elsiosanchez
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
  <div>
    <span v-show="!isEditSecuence">
      <el-button
        plain
        size="small"
        type="primary"
        style="margin-right: 2px;"
        @click="changeShowedRecords"
      >
        <span style="padding: 0px;">
          <svg-icon icon-class="table" />
          <b v-show="!isMobile">
            {{ label }}
          </b>
        </span>
      </el-button>

      <change-record
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
        :container-manager="containerManager"
        :is-change-record="isChangeRecord"
      />
    </span>

    <convenience-buttons
      :parent-uuid="parentUuid"
      :container-uuid="currentTabUuid"
      :container-manager="containerManager"
      :tab-attributes="tabAttributes"
      style="display: contents;"
    />

    <!-- <full-screen-container
      style="float: right;"
      :parent-uuid="parentUuid"
      :container-uuid="currentTabUuid"
    /> -->

    <action-menu
      :parent-uuid="parentUuid"
      :container-uuid="$store.getters.getContainerInfo.currentTab.containerUuid"
      :container-manager="containerManager"
      :actions-manager="listAction"
      style="float: right;"
    />
    <el-drawer
      :visible.sync="showMenuMobile"
      :with-header="true"
      size="100%"
      class="drawer-panel-info"
    >
      <span slot="title">
        <span style="color: #606266; font-weight: bold;">
          {{ $t('actionMenu.menu') }} {{ $store.getters.getContainerInfo.currentTab.name }}
        </span>
      </span>
      <menu-mobile
        :parent-uuid="parentUuid"
        :container-uuid="$store.getters.getContainerInfo.currentTab.containerUuid"
        :container-manager="containerManager"
        :actions-manager="listAction"
      />
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// Components and Mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import menuMobile from '@/components/ADempiere/ActionMenu/menuMobile.vue'
import ConvenienceButtons from '@/components/ADempiere/TabManager/convenienceButtons/index.vue'
// import FullScreenContainer from '@/components/ADempiere/ContainerOptions/FullScreenContainer'
import ChangeRecord from '@/components/ADempiere/DataTable/Components/ChangeRecord.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TabOptions',

  components: {
    ActionMenu,
    ConvenienceButtons,
    // AdvancedTabQuery,
    // FullScreenContainer,
    ChangeRecord,
    menuMobile
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
    currentTabUuid: {
      type: String,
      default: ''
    },
    containerUuid: {
      type: String,
      default: ''
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    },
    // used only window
    isChangeRecord: {
      type: Boolean,
      required: false
    }
  },

  setup(props) {
    const listAction = computed(() => {
      const tab = store.getters.getContainerInfo.currentTab
      return {
        parentUuid: props.parentUuid,
        containerUuid: isEmptyValue(tab) ? props.tabAttributes.uuid : tab.containerUuid,
        defaultActionName: language.t('actionMenu.createNewRecord'),
        tableName: isEmptyValue(tab) ? props.tabAttributes.tableName : tab.tableName,
        withoutDefaulAction: true,
        getActionList: () => {
          return store.getters.getStoredActionsMenu({
            containerUuid: isEmptyValue(tab) ? props.tabAttributes.uuid : tab.containerUuid
          })
        }
      }
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const isShowedTableRecords = computed(() => {
      return tabData.value.isShowedTableRecords
    })

    const isEditSecuence = computed(() => {
      return tabData.value.isEditSecuence
    })

    const tabData = computed(() => {
      return store.getters.getStoredTab(
        props.parentUuid,
        props.tabAttributes.uuid
      )
    })

    const label = computed(() => {
      if (isShowedTableRecords.value) {
        return language.t('window.toggleSingle')
      }
      return language.t('window.multiRecord')
    })

    const showMenuMobile = computed({
      // getter
      get() {
        return store.getters.getShowMenuMobile
      },
      // setter
      set(newValue) {
        store.commit('setShowMenuMobile', newValue)
      }
    })

    function changeShowedRecords() {
      const row = store.getters.getTabCurrentRow({ containerUuid: props.currentTabUuid })
      store.dispatch('changeTabAttribute', {
        attributeName: 'currentRowSelect',
        attributeNameControl: undefined,
        attributeValue: row,
        parentUuid: props.parentUuid,
        containerUuid: props.tabAttributes.uuid
      })
      // props.containerManager.setSelection({
      //   containerUuid: props.containerUuid,
      //   recordsSelected: [tabData.value.currentRowSelect]
      // })
      store.commit('setTabSelectionsList', {
        containerUuid: props.containerUuid,
        recordsSelected: [row]
      })
      // props.containerManager.setSelection({
      //   containerUuid: props.containerUuid,
      //   recordsSelected: [row]
      // })
      store.dispatch('changeTabAttribute', {
        attributeName: 'isShowedTableRecords',
        attributeNameControl: undefined,
        attributeValue: !tabData.value.isShowedTableRecords,
        parentUuid: props.parentUuid,
        containerUuid: props.tabAttributes.uuid
      })
    }

    return {
      // computed
      label,
      isMobile,
      listAction,
      isEditSecuence,
      showMenuMobile,
      isShowedTableRecords,
      // methods
      changeShowedRecords
    }
  }

})
</script>
