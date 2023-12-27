<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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
  <span>
    <el-row :gutter="10">
      <el-col :span="8" style="width: 100% !important;">
        <div
          @click="isShowCommand = !isShowCommand"
        >
          <el-card
            shadow="never"
            class="custom-card-options"
            :body-style="{ padding: '10px' }"
          >
            <p
              class="card-options-buttons"
            >
              <svg-icon icon-class="keyboard" />
              <br>
              {{ $t('form.mnemonicCommand.title') }}
            </p>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      class="modal-dialog"
      :visible="isShowCommand"
      width="80%"
      center
      :title="$t('form.mnemonicCommand.title')"
      @close="closeDialog"
    >
      <command-panel />
    </el-dialog>
  </span>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
// Components and Mixins
import commandPanel from './commandPanel'
export default defineComponent({
  name: 'mnemonicCommand',
  components: {
    commandPanel
  },
  setup() {
    const isShowCommand = ref(false)

    function closeDialog() {
      isShowCommand.value = false
    }

    return {
      isShowCommand,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.card-options-buttons {
  cursor: pointer;
  text-align: center !important;
  color: black;
  min-height: 50px;
}
.custom-card-options {
  margin: 1px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
