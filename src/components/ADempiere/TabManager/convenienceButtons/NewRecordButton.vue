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
  <!-- old implementation -->
  <!-- <el-button
    v-if="isCreateRecord"
    plain
    size="small"
    type="success"
    class="new-record-button"
    @click="newRecord()"
  >
    <svg-icon icon-class="newRecord" />
    <span v-if="!isMobile">
      {{ $t('actionMenu.new') }}
    </span>
  </el-button> -->

  <el-dropdown
    v-if="isCreateRecord"
    split-button
    size="small"
    trigger="click"
    class="new-record-button"
    :style="isMobile ? 'margin-left: 1px; padding-right: 4px' : 'margin-left: 8px; padding-right: 9px;'"
    @click="handleCommandActions('newEmptyRecord');"
    @command="handleCommandActions"
  >
    <svg-icon icon-class="newRecord" />
    <span v-if="!isMobile">
      {{ $t('actionMenu.new') }}
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        command="newEmptyRecord"
      >
        <svg-icon icon-class="newRecord" />
        {{ $t('window.newRecord') }}
      </el-dropdown-item>
      <el-dropdown-item
        command="copyAndNewRecord"
        divided
      >
        <i class="el-icon-copy-document" />
        {{ $t('window.copyRecord') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'

// Utils and Melper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { createNewRecord } from '@/utils/ADempiere/dictionary/window'

export default defineComponent({
  name: 'NewRecordButton',

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })
    const recordParentTab = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })

    const isExistsChanges = computed(() => {
      const persistenceValues = store.getters.getPersistenceAttributesChanges({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        recordUuid: recordUuid.value
      })
      return !isEmptyValue(persistenceValues)
    })

    const tabAttributes = computed(() => {
      return store.getters.getStoredTab(props.parentUuid, props.containerUuid)
    })

    const isSecondaryParentTab = computed(() => {
      return !isEmptyValue(tabAttributes.value.tabParentIndex) && tabAttributes.value.tabParentIndex > 0
    })

    const isCreateRecord = computed(() => {
      if (isSecondaryParentTab.value) {
        return false
      }
      if (isExistsChanges.value) {
        return false
      }

      return createNewRecord.enabled({
        parentUuid: props.parentUuid,
        tabParentIndex: tabAttributes.value.tabParentIndex,
        containerUuid: props.containerUuid
      })
    })

    function handleCommandActions(command) {
      if (command === 'newEmptyRecord') {
        newRecord()
      } else if (command === 'copyAndNewRecord') {
        newRecord(true)
      }
    }

    function newRecord(isCopy = false) {
      createNewRecord.createNewRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        isCopyValues: isCopy
      })

      store.dispatch('panelInfo', {
        currentTab: tabAttributes.value,
        currentRecord: recordParentTab.value
      })
      const info = {
        fieldsList: tabAttributes.value.fieldsList,
        option: language.t('actionMenu.new')
      }
      store.dispatch('fieldListInfo', { info })
    }

    return {
      isCreateRecord,
      isMobile,
      handleCommandActions
    }
  }
})
</script>

<style lang="scss">
.new-record-button {
  &.el-dropdown {
    .el-button {
      // as button success with plain
      background: #e7faf0;
      color: #13ce66;
      border-color: #a1ebc2;

      &:hover {
        // as button success without plain
        background: #13ce66;
        border-color: #13ce66;
        color: #fff;
      }
    }
  }
}
</style>
