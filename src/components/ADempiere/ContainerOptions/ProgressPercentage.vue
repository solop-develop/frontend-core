<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-progress
    :color="colorsByPercentage"
    :text-inside="true"
    :stroke-width="20"
    status="success"
    :format="percentageFormat"
    :percentage="percentageValue"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ProgressPercentage',

  props: {
    value: {
      type: String,
      default: ''
    },
    displayedValue: {
      type: [String, Number],
      default: ''
    }
  },

  setup(props) {
    const colorsByPercentage = [
      { color: '#62b5ff' } // blue base
      // { color: '#FA0000', percentage: 10.1 }, // red
      // { color: '#ff3700', percentage: 30.1 }, // red obscure
      // { color: '#ffa200', percentage: 40.1 }, // orange
      // { color: '#f6ff00', percentage: 60.1 }, // yellow
      // { color: '#bfff00', percentage: 80.1 }, // chartreuse green
      // { color: '#22ff00', percentage: 90.1 }, // lime green
      // { color: '#00ff6e', percentage: 99.1 }, // foam green
      // { color: '#2be20a', percentage: 100 } // green
    ]

    /**
     * Get percentage value
     * TODO: Change 'R_Request TaskStatus' List with number values
     * @returns {number}
     */
    const percentageValue = computed(() => {
      if (!isEmptyValue(props.displayedValue)) {
        const matches = props.displayedValue.match(/\b\d+(?:%|percent\b)/gim)
        if (!isEmptyValue(matches)) {
          const extractValue = matches.at(0).replace(/%|percent'/gm, '')
          if (!isNaN(extractValue) && !Number.isNaN(extractValue)) {
            return Number(extractValue)
          }
        }
      }
      if (!isEmptyValue(props.value)) {
        if (!isNaN(props.value) && !Number.isNaN(props.value)) {
          if (Number(props.value) > 10) {
            return Number(props.value)
          }
          return Number(props.value) * 10
        }
      }
      return 0 // props.value
    })

    function percentageFormat(percentage) {
      if (isEmptyValue(props.value)) {
        return '?'
      }
      return props.displayedValue
    }

    return {
      colorsByPercentage,
      // computeds
      percentageValue,
      // methods
      percentageFormat
    }
  }
})
</script>

<style scoped lang="scss">
.percentage-color-palette {
  color: '#62b5ff'; // blue base

  color: #FA0000; // 10% red
  color: #ff3700; // 30% red obscure
  color: #ffa200; // 40% orange
  color: #f6ff00; // 60% yellow
  color: #bfff00; // 80% lime green
  color: #2be20a; // 90% chartreuse green
  color: #00ff6e; // 99% foam green
  color: #00ff6e; // 100% green
}
</style>
