<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
  Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <div v-if="!isEmptyValue(chart) && !isEmptyValue(chart.performanceGoal)">
    <p style="margin: 0px;font-size: 18px;text-align: right;">
      <count-to
        :start-val="0"
        :end-val="valueAmount(chart.measureActual)"
        :duration="2600"
        style="font-size: 50px;font-weight: 500;color: #303133;"
      />
    </p>
    <p style="margin: 0px;text-align: left;">
      <span style="color: #606266;">
        {{ chart.description }}
      </span>
      <span style="float: right;">
        <count-to
          :start-val="0"
          :decimals="2"
          :end-val="valueAmount(chart.performanceGoal) * 100"
          style="font-size: 18px;"
          :style="{ color: colorSchemas(chart) }"
        />
        <b :style="{ color: colorSchemas(chart) }">
          {{ '%' }}
          <svg-icon :icon-class="iconClass(valueAmount(chart.performanceGoal) * 100)" />
        </b>
      </span>
    </p>
  </div>
  <el-button
    v-else
    type="text"
  >
    {{ $t('component.dashboard.reload') }}
    <i class="el-icon-loading" />
  </el-button>
</template>

<script>
import CountTo from 'vue-count-to'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

// API Request Methods
import { getMetricRequest } from '@/api/ADempiere/dashboard/index.ts'

// Utils and Helper Methods
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

// const animationDuration = 2800

export default {
  components: {
    CountTo
  },
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      if (!this.isEmptyValue(this.metadata.actions)) {
        const contextAttributesList = getContextAttributes({
          containerUuid: this.$store.getters.getContainerInfo.currentTab.containerUuid,
          parentUuid: this.$store.getters.getContainerInfo.currentTab.parentUuid,
          contextColumnNames: this.metadata.context_column_names,
          isBooleanToString: true,
          keyName: 'key'
        })
        this.$store.dispatch('metrics', {
          id: this.metadata.id,
          tableName: this.metadata.tableName,
          recordId: this.metadata.recordId,
          recordUuid: this.metadata.recordUuid,
          contextAttributes: contextAttributesList,
          filters: this.metadata.filter
        })
          .then(response => {
            this.loadChartMetrics(response)
          })
          .catch(error => {
            console.warn(`Error getting Metrics: ${error.message}. Code: ${error.code}.`)
          })
        return
      }
      getMetricRequest({
        id: this.metadata.id
      })
        .then(metrics => {
          this.loadChartMetrics(metrics)
        })
        .catch(error => {
          console.warn(`Error getting Metrics: ${error.message}. Code: ${error.code}.`)
        })
    },
    loadChartMetrics(metrics) {
      this.chart = metrics
    },
    valueAmount(amount) {
      if (this.isEmptyValue(amount)) return 0
      return Number(amount)
    },
    colorSchemas(metrics) {
      const {
        performanceGoal,
        colorSchemas
      } = metrics
      const total = this.valueAmount(performanceGoal) * 100
      let colorPercnt = 'red'
      colorSchemas.forEach(element => {
        const { percent, color } = element
        if (total <= Number(percent)) colorPercnt = color
      })
      return colorPercnt
    },
    iconClass(num) {
      if (num < 50) return 'arrow-down'
      if (num === 50) return ''
      if (num > 50) return 'arrow-up'
      return ''
    }
  }
}
</script>
