<!-- ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanches
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
  <el-card class="box-card">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p style="text-align: center;">
          <title-and-help
            :name="metadata.title"
            :help="metadata.description"
          />
        </p>
      </div>
      <el-form
        label-position="top"
        label-width="10px"
        class="from-action-notice"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item :label="$t('actionNotice.payrollProcess')">
              <el-select
                :id="$t('actionNotice.payrollProcess')"
                v-model="displayValuePrecess"
                :placeholder="$t('actionNotice.select') + $t('actionNotice.payrollProcess')"
                style="display: contents;"
                @visible-change="findPayrollProcess"
              >
                <el-option
                  v-for="item in optionsPayrollProcess"
                  :key="item.KeyColumn"
                  :label="item.DisplayColumn"
                  :value="item.KeyColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('actionNotice.businessPartner')">
              <el-select
                :id="$t('actionNotice.businessPartner')"
                v-model="displayValueEmployee"
                :placeholder="$t('actionNotice.select') + $t('actionNotice.businessPartner')"
                style="display: contents;"
                @visible-change="findOptionsEmployee"
              >
                <el-option
                  v-for="item in optionsPayrollEmployee"
                  :key="item.KeyColumn"
                  :label="item.DisplayColumn"
                  :value="item.KeyColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('actionNotice.payrollConcept')">
              <el-select
                :id="$t('actionNotice.payrollConcept')"
                v-model="displayValueConcept"
                :placeholder="$t('actionNotice.select') + $t('actionNotice.payrollConcept')"
                style="display: contents;"
                @visible-change="findPayrollConcept"
              >
                <el-option
                  v-for="item in optionsPayrollConcept"
                  :key="item.KeyColumn"
                  :label="item.DisplayColumn"
                  :value="item.KeyColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Fecha">
              <el-date-picker
                v-model="ValidFrom"
                type="date"
                :placeholder="$t('actionNotice.validFrom')"
                style="display: contents;"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="conceptDefinition.ColumnType === 'T' && !isEmptyValue(conceptDefinition.referenceUuid)" :span="8">
            <el-form-item label="Valor">
              <el-select
                :id="$t('actionNotice.payrollConcept')"
                v-model="valueReference"
                :placeholder="$t('actionNotice.select') + $t('actionNotice.payrollConcept')"
                style="display: contents;"
                @visible-change="findConceptDefinition"
              >
                <el-option
                  v-for="item in listReference"
                  :key="item.uuid"
                  :label="item.displayedValue"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-else-if="conceptDefinition.ColumnType === 'T'" :span="8">
            <el-form-item label="Valor">
              <el-input
                v-model="FieldValue"
                style="display: contents;"
              />
            </el-form-item>
          </el-col>
          <el-col v-else-if="conceptDefinition.ColumnType === 'D'" :span="8">
            <el-form-item label="Valor">
              <el-date-picker
                v-model="FieldValue"
                type="date"
                placeholder="Pick a day"
                style="display: contents;"
              />
            </el-form-item>
          </el-col>
          <el-col v-else-if="conceptDefinition.ColumnType !== 'T'" :span="8">
            <el-form-item label="Valor">
              <el-input-number
                v-model="FieldValue"
                controls-position="right"
                style="display: contents;"
                :precision="2"
                :step="0.1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('actionNotice.description')">
              <el-input
                v-model="description"
                style="display: contents;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <br>
      <el-button-group style="float: right;margin-right: 1.5%;">
        <el-button
          type="success"
          icon="el-icon-refresh"
          plain
          @click="refresh"
        />
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="validateDelete"
          plain
          @click="deleteConcepts"
        />
        <el-button
          type="info"
          icon="el-icon-edit"
          :disabled="isEmptyValue(currentRow.uuid)"
          plain
          @click="updateMovements(currentRow)"
        />
        <el-button
          type="primary"
          icon="el-icon-document-add"
          plain
          @click="sendAtribute"
        />
      </el-button-group>
      <br>
    </el-card>
    <el-table
      :data="listConcepts"
      border
      style="width: 100%"
      highlight-current-row
      @row-click="select"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <template v-for="(attributes, key) in HEADER_TABLE">
        <el-table-column
          :key="key"
          :prop="attributes.key"
          :label="attributes.label"
        />
      </template>
    </el-table>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'

// Constants
import { HEADER_TABLE, DATA_ATRIBUTES } from '@/utils/ADempiere/constants/form/VHRActionNotice.js'
// Components
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import TypeField from '@/components/ADempiere/Form/VHRActionNotice/typeField'

// Utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/valueFormat.js'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat.js'

export default defineComponent({
  name: 'VHRActionNotice',
  components: {
    TitleAndHelp,
    TypeField
  },

  props: {
    metadata: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    /**
     * Computeds
     */

    // List Options

    const optionsPayrollProcess = computed(() => {
      return store.getters.getListOptionsPayrollProcess
    })

    const optionsPayrollEmployee = computed(() => {
      return store.getters.getListOptionsEmployee
    })

    const optionsPayrollConcept = computed(() => {
      return store.getters.getListOptionsPayrollConcept
    })

    // Values

    const displayValuePrecess = computed({
      get() {
        return store.getters.getValuePayrollProcess
      },
      set(value) {
        store.commit('setPayrollProcess', {
          listOptions: optionsPayrollProcess.value,
          value
        })
        return value
      }
    })

    const displayValueEmployee = computed({
      get() {
        return store.getters.getValueEmployee
      },
      set(value) {
        store.commit('setEmployee', {
          listOptions: optionsPayrollEmployee.value,
          value
        })
        return value
      }
    })

    const displayValueConcept = computed({
      get() {
        return store.getters.getValuePayrollConcept
      },
      set(value) {
        store.commit('setPayrollConcept', {
          listOptions: optionsPayrollConcept.value,
          value
        })

        if (conceptDefinition.value.ColumnType === 'A') {
          findConceptDefinition()
        }
        store.dispatch('conceptDefinition', { id: value })
        return value
      }
    })

    const conceptDefinition = computed(() => {
      return store.getters.getConceptDefinitio
    })

    // validate

    const validateDelete = computed(() => {
      return isEmptyValue(uuids.value)
    })

    // Data List

    const listConcepts = computed(() => {
      return store.getters.getDataListConcept.map(concepts => {
        return {
          ...concepts,
          ServiceDate: formatDate(concepts.ServiceDate),
          ValidFrom: formatDate(concepts.ValidFrom)
        }
      })
    })

    /**
     * Refs
     */

    const description = ref('')
    const ValidFrom = ref('')

    const uuids = ref([])
    const id = ref([])
    const FieldValue = ref()
    const currentRow = ref({ attributes: [], id: 0, uuid: '' })
    const Amount = ref(0.0)
    const TextMsg = ref('')
    const Qty = ref(0)
    const columnNameChange = ref('')
    const format = 'YYYY-MM-DD HH:mm:ss'

    const listReference = ref([])
    const valueReference = ref(0)
    const selectvalue = ref({
      key: '',
      value: undefined
    })

    /**
     * Functions
     */
    function findPayrollConcept() {
      store.dispatch('findPayrollConcepts')
    }

    function findPayrollProcess() {
      store.dispatch('findPayrollProcess')
    }

    function findOptionsEmployee() {
      store.dispatch('findEmployee')
    }

    function sendAtribute() {
      let ColumnType
      switch (conceptDefinition.value.ColumnType) {
        case 'A':
          selectvalue.value = {
            key: 'Amount',
            value: FieldValue.value
          }
          ColumnType = 'Monto'
          break
        case 'Q':
          selectvalue.value = {
            key: 'Qty',
            value: FieldValue.value
          }
          ColumnType = 'Cantidad'
          break
        case 'D':
          selectvalue.value = {
            key: 'ServiceDate',
            value: dateTimeFormats(FieldValue.value, format)
          }
          ColumnType = 'Fecha'
          break
        case 'T':
          selectvalue.value = {
            key: 'TextMsg',
            value: isEmptyValue(conceptDefinition.value.referenceUuid) ? FieldValue.value : valueReference.value
          }
          ColumnType = 'Fecha'
          break
      }
      const attributes = parseAttributes({
        listAattributes: DATA_ATRIBUTES,
        setData: selectvalue.value,
        ColumnType
      })

      store.dispatch('saveMovement', {
        attributes
      })
      clearData()
    }

    function select(params) {
      displayValueConcept.value = parseInt(params.HR_Concept_ID)
      currentRow.value = params
      ValidFrom.value = params.ValidFrom
      description.value = params.Description
      switch (params.ColumnType) {
        case 'Texto':
          columnNameChange.value = 'TextMsg'
          TextMsg.value = params.TextMsg
          valueReference.value = params.TextMsg
          FieldValue.value = params.TextMsg
          break
        case 'Monto':
          columnNameChange.value = 'Amount'
          Amount.value = params.Amount
          FieldValue.value = params.Amount
          break
        case 'Cantidad':
          columnNameChange.value = 'Qty'
          Qty.value = params.Qty
          FieldValue.value = params.Qty
          break
        case 'Fecha':
          columnNameChange.value = 'ServiceDate'
          FieldValue.value = params.ServiceDate
          break
      }
    }

    function handleSelectionChange(val) {
      uuids.value = val.map(select => select.uuid)
      id.value = val.map(select => select.id)
    }

    function deleteConcepts() {
      store.dispatch('deleteConcepts', { uuids: uuids.value, ids: id.value })
    }

    function refresh() {
      store.dispatch('findListConcepts')
    }

    function updateMovements(currentMovements) {
      const { id, uuid } = currentMovements
      let valueConcept
      switch (conceptDefinition.value.ColumnType) {
        case 'T':
          columnNameChange.value = 'TextMsg'
          valueConcept = isEmptyValue(conceptDefinition.value.referenceUuid) ? FieldValue.value : valueReference.value
          break
        case 'A':
          columnNameChange.value = 'Amount'
          valueConcept = FieldValue.value
          break
        case 'Q':
          columnNameChange.value = 'Qty'
          valueConcept = FieldValue.value
          break
        case 'D':
          columnNameChange.value = 'ServiceDate'
          valueConcept = dateTimeFormats(FieldValue.value, format)
          break
      }
      store.dispatch('saveMovement', {
        id,
        uuid,
        attributes: parseAttributes({
          listAattributes: DATA_ATRIBUTES,
          setData: {
            key: columnNameChange.value,
            value: valueConcept
          }
        })
      })
      clearData()
    }

    function findConceptDefinition(params) {
      store.dispatch('getLookupListFromServer', {
        referenceUuid: conceptDefinition.value.referenceUuid
      })
        .then(responseLookupList => {
          listReference.value = responseLookupList
        })
    }

    function parseAttributes({
      listAattributes,
      setData,
      ColumnType,
      isUpdate = false
    }) {
      return listAattributes.map(params => {
        switch (params.key) {
          case 'HR_Process_ID':
            return {
              key: params.key,
              value: displayValuePrecess.value
            }
          case 'C_BPartner_ID':
            return {
              key: params.key,
              value: displayValueEmployee.value
            }
          case 'HR_Concept_ID':
            return {
              key: params.key,
              value: displayValueConcept.value
            }
          case 'ColumnType':
            return {
              key: params.key,
              value: ColumnType
            }
          case 'Description':
            return {
              key: params.key,
              value: description.value
            }
          case 'ValidFrom':
            return {
              key: params.key,
              value: dateTimeFormats(ValidFrom.value, format)
            }
          case setData.key:
            return {
              key: setData.key,
              value: setData.value
            }
          default:
            return params
        }
      })
    }

    function clearData() {
      ValidFrom.value = ''
      FieldValue.value = undefined
      valueReference.value = undefined
      description.value = ''
    }

    return {
      // Constants
      HEADER_TABLE,
      // Ref
      ValidFrom,
      description,
      uuids,
      id,
      currentRow,
      FieldValue,
      TextMsg,
      Qty,
      selectvalue,
      Amount,
      listReference,
      valueReference,
      columnNameChange,
      // Computed
      optionsPayrollProcess,
      optionsPayrollEmployee,
      optionsPayrollConcept,
      displayValuePrecess,
      displayValueEmployee,
      displayValueConcept,
      listConcepts,
      validateDelete,
      conceptDefinition,
      // methodos
      findPayrollConcept,
      findPayrollProcess,
      findOptionsEmployee,
      sendAtribute,
      select,
      handleSelectionChange,
      deleteConcepts,
      refresh,
      updateMovements,
      findConceptDefinition,
      formatDate,
      dateTimeFormats,
      clearData
    }
  }

})
</script>

<style scoped>
.from-action-notice {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
