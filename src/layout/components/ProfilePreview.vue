<template>
  <div class="user-profi">
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <el-image
          :src="imageURL"
          crossorigin="anonymous"
          fit="scale-down"
          class="circle-image"
        />
      </el-col>
    </el-row>
    <roles-navbar />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import RolesNavbar from '@/views/profile/components/RolesNavbar'

// Utils and Helper Methods
import { pathImageWindows } from '@/utils/ADempiere/resource'

// Constants
import { COLUMN_NAME, TABLE_NAME_USER } from '@/utils/ADempiere/constants/resoucer.ts'

export default defineComponent({
  name: 'ProfilePreview',

  components: {
    RolesNavbar
  },

  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          roles: ''
        }
      }
    },
    avatar: {
      type: String,
      default: ''
    },
    fits: {
      type: Array,
      default: () => ['fill', 'contain', 'cover', 'none', 'scale-down']
    }
  },
  setup() {
    const isLoaded = ref(false)
    // Computed
    const userInfo = computed(() => {
      return store.getters['user/userInfo']
    })

    // const userAvatar = computed(() => {
    //   return store.getters['user/getUserAvatar']
    // })

    const userName = computed(() => {
      if (userInfo.value) return userInfo.value.name
      return ''
    })

    const currentRole = computed(() => {
      return store.getters['user/getRole']
    })

    const userAvatar = computed(() => {
      return store.getters['user/getUserAvatar']
    })

    const clientId = computed(() => {
      return store.getters.getSessionContextClientId
    })

    const imageURL = computed(() => {
      return pathImageWindows({
        clientId: clientId.value,
        tableName: TABLE_NAME_USER,
        recordId: userInfo.value.id,
        columnName: COLUMN_NAME,
        resourceName: `${COLUMN_NAME}.png`
      })
    })

    const avatarResize = ref('')

    avatarResize.value = require('@/image/ADempiere/avatar/no-avatar.png')

    function handleClick() {
      router.push({
        name: 'Profile'
      }, () => {})
    }

    return {
      // Ref
      isLoaded,
      avatarResize,
      // Computed
      userInfo,
      clientId,
      imageURL,
      userName,
      userAvatar,
      currentRole,
      // Methods
      handleClick,
      pathImageWindows
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

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
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
<style>
.circle-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  cursor: default;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
