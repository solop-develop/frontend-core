<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-container>
    <!-- <el-header style="height: 40% !important;">
      <el-card class="box-card">
        <el-divider content-position="left">
          {{ $t('window.containerInfo.accountingInformation.selection') }}
        </el-divider>
        <el-form
          label-position="top"
          size="small"
          @submit.native.prevent="notSubmitForm"
        >
          <field-definition
            v-for="(field) in metadataList"
            :key="field.columnName"
            :metadata-field="field"
            :container-uuid="containerUuid"
            :container-manager="containerManager"
          />
        </el-form>
      </el-card>
    </el-header> -->
    <el-main>
      <el-card
        style="padding: 20px;"
      >
        <el-table
          :data="list"
          :element-loading-text="$t('notifications.loading')"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          border
          height="75vh"
        >
          <el-table-column
            type="index"
            label="#"
            min-width="30"
            header-align="center"
          />
          <el-table-column
            v-for="(head, key) in heardList"
            :key="key"
            :label="head.label"
            :align="head.align"
            min-width="190"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ scope.row[head.columnName] }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import heardList from './heardList'

export default defineComponent({
  name: 'StoreProduct',

  props: {
    list: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { root }) {
    return {
      heardList
    }
  }

})
</script>

<style>
.scroll-attachment {
    max-height: 80vh;
}
</style>
