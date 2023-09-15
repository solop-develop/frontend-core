<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <component
    :is="templateDevice"
    :parent-uuid="parentUuid"
    :container-manager="containerManager"
    :tabs-list="tabsList"
    :all-tabs-list="allTabsList"
    :current-tab-uuid="tabUuid"
    :tab-attributes="tabAttributes"
    :actions-manager="actionsManager"
    :is-child-tab="true"
    style="height: 100% !important;"
  />
</template>

<script>
import { defineComponent, computed, onMounted } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'TabPanel',

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerManager: {
      type: Object,
      required: true
    },
    actionsManager: {
      type: Object,
      required: true
    },
    currentTabUuid: {
      type: String,
      default: ''
    },
    tabUuid: {
      type: String,
      default: ''
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    },
    tabsList: {
      type: Array,
      required: true
    },
    allTabsList: {
      type: Array,
      required: true
    },
    // used only window
    isChildTab: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const templateDevice = computed(() => {
      if (isMobile.value) {
        return () => import('./modeMobile.vue')
      }
      return () => import('./modeDesktop.vue')
    })

    onMounted(() => {
      store.dispatch('changeTabAttribute', {
        parentUuid: props.parentUuid,
        containerUuid: props.tabAttributes.uuid,
        attributeName: 'hasBeenRendered',
        attributeValue: true
      })
    })

    return {
      // computeds
      templateDevice
    }
  }
})
</script>

<!-- <style lang="scss" scoped src="./processActivityStyle.scss"> -->
<!-- </style>
<style>
  .popover-scroll {
    max-height: 200px !important;
  }
</style> -->
