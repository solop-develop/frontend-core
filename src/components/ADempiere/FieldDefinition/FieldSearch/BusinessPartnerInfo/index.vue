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
  <el-autocomplete
    ref="autocompleteBPartner"
    v-model="displayedValue"
    v-bind="commonsProperties"
    value-key="name"
    clearable
    style="width: 100%;"
    popper-class="custom-field-bpartner-info"
    :trigger-on-focus="false"
    :fetch-suggestions="localSearch"
    :select-when-unmatched="true"
    :highlight-first-item="true"
    @keyup.native="enterKey"
    @select="handleSelect"
    @clear="clearValues"
    @focus="searchFocus"
    @blur="setOldDisplayedValue"
  >
    <!--
    @keyup.enter.native="getBPartnerWithEnter"
      -->
    <template slot-scope="recordRow">
      <div class="header">
        {{ recordRow.item.value }}
        -
        {{ recordRow.item.name }}
      </div>
      <span class="info">
        {{ recordRow.item.tax_id }} {{ recordRow.item.name2 }}
        {{ recordRow.item.description }} ({{ recordRow.item.business_partner_group }})
      </span>
    </template>

    <button-business-partners-list
      slot="append"
      :parent-metadata="metadata"
      :container-manager="containerManager"
      :is-disabled="isDisabled"
    />
  </el-autocomplete>
</template>

<script>
// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldSearchMixin from '@/components/ADempiere/FieldDefinition/FieldSearch/mixinFieldSearch.js'
import businessPartnerMixin from './mixinBusinessPartner'
import ButtonBusinessPartnersList from './buttonBusinessPartnersList.vue'

// Constants
import { TABLE_NAME, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'
import { RECORD_ROWS_BY_LIST } from '@/utils/ADempiere/dictionary/field/lookups'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'BusinessPartnerInfoField',

  components: {
    ButtonBusinessPartnersList
  },

  mixins: [
    fieldMixin,
    fieldSearchMixin,
    businessPartnerMixin
  ],

  props: {
    containerManager: {
      type: Object,
      required: true
    },
    parentMetadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: ''
        }
      }
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-bpartner-info '
    },
    // to recrods list overwrite
    uuidForm() {
      return this.metadata.containerUuid
    }
  },

  beforeMount() {
    if (this.metadata.displayed) {
      this.setDisplayedValue()
    }
  },

  methods: {
    enterKey(event) {
      // TODO: Implement key enter event.
    },
    searchFocus() {
      // if (this.recordsList.length <= 1) {
      //   this.$refs.autocompleteBPartner.close()
      // } else {
      //   this.$refs.autocompleteBPartner.getData()
      // }
      if (!isEmptyValue(this.displayedValue)) {
        this.$refs.autocompleteBPartner.$el.firstElementChild.firstElementChild.select()
      }
      this.setNewDisplayedValue()
    },
    keyPressField() {
      if (!this.isEmptyValue(this.$refs['autocompleteBPartner' + this.metadata.columnName])) {
        this.remoteSearch(this.displayedValue, true)
      }
    },
    handleSelect(recordSelected) {
      if (isEmptyValue(recordSelected) || recordSelected[COLUMN_NAME] <= 0) { // || isEmptyValue(recordSelected.UUID)) {
        // set empty values
        recordSelected = this.blankValues
      }

      this.setValues(recordSelected)

      // prevent losing display value with focus
      this.controlDisplayed = this.generateDisplayedValue(recordSelected)
      this.$refs.autocompleteBPartner.activated = false
    },
    remoteSearch(searchValue, isKeyEnterPress) {
      return new Promise(resolve => {
        let parentUuid = this.metadata.parentUuid
        if (isEmptyValue(parentUuid)) {
          parentUuid = this.metadata.containerUuid
        }

        this.isLoading = true
        this.containerManager.getSearchRecordsList({
          parentUuid,
          containerUuid: this.metadata.containerUuid,
          contextColumnNames: this.metadata.reference.context_column_names,
          tableName: TABLE_NAME,
          uuid: this.metadata.uuid,
          id: this.metadata.internal_id,
          searchValue,
          pageNumber: 1,
          pageSize: RECORD_ROWS_BY_LIST
        })
          .then(responseRecords => {
            if (isEmptyValue(responseRecords)) {
              this.whitOutResultsMessage()
            }

            resolve(responseRecords)
          })
          .catch(error => {
            console.warn(error.message)

            this.whitOutResultsMessage()
            resolve([])
          })
          .finally(() => {
            this.isLoading = false
            if (isKeyEnterPress || this.recordsList.length === 1) {
              const recordSelected = this.recordsList.at()
              this.handleSelect(recordSelected)
            }
          })
      })
    }
  }
}
</script>

<style lang="scss" scope>
.custom-field-bpartner-info {
  // items of lust
  li {
    line-height: normal;
    // padding: 15px;
    padding-bottom: 5px;
    padding-top: 5px;

    .header {
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: bold;
    }

    .info {
      color: #7e7e7e;
      float: left;
      font-size: 12px;
    }
  }
}
</style>
