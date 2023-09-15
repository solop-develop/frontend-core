<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-input
    v-model="value"
    v-bind="commonsProperties"
    :pattern="pattern"
    :rows="rows"
    :type="typeTextBox"
    :maxlength="maxLength"
    :show-password="Boolean(metadata.isEncrypted)"
    :autofocus="metadata.inTable"
    :size="inputSize"
    show-word-limit
    clearable
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
    @keyup.native.enter="actionKeyPerformed"
    @submit="false"
  >
    <i
      v-if="isValueField"
      slot="prefix"
      class="el-input__icon el-icon-document-copy"
      @click="copyValue"
    />
  </el-input>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/FieldDefinition/mixin/mixinFieldText.js'

// Constants
import { TEXT } from '@/utils/ADempiere/references'

// Utils and Helper Methods
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'FieldText',

  mixins: [
    fieldMixin,
    fieldMixinText
  ],

  props: {
    inTable: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      patternFileName: '[A-Za-zñÑ0-9-_]{1,}',
      patternFilePath: '[A-Za-zñÑ0-9-_/.]{1,}'
    }
  },

  computed: {
    cssClassCustomField() {
      if (this.metadata.displayType === TEXT.id) {
        return ' custom-field-textarea '
      }
      return ' custom-field-text '
    },
    // Only used when input type='TextArea'
    rows() {
      if (this.metadata.inTable) {
        return 1
      }
      return 4
    },
    typeTextBox() {
      // String, Url, FileName...
      let typeInput = 'text'
      // Display Type 'Text' (14)
      if (this.metadata.displayType === TEXT.id) {
        typeInput = 'textarea'
      }
      if (this.metadata.isEncrypted) {
        typeInput = 'password'
      }
      return typeInput
    },
    inputSize() {
      if (!this.isEmptyValue(this.metadata.inputSize)) {
        return this.metadata.inputSize
      }
      // deafult managed with form of fields
      return undefined // 'medium'
    },
    isValueField() {
      return ['DocumentNo', 'Value'].includes(this.metadata.columnName)
    }
  },

  methods: {
    copyValue() {
      let textToCopy = this.value
      if (isEmptyValue(textToCopy)) {
        textToCopy = '' // empty string
      }
      copyToClipboard({
        text: textToCopy,
        isShowMessage: true
      })
    }
  }
}
</script>

<style lang="scss">
  .custom-field-text {
    max-height: 36px;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #dfe5f078;
    border-color: #dfe4ed;
    color: #76797e;
    cursor: not-allowed;
    font-weight: 630;
  }

  // indicates if the textarea is adjustable
  .el-textarea__inner {
    &.field-in-table {
      resize: none !important;
    }
  }

  // does not superimpose the character counter on the input text
  .el-textarea {
    >.el-input__count {
      line-height: 10px;
    }
  }
</style>
