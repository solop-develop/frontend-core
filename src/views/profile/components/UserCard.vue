<template>
  <el-card style="margin-bottom: 5px; padding: 0px;">
    <!-- <div slot="header" class="clearfix">
      <span>{{ $t('profile.aboutMe') }}</span>
    </div> -->

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          :image="avatarResize"
          :hoverable="true"
        >
          {{ currentRole.name }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">
          {{ currentRole.name }}
        </div>
        <br>

        <div class="user-role text-muted">
          <div class="user-header">
            {{ $t('profile.availableRoles') }}
          </div>
          <li v-for="(item, key) in rolesList" :key="key">
            {{ item.name | uppercaseFirst }}
          </li>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { getImagePath, buildLinkHref } from '@/utils/ADempiere/resource.js'
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
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

    avatarResize.value = require('@/image/ADempiere/avatar/no-avatar.png')

    async function loadImage() {
      const { image } = userInfo.value
      if (image) {
        avatarResize.value = await getImagePath({
          file: image,
          width: 200,
          height: 200
        })
      }
    }

    loadImage()

    return {
      // Ref
      avatarResize,
      // Computed
      currentRole,
      rolesList,
      userInfo,
      // Methods
      loadImage,
      getImagePath,
      buildLinkHref
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
