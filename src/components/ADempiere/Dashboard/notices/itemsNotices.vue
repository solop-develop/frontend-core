<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Leonel Matos lmatos@erpya.com
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
  <div>
    <el-descriptions
      direction="horizontal"
      :column="1"
    >
      <el-descriptions-item>
        <span style="margin-left: 0px; margin-bottom: 10px; font-weight: 700; font-size: medium;">
          {{ metadata.reference }}
        </span>
        <el-button type="success" plain style="margin-left: auto;">{{ $t('window.containerInfo.notices.read') }}</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <svg-icon
          :icon-class="metadata.user.avatar ? metadata.user.avatar : 'user'"
          class="icon-window"
          style="font-size: 16px;"
        />
        <span style="margin-left:20px; margin-bottom:10px; font-weight: 600">
          {{ metadata.user.name }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item>
        <span style="margin-left:42px; margin-bottom:10px; font-weight: 600" v-html="metadata.text_message" />
      </el-descriptions-item>
      <el-descriptions-item>
        <span style="margin-left:10px; padding-bottom:10px">
          {{ diffInDays }}
        </span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'
// Utils and Helper Methods
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'noticeManagement',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const diffInDays = computed(() => {
      const dateCreated = new Date(props.metadata.created).getTime()
      const newDate = new Date().getTime()
      const diff = newDate - dateCreated
      const integerDiff = Math.floor(diff / (1000 * 60 * 60 * 24))
      return integerDiff + ' Days ago'
    })

    return {
      diffInDays,
      translateDate
    }
  }
})
</script>

<style scoped>
  .el-table {
    background-color: #FFFFFF;
  }
  .search_recent {
    width: 50% !important;
    float: right;
  }
  .header {
    padding-bottom: 10px;
  }
  .recent-items {
    height: 455px;
    overflow: auto;
  }
  .time {
    float: left;
    font-size: 11px;
    color: #999;
  }
  .card-box {
    cursor: pointer;
  }
  .card-content {
    font-size: 15px;
  }
  .icon-window {
    font-size: large;
    color: #36a3f7;
    margin-left: 5px;
    margin-top:2px
  }
  .action-tag {
    float: right;
  }
</style>
<style>
.el-descriptions-item__label.has-colon::after {
  content: "";
}
</style>
