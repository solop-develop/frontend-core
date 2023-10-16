<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <el-card class="field-option-card change-log">
    <div slot="header">
      <span>
        {{ $t('field.logsField') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>

    <div>
      <p v-if="isShowSopportLookup">
        <b>
          {{ 'ID:' }} {{ fieldId }}
        </b>
      </p>
      <p v-if="!isEmptyValue(fieldUuid) && isShowSopportLookup">
        <b>
          {{ 'UUID:' }} {{ fieldUuid }}
        </b>
      </p>
      <el-table
        v-if="!isEmptyValue(fieldLogs)"
        :data="fieldLogs"
        border
        highlight-current-row
        :header-row-class-name="tableHeardClassName"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in listLabel"
          :key="index"
          :prop="item.key"
          :label="item.label"
          width="180"
        >
          <template slot-scope="scope">
            <p
              v-if="item.key === 'newDisplayValue'"
              style="max-height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
            >
              <el-popover
                v-if="scope.row[item.key].length > 10"
                placement="top-start"
                width="300"
                :title="item.label"
                trigger="hover"
                :open-delay="400"
              >
                <el-link type="success"> {{ scope.row[item.key] }} </el-link>
                <el-link slot="reference" type="success"> {{ scope.row[item.key] }} </el-link> <br>
              </el-popover>
              <span v-else>
                <el-link type="success"> {{ scope.row[item.key] }} </el-link>
              </span>
            </p>
            <p
              v-else-if="item.key === 'oldDisplayValue'"
              style="max-height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
            >
              <el-popover
                v-if="scope.row[item.key].length > 10"
                placement="top-start"
                width="300"
                :title="item.label"
                trigger="hover"
                :open-delay="400"
              >
                <el-link type="danger"> {{ scope.row[item.key] }} </el-link>
                <el-link slot="reference" type="danger"> {{ scope.row[item.key] }} </el-link> <br>
              </el-popover>
              <span v-else>
                <el-link type="danger"> {{ scope.row[item.key] }} </el-link>
              </span>
            </p>
            <span v-else>
              {{ scope.row[item.key] }} <br>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <p v-else>
        {{ $t('field.logsFieldEmpty') }}
      </p>
    </div>
  </el-card>
</template>

<script>
// constants
import { DOCUMENT_STATUS_COLUMNS_LIST } from '@/utils/ADempiere/constants/systemColumns'
import language from '@/lang'

// utils and helper methods
import {
  formatDate
} from '@/utils/ADempiere/valueFormat.js'
import { isSupportLookup } from '@/utils/ADempiere/references'
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'

export default {
  name: 'ChangeLogsField',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    recordUuid: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      DOCUMENT_STATUS_COLUMNS_LIST,
      isLoading: false,
      currentKey: 0,
      typeAction: 0,
      format: 'YYYY-MM-DD \ HH:MM:SS',
      listLabel: [
        {
          label: language.t('window.containerInfo.log.updated'),
          key: 'logDate'
        },
        {
          label: language.t('window.containerInfo.log.updatedBy'),
          key: 'userName'
        },
        {
          label: language.t('window.containerInfo.log.newValue'),
          key: 'newDisplayValue'
        },
        {
          label: language.t('window.containerInfo.log.oldValue'),
          key: 'oldDisplayValue'
        }
      ]
    }
  },

  computed: {
    listLogsField() {
      const log = this.$store.getters.getRecordLogs.entity_logs
      if (log) {
        const logsField = log.map(element => {
          let type
          if (!this.isEmptyValue(element.changeLogsList[0].newDisplayValue) && this.isEmptyValue(element.changeLogsList[0].oldDisplayValue)) {
            type = 'success'
          } else if (this.isEmptyValue(element.changeLogsList[0].newDisplayValue) && !this.isEmptyValue(element.changeLogsList[0].oldDisplayValue)) {
            type = 'danger'
          } else {
            type = 'primary'
          }
          return {
            ...element,
            columnName: element.changeLogsList[0].columnName,
            type
          }
        })
        return logsField.filter(field => field.columnName === this.fieldAttributes.columnName)
      }
      return []
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    title() {
      // language.t('page.processActivity.zoomIn'),
      return language.t('field.logsField')
    },
    classIsMobilePanel() {
      if (this.isMobile) {
        return 'panel-mobile'
      }
      return 'scroll-logs-field'
    },
    fieldLogs() {
      return this.$store.getters.getFieldLogs.map(field => {
        return {
          ...field.changeLogsList[0],
          logDate: this.formatDate(field.logDate, true, this.format),
          userName: field.userName
        }
      })
    },
    fieldUuid() {
      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName + '_UUID'
      })
    },
    fieldId() {
      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName
      })
    },
    isShowSopportLookup() {
      return isSupportLookup(this.fieldAttributes.displayType)
    }
  },

  methods: {
    formatDate,
    translateDateByLong,
    isSupportLookup,
    tableHeardClassName({ row, rowIndex }) {
      return 'defautl-heard'
    },
    tableRowClassName({ row, rowIndex }) {
      return 'defautl'
    },
    sortSequence(itemA, itemB) {
      return new Date().setTime(new Date(itemB.logDate).getTime()) - new Date().setTime(new Date(itemA.logDate).getTime())
    },
    showkey(key, index) {
      if (key === this.currentKey && index === this.typeAction) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
        this.typeAction = index
      }
    }
  }

}
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss" scoped>
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style lang="scss">
  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
  }
  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
  .panel-mobile {
    height: 80vh;
  }
  .scroll-logs-field {
    max-height: 200px;
    overflow-x: hidden;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .defautl-heard {
    height: 35px;
  }
  .el-table .defautl {
    height: 10px;
  }
</style>
