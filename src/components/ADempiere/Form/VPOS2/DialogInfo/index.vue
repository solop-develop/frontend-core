<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com, Elsio Sanchez elsiosanche@gmail.com www.erpya.com
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
      v-if="isEmptyValue(typeInfo)"
      slot="title"
    >
      <p style="text-align: center;">
        <b>
          {{ title }}
        </b>
      </p>
    </span>
    <el-result
      v-else
      :icon="typeInfo"
      :title="title"
    />
    <span class="content-modal-dialog">
      <component
        :is="componentRender"
      />
    </span>

    <span slot="footer" class="dialog-footer">
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
        :disabled="isDisabledDone"
        @click="doneButton"
      />
    </span>
  </el-dialog>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'ModalDialog',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: false
    },
    containerManager: {
      type: Object,
      required: false
    },
    cancelAction: {
      type: Function,
      default: () => {
      }
    },
    confirmAction: {
      type: Function,
      default: () => {
        console.info('Implement confirm action method')
      }
    }
  },

  setup(props) {
    const storedModalDialog = computed(() => {
      return store.getters.getModalDialogManagerVPOS
    })

    const isShowed = computed(() => {
      return store.getters.getShowedModalDialogVPOS
    })

    const typeInfo = computed(() => {
      return store.getters.getModalDialogManagerVPOS.type
    })

    const title = computed(() => {
      if (isEmptyValue(storedModalDialog.value)) {
        return ''
      }
      return storedModalDialog.value.title
    })

    const componentRender = computed(() => {
      if (!isEmptyValue(storedModalDialog.value)) return storedModalDialog.value.componentPath
      return ''
    })

    const isDisabledDone = computed(() => {
      if (
        !isEmptyValue(storedModalDialog.value) &&
        storedModalDialog.value.isDisabledDone
      ) {
        return Boolean(
          storedModalDialog.value.isDisabledDone()
        )
      }
      return false
    })

    const closeDialog = () => {
      // close modal dialog
      store.commit('setShowedModalDialogVPOS', {
        isShowed: false
      })
    }

    const doneButton = () => {
      storedModalDialog.value.doneMethod()
      closeDialog()
    }

    return {
      // computeds
      storedModalDialog,
      componentRender,
      isDisabledDone,
      isShowed,
      title,
      typeInfo,
      // methods
      closeDialog,
      doneButton
    }
  }
})
</script>
