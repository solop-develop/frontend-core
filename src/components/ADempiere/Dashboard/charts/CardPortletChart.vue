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
  <el-row>
    <el-col
      v-for="cardPortlet in metadata.groupPortlet"
      :key="cardPortlet.id"
      :span="24"
    >
      <el-card style="border: 0px;">
        <el-card
          :body-style="{ padding: '10px' }"
          class="card-portlet"
          style="border: 0px;"
        >
          <p slot="header" style="margin: 0px;padding: 0pc;color: #606266;text-align: left;">
            {{ cardPortlet.name }}
            <i class="el-icon-warning-outline" />
          </p>
          <span v-if="!isEmptyValue(cardPortlet.metrics) || isLoading">
            <p style="margin: 0px;font-size: 18px;text-align: right;">
              <count-to
                :start-val="0"
                :end-val="valueAmount(cardPortlet.metrics.measureActual)"
                :duration="2600"
                style="font-size: 50px;font-weight: 500;color: #303133;"
              />
            </p>
            <p style="margin: 0px;text-align: left;">
              <span style="color: #606266;">
                {{ cardPortlet.description }}
              </span>
              <span style="float: right;">
                <count-to
                  :start-val="0"
                  :decimals="2"
                  :end-val="valueAmount(cardPortlet.metrics.performanceGoal) * 100"
                  style="font-size: 18px;"
                  :style="{ color: colorSchemas(cardPortlet.metrics) }"
                />
                <b :style="{ color: colorSchemas(cardPortlet.metrics) }">
                  {{ '%' }}
                  <svg-icon :icon-class="iconClass(valueAmount(cardPortlet.metrics.performanceGoal) * 100)" />
                </b>
              </span>
            </p>
          </span>
          <el-button v-else type="text" @click="reload">
            {{ $t('component.dashboard.reload') }}
            <i class="el-icon-loading" />
          </el-button>
        </el-card>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
// API Request Methods
import { getMetricRequest } from '@/api/ADempiere/dashboard/index.ts'

// Components and Mixins
import CountTo from 'vue-count-to'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'CardPortletChart',

  components: {
    CountTo
  },

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
  setup(props) {
    const portlet = ref([])
    const isLoading = ref(false)

    function loadMetrics(element) {
      getMetricRequest({
        id: element.id
      })
        .then(metrics => {
          element.metrics = metrics
        })
        .catch(error => {
          console.warn(`Error getting Bar Chart: ${error.message}. Code: ${error.code}.`)
        })
    }

    function colorStyle(num) {
      if (num < 50) return 'color: red'
      if (num === 50) return 'color: blue'
      if (num > 50) return 'color: red'
    }

    function iconClass(num) {
      if (num < 50) return 'arrow-down'
      if (num === 50) return ''
      if (num > 50) return 'arrow-up'
      return ''
    }

    function valueAmount(amount) {
      if (isEmptyValue(amount)) return 0
      return Number(amount)
    }

    function reload() {
      setTimeout(() => {
        isLoading.value = true
      }, 1000)
    }

    function colorSchemas(metrics) {
      const {
        performanceGoal,
        colorSchemas
      } = metrics
      const total = valueAmount(performanceGoal) * 100
      let colorPercnt = 'red'
      colorSchemas.forEach(element => {
        const { percent, color } = element
        if (total <= Number(percent)) colorPercnt = color
      })
      return colorPercnt
    }

    if (!isEmptyValue(props.metadata.groupPortlet)) {
      props.metadata.groupPortlet.forEach(element => {
        loadMetrics(element)
      })
    }

    return {
      portlet,
      isLoading,
      reload,
      iconClass,
      colorStyle,
      loadMetrics,
      valueAmount,
      colorSchemas
    }
  }
})
</script>

<style lang="scss">
.card-portlet {
  .el-card__header {
    padding: 10px
  }
}
</style>
