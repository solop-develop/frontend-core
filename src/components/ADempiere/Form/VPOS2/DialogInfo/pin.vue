<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-dialog
    class="modal-dialog"
    :visible="isShowed"
    width="80%"
    @close="closeDialog"
  >
    <span
      slot="title"
    >
      <p style="text-align: center;">
        <b>
          {{ title }}
        </b>
      </p>
    </span>
    <el-card
      shadow="never"
      :body-style="{ padding: '5px' }"
    >
      <el-input
        id="pin"
        v-model="pin"
        v-shortkey="{close: ['esc'], enter: ['enter']}"
        autofocus
        type="password"
        :placeholder="$t('form.pos.tableProduct.pin')"
        :focus="true"
        @shortkey.native="theActionPin"
      />
      <el-row style="text-align: end;padding: 5px 0px;">
        <span class="dialog-footer">
          <el-button
            type="danger"
            icon="el-icon-close"
            class="button-base-icon"
            @click="closeDialog"
          />
          <el-button
            type="primary"
            icon="el-icon-check"
            class="button-base-icon"
            :disabled="isEmptyValue(pin)"
            @click="doneButton"
          />
        </span>
      </el-row>
    </el-card>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import store from '@/store'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
// import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'OpenBalance',
  setup() {
    const pin = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'field',
          attribute: 'pin'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'field',
          attribute: 'pin',
          value: value
        })
      }
    })

    const isShowed = computed(() => {
      return store.getters.getShowedModalPin
    })

    const storedModalDialog = computed(() => {
      return store.getters.getModalPin
    })

    const title = computed(() => {
      if (isEmptyValue(storedModalDialog.value)) {
        return ''
      }
      return storedModalDialog.value.title
    })

    function theActionPin(event) {
      const { srcKey } = event
      if (srcKey === 'close') {
        closeDialog()
      }
    }

    function closeDialog() {
      store.commit('setShowedDialogPin', {
        isShowed: false
      })
      pin.value = ''
    }

    function doneButton() {
      store.dispatch('validatePIN', {
        pin: pin.value,
        requestedAccess: storedModalDialog.value.requestedAccess,
        requestedAmount: storedModalDialog.value.requestedAmount
      })
        .then(response => {
          if (response) {
            storedModalDialog.value.doneMethod()
            closeDialog()
          }
        })
    }

    return {
      pin,
      title,
      isShowed,
      storedModalDialog,
      // Methods
      doneButton,
      closeDialog,
      theActionPin
    }
  }
})
</script>

<style lang="scss" scoped>
.border-info {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
  padding: 0px 5px;
}
.line-info {
  width: 100%;
  display: flow-root;
  margin: 10px 0px;
}
</style>
