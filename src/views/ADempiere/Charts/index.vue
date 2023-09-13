<template>
  <el-row v-if="!isEmptyValue(dashboardsList)" :gutter="8">
    <el-card
      shadow="never"
      :body-style="{ padding: '20px !important;'}"
      style="height: 99% !important; overflow: auto !important;"
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
      store.dispatch('getDashboardListFromServer', {
        roleId: currentRole.value.id,
        roleUuid: currentRole.value.uuid
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
      dashboardsList,
      mainDashboard,
      listDashboard,
      currentRole
    }
  }
})
</script>
