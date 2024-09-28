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
  <el-card class="box-card">
    <el-collapse v-model="activeCollapse">
      <el-collapse-item name="1">
        <template slot="title">
          <b style="font-size: 18px">
            {{ $t('report.preference') }}
            <i style="font-size: 18px;" class="el-icon-s-operation" />
          </b>
        </template>
        <el-row :gutter="20">
          <el-form>
            <el-col :span="8">
              <organization-wtrial-balance />
            </el-col>
            <el-col :span="8">
              <balance-wtrial-balance />
            </el-col>
            <el-col :span="8">
              <period-wtrial-balance />
            </el-col>
            <el-col :span="8">
              <accounting-wtrial-balance />
            </el-col>
            <el-col :span="8">
              <cube-wtrial-balance />
            </el-col>
            <el-col :span="8">
              <show-buttom-wtrial-balance
                :header-list="headerList"
                :metadata="metadata"
              />
            </el-col>
          </el-form>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import organizationWtrialBalance from './organization'
import balanceWtrialBalance from './balance'
import periodWtrialBalance from './period'
import accountingWtrialBalance from './accounting'
import cubeWtrialBalance from './cube'
import showButtomWtrialBalance from './showButtom'
export default defineComponent({
  name: 'optionsWtrialBalance',
  components: {
    organizationWtrialBalance,
    balanceWtrialBalance,
    periodWtrialBalance,
    accountingWtrialBalance,
    cubeWtrialBalance,
    showButtomWtrialBalance
  },
  props: {
    headerList: {
      type: Array,
      required: false
    },
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const activeCollapse = ref()

    return {
      activeCollapse
    }
  }
})

</script>
