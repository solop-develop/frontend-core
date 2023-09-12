<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-row :gutter="20" class="panel-group">
    <el-col
      v-for="taks in mainTaks"
      :key="taks.id"
      :xs="12"
      :sm="12"
      :lg="spanSize"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleClick(taks)">
        <div
          :class="taks.classCard"
          style="text-align: center;"
        >
          <el-badge
            v-if="isMobile"
            :value="taks.recordCount"
            type="primary"
            class="item"
          >
            <i
              v-if="taks.svg.type === 'i'"
              :class="taks.svg.class"
              style="font-size: 65px"
            />
            <svg-icon
              v-else
              :icon-class="taks.svg.class"
              class-name="card-panel-icon"
              style="margin: 0px !important;"
            />
          </el-badge>
          <span v-else>
            <i
              v-if="taks.svg.type === 'i'"
              :class="taks.svg.class"
              style="font-size: 65px"
            />
            <svg-icon
              v-else
              :icon-class="taks.svg.class"
              class-name="card-panel-icon"
            />
          </span>
          <p
            v-if="isMobile"
            style="margin: 0px;"
          >
            {{ taks.name }}
          </p>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ taks.name }}
          </div>
          <count-to
            :start-val="0"
            :end-val="taks.recordCount"
            :duration="2600"
            class="card-panel-num"
            style="float: right;"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import CountTo from 'vue-count-to'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import store from '@/store'
import { setIconsTableName } from '@/utils/ADempiere'

export default defineComponent({
  components: {
    CountTo
  },
  setup(props) {
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const spanSize = computed(() => {
      const quantity = mainTaks.value.length
      if (quantity === 1) return 24
      if (quantity === 2) return 12
      if (quantity === 3) return 8
      return 6
    })

    const documentList = computed(() => {
      return store.getters.getListTaks.map(taks => {
        const { criteria } = taks
        return {
          ...taks,
          svg: setIconsTableName(criteria)
        }
      })
    })

    const mainTaks = computed(() => {
      const list = documentList.value.splice(0, 4)
      return list.map((currentValue, index, array) => {
        let classCard = 'card-panel-icon-wrapper icon-people'
        switch (index) {
          case 1:
            classCard = 'card-panel-icon-wrapper icon-message'
            break
          case 2:
            classCard = 'card-panel-icon-wrapper icon-money'
            break
          case 3:
            classCard = 'card-panel-icon-wrapper icon-shopping'
            break
        }
        return {
          ...currentValue,
          classCard
        }
      })
    })

    function loadPendingDocuments() {
      store.dispatch('listPendingDocuments')
    }

    function handleClick(taks) {
      let tabParent
      if (taks.action === 'window') {
        tabParent = 0
      }

      zoomIn({
        uuid: taks.windowUuid,
        params: {
          ...taks.criteria
        },
        query: {
          tabParent,
          action: 'criteria'
        }
      })
    }

    loadPendingDocuments()

    return {
      // Computed
      mainTaks,
      isMobile,
      spanSize,
      documentList,
      // Methods
      handleClick,
      loadPendingDocuments
    }
  }
})
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 5px 0px 5px 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 60px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 15px;
      margin-left: 0px;
      width: 100%;
      margin-right: 10px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        text-align: end;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
