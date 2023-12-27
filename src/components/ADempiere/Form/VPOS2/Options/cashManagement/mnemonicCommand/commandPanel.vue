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
  <el-card
    shadow="never"
    :body-style="{ padding: '10px' }"
    :custom-class="'epale'"
    class="qlq"
  >
    <el-scrollbar wrap-class="scroll-child">
      <el-collapse v-model="collapseOption">
        <!-- salesOrder -->
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="1">
          <el-row
            :gutter="10"
          >
            <el-col
              v-for="(option, key) in salesOrder"
              :key="key"
              :span="6"
            >
              <command-card-option
                :label="option.nameOption"
                :is-icon="option.isIcon"
                :class-icon="option.class"
                :class-svg="option.class"
                :command="option.command"
                :select-options="options"
              />
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- cashManagement -->
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="2">
          <el-row
            :gutter="10"
          >
            <el-col
              v-for="(option, key) in cashManagement"
              :key="key"
              :span="6"
            >
              <command-card-option
                :label="option.nameOption"
                :is-icon="option.isIcon"
                :class-icon="option.class"
                :class-svg="option.class"
                :command="option.command"
                :select-options="options"
              />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item :title="$t('form.mnemonicCommand.help')">
          <el-card shadow="never">
            <el-divider>
              <b style="font-size: 15px;">
                {{ $t('form.mnemonicCommand.lockedKeyCombination') }}
              </b>
            </el-divider>
            <el-row :gutter="20">
              <el-col :span="12" :offset="8">
                <p style="text-align: center;display: flex;">
                  <el-card shadow="hover" style="height: 60px;width: 150px  ;padding-top: 10px !important;margin-right: 20px !important;">
                    <b style="font-size: 22px;text-align: center;">
                      {{ 'Ctrl + F4' }}
                    </b>
                  </el-card>
                  <el-card shadow="hover" style="height: 60px;width: 150px;padding-top: 10px !important;margin-left: 20px !important;">
                    <b style="font-size: 22px;text-align: center;">
                      {{ 'Ctrl + F5' }}
                    </b>
                  </el-card>
                </p>
              </el-col>
            </el-row>
            <el-divider>
              <b style="font-size: 15px;">
                {{ $t('form.mnemonicCommand.acceptedKeyCombination') }}
              </b>
            </el-divider>
            <el-table
              :data="keyList"
              border
              style="width: 100%"
            >
              <el-table-column :label="$t('form.mnemonicCommand.listAllowedKeys')" align="center">
                <el-table-column
                  prop="key"
                  :label="$t('form.mnemonicCommand.keys')"
                  align="center"
                />
                <el-table-column
                  prop="shortkeyName"
                  :label="$t('form.mnemonicCommand.shortcutKeyName')"
                  align="center"
                />
              </el-table-column>
            </el-table>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
    <el-dialog
      :title="$t('form.mnemonicCommand.title')"
      :visible.sync="isAddComand"
      close-on-press-escape
      append-to-body
      width="45%"
      center
      class="dialogo-seller"
    >
      <el-form v-if="isEmptyValue(inputCommand)" label-position="top" label-width="100px">
        <el-form-item :label="$t('form.mnemonicCommand.addKeyboardShortcuts')">
          <el-input
            ref="fieldCommand"
            v-model="inputCommand"
            v-shortkey="keyListCommant"
            readonly
            style="font-size: 20px;"
            @shortkey.native="theActionCommand"
          />
        </el-form-item>
      </el-form>
      <el-card
        v-else
        shadow="hover"
        class="card-command"
        style="height: auto;width: auto;padding: 0px !important;"
      >
        <el-row :gutter="5">
          <el-col :span="8" :offset="8">
            <el-card
              shadow="never"
              :body-style="{ padding: '5px 10px', textAlign: 'center' }"
            >
              <b style="font-size: 22px;">
                {{ displayCommand.toUpperCase() }}
              </b>
            </el-card>
          </el-col>
          <el-col
            :span="4"
          >
            <el-button
              type="info"
              plain
              class="button-base-icon"
              @click="removeCommand"
            >
              <svg-icon icon-class="delete" />
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <br>
      <!-- Foot actions button panel -->
      <el-button
        type="primary"
        icon="el-icon-check"
        class="button-base-icon"
        style="float: right; margin: 10px;"
        @click="saveCommand(inputCommand)"
      />
      <el-button
        type="danger"
        icon="el-icon-close"
        style="float: right;margin-top: 10px;"
        class="button-base-icon"
        @click="close()"
      />
      <el-button
        type="info"
        plain
        style="float: right; margin-top: 10px;"
        class="button-base-icon"
        @click="clear()"
      >
        <svg-icon icon-class="layers-clear" />
      </el-button>
    </el-dialog>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
// Api
import {
  saveCommandShortcut,
  deleteCommandShortcut
} from '@/api/ADempiere/form/VPOS/CommandShortcut'
// Const
import keyList from './keyList'
import salesOrder from './salesOrder'
import cashManagement from './cashManagement'
import keyListCommant from './keyListCommant'
// Components and Mixins
import CommandCardOption from './CommandCardOption'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'commandPanel',
  components: {
    CommandCardOption
  },
  setup() {
    /**
     * Ref
     */
    const isAddComand = ref(false)
    const inputCommand = ref('')
    const displayCommand = ref('')
    const fieldCommand = ref(null)
    const optionsSelect = ref('')
    /**
     * Const
     */
    const collapseOption = ['1', '2', '3']
    /**
     * Computed
     */
    const listCommand = computed(() => {
      return store.getters.getListCommand
    })
    /**
     * Methods
     */
    function options(params) {
      isAddComand.value = true
      commandFocusGained()
      optionsSelect.value = params
      findCommand(params)
    }

    function findCommand(command) {
      const isExist = listCommand.value.find(list => list.command === command)
      if (isEmptyValue(isExist)) {
        inputCommand.value = ''
        displayCommand.value = ''
        return
      }
      inputCommand.value = isExist.shortcut
      displayCommand.value = isExist.shortcut
    }

    function theActionCommand(event) {
      const { srcKey } = event
      if (isEmptyValue(event)) return
      displayCommand.value = 'ctrl + ' + srcKey
      inputCommand.value = 'ctrl + ' + srcKey
    }

    function commandFocusGained(event) {
      setTimeout(() => {
        fieldCommand.value.focus
        fieldCommand.value.focus()
        fieldCommand.value.select
        fieldCommand.value.select()
      }, 500)
    }

    function close() {
      isAddComand.value = false
      clear()
    }

    function clear() {
      inputCommand.value = ''
      displayCommand.value = ''
    }

    function saveCommand(shortcut) {
      saveCommandShortcut({
        posId: store.getters.getVPOS.id,
        command: optionsSelect.value,
        shortcut
      })
        .then(() => {
          showMessage({
            message: 'OK',
            type: 'success'
          })
          store.dispatch('listCommandShortcutsVPOS', {})
          close()
        })
        .catch(error => {
          console.warn({ error })
        })
    }

    function removeCommand() {
      const currentOptions = listCommand.value.find(list => list.shortcut === displayCommand.value && optionsSelect.value === list.command)
      if (isEmptyValue(currentOptions)) {
        inputCommand.value = ''
        displayCommand.value = ''
        return
      }
      deleteCommandShortcut({
        posId: store.getters.getVPOS.id,
        id: currentOptions.id
      })
        .then(() => {
          showMessage({
            message: 'OK',
            type: 'success'
          })
          inputCommand.value = ''
          displayCommand.value = ''
        })
    }

    return {
      // Ref
      isAddComand,
      inputCommand,
      fieldCommand,
      optionsSelect,
      displayCommand,
      // Computed
      listCommand,
      // Methods
      close,
      clear,
      options,
      saveCommand,
      findCommand,
      removeCommand,
      theActionCommand,
      commandFocusGained,
      // Import
      keyList,
      salesOrder,
      cashManagement,
      keyListCommant,
      // Const
      collapseOption
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
.epale {
  background: #36a3f7;
}
</style>
