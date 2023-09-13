<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-form
    label-position="top"
    class="time-record-create"
  >
    <el-row style="padding-bottom: 10px;">
      <el-col :span="sizeColumn">
        <el-form-item
          :label="$t('form.timeRecord.date')"
          :rules="{
            required: true
          }"
          :style="cssStyleFrontName"
        >
          <el-date-picker
            v-model="dateValue"
            type="date"
            placeholder="Pick a day"
            style="width: -webkit-fill-available;"
          />
        </el-form-item>
      </el-col>
      <el-col :span="sizeColumn">
        <el-form-item
          :label="$t('form.timeRecord.name')"
          :rules="{
            required: true
          }"
          :style="cssStyleFrontName"
        >
          <el-input v-model="name" type="text" />
        </el-form-item>
      </el-col>
      <el-col :span="sizeColumn">
        <el-form-item
          :label="$t('form.timeRecord.description')"
          :style="cssStyleFront"
        >
          <el-input v-model="description" type="textarea" autosize />
        </el-form-item>
      </el-col>
      <el-col :span="sizeColumn">
        <el-form-item
          :label="$t('form.timeRecord.quantity')"
          :rules="{
            required: true
          }"
          :style="cssStyleFront"
        >
          <el-input-number
            v-model="quantity"
            controls-position="right"
            :precision="2"
            style="width: -webkit-fill-available;"
          />
        </el-form-item>
      </el-col>
      <el-col :span="sizeColumn">
        <el-form-item
          :label="$t('form.timeRecord.project')"
          :style="cssStyleFront"
        >
          <el-select
            v-model="proyect"
            filterable
            style="width: -webkit-fill-available;"
            @visible-change="geProjectsList"
          >
            <el-option
              v-for="item in listProyect"
              :key="item.id"
              :label="item.value + ' - ' + item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="sizeColumn">
        <el-form-item
          :label="$t('form.timeRecord.request')"
          :style="cssStyleFront"
        >
          <el-select
            v-model="request"
            filterable
            style="width: -webkit-fill-available;"
            @visible-change="geRequestsList"
          >
            <el-option
              v-for="item in listRequest"
              :key="item.id"
              :label="item.document_no + ' - ' + item.summary"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          :style="cssStyleButton"
        >
          <el-button
            type="primary"
            :loading="isLoadingCreate"
            :disabled="isValidateAdd"
            style="float: right;"
            @click="addNewRecord()"
          >
            {{ $t('form.timeRecord.add') }}
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// API Request Methods
import {
  requestCreateResource,
  requestlistIssues,
  requestlistProject
} from '@/api/ADempiere/form/timeRecord.js'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TimeRecord',

  setup() {
    /**
     * Ref
     * @param {string} name - Header Name Field Value
     * @param {string} description - Header Description Field Value
     * @param {boolean} isLoadingCreate - Button Load Flag when adding a new record to the timekeeping table
     */
    const name = ref('')
    const description = ref('')
    const isLoadingCreate = ref(false)
    const dateValue = ref('')
    const quantity = ref(0)
    const listRequest = ref([])
    const listProyect = ref([])
    const request = ref('')
    const proyect = ref('')

    /**
     * Computed
     * isValidateAdd - Validate required fields before sending save
     * isMobile - Detect a mobile device
     * sizeColumn - Column size if it is a mobile device
     * cssStyleFront - Customized style for the Form
     * cssStyleFrontName -Customized style for the Form Name
     * cssStyleButton Customized style for the Button
     */

    const isValidateAdd = computed(() => {
      if (isEmptyValue(dateValue.value) || isEmptyValue(name.value) ||
        (isEmptyValue(quantity.value) || quantity.value <= 0)) {
        return true
      }
      return false
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const sizeColumn = computed(() => {
      if (isMobile.value) {
        return 24
      }
      return 8
    })

    const cssStyleFront = computed(() => {
      if (isMobile.value) {
        return 'margin: 10px 10px 0px;'
      }
      return 'margin-right: 10px;margin-left: 10px;'
    })

    const cssStyleFrontName = computed(() => {
      if (isMobile.value) {
        return 'margin-top: 20px;margin-right: 10px;margin-bottom: 0px;margin-left: 10px;'
      }
      return 'margin-right: 10px;margin-left: 10px;'
    })

    const cssStyleButton = computed(() => {
      if (isMobile.value) {
        return 'padding-top: 0px;padding-bottom: 10px;text-align: center;margin-bottom: 0px !important;'
      }
      return 'padding-top: 0px;'
    })

    /**
     * addNewRecord - Add new record in time control table
     */
    function addNewRecord() {
      isLoadingCreate.value = true
      requestCreateResource({
        requestId: request.value,
        projectId: proyect.value,
        name: name.value,
        description: description.value,
        quantity: quantity.value,
        date: dateValue.value
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
        })
    }

    function geRequestsList(isFind) {
      if (isFind) {
        requestlistIssues()
          .then(response => {
            const { records } = response
            listRequest.value = records
          })
      }
    }

    function geProjectsList(isFind) {
      if (isFind) {
        requestlistProject()
          .then(response => {
            const { records } = response
            listProyect.value = records
          })
      }
    }

    return {
      // Ref
      name,
      description,
      isLoadingCreate,
      dateValue,
      quantity,
      request,
      proyect,
      listProyect,
      geProjectsList,
      listRequest,
      geRequestsList,
      // Computeds
      isValidateAdd,
      isMobile,
      // Css - Computeds
      sizeColumn,
      cssStyleFront,
      cssStyleFrontName,
      cssStyleButton,
      // Methods
      addNewRecord
    }
  }
})
</script>

<style lang="scss">
.time-record-create {
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
