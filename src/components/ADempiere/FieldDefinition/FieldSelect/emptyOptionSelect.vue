<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <el-option
    v-model="currentEmptyValue"
    :label="' '"
  />
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'EmptyOptionSelect',

  props: {
    currentValue: {
      type: [Number, String],
      defaullt() {
        return -1
      }
    }
  },

  setup(props) {
    const blankValues = [null, undefined, -1, '-1', '', ' ']

    const currentEmptyValue = computed({
      set(newValue) {
        //
      },
      get() {
        if (blankValues.includes(props.currentValue)) {
          return props.currentValue
        }
        return -1
      }
    })

    return {
      blankValues,
      currentEmptyValue
    }
  }
})
</script>
