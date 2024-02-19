<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/Elsiosanchez
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
  <el-container :style="isNewIssues ? 'height: 90vh;padding: 0px;display: contents' : 'height: 90vh;padding: 0px;'">
    <el-main style="padding: 0px;overflow: auto;">
      <list-issues v-if="!isNewIssues" />
    </el-main>

    <el-footer v-if="isNewIssues" height="20%">
      <comment
        :table-name="tableName"
        :record-id="recordId"
      />
    </el-footer>
  </el-container>
</template>

<script>
import {
  defineComponent, computed
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import Comment from '@/components/ADempiere/Form/Issues/component/Comment.vue'
import RecordTime from '@/components/ADempiere/Form/Issues/recordTime.vue'
import ListIssues from '@/components/ADempiere/Form/Issues/ListIssues/index.vue'

export default defineComponent({
  name: 'IssueManagement',

  components: {
    // Editor
    Comment,
    ListIssues,
    RecordTime
  },

  props: {
    tableName: {
      type: String,
      required: false
    },
    recordId: {
      type: Number,
      required: false
    }
  },

  setup() {
    const isNewIssues = computed({
      // getter
      get() {
        return store.getters.getNewIssues
      },
      // setter
      set(newValue) {
        store.commit('setNewIssues', newValue)
      }
    })

    function loadIssues() {
      store.dispatch('listRequest', {})
      store.dispatch('findListMailTemplates')
    }

    loadIssues()

    return {
      isNewIssues,
      // methods
      loadIssues
    }
  }
})
</script>
