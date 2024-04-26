<template>
  <div class="user-profi">
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <el-image
          :src="userAvatar"
          fit="scale-down"
          class="circle-image"
        />
        <!-- <br>
        <el-button round style="margin-top: 3%;" @click="handleClick">
          <b>
            {{ userName }}
          </b>
        </el-button> -->
        <!-- <el-button
          round
          style="margin-top: 3%;"
        >
          <b>
            {{ currentRole.client.name }}
          </b>
        </el-button> -->
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

// Constants
import { config } from '@/utils/ADempiere/config'

// Utils and Helper Methods
// import { getImagePath } from '@/utils/ADempiere/resource.js'
import { requestListResources } from '@/api/ADempiere/file-management/resource-reference.ts'
import { isEmptyValue } from '@/utils/ADempiere'

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

    const avatarResize = ref('')

    avatarResize.value = require('@/image/ADempiere/avatar/no-avatar.png')

    async function loadImage() {
      // const { image } = userInfo.value
      if (userInfo.value.image) {
        // const blobImage = await getImagePath({
        //   file: image,
        //   width: 200,
        //   height: 200
        // })
        // avatarResize.value = blobImage.href
        const clientId = store.getters.getSessionContextClientId
        // const { table_name } = this.currentTab
        requestListResources({
          clientId: clientId,
          containerId: 108,
          containerType: 'window',
          columnName: 'logo_id',
          recordId: userInfo.value.id,
          tableName: 'AD_User'
        })
          .then(response => {
            const { resources } = response
            if (isEmptyValue(resources)) {
              avatarResize.value = require('@/image/ADempiere/avatar/no-avatar.png')
              return
            }
            const image = response.resources[0].name
            avatarResize.value = config.adempiere.resource.url + image
            return config.adempiere.resource.url + image
          })
        return avatarResize.value
      }
    }

    function handleClick() {
      router.push({
        name: 'Profile'
      }, () => {})
    }

    loadImage()

    return {
      // Ref
      avatarResize,
      // Computed
      userInfo,
      userName,
      userAvatar,
      currentRole,
      // Methods
      handleClick,
      loadImage
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
