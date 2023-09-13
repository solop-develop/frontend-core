<template>
  <el-form>
    <label> <b> {{ $t('route.role') }} </b> </label>
    <el-select
      v-model="currentRoleId"
      :filterable="isFiltrable"
      value-key="key"
    >
      <el-option
        v-for="(role, key) in rolesList"
        :key="key"
        :label="role.name"
        :value="role.id"
        :disabled="isEmptyValue(role.uuid)"
      />
    </el-select>

    <label> <b> {{ $t('route.organization') }} </b> </label>
    <el-select
      v-model="currentOrganizationId"
      :filterable="isFiltrable"
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

    <label> <b> {{ $t('route.warehouse') }} </b> </label>
    <el-select
      v-model="currentWarehouseId"
      :filterable="isFiltrable"
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
  </el-form>
</template>

<script>
export default {
  name: 'RolesNavbar',

  computed: {
    currentRoleId: {
      get() {
        return this.$store.getters['user/getRole'].id
      },
      set(roleToSet) {
        this.changeRole(roleToSet)
      }
    },
    rolesList() {
      return this.$store.getters['user/getRoles']
    },
    currentOrganizationId: {
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
    currentRole() {
      return this.$store.getters['user/getRole']
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
    isFiltrable() {
      return this.$store.state.app.device !== 'mobile'
    }
  },

  created() {
    this.getLanguages()
  },

  methods: {
    changeRole(roleId) {
      this.$message({
        message: this.$t('notifications.loading'),
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRole', {
        roleId,
        organizationId: this.currentOrganizationId,
        warehouseId: this.warehouseId
      })
        .then(response => {
          if (this.$route.name !== 'Dashboard') {
            this.$router.push({
              path: '/'
            }, () => {})
          }
          // this.$store.dispatch('getDashboardListFromServer', {
          //   roleId: response.id,
          //   roleUuid: response.uuid
          // })
        })
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
    showOrganizationsList(isShow) {
      if (isShow && this.isEmptyValue(this.organizationsList)) {
        this.$store.dispatch('user/getOrganizationsListFromServer', this.currentRoleId)
      }
    },
    changeWarehouse(warehouseId) {
      this.$store.dispatch('user/changeWarehouse', {
        warehouseId
      })
    },
    showWarehouseList(isShow) {
      if (isShow && this.isEmptyValue(this.warehousesList)) {
        this.$store.dispatch('user/getWarehousesList', {
          organizationId: this.currentOrganizationId
        })
      }
    },
    getLanguages() {
      if (this.isEmptyValue(this.getLanguageList)) {
        this.$store.dispatch('getLanguagesFromServer')
      }
    }
  }
}
</script>

<style scoped>
label {
  font-weight: 400;
  display: block;
  margin-top: 5%;
}
</style>
