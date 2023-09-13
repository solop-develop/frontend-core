<template>
  <el-form>
    <el-form-item :label="$t('page.login.userName')">
      {{ userInfo }}
    </el-form-item>
    <el-form-item :label="$t('profile.currentRole')">
      {{ currentRole.name }}
    </el-form-item>

    <el-form-item :label="$t('profile.clientName')">
      {{ currentRole.client.name }}
    </el-form-item>

    <el-form-item :label="$t('profile.description')">
      {{ currentRole.description }}
    </el-form-item>

    <el-form-item :label="$t('profile.changeRole')">
      <el-select
        v-model="valueRol"
        :filterable="!isMobile"
        value-key="key"
        @change="handleChange"
      >
        <el-option
          v-for="(rol, key) in rolesList"
          :key="key"
          :label="rol.name"
          :value="rol.id"
          :disabled="isEmptyValue(rol.uuid)"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('route.organization')">
      <el-select
        v-model="currentOrganizationId"
        :filterable="!isMobile"
        value-key="key"
        @visible-change="showOrganizationsList"
      >
        <el-option
          v-for="(organization, key) in organizationsList"
          :key="key"
          :label="organization.name"
          :value="organization.id"
          :disabled="isEmptyValue(organization.uuid)"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('route.warehouse')">
      <el-select
        v-model="currentWarehouseId"
        :filterable="!isMobile"
        value-key="key"
        @visible-change="showWarehouseList"
      >
        <el-option
          v-for="(warehouse, key) in warehousesList"
          :key="key"
          :label="warehouse.name"
          :value="warehouse.id"
          :disabled="isEmptyValue(warehouse.uuid)"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('profile.changeLanguage')">
      <el-select
        v-model="currentLanguage"
        :filterable="true"
        value-key="key"
        :placeholder="$t('profile.changeLanguagePlaceholder')"
        @visible-change="loadLanguageList"
        @change="changeLanguage"
      >
        <el-option
          v-for="item in languagesList"
          :key="item.value"
          :label="item.languageName"
          :value="item.languageISO"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { getLanguage } from '@/lang'
import store from '@/store'
import router from '@/router'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'

export default {
  name: 'ProfileRole',

  data() {
    return {
      valueRol: '',
      options: [],
      currentLanguage: getLanguage()
    }
  },

  computed: {
    userInfo() {
      const name = this.$store.getters['user/userInfo'].name
      if (this.isEmptyValue(name)) {
        return ''
      }
      return name
    },
    currentRole() {
      return this.$store.getters['user/getRole']
    },
    rolesList() {
      return this.$store.getters['user/getRoles']
    },
    currentOrganizationI: {
      get() {
        const organization = this.$store.getters['user/getOrganization']
        if (organization) {
          return organization.id
        }
        return -1
      },
      set(organizationToSet) {
        this.changeOrganization(organizationToSet)
      }
    },
    organizationsList() {
      return this.$store.getters['user/getOrganizations']
    },
    currentWarehouseId: {
      get() {
        const warehouse = this.$store.getters['user/getWarehouse']
        if (warehouse) {
          return warehouse.id
        }
        return -1
      },
      set(warehouseToSet) {
        this.changeWarehouse(warehouseToSet)
      }
    },
    warehousesList() {
      return this.$store.getters['user/getWarehouses']
    },
    languagesList() {
      return this.$store.getters.getLanguagesList
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },

  watch: {
    'currentRole.id'(roleId) {
      this.valueRol = roleId
    }
  },

  created() {
    this.valueRol = this.currentRole.id
  },

  methods: {
    handleChange(valueSelected) {
      this.$message({
        message: this.$t('notifications.loading'),
        showClose: true,
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRole', {
        roleId: valueSelected,
        isCloseAllViews: false
      })
    },
    showOrganizationsList(isShow) {
      if (isShow && this.isEmptyValue(this.organizationsList)) {
        this.$store.dispatch('user/getOrganizationsListFromServer', this.currentRoleId)
      }
    },
    changeOrganization(organizationId) {
      this.$message({
        message: this.$t('notifications.loading'),
        showClose: true,
        iconClass: 'el-icon-loading'
      })
      this.$router.push({
        path: '/'
      }, () => {})
      this.$store.dispatch('user/changeOrganization', {
        organizationId
      })
    },
    showWarehouseList(isShow) {
      if (isShow && this.isEmptyValue(this.warehousesList)) {
        this.$store.dispatch('user/getWarehousesList', {
          organizationId: this.currentOrganizationId
        })
      }
    },
    changeWarehouse(warehouseId) {
      this.$store.dispatch('user/changeWarehouse', {
        warehouseId
      })
    },
    changeLanguage(languageValue) {
      this.currentLanguage = languageValue

      this.$i18n.locale = languageValue
      store.dispatch('app/setLanguage', languageValue)
        .then(response => {
          const currentRoute = router.app._route
          const { path } = currentRoute
          if (path !== '/login') {
            location.reload()
          }
          showMessage({
            message: 'Switch Language Success',
            type: 'success'
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    },
    loadLanguageList(open) {
      if (open) {
        this.getLanguages()
      }
    },
    getLanguages() {
      if (this.isEmptyValue(this.languagesList)) {
        this.$store.dispatch('getLanguagesFromServer')
      }
    }
  }
}
</script>
