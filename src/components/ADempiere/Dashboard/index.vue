<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
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
    v-if="!UNSUPPORTED_DASHBOARDS.includes(metadata.fileName)"
    style="height: auto;"
    :body-style="{ padding: '5px;'}"
  >
    <div class="clearfix">
      <el-row :gutter="2">
        <el-col :span="main ? 22 : 23">
          <el-button
            type="text"
            class="label-dashboard"
            @click="metadata.isCollapsible = !metadata.isCollapsible"
          >
            {{ labelDashboard }}
          </el-button>
        </el-col>
        <el-col v-if="main" :span="1">
          <el-button type="text" icon="el-icon-files" @click="sendMain(metadata)" />
        </el-col>
        <el-col :span="1">
          <el-button
            type="text"
            :icon="!metadata.isCollapsible ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
            @click="metadata.isCollapsible = !metadata.isCollapsible"
          />
        </el-col>
      </el-row>
    </div>
    <transition name="el-zoom-in-top">
      <div v-show="metadata.isCollapsible" class="dashboard-transitio">
        <component
          :is="renderDashboard"
          :ref="metadata.name"
          :metadata="metadata"
          :height="'450px'"
        />
      </div>
    </transition>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import { UNSUPPORTED_DASHBOARDS } from '@/utils/ADempiere/dictionary/dashboard'

// Utils and Helper Methods
import { getChartComponent } from '@/utils/ADempiere/dictionary/dashboard'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'DashboardDefinition',

  props: {
    metadata: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    main: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const activeDashboard = props.metadata.isOpenByDefault ? props.metadata.name : undefined

    // load the component that is indicated in the attributes of received property
    const renderDashboard = computed(() => {
      // // TODO: Add support to this list of currently unsupported dashboards
      // if (UNSUPPORTED_DASHBOARDS.includes(props.metadata.fileName)) {
      //   return
      // }
      let dashboard = () => import('@/components/ADempiere/Dashboard/UnsupportedDashboard')
      if (props.metadata.dashboardType === 'dashboard') {
        switch (props.metadata.fileName) {
          case 'activities':
            dashboard = () => import('@/components/ADempiere/Dashboard/activities')
            break
          case 'calendar':
            dashboard = () => import('@/components/ADempiere/Dashboard/calendar')
            break
          case 'docstatus':
            dashboard = () => import('@/components/ADempiere/Dashboard/docstatus')
            break
          case 'recentItems':
            dashboard = () => import('@/components/ADempiere/Dashboard/recentItems')
            break
          case 'userfavorites':
            dashboard = () => import('@/components/ADempiere/Dashboard/userfavorites')
            break
          default:
            dashboard = () => import('@/components/ADempiere/Dashboard/UnsupportedDashboard')
            break
        }
      } else if (!isEmptyValue(props.metadata.chartType)) {
        if (!isEmptyValue(props.metadata.transformation_script)) {
          return () => import('@/components/ADempiere/Dashboard/charts/CustomerChart.vue')
        }
        dashboard = getChartComponent(props.metadata)
      }
      return dashboard
      // return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
    })

    const labelDashboard = computed(() => {
      if (isEmptyValue(props.title)) {
        return props.metadata.name
      }
      return props.title
    })

    function sendMain(dashboard) {
      store.dispatch('mainDashboard', dashboard)
      // this.$forceUpdate()
    }

    return {
      UNSUPPORTED_DASHBOARDS,
      activeDashboard,
      // computeds
      renderDashboard,
      labelDashboard,
      // methods
      sendMain
    }
  }
})
</script>

<style lang="scss" scoped>
  .custom-title {
    padding: 10px;
  }
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .custom-collapse-item.is-disabled {
    .custom-title {
      color: #303133;
    }
  }
  .el-card__header {
    border: 1px solid #36a3f7;
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
  }
  .dashboard-transitio {
    margin: 0px;
    width: 100%;
    padding-right: 2%;
    border-radius: 4px;
    text-align: center;
    // color: #fff;
    box-sizing: border-box;
    height: 500px;
    overflow: auto;
  }
  .label-dashboard{
    color: black;
    width: 95%;
    text-align: inherit;
    font-weight: 500;
    font-size: large;
    padding-left: 1%;
  }
</style>
<!-- <style>
  .el-card__body {
    padding: 5px;
  }
</style> -->
