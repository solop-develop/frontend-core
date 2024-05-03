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
  <el-form-item
    label="Gran total"
    style="text-align: center; align-items: center; margin-left: 20%;"
  >
    <div style="display: flex;">
      <el-input
        v-model="grandTotalFieldFrom"
        clearable
        @input="currentValue"
      />
      <b style="color: #c0c4cc;padding: 0px 5px;font-weight: bold;">
        {{ '-' }}
      </b>
      <el-input
        v-model="grandTotalFieldTo"
        clearable
        @input="currentValue"
      />
    </div>
  </el-form-item>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'GrandTotalField',
  setup() {
    const grandTotalFieldFrom = ref(null)
    const grandTotalFieldTo = ref(null)

    const currentValue = () => {
      store.dispatch('searchInvociesInfos', {
        grand_total_from: grandTotalFieldFrom.value,
        grand_total_to: grandTotalFieldTo.value
      })
    }

    return {
      grandTotalFieldFrom,
      grandTotalFieldTo,
      //
      currentValue
    }
  }
})
</script>
