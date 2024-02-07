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
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

// API Request Methods
import { getMetricRequest } from '@/api/ADempiere/dashboard/index.ts'

// Utils and Helper Methods
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

const animationDuration = 2800

export default {
  name: 'GaugeChart',

  mixins: [
    resize
  ],

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
    castValueData(listValue) {
      if (this.isEmptyValue(listValue)) return 0
      return listValue
        .map(setValue => Number(setValue.value))
        .filter(listValues => !isNaN(listValues))
        .reduce((partialSum, currentvalue) => partialSum + currentvalue)
    },
    loadChartMetrics(metrics) {
      const xAxisValues = []
      const seriesToShow = []
      if (!this.isEmptyValue(metrics.series)) {
        // TODO: Consider color scheme `color_schemas`
        seriesToShow.push({
          animationDuration,
          type: 'gauge',
          min: 0,
          max: metrics.measureTarget,
          splitNumber: 5,
          width: '5px',
          radius: '100%',
          progress: {
            show: true,
            width: 5
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          axisTick: {
            show: true
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 15,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 10
            }
          },
          title: {
            show: true,
            offsetCenter: [0, '65%']
          },
          detail: {
            valueAnimation: true,
            fontSize: 26,
            offsetCenter: [0, '85%'],
            formatter: `{value}`
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          data: [{
            value: metrics.measureActual, // this.castValueData(serie.data_set),
            name: metrics.xAxisLabel || metrics.name
          }]
        })
      }
      this.chart.setOption({
        toolbox: {
          show: true,
          feature: {
            dataView: xAxisValues,
            saveAsImage: {
              pixelRatio: 20
            },
            mark: {
              show: false
            },
            restore: {
              show: true
            }
          }
        },
        series: seriesToShow
      })
      this.chart.hideLoading()
    }
  }
}
</script>
