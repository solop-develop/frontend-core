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
  <div>
    {{ nextDocumentAction.description }}
    <br><br>

    <el-steps :space="200" simple>
      <el-step icon="el-icon-d-arrow-right">
        <template slot="title">
          <document-status-tag
            key="document-status"
            size="small"
            :value="currentDocumentStatus.value"
            :displayed-value="currentDocumentStatus.name"
          />
        </template>
      </el-step>
      <el-step icon="el-icon-d-arrow-right">
        <template slot="title">
          <document-status-tag
            key="document-actions"
            size="small"
            :value="nextDocumentAction.value"
            :displayed-value="nextDocumentAction.name"
          />
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'NextDocumentAction',

  props: {
    currentDocumentStatus: {
      type: Object,
      default: () => {
        return {
          name: '',
          value: ''
        }
      }
    },
    nextDocumentAction: {
      type: Object,
      default: () => {
        return {
          name: '',
          value: '',
          description: ''
        }
      }
    }
  }
})
</script>
