<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div style="height: 100% !important;">
    <el-card id="panel-top-search-criteria" class="panel-top-search-criteria" style="height: 50% !important;">
      <div style="width: 50% !important;float: left;padding-left: 5px;padding-right: 2px;height: 100% !important;">
        <imported-payments />
      </div>

      <div style="width: 50% !important;float: right;padding-left: 2px;padding-right: 5px;height: 100% !important;">
        <current-payments />
      </div>
    </el-card>
    <el-card style="height: 50% !important;">
      <automatic-match style="padding-left: 5px;padding-right: 5px;" />
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import CurrentPayments from './currentPayments.vue'
import ImportedPayments from './importedPayments.vue'
import AutomaticMatch from '../AutomaticMatch.vue'

export default defineComponent({
  name: 'ManualMatch',

  components: {
    AutomaticMatch,
    CurrentPayments,
    ImportedPayments
  }
})
</script>

<style lang="scss">
.form-item-criteria {
  margin-top: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
  margin-right: 0px;
  padding-bottom: 0px;
  .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin: 0px;
  }
}
.el-table {
  height: 100% !important;
  .el-table--border {
    border-right: none;
    border-bottom: none;
    height: 100% !important;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    height: 100% !important;
  }
  .el-table__body-wrapper {
    height: 85% !important;
  }
}
</style>
