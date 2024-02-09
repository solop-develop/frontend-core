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
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="24" style="padding-right:10px;margin-bottom:20px;">
        <el-card
          shadow="hover"
          :body-style="{ padding: '0px' }"
          style="padding: 0px !important;"
        >
          <user-info />
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="!isEmptyValue(dashboardsList)">
      <el-col :span="24">
        <panel-group />
      </el-col>
      <el-col :span="24">
        <panel-group-pie />
      </el-col>
      <el-col :span="24">
        <panel-group-portlet />
      </el-col>
      <!-- <el-col :span="24">
        {{ panelRight }}
      </el-col> -->
      <!-- <div></div> -->
      <el-col :span="16">
        <template v-for="(dashboardAttributes, index) in panelRight">
          <el-col
            v-if="(isEmptyValue(mainDashboard.chartType) || mainDashboard.name !== dashboardAttributes.name)"
            :key="index"
            :span="24"
            style="padding-right:8px;margin-bottom:2px;"
          >
            <dashboard-definition
              :metadata="dashboardAttributes"
              :title="dashboardAttributes.name"
              :main="true"
            />
          </el-col>
        </template>
      </el-col>
      <el-col :span="8">
        <template v-for="(dashboardAttributes, key) in panelLeft">
          <el-col
            :key="key"
            :span="24"
            style="padding-right:8px;margin-bottom:2px;"
          >
            <dashboard-definition
              :metadata="dashboardAttributes"
              :title="dashboardAttributes.name"
              :main="true"
            />
          </el-col>
        </template>
      </el-col>
      <!-- <el-col
        :span="colNum"
        style="padding-right:8px;margin-bottom:2px;"
      >
        <todo
          :metadata="mainDashboard"
          :title="mainDashboard.name"
          style="margin: 0px;width: 100% !important;"
        />
      </el-col> -->
    </el-row>
    <page-style-settings />
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  computed,
  watch,
  ref
} from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'
// Components and Mixins
import DashboardDefinition from '@/components/ADempiere/Dashboard/index.vue'
import PanelGroup from '@/views/dashboard/admin/components/PanelGroup.vue'
import PanelGroupPie from '@/components/ADempiere/Dashboard/panelGroupPie'
import PanelGroupPortlet from '@/components/ADempiere/Dashboard/panelGroupPortlet'
import PageStyleSettings from '@/components/ADempiere/PageStyleSettings'
import Todo from '@/views/dashboard/admin/components/TodoList/index.vue'
import UserInfo from '@/views/profile/components/InfoUser.vue'
import notices from '@/components/ADempiere/Dashboard/notices'
import ThemePicker from '@/components/ThemePicker'
import RightPanel from '@/components/RightPanel'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'DashboardAdmin',

  components: {
    Todo,
    notices,
    UserInfo,
    RightPanel,
    PanelGroup,
    ThemePicker,
    PanelGroupPie,
    PageStyleSettings,
    PanelGroupPortlet,
    DashboardDefinition
  },

  setup() {
    const showSettings = ref(false)

    const colNum = computed({
      // getter
      get() {
        return store.state.settings.colNum
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'colNum',
          value: newValue
        })
      }
    })

    const numColDashboard = ref([
      {
        value: 24,
        label: 1
      },
      {
        value: 12,
        label: 2
      },
      {
        value: 8,
        label: 3
      },
      {
        value: 6,
        label: 4
      }
    ])

    const tagsView = computed({
      // getter
      get() {
        return store.state.settings.tagsView
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: newValue
        })
      }
    })

    const panelMain = computed({
      // getter
      get() {
        return store.getters.getStoredMainDashboard.id
      },
      // setter
      set(dashboard) {
        // Note: we are using destructuring assignment syntax here.
        if (dashboard) {
          const currentDashboard = listDashboard.value.find(list => list.id === dashboard)
          store.dispatch('mainDashboard', currentDashboard)
        }
      }
    })

    const sidebarLogo = computed({
      // getter
      get() {
        return store.getters['settings/getSidebarLogo']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: newValue
        })
      }
    })

    const dashboardsList = computed(() => {
      return store.getters.getStoredDashboardsList.filter(list => list.fileName !== 'docstatus')
    })

    const mainDashboard = computed(() => {
      return store.getters.getStoredMainDashboard
    })

    const panelNotice = computed(() => {
      return {
        dashboardType: 'dashboard',
        fileName: 'notices',
        isCollapsible: true,
        name: language.t('profile.notice')
      }
    })

    const panelTodo = computed(() => {
      return {
        dashboardType: 'dashboard',
        fileName: 'todo',
        isCollapsible: true,
        name: language.t('components.todoList')
      }
    })

    const panelRight = computed(() => {
      const panelRight = store.getters['settings/getPanelRight']
      const listDashboard = store.getters.getStoredDashboardsList
      if (isEmptyValue(listDashboard.find(list => list.fileName === 'notices'))) {
        listDashboard.unshift(panelNotice.value)
      }
      const list = listDashboard
        .filter(list => {
          if (
            (list.sequence === 0 &&
            !isEmptyValue(list.chartType)) &&
            panelRight.includes(list.chartType)
          ) {
            return list
          } else if (panelRight.includes(list.fileName)) {
            return list
          }
        })
      return list
    })

    const panelLeft = computed(() => {
      const panelLeft = store.getters['settings/getPanelLeft']
      const listDashboard = store.getters.getStoredDashboardsList
      if (isEmptyValue(listDashboard.find(list => list.fileName === 'notices'))) {
        listDashboard.unshift(panelNotice.value)
      }
      if (isEmptyValue(listDashboard.find(list => list.fileName === 'todo'))) {
        listDashboard.unshift(panelTodo.value)
      }
      const list = listDashboard
        .filter(list => {
          if (
            list.sequence === 0 &&
            !isEmptyValue(list.chartType) &&
            panelLeft.includes(list.chartType)
          ) {
            return list
          } else if (panelLeft.includes(list.fileName)) {
            return list
          }
        })
      return list
    })

    const listDashboard = computed(() => {
      const list = dashboardsList.value
      if (isEmptyValue(list)) {
        return []
      }
      if (!isEmptyValue(mainDashboard.value)) {
        const listDashboardPanel = list.filter(dashboard => {
          if (
            mainDashboard.value.id !== dashboard.id &&
            isEmptyValue(dashboard.chartType)
          ) {
            return dashboard
          }
        })
        if (isEmptyValue(listDashboardPanel.find(list => list.name === 'todo'))) {
          listDashboardPanel.push(panelTodo.value)
        }
        if (isEmptyValue(listDashboardPanel.find(list => list.fileName === 'notices'))) {
          listDashboardPanel.push(panelNotice.value)
        }
        return listDashboardPanel
      }
      return list
    })

    const currentRole = computed(() => {
      return store.getters['user/getRole']
    })

    const roleUuid = computed(() => {
      return store.getters.getRoleUuid
    })

    function loadDashboardsList() {
      store.dispatch('getDashboardListFromServer')
    }

    function themeChange(val) {
      store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }

    watch(roleUuid, (newValue, oldValue) => {
      loadDashboardsList()
    })

    onMounted(() => {
      if (isEmptyValue(dashboardsList.value)) {
        loadDashboardsList()
      }
    })

    return {
      numColDashboard,
      dashboardsList,
      mainDashboard,
      listDashboard,
      showSettings,
      panelNotice,
      currentRole,
      sidebarLogo,
      panelRight,
      panelTodo,
      panelLeft,
      panelMain,
      tagsView,
      colNum,
      themeChange
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 5px 0px 5px 10px;
  background-color: rgb(240, 242, 245);
  position: relative;
  overflow: auto;
  display: block;
  height: 90%;

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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
