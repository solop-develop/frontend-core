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
  <el-main class="view-base form-time-control" :style="isMobile ? 'overflow: auto;' : ''">
    <el-card class="box-card" style="padding-bottom: 10px;">
      <create-form />

      <table-data />
    </el-card>
  </el-main>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Componets and Mixins
import CreateForm from './createForm.vue'
import TableData from './tableData.vue'

export default defineComponent({
  name: 'TimeRecord',

  components: {
    CreateForm,
    TableData
  },

  props: {
    metadata: {
      type: Object,
      required: true
    }
  },

  setup() {
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    return {
      isMobile
    }
  }
})
</script>

<style lang="scss">
.form-time-control {
  .el-card__body {
    padding-right: 20px !important;
    padding-left: 20px !important;
  }
}
</style>
