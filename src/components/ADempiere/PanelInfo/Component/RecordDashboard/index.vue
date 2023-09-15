<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div class="main-express-receipt">
    <el-card shadow="never">
      <el-row
        v-for="(dashboardAttributes, index) in dashboardsList"
        :key="index"
        :gutter="24"
      >
        <el-col
          :key="index"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 24 }"
          :lg="{ span: 24 }"
          :xl="{ span: 24 }"
          style="padding-right:8px;margin-bottom:2px;"
        >
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item :name="index">
              <template slot="title">
                <span style="font-size: 18px">
                  <svg-icon icon-class="chart" />
                  {{ dashboardAttributes.name }}
                </span>
              </template>
              <el-collapse v-if="!isEmptyValue(dashboardAttributes.parameters)" accordion>
                <el-collapse-item name="1">
                  <template slot="title">
                    <span style="font-size: 18px">
                      <svg-icon icon-class="filter" />
                      {{ $t('component.dashboard.parameters') }}
                    </span>
                  </template>
                  <span
                    v-for="(params, key) in dashboardAttributes.parameters"
                    :key="key"
                  >
                    <el-form
                      :inline="true"
                      label-position="top"
                      @submit.native.prevent="notSubmitForm"
                    >
                      <chart-parameter
                        :key="key"
                        :metadata="params"
                        :dashboard-id="dashboardAttributes.id"
                      />
                    </el-form>
                  </span>
                </el-collapse-item>
              </el-collapse>
              <chart-metrics
                :metadata="{
                  ...dashboardAttributes,
                  filter: parameters
                }"
                :title="''"
                :main="false"
              />
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Components and Mixins
import ChartMetrics from './component/chart.vue'
import ChartParameter from './component/Parameters.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'RecordDashboard',

  components: {
    ChartMetrics,
    ChartParameter
  },

  setup() {
    /**
    * Ref
    */
    const data = ref('Data')
    const activeNames = ref(0)

    /**
    * Computed
    */
    const dashboardsList = computed(() => {
      return store.getters.getListDashboard
    })

    const parameters = computed(() => {
      const currentRoute = router.app._route
      const values = store.getters.getValuesView({
        containerUuid: currentRoute.meta.uuid + 'Parameters',
        format: 'array'
      }).map(params => {
        return {
          ...params,
          key: params.columnName
        }
      })
      const paramsList = values.filter(params => {
        return !isEmptyValue(params.key) &&
          !isEmptyValue(params.value) &&
          !isEmptyValue(params.columnName)
      })

      return paramsList
    })

    return {
      // Refs
      data,
      activeNames,
      // Computed
      dashboardsList,
      parameters
    }
  }
})
</script>

<style scoped lang="scss">
.el-form-item--medium .el-form-item__label {
  width: 450px;
}

.front-item-receipt {
  width: 100%;
}
.custom-field-number {
  &.el-input-number, &.el-input {
    .el-input__inner {
      text-align-last: end !important;
    }
  }
}
</style>
<style lang="scss">
.field-from {
  .el-form-item--medium .el-form-item__label {
    line-height: 36px;
    width: 450px;
    font-size: 18px;
  }
}
.select-from {
  .el-select-dropdown__item {
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 18px;
  }
}
.table-form {
  .el-table__header-wrapper {
    font-size: 18px;
    line-height: 22px;
  }
}
</style>
