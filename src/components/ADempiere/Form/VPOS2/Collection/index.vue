<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-container
    class="v-pos"
  >
    <el-header style="height: auto !important;margin-bottom: 10px;padding: 0 10px;">
      <charge />
      <button-group-options />
    </el-header>
    <el-main style="padding: 0px 10px;">
      <payments />
    </el-main>
    <el-footer style="height: auto !important;padding: 0px 10px;">
      <info-collection />
    </el-footer>
  </el-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// import store from '@/store'
// Component and Mixins
import Charge from './Charge'
import Payments from './Payments'
import ButtonGroupOptions from './ButtonGroupOptions'
import InfoCollection from './InfoCollection.vue'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'NewVPOS',
  components: {
    Charge,
    Payments,
    InfoCollection,
    ButtonGroupOptions
  }
})
</script>

<style lang="scss" scoped>
</style>
