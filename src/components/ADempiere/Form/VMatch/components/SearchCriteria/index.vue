<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanchez@erpya.com www.erpya.com
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
  <el-card
    shadow="hover"
    class="main-search-criteria"
  >
    <el-form
      label-position="top"
      class="from-main"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item class="front-item-receipt">
              <template slot="label" style="width: 450px;">
                {{ $t('form.match.searchCriteria.assignFrom') }}
              </template>
              <el-select
                v-model="assignFrom"
                placeholder="Please Select"
                style="width: 100%;"
                filterable
                clearable
                @change="changeAssignFrom"
                @visible-change="listTypesFrom"
              >
                <el-option
                  v-for="item in assignFromList"
                  :key="item.ValueColumn"
                  :label="item.DisplayColumn"
                  :value="item.ValueColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="front-item-receipt">
              <template slot="label" style="width: 450px;">
                {{ $t('form.match.searchCriteria.assignTo') }}
              </template>
              <el-select
                v-model="assignUp"
                placeholder="Please Select"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="listTypesUp"
              >
                <el-option
                  v-for="item in assignUpList"
                  :key="item.ValueColumn"
                  :label="item.DisplayColumn"
                  :value="item.ValueColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="front-item-receipt">
              <template slot="label" style="width: 450px;">
                {{ $t('form.match.searchCriteria.searchMode') }}
              </template>
              <el-select
                v-model="searchMode"
                placeholder="Please Select"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="listModes"
              >
                <el-option
                  v-for="item in searchModeList"
                  :key="item.ValueColumn"
                  :label="item.DisplayColumn"
                  :value="item.ValueColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="front-item-receipt">
              <template slot="label" style="width: 450px;">
                {{ $t('form.match.searchCriteria.businessPartner') }}
              </template>
              <el-select
                v-model="businessPartner"
                placeholder="Please Select"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="listBPartner"
              >
                <el-option
                  v-for="item in businessPartnerList"
                  :key="item.KeyColumn"
                  :label="item.DisplayColumn"
                  :value="item.KeyColumn"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="front-item-receipt">
              <template slot="label" style="width: 450px;">
                {{ $t('form.match.searchCriteria.product') }}
              </template>
              <el-select
                v-model="product"
                placeholder="Please Select"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="findProduct"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :label="$t('form.match.searchCriteria.dateFrom')"
              style="width: 100%;"
            >
              <el-date-picker
                v-model="dateFrom"
                type="date"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :label="$t('form.match.searchCriteria.dateTo')"
              style="width: 100%;"
            >
              <el-date-picker
                v-model="dateto"
                type="date"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
// Api Request Methods
import {
  listVendors,
  listProduct,
  listSearchModes,
  listMatchesTypes,
  listMatchesTypesTo
} from '@/api/ADempiere/form/VMatch.js'
import store from '@/store'
// Components
import { isEmptyValue } from '@/utils/ADempiere'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

export default defineComponent({
  name: 'SearchCriteria',

  components: {
    FieldDefinition
  },

  props: {
    fieldsList: {
      type: Array,
      required: true,
      default: () => []
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'V-Match',
          containerUuid: 'V-Match'
        }
      }
    }
  },
  setup(props, { root }) {
    /**
     * Refs
     */
    const businessPartnerList = ref([])

    const productList = ref([])

    /**
    * Computed
    */

    const assignFrom = computed({
      // getter
      get() {
        const { matchFromType } = store.getters.getCriteriaVMatch
        return matchFromType
      },
      // setter
      set(id) {
        const displayAssignFrom = assignFromList.value.find(from => from.ValueColumn === id)
        if (!isEmptyValue(displayAssignFrom)) {
          store.commit('setLabelAssignFrom', displayAssignFrom)
        }
        store.commit('setMatchFromType', id)
      }
    })

    const assignUp = computed({
      // getter
      get() {
        const { matchToType } = store.getters.getCriteriaVMatch
        return matchToType
      },
      // setter
      set(id) {
        const displayAssignTo = assignUpList.value.find(from => from.ValueColumn === id)
        if (!isEmptyValue(displayAssignTo)) {
          store.commit('setLabelAssignTo', displayAssignTo)
        }
        store.commit('setMatchToType', id)
      }
    })

    const searchMode = computed({
      // getter
      get() {
        const { matchMode } = store.getters.getCriteriaVMatch
        return matchMode
      },
      // setter
      set(id) {
        store.commit('setMatchMode', id)
      }
    })

    const businessPartner = computed({
      // getter
      get() {
        const { vendorId } = store.getters.getCriteriaVMatch
        return vendorId
      },
      // setter
      set(id) {
        store.commit('setVendorId', id)
      }
    })

    const product = computed({
      // getter
      get() {
        const { productId } = store.getters.getCriteriaVMatch
        return productId
      },
      // setter
      set(id) {
        store.commit('setProductId', id)
      }
    })

    const dateto = computed({
      // getter
      get() {
        const { dateto } = store.getters.getCriteriaVMatch
        return dateto
      },
      // setter
      set(id) {
        store.commit('setDateto', id)
      }
    })

    const dateFrom = computed({
      // getter
      get() {
        const { dateFrom } = store.getters.getCriteriaVMatch
        return dateFrom
      },
      // setter
      set(id) {
        store.commit('setDateFrom', id)
      }
    })

    const assignFromList = computed({
      // getter
      get() {
        return store.getters.getAssignFromList
      },
      // setter
      set(list) {
        store.commit('setAssignFromList', list)
      }
    })

    const assignUpList = computed({
      // getter
      get() {
        return store.getters.getAssignUpList
      },
      // setter
      set(list) {
        store.commit('setAssignUpList', list)
      }
    })

    const searchModeList = computed({
      // getter
      get() {
        return store.getters.getSearchModeList
      },
      // setter
      set(list) {
        store.commit('setSearchModeList', list)
      }
    })
    /**
     * Methods
     */
    function listTypesFrom(isFind) {
      if (!isFind && !isEmptyValue(assignFromList.value)) return
      listMatchesTypes({
        searchValue: assignFrom.value
      })
        .then(response => {
          const { records } = response
          const list = records
          assignFromList.value = list.map(type => {
            const { values } = type
            return values
          })
        })
    }

    function listTypesUp(isFind) {
      if (!isFind && !isEmptyValue(assignUpList.value)) return
      listMatchesTypesTo({
        searchValue: assignUp.value,
        matchFromType: assignFrom.value
      })
        .then(response => {
          const { records } = response
          const list = records
          assignUpList.value = list.map(type => {
            const { values } = type
            return values
          })
        })
    }

    function listModes(isFind) {
      if (!isFind || !isEmptyValue(searchModeList.value)) return
      listSearchModes({
        searchValue: searchMode.value
      })
        .then(response => {
          const { records } = response
          const list = records
          searchModeList.value = list.map(type => {
            const { values } = type
            return values
          })
        })
    }

    function listBPartner(isFind) {
      if (!isFind) return
      listVendors({})
        .then(response => {
          const { records } = response
          const list = records
          businessPartnerList.value = list.map(type => {
            const { values } = type
            return values
          })
        })
    }

    function findProduct(isFind) {
      if (!isFind) return
      listProduct({})
        .then(response => {
          const { records } = response
          const list = records
          productList.value = list.map(type => {
            const { id, name } = type
            return {
              id,
              name
            }
          })
        })
    }

    function changeAssignFrom() {
      assignUp.value = []
      assignUpList.value = []
      return
    }

    return {
      // Refs
      assignFrom,
      assignFromList,
      assignUp,
      assignUpList,
      searchMode,
      searchModeList,
      businessPartner,
      businessPartnerList,
      product,
      productList,
      dateto,
      dateFrom,
      // COmputed
      // Methods
      changeAssignFrom,
      listTypesFrom,
      listBPartner,
      findProduct,
      listTypesUp,
      listModes
    }
  }
})
</script>

<style>
.main-search-criteria {
  /* margin-left: 10px; */
  margin: 10px;
  padding: 10px;
}
</style>
