<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <v-md-preview
    :text="comment.result"
    class="previwer-disable"
    style="padding: 0px"
  />
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import 'simple-m-editor/dist/simple-m-editor.css'

export default defineComponent({
  name: 'IssueCommentView',

  props: {
    comment: {
      type: Object,
      required: true
    }
  },

  setup() {
    return {
    }
  }
})
</script>
