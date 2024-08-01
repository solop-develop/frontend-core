<template>
  <el-card style="margin-bottom: 5px; padding: 0px;">
    <div class="user-profile">
      <el-row>
        <el-col :span="12">
          <div class="box-center">
            <pan-thumb
              :image="imageUrl"
              :hoverable="true"
            >
              {{ currentRole.name }}
            </pan-thumb>
          </div>
          <div class="box-center">
            <div class="user-name text-center">
              {{ currentRole.name }}
            </div>
          </div>
          <!-- <br> -->
        </el-col>
        <el-col :span="12">
          <div class="user-role text-muted">
            <div class="user-header">
              {{ $t('profile.availableRoles') }}
            </div>
            <li v-for="(item, key) in rolesList" :key="key">
              {{ item.name | uppercaseFirst }}
            </li>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'
// Components and Mixins
import PanThumb from '@/components/PanThumb'

// Constants
import { COLUMN_NAME, TABLE_NAME_USER } from '@/utils/ADempiere/constants/resoucer.ts'

// // Utils and Helper Methods
import { pathImageWindows } from '@/utils/ADempiere/resource.js'

export default defineComponent({
  components: {
    PanThumb
  },

  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },

  setup() {
    const currentRole = computed(() => {
      return store.getters['user/getRole']
    })

    const rolesList = computed(() => {
      return store.getters['user/getRoles']
    })

    const userInfo = computed(() => {
      return store.getters['user/userInfo']
    })

    const avatarResize = ref('')

    const userAvatar = computed(() => {
      return store.getters['user/getUserAvatar']
    })

    const clientId = computed(() => {
      const { client } = store.getters['user/getRole']
      return client.uuid
    })

    const imageUrl = computed(() => {
      return pathImageWindows({
        clientId: clientId.value,
        tableName: TABLE_NAME_USER,
        recordId: userInfo.value.id,
        columnName: COLUMN_NAME,
        resourceName: `${COLUMN_NAME}.png`
      })
    })

    avatarResize.value = require('@/image/ADempiere/avatar/no-avatar.png')

    return {
      // Ref
      userAvatar,
      avatarResize,
      // Computed
      currentRole,
      rolesList,
      clientId,
      userInfo,
      imageUrl
    }
  }
})
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }
  .el-card {
    .el-card__body {
      padding: 0px !important;
    }
  }

  .box-center {
    padding-bottom: 5px;
  }

  .user-role {
    padding-top: 1px;
    font-weight: 400;
    font-size: 14px;
    .user-header {
      border-bottom: 1px solid #dfe6ec;
      font-weight: bold;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
