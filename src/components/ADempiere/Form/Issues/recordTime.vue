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
  <el-form
    label-position="top"
    class="time-record-issue"
  >
    <el-row style="padding-bottom: 10px;" :gutter="20">
      <el-col :span="12">
        <el-form-item
          :label="$t('form.timeRecord.date')"
          :rules="{
            required: true
          }"
        >
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="Pick a day"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('form.timeRecord.name')"
          :rules="{
            required: true
          }"
        >
          <el-input v-model="name" type="text" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('form.timeRecord.description')"
        >
          <el-input
            v-model="description"
            type="textarea"
            autosize
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('form.timeRecord.quantity')"
          :rules="{
            required: true
          }"
        >
          <el-input-number
            v-model="quantity"
            controls-position="right"
            :precision="2"
            style="width: -webkit-fill-available;"
          />
        </el-form-item>
      </el-col>

      <!-- <el-col :span="24">
        <el-form-item
          :label="$t('form.timeRecord.project')"
        >
          <el-select
            v-model="proyect"
            filterable
            style="width: -webkit-fill-available;"
            @visible-change="geProjectsList"
          >
            <el-option
              v-for="item in listProjects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col> -->

      <el-col :span="24">
        <samp style="float: right; paddint-top: 4px;">
          <el-button
            type="info"
            class="button-base-icon"
            plain
            @click="clearFormValues();"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>

          <el-button
            type="primary"
            :loading="isLoadingCreate"
            :disabled="isValidateAdd"
            icon="el-icon-check"
            class="button-base-icon"
            @click="addTimeRecord()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import lang from '@/lang'

// API Request Methods
import {
  // requestlistIssues,
  requestlistProject,
  requestCreateResource
} from '@/api/ADempiere/form/timeRecord.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'RecordTimeIssue',

  props: {
    issueId: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const name = ref('')
    const description = ref('')
    const date = ref(new Date())
    const quantity = ref(0)

    // const listRequest = ref([])
    const listProjects = ref([])

    const isLoadingCreate = ref(false)

    const isValidateAdd = computed(() => {
      if (isEmptyValue(date.value) || isEmptyValue(name.value) ||
        (isEmptyValue(quantity.value) || quantity.value <= 0)) {
        return true
      }
      return false
    })

    // function findRequest(isFind) {
    //   if (isFind) {
    //     requestlistIssues()
    //       .then(response => {
    //         const { records } = response
    //         listRequest.value = records
    //       })
    //   }
    // }

    function geProjectsList(isShow) {
      if (isShow) {
        requestlistProject()
          .then(response => {
            const { records } = response
            listProjects.value = records
          })
      }
    }

    function clearFormValues() {
      name.value = ''
      description.value = ''
      quantity.value = 0
      date.value = new Date()
    }

    /**
     * addTimeRecord - Add new record in time control table
     */
    function addTimeRecord() {
      isLoadingCreate.value = true
      requestCreateResource({
        requestId: props.issueId,
        // projectId: proyect.value,
        name: name.value,
        description: description.value,
        quantity: quantity.value,
        date: date.value
      })
        .then(response => {
          showMessage({
            message: lang.t('data.createRecordSuccessful'),
            type: 'success'
          })
          name.value = ''
          description.value = ''
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`requestCreateResource: Add Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          // listResource()
          isLoadingCreate.value = false
          clearFormValues()
        })
    }

    return {
      name,
      description,
      date,
      quantity,
      isLoadingCreate,
      listProjects,
      //
      isValidateAdd,
      //
      geProjectsList,
      clearFormValues,
      addTimeRecord
    }
  }
})
</script>

<style lang="scss">
.time-record-issue {
  .el-form-item {
    margin-bottom: 12px !important;
    margin-left: 10px;
    margin-right: 10px;
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form-item__label {
    padding-bottom: 0px !important;
  }

  .el-input, .el-input-number, .el-select {
    width: 100%;
  }

  .el-input-number {
    .el-input__inner {
      text-align-last: end !important;
    }
  }
}
</style>
