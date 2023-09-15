<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanches
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
    :is="componentRender"
    :value="valueField"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'typeField',
  props: {
    row: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    /**
     * Computeds
     */
    const componentRender = computed(() => {
      let field
      switch (props.row.ColumnType) {
        case 'Texto':
          field = () => import('@/components/ADempiere/Form/VHRActionNotice/typeField/type/text')
          break
        default:
          field = () => import('@/components/ADempiere/Form/VHRActionNotice/typeField/type/number')
          break
      }
      return field
    })

    const valueField = computed(() => {
      let value
      switch (props.row.ColumnType) {
        case 'Cantidad':
          value = props.row.Qty
          break
        case 'Monto':
          value = props.row.Amount
          break
        case 'Texto':
          value = props.row.TextMsg
          break
      }
      return value
    })

    return {
      componentRender,
      valueField
    }
  }

})
</script>
