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
  <el-upload
    v-model="value"
    v-bind="commonsProperties"
    :limit="metadata.Limit"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    action="https://jsonplaceholder.typicode.com/posts/"
    @change="preHandleChange"
  >
    <el-button size="small" type="primary">
      {{ $t('components.binaryButton') }}
    </el-button>
    <div slot="tip" class="el-upload__tip">
      {{ $t('components.binaryTip') }}
    </div>
  </el-upload>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'

export default {
  name: 'FieldBinary',

  mixins: [
    fieldMixin
  ],

  computed: {
    cssClassCustomField() {
      return ' avatar-uploader '
    }
  },

  methods: {
    handleRemove(file) {
      this.$message.success(`The previously uploaded file has been deleted.`)
    },
    handleError(file) {
      this.$message.error(`The file does not meet the specifications.`)
    },
    handleSuccess(file) {
      this.$message.success(`The file has been successfully loaded.`)
    }
  }
}
</script>
