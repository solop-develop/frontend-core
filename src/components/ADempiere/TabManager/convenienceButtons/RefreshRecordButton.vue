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
  <el-button
    v-show="isRefreshRecord"
    plain
    size="small"
    type="primary"
    class="undo-changes-button"
    @click="refreshCurrentRecord()"
  >
    <svg-icon icon-class="refresh" />
    <span v-if="!isMobile">
      {{ $t('actionMenu.refresh') }}
    </span>
  </el-button>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'

// Utils and Melper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { refreshRecord, refreshRecords } from '@/utils/ADempiere/dictionary/window'

export default defineComponent({
  name: 'RefreshRecordButton',

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

    const tabAttributes = computed(() => {
      return store.getters.getStoredTab(props.parentUuid, props.containerUuid)
    })

    const isExistsChanges = computed(() => {
      const persistenceValues = store.getters.getPersistenceAttributesChanges({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        recordUuid: recordUuid.value
      })
      return !isEmptyValue(persistenceValues)
    })

    const isRefreshRecord = computed(() => {
      if (isEmptyValue(recordUuid.value)) {
        return false
      }
      return !isExistsChanges.value
    })

    function refreshCurrentRecord() {
      const info = {
        fieldsList: tabAttributes.value.fieldsList,
        option: language.t('actionMenu.refresh')
      }
      store.dispatch('fieldListInfo', { info })

      if (tabAttributes.value.isShowedTableRecords) {
        refreshRecords.refreshRecords({
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid
        })
        return
      }
      refreshRecord.refreshRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
    }

    return {
      isMobile,
      isRefreshRecord,
      // Methods
      refreshCurrentRecord
    }
  }
})
</script>
