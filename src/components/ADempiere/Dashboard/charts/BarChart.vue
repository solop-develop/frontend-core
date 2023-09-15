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
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

// API Request Methods
import { getMetrics } from '@/api/ADempiere/dashboard/chart'

// Utils and Helper Methods
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

const animationDuration = 6000

export default {
  name: 'BarChart',

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
      default: '300px'
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
    this.unsubscribe = this.subscribeChanges()
    this.$nextTick(() => {
      this.getMetricsFromServer()
    })
  },

  beforeDestroy() {
    this.unsubscribe()
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getMetricsFromServer()
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.showLoading()
    },
    getMetricsFromServer() {
      this.initChart()
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
      getMetrics({
        id: this.metadata.id
      })
        .then(metrics => {
          this.loadChartMetrics(metrics)
        })
        .catch(error => {
          console.warn(`Error getting Bar Chart: ${error.message}. Code: ${error.code}.`)
        })
    },
    loadChartMetrics(metrics) {
      if (!this.chart) {
        this.initChart()
      }
      const xAxisValues = []
      let seriesToShow = []
      if (!this.isEmptyValue(metrics.series)) {
        if (metrics.series.length > 0) {
          metrics.series.forEach(serie => {
            serie.data_set.forEach(set => {
              if (!xAxisValues.find(value => value === set.name)) {
                xAxisValues.push(set.name)
              }
            })
          })
        }
        seriesToShow = metrics.series.map(serie => {
          return {
            name: serie.name,
            type: 'bar',
            // stack: 'vistors',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            // barWidth: '60%',
            data: serie.data_set.map(set => set.value),
            animationDuration
          }
        })
      }
      this.chart.setOption({
        tooltip: {
          backgroundColor: '#FFF',
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          // y: 'bottom',
          feature: {
            show: true,
            magicType: { show: true, type: ['stack'] },
            dataView: { show: true, readOnly: true },
            restore: { show: true },
            saveAsImage: { show: true }
            // magicType: {
            //   type: ['stack', 'tiled']
            // },
          }
        },
        grid: {
          top: 10,
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: xAxisValues,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: seriesToShow
      })
      this.chart.hideLoading()
    }
  }
}
</script>
