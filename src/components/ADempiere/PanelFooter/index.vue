<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-row
    style="
      position: absolute;
      bottom: 5%;
      right: 2%;
    "
  >
    <el-col :span="24">
      <samp class="report-setup-footer">
        <el-button
          v-if="isButtonClear"
          plain
          type="info"
          class="button-base-icon"
          style="font-size: 25px;"
          :disabled="isDisableRun"
          @click="actionClear"
        >
          <svg-icon icon-class="layers-clear" />
        </el-button>
        <el-button
          v-if="isButtonClose"
          type="danger"
          class="button-base-icon"
          icon="el-icon-close"
          :disabled="isDisableClear"
          @click="actionClose"
        />
        <el-button
          v-if="isButtonRun"
          type="primary"
          class="button-base-icon"
          icon="el-icon-check"
          :disabled="isDisablClose"
          @click="actionRun"
        />
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Utils and Helper Methods
import { closeTagView } from '@/utils/ADempiere/componentUtils.js'

export default defineComponent({
  name: 'PanelFooter',

  props: {
    containerUuid: {
      type: [String, Number],
      required: true
    },
    isButtonRun: {
      type: Boolean,
      default: false
    },
    isButtonClear: {
      type: Boolean,
      default: false
    },
    isButtonClose: {
      type: Boolean,
      default: false
    },
    actionRun: {
      type: Function,
      default: (Run) => {
        console.info('implement Run Method - 555', Run)
      }
    },
    actionClear: {
      type: Function,
      default: () => {
        return console.info('implement Clear Parameters Method')
      }
    },
    actionClose: {
      type: Function,
      default: () => {
        closeTagView()
      }
    },
    isDisableRun: {
      type: Boolean,
      default: false
    },
    isDisableClear: {
      type: Boolean,
      default: false
    },
    isDisablClose: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss">
.report-setup-preferences-fields {
  /**
    * Reduce the spacing between the form element and its label
    */
    .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
