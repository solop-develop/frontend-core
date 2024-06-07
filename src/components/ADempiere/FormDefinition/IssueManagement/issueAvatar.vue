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
  <span>
    <svg-icon
      v-if="isEmptyValue(user.avatar)"
      icon-class="user"
    />

    <el-image
      v-else
      :src="imageURL"
      fit="contain"
      style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        cursor: default;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      "
    />

    <b>
      {{ user.name }}
    </b>
  </span>
</template>

<script>
import {
  defineComponent, computed, onMounted, ref
} from '@vue/composition-api'
import store from '@/store'

// Utils and Helper Methods
import { pathImageWindows } from '@/utils/ADempiere/resource.js'
// Constants
import { COLUMN_NAME, TABLE_NAME_USER } from '@/utils/ADempiere/constants/resoucer.ts'

export default defineComponent({
  name: 'IssueAvatar',

  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },

  setup(props) {
    const avatarSrc = ref('')

    const imageDefault = computed(() => {
      return require('@/image/ADempiere/avatar/no-avatar.png')
    })

    const clientId = computed(() => {
      return store.getters.getSessionContextClientId
    })

    const imageURL = computed(() => {
      return pathImageWindows({
        clientId: clientId.value,
        tableName: TABLE_NAME_USER,
        recordId: props.user.id,
        columnName: COLUMN_NAME,
        resourceName: `${COLUMN_NAME}.png`
      })
    })

    onMounted(() => {
      avatarSrc.value = imageDefault.value
    })

    return {
      avatarSrc,
      clientId,
      imageURL
    }
  }
})
</script>
