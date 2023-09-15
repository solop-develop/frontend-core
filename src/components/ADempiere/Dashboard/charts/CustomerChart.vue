<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Yamel Senih ysenih@erpya.com
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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

const animationDuration = 2800

export default {
  name: 'CustomerChart',

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
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },

  mounted() {
    this.unsubscribe = this.subscribeChanges()
    this.$nextTick(() => {
      this.initChart()
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
    getContextAttributes,
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.initChart()
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.showLoading()
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
          console.warn(`Error getting Metrics: ${error.message}. Code: ${error.code}.`)
        })
    },
    loadChartMetrics(metrics) {
      if (!isEmptyValue(this.metadata.transformation_script)) {
        const chartOption = new Function('data', this.metadata.transformation_script)
        const script = chartOption(metrics)
        const {
          xAxis,
          toolbox,
          grid,
          tooltip,
          yAxis,
          legend,
          series
        } = script
        if (!isEmptyValue(series)) {
          this.chart.setOption({
            xAxis,
            toolbox,
            grid,
            tooltip,
            yAxis,
            legend,
            series
          })
          this.chart.hideLoading()
          return
        }
      }
      const xAxisValues = []
      let seriesToShow = []
      let legendToShow = []
      if (!isEmptyValue(metrics.series)) {
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
            stack: 'vistors',
            data: serie.data_set.map(set => set.value),
            animationDuration,
            smooth: true,
            large: true,
            type: 'line',
            animationEasing: 'quadraticOut',
            lineStyle: {
              width: 2
            },
            areaStyle: {}
          }
        })
        legendToShow = metrics.series.map(serie => serie.name)
      }

      this.chart.setOption({
        xAxis: {
          data: xAxisValues,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        toolbox: {
          // y: 'bottom',
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          backgroundColor: '#FFF',
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: legendToShow
        },
        series: seriesToShow
      })
      this.chart.hideLoading()
    }
  }
}
</script>
