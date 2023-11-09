<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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
  <span>
    <info-line
      :info-line="line"
    />
    <edit-line
      :edit-line="line"
    />
    <el-button
      size="mini"
      type="danger"
      icon="el-icon-delete"
      style="margin-left: 5px;"
      :disabled="line.isLoading"
      :loading="line.isLoading"
      @click="deleteLine()"
    />
  </span>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// Components and Mixins
import infoLine from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/infoLine'
import editLine from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/index.vue'
// import lang from '@/lang'
import store from '@/store'
// Utils and Helper Methods
// import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'OptionLine',
  components: {
    infoLine,
    editLine
  },
  props: {
    line: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    function deleteLine() {
      props.line.isLoading = true
      store.dispatch('deleteCurrentLine', {
        lineId: props.line.id
      })
    }
    return {
      deleteLine
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
