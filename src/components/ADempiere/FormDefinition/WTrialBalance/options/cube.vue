<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Ricardo Fenomeno ricardofenomeno13@gmail.com https://github.com/ricargame
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
  <div>
    <el-form-item>
      <template slot="label">
        {{ $t('form.WTrialBalance.cubeReport') }}
        <b style="color: #f34b4b"> * </b>
      </template>
      <el-select
        v-model="cubeReport"
        :placeholder="$t('form.WTrialBalance.cubeReport')"
        style="width: 100%;"
        clearable
        filterable
        @visible-change="showListReportCubes"
      >
        <el-option
          v-for="item in cubeReportOptions"
          :key="item.id"
          :label="item.values.DisplayColumn"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import store from '@/store'
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'
import { listReportCubes } from '@/api/ADempiere/form/TrialBalanceDrillable.js'
export default defineComponent({
  name: 'cubeWtrialBalance',
  setup() {
    const cubeReportOptions = ref([])
    const cubeReport = computed({
      get() {
        return store.getters.getCube
      },
      set(value) {
        store.commit('setCube', value)
      }
    })
    function showListReportCubes(show, search = '') {
      if (!show) return
      listReportCubes({
        searchValue: search
      })
        .then(response => {
          const { records } = response
          cubeReportOptions.value = records
        })
    }
    return {
      cubeReport,
      cubeReportOptions,
      showListReportCubes
    }
  }
})
</script>
