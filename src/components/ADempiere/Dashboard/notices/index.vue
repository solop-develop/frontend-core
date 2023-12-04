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
  <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="never">
    <div class="recent-items">
      <el-table :data="listAllNotices" max-height="455">
        <el-table-column width="40">
          <svg-icon
            icon-class="notifications"
            class="icon-window"
            style="font-size: 30px !important;"
          />
        </el-table-column>

        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              :metadata="scope"
              class="clearfix"
              :placeholder="$t('table.dataTable.search')"
            >
              <svg-icon slot="prefix" icon-class="search" />
            </el-input>
          </template>

          <template slot-scope="{row}">
            <el-tooltip
              effect="dark"
              :content="row.text_message"
            >
              <span>{{ row.message }}</span>
            </el-tooltip>
            <el-tag class="action-tag">
              <svg-icon
                icon-class="user"
                class="icon-window"
                style="font-size: 16px;"
              />
              {{ row.user.name }}
            </el-tag>
            <br>
            <span class="time">
              {{ translateDate({
                value: row.created,
                format: 'long'
              }) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import {
  defineComponent, ref
} from '@vue/composition-api'
// Api Request Methods
import {
  // listUsers,
  listNotices
  // deleteNotices,
  // acknowledgeNotice
} from '@/api/ADempiere/form/notice'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'noticeManagement',

  setup() {
    const listAllNotices = ref([])
    const search = ref('')
    function loadListNotices() {
      listNotices()
        .then(response => {
          const { records } = response
          listAllNotices.value = records
        })
        .catch(error => {
          let message = error.message
          if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
            message = error.response.data.message
          }
          showMessage({
            message,
            type: 'warning'
          })
        })
    }
    loadListNotices()
    return {
      search,
      listAllNotices,
      translateDate,
      loadListNotices
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
<style>
  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }
</style>
