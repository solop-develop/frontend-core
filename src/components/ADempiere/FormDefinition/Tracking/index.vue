<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/Elsiosanchez
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
  <div v-if="isEmptyValue(currentTracking)" style="padding: 10px;">
    <el-card
      shadow="header"
      :body-style="{ padding: '5px', margin: '0px' }"
      class="tracking"
    >
      <h2 slot="header" style="margin: 0px;">
        {{ 'Pedidos' }}
      </h2>
      <el-row :gutter="20" style="margin: 0px;">
        <el-card
          v-for="tracking in listTracking"
          :key="tracking.id"
          shadow="header"
          :body-style="{ padding: '5px' }"
          class="tracking-card-list"
        >
          <el-col :span="1">
            <p style="margin: 0px;">
              <b>
                <svg-icon
                  v-if="tracking.request_type.name.toLowerCase().startsWith('a')"
                  icon-class="airplane"
                  style="font-size: 35px;"
                />
                <svg-icon
                  v-else
                  icon-class="anchor"
                  style="font-size: 35px;"
                />
              </b>
            </p>
          </el-col>
          <el-col :span="23">
            <p style="margin: 0px 0px;">
              <b style="font-size: 20px;">
                {{ tracking.subject }}
              </b>
              <el-button
                plain
                type="info"
                size="medium"
                style="float: right;margin-right: 10px;"
                @click="selectTracking(tracking)"
              >
                <b>
                  <svg-icon icon-class="info" />
                  {{ 'Informacion' }}
                </b>
              </el-button>
            </p>
            <p style="font-size: 10px;color: #82848a;margin: 0px;">
              {{ tracking.dateNextAction }}
            </p>
          </el-col>
        </el-card>
      </el-row>
    </el-card>
  </div>
  <info-panel
    v-else
    :tracking="currentTracking"
  />
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import store from '@/store'

// // Components and Mixins
import InfoPanel from './component/InfoPanel.vue'

// // Utils and Helper Methods

export default defineComponent({
  name: 'Tracking',
  components: {
    InfoPanel
  },
  setup() {
    // Computeds
    const listTracking = computed(() => {
      return store.getters.getListTracking
    })
    const currentTracking = computed(() => {
      return store.getters.getCurrentTracking
    })

    // Methods
    function loadTracking() {
      store.dispatch('requestListTracking', {})
      store.dispatch('requestListStatuses', {
        id: 1000002
      })
    }

    function selectTracking(tracking) {
      store.commit('setCurrentTracking', tracking)
      store.dispatch('requestListIssueComments')
    }

    loadTracking()

    return {
      // Computed
      listTracking,
      currentTracking,
      // Methods
      loadTracking,
      selectTracking
    }
  }
})
</script>

<style lang="scss">
.tracking {
  .el-card{
    .el-card__header {
      padding: 10px 15px !important;
    }
  }
}
.tracking-card-list {
  cursor: pointer;
  padding: 10px 0px;
}
.tracking-card-list:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
