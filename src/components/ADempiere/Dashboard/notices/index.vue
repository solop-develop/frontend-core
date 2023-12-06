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
      <el-card
        v-for="notices in listAllNotices"
        :key="notices.id"
        :body-style="{ padding: '5px' }"
      >
        <div
          style="margin-top: 10px;"
        >
          <el-row>
            <el-col
              :span="24"
            >
              <notices-logs
                :metadata="notices"
              />
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script>
import {
  defineComponent, ref
} from '@vue/composition-api'
// Api Request Methods
import {
  listNotices
} from '@/api/ADempiere/form/notice'
// Components and Mixins
import NoticesLogs from '@/components/ADempiere/Dashboard/notices/itemsNotices.vue'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'noticeManagement',
  components: {
    NoticesLogs
  },
  setup() {
    const listAllNotices = ref([])
    const search = ref('')
    function loadListNotices() {
      listNotices()
        .then(response => {
          const { records } = response
          listAllNotices.value = records.map(list => {
            return {
              ...list,
              show: false
            }
          })
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
