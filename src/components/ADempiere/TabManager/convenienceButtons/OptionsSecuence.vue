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
  <div
    class="convenience-buttons-main"
  >
    <el-button
      plain
      size="small"
      type="primary"
      :style="isMobile ? 'margin-left: 1px;padding-right: 6px;' : 'margin-left: 8px; padding-right: 9px;'"
      class="undo-changes-button"
      @click="save()"
    >
      <svg-icon icon-class="save-AD" />
      <span v-if="!isMobile">
        {{ $t('component.sequenceSort.saveNewSequence') }}
      </span>
    </el-button>
    <el-button
      v-if="false"
      plain
      size="small"
      type="warning"
      class="undo-changes-button"
    >
      <svg-icon icon-class="undo" />
      <span v-if="!isMobile">
        {{ $t('component.sequenceSort.undoCustomization') }}
      </span>
    </el-button>
    <el-button
      plain
      size="small"
      type="danger"
      class="delete-record-button"
      @click="close()"
    >
      <svg-icon icon-class="logout" />
      <span v-if="!isMobile">
        {{ $t('component.sequenceSort.exitNewSequence') }}
      </span>
    </el-button>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
export default defineComponent({
  name: 'OptionsSecuence',

  props: {
    parentUuid: {
      type: [String, Number],
      default: undefined
    },
    containerManager: {
      type: Object,
      required: false
    },
    currentTabUuid: {
      type: [String, Number],
      default: ''
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    // Const
    const containerUuid = props.tabAttributes.uuid
    // Computed
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

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    function save() {
      store.commit('setShowNewSequence', true)
    }
    /**
     * Close Modal Dialog
     */
    function close() {
      store.commit('setShowNewSequence', false)
      props.containerManager.changePanelAttribute({
        parentUuid: props.parentUuid,
        containerUuid,
        attributeName: 'isEditSecuence',
        attributeValue: false
      })
    }

    return {
      // Computed
      isMobile,
      getCurrentTab,
      // Methods
      save,
      close
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
