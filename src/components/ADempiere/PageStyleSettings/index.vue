<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <span>
    <el-button
      plain
      type="primary"
      icon="el-icon-setting"
      class="button-base-icon"
      style="position: fixed;top: 50%;right: 0%;font-size: 30px;"
      @click="showSettings = !showSettings"
    />
    <el-drawer
      :visible.sync="showSettings"
      :with-header="true"
      :size="'45%'"
    >
      <span
        slot="title"
      >
        <p style="text-align: center;margin: 0px;font-size: large;">
          <b>
            {{ $t('page.settings.pageStyleSettings') }}
          </b>
        </p>
      </span>
      <settings />
    </el-drawer>
  </span>
</template>
<script>
import {
  defineComponent,
  ref
} from '@vue/composition-api'

// Components and Mixins
import Settings from '@/components/ADempiere/PageStyleSettings/Settings'

export default defineComponent({
  name: 'PageStyleSettings',
  components: {
    Settings
  },
  setup() {
    // Ref

    const showSettings = ref(false)

    return {
      showSettings
    }
  }
})
</script>
