<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Socio de Negocios (Punto de Venta)" name="1">
        <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
        <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
      </el-collapse-item>
    </el-collapse>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="Código"
        width="180"
      />
      <el-table-column
        prop="name"
        label="Número Identificación"
        width="180"
      />
      <el-table-column
        prop="address"
        label="Nombre"
      />
    </el-table>
  </span>
</template>

<script>
import {
  defineComponent,
  ref
} from '@vue/composition-api'

export default defineComponent({
  name: 'ListCostumer',
  setup() {
    const activeNames = ref('')
    const item = {
      date: 'V-0000000000',
      name: 'V-0000000000',
      address: 'Cliente sin Asignar'
    }

    return {
      activeNames,
      tableData: Array(20).fill(item)
    }
  }
})
</script>

<style lang="scss" scoped>
.label {
  display: contents;
}
</style>
