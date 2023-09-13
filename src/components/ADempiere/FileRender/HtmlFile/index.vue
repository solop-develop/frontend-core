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
  <div class="html-content">
    <download-file
      :format="format"
      :name="name"
      :mime-type="mimeType"
      :stream="stream"
    />

    <el-container class="sub-content-html">
      <el-main style="padding: 0;">
        <!-- <div
          class="el-table--striped el-table--border el-table--scrollable-y el-table--scrollable-x"
          v-html="content"
        /> -->
        <el-table
          :data="excelData.results"
          border
          highlight-current-row
          stripe
          :header-cell-class-name="rowClassName"
          style="width: 100%;height: 85% !important;"
          height="80vh"
        >
          <el-table-column
            v-for="item of excelData.header"
            :key="item"
            :label="item"
            min-width="150px"
            style="background: aliceblue !important;"
          >
            <template slot-scope="scope">
              <p :style="alignCell(scope.row[item])">
                {{ dataCell(scope.row[item]) }}
                <!-- {{ (scope.row[item] === 'N' ? 'Σ' : scope.row[item]) }} -->
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

// Components and Mixins
import DownloadFile from '@/components/ADempiere/FileRender/downloadFile.vue'

// Utils and Helper Methods
import { read, utils } from 'xlsx'
import { buildBlobAndValues } from '@/utils/ADempiere/resource'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'

export default defineComponent({
  name: 'HTML-TXT-File',

  components: {
    DownloadFile
  },

  props: {
    content: {
      type: [Object, String],
      required: true
    },
    format: {
      type: String,
      default: 'html'
    },
    mimeType: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      default: undefined
    },
    stream: {
      type: [Object, Array],
      required: true
    }
  },
  setup(props) {
    const excelData = ref({})

    function getHeaderRow(sheet) {
      const headers = []
      const range = utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) {
          hdr = utils.format_cell(cell)
        }
        headers.push(hdr)
      }
      return headers
    }

    function generateReaderData() {
      const { blobFile, dataValues } = buildBlobAndValues({
        mimeType: props.mimeType,
        outputStream: props.stream
      })

      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const workbook = read(dataValues, {
            type: 'array'
          })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = getHeaderRow(worksheet)
          const results = utils.sheet_to_json(worksheet)

          // value to render
          excelData.value = {
            header,
            results
          }

          resolve()
        }
        reader.readAsArrayBuffer(blobFile)
      })
    }
    function rowClassName(params) {
      return 'success-row'
    }

    function alignCell(cell) {
      if (typeof cell === 'number') {
        return 'text-align: right;'
      }
      return 'text-align: center;'
    }

    function dataCell(row) {
      if (row === 'Y' || row === 'N') {
        return convertBooleanToTranslationLang(row)
      } else if (typeof row === 'string' && row.includes('&#931')) {
        return 'Σ'
      }
      return row
    }

    generateReaderData()

    return {
      excelData,
      rowClassName,
      alignCell,
      dataCell
    }
  }

})
</script>

<style lang="scss" scope>
.el-table .success-row {
  color: white;
  background: #1F9BDE !important;
}
.html-content {
  width: 100%;
  // height: inherit;
  padding-left: 10px;
  padding-right: 10px;

  .sub-content-html {
    // min-height: inherit;
    // height: inherit;
    // max-height: -webkit-max-content;
    // max-height: -moz-max-content;
    // max-height: max-content;
    width: 100%;
    padding-bottom: 4%;
  }
}
</style>
<style lang="scss">
.html-content {
  .sub-content-html {
    .el-table {
      th.el-table__cell > .cell {
        word-break: break-word !important;
        // word-break: normal;
      }
    }
  }
}
</style>
