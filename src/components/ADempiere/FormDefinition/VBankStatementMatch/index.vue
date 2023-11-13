<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div style="height: inherit;">
    <div style="height: 8% !important;">
      <el-steps :active="currentSetp" finish-status="success">
        <el-step
          v-for="(list, key) in stepList"
          :key="key"
          :title="list.name"
        />
      </el-steps>
    </div>

    <div style="height: 82% !important;">
      <transition name="el-fade-in-linear">
        <search-criteria
          v-if="currentSetp === 1"
          :metadata="metadata"
        />

        <manual-match v-if="currentSetp === 2" />

        <save-data
          v-else-if="currentSetp === 3"
          :title="label"
        />
      </transition>
    </div>

    <div style="height: 10% !important;text-align: end;">
      <el-button
        v-if="!isNext"
        type="info"
        class="button-base-icon"
        icon="el-icon-arrow-right"
        plain
        :disabled="isNext || isDisabledNext"
        style="float: right;"
        @click="currentSetp++"
      />
      <el-button
        v-else
        type="primary"
        icon="el-icon-check"
        class="button-base-icon"
        style="float: right;"
        :disabled="isProcess"
        :loading="isLoadingProcess"
        @click="process"
      />
      <el-button
        v-if="!isUnMatch"
        plain
        type="primary"
        class="button-base-icon"
        icon="el-icon-document-delete"
        :disabled="isUnMatch"
        style="margin-left: 10px;"
        @click="unMatch"
      />
      <el-button
        v-if="currentSetp === 2"
        type="success"
        class="button-base-icon"
        icon="el-icon-refresh-right"
        :loading="isLoading"
        @click="refreshSearch"
      />
      <el-button
        type="info"
        plain
        :disabled="isBack"
        icon="el-icon-arrow-left"
        style="float: right;margin-right: 10px;"
        class="button-base-icon"
        @click="currentSetp--"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import SearchCriteria from './SearchCriteria/index.vue'
import ManualMatch from './ManualMatch/index.vue'
import SaveData from './SaveData/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'VBankStatementMatch',

  components: {
    SearchCriteria,
    SaveData,
    ManualMatch
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props, { root }) {
    const storedBankStatementId = computed(() => {
      const bankStatement = store.getters.getCurrentBankStatement
      if (isEmptyValue(bankStatement)) {
        return -1
      }
      return bankStatement.id
    })

    /**
    * Refs
    */
    const stepList = ref([
      {
        name: lang.t('form.VBankStatementMatch.steps.searchCriteria')
      },
      {
        name: lang.t('form.VBankStatementMatch.steps.pendingMatch')
      },
      {
        name: lang.t('form.VBankStatementMatch.steps.confirmImport')
      }
    ])

    const isLoading = ref(false)
    const isLoadingProcess = ref(false)

    /**
    * Computed
    */
    const currentSetp = computed({
      set(newValue) {
        store.commit('bankStatementMatchStep', newValue)
      },
      get() {
        return store.getters.getStatementMatchStep
      }
    })

    const isBack = computed(() => {
      return currentSetp.value === 1
    })

    const isNext = computed(() => {
      return currentSetp.value === 3
    })

    const initialSept = computed(() => {
      return currentSetp.value - 1
    })

    const label = computed(() => {
      if (currentSetp.value === 3) {
        return lang.t('form.VBankStatementMatch.steps.confirmImport')
      }
      return ''
    })

    const isDisabledNext = computed(() => {
      const bankAccount = store.getters.getBankAccountValueStatementMatch
      if (isEmptyValue(bankAccount) || bankAccount <= 0) {
        return true
      }
      return false
    })

    const isProcess = computed(() => {
      const { list } = store.getters.getResult
      return isEmptyValue(list)
    })

    const isUnMatch = computed(() => {
      const { listUnMatch } = store.getters.getListMatchingMovements
      return isEmptyValue(listUnMatch)
    })

    function unMatch() {
      store.dispatch('listUnMatch')
    }

    function process() {
      isLoadingProcess.value = true
      store.dispatch('processBankStatementMatch')
        .finally(() => {
          isLoadingProcess.value = false
        })
    }

    function refreshSearch() {
      isLoading.value = true
      store.dispatch('getImportedBankMovementsListFromServer', {})
      store.dispatch('getPaymentsListFromServer', {})
        .finally(() => {
          isLoading.value = false
        })
      store.dispatch('getMatchingMovementsListFromServer', {})
    }

    watch(currentSetp, (newValue, oldValue) => {
      if (newValue === 2) {
        store.dispatch('getMatchingMovementsListFromServer', {})
      }
      if (newValue === 3) {
        store.dispatch('resultMovements')
      }
    })

    onMounted(() => {
      const { Record_ID } = root.$route.query
      if (!isEmptyValue(Record_ID) && storedBankStatementId.value !== Number(Record_ID)) {
        store.dispatch('getBankStatementFromServer', {
          id: Record_ID
        })
      }
    })

    return {
      isLoading,
      stepList,
      currentSetp,
      isBack,
      isNext,
      label,
      initialSept,
      isProcess,
      isDisabledNext,
      isLoadingProcess,
      isUnMatch,
      // Methods
      unMatch,
      process,
      refreshSearch
    }
  }
})
</script>

<style scoped>
.carousel-panel {
  height: 100% !important;
  padding: 10px 0px;
}
.el-carousel__item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  z-index: 0;
  height: auto;
}
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
