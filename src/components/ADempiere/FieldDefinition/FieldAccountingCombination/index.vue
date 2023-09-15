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
  <el-input
    v-model="displayedValue"
    v-bind="commonsProperties"
    clearable
    type="text"
    :autofocus="metadata.inTable"
    show-word-limit
    @change="handleSelect"
    @clear="clearValues"
    @blur="focusLost"
    @focus="setNewDisplayedValue"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
    @keyup.native.enter="actionKeyPerformed"
    @submit="false"
  >
    <template slot="append">
      <button-to-list
        slot="append"
        :parent-metadata="metadata"
        :container-manager="containerManager"
        :is-disabled="isDisabled"
      />
    </template>
  </el-input>
</template>

<script>
// Constants
import { TABLE_NAME } from '@/utils/ADempiere/dictionary/field/accoutingCombination.js'

// Components and Mixins
import ButtonToList from './buttonToList.vue'
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldSearchMixin from '@/components/ADempiere/FieldDefinition/FieldSearch/mixinFieldSearch.js'
import mixinAccountingCombination from './mixinAccountingCombination.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'FieldAccountingCombination',

  components: {
    ButtonToList
  },

  mixins: [
    fieldMixin,
    fieldSearchMixin,
    mixinAccountingCombination
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
      return ' custom-field-accouting-combination '
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
    keyPressField() {
      if (!this.isEmptyValue(this.$refs[this.metadata.columnName])) {
        this.remoteSearch(this.displayedValue, true)
      }
    },
    handleSelect(value) {
      this.$store.dispatch('getAccountingCombination', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.uuidForm,
        // contextAttributesList: this.contextAttributesList,
        value
      })
        .then(response => {
          const { tableName, id, attributes } = response
          const rowData = {
            ...attributes,
            tableName,
            id
          }
          this.setValues(rowData)
          if (isEmptyValue(response)) {
            this.$message({
              type: 'warning',
              showClose: true,
              message: this.$t('notifications.searchWithOutRecords')
            })
          }
        })
        .finally(() => {
          this.isLoadingRecords = false
        })
    },
    actionKeyPerformed(value) {
      this.handleSelect(this.value)
    },
    remoteSearch(searchValue, isKeyEnterPress) {
      return new Promise(resolve => {
        let parentUuid = this.metadata.parentUuid
        if (isEmptyValue(parentUuid)) {
          parentUuid = this.metadata.containerUuid
        }

        this.containerManager.getSearchInfoList({
          parentUuid,
          containerUuid: this.metadata.containerUuid,
          contextColumnNames: this.metadata.reference.contextColumnNames,
          tableName: TABLE_NAME,
          uuid: this.metadata.uuid,
          searchValue,
          pageNumber: 1
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
      })
    }
  }
}
</script>

<style lang="scss">
.custom-field-accouting-combination {
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
.custom-field-accouting-combination {
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
