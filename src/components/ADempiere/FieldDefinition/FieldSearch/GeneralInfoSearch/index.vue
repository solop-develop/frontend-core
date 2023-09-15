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
  <el-autocomplete
    ref="autocompleteGeneralInfo"
    v-model="displayedValue"
    v-bind="commonsProperties"
    value-key="name"
    clearable
    style="width: 100%;max-height: 60px;"
    popper-class="custom-field-search-info"
    :trigger-on-focus="false"
    :fetch-suggestions="localSearch"
    :select-when-unmatched="true"
    :highlight-first-item="true"
    @select="handleSelect"
    @clear="clearValues"
    @focus="setNewDisplayedValue"
    @blur="setOldDisplayedValue"
  >
    <!--
    @keyup.enter.native="getRecord"
      -->
    <template slot-scope="recordRow">
      <div class="header">
        <b> {{ generateDisplayedValue(recordRow.item) }} </b>
      </div>
      <span class="info">
        {{ generatedDescription(recordRow.item) }}
      </span>
    </template>

    <button-general-info-search
      slot="append"
      :parent-metadata="metadata"
      :is-disabled="isDisabled"
      :container-manager="containerManager"
      :icon="icon"
    />
  </el-autocomplete>
</template>

<script>
import store from '@/store'

// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldSearchMixin from '@/components/ADempiere/FieldDefinition/FieldSearch/mixinFieldSearch.js'
import ButtonGeneralInfoSearch from './button.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'GeneralInfoSearch',

  components: {
    ButtonGeneralInfoSearch
  },

  mixins: [
    fieldMixin,
    fieldSearchMixin
  ],

  props: {
    parentMetadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: ''
        }
      }
    },
    icon: {
      type: Object,
      default: () => {
        return {
          type: 'svg',
          class: 'search'
        }
      }
    },
    containerManager: {
      type: Object,
      required: true
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-search-info '
    },
    uuidForm() {
      return this.metadata.containerUuid
    },
    // to records list overwrite
    recordsList() {
      return store.getters.getGeneralInfoRecordsList({
        containerUuid: this.uuidForm
      })
    }
  },

  beforeMount() {
    if (this.metadata.displayed) {
      this.setDisplayedValue()
    }
  },

  methods: {
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        this.isLoading = true
        this.containerManager.generalInfoSearch({
          containerUuid: this.metadata.containerUuid,
          parentUuid: this.metadata.containerUuid,
          pageNumber: 1,
          contextColumnNames: this.metadata.reference.contextColumnNames,
          tableName: this.metadata.reference.tableName,
          fieldUuid: this.metadata.uuid,
          searchValue
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
            if (this.recordsList.length === 1) {
              const recordSelected = this.recordsList.at()
              this.handleSelect(recordSelected)
            }
          })
      })
    }
  }
}
</script>

<style lang="scss">
.custom-field-search-info {
  // button icon suffix
  .button-search {
    padding-left: 10px !important;
    padding-right: 10px !important;

    >i {
      font-size: 20px;
    }
  }
}
</style>
<style lang="scss" scope>
.custom-field-search-info {
  // items of lust
  li {
    line-height: normal;
    // padding: 15px;
    padding-bottom: 5px;
    padding-top: 5px;

    .header {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .info {
      color: #7e7e7e;
      float: left;
      font-size: 12px;
    }
  }
}
</style>
