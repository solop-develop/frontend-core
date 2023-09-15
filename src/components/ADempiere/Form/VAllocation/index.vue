<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <div style="display: contents;">
    <div style="height: 10% !important;padding: 0px 15px;">
      <el-steps :active="currentSetp" finish-status="success">
        <el-step
          v-for="(list, key) in stepList"
          :key="key"
          :title="list.name"
        />
      </el-steps>
    </div>
    <div style="height: 80% !important;padding: 0px 15px;">
      <search-criteria
        v-show="'searchCriteria' === stepList[currentSetp].key"
        :metadata="metadata"
      />
      <payments
        v-show="'payments' === stepList[currentSetp].key"
      >
        <template v-slot:footer>
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="currentSetp--"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            :disabled="isDisabledProcess"
            @click="nextStep"
          />
        </template>
      </payments>
    </div>
    <div v-show="currentSetp <= 0" style="height: 10% !important;text-align: end;padding: 0px 15px;">
      <el-button
        type="success"
        class="button-base-icon"
        icon="el-icon-arrow-right"
        :disabled="isDisabledProcess"
        @click="nextStep"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import SearchCriteria from './components/SearchCriteria'
import Payments from './components/Payments'
import Summary from './components/Summary'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'VAllocation',

  components: {
    // Carousel,
    SearchCriteria,
    Payments,
    Summary
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
    /**
     * Refs
     */
    const stepList = ref([
      {
        name: lang.t('form.VAllocation.step.searchCriteria'),
        description: '',
        key: 'searchCriteria'
      },
      {
        name: lang.t('form.VAllocation.step.selectionPaymentsInvoice'),
        description: '',
        key: 'payments'
      }
    ])

    const currentSetp = computed({
      // getter
      get() {
        const step = store.getters.getSteps
        return step
      },
      // setter
      set(value) {
        store.commit('setChangeSteps', value)
      }
    })

    const isDisabledProcess = computed(() => {
      const {
        businessPartnerId,
        currencyId
      } = store.getters.getSearchFilter
      return isEmptyValue(businessPartnerId) || isEmptyValue(currencyId)
    })

    function nextStep(step) {
      if (currentSetp.value === 0) store.commit('setListSelectInvoceandPayment', [])
      if (currentSetp.value === 1) store.dispatch('processSend')
      if (currentSetp.value >= 1) return

      currentSetp.value++
      if (currentSetp.value === 1) {
        store.dispatch('findListPayment')
        store.dispatch('findListInvoices')
      }
    }

    /**
     * Methods
     */
    return {
      // Refs
      stepList,
      currentSetp,
      // Computed
      isDisabledProcess,
      // Methods
      nextStep
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
</style>
