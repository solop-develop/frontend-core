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
  <el-card
    shadow="never"
    class="box-card"
    :body-style="{ padding: '0px' }"
    style="max-height: 540px;overflow: auto;"
  >
    <el-row
      v-for="item in dataResult"
      :key="item.id"
      class="row-panel"
    >
      <div
        style="padding: 0 10px;"
        @click="handleClick(item)"
      >
        <el-col
          :span="1"
          class="col-panel-svg"
        >
          <svg-icon
            :icon-class="item.icon"
            class="icon-window"
          />
        </el-col>
        <el-col
          :span="23"
          class="col-panel-content"
        >
          <span
            class="label-iten"
          >
            {{ item.display_name }}
          </span>
          <span class="time">
            {{ translateDate({
              value: item.updated,
              format: 'short'
            }) }}
          </span>
        </el-col>
      </div>
    </el-row>
  </el-card>
</template>

<script>
import { requestListRecentItems } from '@/api/ADempiere/logs/index.ts'

// Components and Mixins
import mixinDashboard from '@/components/ADempiere/Dashboard/mixinDashboard.js'

// Utils and Helper Methods
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { convertAction } from '@/utils/ADempiere/dictionary/menu'

export default {
  name: 'RecentItems',

  mixins: [
    mixinDashboard
  ],

  data() {
    return {
      recentItems: [],
      isLoaded: true
    }
  },

  computed: {
    dataResult() {
      if (this.search.length > 0) {
        return this.filterResult(this.search, this.recentItems)
      }
      return this.recentItems
    }
  },

  mounted() {
    this.getRecentItems({})

    this.unsubscribe = this.subscribeChanges()
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    translateDate,

    getRecentItems({ pageToken, pageSize }) {
      return new Promise(resolve => {
        requestListRecentItems({
          pageToken,
          pageSize
        })
          .then(response => {
            const recentItems = response.recent_items.map(item => {
              const actionConverted = convertAction(item.action)

              return {
                ...item,
                action: actionConverted.name,
                icon: actionConverted.icon,
                uuidRecord: item.recordUuid,
                updated: new Date(item.updated),
                uuid: item.menuUuid,
                name: item.menuName,
                description: item.menuDescription
              }
            })
            this.recentItems = recentItems
            this.isLoaded = false
            resolve(recentItems)
          })
          .catch(error => {
            console.warn(`Error getting recent items: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getRecentItems()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    float: inline-end;
    font-size: 10px;
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
  .scroll-panel-recent-items {
    height: 100px !important;
    max-height: 150px !important;
  }
  .row-panel {
    border: 1px solid #e6ebf5;
  }
  .col-panel-svg {
    margin: 10px 0px;
  }
  .col-panel-content {
    padding-left: 10px;
    margin: 10px 0px;
    .label-iten {
      font-size: 13px;
    }
  }
  .col-panel-svg:hover{
    cursor: pointer;
  }
  .col-panel-content:hover{
    cursor: pointer;
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
