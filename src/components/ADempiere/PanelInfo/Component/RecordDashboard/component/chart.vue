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
  <el-card
    style="height: auto;width: 100%;"
  >
    <component
      :is="renderDashboard"
      :ref="metadata.name"
      :metadata="{
        ...metadata,
        filter: parameters
      }"
      :height="'450px'"
      :width="'53vw'"
    />
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Utils and Helper Methods
import { getChartComponent } from '@/utils/ADempiere/dictionary/dashboard'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ChartMetrics',

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
    const parameters = computed(() => {
      // const { parameters } = list.value
      const currentRoute = router.app._route
      const values = store.getters.getValuesView({
        containerUuid: currentRoute.meta.uuid + 'Parameters' + props.metadata.id,
        format: 'array'
      }).map((currentValue, index, array) => {
        const params = array.find(a => a.columnName === (currentValue.columnName + '_To'))
        if (!isEmptyValue(params)) {
          return {
            ...currentValue,
            key: currentValue.columnName,
            value: [currentValue.value, params.value]
          }
        }
        return {
          ...currentValue,
          key: currentValue.columnName
        }
      })
      const paramsList = values.filter(params => {
        if (isEmptyValue(params.value)) {
          return false
        }
        if (Array.isArray(params.value)) {
          if (isEmptyValue(params.value.at(0)) && isEmptyValue(params.value.at(1))) {
            return false
          }
        }
        return !isEmptyValue(params.key) &&
          !isEmptyValue(params.columnName) &&
          !params.columnName.includes('_To')
      })

      return paramsList
    })

    // load the component that is indicated in the attributes of received property
    const renderDashboard = computed(() => {
      let dashboard = () => import('@/components/ADempiere/Dashboard/UnsupportedDashboard')
      if (!isEmptyValue(props.metadata.chartType)) {
        if (!isEmptyValue(props.metadata.transformation_script)) return () => import('@/components/ADempiere/Dashboard/charts/CustomerChart.vue')
        dashboard = getChartComponent(props.metadata)
      }
      return dashboard
      // return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
    })

    function sendMain(dashboard) {
      store.dispatch('mainDashboard', dashboard)
      // this.$forceUpdate()
    }

    return {
      // computeds
      renderDashboard,
      parameters,
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
<style>
  .el-card__body {
    padding: 5px;
  }
</style>
