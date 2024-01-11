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
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <span
    v-if="!isLoading"
  >
    <el-descriptions :column="1">
      <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
        <template slot="label">
          <svg-icon icon-class="table" style="margin-right: 10px;" />
          {{ $t('window.containerInfo.log.tableName') }}
        </template>
        <span style="color: #606266; font-weight: bold;">
          {{ getTableName }}
        </span>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2">
      <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
        <template slot="label">
          <i class="el-icon-star-on" style="margin-right: 10px;" />
          {{ $t('window.containerInfo.log.recordID') }}
        </template>
        <span style="color: #606266;">
          {{ recordId }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
        <template slot="label">
          <i class="el-icon-star-on" style="margin-right: 10px;" />
          {{ $t('window.containerInfo.log.recordUUID') }}
        </template>
        <span style="color: #606266;">
          {{ recordUuid }}
        </span>
      </el-descriptions-item>

      <template v-if="!isEmptyValue(listLogs)">
        <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
          <template slot="label">
            <svg-icon icon-class="user" style="margin-right: 10px;" />
            {{ $t('window.containerInfo.log.createdBy') }}
          </template>
          <span style="color: #606266; font-weight: bold;">
            {{ listLogs.created_by_name }}
          </span>
          <span style="color: #606266; padding-left: 5px;">
            ({{ translateDate({ value: listLogs.created }) }})
          </span>
        </el-descriptions-item>

        <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
          <template slot="label">
            <svg-icon icon-class="user" style="margin-right: 10px;" />
            {{ $t('window.containerInfo.log.updatedBy') }}
          </template>
          <span style="color: #606266; font-weight: bold;">
            {{ listLogs.updated_by_name }}
          </span>
          <span style="color: #606266; padding-left: 5px;">
            ({{ translateDate({ value: listLogs.updated }) }})
          </span>
        </el-descriptions-item>
      </template>
    </el-descriptions>

    <el-timeline v-if="!isEmptyValue(listLogs.entity_logs)">
      <el-timeline-item
        v-for="(entityLogs, keys) in listLogs.entity_logs"
        :key="entityLogs.logId"
        :type="timeLineColor(entityLogs.event_type)"
        :timestamp="translateDate({ value: entityLogs.log_date, format: 'long' })"
        placement="top"
      >
        <el-card shadow="hover" class="clearfix" style="padding: 5px 10px;">
          <div>
            <span v-if="entityLogs.event_type === EVENT_INSERT" style="color: #606266; font-weight: bold;">
              {{ $t('window.containerInfo.log.createdBy') }} <b>:</b>
              {{ entityLogs.created_by_name }}
              <i class="el-icon-user-solid" />
            </span>
            <span v-else-if="entityLogs.event_type === EVENT_UPDATE" style="color: #606266; font-weight: bold;">
              {{ $t('window.containerInfo.log.updatedBy') }} <b>:</b>
              {{ entityLogs.updated_by_name }}
              <i class="el-icon-user-solid" />
            </span>

            <el-link
              type="primary"
              style="float: right;"
              @click="showkey(keys)"
            >
              {{ $t('window.containerInfo.changeDetail') }}
            </el-link>
          </div>

          <el-collapse-transition>
            <div v-show="(currentKey === keys)">
              <span v-for="(changeLog, index) in entityLogs.change_logs" :key="index">
                <hr class="divider">

                <change-log
                  :change-log="changeLog"
                />
              </span>
            </div>
          </el-collapse-transition>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <div v-else>
      <el-empty />
    </div>
  </span>
  <loading-view
    v-else
    key="Record-Logs-Loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import ChangeLog from '@/components/ADempiere/PanelInfo/Component/RecordLogs/changeLog.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Constants
import { EVENT_INSERT, EVENT_UPDATE, EVENT_DELETE } from '@/utils/ADempiere/recordUtil/index.ts'

// Utils and Helper Methods
import { isDocumentStatus } from '@/utils/ADempiere/constants/systemColumns'
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'RecordLogs',

  components: {
    ChangeLog,
    DocumentStatusTag,
    LoadingView
  },

  props: {
    containerUuid: {
      type: String,
      required: false
    },
    tableName: {
      type: String,
      default: ''
    },
    recordId: {
      type: Number,
      required: false
    },
    recordUuid: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const currentRecordLogs = ref({ name: '' })
    const currentKey = ref(-1)
    const typeAction = ref(0)
    const currentTabLogs = ref('0')

    // // use getter to reactive properties
    const listLogs = computed(() => {
      return store.getters.getRecordLogs
    })

    /**
     * showkey
     */
    const showkey = (key, index) => {
      if (key === currentKey.value && index === typeAction.value) {
        currentKey.value = 1000
      } else {
        currentKey.value = key
        typeAction.value = index
      }
    }

    const getTableName = computed(() => {
      // const { currentTab } = store.getters.getContainerInfo
      return store.getters.getStoredTableNameByTab(props.containerUuid)
    })

    function timeLineColor(event) {
      if (event === EVENT_INSERT) {
        return 'success' // '#0BBD87'
      } else if (event === EVENT_UPDATE) {
        return 'primary' // '#409EFF'
      } else if (event === EVENT_DELETE) {
        return 'danger'
      }
    }

    return {
      // Constants
      EVENT_INSERT,
      EVENT_UPDATE,
      EVENT_DELETE,
      // Computeds
      currentTabLogs,
      currentRecordLogs,
      getTableName,
      typeAction,
      currentKey,
      listLogs,
      // Methods
      isDocumentStatus,
      showkey,
      translateDate,
      timeLineColor
    }
  }

})
</script>

<style>
.scroll-attachment {
    max-height: 80vh;
}
</style>
