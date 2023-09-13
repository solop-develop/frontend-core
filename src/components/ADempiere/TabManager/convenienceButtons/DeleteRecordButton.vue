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
  <el-popover
    v-if="isDeleteRecord"
    v-model="isVisibleConfirmDelete"
    placement="top"
    class="delete-record-container"
  >
    <el-descriptions :title="$t('window.confirmDeleteRecord')" direction="vertical" :column="tabAttributes.identifierColumns.length" border>
      <el-descriptions-item
        v-for="(item, index) in tabAttributes.identifierColumns"
        :key="index"
        :label="item.name"
      >
        <cell-display-info
          v-for="(record, key) in listOfRecordsToDeleted"
          :key="key"
          :field-attributes="item"
          :data-row="record"
        />
      </el-descriptions-item>
    </el-descriptions>

    <div
      style="text-align: right; margin: 0;margin-top: 5px;"
    >
      <el-button
        type="danger"
        class="button-base-icon"
        icon="el-icon-close"
        @click="isVisibleConfirmDelete = false"
      />
      <el-button
        type="primary"
        class="button-base-icon"
        icon="el-icon-check"
        @click="deleteCurrentRecord()"
      />
    </div>

    <el-button
      slot="reference"
      plain
      size="small"
      type="danger"
      class="delete-record-button"
      @click="focusConfirmDelete()"
    >
      <svg-icon icon-class="delete" />
      <span v-if="!isMobile">
        {{ $t('actionMenu.delete') }}
      </span>
    </el-button>
  </el-popover>
</template>

<script>
import Vue from 'vue'
import { computed, defineComponent, ref } from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'

// Components and Mixins
import CellDisplayInfo from '@/components/ADempiere/DataTable/Components/CellDisplayInfo.vue'

// Utils and Melper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { deleteRecord, containerManager } from '@/utils/ADempiere/dictionary/window'

export default defineComponent({
  name: 'DeleteRecordButton',

  components: {
    CellDisplayInfo
  },

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
    const isVisibleConfirmDelete = ref(false)
    const buttonConfirmDelete = ref(null)

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

    const isDeleteRecord = computed(() => {
      if (isExistsChanges.value) {
        return false
      }
      return deleteRecord.enabled({
        parentUuid: props.parentUuid,
        tabParentIndex: tabAttributes.value.tabParentIndex,
        containerUuid: props.containerUuid
      })
    })

    const selectionsRecords = computed(() => {
      return containerManager.getSelection({
        containerUuid: props.containerUuid
      })
    })

    const listOfRecordsToDeleted = computed(() => {
      if (!tabAttributes.value.isShowedTableRecords) {
        const record = store.getters.getTabCurrentRow({
          containerUuid: props.containerUuid
        })
        if (isEmptyValue(record)) {
          return []
        }
        return [record]
      }
      return selectionsRecords.value
    })

    function deleteCurrentRecord() {
      if (tabAttributes.value.isShowedTableRecords && !isEmptyValue(selectionsRecords.value)) {
        store.dispatch('deleteSelectedRecordsFromWindow', {
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid
        })
        isVisibleConfirmDelete.value = false
        return
      }

      const info = {
        fieldsList: tabAttributes.value.fieldsList,
        option: language.t('actionMenu.delete')
      }
      store.dispatch('fieldListInfo', { info })
      deleteRecord.deleteRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        recordUuid: recordUuid.value
      })
      isVisibleConfirmDelete.value = false
    }

    function focusConfirmDelete() {
      if (buttonConfirmDelete.value) {
        Vue.nextTick(() => {
          // TODO: Doesn't work, focus confirm button with displayed popover.
          // buttonConfirmDelete.value.$el.focus()
        })
      }
    }

    return {
      isVisibleConfirmDelete,
      buttonConfirmDelete,
      //
      isDeleteRecord,
      tabAttributes,
      isMobile,
      listOfRecordsToDeleted,
      // Methods
      deleteCurrentRecord,
      focusConfirmDelete
    }
  }
})
</script>
