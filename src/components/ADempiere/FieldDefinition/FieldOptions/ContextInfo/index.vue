<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez esanchez@erpya.com https://github.com/elsiosanchez
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
  <el-card class="field-option-card context-info">
    <div slot="header">
      <span style="word-break: break-word;">
        {{ $t('field.field') }}
        <b>{{ fieldAttributes.name }}</b>
        ({{ fieldAttributes.internal_id }}, {{ fieldAttributes.column_name }}{{ !fieldAttributes.isSameColumnElement ? ', ' + fieldAttributes.element_name : '' }})
      </span>
    </div>

    <el-scrollbar wrap-class="scroll-child">
      <el-form
        ref="form"
        class="form-context-info"
        label-position="top"
        label-width="120px"
        style="overflow: auto;"
        @submit.native.prevent="notSubmitForm"
      >
        <el-form-item
          v-if="!isEmptyValue(messageText)"
          :label="$t('field.contextInfo')"
          class="justify-text"
        >
          {{ messageText }}
        </el-form-item>

        <el-form-item
          :label="$t('field.container.description')"
          class="justify-text"
        >
          {{ fieldAttributes.description }}
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(fieldAttributes.help)"
          :label="$t('field.container.help')"
          class="justify-text"
        >
          {{ fieldAttributes.help }}
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(valueField)"
          :label="$t('fieldOptions.info.currentValue')"
          class="justify-text"
        >
          <template v-if="!isEmptyValue(displayValueField)">
            {{ displayValueField }} =
          </template>
          <b>
            {{ valueField }}
          </b>
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(fieldAttributes.default_value)"
          :label="$t('fieldOptions.info.defaultValue')"
          class="justify-text"
        >
          <pre>{{ fieldAttributes.default_value }}</pre>
        </el-form-item>
        <el-form-item
          v-if="fieldAttributes.is_range && !isEmptyValue(fieldAttributes.default_value_to)"
          :label="$t('fieldOptions.info.defaultValueTo')"
          class="justify-text"
        >
          <pre>{{ fieldAttributes.default_value_to }}</pre>
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(fieldAttributes.display_logic)"
          :label="$t('fieldOptions.info.displayLogic')"
          class="justify-text"
        >
          <pre>{{ fieldAttributes.display_logic }}</pre>
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(fieldAttributes.read_only_logic)"
          :label="$t('fieldOptions.info.readOnlyLogic')"
          class="justify-text"
        >
          <pre>{{ fieldAttributes.read_only_logic }}</pre>
        </el-form-item>

        <el-form-item
          v-if="!isEmptyValue(fieldAttributes.mandatory_logic)"
          :label="$t('fieldOptions.info.mandatoryLogic')"
          class="justify-text"
        >
          <pre>{{ fieldAttributes.mandatory_logic }}</pre>
        </el-form-item>
      </el-form>
    </el-scrollbar>

    <template v-if="!isEmptyValue(fieldAttributes.reference) && !isEmptyValue(fieldAttributes.reference.zoom_windows)">
      <span v-for="(zoomItem, index) in fieldAttributes.reference.zoom_windows" :key="index">
        <el-button
          :key="index"
          type="text"
          @click="redirect({ window: zoomItem })"
        >
          <i class="el-icon-zoom-in" />
          {{ $t('page.processActivity.zoomIn') }}
          {{ zoomItem.name }}
        </el-button>
      </span>
    </template>
  </el-card>
</template>

<script>
import { defineComponent, computed, onMounted } from '@vue/composition-api'

import store from '@/store'

// Constants
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'
import { BUTTON, ID, IMAGE } from '@/utils/ADempiere/references'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { parseContext } from '@/utils/ADempiere/contextUtils'
import { zoomInOptionItem } from '@/components/ADempiere/FieldDefinition/FieldOptions/fieldOptionsList'
import { isLookup } from '@/utils/ADempiere/references'

export default defineComponent({
  name: 'ContextInfo',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const valueField = computed(() => {
      const { parentUuid, containerUuid, column_name } = props.fieldAttributes
      return store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName: column_name
      })
    })
    const displayValueField = computed(() => {
      if (!(isLookup(props.fieldAttributes.display_type) || [ID.id, IMAGE.id, BUTTON.id].includes(props.fieldAttributes.display_type))) {
        return null
      }
      const { parentUuid, containerUuid, column_name } = props.fieldAttributes
      return store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + column_name
      })
    })

    const messageText = computed(() => {
      const { contextInfo } = props.fieldAttributes
      if (!isEmptyValue(contextInfo) && !isEmptyValue(contextInfo.sqlStatement)) {
        const storedContextInfo = store.getters.getContextInfoField(
          contextInfo.uuid,
          contextInfo.sqlStatement
        )
        if (!isEmptyValue(storedContextInfo)) {
          return storedContextInfo.messageText || ''
        }
      }
      return ''
    })

    function redirect({ window }) {
      // panel in mobile mode
      store.commit('changeShowRigthPanel', false)

      zoomInOptionItem.executeMethod({
        window,
        fieldAttributes: props.fieldAttributes,
        value: valueField.value
      })
    }

    onMounted(() => {
      if (!isEmptyValue(props.fieldAttributes.contextInfo) && !isEmptyValue(props.fieldAttributes.contextInfo.sqlStatement)) {
        const sqlParse = parseContext({
          parentUuid: props.fieldAttributes.parentUuid,
          containerUuid: props.fieldAttributes.containerUuid,
          value: props.fieldAttributes.contextInfo.sqlStatement,
          isSQL: true,
          isBooleanToString: true
        })

        store.dispatch('getContextInfoValueFromServer', {
          id: props.fieldAttributes.contextInfo.id,
          uuid: props.fieldAttributes.contextInfo.uuid,
          query: sqlParse.query
        })
      }
    })

    return {
      // Computeds
      valueField,
      displayValueField,
      messageText,
      // Methods
      redirect
    }
  }
})
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss">
.context-info {
  &.el-card {
    max-width: 300px;

    .form-context-info {
      .el-form-item {
        // spacing between form items
        padding-bottom: 10px;

        .el-form-item__content {
          // text content interline
          line-height: 20px;

          pre {
            margin: 0px;
          }
        }
      }
    }
  }
}
</style>
