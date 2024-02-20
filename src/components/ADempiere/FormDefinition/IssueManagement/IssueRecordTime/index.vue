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
  <el-form
    label-position="top"
    size="mini"
    class="time-record-issue form-base"
  >
    <el-row :gutter="20">
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

      <el-col :span="24">
        <el-form-item
          :label="$t('form.timeRecord.description')"
        >
          <el-input
            v-model="description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('form.timeRecord.quantity') + ' (H)'"
          :rules="{
            required: true
          }"
        >
          <el-input-number
            v-model="quantity"
            :disabled="timer != null"
            controls-position="right"
            :precision="2"
            :min="0"
            style="width: -webkit-fill-available;"
            @change="changeQuantityToTime"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('form.timeRecord.time') + ' (HH:MM:SS)'"
        >
          <el-input
            v-model="time"
            disabled
          />
        </el-form-item>
      </el-col>

      <!--
      <el-col :span="24">
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
      </el-col>
      -->

      <el-col :span="24" style="padding-top: 5px;">
        <samp style="float: right; paddint-top: 4px;">
          <el-button
            v-if="timer == null"
            type="success"
            class="button-base-icon"
            plain
            @click="play();"
          >
            <svg-icon icon-class="play-circle" />
          </el-button>
          <el-button
            v-else
            type="warning"
            class="button-base-icon"
            plain
            @click="play();"
          >
            <svg-icon icon-class="pause-circle" />
          </el-button>
          <el-button
            type="danger"
            class="button-base-icon"
            plain
            @click="clear();"
          >
            <svg-icon icon-class="stop-circle" />
          </el-button>

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
} from '@/api/ADempiere/form/timeRecord.ts'

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

    const seconds = ref(0)
    const minutes = ref(0)
    const hours = ref(0)
    const timer = ref(null)

    const time = computed({
      get() {
        return `${zeroFill(hours.value)}:${zeroFill(minutes.value)}:${zeroFill(seconds.value)}`
      },
      set(newValue) {
        //
      }
    })

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
      clear()
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
        quantity: quantity.value.toString(),
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

    function changeQuantityToTime(quantityValue) {
      if (isEmptyValue(quantityValue) || quantityValue <= 0) {
        return clear()
      }
      if (quantityValue < 1) {
        const minutesToQuantity = quantityValue * 60
        minutes.value = Number.parseInt(minutesToQuantity)
      } else if (quantityValue > 0) {
        const hoursToQuantity = Math.abs(quantityValue)
        if (!Number.isInteger(quantityValue)) {
          const decimalHours = hoursToQuantity - Math.floor(hoursToQuantity)
          const minutesToQuantity = decimalHours * 60
          minutes.value = Number.parseInt(minutesToQuantity)
          hours.value = hoursToQuantity - decimalHours
        } else {
          hours.value = quantityValue
        }
      }
    }

    function changeTimeToQuantity(timeValue) {
      if (isEmptyValue(timeValue) || String(timeValue) === '00:00:00') {
        return
      }

      let quantityToMinutes = 0
      if (minutes.value > 0) {
        quantityToMinutes = minutes.value / 60
      }

      let quantityToHours = 0
      if (hours.valie > 0) {
        quantityToHours = hours.value / 0.6
      }

      quantity.value = quantityToHours + quantityToMinutes
    }

    function zeroFill(number) {
      if (isEmptyValue(number)) {
        return '00'
      }
      return number.toString().padStart(2, 0)
    }

    function play() {
      if (timer.value === null) {
        playing()
        timer.value = setInterval(() => {
          playing()
        }, 1000)
      } else {
        clearInterval(timer.value)
        timer.value = null
        pause()
      }
    }

    function playing() {
      seconds.value++
      if (seconds.value >= 59) {
        seconds.value = 0
        minutes.value++
      }
      if (minutes.value >= 59) {
        minutes.value = 0
        hours.value++
      }
      changeTimeToQuantity(time.value)
    }

    function pause() {
    }

    function clear() {
      if (timer.value !== null) {
        clearInterval(timer.value)
        timer.value = null
      }
      seconds.value = 0
      minutes.value = 0
      hours.value = 0
      //
      quantity.value = 0
    }

    return {
      name,
      description,
      date,
      quantity,
      isLoadingCreate,
      listProjects,
      //
      timer,
      time,
      hours,
      minutes,
      seconds,
      //
      isValidateAdd,
      //
      geProjectsList,
      clearFormValues,
      addTimeRecord,
      changeQuantityToTime,
      //
      clear,
      play
    }
  }
})
</script>

<style lang="scss">
.time-record-issue {
  .el-form-item {
    &.el-form-item--mini {
      margin-bottom: 7px !important;
    }
  }
}
</style>
