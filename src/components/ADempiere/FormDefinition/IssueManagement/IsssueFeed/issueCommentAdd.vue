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
  <div>
    <el-card v-if="isPreview" shadow="never" class="is-add-new-comments">
      <div slot="header">
        <b>
          {{ $t('issues.preview') }}
        </b>
      </div>
      <el-scrollbar wrap-class="scroll-previwer-disable">
        <v-md-preview
          :text="commentText"
          class="previwer-disable"
          style="padding: 0px"
          height="150px"
        />
      </el-scrollbar>
    </el-card>

    <el-card v-else shadow="never" class="is-add-new-comments" style="padding: 0px;">
      <div slot="header">
        <b>
          {{ $t('issues.commentary') }}
        </b>
      </div>
      <v-md-editor
        v-model="commentText"
        :placeholder="$t('issues.addNewCommentary')"
        height="150px"
        left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
        right-toolbar="isCollapseUp sync-scroll fullscreen"
        mode="edit"
        :toolbar="editorToolbarList"
      />
    </el-card>

    <el-button
      type="primary"
      icon="el-icon-check"
      class="button-base-icon"
      style="float: right; margin: 10px;"
      :disabled="isEmptyValue(commentText)"
      @click="addNewComments()"
    />

    <el-button
      type="danger"
      icon="el-icon-close"
      style="float: right;margin-top: 10px;"
      class="button-base-icon"
      @click="cancelEdit(currentIssues)"
    />

    <el-button
      type="info"
      plain
      style="float: right; margin-top: 10px;"
      class="button-base-icon"
      :disabled="isEmptyValue(commentText)"
      @click="clearComments()"
    >
      <svg-icon icon-class="layers-clear" />
    </el-button>

    <el-checkbox
      v-model="isPreview"
      :label="$t('issues.preview')"
      :border="true"
      style="float: right; margin-top: 10px;"
      class="button-base-icon"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  nextTick
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import 'simple-m-editor/dist/simple-m-editor.css'

export default defineComponent({
  name: 'IssueCommentAdd',

  setup() {
    const isPreview = ref(false)
    const commentText = ref('')
    const isCollapseComments = ref(false)

    const currentIssues = computed(() => {
      return store.getters.getCurrentIssues
    })

    const storedMailTemplatesList = computed(() => {
      return store.getters.getListMailTemplates
    })

    const editorToolbarList = computed(() => {
      return {
        listMailTemplates: storedMailTemplatesList.value,
        isCollapseUp: {
          icon: 'el-icon-arrow-up',
          title: 'Collapse',
          action(editor) {
            isCollapseComments.value = !isCollapseComments.value
          }
        },
        isCollapseDown: {
          icon: 'el-icon-arrow-down',
          title: 'Collapse',
          action(editor) {
            isCollapseComments.value = !isCollapseComments.value
          }
        }
      }
    })

    function addNewComments(params) {
      const { id, uuid } = currentIssues.value
      store.dispatch('newIssueComment', {
        id,
        uuid,
        result: commentText.value
      })
        .then(response => {
          nextTick(() => {
            // scrollIssues.value.$el.scrollTop = scrollIssues.value.$el.scrollHeight
            // scrollTimeLineTabComments.value.$refs.wrap.scrollTop = 9999999
          })
        })
      clearComments()
      isPreview.value = false
    }

    function cancelEdit(issues) {
      clearComments()
      isPreview.value = false
    }

    function clearComments() {
      commentText.value = ''
    }

    return {
      currentIssues,
      commentText,
      editorToolbarList,
      //
      isPreview,
      addNewComments,
      cancelEdit,
      clearComments
    }
  }
})
</script>

<style lang="scss">
.is-add-new-comments {
  .el-card__header{
    padding-top: 10px;
    padding-right: 0px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .el-card__body {
    padding: 0px;
  }
}
</style>
