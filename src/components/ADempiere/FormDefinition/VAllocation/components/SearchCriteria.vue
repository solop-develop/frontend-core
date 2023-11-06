<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div style="display: contents;height: 100% !important;">
    <div style="height: 100% !important;">
      <el-card id="panel-top-search-criteria" class="panel-top-search-criteria">
        <div style="width: 50%;">
          <el-card style="padding: 5px 10px 5px 10px;">
            <el-form
              :inline="true"
              label-position="top"
              class="form-base"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    v-if="!isEmptyValue(bPartner)"
                    style="width: 100%;"
                  >
                    <template slot="label">
                      {{ bPartner.name }}
                      <span style="color: #f34b4b"> * </span>
                    </template>
                    <field-definition
                      :metadata-field="bPartner"
                      :container-uuid="metadata.containerUuid"
                      :container-manager="{
                        generalInfoSearch,
                        searchTableHeader,
                        isMandatoryField,
                        isReadOnlyField,
                        isDisplayedDefault,
                        getSearchInfoList,
                        getLookupList
                      }"
                      :in-table="true"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    :label="$t('form.VAllocation.searchCriteria.organization')"
                    style="width: 100%;"
                  >
                    <el-select
                      v-model="organizationsId"
                      style="width: 100%;"
                      filterable
                      clearable
                      :default-first-option="true"
                      :remote-method="remoteSearchOrganizations"
                      @visible-change="findOrganizations"
                    >
                      <empty-option-select
                        :current-value="organizationsId"
                      />
                      <el-option
                        v-for="item in optionsOrganizations"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    style="width: 100%;"
                  >
                    <template slot="label">
                      {{ $t('form.VAllocation.searchCriteria.currency') }}
                      <span style="color: #f34b4b"> * </span>
                    </template>
                    <el-select
                      v-model="currencyId"
                      style="width: 100%;"
                      filterable
                      clearable
                      :default-first-option="true"
                      :remote-method="remoteSearchCurrencies"
                      @visible-change="findCurrencies"
                    >
                      <empty-option-select
                        :current-value="currencyId"
                      />
                      <el-option
                        v-for="item in optionsCurrency"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    :label="$t('form.VAllocation.searchCriteria.date')"
                    style="width: 100%;"
                  >
                    <el-date-picker
                      v-model="currentDate"
                      type="date"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>

        <div style="width: 50%;">
          <el-card style="height: 100%;">
            <div slot="header" class="clearfix" style="text-align: center;">
              <b> {{ $t('form.VAllocation.searchCriteria.transactionType') }} </b>
            </div>
            <div style="padding: 10px !important;">
              <br>
              <br>
              <br>
              <el-form
                :inline="true"
                label-position="top"
                class="demo-form-inline"
                style="text-align: center;"
              >
                <el-form-item>
                  <el-checkbox
                    v-model="receivablesOnly"
                    :label="labelReceivablesOnly"
                    border
                  />
                  <el-checkbox
                    v-model="payablesOnly"
                    :label="labelPayablesOnly"
                    border
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </el-card>

      <p style="text-align: center;">
        <el-radio
          v-model="radioPanel3"
          :border="true"
          :label="$t('form.VAllocation.searchCriteria.option.assignFromOrder')"
        />
        <el-radio
          v-model="radioPanel3"
          :border="true"
          :label="$t('form.VAllocation.searchCriteria.option.fullAmount')"
        />
        <el-radio
          v-model="radioPanel3"
          :border="true"
          :label="$t('form.VAllocation.searchCriteria.option.autoAssign')"
        />
        <el-radio
          v-model="radioPanel2"
          :border="true"
          :label="$t('form.VAllocation.searchCriteria.option.manual')"
        />
        <el-radio
          v-model="radioPanel2"
          :border="true"
          :label="$t('form.VAllocation.searchCriteria.option.closingBalance')"
        />
      </p>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import Carousel from '@/components/ADempiere/Carousel'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Constants
import {
  ONLY_PAYABLES,
  ONLY_RECEIVABLES,
  RECEIVABLES_AND_PAYABLES
} from '@/utils/ADempiere/dictionary/form/VAllocation'

// API Request Methods
import {
  listBusinessPartners,
  requestListOrganizations,
  requestListCurrencies
} from '@/api/ADempiere/form/VAllocation.ts'

// Utils and Helper Methods
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'SearchCriteria',

  components: {
    Carousel,
    FieldDefinition,
    EmptyOptionSelect
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props) {
    /**
     * Refs
     */
    const radioPanel2 = ref('')
    const radioPanel3 = ref('')

    const receivablesOnly = ref(false)
    const payablesOnly = ref(false)

    // Value the Select
    const organizations = ref('')
    const currency = ref('')

    // List Option the Select
    const optionsBusinessPartners = ref([])

    const bPartner = ref({})

    const storedTransactionTypes = computed(() => {
      return store.getters.getStoredTransactionTypes
    })

    /**
     * Computed
     */
    const labelReceivablesOnly = computed(() => {
      if (isEmptyValue(storedTransactionTypes.value)) {
        return ''
      }
      return storedTransactionTypes.value[ONLY_RECEIVABLES]
    })

    const labelPayablesOnly = computed(() => {
      if (isEmptyValue(storedTransactionTypes.value)) {
        return ''
      }
      return storedTransactionTypes.value[ONLY_PAYABLES]
    })

    const receivablesPayables = computed(() => {
      if (receivablesOnly.value && payablesOnly.value) {
        return RECEIVABLES_AND_PAYABLES
      }
      if (receivablesOnly.value) {
        return ONLY_RECEIVABLES
      }
      if (payablesOnly.value) {
        return ONLY_PAYABLES
      }
      return ''
    })

    const businessPartnerId = computed({
      // getter
      get() {
        const { businessPartnerId } = store.getters.getSearchFilter
        return businessPartnerId
      },
      // setter
      set(id) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'businessPartnerId',
          criteria: 'searchCriteria',
          value: id
        })
        // store.commit('setBusinessPartner', id)
      }
    })

    const optionsOrganizations = computed({
      // getter
      get() {
        const { listOrganization } = store.getters.getSearchFilter
        return listOrganization
      },
      // setter
      set(list) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'listOrganization',
          criteria: 'searchCriteria',
          value: list
        })
        // store.commit('setBusinessPartner', id)
      }
    })

    const optionsCurrency = computed({
      // getter
      get() {
        const { listCurrency } = store.getters.getSearchFilter
        return listCurrency
      },
      // setter
      set(list) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'listCurrency',
          criteria: 'searchCriteria',
          value: list
        })
        // store.commit('setBusinessPartner', id)
      }
    })

    const businessPartner = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: '',
        containerUuid: '8e4268c8-fb40-11e8-a479-7a0060f0aa01',
        columnName: 'C_BPartner_ID'
      })
    })

    const organizationsId = computed({
      // getter
      get() {
        const { organizationId } = store.getters.getSearchFilter
        return organizationId
      },
      // setter
      set(id) {
        store.commit('setProcess', {
          attribute: 'transactionOrganizationId',
          value: id
        })
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'organizationId',
          criteria: 'searchCriteria',
          value: id
        })
      }
    })

    const currencyId = computed({
      // getter
      get() {
        const { currencyId } = store.getters.getSearchFilter
        return currencyId
      },
      // setter
      set(id) {
        // store.commit('setCurrency', id)
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'currencyId',
          criteria: 'searchCriteria',
          value: id
        })
      }
    })

    const currentDate = computed({
      // getter
      get() {
        const { date } = store.getters.getSearchFilter
        return date
      },
      // setter
      set(date) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'date',
          criteria: 'searchCriteria',
          value: date
        })
        // store.commit('setDate', date)
      }
    })

    const currentTypeTransaction = computed({
      // getter
      get() {
        const { transactionType } = store.getters.getSearchFilter
        return transactionType
      },
      // setter
      set(type) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'transactionType',
          criteria: 'searchCriteria',
          value: type
        })
        // return store.commit('setTransactionType', type)
      }
    })

    /**
     * Methods
     */
    function findBusinessPartners(isFind, searchValue) {
      if (!isFind) {
        return
      }
      listBusinessPartners({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsBusinessPartners.value = records.map(business => {
            // const { DisplayColumn } = business.values
            return {
              ...business,
              label: business.values.DisplayColumn
            }
          })
        })
    }

    function findOrganizations(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListOrganizations({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsOrganizations.value = records.map(organizations => {
            const { id, values } = organizations
            return {
              id,
              label: values.DisplayColumn
            }
          })
        })
    }

    function findCurrencies(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListCurrencies({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsCurrency.value = records.map(currency => {
            const { id, uuid, values } = currency
            return {
              id,
              uuid,
              label: values.DisplayColumn
            }
          })
        })
    }

    function remoteSearchBusinessPartners(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsBusinessPartners.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findBusinessPartners(true, query)
        }
      }
    }

    function remoteSearchOrganizations(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsOrganizations.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findOrganizations(true, query)
        }
      }
    }

    function remoteSearchCurrencies(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsCurrency.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findCurrencies(true, query)
        }
      }
    }

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
      }
    }

    function loadTransactonsTypes() {
      if (!isEmptyValue(storedTransactionTypes.value)) {
        return
      }
      store.dispatch('loadTransactonsTypesFromServer')
    }

    function createField() {
      createFieldFromDictionary({
        containerUuid: props.metadata.containerUuid,
        // elementColumnName: 'C_BPartner_ID',
        columnId: 3499, // C_Invoice.C_BPartner_ID
        overwriteDefinition: {
          containerUuid: props.metadata.containerUuid
        }
      })
        .then(response => {
          bPartner.value = response
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }

    function isMandatoryField({ isMandatory, isMandatoryFromLogic }) {
      return isMandatory || isMandatoryFromLogic
    }
    function isDisplayedDefault() {
      return true
    }
    function isReadOnlyField({ isQueryCriteria, isReadOnlyFromLogic }) {
      return isQueryCriteria && isReadOnlyFromLogic
    }
    function generalInfoSearch({
      containerUuid,
      contextColumnNames,
      filters,
      uuid,
      searchValue,
      tableName,
      columnName,
      pageNumber
    }) {
      return store.dispatch('findGeneralInfo', {
        containerUuid,
        contextColumnNames,
        filters,
        // fieldUuid: uuid,
        searchValue,
        tableName,
        columnName,
        pageNumber
      })
    }
    function searchTableHeader({
      containerUuid,
      tableName
    }) {
      return store.dispatch('searchTableHeader', {
        containerUuid,
        tableName
      })
    }

    function getLookupList({ parentUuid, containerUuid, contextColumnNames, uuid, id, searchValue, isAddBlankValue = false, blankValue }) {
      return store.dispatch('getLookupListFromServer', {
        parentUuid,
        containerUuid,
        contextColumnNames,
        columnId: id,
        fieldUuid: uuid,
        searchValue,
        // app attributes
        isAddBlankValue,
        blankValue
      })
    }

    function getSearchInfoList({
      parentUuid, containerUuid,
      contextColumnNames, filters, searchValue,
      uuid, tableName, columnName,
      pageNumber, pageSize
    }) {
      filters = [{
        columnName: 'IsActive',
        value: true
      }]
      if (receivablesOnly.value && !payablesOnly.value) {
        filters.push({
          columnName: 'IsCustomer',
          value: receivablesOnly.value
        })
      } else if (payablesOnly.value && !receivablesOnly.value) {
        filters.push({
          columnName: 'IsVendor',
          value: payablesOnly.value
        })
      }

      return store.dispatch('searchInfoList', {
        isForm: true,
        parentUuid,
        containerUuid,
        contextColumnNames,
        fieldUuid: uuid,
        tableName,
        columnName,
        filters,
        searchValue,
        pageNumber,
        pageSize
      })
    }

    createField()

    currentDate.value = new Date()

    /**
     * Wacht
     */
    watch(receivablesPayables, (newValue, oldValue) => {
      currentTypeTransaction.value = newValue
    })

    watch(businessPartner, (newValue, oldValue) => {
      businessPartnerId.value = newValue
    })

    loadTransactonsTypes()

    return {
      storedTransactionTypes,
      // Refs
      receivablesOnly,
      payablesOnly,
      radioPanel2,
      radioPanel3,
      bPartner,
      receivablesPayables,
      // List Option
      optionsBusinessPartners,
      currentTypeTransaction,
      optionsOrganizations,
      optionsCurrency,
      // businessPartners,
      organizations,
      currency,
      // Computed
      labelReceivablesOnly,
      labelPayablesOnly,
      businessPartnerId,
      organizationsId,
      currentDate,
      currencyId,
      // Methods,
      remoteSearchBusinessPartners,
      remoteSearchOrganizations,
      remoteSearchCurrencies,
      findBusinessPartners,
      findOrganizations,
      findCurrencies,
      createField,
      findFilter,
      //
      isMandatoryField,
      isDisplayedDefault,
      isReadOnlyField,
      generalInfoSearch,
      searchTableHeader,
      getLookupList,
      getSearchInfoList
    }
  }
})
</script>

<style lang="scss">
  .from-wf-panel {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-input-number {
    .el-input--medium .el-input__inner {
      text-align: end;
    }
  }
  .panel-top-search-criteria {
    display: flex;
    .el-card__body {
      display: contents;
      padding-top: 0px !important;
      padding-right: 0px !important;
      padding-bottom: 2px !important;
      padding-left: 0px !important;
      height: 100%!important;
    }
  }
</style>
