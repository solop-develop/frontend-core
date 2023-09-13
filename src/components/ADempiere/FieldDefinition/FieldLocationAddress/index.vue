<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-popover
    ref="locationAddress"
    v-model="isShowedLocationForm"
    class="popover-location"
    placement="left-end"
    width="350"
    trigger="click"
  >
    <location-address-form
      v-if="isShowedLocationForm"
      class="location-form"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid"
      :container-manager="containerManager"
      :metadata="metadata"
    />

    <el-button
      slot="reference"
      class="button-location-show"
      type="text"
      style="width: 100%;"
      :disabled="isDisabled"
      @click="setContextValues()"
    >
      <el-input
        v-model="displayedValueNotEdit"
        :class="cssClassStyle"
        clearable
        v-bind="commonsProperties"
        readonly
        style="width: 100%;"
        @clear="clearValues"
      >
        <i slot="prefix" class="el-icon-location-information el-input__icon" />
      </el-input>
    </el-button>
  </el-popover>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'
import mixinLocation from './mixinLocationAddress.js'
import LocationAddressForm from './locationAddressForm.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'FieldLocationAddress',

  components: {
    LocationAddressForm
  },

  mixins: [
    fieldMixin,
    fieldWithDisplayColumn,
    mixinLocation
  ],

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-location-address '
    },
    displayedValueNotEdit: {
      get() {
        return this.displayedValue
      },
      set(value) {
        // emty, dont edit
      }
    },
    popoverPlacement() {
      return this.metadata.popoverPlacement || 'top'
    }
  },

  watch: {
    value(newValue, oldValue) {
      if (isEmptyValue(newValue)) {
        this.displayedValue = undefined
      } else {
        if (newValue !== oldValue) {
          // this.displayedValue = undefined
          // this.setDefaultValue()
        }
      }
    }
  },

  methods: {
    clearValues() {
      this.value = undefined
      this.displayedValue = undefined
      this.uuidValue = undefined

      this.clearFormValues()

      this.$store.dispatch('notifyFieldChange', {
        containerUuid: this.metadata.containerUuid,
        containerManager: this.containerManager,
        field: this.metadata,
        columnName: this.metadata.columnName,
        newValue: undefined
      })
    },
    setContextValues() {
      if (this.isDisabled) {
        return
      }
      const value = this.value
      if (isEmptyValue(value) || value <= 0) {
        // this.$store.dispatch('clearValuesOnContainer', {
        //   containerUuid: this.uuidForm
        // })
      }
    }
  }
}
</script>

<style lang="scss">
/**
 * span tag as button and label text
 */
.button-location-show {
  padding-top: 0px !important;
}
</style>
