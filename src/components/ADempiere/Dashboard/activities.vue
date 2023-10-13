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
  <div class="activities-dashboard-container">
    <el-table
      :data="activitiesList"
      :highlight-current-row="true"
      :show-header="false"
      @cell-click="handleCurrentChange"
    >
      <el-table-column prop="name" />
      <el-table-column prop="quantity" width="100" />
    </el-table>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Utils and Helper Methods
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'ActivitiesDashboard',

  setup() {
    const activitiesList = computed({
      get() {
        return store.getters.getListNotifiications
      },
      set(value) {
        return value
      }
    })

    function handleCurrentChange(activity) {
      if (activity.name === 'Solicitud' || activity.name === 'Request') {
        router.push({
          name: 'Issues'
        }, () => {})
        return
      }

      const containerIdentifier = activity.action.toLowerCase() + '_' + activity.action_id
      zoomIn({
        attributeValue: containerIdentifier,
        attributeName: 'containerKey'
      })
    }

    function listActivities() {
      store.dispatch('findNotifications')
    }

    listActivities()

    return {
      activitiesList,
      handleCurrentChange
    }
  }
})
</script>
