<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com
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
  <span v-show="(isChangeRecord)">
    <el-button
      type="info"
      plain
      size="small"
      :disabled="disableNextRecord"
      style="margin-right: 3px;"
      @click="hangleChangeRecord('changePreviousRecord')"
    >
      <i class="el-icon-arrow-up" />
    </el-button>

    <el-button
      type="info"
      plain
      size="small"
      :disabled="disablePreviousRecord"
      style="margin-right: 3px;margin-left: 0px"
      @click="hangleChangeRecord('changeNextRecord')"
    >
      <i class="el-icon-arrow-down" />
    </el-button>
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ChangeRecord',

  props: {
    parentUuid: {
      type: String,
      default: ''
    },
    containerUuid: {
      type: String,
      default: ''
    },
    containerManager: {
      type: Object,
      required: false
    },
    isChangeRecord: {
      type: Boolean,
      required: false
    }
  },

  setup(props, { root }) {
    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })

    const tableName = computed(() => {
      return store.getters.getStoredTableNameByTab(props.containerUuid)
    })

    const disableNextRecord = computed(() => {
      if (isEmptyValue(recordUuid.value) || recordUuid.value === 'new-record') {
        return true
      }
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid.value)
      if (posicionIndex > 0) {
        return false
      }
      return true
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

    const disablePreviousRecord = computed(() => {
      if (isEmptyValue(recordUuid.value) || recordUuid.value === 'new-record') {
        return true
      }
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid.value)
      const maxRecord = recordsWithFilter.value.length - 1
      if (posicionIndex < maxRecord) {
        return false
      }
      return true
    })

    const recordsWithFilter = computed(() => {
      if (props.containerManager && props.containerManager.getRecordsList) {
        return props.containerManager.getRecordsList({
          containerUuid: props.containerUuid
        })
      }
      return []
    })

    function setRecordPath(recordId) {
      router.push({
        query: {
          ...root.$route.query,
          recordId
        },
        params: {
          ...root.$route.params,
          recordId
        }
      }, () => {})
    }

    /**
     * changePreviousRecord
     */
    function changePreviousRecord() {
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid.value)
      const previosRecord = recordsWithFilter.value[posicionIndex - 1]
      const recordId = previosRecord[tableName.value + '_ID']
      store.dispatch('changeTabAttribute', {
        attributeName: 'isShowedTableRecords',
        attributeNameControl: undefined,
        attributeValue: false,
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
      store.dispatch('changeTabAttribute', {
        attributeName: 'currentRowSelect',
        attributeNameControl: undefined,
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        row: previosRecord
      })

      props.containerManager.seekRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        row: previosRecord
      })
      setRecordPath(recordId)
    }

    /**
     * changePreviousRecord
     */
    function changeNextRecord() {
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid.value)
      const nextRecord = recordsWithFilter.value[posicionIndex + 1]
      const recordId = nextRecord[tableName.value + '_ID']

      store.dispatch('changeTabAttribute', {
        attributeName: 'isShowedTableRecords',
        attributeNameControl: undefined,
        attributeValue: false,
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
      store.dispatch('changeTabAttribute', {
        attributeName: 'currentRowSelect',
        attributeNameControl: undefined,
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        row: nextRecord
      })

      props.containerManager.seekRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        row: nextRecord
      })

      setRecordPath(recordId)
    }

    function hangleChangeRecord(action) {
      if (isExistsChanges.value) {
        store.dispatch('flushPersistenceQueue', {
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid,
          tableName: tabAttributes.value.tableName,
          recordUuid: recordUuid.value
        })
          .then(() => {
            if (action === 'changeNextRecord') return changeNextRecord()
            return changePreviousRecord()
          })
        return
      }
      if (action === 'changeNextRecord') return changeNextRecord()
      return changePreviousRecord()
    }

    return {
      // Computed
      tabAttributes,
      isExistsChanges,
      disableNextRecord,
      recordsWithFilter,
      disablePreviousRecord,
      // Methods
      changeNextRecord,
      hangleChangeRecord,
      changePreviousRecord
    }
  }

})
</script>

<style lang="scss">
.custom-pagination-content {
  margin-left: 0px !important;
  margin-right: 0px !important;
  // margin-top: 1% !important;
  .selections-number {
    margin-right: 10px;
    font-weight: normal;
    color: #606266;
  }
}
</style>
<style scoped>
.is-pagination-content-panel {
  position: absolute !important;
  left: 1px !important;
}
.is-pagination-content-panel-mobile {
  position: absolute !important;
  top: 100% !important;
  left: 1px !important;
}
</style>
