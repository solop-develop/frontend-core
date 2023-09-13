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
  <div v-if="isShowProductAttribute" class="wrapper">
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        name="detail"
        :label="$t('field.productAttribute.newEdit')"
        lazy
      >
        <detail-attribute-instance
          :parent-uuid="parentUuid"
          :container-uuid="containerUuid"
          :container-manager="containerManager"
          :metadata="metadata"
        />
      </el-tab-pane>

      <el-tab-pane
        name="list"
        :label="$t('field.productAttribute.selectExisting')"
        lazy
      >
        <list-attribute-instance
          :parent-uuid="parentUuid"
          :container-uuid="containerUuid"
          :container-manager="containerManager"
          :metadata="metadata"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import DetailAttributeInstance from './detailAttributeInstance.vue'
import ListAttributeInstance from './listAttributeInstance.vue'

// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'

export default defineComponent({
  name: 'PanelProductAttribute',

  components: {
    DetailAttributeInstance,
    ListAttributeInstance
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const isSOTrx = computed(() => {
      return Boolean(isSalesTransaction({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      }))
    })

    const isShowProductAttribute = computed(() => {
      return store.getters.getShowProductAttribute
    })

    const activeName = ref(
      isSOTrx.value ? 'list' : 'detail'
    )

    return {
      isShowProductAttribute,
      activeName
    }
  }
})
</script>

<style scoped lang="scss">
  .location-address {
    .el-form-item {
        margin-bottom: 0px !important;
    }
  }
</style>
<style lang="scss">
.location-address {
  .el-form-item--small .el-form-item__label {
    line-height: 22px !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }
  .location-address-footer {
    button {
      padding: 4px 8px;
      i, svg {
        font-size: 20px !important;
      }
    }
  }
}
</style>
