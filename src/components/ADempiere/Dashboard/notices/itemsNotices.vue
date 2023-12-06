<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Leonel Matos lmatos@erpya.com
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
  <el-descriptions
    direction="horizontal"
    :column="1"
    border
  >
    <el-descriptions-item>
      <template slot="label">
        <svg-icon
          icon-class="user"
          class="icon-window"
          style="font-size: 16px;"
        />
        {{ $t('window.containerInfo.notices.user') }}
      </template>
      <el-tag>
        <svg-icon
          icon-class="user"
          class="icon-window"
          style="font-size: 16px;"
        />
        {{ metadata.user.name }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Username">
      <template slot="label">
        <svg-icon
          icon-class="calendar"
          class="icon-window"
          style="font-size: 16px;"
        />
        {{ $t('window.containerInfo.log.created') }}
      </template>
      {{ translateDate( {value: metadata.created, format: 'long' }) }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="$t('page.processActivity.logs')"
      label-style="{ color: #606266; font-weight: bold; }"
    >
      {{ metadata.text_message }}
    </el-descriptions-item>
    <el-descriptions-item
      label="Referencia"
      label-style="{ color: #606266; font-weight: bold; }"
    >
      {{ metadata.reference }}
    </el-descriptions-item>
    <!-- <el-descriptions-item
      :label="$t('window.containerInfo.log.recordID')"
      label-style="{ color: #606266; font-weight: bold; }"
    >
      <span style="color: #606266; font-weight: bold;">
        {{ metadata.record_id }}
      </span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <svg-icon
          icon-class="table"
          class="icon-window"
          style="font-size: 16px;"
        />
        {{ $t('window.containerInfo.log.tableName') }}
      </template>
      <span style="color: #606266; font-weight: bold;">
        {{ metadata.table_name }}
      </span>
    </el-descriptions-item> -->
  </el-descriptions>
</template>

<script>
import {
  defineComponent
} from '@vue/composition-api'
// Utils and Helper Methods
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'noticeManagement',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      translateDate
    }
  }
})
</script>

<style scoped>
  .el-table {
    background-color: #FFFFFF;
  }
  .search_recent {
    width: 50% !important;
    float: right;
  }
  .header {
    padding-bottom: 10px;
  }
  .recent-items {
    height: 455px;
    overflow: auto;
  }
  .time {
    float: left;
    font-size: 11px;
    color: #999;
  }
  .card-box {
    cursor: pointer;
  }
  .card-content {
    font-size: 15px;
  }
  .icon-window {
    font-size: x-large;
    color: #36a3f7;
  }
  .action-tag {
    float: right;
  }
</style>
