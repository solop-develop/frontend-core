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
      <el-table :data="dataResult" max-height="455" @row-click="handleClick">
        <el-table-column width="40">
          <template slot-scope="{row}">
            <svg-icon :icon-class="row.icon" class="icon-window" />
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              :metadata="scope"
              :placeholder="$t('table.dataTable.search')"
            >
              <svg-icon slot="prefix" icon-class="search" />
            </el-input>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
            <el-tag size="mini" class="action-tag">
              {{ $t(`views.${row.action}`) }}
            </el-tag>
            <br>
            <el-button-group class="actions-buttons">
              <el-tooltip :content="$t('quickAccess.newRecord')" placement="top">
                <el-button
                  v-if="row.action === 'window'"
                  size="mini"
                  circle
                  @click.stop="windowAction(row, 'create-new')"
                >
                  <i class="el-icon-circle-plus-outline" />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('quickAccess.listRecords')" placement="top">
                <el-button
                  v-if="row.action === 'window'"
                  size="mini"
                  circle
                  @click.stop="windowAction(row, 'listRecords')"
                >
                  <i class="el-icon-search" />
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
// Components and Mixins
import mixinDashboard from '@/components/ADempiere/Dashboard/mixinDashboard.js'

// API Request Methods
import { getFavoritesRequest } from '@/api/ADempiere/dashboard/index.ts'

// Utils and Helper Methods
import { convertAction } from '@/utils/ADempiere/dictionaryUtils.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default {
  name: 'Favorites',

  mixins: [
    mixinDashboard
  ],

  data() {
    return {
      favorites: [],
      isLoaded: true
    }
  },

  computed: {
    dataResult() {
      if (this.search.length > 0) {
        return this.filterResult(this.search, this.favorites)
      }
      return this.favorites
    }
  },

  mounted() {
    this.getFavoritesList()

    this.unsubscribe = this.subscribeChanges()
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    getFavoritesList() {
      return new Promise(resolve => {
        getFavoritesRequest({})
          .then(response => {
            const favorites = response.favoritesList.map(favoriteElement => {
              const actionConverted = convertAction(favoriteElement.action)
              return {
                ...favoriteElement,
                uuid: favoriteElement.menuUuid,
                name: favoriteElement.menuName,
                description: favoriteElement.menuDescription,
                action: actionConverted.name,
                icon: actionConverted.icon
              }
            })
            this.favorites = favorites
            resolve(favorites)
          })
          .catch(error => {
            console.warn(`Error getting favorites: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getFavoritesList()
        }
      })
    },
    windowAction(row, param) {
      const containerIdentifier = row.action + '_' + row.referenceId
      zoomIn({
        attributeValue: containerIdentifier,
        attributeName: 'containerKey',
        query: {
          tabParent: 0,
          action: param
        }
      })
    }
  }
}
</script>

<style scoped>
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
  .actions-buttons {
    float: right;
  }
</style>
