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
  <component
    :is="componentRender"
    :metadata="metadata"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'FormDefinition',

  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },

  setup(props) {
    // load the component that is indicated in the attributes of received property
    const componentRender = computed(() => {
      let form
      switch (props.metadata.fileName) {
        case 'AcctViewer':
          form = import('@/components/ADempiere/Form/AcctViewer')
          break
        case 'PriceChecking':
          form = import('@/components/ADempiere/Form/PriceChecking')
          store.dispatch('settings/changeSetting', {
            key: 'showMenu',
            value: false
          })
          store.dispatch('app/toggleSideBar', false)
          store.dispatch('settings/changeSetting', {
            key: 'tagsView',
            value: false
          })
          break
        case 'BarcodeReader':
          form = import('@/components/ADempiere/Form/BarcodeReader')
          break
        case 'ProductInfo':
          form = import('@/components/ADempiere/Form/ProductInfo')
          break
        case 'WFActivity':
          form = import('@/components/ADempiere/Form/WorkflowActivity')
          break
        case 'VMatch':
          form = import('@/components/ADempiere/Form/VMatch')
          break
        case 'VPOS':
          store.dispatch('settings/changeSetting', {
            key: 'showContextMenu',
            value: false
          })
          form = import('@/components/ADempiere/Form/VPOS2')
          break
        case 'VGetWeight':
          form = import('@/components/ADempiere/Form/VGetWeight')
          break
        case 'VHRActionNotice':
          form = import('@/components/ADempiere/Form/VHRActionNotice')
          break
        case 'WFPanel':
          form = import('@/components/ADempiere/Form/WFPanel')
          break
        case 'TimeControl':
        case 'org.spin.tcs.form.TimeControl':
          form = import('@/components/ADempiere/Form/TimeControl')
          break
        case 'TimeRecord':
          form = import('@/components/ADempiere/Form/TimeRecord')
          break
        case 'VPayPrint':
        case 'org.compiere.apps.form.VPayPrint':
          form = import('@/components/ADempiere/Form/VPayPrint')
          break
        case 'VBankStatementMatch':
        case 'org.spin.apps.form.VBankStatementMatch':
          form = import('@/components/ADempiere/FormDefinition/VBankStatementMatch')
          break
        case 'IssueManagement':
          form = import('@/components/ADempiere/Form/Issues')
          break
        case 'ExpressReceipt':
          form = import('@/components/ADempiere/FormDefinition/ExpressReceipt')
          break
        case 'ExpressShipment':
          form = import('@/components/ADempiere/FormDefinition/ExpressShipment')
          break
        case 'ExpressMovement':
          form = import('@/components/ADempiere/FormDefinition/ExpressMovement')
          break
        case 'VAllocation':
          form = import('@/components/ADempiere/FormDefinition/VAllocation')
          break
        case 'TaskManager':
        case 'org.spin.eca46.form.TaskManager':
          form = import('@/components/ADempiere/Form/TaskManager')
          break
        case 'VFileImport':
          form = import('@/components/ADempiere/FormDefinition/VFileImport')
          break
        case 'Tracking':
          form = import('@/components/ADempiere/FormDefinition/Tracking')
          break
        default:
          form = import('@/views/ADempiere/Unsupported')
          break
      }

      return () => {
        return new Promise(resolve => {
          form
            .then(formFile => {
              resolve(formFile)
            })
            .catch(() => {
              import('@/views/ADempiere/Unsupported')
                .then(unsupportedFile => {
                  resolve(unsupportedFile)
                })
            })
        })
      }
    })

    return {
      componentRender
    }
  }
})
</script>
