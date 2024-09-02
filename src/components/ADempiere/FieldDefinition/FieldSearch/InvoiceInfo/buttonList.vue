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
  <el-popover
    ref="invoicesListPopover"
    v-model="showedPopoverPanel"
    popper-class="invoices-popover"
    placement="top"
    width="1200"
    trigger="click"
  >
    <panel-form
      v-if="showedPopoverPanel"
      :show-popover="showedPopoverPanel"
      :container-manager="containerManager"
      :metadata="parentMetadata"
    />

    <el-button
      slot="reference"
      class="button-show-popover"
      :disabled="isDisabled"
    >
      <i
        class="el-icon-s-order"
      />
    </el-button>
  </el-popover>
</template>

<script>
import store from '@/store'

// Components and Mixins
import PanelForm from './PanelForm/index.vue'

// Constants
import {
  INVOICES_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/invoice'

export default {
  name: 'ButtonList',

  components: {
    PanelForm
  },

  props: {
    parentMetadata: {
      type: Object,
      default: () => {
        return {
          parentUuid: undefined,
          containerUuid: undefined,
          columnName: COLUMN_NAME,
          elementName: COLUMN_NAME
        }
      }
    },
    containerManager: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    uuidForm() {
      if (!this.isEmptyValue(this.parentMetadata.containerUuid)) {
        return this.parentMetadata.columnName + '_' + this.parentMetadata.containerUuid
      }
      return INVOICES_LIST_FORM
    },
    showedPopoverPanel: {
      get() {
        return store.getters.getFieldInvoceShow({
          containerUuid: this.uuidForm
        })
      },
      set(value) {
        store.commit('setInvoiceFieldShow', {
          containerUuid: this.uuidForm,
          show: value
        })
      }
    }
  }
}
</script>
