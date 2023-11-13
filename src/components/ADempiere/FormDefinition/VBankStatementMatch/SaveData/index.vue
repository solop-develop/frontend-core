<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.www.erpya.com
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
  <el-card shadow="never" style="padding: 20px;">
    <el-row :gutter="20">
      <bank-statement-info />
    </el-row>
    <br>

    <el-row :gutter="20">
      <el-card shadow="never">
        <result-table />
      </el-card>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import BankStatementInfo from './bankStatementInfo.vue'
import ResultTable from './ResultTable.vue'

export default defineComponent({
  name: 'SaveData',

  components: {
    BankStatementInfo,
    ResultTable
  },

  setup() {
    return {}
  }
})
</script>
