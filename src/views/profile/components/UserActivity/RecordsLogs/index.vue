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
  <el-card
    shadow="hover"
    style="padding: 0px !important;"
    :body-style="{ padding: '10px 5px' }"
  >
    <div :style="styleShow(isShow)">
      <span style="color: #606266; font-weight: bold;">
        <svg-icon
          icon-class="tab"
        />
        <b style="padding: 0px 5px;">
          {{ entityLog.displayedName }}
        </b>
      </span>

      <el-link
        type="primary"
        style="float: right;"
        @click="isShow = !isShow"
      >
        {{ $t('window.containerInfo.changeDetail') }}
      </el-link>

      <span v-if="entityLog.eventType === EVENT_INSERT" style="color: #606266; font-weight: bold;">
        {{ $t('window.containerInfo.log.createdBy') }} <b>:</b>
        {{ entityLog.createdByName }}
        <i class="el-icon-user-solid" />
      </span>
      <span v-else-if="entityLog.eventType === EVENT_UPDATE" style="color: #606266; font-weight: bold;">
        {{ $t('window.containerInfo.log.updatedBy') }} <b>:</b>
        {{ entityLog.updatedByName }}
        <i class="el-icon-user-solid" />
      </span>
      <span v-else-if="entityLog.eventType === EVENT_DELETE" style="color: #606266; font-weight: bold;">
        {{ $t('window.containerInfo.log.deletedBy') }} <b>:</b>
        {{ entityLog.updatedByName }}
        <i class="el-icon-user-solid" />
      </span>
    </div>

    <el-collapse-transition>
      <div
        v-show="isShow"
        style="margin-top: 10px;"
      >
        <el-descriptions :column="1">
          <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
            <template slot="label">
              <svg-icon icon-class="table" style="margin-right: 10px;" />
              {{ $t('window.containerInfo.log.tableName') }}
            </template>
            <span style="color: #606266;">
              {{ entityLog.tableName }}
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
              {{ entityLog.id }}
            </span>
          </el-descriptions-item>

          <el-descriptions-item label-style="{ color: #606266; font-weight: bold; }">
            <template slot="label">
              <i class="el-icon-star-on" style="margin-right: 10px;" />
              {{ $t('window.containerInfo.log.recordUUID') }}
            </template>
            <span style="color: #606266;">
              {{ entityLog.uuid }}
            </span>
          </el-descriptions-item>
        </el-descriptions>

        <span v-for="(changeLog, index) in entityLog.changeLogs" :key="index">
          <hr class="divider">
          <!-- {{ changeLog }} -->
          <change-log
            :change-log="changeLog"
          />
        </span>
      </div>
    </el-collapse-transition>
  </el-card>
</template>

<script>
import {
  defineComponent,
  ref
} from '@vue/composition-api'

// Components and Mixins
import ChangeLog from '@/components/ADempiere/PanelInfo/Component/RecordLogs/changeLog.vue'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Constants
import { EVENT_INSERT, EVENT_UPDATE, EVENT_DELETE } from '@/utils/ADempiere/recordUtil/index.ts'

export default defineComponent({
  name: 'RecordsLogs',

  components: {
    ChangeLog,
    DocumentStatusTag
  },

  props: {
    entityLog: {
      type: Object,
      required: true
    }
  },

  setup() {
    const isShow = ref(true)
    function styleShow(show) {
      if (show) {
        return 'padding: 0px;padding-top: 10px'
      }
      return 'padding: 0px;'
    }
    // const recordId = computed(() => {
    //   const { recordId } = props.entityLogs
    //   return recordId
    // })

    return {
      EVENT_INSERT,
      EVENT_UPDATE,
      EVENT_DELETE,
      isShow,
      // recordId
      styleShow
    }
  }
})
</script>
