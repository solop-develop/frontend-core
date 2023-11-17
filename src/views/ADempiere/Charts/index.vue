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
  <el-row v-if="!isEmptyValue(dashboardsList)" :gutter="8">
    <el-card
      shadow="never"
      :body-style="{ padding: '20px !important;'}"
      style="height: 90% !important; overflow: auto !important;"
    >
      <el-col v-if="!isEmptyValue(mainDashboard)" :span="24" style="padding-right:8px;margin-bottom:2px;">
        <dashboard-definition
          :metadata="mainDashboard"
          :title="mainDashboard.name"
        />
      </el-col>
      <el-col
        v-for="(dashboardAttributes, key) in listDashboard"
        :key="key"
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 8 }"
        :xl="{ span: 8 }"
        style="padding-right:8px;margin-bottom:2px;"
      >
        <dashboard-definition
          :metadata="dashboardAttributes"
          :title="dashboardAttributes.name"
          :main="true"
        />
      </el-col>
    </el-card>
  </el-row>
</template>
<script>
// VUE
import { defineComponent, computed, onMounted, watch } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import DashboardDefinition from '@/components/ADempiere/Dashboard/index.vue'
import PanelGroup from '@/views/dashboard/admin/components/PanelGroup.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
export default defineComponent({
  name: 'Charts',

  components: {
    PanelGroup,
    DashboardDefinition
  },

  setup() {
    const dashboardsList = computed(() => {
      return store.getters.getStoredDashboardsList
    })

    const mainDashboard = computed(() => {
      return store.getters.getStoredMainDashboard
    })

    const listDashboard = computed(() => {
      const list = dashboardsList.value
      if (isEmptyValue(list)) {
        return []
      }
      if (!isEmptyValue(mainDashboard.value)) {
        return list.filter(dashboard => {
          if (
            mainDashboard.value.id !== dashboard.id &&
            !isEmptyValue(dashboard.chartType)
          ) {
            return dashboard
          }
        })
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

    watch(roleUuid, (newValue, oldValue) => {
      loadDashboardsList()
    })

    onMounted(() => {
      if (isEmptyValue(dashboardsList.value)) {
        loadDashboardsList()
      }
    })

    return {
      dashboardsList,
      mainDashboard,
      listDashboard,
      currentRole
    }
  }
})
</script>
