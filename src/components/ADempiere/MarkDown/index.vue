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
  <span>
    <v-md-editor
      v-if="!isPreview"
      v-model="textMarkdown"
      :mode="typeMode"
      :height="maxHeight"
      :default-show-toc="false"
      :left-toolbar="leftOptions"
      :right-toolbar="rightOptions"
      :toolbar="ListToolbar"
      @change="changeValueText"
    />
    <el-card
      v-else
      shadow="never"
      :body-style="{ padding: '8px !important' }"
    >
      <el-scrollbar
        style="border: 1px solid #e6ebf5;border-radius: 15px;"
      >
        <v-md-preview
          :text="textMarkdown"
          class="previwer-disable"
          style="padding: 0px"
          :height="maxHeight"
        />
      </el-scrollbar>
    </el-card>
    <el-row :gutter="12" style="margin-top: 10px;">
      <el-col :span="24">
        <slot name="footer" />
        <el-button
          v-show="isShowSuccess"
          class="button-base-icon"
          icon="el-icon-check"
          style="float: right;margin-right: 5px;"
          type="primary"
          :disabled="disabledSuccess"
          @click="actionSuccess"
        />
        <el-button
          v-show="isShowError"
          class="button-base-icon"
          icon="el-icon-close"
          style="float: right;margin-right: 5px;margin-left: 0px;"
          type="danger"
          :disabled="disabledError"
          @click="actionError"
        />
        <el-button
          type="info"
          plain
          class="button-base-icon"
          style="float: right; margin-right: 5px;"
          @click="textMarkdown = ''"
        >
          <svg-icon icon-class="layers-clear" />
        </el-button>
        <el-checkbox
          v-model="isPreview"
          :label="$t('issues.preview')"
          :border="true"
          style="float: right;"
          class="button-base-icon"
        />
      </el-col>
    </el-row>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'MarkDown',

  props: {
    text: {
      type: String,
      default: ''
    },
    typeMode: {
      type: String,
      default: 'edit'
    },
    leftOptions: {
      Type: String,
      default: 'undo redo clear | h bold italic strikethrough quote ul ol table hr link image code | emoji | ListToolbar'
    },
    rightOptions: {
      Type: String,
      default: 'preview | customToolbar2'
    },
    isFooter: {
      type: Boolean,
      default: false
    },
    contentFooter: {
      type: String,
      default: ''
    },
    isToolbars: {
      type: Boolean,
      default: false
    },
    additionalToolbars: {
      type: Object,
      default: () => {}
    },
    maxHeight: {
      type: String,
      default: '150px'
    },
    changeValueText: {
      type: Function,
      default: (changeValue) => {
        console.info('Implement Change Value method', changeValue)
        return changeValue
      }
    },
    actionSuccess: {
      type: Function,
      default: () => {
        console.info('Implement Action Success')
      }
    },
    disabledSuccess: {
      type: Boolean,
      default: false
    },
    isShowSuccess: {
      type: Boolean,
      default: true
    },
    actionError: {
      type: Function,
      default: () => {
        console.info('Implement Action Error')
      }
    },
    disabledError: {
      type: Boolean,
      default: false
    },
    isShowError: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    // Ref
    const isPreview = ref(false)
    const textMarkdown = ref(props.text)
    // Computed
    const ListToolbar = computed(() => {
      if (props.isToolbars) return props.additionalToolbars
      return {}
    })
    // Methods

    /**
     * Set Page Footer
     */
    function setPageFooter() {
      if (props.isFooter) {
        textMarkdown.value = textMarkdown.value + '\n\n'
        textMarkdown.value = textMarkdown.value + props.contentFooter
      }
    }

    setPageFooter()

    return {
      // Ref
      isPreview,
      textMarkdown,
      // Computed
      ListToolbar,
      // Methods
      setPageFooter
    }
  }
})
</script>

<style lang="scss" scoped>
  .custom-title {
    padding: 10px;
  }
  .v-md-icon.fa-envelope:before {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    content: "\f0e0"; /* código del icono de envelope */
  }
</style>
<style lang="scss">
  .previwer-disable {
    width: 100%;
    .github-markdown-body {
      padding: 10px;
      width: 100%;
    }
  }
</style>

