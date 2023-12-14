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
  <el-card shadow="always" :style="{height:height,width:width}">
    <el-card
      shadow="always"
      :body-style="{ padding: '10px' }"
      class="card-portlet"
      style="border: 1px;"
    >
      <p slot="header" style="margin: 0px;padding: 0pc;color: #606266;text-align: left;">
        {{ metadata.name }}
        <i class="el-icon-warning-outline" />
      </p>
      <p style="margin: 0px;font-size: 18px;text-align: right;">
        <count-to
          :start-val="0"
          :end-val="Number(portlet.measureTarget)"
          :duration="2600"
          style="font-size: 50px;font-weight: 500;color: #303133;"
        />
      </p>
      <p style="margin: 0px;text-align: left;">
        <span style="color: #606266;">
          {{ metadata.description }}
        </span>
        <span style="float: right;">
          <count-to
            :start-val="0"
            group-separator="."
            :end-val="Number(portlet.performanceGoal) * 100"
            style="font-size: 18px;"
            :style="colorStyle(Number(portlet.performanceGoal) * 100)"
          />
          <b :style="colorStyle(Number(portlet.performanceGoal) * 100)">
            {{ '%' }}
            <svg-icon :icon-class="iconClass(Number(portlet.performanceGoal) * 100)" />
          </b>
        </span>
      </p>
    </el-card>
  </el-card>
</template>

<script>
// // API Request Methods
import { getMetricRequest } from '@/api/ADempiere/dashboard/index.ts'
// Components and Mixins
import CountTo from 'vue-count-to'
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
    const portlet = ref('')

    function loadMetrics() {
      getMetricRequest({
        id: props.metadata.id
      })
        .then(metrics => {
          portlet.value = metrics
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

    loadMetrics()

    return {
      portlet,
      iconClass,
      colorStyle,
      loadMetrics
      // formatQuantity
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
