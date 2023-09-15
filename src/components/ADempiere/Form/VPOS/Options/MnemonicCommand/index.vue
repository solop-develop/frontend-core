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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <span>
    <el-card shadow="hover">
      <el-collapse v-model="collapseOption">
        <!-- salesOrder -->
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="1">
          <el-row :gutter="12" style="padding-right: 10px;">
            <el-col
              v-for="(option, key) in listOption.salesOrder"
              v-show="option.visible"
              :key="key"
              :span="6"
              style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;"
            >
              <el-card shadow="hover" style="height: 100px">
                <p
                  style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                  @click="findCommand(option.command)"
                >
                  <i v-if="option.isIcon" :class="option.class" />
                  <svg-icon v-else :icon-class="option.class" />
                  <br>
                  {{ option.nameOption }}
                </p>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- cashManagement -->
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="2">
          <el-col
            v-for="(option, key) in listOption.cashManagement"
            v-show="option.visible"
            :key="key"
            :span="6"
            style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;"
          >
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="findCommand(option.command)"
              >
                <i v-if="option.isIcon" :class="option.class" />
                <svg-icon v-else :icon-class="option.class" />
                <br>
                {{ option.nameOption }}
              </p>
            </el-card>
          </el-col>
        </el-collapse-item>
        <!-- generalOptions -->
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="3">
          <el-col
            v-for="(option, key) in listOption.generalOptions"
            :key="key"
            :span="6"
            style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;"
          >
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="findCommand(option.command)"
              >
                <i v-if="option.isIcon" :class="option.class" />
                <svg-icon v-else :icon-class="option.class" />
                <br>
                {{ option.nameOption }}
              </p>
            </el-card>
          </el-col>
        </el-collapse-item>
        <!-- help -->
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
    </el-card>
    <!-- Add New Command or Modify Dialog -->
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
            v-model="inputCommand"
            v-shortkey="keyListCommant"
            readonly
            style="font-size: 20px;"
            @shortkey.native="theActionCommand"
          />
        </el-form-item>
      </el-form>
      <div
        v-if="!isEmptyValue(inputCommand)"
        style="text-align: center;"
      >
        <p style="text-align: center;">
          <b style="font-size: 22px;text-align: center;"> {{ $t('form.mnemonicCommand.addKeyboardShortcuts') }} </b>
        </p>
        <el-row :gutter="20">
          <el-col :span="12" :offset="8">
            <p style="text-align: center;">
              <el-card v-if="!isEmptyValue(displayCommand)" shadow="hover" class="card-command" style="height: 50px;width: 300px;padding-top: 10px !important;padding-bottom: 10px !important;">
                <b style="font-size: 22px;text-align: center;">
                  {{ displayCommand.toUpperCase() }}
                </b>
                <el-button
                  v-show="!isEmptyValue(setCommandSelect)"
                  type="danger"
                  icon="el-icon-delete"
                  style="float: right;"
                  @click="deleteCommand"
                />
              </el-card>
            </p>
          </el-col>
        </el-row>
      </div>
      <br>
      <!-- Foot actions button panel -->
      <el-button
        type="primary"
        icon="el-icon-check"
        class="button-base-icon"
        style="float: right; margin: 10px;"
        @click="saveCommand"
      />
      <el-button
        type="danger"
        icon="el-icon-close"
        style="float: right;margin-top: 10px;"
        class="button-base-icon"
        @click="isAddComand = false"
      />
      <el-button
        type="info"
        plain
        style="float: right; margin-top: 10px;"
        class="button-base-icon"
        @click="inputCommand = ''"
      >
        <svg-icon icon-class="layers-clear" />
      </el-button>
    </el-dialog>
  </span>
</template>

<script>
import store from '@/store'
import { defineComponent, ref, computed, watch } from '@vue/composition-api'
// Constants
import keyList from './keyList'
import salesOrder from './salesOrder'
import cashManagement from './cashManagement'
import generalOptions from './generalOptions'
import keyListCommant from './keyListCommant'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
export default defineComponent({
  name: 'MnemonicCommand',
  setup() {
    /**
     * Const
     */
    const collapseOption = ['1', '2', '3']
    /**
     * Ref
     */
    const isPersistenceComand = ref(false)
    const liveKeinputCommandy = ref('')
    const currentCommandSend = ref('')
    const setCommandSelect = ref({})
    const isAddComand = ref(false)
    const displayCommand = ref('')
    const inputCommand = ref('')
    const liveKey = ref('')
    const deatKey = ref('')
    /**
     * Computed
     */
    const listOption = computed(() => {
      return {
        salesOrder,
        cashManagement,
        generalOptions
      }
    })
    /**
     * Methods
     */
    function theActionCommand(event) {
      if (isEmptyValue(event)) return
      const { srcKey } = event
      displayCommand.value = 'ctrl + ' + srcKey
      inputCommand.value = 'ctrl + ' + srcKey
    }

    function findCommand(command) {
      currentCommandSend.value = command
      isAddComand.value = !isAddComand.value
      store.dispatch('listCommand', command)
        .then(response => {
          const { records } = response
          setCommandSelect.value = records.find(list => list.command === command)
          if (!isEmptyValue(setCommandSelect.value)) {
            isPersistenceComand.value = true
            displayCommand.value = setCommandSelect.value.shortcut
            inputCommand.value = setCommandSelect.value.shortcut
            return
          }
        })
    }

    function deleteCommand() {
      store.dispatch('removeCommand', {
        id: setCommandSelect.value.id
      })
        .then(() => {
          isAddComand.value = false
          displayCommand.value = ''
          inputCommand.value = ''
        })
        .catch(() => {
          isAddComand.value = false
        })
    }

    function saveCommand() {
      store.dispatch('saveCommand', {
        command: currentCommandSend.value,
        shortcut: inputCommand.value
      })
        .then(() => {
          isAddComand.value = false
          displayCommand.value = ''
          inputCommand.value = ''
        })
        .catch(() => {
          isAddComand.value = false
          displayCommand.value = ''
          inputCommand.value = ''
        })
    }

    /**
     * Watch - watch works directly on a ref
     * @param newValue - New Assessed Property value
     * @param oldValue - Old Assessed Property value
     */

    watch(isAddComand, (newValue, oldValue) => {
      if (!newValue) {
        isPersistenceComand.value = newValue
      }
    })

    return {
      // Import
      cashManagement,
      generalOptions,
      keyListCommant,
      salesOrder,
      keyList,
      // Const
      collapseOption,
      // Ref
      isPersistenceComand,
      liveKeinputCommandy,
      currentCommandSend,
      setCommandSelect,
      displayCommand,
      inputCommand,
      isAddComand,
      liveKey,
      deatKey,
      // Computed
      listOption,
      // Methods
      theActionCommand,
      deleteCommand,
      saveCommand,
      findCommand
    }
  }
})
</script>

<style lang="scss">
.card-command{
  .el-card__body {
    padding-right: 0px !important;
    padding-left: 20px !important;
  }
}
</style>
