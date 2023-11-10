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
      <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
        <template slot="label">
          <i class="el-icon-star-on" style="margin-right: 10px;" />
          {{ $t('window.containerInfo.log.recordID') }}
        </template>
        <span style="color: #606266; font-weight: bold;">
          {{ recordId }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
        <template slot="label">
          <i class="el-icon-star-on" style="margin-right: 10px;" />
          {{ $t('window.containerInfo.log.recordUUID') }}
        </template>
        <span style="color: #606266; font-weight: bold;">
          {{ recordUuid }}
        </span>
      </el-descriptions-item>

      <template v-if="!isEmptyValue(listLogs.entity_logs)">
        <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
          <template slot="label">
            <svg-icon icon-class="user" style="margin-right: 10px;" />
            {{ $t('window.containerInfo.log.createdBy') }}
          </template>
          <span style="color: #606266; font-weight: bold;">
            {{ listLogs.entity_logs.at().created_by_name }}
          </span>
        </el-descriptions-item>

        <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
          <template slot="label">
            <svg-icon icon-class="user" style="margin-right: 10px;" />
            {{ $t('window.containerInfo.log.updatedBy') }}
          </template>
          <span style="color: #606266; font-weight: bold;">
            {{ listLogs.entity_logs.at(-1).updated_by_name }}
          </span>
        </el-descriptions-item>
      </template>
    </el-descriptions>

    <el-timeline v-if="!isEmptyValue(listLogs.entity_logs)" :reverse="true">
      <el-timeline-item
        v-for="(entityLogs, keys) in listLogs.entity_logs"
        :key="entityLogs.logId"
        :type="entityLogs.type"
        :color="'#0bbd87'"
        :timestamp="translateDateByLong(entityLogs.log_date)"
        placement="top"
      >
        <el-card shadow="hover" class="clearfix" style="padding: 2%">
          <div>
            <span style="color: #606266; font-weight: bold;">
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
                <hr v-if="index > 0" style="color: aliceblue;">

                <p v-if="isDocumentStatus({ columnName: changeLog.column_name })">
                  <b>{{ changeLog.display_column_name }} :</b>
                  <strike>
                    <document-status-tag
                      :value="changeLog.old_value"
                      :displayed-value="changeLog.old_display_value"
                    />
                  </strike>
                  <document-status-tag
                    :value="changeLog.new_value"
                    :displayed-value="changeLog.new_display_value"
                  />
                </p>

                <el-descriptions v-else class="margin-top" :column="1">
                  <el-descriptions-item
                    :label="$t('window.containerInfo.log.field')"
                    label-style="{ color: #606266; font-weight: bold; }"
                  >
                    <span style="color: #606266; font-weight: bold;">
                      {{ changeLog.display_column_name }}
                    </span>
                  </el-descriptions-item>

                  <el-descriptions-item
                    :label="$t('window.containerInfo.log.newValue')"
                    label-style="{ color: #606266; font-weight: bold; }"
                  >
                    <el-link type="success">
                      {{ changeLog.new_display_value }}
                    </el-link>
                  </el-descriptions-item>

                  <el-descriptions-item
                    :label="$t('window.containerInfo.log.oldValue')"
                    label-style="{ color: #606266; font-weight: bold; }"
                  >
                    <strike>
                      <el-link type="danger">
                        {{ changeLog.old_display_value }}
                      </el-link>
                    </strike>
                  </el-descriptions-item>

                  <el-descriptions-item
                    :label="$t('window.containerInfo.log.column')"
                    label-style="{ color: #606266; font-weight: bold; }"
                  >
                    <span style="color: #606266; font-weight: bold;">
                      {{ changeLog.column_name }}
                    </span>
                  </el-descriptions-item>
                </el-descriptions>
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
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Utils and Helper Methods
import { isDocumentStatus } from '@/utils/ADempiere/constants/systemColumns'
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'RecordLogs',

  components: {
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

    return {
      currentTabLogs,
      currentRecordLogs,
      getTableName,
      typeAction,
      currentKey,
      listLogs,
      // Methods
      isDocumentStatus,
      showkey,
      translateDateByLong
    }
  }

})
</script>

<style>
.scroll-attachment {
    max-height: 80vh;
}
</style>
