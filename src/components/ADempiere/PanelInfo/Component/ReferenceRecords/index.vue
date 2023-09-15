<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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
  <span
    v-if="!isLoading"
  >
    <el-card v-if="!isEmptyValue(getterReferences)" style="padding: 10px;">
      <el-descriptions
        :column="1"
        :border="true"
      >
        <el-descriptions-item
          v-for="(reference, key) in getterReferences.referencesList"
          :key="key"
          :label="reference.displayName"
          content-class-name="zoom-reference"
        >
          <el-button
            style="padding: 3px 0"
            type="text"
            @click="openReference(reference)"
          >
            <i class="el-icon-zoom-in" />
            {{ $t('page.processActivity.zoomIn') }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <div v-else>
      <el-empty />
    </div>
  </span>
  <loading-view
    v-else
    key="Reference-Records-Loading"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'
// Component and Mixins
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'ReferenceRecords',

  components: {
    LoadingView
  },

  props: {
    recordUuid: {
      type: String,
      default: () => ''
    },
    parentUuid: {
      type: String,
      default: () => ''
    },
    tableName: {
      type: String,
      default: () => ''
    },
    tabUuid: {
      type: String,
      default: () => ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    // Computeds
    const getterReferences = computed(() => {
      return store.getters.getStoredReferences({
        windowUuid: props.parentUuid,
        tableName: props.tableName,
        recordUuid: props.recordUuid
      })
    })

    // Methods

    /**
     * Open Reference
     * @param {Object} referenceElement
     */

    function openReference(referenceElement) {
      if (isEmptyValue(referenceElement.windowUuid)) {
        return
      }

      zoomIn({
        uuid: referenceElement.windowUuid,
        params: {
          containerUuid: props.tabUuid
        },
        query: {
          referenceUuid: referenceElement.uuid
        }
      })
      store.commit('setShowLogs', false)
    }

    return {
      // Computeds
      getterReferences,
      // Methods
      openReference
    }
  }
})
</script>

<style>
.zoom-reference {
  text-align: center !important;
}
</style>
