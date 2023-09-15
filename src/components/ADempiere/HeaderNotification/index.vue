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
  <el-badge
    :value="total"
    :hidden="total === 0"
    type="primary"
    class="item"
    style="vertical-align: baseline;"
  >
    <el-popover
      ref="badgeNotifications"
      placement="bottom"
      width="400"
      trigger="click"
    >
      <div class="badge-notifications-table">
        <el-table
          :data="processNotifications"
          :highlight-current-row="true"
          @cell-click="handleCurrentChange"
        >
          <el-table-column prop="name" :label="$t('navbar.badge.Notifications')" />
          <el-table-column prop="quantity" :align="'right'" :label="$t('form.pos.tableProduct.quantity')" width="100" />

          <!-- <el-table-column
            fixed="right"
            width="50"
          >
            <template slot="header">
              <el-button
                icon="el-icon-delete"
                type="text"
                @click.native.prevent="deleteAll()"
              />
            </template>

            <template slot-scope="scope">
              <el-button
                icon="el-icon-close"
                type="text"
                size="small"
                @click.native.prevent="deleteRow(scope.$index, processNotifications)"
              />
            </template>
          </el-table-column>

          <el-table-column
            width="50"
          >
            <template slot="header">
              <svg-icon icon-class="tree-table" />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color: black"
                @click="openProcess(scope.$index, getRecordNotification)"
              >
                <svg-icon icon-class="tree-table" />
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>

      <el-button
        slot="reference"
        type="text"
        icon="el-icon-bell"
        style="float: left;color: #000000;font-size: 121%;font-weight: 615!important;padding-top: 14px;"
      />
    </el-popover>
  </el-badge>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Utils and Helper Methods
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getToken } from '@/utils/auth'

export default defineComponent({
  name: 'HeaderNotification',

  setup() {
    const badgeNotifications = ref(null)
    // const show = ref(false)

    const processNotifications = computed({
      get() {
        return store.getters.getListNotifiications
      },
      set(value) {
        return value
      }
    })

    const total = computed({
      get() {
        let count = 0
        if (!isEmptyValue(processNotifications.value)) {
          processNotifications.value.forEach(element => {
            count += element.quantity
          })
        }
        return count
      },
      set(value) {
        return value
      }
    })

    // function close() {
    //   // this.$refs.badge && this.$refs.badge.blur()
    //   show.value = false
    // }

    function handleCurrentChange(notification) {
      if (notification.name === 'Solicitud' || notification.name === 'Request') {
        router.push({
          name: 'Issues'
        }, () => {})
        return
      }
      zoomIn({
        uuid: notification.action_uuid
      })
      badgeNotifications.value.showPopper = false
    }

    // function openProcess(index, rows) {
    //   router.push({
    //     name: '8e51c232-fb40-11e8-a479-7a0060f0aa01'
    //   }, () => {})
    //   deleteRow(index, processNotifications.value)
    // }

    // function deleteRow(index, rows) {
    //   rows.splice(index, 1)
    // }

    // function deleteAll() {
    //   // rows.splice(index, rows.lenght)
    //   processNotifications.value.splice(0)
    // }

    function listActivities() {
      total.value = 0
      store.dispatch('findNotifications')
        .finally(() => {
          setTimeout(() => {
            if (!isEmptyValue(getToken())) {
              listActivities()
            }
          }, 90000)
        })
    }

    // watch(show, (newValue, oldValue) => {
    //   if (newValue) {
    //     document.body.addEventListener('click', close)
    //   } else {
    //     document.body.removeEventListener('click', close)
    //   }
    // })

    listActivities()

    return {
      badgeNotifications,
      total,
      processNotifications,
      // methods
      handleCurrentChange
      // deleteAll,
      // openProcess
    }
  }
})
</script>

<style>
  .el-badge__content.is-fixed {
    position: absolute;
    top: 6px;
    right: 10px;
    -webkit-transform: translateY(-50%) translateX(100%);
    transform: translateY(-50%) translateX(100%);
  }
</style>
<style lang="scss">
.badge-notifications-table{
  .el-table tr {
    height: 35px;
  }
}
</style>
