<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div class="main-express-receipt">
    <el-card class="box-card">
      <el-card>
        <el-row :gutter="24">
          <el-form
            ref="form-express-receipt"
            label-position="top"
            class="form-min-label"
            inline
          >
            <el-col :span="8" style="border: 1px solid rgb(230, 235, 245);padding: 0px 10px;">
              <el-form-item
                :label="$t('form.VFileImport.configureToImport.selectFileToImport')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;color: transparent !important;"
              >
                <upload-resource
                  style="display: inline-block; text-align: center;"
                  table-name="AD_ImpFormat"
                  :record-id="importFormat.id"
                  :load-data="handleSuccess"
                />

                <select-resource
                  :import-format-id="importFormat.id"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.selectTable.listOfCharacterSets')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-tag>
                  <b style="font-size: 16px;">
                    {{ currentCharset }}
                  </b>
                </el-tag>
              </el-form-item>
            </el-col>

            <el-col :span="8" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.selectTable.importFormat')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-tag v-if="isEmptyValue(storedImportFormatsList)">
                  <b style="font-size: 16px;">
                    {{ importFormat.name }}
                  </b>
                </el-tag>

                <el-dropdown
                  v-else
                  plain
                  split-button
                  :hide-on-click="true"
                  :class="{ 'action-container': true, 'without-defualt-action': false }"
                  @command="changeImportFormat"
                >
                  <span>
                    {{ importFormat.name }}
                  </span>
                  <el-dropdown-menu
                    slot="dropdown"
                  >
                    <el-dropdown-item
                      v-for="(list, index) in storedImportFormatsList"
                      :key="index"
                      :command="list.values.KeyColumn"
                    >
                      {{ list.values.DisplayColumn }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-card>
      <br>

      <table-records />
    </el-card>

    <el-card
      v-if="!isEmptyValue(importFormat)"
      shadow="never"
      style="padding: 0px 10px !important;"
    >
      <el-card
        shadow="never"
      >
        <p
          style="font-size: 18px;text-align: center;margin: 5px;"
        >
          <b>
            {{ importFormat.name }}
          </b>
        </p>
        <p
          style="font-size: 14px;text-align: center;margin: 5px;"
        >
          {{ importFormat.description }}
        </p>
      </el-card>

      <el-scrollbar wrap-class="scroll-list-field">
        <import-format-fields />
      </el-scrollbar>

      <el-row>
        <slot
          name="footer"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  watch
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import UploadResource from '@/components/ADempiere/PanelInfo/Component/AttachmentManager/uploadResource.vue'
import TableRecords from './tableRecords.vue'
import ImportFormatFields from './importFormatFields.vue'
import SelectResource from './selectResource.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'SelectFile',

  components: {
    TableRecords,
    ImportFormatFields,
    SelectResource,
    UploadResource
  },

  setup() {
    /**
     * Computed
     */
    const currentCharset = computed(() => {
      const { charsets } = store.getters.getAttribute
      return charsets
    })

    const importFormat = computed(() => {
      return store.getters.getImportFormat
    })

    const storedImportFormatsList = computed(() => {
      return store.getters.getStoredImportFormatsList
    })

    const resourceId = computed(() => {
      const { id } = store.getters.getResourceReference
      return id
    })

    /**
     * Methods
     */
    function handleSuccess({ resource, file }) {
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'resource',
        value: {
          ...resource,
          fileLabel: file.name
        }
      })
      store.dispatch('getPreviewRecordsFromServer', resource)
    }

    function changeImportFormat(command) {
      store.dispatch('getImportFormatFromServer', {
        id: command
      })
        .then(response => {
          if (!isEmptyValue(resourceId.value)) {
            store.dispatch('getPreviewRecordsFromServer')
          }
        })
    }

    watch(resourceId, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'file',
          criteria: 'resource',
          value: { id: newValue }
        })
        store.dispatch('getPreviewRecordsFromServer', newValue)
      }
    })

    return {
      // Computed
      resourceId,
      storedImportFormatsList,
      currentCharset,
      importFormat,
      // Methods
      handleSuccess,
      changeImportFormat
    }
  }
})
</script>

<style lang="scss">
.el-table--border th.el-table__cell {
  border-bottom: 1px solid #dfe6ec;
  background: #E8F4FF;
}
.el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #dfe4ed;
    color: rgb(27, 26, 26);
    cursor: not-allowed;
}
.scroll-list-field {
  max-height: 25vh;
}
</style>
